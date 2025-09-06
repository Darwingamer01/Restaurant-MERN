// apps/backend/src/routes/auth.ts

import express from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { z } from "zod";

const router = express.Router();

// -----------------------------
// Cookie Helpers
// -----------------------------
function setRefreshTokenCookie(res: express.Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

function clearRefreshTokenCookie(res: express.Response) {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 0,
    path: "/",
  });
}

// -----------------------------
// Validation Schemas
// -----------------------------
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// -----------------------------
// Register
// -----------------------------
router.post("/register", async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await UserModel.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = new UserModel(validatedData);
    await user.save();

    const { accessToken, refreshToken } = await user.generateAuthTokens();

    // Persist refresh token atomically (push & keep last 5)
    await UserModel.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: { $each: [refreshToken], $slice: -5 } },
    }).exec();

    setRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Failed to register user" });
  }
});

// -----------------------------
// Login
// -----------------------------
router.post("/login", async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await UserModel.findOne({ email: validatedData.email });
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await user.generateAuthTokens();

    // Persist refresh token atomically
    await UserModel.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: { $each: [refreshToken], $slice: -5 } },
    }).exec();

    setRefreshTokenCookie(res, refreshToken);

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Failed to login" });
  }
});

// -----------------------------
// Refresh Token - FIXED VERSION
// -----------------------------
router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Refresh token required" });
    }

    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT secret not configured");

    // Verify token (catch verify errors)
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, secret) as any;
    } catch (err) {
      console.error("Refresh verify failed:", err);
      return res.status(401).json({ success: false, message: "Invalid refresh token (verify failed)" });
    }

    const user = await UserModel.findById(decoded.userId).exec();
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Invalid refresh token (no user)" });
    }

    // Ensure token is one we have stored
    const found = user.refreshTokens && user.refreshTokens.includes(refreshToken);
    if (!found) {
      return res.status(401).json({ success: false, message: "Invalid refresh token (not recognized)" });
    }

    // Generate new pair
    const { accessToken, refreshToken: newRefreshToken } = await user.generateAuthTokens();

    // ✅ FIX: Split the conflicting update into TWO separate operations
    // Step 1: Remove old token
    await UserModel.findByIdAndUpdate(user._id, {
      $pull: { refreshTokens: refreshToken },
    }).exec();

    // Step 2: Add new token (keep last 5)
    await UserModel.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: { $each: [newRefreshToken], $slice: -5 } },
    }).exec();

    setRefreshTokenCookie(res, newRefreshToken);

    return res.json({
      success: true,
      message: "Token refreshed successfully",
      data: { accessToken },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
});

// -----------------------------
// Logout
// -----------------------------
router.post("/logout", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken && req.user) {
      await UserModel.findByIdAndUpdate(req.user._id, {
        $pull: { refreshTokens: refreshToken },
      }).exec();
    }

    clearRefreshTokenCookie(res);
    return res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Failed to logout" });
  }
});

// -----------------------------
// Current User
// -----------------------------
router.get("/me", authenticateToken, async (req: AuthRequest, res) => {
  try {
    return res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          email: req.user.email,
          name: req.user.name,
          phone: req.user.phone,
          role: req.user.role,
          createdAt: req.user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ success: false, message: "Failed to get user data" });
  }
});

export default router;

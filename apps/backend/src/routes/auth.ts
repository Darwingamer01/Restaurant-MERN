import express from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { z } from "zod";

const router = express.Router();

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

    // Check if user exists
    const existingUser = await UserModel.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create user
    const user = new UserModel(validatedData);
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = await user.generateAuthTokens();

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
    return res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
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
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const { accessToken, refreshToken } = await user.generateAuthTokens();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
});

// -----------------------------
// Refresh Token
// -----------------------------
router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT secret not configured");

    const decoded = jwt.verify(refreshToken, secret) as any;

    const user = await UserModel.findById(decoded.userId);
    if (!user || !user.isActive || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Rotate refresh token
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    const { accessToken, refreshToken: newRefreshToken } =
      await user.generateAuthTokens();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Token refreshed successfully",
      data: { accessToken },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
});

// -----------------------------
// Logout
// -----------------------------
// -----------------------------
// Logout
// -----------------------------
router.post("/logout", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken && req.user) {
      const user = await UserModel.findById(req.user._id);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
        await user.save();
      }
    }

    // Force Max-Age=0 so the test assertion passes
    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // <--- key change
    });

    return res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
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
    return res.status(500).json({
      success: false,
      message: "Failed to get user data",
    });
  }
});

export default router;

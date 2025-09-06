// apps/backend/src/models/User.ts
import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: "customer" | "admin";
  isActive: boolean;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthTokens(): Promise<{ accessToken: string; refreshToken: string }>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-()]+$/, "Please enter a valid phone number"],
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshTokens: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ role: 1 });

// Remove sensitive fields
userSchema.methods.toJSON = function () {
  const ret = this.toObject();
  delete (ret as any).password;
  delete (ret as any).refreshTokens;
  delete (ret as any).__v;
  return ret;
};

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    (this as any).password = await bcrypt.hash((this as any).password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate tokens (IMPORTANT: do NOT persist here to avoid race conditions).
// Caller should persist the refresh token atomically (using $push/$pull).
userSchema.methods.generateAuthTokens = async function (): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets not configured");
  }

  const accessToken = jwt.sign(
    { userId: this._id.toString(), email: this.email, role: this.role },
    process.env.JWT_SECRET,
    // In dev long expiry helps testing; in prod short expiry recommended
    { expiresIn: process.env.NODE_ENV === "development" ? "12h" : "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: this._id.toString() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  // DO NOT modify or save the document here to avoid concurrent save conflicts.
  return { accessToken, refreshToken };
};

export const UserModel = mongoose.model<IUser>("User", userSchema);

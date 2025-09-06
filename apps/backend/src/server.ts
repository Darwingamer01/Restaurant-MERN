// server.ts
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import dotenv from "dotenv-flow";

// Import routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import dishRoutes from "./routes/dishes";
import reservationRoutes from "./routes/reservations";
import orderRoutes from "./routes/orders";
import couponRoutes from "./routes/coupons";
import reviewRoutes from "./routes/reviews";

dotenv.config();

// --- ENV CHECK ---
const requiredEnvs = ["MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];
for (const key of requiredEnvs) {
  if (!process.env[key]) {
    console.error(`❌ MISSING ENV: ${key}`);
  } else {
    console.log(`✅ ${key}: LOADED`);
  }
}

console.log("🚀 Starting backend server...");
console.log("🔍 DEBUG MONGO_URI:", process.env.MONGO_URI ? "LOADED ✅" : "MISSING ❌");
console.log("🔍 DEBUG JWT_SECRET:", process.env.JWT_SECRET ? "LOADED ✅" : "MISSING ❌");

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS (must be FIRST) ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://your-domain.vercel.app",
];

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.options("*", cors(corsOptions)); // handle preflight early

// --- HELMET (after CORS, disable CSP in dev) ---
app.use(
  helmet({
    contentSecurityPolicy: false, // disable CSP to avoid conflicts in dev
  })
);

// --- RATE LIMITING ---
if (process.env.NODE_ENV !== "test") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests, try again later." },
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === "development" ? 1000 : 5,
    message: { success: false, message: "Too many auth attempts, try again later." },
  });

  app.use("/api/", limiter);
  app.use("/api/v1/auth/", authLimiter);
}

// --- BODY PARSERS ---
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// --- COMPRESSION ---
app.use(compression());

// --- ROUTES ---
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/dishes", dishRoutes);
app.use("/api/v1/reservations", reservationRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/reviews", reviewRoutes);

// --- HEALTH CHECK ---
app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "Restaurant MERN API is running!",
    data: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    },
  });
});

// --- ERROR HANDLER ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// --- 404 ---
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// --- DB CONNECT ---
export const connectDB = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI required");
  await mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  console.log("✅ MongoDB connected");
};

// --- START SERVER ---
if (process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🏥 Health check: http://localhost:${PORT}/api/v1/health`);
        console.log("📚 Environment:", process.env.NODE_ENV || "development");
      });
    })
    .catch((err) => {
      console.error("❌ Failed to start server:", err);
      process.exit(1);
    });
}

export default app;

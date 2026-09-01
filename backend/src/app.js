import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import guestRoutes from "./modules/guest/guest.routes.js";
import orderRoutes from "./modules/order/order.routes.js";
import menuRoutes from "./modules/menu/menu.routes.js";
import cookieParser from "cookie-parser";

const app = express();

// CORS — allow Vite dev server & production frontend
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://10.126.72.80:5173",
    "http://10.126.72.80:5174",
  ];
  
  // Add production frontend URL from environment variable if it exists
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (origin) {
    // Optional: Allow all if testing, or be strict. For Render/Vercel setup, it's safer to just reflect the origin if we want to be flexible, but let's stick to allowed origins.
    // For now, if no match, we don't set the header. 
  }
  
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,x-guest-token");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Ping endpoint for 15 min keep-alive
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/guests", guestRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/menu", menuRoutes);

// Global error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal server error";
  res.status(status).json({ success: false, message });
});

export default app;

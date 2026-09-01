import { Router } from "express";
import * as controller from "./order.controller.js";
import { authenticate, authorize } from "../auth/auth.middleware.js";
import { authenticateGuest } from "../../common/middleware/guestAuth.middleware.js";

const router = Router();

// ── Guest Routes (x-guest-token header) ─────────────────────────────────────
router.post("/", authenticateGuest, controller.createOrder);
router.get("/table/:tableNumber", authenticateGuest, controller.getOrdersByTable);

// ── Admin Routes (JWT bearer token) ─────────────────────────────────────────
router.get("/", authenticate, authorize("admin"), controller.getAllOrders);
router.get("/:orderId", authenticate, authorize("admin"), controller.getOrderById);
router.patch("/:orderId/status", authenticate, authorize("admin"), controller.updateOrderStatus);

export default router;

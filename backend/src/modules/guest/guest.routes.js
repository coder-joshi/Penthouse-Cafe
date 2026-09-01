import { Router } from "express";
import * as controller from "./guest.controller.js";
import { authenticate, authorize } from "../auth/auth.middleware.js";

const router = Router();

// Public — guests register themselves (no auth needed)
router.post("/register", controller.registerGuest);

// Admin-only — list all guests for marketing / analytics
router.get("/", authenticate, authorize("admin"), controller.getAllGuests);

export default router;

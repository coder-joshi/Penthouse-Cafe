import { Router } from "express";
import * as controller from "./menu.controller.js";
import { authenticate, authorize } from "../auth/auth.middleware.js";

const router = Router();

// Public — guests/anyone can read the menu
router.get("/", controller.getAllMenuItems);
router.get("/:id", controller.getMenuItemById);

// Admin-only mutations
router.post("/", authenticate, authorize("admin"), controller.createMenuItem);
router.put("/:id", authenticate, authorize("admin"), controller.updateMenuItem);
router.delete("/:id", authenticate, authorize("admin"), controller.deleteMenuItem);
router.patch("/:id/toggle", authenticate, authorize("admin"), controller.toggleAvailability);

export default router;

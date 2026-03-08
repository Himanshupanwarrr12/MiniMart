import express from "express";
import {
  getDashboard,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/adminController.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.use(authenticateToken);
adminRouter.use(isAdmin);

adminRouter.get("/admin/dashboard", getDashboard);

adminRouter.get("/admin/orders", getAllOrders);
adminRouter.put("/admin/orders/:id/status", updateOrderStatus);

export default adminRouter;
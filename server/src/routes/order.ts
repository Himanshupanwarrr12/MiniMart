import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderDetails,
  cancelOrder,
} from "../controllers/orderController.js";
import { authenticateToken } from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.use(authenticateToken);

orderRouter.post("/orders/create", createOrder);
orderRouter.get("/orders", getAllOrders);
orderRouter.get("/orders/:id", getOrderDetails);
orderRouter.put("/orders/:id/cancel", cancelOrder);

export default orderRouter;
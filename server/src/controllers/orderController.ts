import type { Request, Response } from "express";
import * as orderService from "../services/orderService.js";
import type { User } from "../generated/prisma/client.js";

export interface AuthRequest extends Request {
  user?: User;
}

export const createOrder = async (req: AuthRequest,res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const { addressId } = req.body;

    if (!addressId) {
      res.status(400).json({
        success: false,
        error: "Address ID is required",
      });
      return;
    }

    const addressIdNum = Number(addressId);

    if (isNaN(addressIdNum) || addressIdNum < 1) {
      res.status(400).json({
        success: false,
        error: "Invalid address ID",
      });
      return;
    }

    const order = await orderService.createOrderFromCart(req.user.id, addressIdNum);

    if (!order) {
      res.status(500).json({
        success: false,
        error: "Failed to create order",
      });
      return;
    }

    await orderService.updateOrderStatus(order.id, "PAID");

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: {
        orderId: order.id,
        status: "PAID",
        total: order.summary.total,
        estimatedDelivery: order.estimatedDelivery,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getAllOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const orders = await orderService.getUserOrders(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        orders,
        totalOrders: orders.length,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getOrderDetails = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const orderId = Number(req.params.id);

    if (isNaN(orderId) || orderId < 1) {
      res.status(400).json({
        success: false,
        error: "Invalid order ID",
      });
      return;
    }

    const order = await orderService.getOrderById(req.user.id, orderId);

    if (!order) {
      res.status(404).json({
        success: false,
        error: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const cancelOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const orderId = Number(req.params.id);

    if (isNaN(orderId) || orderId < 1) {
      res.status(400).json({
        success: false,
        error: "Invalid order ID",
      });
      return;
    }

    const order = await orderService.cancelOrder(req.user.id, orderId);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
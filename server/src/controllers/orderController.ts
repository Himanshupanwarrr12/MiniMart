import type { Request, Response } from "express";
import * as orderService from "../services/orderService.js";

export const createOrder = async (
  req: Request,
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

    const order = await orderService.createOrderFromCart(req.user.id);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
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
  req: Request,
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
  req: Request,
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
  req: Request,
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

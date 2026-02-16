import type { Request, Response } from "express";
import * as adminService from "../services/adminService.js";

export const getDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await adminService.getDashboardStats();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
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
    const { status, search } = req.query;

    const orders = await adminService.getAllOrdersForAdmin({
      status: status as string,
      search: search as string,
    });

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

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    if (isNaN(orderId) || orderId < 1) {
      res.status(400).json({
        success: false,
        error: "Invalid order ID",
      });
      return;
    }

    if (!status) {
      res.status(400).json({
        success: false,
        error: "Status is required",
      });
      return;
    }

    const order = await adminService.updateOrderStatus(orderId, status);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

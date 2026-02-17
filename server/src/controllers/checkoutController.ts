import type { Request, Response } from "express";
import * as checkoutService from "../services/checkoutService.js";

export const getCheckoutReview = async (
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

    const { addressId } = req.query;

    if (!addressId) {
      res.status(400).json({
        success: false,
        error: "Address ID is required",
      });
      return;
    }

    const addressIdNum = parseInt(addressId as string);

    if (isNaN(addressIdNum)) {
      res.status(400).json({
        success: false,
        error: "Invalid address ID",
      });
      return;
    }

    const reviewData = await checkoutService.getCheckoutReview(
      req.user.id,
      addressIdNum
    );

    res.status(200).json({
      success: true,
      data: reviewData,
    });
  } catch (error) {
    console.error("Error fetching checkout review:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

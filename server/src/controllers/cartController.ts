import type { User } from "../generated/prisma/client.js";
import type { Request, Response } from "express";
import * as cartService from "../services/cartService.js";
export interface AuthRequest extends Request {
  user?: User;
}

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const result = await cartService.getOrCreateCart(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        items: result.cart.items,
        summary: result.summary,
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      res.status(400).json({
        success: false,
        error: "Product ID is required",
      });
      return;
    }

    if (quantity < 1) {
      res.status(400).json({
        success: false,
        error: "Quantity must be at least 1",
      });
      return;
    }

    const cartItem = await cartService.addItemToCart(
      req.user.id,
      parseInt(productId),
      parseInt(quantity),
    );

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cartItem,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const updateCartItem = async ( req: AuthRequest,res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const itemId = Number(req.params.itemId);

    if (isNaN(itemId) || itemId < 1) {
      res.status(400).json({
        success: false,
        error: "Invalid item ID",
      });
      return;
    }

    const qty = Number(req.body.quantity);

    if (isNaN(qty) || qty < 1) {
      res.status(400).json({
        success: false,
        error: "Valid quantity is required",
      });
      return;
    }

    const cartItem = await cartService.updateCartItemQuantity(
      req.user.id,
      itemId,
      qty,
    );

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: cartItem,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }
    const itemId = Number(req.params.itemId);
    if (isNaN(itemId) || itemId < 1) {
      res.status(400).json({
        success: false,
        error: "Invalid item ID",
      });
      return;
    }

    await cartService.removeCartItem(req.user.id, itemId);

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

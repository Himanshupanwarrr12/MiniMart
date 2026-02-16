import express from "express";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cartController.js";
import { authenticateToken } from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.use(authenticateToken);

cartRouter.get("/cart", getCart);
cartRouter.post("/cart/add", addToCart);
cartRouter.put("/cart/update/:itemId", updateCartItem);
cartRouter.delete("/cart/remove/:itemId", removeFromCart);

export default cartRouter;

import express from "express";
import { getCheckoutReview } from "../controllers/checkoutController.js";
import { authenticateToken } from "../middleware/auth.js";

const checkoutRouter = express.Router();

checkoutRouter.use(authenticateToken);

checkoutRouter.get("/checkout/review", getCheckoutReview);

export default checkoutRouter;

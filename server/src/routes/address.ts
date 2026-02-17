import express from "express";
import {
  getUserAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";
import { authenticateToken } from "../middleware/auth.js";

const addressRouter = express.Router();

addressRouter.use(authenticateToken);

addressRouter.get("/addresses", getUserAddresses);
addressRouter.get("/addresses/:id", getAddress);
addressRouter.post("/addresses", createAddress);
addressRouter.put("/addresses/:id", updateAddress);
addressRouter.delete("/addresses/:id", deleteAddress);
addressRouter.put("/addresses/:id/default", setDefaultAddress);

export default addressRouter;

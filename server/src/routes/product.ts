import express from "express"
import { products } from "../controllers/productController.js"
const profileRouter = express.Router()

profileRouter.get("/products",products)
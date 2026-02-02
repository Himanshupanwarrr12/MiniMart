import express from "express"
import { products } from "../controllers/product.js"
const profileRouter = express.Router()

profileRouter.get("/products",products)
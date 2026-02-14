import express from "express"
import { createProduct, getAllProducts } from "../controllers/productController.js"
import { authenticateToken, isAdmin } from "../middleware/auth.js"
const productRouter = express.Router()

productRouter.get("/products",getAllProducts)
productRouter.post("/admin/products",authenticateToken,isAdmin,createProduct)

export default productRouter
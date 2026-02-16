import express from "express"
import { createProduct, getAllProducts, getProductDetails } from "../controllers/productController.js"
import { authenticateToken, isAdmin } from "../middleware/auth.js"
const productRouter = express.Router()

productRouter.get("/products",getAllProducts)
productRouter.get("/products/:id",getProductDetails)
productRouter.post("/admin/products",authenticateToken,isAdmin,createProduct)

export default productRouter
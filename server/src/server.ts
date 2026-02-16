import express from "express"
const app = express()
import cookieParser from "cookie-parser"
import { Request,Response } from "express";
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

//api routes
import authRouter from "./routes/auth.js";
import productRouter from "./routes/product.js";
import cartRouter from "./routes/cart.js";

app.use("/",authRouter)
app.use("/",productRouter)
app.use("/",cartRouter)

app.get("/",(req:Request,res:Response)=>{
    res.send("Express server is running")
})

const PORT= process.env.PORT || "5000"

app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`)
})
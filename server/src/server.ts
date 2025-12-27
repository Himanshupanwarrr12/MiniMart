import express from "express"
const app = express()
import cookieParser from "cookie-parser"
import { Request,Response } from "express";
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const port = process.env.PORT || "5000"

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.get("/",(req:Request,res:Response)=>{
    res.send("Express server is running")
})

app.listen(port,()=>{
    console.log(`server is listening on port ${port}`)
})
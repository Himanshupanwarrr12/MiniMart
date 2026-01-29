import express from "express"
const authRouter = express.Router()
import { signUp } from "../controllers/auth.js"

authRouter.post("/signup",signUp)
// authRouter.post("/login",)

export default authRouter
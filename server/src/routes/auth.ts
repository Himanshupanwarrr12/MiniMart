import express from "express"
const authRouter = express.Router()
import { signUp,login } from "../controllers/auth.js"

authRouter.post("/signup",signUp)
authRouter.post("/login",login)

export default authRouter
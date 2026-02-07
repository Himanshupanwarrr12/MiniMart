import express from "express"
const authRouter = express.Router()
import { signUp,login,logout } from "../controllers/auth.js"

authRouter.post("/signup",signUp)
authRouter.post("/login",login)
authRouter.post("/logout",logout)

export default authRouter
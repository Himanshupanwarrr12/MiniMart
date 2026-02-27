import express from "express"
import { authenticateToken } from "../middleware/auth.js"

const profileRouter = express.Router()

profileRouter.get("/profile",authenticateToken,)

export default profileRouter
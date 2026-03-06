import express from "express"
import { authenticateToken } from "../middleware/auth.js"
import { getProfile } from "../controllers/profileController.js"

const profileRouter = express.Router()

profileRouter.get("/profile",authenticateToken,getProfile)

export default profileRouter
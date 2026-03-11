import type { User } from "../generated/prisma/client.js";
import { Request, Response} from "express";
import * as profileService from "../services/profileService.js";

export interface AuthRequest extends Request {
  user?: User;
}

export const getProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const profile = await profileService.getUserProfile(req.user.id);
    // console.log("Profile : ",profile)

    if (!profile) {
      res.status(404).json({
        success: false,
        error: "Profile not found",
      });
      return;
    }
    res.status(200).json({
  success: true,
  data: profile,
});
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

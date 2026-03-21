import type { User } from "../generated/prisma/client.js";
import { Request, Response} from "express";
import * as profileService from "../services/profileService.js";

export interface AuthRequest extends Request {
  user?: User;
}

export const getProfile = async (req: AuthRequest,res: Response,): Promise<void> => {
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

export const updateProfile = async (req:AuthRequest,res:Response) : Promise<void>=>{

  try {
    if(!req.user){
      res.status(401).json({
        success:false,
        error: "User not authenticated"
      })
      return
    }

    const {firstName,lastName,email} = req.body;

    if (!firstName && !lastName && !email) {
      res.status(400).json({
        success: false,
        error: "At least one field (firstName, lastName, email) must be provided",
      });
      return;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          error: "Invalid email format",
        });
        return;
      }
    }

    if (firstName !== undefined && firstName.trim() === "") {
      res.status(400).json({
        success: false,
        error: "First name cannot be empty",
      });
      return;
    }

    const profile = await profileService.updateUserProfile(req.user.id ,{firstName,lastName,email})

    res.status(200).json({
      success:true,
      message:"Update profile successfully",
      data: profile,
    })
    
  } catch (error) {
     console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
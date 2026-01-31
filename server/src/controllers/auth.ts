import type { Request, Response } from "express";
import { validateSignUpData } from "../utils/validation.js";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

const genrateToken = (userId: number): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("SECRET KEY IS REQUIRED");
  }
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};

//signUp controller
export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    validateSignUpData(req.body)

    const { fullName, email, password } = req.body

    const nameParts = fullName
      .trim()
      .split(/\s+/)

    if (nameParts.length === 0) {
      res.status(400).json({
        success: false,
        error: "Invalid name format",
      });
      return;
    }
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || null;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      res.status(400).json({
        error: "User already exists with this email Id",
      });
      return;
    }

    const hashPass = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashPass,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    const token = genrateToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, //change in prod
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error: unknown) {
    console.log("Error in signUp");
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
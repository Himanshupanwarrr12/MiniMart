import type { Request, Response } from "express";

import jwt from "jsonwebtoken";
const genrateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("SECRET KEY IS REQUIRED");
  }
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};

//signUp controller
export const signUp = () => {
  try {
  } catch (error) {}
};

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

type Role = "USER" | "ADMIN";

interface JwtPayload {
  userId: number;
}

interface AuthRequest extends Request {
  user?: {
    id: number;
    firstName: string;
    lastName: string | null;
    email: string;
    role: "USER" | "ADMIN";
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({
        success: false,
        error: "Access token required",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({
        success: false,
        error: "Invalid token",
      });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(403).json({
        success: false,
        error: "Token expired",
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Authentication error",
    });
  }
};

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user || req.user.role !== "ADMIN") {
    res.status(403).json({
      success: false,
      error: "Access denied. Admin only.",
    });
    return;
  }
  next();
};

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export const signUp = async (
  fullName: string,
  email: string,
  password: string,
) => {
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);

  const [firstName, ...rest] = nameParts;

  if (!firstName) {
    throw new Error("Invalid name format");
  }

  const lastName = rest.join(" ") || null;
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({ 
    where: { email: normalizedEmail } 
  });
  
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashPass = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { 
      firstName, 
      lastName, 
      email: normalizedEmail, 
      password: hashPass 
    },
    select: { 
      id: true, 
      firstName: true, 
      lastName: true, 
      email: true 
    },
  });

  const token = jwt.sign(
    { userId: user.id }, 
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};
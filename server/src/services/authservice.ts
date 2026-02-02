import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {prisma} from "../lib/prisma.js"

export const signUp = async (
  fullName: string,
  email: string,
  password: string
) => {
  const nameParts = fullName.trim().split(/\s+/);

  if (nameParts.length === 0) {
    throw new Error("Invalid name format");
  }

  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || null;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashPass = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { firstName, lastName, email, password: hashPass },
    select: { id: true, firstName: true, lastName: true, email: true }
  });

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { user, token };
};

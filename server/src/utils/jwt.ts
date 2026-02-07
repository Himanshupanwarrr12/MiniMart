import jwt from "jsonwebtoken";

export function generateUserJWT(userId: number): string {
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new Error("JWT_SECRET Is Required!!");
  }

  return jwt.sign({ userId }, secretKey, { expiresIn: "7d" });
}

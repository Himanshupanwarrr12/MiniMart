import  jwt  from "jsonwebtoken";
import type {UserModel} from "../generated/prisma/models/User.js"

export function generateUserJWT(user: UserModel): string {
  const secretKey = process.env.JWT_SECRET;
  
  if (!secretKey) {
    throw new Error("JWT_SECRET Is Required!!");
  }
  
  return jwt.sign({ id: user.id }, secretKey, { expiresIn: "7d" });
}
import { prisma } from "../lib/prisma.js"

export const  getProfile = async (id:number) => {
return await prisma.user.findUnique({where: {id}})
}
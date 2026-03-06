import { prisma } from "../lib/prisma.js"

export const getUserProfile = async (userId : number)=>{
    return await prisma.user.findUnique({where: {id : userId},
    select:{
         id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }})
}
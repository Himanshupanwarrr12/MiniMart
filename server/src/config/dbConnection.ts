import { PrismaClient } from "../generated/prisma/client"

const prisma  = new PrismaClient()

export default prisma

const connectDb = async ()=>{
    try {
        await prisma.$connect()
        console.log("Db connect succesfully")
    } catch (error:unknown) {
        console.log(`Database connection error ${error}`)
        process.exit(1)
    }
}

const disconnectDb = async ()=>{
    await prisma.$disconnect();
}

export {prisma,connectDb,disconnectDb}
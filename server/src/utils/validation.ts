import type { Request } from "express";
import validator from "validator"
export function validateSignUpData(req:Request){
    const {email,password} = req.body
    if(!email || validator.isEmail(email)){
        throw new Error("Valid Email Is Required!")
    }
    if(!password || validator.isStrongPassword(password)){
        throw new Error ("Password Must Be Strong!")
    }
}
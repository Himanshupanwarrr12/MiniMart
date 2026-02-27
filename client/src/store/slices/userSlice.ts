import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IUser {
    id:number;
    firstName:string;
    lastName : string;
    email : string;
    role : string;
}

const initialState = null as IUser |null;

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        addUser : (_, action : PayloadAction<IUser>)=>{
            return action.payload
        },
        removeUser:()=>{
            return null
        }
    }
})

export const {addUser,removeUser} = userSlice.actions

export default userSlice.reducer
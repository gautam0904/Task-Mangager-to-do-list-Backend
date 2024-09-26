import mongoose from "mongoose";
import { MSG } from "../constant/message";

export const connectDb = async ()=>{
    await mongoose.connect(`${process.env.dburl}/${process.env.dbName}`)
    console.log(MSG.DBconnected);
}
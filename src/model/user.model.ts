import mongoose from "mongoose";
import { errMSG } from "../constant/message";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name :{
        type :String,
        required : [true , errMSG.required("Name")]
    },
    email : {
        type : String,
        required : [true ,errMSG.required("Email")]
    },
    password : {
        type : String,
        required : [true , errMSG.required("Password")]
    },
    profilePic : {
        type : String,
        required : [true , errMSG.required("Profile Picture")]
    },
    otp : {
        type : String, 
    },
    otpCreatedAt: {
        type : Date
    },

},{timestamps : true});

userSchema.pre('save' , async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password , 12);
    next();
})

const User = mongoose.model("User" , userSchema)

export default User
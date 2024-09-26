import express from "express";
import { upload } from "../middleware/multer.middleware";
import { login, signup, update,getOTP ,verify } from "../controller/user.controller";
import { authMiddle } from "../middleware/auth.middleware";

const userRouter = express.Router();

userRouter.post("/signup",upload.fields([{
    name : "profilePic",
    maxCount :1
}]), signup);
userRouter.post("/login" , login);
userRouter.post("/getOTP" , getOTP);
userRouter.post("/verifyOTP" , verify);
userRouter.put("/update" , authMiddle , update );

export default userRouter
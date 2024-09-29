import { Request , Response } from "express";
import { loginUserSchema, userSchema } from "../interface/yupValidatorSchemas";
import { UserService } from "../service/user.service";
import { IUserDto } from "../dto/IUserDto";
import { statuscode } from "../constant/statusCode";

const userService = new UserService();

export const signup = async (req : Request ,res : Response)=>{
    try {
        const reqBody = req.body;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const profilePictureLocalpath = files?.profilePic?.[0]?.path;
        reqBody.profilePic = profilePictureLocalpath;

        const signupData : IUserDto = await userSchema.validate(reqBody);

        const createdUser = await userService.createUser(signupData)
        res.status(createdUser.statuscode).json(createdUser.content)

    } catch (error) {
        res.status(error.statusCode || statuscode.InternalServerError).json(error.message)
    }
}

export const login = async (req : Request , res : Response) => {
    try {
        const reqBody = req.body;

       const loginData = await loginUserSchema.validate(reqBody);

        const loginUser = await userService.loginUser(loginData);
        res.status(loginUser.statuscode).json(loginUser.content);
    } catch (error : any) {
        res.status(error.statuscode || statuscode.NotImplemented).json({message : error.message})
    }
}

export const  update = async (req : Request , res : Response) =>{
    try {
        const updateData  = req.body;
        const id = req.params.id;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const profilePictureLocalpath = files?.profilePic?.[0]?.path;
        updateData.profilePic = profilePictureLocalpath;

        const updatedUser = await userService.updateUser(updateData ,id);
        res.status(updatedUser.statuscode).json(updatedUser.content);
    } catch (error ) {
        res.status(error.statuscode || statuscode.NotImplemented).json({message : error.message});
    }
}
export const  updatePassword = async (req : Request , res : Response) =>{
    try {
        const updateData  = req.body;
        const id = req.params.id;


        const updatedUser = await userService.updateUser(updateData ,id);
        res.status(updatedUser.statuscode).json(updatedUser.content);
    } catch (error ) {
        res.status(error.statuscode || statuscode.NotImplemented).json({message : error.message});
    }
}

export const Password = async (req : Request , res : Response) =>{
    try {
        const updateData  = req.body;
        const id = req.params.id;
        const updatedUser = await userService.updateUserPassword(updateData ,id);
        res.status(updatedUser.statuscode).json(updatedUser.content);
    } catch (error ) {
        res.status(error.statuscode || statuscode.NotImplemented).json({message : error.message});
    }
}

export const getOTP = async (req : Request , res : Response) =>{
    try {
        const email = req.body.email.email;
        console.log(email);
        
        const OTP = await userService.sendOTP(email);
        res.status(OTP.statuscode).json(OTP.content);
    } catch (error : any) {
        res.status(error.statuscode || statuscode.NotImplemented).json({message : error.message});
    }
}

export const verify = async (req : Request , res : Response) =>{
    try {
        const otp = req.body.otp ?? "";
        const id = req.body.USERID;
	
        const result = await userService.verifyOTP(otp , id);
        res.status(result.statuscode).json(result.content);
    } catch (error : any) {
        res.status(error.statuscode || statuscode.NotImplemented).json({message : error.message});
    }
}
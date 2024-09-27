import { errMSG, MSG } from "../constant/message";
import { statuscode } from "../constant/statusCode";
import { IUserDto } from "../dto/IUserDto";
import User from "../model/user.model";
import { ApiError } from "../utility/apiError";
import { deleteonCloudinary, uploadOnCloudinary } from "../utility/cloudinary";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { transporter } from "../utility/email";
import mongoose from "mongoose";

export class UserService {

    cloudinaryurl: string | undefined = ""

    async createUser(userData: IUserDto) {
        try {
            const existUser = await User.findOne({ email: userData.email });

            if (existUser) {
                throw new ApiError(statuscode.NotAcceptable, errMSG.exsistuser);
            }

            const profile = await uploadOnCloudinary(userData.profilePic);
            this.cloudinaryurl = profile?.url;

            const createdUser = await User.create({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                profilePic: this.cloudinaryurl
            })
            this.cloudinaryurl = undefined;
console.log(statuscode.created);
            return {
                status: statuscode.created,
                content: {
                    message: MSG.usercreated,
                    data: createdUser
                }
            }
        } catch (error) {
            if (this.cloudinaryurl) {
                deleteonCloudinary(this.cloudinaryurl).then((response) => {
                    this.cloudinaryurl = "";
                });
            }
            return {
                statuscode: error.statusCode || statuscode.InternalServerError,
                content: {
                    message: error.message || errMSG.InternalServerErrorResult,
                }
            }
        }
    }

    async loginUser(userData: { email: string, password: string }) {
        const existUser = await User.findOne({
            email: userData.email
        });

        if (!existUser) {
            throw new ApiError(statuscode.NotFound, errMSG.notExistUser)
        }

        const isMatch = await bcrypt.compare(userData.password, existUser.password);

        if (!isMatch) {
            throw new ApiError(statuscode.NotAcceptable, errMSG.passwordNotMatch)
        }

        const token = jwt.sign(
            {
                id: existUser._id,
            },
            process.env.AccessTokenSeceret ?? "",
            {
                expiresIn: process.env.AccessExpire
            });

        return {
            statuscode: statuscode.ok,
            content: {
                message: MSG.success('User logged in'),
                data: {
                    token: token,
                    user: existUser
                }
            }
        }
    }

    async updateUser(updateData: IUserDto, id: string) {
        try {
            const profile = await uploadOnCloudinary(updateData.profilePic);
            this.cloudinaryurl = profile?.url;
    
            const result = await User.findByIdAndUpdate(
                {
                    _id: new mongoose.Schema.Types.ObjectId(id),
                },
                {
                    $set: {
                        updateData
                    },
                },
                { new: true }
            );
            if (!result) {
            throw new ApiError(statuscode.NotImplemented, errMSG.updateUser);
            }
            this.cloudinaryurl = undefined
            return {
                statuscode: statuscode.ok,
                content: {
                    data : result,
                    message : MSG.success("User updated")
                },
            };
        } catch (error) {
            if (this.cloudinaryurl) {
                deleteonCloudinary(this.cloudinaryurl).then((response) => {
                    this.cloudinaryurl = "";
                });
            }
            return {
                statuscode: error.statusCode || statuscode.InternalServerError,
                content: {
                    message: error.message || errMSG.InternalServerErrorResult,
                }
            }
        }
    }

    async updateUserPassword(updateData: IUserDto, id: string) {
        const user = await User.findById(
            {
                _id: new mongoose.Schema.Types.ObjectId(id),
            },
        );
        if(!user){
            throw new ApiError(statuscode.NotFound ,errMSG.notExistUser)
        }

        user.password = updateData.password;

        const result = user.save();

        if (result) {
            return {
                statuscode: statuscode.ok,
                content: result,
            };
        }
        throw new ApiError(statuscode.NotImplemented, errMSG.updateUser);

    }

    async sendOTP(email: string) {
        const client = await User.findOne({email});

        if(!client){
            throw new ApiError(statuscode.NotFound , errMSG.notExistUser)
        }

        const otp = Math.floor(Math.random()*10 +1000);

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: client.email,
            subject: 'Password Reset',
            text: `Your OTP is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                throw new ApiError(statuscode.NotImplemented , 'Error sending email')
            } 
            console.log('Email sent:', info.response);
        });
        return {
            statuscode: statuscode.ok,
            content: {
                message : "we send email to this address "+ client.email
            },
        };
    }

    async verifyOTP(otp : string , id : string){
        const user = await User.findById(new mongoose.Schema.Types.ObjectId(id));

        if (!user) {
            throw new ApiError(statuscode.NotFound ,errMSG.notExistUser)
        }

        if (user.otp === otp) {
            return {
                statuscode: statuscode.ok,
                content: {
                    message : MSG.success("OTP is matched"),
                    data : {
                        OTPmatchrd : true
                    }
                },
            };
        }
        return {
            statuscode: statuscode.NotImplemented,
            content: {
                message : "OTP does not matched or other error occured try again",
                data : {
                    OTPmatchrd : false
                }
            },
        };
    } 
}
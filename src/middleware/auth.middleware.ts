import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utility/apiError";
import { statuscode } from "../constant/statusCode";
import { errMSG } from "../constant/message";
import jwt, { JwtPayload, verify } from "jsonwebtoken";
import User from "../model/user.model";
export const authMiddle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token)
      throw new ApiError(statuscode.NotAcceptable, errMSG.required("Token"));

    const tokenarray = (token as string).split(" ");

    if (tokenarray[0] !== "Bearer") {
      throw new ApiError(
        statuscode.NotAcceptable,
        errMSG.required("Bearer token")
      );
    }

    try {
      const decoded = await jwt.verify(
        tokenarray[1],
        process.env.AccessTokenSeceret as jwt.Secret
      );
      req.body.USERID = (decoded as JwtPayload).id;
console.log("-------middleware-------"+(decoded as JwtPayload).id)
console.log(req.body.USERID)
      const user = await User.findOne({_id : (decoded as JwtPayload).id})          
      next();
    } catch (err: any) {
      throw new ApiError(statuscode.Unauthorized,errMSG.expiredToken);
    }
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      mesage: error.message,
    });
  }
};

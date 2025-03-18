import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomError, RequestWithUser } from "../types/users.type.js";
import { JWT_SECRET } from "../config/env.config.js";
import prisma from "../prisma/client.js";

const authorize = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
  
    const token = req.headers['authorization']?.split(' ')[1];

    console.log("Token with beareer: ", token);

    if (!token) {
      const error = new Error("Token required") as CustomError;
      error.status = 400;
      return next(error);
    }

    const isBlacklistedToken = await prisma.blacklistedToken.findUnique({
      where: { token: token }
    })

    const decoded = jwt.decode(token as string);

    if (typeof decoded === 'object' && decoded !== null) {
      if (!decoded || (decoded.exp && decoded.exp < Date.now().valueOf() / 1000) || isBlacklistedToken) {
        const error = new Error("Invalid token") as CustomError;
        error.status = 401;
        next(error);
      }
    } 

    const secret = JWT_SECRET as string;
    const user = jwt.verify(token, secret);

    req.user = user;
    next();
  } catch(error) {
    next(error);
  }
}



export default authorize;
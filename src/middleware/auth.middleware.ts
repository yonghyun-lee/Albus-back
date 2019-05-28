import RequestWithUser from "../interface/requestWithUser.interface";
import {NextFunction, Response} from "express";
import * as jwt from "jsonwebtoken";
import DataStoredInToken from "../interface/dataStoredInToken.interface";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import {db} from "@src/lib/postgresql";

export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  // header 에서 token 가져옴
  const header = req.header('Authorization');
  const parts = header ? header.split('Bearer ') : [];

  const accessToken = parts[1] || req.cookies.access_token;

  if (accessToken) {
    const secret = process.env.TOKEN_SECRET;
    try {
      const verificationResponse = jwt.verify(accessToken, secret) as DataStoredInToken;
      const id = verificationResponse.id;
      // const user = await UserModel.findById(id);
      const user = await db.selectQuery(`SELECT * FROM users WHERE id=$1`, id);
      if (user) {
        req.user = user[0];
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
};
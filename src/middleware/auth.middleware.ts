import RequestWithUser from "../interface/requestWithUser.interface";
import {NextFunction, Response} from "express";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import {db} from "@src/lib/postgresql";
import token from "@src/lib/token";

export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  // header 에서 token 가져옴
  const header = req.header('Authorization');
  const parts = header ? header.split('Bearer ') : [];

  const accessToken = parts[1] || req.cookies.access_token;

  if (accessToken) {
    try {
      const verificationResponse = await token.decode(accessToken);
      const id = verificationResponse.user.id;
      // const user = await UserModel.findById(id);
      const user = await db.selectQuery(`SELECT * FROM users WHERE id=$1`, id);
      if (user) {
        req.user = user[0];
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      console.error(error);
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
};
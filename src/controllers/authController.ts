import Controller from "@interface/controller.interface";
import * as express from "express";
import {validationMiddleware} from "@middleware/validation.middleware";
import RequestWithUser from "@interface/requestWithUser.interface";
import UserBodyDto from "@dto/UserBody.dto";
import { db } from "@src/lib/postgresql";
import UsernameAlreadyExistsException from "@exceptions/UsernameAlreadyExistsException";
import EmailAlreadyExistsException from "@exceptions/EmailAlreadyExistsException";
import SocialRegisterBodyDto from "@dto/SocialRegisterBody.dto";
import InternalServerException from "@exceptions/InternalServerException";
import {socialService} from "@src/lib/SocialProfileService";
import WrongCredentialsException from "@exceptions/WrongCredentialsException";
import SocialAccountAlreadyExistsException from "@exceptions/SocialAccountAlreadyExistsException";
import SocialLogInDto from "@dto/logIn.dto";
import SocialProfileInterface from "@interface/socialProfile.interface";
import NotRegisteredException from "@exceptions/NotRegisteredException";
import Token from "@src/lib/token";
import User from "@interface/user.interface";

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/googleLogin`, validationMiddleware(SocialLogInDto), this.socialLogin);
    this.router.post(`${this.path}/register/local`, validationMiddleware(UserBodyDto), this.registerLocalAccount);
    this.router.post(`${this.path}/register/social`, validationMiddleware(SocialRegisterBodyDto), this.socialRegister);
  }

  private socialLogin = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {

    const { accessToken }: SocialLogInDto = req.body;

    let profile: SocialProfileInterface = null;

    try {
      profile = await socialService.getGoogleProfile(accessToken);
    } catch (e) {
      console.error(e);
      next(new WrongCredentialsException());
      return;
    }

    if (profile === null || profile === undefined) {
      next(new WrongCredentialsException());
      return;
    }

    // console.log(profile);

    const socialId = profile.id.toString();
    let user = [];

    try {

      let socialUser = await db.selectQuery(`SELECT * FROM social_accounts WHERE social_id=$1`, socialId);

      if (!socialUser.length) {

        if (profile.email) {
          user = await db.selectQuery(`SELECT * FROM users WHERE email=$1`, profile.email);
        }

        console.log(user);

        if (!user.length) {
          next(new NotRegisteredException(profile.email));
          return;
        }

        await db.txQuery(
          `INSERT INTO social_accounts
          (user_id, social_id, access_token)
          VALUES($1, $2, $3)`,
          user[0].id,
          profile.id.toString(),
          accessToken
        );
      }

      user = await db.selectQuery(`SELECT * FROM users WHERE id=$1`, socialUser[0].user_id);
      const userInfo: User = user[0];

      console.log(userInfo);
      const token = await Token.generateLoginToken(userInfo);

      res.cookie('access_token', token, {
        // httpOnly: true, // XSS 방지
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
        // domain: process.env.NODE_ENV === 'development' ? "localhost:3000" : 'albus.io',
      });

      res.json({
        user: {
          id: userInfo.id,
          username: userInfo.username,
          thumbnail: userInfo.thumbnail
        },
        token
      });
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };

  private registerLocalAccount = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
    const {username, email, accessToken}: UserBodyDto = req.body;

    const isUsername = await db.selectQuery(`SELECT * FROM users WHERE username=$1`, username);
    const isEmail = await db.selectQuery(`SELECT * FROM users WHERE email=$1`, email);

    try {
      // todo 이메일 인증을 통한 회원가입

    } catch (e) {
      next(new InternalServerException(e));

    }
  };

  private socialRegister = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
    const { accessToken, username, fallbackEmail }: SocialRegisterBodyDto = req.body;

    let profile = null;

    try {
      profile = await socialService.getGoogleProfile(accessToken);
    } catch (e) {
      return next(new WrongCredentialsException());
    }

    const socialId = profile.id.toString();
    const email = profile.email || fallbackEmail;

    try {
      const emailQuerySql = `SELECT * FROM users WHERE username=$1`;
      const usernameQuerySql = `SELECT * FROM users WHERE username=$1`;

      const [emailExists, usernameExists] = await Promise.all([
        email
          ? db.selectQuery(emailQuerySql, email)
          : Promise.resolve(null),
        db.selectQuery(usernameQuerySql, username)
      ]);

      if (emailExists.length || usernameExists.length) {
        emailExists.length
          ? next(new EmailAlreadyExistsException(email))
          : next(new UsernameAlreadyExistsException(username));
        return;
      }

      const socialQuerySql = `SELECT * FROM social_accounts WHERE social_id=$1`;

      const socialExists = await db.selectQuery(socialQuerySql, socialId);

      if (socialExists.length) {
        return next(new SocialAccountAlreadyExistsException());
      }

      // console.log(accessToken, fallbackEmail, profile);

      // todo 저장, 썸네일 다운, ...

      await db.txQuery(
        `INSERT INTO users
        (username, email, thumbnail, is_certified)
        VALUES($1, $2, $3, $4)`,
        username,
        email,
        profile.thumbnail,
        !!email ? 'true' : 'false'
      );

      const user = await db.selectQuery(`SELECT * FROM users WHERE username=$1`, username);
      const userId = user[0].id;

      await db.txQuery(
        `INSERT INTO social_accounts
        (user_id, social_id, access_token)
        VALUES($1, $2, $3)`,
        userId,
        socialId,
        accessToken
      );

      const token: string = await Token.generateLoginToken(user[0]);

      res.cookie('access_token', token, {
        httpOnly: true, // XSS 방지
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
        domain: process.env.NODE_ENV === 'development' ? undefined : 'albus.io',
      });

      res.json({
        user: {
          id: user[0].id,
          username: user[0].username,
          thumbnail: user[0].thumbnail
        },
        token
      });

    } catch (e) {
      next(new InternalServerException(e));
    }
  };

}

export default AuthenticationController;
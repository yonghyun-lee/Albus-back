import Controller from "@interface/controller.interface";
import * as express from "express";
import {validationMiddleware} from "@middleware/validation.middleware";
import RequestWithUser from "@interface/requestWithUser.interface";
import UserBodyDto from "@dto/UserBody.dto";
import { db } from "@src/lib/postgresql";
import UsernameAlreadyExistsException from "@exceptions/UsernameAlreadyExistsException";
import EmailAlreadyExistsException from "@exceptions/EmailAlreadyExistsException";
import * as bcrypt from "bcrypt";
import SocialRegisterBodyDto from "@dto/SocialRegisterBody.dto";
import InternalServerException from "@exceptions/InternalServerException";
import {socialService} from "@src/lib/SocialProfileService";
import WrongCredentialsException from "@exceptions/WrongCredentialsException";
import User from "@interface/user.interface";
import SocialAccountAlreadyExistsException from "@exceptions/SocialAccountAlreadyExistsException";

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register/local`, validationMiddleware(UserBodyDto), this.registerLocalAccount);
    this.router.post(`${this.path}/register/social/:platform`, validationMiddleware(SocialRegisterBodyDto), this.socialRegister);
  }

  private registerLocalAccount = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
    const {username, password, email}: UserBodyDto = req.body;

    const isUsername = await db.selectQuery(`SELECT * FROM users WHERE username=$1`, username);
    const isEmail = await db.selectQuery(`SELECT * FROM users WHERE email=$1`, email);

    try {
      if (isEmail.length) {
        next(new EmailAlreadyExistsException(email));
      } else if (isUsername.length) {
        next(new UsernameAlreadyExistsException(username));
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.txQuery(
          `INSERT INTO users(username, password, email) VALUES($1, $2, $3)`,
          username,
          hashedPassword,
          email
        );

        res.sendStatus(200);
      }
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

      if (socialExists) {
        return next(new SocialAccountAlreadyExistsException());
      }

      // todo 저장, 썸네일 다운, ...

    } catch (e) {
      next(new InternalServerException(e));
    }
  };

}

export default AuthenticationController;
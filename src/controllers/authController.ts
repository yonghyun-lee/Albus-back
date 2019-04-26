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

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register/local`, validationMiddleware(UserBodyDto), this.registerLocalAccount);
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
    const { accessToken, ...form }: SocialRegisterBodyDto = req.body;

    try {

    } catch (e) {

    }
  };

}

export default AuthenticationController;
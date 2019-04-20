import Controller from "@interface/controller.interface";
import * as express from "express";
import {validationMiddleware} from "@middleware/validation.middleware";
import RequestWithUser from "@interface/requestWithUser.interface";
import UserBodySchemaDto from "@dto/UserBodySchema.dto";
import { db } from "@src/postgresql";
import UsernameAlreadyExistsException from "@exceptions/UsernameAlreadyExistsException";
import EmailAlreadyExistsException from "@exceptions/EmailAlreadyExistsException";
import {response} from "express";
import * as bcrypt from "bcrypt";

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register/local`, validationMiddleware(UserBodySchemaDto), this.registerLocalAccount);
  }

  private registerLocalAccount = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
    const {username, password, email}: UserBodySchemaDto = req.body;

    try {
      const isUsername = await db.selectQuery(`SELECT * FROM users WHERE username=$1`, username);
      const isEmail = await db.selectQuery(`SELECT * FROM users WHERE email=$1`, email);

      if (isUsername.length) {
        next(new UsernameAlreadyExistsException(username));
      } else if (isEmail.length) {
        next(new EmailAlreadyExistsException(email));
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.txQuery(`INSERT INTO users(username, password, email) VALUES($1, $2, $3)`, username, hashedPassword, email);

        res.sendStatus(200);
      }
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }

}

export default AuthenticationController;
import Controller from "@interface/controller.interface";
import * as express from "express";
import {validationMiddleware} from "@middleware/validation.middleware";
import RequestWithUser from "@interface/requestWithUser.interface";
import UserBodySchemaDto from "@dto/UserBodySchema.dto";

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

    console.log(username, password, email);

    res.sendStatus(200);
  }

}

export default AuthenticationController;
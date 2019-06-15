import Controller from "@interface/controller.interface";
import * as express from "express";
import {validationMiddleware} from "@middleware/validation.middleware";
import RequestWithUser from "@interface/requestWithUser.interface";
import UserBodyDto from "@dto/UserBody.dto";
import {authMiddleware} from "@middleware/auth.middleware";

class AuthenticationController implements Controller {
  public path = '/picture';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);
    this.router.post(`${this.path}/`, validationMiddleware(UserBodyDto), this.uploadPictures);
  }

  private uploadPictures = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
    res.json(req.user);
  };
}

export default AuthenticationController;
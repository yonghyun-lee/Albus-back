import Controller from "@interface/controller.interface";
import * as express from "express";
import RequestWithUser from "@interface/requestWithUser.interface";
import {authMiddleware} from "@middleware/auth.middleware";

class PictureController implements Controller {
  public path = '/picture';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);
    this.router.post(`${this.path}/`, this.uploadPictures);
  }

  private uploadPictures = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
    console.log(req.user);
    res.json(req.user);
  };
}

export default PictureController;
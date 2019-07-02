import Controller from "@interface/controller.interface";
import * as express from "express";
import RequestWithUser from "@interface/requestWithUser.interface";
import {authMiddleware} from "@middleware/auth.middleware";
import * as multer from "multer";
import * as path from "path";

class PictureController implements Controller {
  public path = '/picture';
  public router = express.Router();
  public storage: multer.StorageEngine;
  public upload: multer.Instance;

  constructor() {
    this.storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname + '../../../uploads'))
      },
      filename: function (req, file, cb) {
        console.log(file);
        cb(null, Date.now() + '-' + file.originalname)
      }
    });
    this.upload = multer({ storage: this.storage });
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);
    this.router.post(`${this.path}/`, this.upload.array('picture'),this.uploadPictures);
  }

  private uploadPictures = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
    res.json(req.user);
  };
}

export default PictureController;
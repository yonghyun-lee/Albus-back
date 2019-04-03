import Controller from "../interface/controller.interface";
import * as express from "express";
import {validationMiddleware} from "../middlewares/validation.middleware";

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
  }

}

export default AuthenticationController;
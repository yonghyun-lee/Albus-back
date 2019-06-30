import AuthenticationController from "@controllers/authController";
import PictureController from "@controllers/pictureController";

export const controllersModule = [
  new AuthenticationController,
  new PictureController
];
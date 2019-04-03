import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from "body-parser";
import errorMiddleware from "./middlewares/error.middleware";

class App {

  public app: express.Application;
  public port: number;

  constructor(controllers:Array<object>, port:number) {
    this.app = express();
    this.port = port;
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddleware() {
    this.app.use(App.loggerMiddleware);
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.static('public'));
  }

  private initializeControllers(controllers: Array<object>) {
    controllers.forEach((controller: any) => {
      this.app.use('/', controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private static loggerMiddleware(request: express.Request, response: express.Response, next: express.NextFunction) {
    console.log(`${request.method} ${request.path}`);
    next();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App
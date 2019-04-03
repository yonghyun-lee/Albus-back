import App from './app'
import 'dotenv/config'
import {controllers} from "./controllers";

const app = new App(
  controllers,
  parseInt(process.env.SERVER_PORT, 10)
);

app.listen();
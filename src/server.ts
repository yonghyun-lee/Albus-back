import 'module-alias/register';
import App from './app'
import 'dotenv/config'
import {controllersModule} from "./controllersModule";

const app = new App(
  controllersModule,
  parseInt(process.env.SERVER_PORT, 10)
);

app.listen();
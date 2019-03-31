import App from './app'
import 'dotenv/config'

const app = new App(parseInt(process.env.SERVER_PORT, 10),
);

app.listen();
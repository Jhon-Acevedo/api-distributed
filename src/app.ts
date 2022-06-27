import express from 'express';
import bodyParser from 'body-parser';
import { IController } from './controllers/IController';
import swaggerRouter from './utils/swagger';

class App {
  public app: express.Express;
  public port: number;

  constructor(controllers: IController[], port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers: IController[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
      swaggerRouter(this.app);
    });
  }
}

export default App;

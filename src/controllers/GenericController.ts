import { IController } from './IController';
import { Request, Response, Router } from 'express';
import fetch from 'cross-fetch';
import request from 'request';

export default class GenericController implements IController {
  path: string;
  router: Router;

  constructor() {
    this.path = process.env.generic_url_api as string;
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(this.path, this.getRandomDog);
  }

  public getRandomDog = async (req: Request, res: Response) => {
    const url = await fetch('https://dog.ceo/api/breeds/image/random').then(
      response => response.json()
    );

    request(
      {
        url: url.message,
        encoding: null
      },
      (err, resp, buffer) => {
        if (!err && resp.statusCode === 200) {
          res.set('Content-Type', 'image/jpeg');
          res.send(resp.body);
        }
      }
    );
  };
}

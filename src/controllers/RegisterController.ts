import RegisterService from '../services/RegisterService';
import { Router, Request, Response } from 'express';
import { IController } from './IController';

export default class RegisterController implements IController {
  private _registerService: RegisterService;
  path: string;
  router: Router;

  constructor(registerService: RegisterService) {
    this._registerService = registerService;
    this.path = process.env.API_REGISTRATIONS_URL as string;
    this.router = Router();
    this.initializeRoutes();
  }

  /**
   * Initialize all routes of the controller
   */
  public initializeRoutes() {
    this.router.get(this.path, this.getAll);
    this.router.get(`${this.path}/student/:id`, this.getSubjectsByStudentId);
    this.router.get(`${this.path}/subject/:id`, this.getStudentsBySubjectId);
    this.router.post(this.path, this.createRegister);
    this.router.delete(`${this.path}/:id`, this.deleteRegister);
  }

  /**
   * @openapi
   * /registrations:
   *  get:
   *    tags:
   *      - Registrations
   *    summary:
   *    responses:
   *      200:
   *        description: App is up and running
   */
  public getAll = async (req: Request, res: Response) => {
    await this._registerService
      .getAll()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };

  /**
   * Create a new register
   * @param req request
   * @param res response
   * @returns the created register
   */
  public createRegister = async (req: Request, res: Response) => {
    console.log(req.body);
    if (!req.body.idStudent || !req.body.idSubject) {
      res.status(400).json({
        message: 'Missing idStudent or idSubject parameter'
      });
    } else {
      await this._registerService
        .create(req.body)
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  };

  public getSubjectsByStudentId = async (req: Request, res: Response) => {
    if (!req.params.id) {
      res.status(400).json({
        message: 'Missing id_Student parameter'
      });
    } else if (req.params.id.match(/^\d+$/)) {
      console.log(req.params.id);
      await this._registerService
        .findSubjectsByStudent(Number(req.params.id))
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  };

  /**
   * Delete a register by idStudent, idSubject
   * @param req request
   * @param res response
   * @returns the deleted register
   */
  public getStudentsBySubjectId = async (req: Request, res: Response) => {
    if (!req.params.id) {
      res.status(400).json({
        message: 'Missing id_Subject parameter'
      });
    } else if (req.params.id.match(/^\d+$/)) {
      await this._registerService
        .findStudentsBySubject(Number(req.params.id))
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  };

  public deleteRegister = async (req: Request, res: Response) => {
    if (!req.body) {
      res.status(400).json({
        message: 'Missing id parameter'
      });
    } else if (
      req.body.idStudent.match(/^\d+$/) &&
      req.body.idSubject.match(/^\d+$/)
    ) {
      await this._registerService
        .delete(Number(req.params.idStudent), Number(req.params.idSubject))
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  };
}

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
    this.router.delete(`${this.path}`, this.deleteRegister);
  }

  /**
   * @openapi
   * components:
   *  schemas:
   *     CreateRegistration:
   *       type: object
   *       required:
   *         - idStudent
   *         - idSubject
   *         - date
   *       properties:
   *         idStudent:
   *           type: number
   *           description: ID of the student
   *           format: int64
   *           required: true
   *         idSubject:
   *           type: number
   *           description: ID of the subject
   *           format: int64
   *           required: true
   *         date:
   *           type: string
   *           description: Date of the registration
   *           format: date
   *           required: true
   *       example:
   *         idStudent: 1655829917379
   *         idSubject: 1
   *         dateRegister: 2022-01-01
   *     DeleteRegistration:
   *       type: object
   *       required:
   *         - idStudent
   *         - idSubject
   *       properties:
   *         idStudent:
   *           type: number
   *           description: ID of the student
   *           format: int64
   *           required: true
   *         idSubject:
   *           type: number
   *           description: ID of the subject
   *           format: int64
   *           required: true
   *       example:
   *         idStudent: 1655829917379
   *         idSubject: 1
   */

  /**
   * @openapi
   * /registrations:
   *  get:
   *    tags:
   *      - Registrations
   *    summary: Gets all registrations
   *    responses:
   *      200:
   *        description: App is up and running
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/CreateRegistration'
   *      500:
   *        description: App is down
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
   * @openapi
   * /registrations:
   *  post:
   *    tags:
   *      - Registrations
   *    summary: Create a registration
   *
   *    requestBody:
   *     description: Optional description in *markdown*
   *     required: true
   *     content:
   *       application/json:
   *         schema:
   *           $ref: '#/components/schemas/CreateRegistration'
   *    responses:
   *      200:
   *        description: Created Registration
   *        content:
   *          application/json:
   *            schema:
   *
   *      500:
   *        description: Failed to create registration
   */
  public createRegister = async (req: Request, res: Response) => {
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

  /**
   * @openapi
   * /Registrations/student/{id_student}:
   *  get:
   *    tags:
   *     - Registrations
   *    summary: Gets ALL id_subjects by id_student
   *    responses:
   *      200:
   *        description: App is up and running
   *    parameters:
   *      - name: id_student
   *        in: path
   */
  public getSubjectsByStudentId = async (req: Request, res: Response) => {
    if (!req.params.id) {
      res.status(400).json({
        message: 'Missing id_Student parameter'
      });
    } else if (req.params.id.match(/^\d+$/)) {
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
   * @openapi
   * /registrations/subject/{id_subject}:
   *  get:
   *    tags:
   *     - Registrations
   *    summary: Get ALL id_students by id_subject
   *
   *    responses:
   *      200:
   *        description: App is up and running
   *    parameters:
   *      - name: id_subject
   *        in: path
   */
  public getStudentsBySubjectId = async (req: Request, res: Response) => {
    if (!req.params.id) {
      res.status(400).json({
        message: 'Missing id_Student parameter'
      });
    } else if (req.params.id.match(/^\d+$/)) {
      await this._registerService
        .findStudentsBySubject(Number(req.params.id))
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((err) => {
          this.handleError(err, res);
        });
    }
  };

  handleError = (err: any, res: Response) => {
    switch (err.message) {
      case 'Student not found':
        res.status(404).json(err.message);
        break;
    }
  };


  /**
   * @openapi
   * /registrations:
   *  delete:
   *    tags:
   *      - Registrations
   *    summary: Remove a registration
   *
   *    requestBody:
   *     description: Optional description in *markdown*
   *     required: true
   *     content:
   *       application/json:
   *         schema:
   *           $ref: '#/components/schemas/DeleteRegistration'
   *    responses:
   *      200:
   *        description: Deleted Registration
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/DeleteRegistration'
   *      500:
   *        description: Failed to remove registration
   */
  public deleteRegister = async (req: Request, res: Response) => {
    if (!req.body.idStudent || !req.body.idSubject) {
      res.status(400).json({
        message: 'Missing idStudent or idSubject parameter'
      });
    } else {
      await this._registerService
        .delete(req.body.idStudent, req.body.idSubject)
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  };
}

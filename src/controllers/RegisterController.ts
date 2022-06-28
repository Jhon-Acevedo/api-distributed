import RegisterService from '../services/RegisterService';
import { Router, Request, Response } from 'express';
import { IController } from './IController';
import { Errors as error } from '../utils/ErrorResponses';
import { SuccessfulResponses as success } from '../utils/SuccesfulResponses';

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
   *     ErrorHTTP:
   *       type: object
   *       required:
   *         - code
   *         - error
   *         - message
   *       example:
   *         code: 400
   *         error: Bad Request
   *         message: Invalid request
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
        success.S200(res, 'OK', data);
      })
      .catch((err) => {
        this.handleError(err, res);
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
   *      201:
   *        description: Created Registration
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateRegistration'
   *      404:
   *        description: Not found student or subject
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *      400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *      409:
   *        description: Conflict
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *      500:
   *        description: Failed to create registration
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
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
          success.S201(res, 'Register created successfully', data);
        })
        .catch((err) => {
          this.handleError(err, res);
        });
    }
  };

  /**
   * @openapi
   * /registrations/student/{id_student}:
   *  get:
   *    tags:
   *     - Registrations
   *    summary: Gets ALL subjects by id_student
   *    responses:
   *      200:
   *        description: App is up and running
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/CreateSubject'
   *      404:
   *        description: Not found student
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *      400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *      500:
   *        description: Failed to get subjects
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *    parameters:
   *      - name: id_student
   *        in: path
   *        description: ID of the student
   *        required: true
   *        schema:
   *          type: number
   *          example: 1656383737153
   */
  public getSubjectsByStudentId = async (req: Request, res: Response) => {
    if (!req.params.id) {
      error.E400(res, 'Missing body parameter');
      return;
    } else if (req.params.id.match(/^\d+$/)) {
      await this._registerService
        .findSubjectsByStudent(Number(req.params.id))
        .then((data) => {
          success.S200(res, 'OK', data);
        })
        .catch((err) => {
          this.handleError(err, res);
        });
    }
  };

  /**
   * @openapi
   * /registrations/subject/{id_subject}:
   *  get:
   *    tags:
   *     - Registrations
   *    summary: Get ALL students by id_subject
   *    responses:
   *      200:
   *        description: App is up and running
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/CreateStudent'
   *      404:
   *        description: Not found subject
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *      400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *      500:
   *        description: Failed to get subjects
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *    parameters:
   *      - name: id_subject
   *        in: path
   *        description: ID of the subject
   *        required: true
   *        schema:
   *          type: number
   *          example: 1656398025203
   */
  public getStudentsBySubjectId = async (req: Request, res: Response) => {
    if (!req.params.id) {
      error.E400(res, 'Missing body parameter');
      return;
    } else if (req.params.id.match(/^\d+$/)) {
      await this._registerService
        .findStudentsBySubject(Number(req.params.id))
        .then((data) => {
          success.S200(res, 'OK', data);
        })
        .catch((err) => {
          this.handleError(err, res);
        });
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

  handleError = (err: any, res: Response) => {
    switch (err.message) {
      case 'Student not found':
        error.E404(res, err.message);
        break;
      case 'Subject not found':
        error.E404(res, err.message);
        break;
      case 'Register already exists':
        error.E409(res, err.message);
        break;
      default:
        error.E500(res, err.message);
        break;
    }
  };
}

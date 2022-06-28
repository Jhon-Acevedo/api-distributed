import SubjectService from '../services/SubjectService';
import { IController } from './IController';
import { Request, Response, Router } from 'express';
import { Errors as error } from '../utils/ErrorResponses';
import { SuccessfulResponses as success } from '../utils/SuccesfulResponses';

export default class SubjectController implements IController {
  private readonly _subjectService: SubjectService;
  path: string;
  router: Router;

  constructor(subjectService: SubjectService) {
    this._subjectService = subjectService;
    this.path = process.env.API_SUBJECTS_URL as string;
    this.router = Router();
    this.initializeRoutes();
  }

  /**
   * Initialize all routes of the controller
   */
  public initializeRoutes() {
    this.router.get(this.path, this.getAll);
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.post(this.path, this.createSubject);
    this.router.put(`${this.path}/:id`, this.updateSubject);
    this.router.delete(`${this.path}/:id`, this.deleteSubject);
  }

  /**
   * @openapi
   * /subjects:
   *  get:
   *    tags:
   *      - Subject
   *    summary: Gets all subjects
   *    responses:
   *      200:
   *        description: If it gets all subjects successfully
   *      500:
   *        description: If it fails to get all subjects
   */
  public getAll = async (req: Request, res: Response) => {
    await this._subjectService
      .getAll()
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        this.handleErrors(err, res);
      });
  };

  /**
   * @openapi
   * /subjects/{id}:
   *  get:
   *    tags:
   *      - Subject
   *    summary: Gets all subjects
   *    responses:
   *      200:
   *        description: If it gets all subjects successfully
   *      500:
   *        description: If it fails to get all subjects
   *      404:
   *        description: If it fails to get all subjects
   *    parameters:
   *      - name: id
   *        in: path
   */
  public getById = async (req: Request, res: Response) => {
    if (!req.params.id) {
      res.status(400).json({
        message: 'Missing id parameter'
      });
    } else if (req.params.id.match(/^\d+$/)) {
      await this._subjectService
        .getById(Number(req.params.id))
        .then(data => {
          res.status(200).json(data);
        })
        .catch(err => {
          this.handleErrors(err, res);
        });
    }
  };

  /**
   * Create a new subject
   * @param req request
   * @param res response
   * @returns the created subject
   */
  public createSubject = async (req: Request, res: Response) => {
    console.log(req.body);
    if (!req.body.name) {
      error.E400(res, 'Missing body parameter');
      return;
    }
    await this._subjectService
      .create(req.body)
      .then(data => {
        success.S201(res, 'Subject created successfully', data);
      })
      .catch(err => {
        this.handleErrors(err, res);
      });
  };

  /**
   * Update a subject by id
   * @param req request
   * @param res response
   * @returns the updated subject
   */
  public updateSubject = async (req: Request, res: Response) => {
    if (!req.params.id) {
      error.E400(res, 'Missing id parameter');
      return;
    }
    if (req.params.id.match(/^\d+$/)) {
      await this._subjectService
        .editSubject(Number(req.params.id), req.body)
        .then(data => {
          success.S200(res, 'Subject updated successfully', data);
        })
        .catch(err => {
          this.handleErrors(err, res);
        });
    }
  };

  /**
   * Delete a subject by id
   * @param req request
   * @param res response
   * @returns the deleted subject
   */
  public deleteSubject = async (req: Request, res: Response) => {
    if (!req.params.id) {
      error.E400(res, 'Missing id parameter');
      return;
    }
    if (!req.params.id.match(/^\d+$/)) {
      error.E400(res, 'Invalid id ( must be a number )');
      return;
    }
    await this._subjectService
      .delete(Number(req.params.id))
      .then(data => {
        success.S200(res, 'Subject deleted successfully', data);
      })
      .catch(err => {
        this.handleErrors(err, res);
      });
  };

  /**
   * Handle errors and send response
   * @param err error object
   * @param res response object
   */
  handleErrors(err: Error, res: Response) {
    switch (err.message) {
      case 'Subject not found':
        error.E404(res, err.message);
        break;
      case 'Subject already exists':
        error.E409(res, err.message);
        break;
      default:
        error.E500(res, err.message);
        break;
    }
  }
}

import SubjectService from '../services/SubjectService';
import { IController } from './IController';
import { Request, Response, Router } from 'express';

export default class SubjectController implements IController {
  private _subjectService: SubjectService;
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
   * Get all subjects
   * @param req request
   * @param res response
   * @returns all subjects
   */
  public getAll = async (req: Request, res: Response) => {
    await this._subjectService
      .getAll()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };

  /**
   * Get a subject by id
   * @param req request
   * @param res response
   * @returns the subject with the given id
   */
  public getById = async (req: Request, res: Response) => {
    if (!req.params.id) {
      res.status(400).json({
        message: 'Missing id parameter'
      });
    } else if (req.params.id.match(/^\d+$/)) {
      await this._subjectService
        .getById(Number(req.params.id))
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((err) => {
          res.status(500).json(err);
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
      res.status(400).json({
        message: 'Missing body parameter'
      });
    } else {
      await this._subjectService
        .create(req.body)
        .then((data) => {
          res.status(201).json({ message: 'Subject created', subject: data });
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  };

  /**
   * Update a subject by id
   * @param req request
   * @param res response
   * @returns the updated subject
   */
  public updateSubject = async (req: Request, res: Response) => {
    if (!req.params.id) {
      res.status(400).json({
        message: 'Missing id parameter'
      });
    } else if (req.params.id.match(/^\d+$/)) {
      await this._subjectService
        .editSubject(Number(req.params.id), req.body)
        .then((data) => {
          res.status(200).json({ message: 'Subject updated', subject: data });
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
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
      res.status(400).json({
        message: 'Missing id parameter'
      });
    } else if (req.params.id.match(/^\d+$/)) {
      await this._subjectService
        .delete(Number(req.params.id))
        .then((data) => {
          res.status(200).json({ message: 'Subject deleted', subject: data });
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  };
}

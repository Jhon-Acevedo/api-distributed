import StudentService from '../services/StudentService';
import { IController } from './IController';
import { Request, Response, Router } from 'express';

export default class StudentController implements IController {
  private _studentService: StudentService;
  path: string;
  router: Router;

  constructor(studentService: StudentService) {
    this._studentService = studentService;
    this.path = process.env.API_STUDENTS_URL as string;
    this.router = Router();
    this.initializeRoutes();
  }

  /**
   * Initialize all routes of the controller
   */
  public initializeRoutes() {
    this.router.get(this.path, this.getAll);
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.post(this.path, this.createStudent);
    this.router.put(`${this.path}/:id`, this.updateStudent);
    this.router.delete(`${this.path}/:id`, this.deleteStudent);
  }

  /**
   * Get all student
   * @param req request
   * @param res response
   * @returns all student
   */
  public getAll = async (req: Request, res: Response) => {
    await this._studentService
      .getAll()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };

  /**
   * Get a student by id
   * @param req request
   * @param res response
   * @returns the student with the given id
   */
  public getById = async (req: Request, res: Response) => {
    if (!req.params.id) {
      res.status(400).json({
        message: 'Missing id parameter'
      });
    } else if (req.params.id.match(/^\d+$/)) {
      await this._studentService
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
   * Create a new student
   * @param req request
   * @param res response
   * @returns the created student
   */
  public createStudent = async (req: Request, res: Response) => {
    console.log(req.body);
    if (!req.body.name) {
      res.status(400).json({
        message: 'Missing body parameter'
      });
    } else {
      await this._studentService
        .create(req.body)
        .then((data) => {
          res.status(201).json({ message: 'Student created', student: data });
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  };

  /**
   * Update a student by id
   * @param req request
   * @param res response
   * @returns the updated student
   */
  public updateStudent = async (req: Request, res: Response) => {
    if (!req.params.id) {
      res.status(400).json({
        message: 'Missing id parameter'
      });
    } else if (req.params.id.match(/^\d+$/)) {
      await this._studentService
        .editStudent(Number(req.params.id), req.body)
        .then((data) => {
          res.status(200).json({ message: 'Student updated', student: data });
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  };

  /**
   * Delete a student by id
   * @param req request
   * @param res response
   * @returns the deleted student
   */
  public deleteStudent = async (req: Request, res: Response) => {
    if (!req.params.id) {
      res.status(400).json({
        message: 'Missing id parameter'
      });
    } else if (req.params.id.match(/^\d+$/)) {
      await this._studentService
        .delete(Number(req.params.id))
        .then((data) => {
          res.status(200).json({ message: 'Students deleted', student: data });
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  };
}

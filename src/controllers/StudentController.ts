import StudentService from '../services/StudentService';
import { IController } from './IController';
import { Request, Response, Router } from 'express';
import { Errors as error } from '../utils/ErrorResponses';
import { SuccessfulResponses as success } from '../utils/SuccesfulResponses';
import { Student } from '../models/Student';

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
    this.router.get(`${this.path}/code/:student_code`, this.getByStudentCode);
    this.router.get(`${this.path}/NumberAndTypeDoc/:doc/:type`, this.getByNumberAndTypeDoc);
    this.router.post(this.path, this.createStudent);
    this.router.put(`${this.path}/:id`, this.updateStudent);
    this.router.patch(`${this.path}/:id`, this.modifyStateStudent);
    this.router.delete(`${this.path}/:id`, this.deleteStudent);
  }

    /**
   * @openapi
   * components:
   *  schemas:
   *     CreateStudents:
   *       type: object
   *       required:
   *         - id: number
   *         - document_number: string
   *         - document_type: string
   *         - name: string
   *         - surname: string
   *         - student_code: string
   *         - email: string
   *         - state: boolean
   *       properties:
   *         id:
   *           type: number
   *           description: ID of the student
   *           format: int64
   *           required: true
   *         document_number:
   *           type: string
   *           description: Document number of the student
   *           format: varchar2
   *           required: true
   *         document_type:
   *           type: string
   *           description: Document type of the student
   *           format: varchar2
   *           required: true
   *         name:
   *           type: string
   *           description: Name of the student
   *           format: varchar2
   *           required: true
   *         surname:
   *           type: string
   *           description: Surname of the student
   *           format: varchar2
   *           required: true
   *         student_code:
   *           type: string
   *           description: Student code of the student
   *           format: varchar2
   *           required: true
   *         email:
   *           type: string
   *           description: Email of the student
   *           format: varchar2
   *           required: true
   *         state:
   *           type: boolean
   *           description: State of the student
   *           format: boolean
   *           required: true
   *         example:
   *          id: 1655829917379
   *          document_number: 4563423121
   *          document_type: CC
   *          name: Pepito
   *          surname: Perez
   *          student_code: 9999
   *          email: pepito.perez@uptc.edu.co
   *          state: true
   *     UpdateStudent:
   *       type: object
   *       required:
   *         - id: number
   *         - document_number: string
   *         - document_type: string
   *         - name: string
   *         - surname: string
   *         - student_code: string
   *         - email: string
   *         - state: boolean
   *       properties:
   *         id:
   *           type: number
   *           description: ID of the student
   *           format: int64
   *           required: true
   *         document_number:
   *           type: string
   *           description: Document number of the student
   *           format: varchar2
   *           required: true
   *         document_type:
   *           type: string
   *           description: Document type of the student
   *           format: varchar2
   *           required: true
   *         name:
   *           type: string
   *           description: Name of the student
   *           format: varchar2
   *           required: true
   *         surname:
   *           type: string
   *           description: Surname of the student
   *           format: varchar2
   *           required: true
   *         student_code:
   *           type: string
   *           description: Student code of the student
   *           format: varchar2
   *           required: true
   *         email:
   *           type: string
   *           description: Email of the student
   *           format: varchar2
   *           required: true
   *         state:
   *           type: boolean
   *           description: State of the student
   *           format: boolean
   *           required: true
   *       example:
   *         id: 1655829917379
   *         document_number: 4563423121
   *         document_type: CC
   *         name: Pepito
   *         surname: Perez
   *         student_code: 9999
   *         email: pepito.perez@uptc.edu.co
   *         state: true
   *     DeleteStudent:
   *       type: object
   *       required:
   *         - id: number
   *       properties:
   *         id:
   *           type: number
   *           description: ID of the student
   *           format: int64
   *           required: true
   *       example:
   *         idStudent: 1655829917379
   */


  /**
   * @openapi
   * /students:
   *  get:
   *    tags:
   *      - Students
   *    summary: Gets all students
   *    responses:
   *      200:
   *        description: If it gets all students successfully
   *      500:
   *        description: If it fails to get all students
   */
  public getAll = async (req: Request, res: Response) => {
    await this._studentService
      .getAll()
      .then((data) => {
        success.S200(res, 'Get all students successfully', data);
      })
      .catch(err => {
        this.handleErrors(err, res);
      });
  };

   /**
   * @openapi
   * /students/{id}:
   *  get:
   *    tags:
   *      - Students
   *    summary: Gets students by id
   *    responses:
   *      200:
   *        description: Gets all students by id successfully
   *      400:
   *        description: If it get a id of a students invalid
   *      404:
   *        description: The id of a students not found
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: Id of student
   *        schema:
   *          type: number
   *          example: 1
   */
  public getById = async (req: Request, res: Response) => {
    if (!req.params.id) {
      error.E400(res, 'Missing id parameter');
      return;
    } if (!req.params.id.match(/^\d+$/)) {
      error.E400(res, 'Invalid id ( must be a number )');
      return;
    }
      await this._studentService
        .getById(Number(req.params.id))
        .then((data) => {
          success.S200(res, 'Get student by id successfully', data);
        })
        .catch(err => {
          this.handleErrors(err, res);
        });
  };

   /**
   * @openapi
   * /students/code/{student_code}:
   *  get:
   *    tags:
   *      - Students
   *    summary: Gets students by student_code
   *    responses:
   *      200:
   *        description: Gets all students by student_code successfully
   *      400:
   *        description: If it get a student_code of a students invalid
   *      404:
   *        description: The student_code of a students not found
   *    parameters:
   *      - in: path
   *        name: student_code
   *        required: true
   *        description: Student Code of student
   *        schema:
   *          type: string
   *          example: 22120123
   */
  public getByStudentCode = async (req: Request, res: Response) => {
    if (!req.params.student_code) {
      error.E400(res, 'Missing id parameter');
      return;
    } if (!req.params.student_code.match(/^\d+$/)) {
      error.E400(res, 'Invalid id ( must be a number )');
      return;
    }
      await this._studentService
        .getByStudentCode(String(req.params.student_code))
        .then((data) => {
          success.S200(res, 'Get student by student_code successfully', data);
        })
        .catch(err => {
          this.handleErrors(err, res);
        });
  };

   /**
   * @openapi
   * /students/NumberAndTypeDoc/{doc}/{type}:
   *  get:
   *    tags:
   *      - Students
   *    summary: Gets students by doc && type
   *    responses:
   *      200:
   *        description: Gets all students by doc && type successfully
   *      400:
   *        description: If it get a doc && type of a students invalid
   *      404:
   *        description: The doc && type of a students not found
   *    parameters:
   *      - in: path
   *        name: doc_type
   *        required: true
   *        description: Documement number and Document type
   *        schema:
   *          type: string
   *          example: 1111/CC
   */
   public getByNumberAndTypeDoc = async (req: Request, res: Response) => {
    if (!req.params.doc) {
      res.status(400).json({
        message: 'Missing parameter'
      });
      return;
    } 
    if (!req.params.type) {
      res.status(400).json({
        message: 'Missing parameter'
      });
      return;
    }
    if (req.params.doc.match(/^\d+$/)) {
      await this._studentService
        .getByNumberAndTypeDoc(String(req.params.doc),String(req.params.type))
        .then((data: Student) => {
          res.status(200).json(data);
        })
        .catch((err: Error) => {
          res.status(500).json({ message: err.message});
        });
    }
  };

  /**
   * @openapi
   * /students:
   *  post:
   *    tags:
   *      - Students
   *    summary: Create a new student
   *    requestBody:
   *     description: Optional description in *markdown*
   *     required: true
   *     content:
   *       application/json:
   *         schema:
   *           $ref: '#/components/schemas/CreateStudent'
   *    responses:
   *      200:
   *        description: The student was successfully created
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/CreateStudent'    
   *      400:
   *        description: If it get a id of a students invalid
   *      500:
   *        description: If it fails to creat students
   *        
   *       
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
   * @openapi
   * /students/{id}:
   *  put:
   *    tags:
   *      - Students
   *    summary: Update student by id
   *    requestBody:
   *     description: Optional description in *markdown*
   *     required: true
   *     content:
   *       application/json:
   *         schema:
   *           $ref: '#/components/schemas/UpdateStudent'
   *    responses:
   *      200:
   *        description: The student has been successfully updated
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/UpdateStudent'
   *      400:
   *        description: If it get a id of a student invalid
   *      500:
   *        description: If it fails to update student
   *    parameters:
   *       - name: id
   *         in: path
   */
  public updateStudent = async (req: Request, res: Response) => {
    if (!req.params.id) {
      error.E400(res, 'Missing id parameter');
      return;
    } if (!req.params.id.match(/^\d+$/)) {
      error.E400(res, 'Invalid id ( must be a number )');
      return;
    }
      await this._studentService
        .editStudent(Number(req.params.id), req.body)
        .then((data) => {
          success.S200(res, 'Student update successfully', data);
        })
        .catch(err => {
          this.handleErrors(err, res);
        });
  };

    /**
   * Modify a status student by id
   * @param req request
   * @param res response
   * @returns the updated student
   */
     public modifyStateStudent = async (req: Request, res: Response) => {
      if (!req.params.id) {
        error.E400(res, 'Missing id parameter');
        return;
      } if (!req.params.id.match(/^\d+$/)) {
        error.E400(res, 'Invalid id ( must be a number )');
        return;
      }
        await this._studentService
          .modifyStateStudent(Number(req.params.id), req.body)
          .then((data) => {
            success.S200(res, 'Student modify successfully', data);
          })
          .catch(err => {
            this.handleErrors(err, res);
          });
    };

  /**
   * @openapi
   * /students/{id}:
   *  delete:
   *    tags:
   *      - Students
   *    summary: Delete a student by id
   *    responses:
   *      200:
   *        description: If it gets all students successfully
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/DeleteStudent'
   *      400:
   *        description: If it get a id of a students invalid
   *      500:
   *        description: If it fails to delete students
   *    parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: Id of student to delete
   
   */
   public deleteStudent = async (req: Request, res: Response) => {
    if (!req.params.id) {
      error.E400(res, 'Missing id parameter');
      return;
    }
    if (!req.params.id.match(/^\d+$/)) {
      error.E400(res, 'Invalid id ( must be a number )');
      return;
    }
    await this._studentService
      .delete(Number(req.params.id))
      .then(data => {
        success.S200(res, 'Student deleted successfully', data);
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
        case 'Student not found':
          error.E404(res, err.message);
          break;
        case 'Student already exists':
          error.E409(res, err.message);
          break;
        default:
          error.E500(res, err.message);
          break;
      }
    }
}

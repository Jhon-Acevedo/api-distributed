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
    this.router.get(
      `${this.path}/NumberAndTypeDoc/:doc/:type`,
      this.getByNumberAndTypeDoc
    );
    this.router.post(this.path, this.createStudent);
    this.router.put(`${this.path}/:id`, this.updateStudent);
    this.router.patch(`${this.path}/:id`, this.modifyStateStudent);
    this.router.delete(`${this.path}/:id`, this.deleteStudent);
    this.router.delete(this.path, (_, res) => {
      error.E405(res, 'Method not allowed');
    });
  }

  /**
   * @openapi
   * components:
   *  schemas:
   *     CreateStudent:
   *       type: object
   *       required:
   *         - id
   *         - document_number
   *         - document_type
   *         - name
   *         - surname
   *         - student_code
   *         - email
   *         - state
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
   *        id: 1656383737153
   *        document_number: 123456789
   *        document_type: CC
   *        name: John
   *        surname: Doe
   *        student_code: 123456789
   *        email: jhon.doe@uptc.edu.co
   *        state: true
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
   * /students:
   *  get:
   *    tags:
   *      - Students
   *    summary: Gets all students
   *    responses:
   *      200:
   *        description: If it gets all students successfully
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/CreateStudent'
   *      500:
   *        description: If it fails to get all students
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   */
  public getAll = async (req: Request, res: Response) => {
    await this._studentService
      .getAll()
      .then(data => {
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
   *      - Student
   *    summary: Gets subjects by id
   *    responses:
   *      200:
   *        description: If subject is found
   *        content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateStudent'
   *      400:
   *        description: If id is not a number
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *      404:
   *        description: If the subject does not exist
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *    parameters:
   *      - name: id
   *        in: path
   *        required: true
   *        description: ID of the student
   *        schema:
   *          type: number
   *          example: 1656383737153
   */
  public getById = async (req: Request, res: Response) => {
    if (!req.params.id) {
      error.E400(res, 'Missing id parameter');
      return;
    }
    if (!req.params.id.match(/^\d+$/)) {
      error.E400(res, 'Invalid id ( must be a number )');
      return;
    }
    await this._studentService
      .getById(Number(req.params.id))
      .then(data => {
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
   *        description: If it gets a student_code of a students invalid
   *      404:
   *        description: The student_code of a students not found
   *    parameters:
   *      - name: student_code
   *        in: path
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
    }
    if (!req.params.student_code.match(/^\d+$/)) {
      error.E400(res, 'Invalid id ( must be a number )');
      return;
    }
    await this._studentService
      .getByStudentCode(String(req.params.student_code))
      .then(data => {
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
   *        description: If it gets a doc && type of students invalid
   *      404:
   *        description: Students not found
   *    parameters:
   *      - name: doc
   *        in: path
   *        required: true
   *        description: Document number
   *        schema:
   *          type: string
   *          example: 1111
   *      - name: type
   *        in: path
   *        required: true
   *        description: Document type
   *        schema:
   *          type: string
   *          example: CC
   */
  public getByNumberAndTypeDoc = async (req: Request, res: Response) => {
    if (!req.params.doc) {
      error.E400(res, 'Missing id parameter');
      return;
    }
    if (!req.params.type) {
      error.E400(res, 'Missing id parameter');
      return;
    }
    if (req.params.doc.match(/^\d+$/)) {
      await this._studentService
        .getByNumberAndTypeDoc(String(req.params.doc), String(req.params.type))
        .then((data: Student) => {
          success.S200(res, 'Get student by doc && type successfully', data);
        })
        .catch((err: Error) => {
          this.handleErrors(err, res);
        });
    }
  };

  /**
   * @openapi
   * /student:
   *  post:
   *    tags:
   *      - Student
   *    summary: Create a student
   *
   *    requestBody:
   *     description: Optional description in *markdown*
   *     required: true
   *     content:
   *       application/json:
   *         schema:
   *           $ref: '#/components/schemas/CreateStudent'
   *    responses:
   *      200:
   *        description: Created Student
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateStudent'
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
   *      409:
   *        description: Conflict
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *      500:
   *        description: Failed to create student
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   */
  public createStudent = async (req: Request, res: Response) => {
    console.log(req.body);
    if (!req.body.name) {
      error.E400(res, 'Missing body parameter');
      return;
    }
    await this._studentService
      .create(req.body)
      .then(data => {
        success.S201(res, 'Student created successfully', data);
      })
      .catch(err => {
        this.handleErrors(err, res);
      });
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
   *           $ref: '#/components/schemas/CreateStudent'
   *    responses:
   *      200:
   *        description: The subjects has been successfully updated
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateStudent'
   *      400:
   *        description: If the body is not a valid JSON
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *      404:
   *        description: If the subject does not exist
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *      500:
   *        description: If it fails to update subjects
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *    parameters:
   *       - name: id
   *         in: path
   *         description: The ID of the student to update
   *         required: true
   *         schema:
   *           type: number
   *           example: 1656383737153
   *

   */
  public updateStudent = async (req: Request, res: Response) => {
    if (!req.params.id) {
      error.E400(res, 'Missing id parameter');
      return;
    }
    if (!req.params.id.match(/^\d+$/)) {
      error.E400(res, 'Invalid id ( must be a number )');
      return;
    }
    await this._studentService
      .editStudent(Number(req.params.id), req.body)
      .then(data => {
        success.S200(res, 'Student update successfully', data);
      })
      .catch(err => {
        this.handleErrors(err, res);
      });
  };

  /**
   * @openapi
   * /students/{id}:
   *  patch:
   *    tags:
   *      - Student
   *    summary: Change state of student
   *    requestBody:
   *     description: Optional description in *markdown*
   *     required: true
   *     content:
   *       application/json:
   *         schema:
   *           $ref: '#/components/schemas/CreateStudent'
   *    responses:
   *      200:
   *        description: The subjects has been successfully updated
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateStudent'
   *      400:
   *        description: If the parameter is not valid
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *      404:
   *        description: If the subject does not exist
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *      500:
   *        description: If it fails to update student state
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ErrorHTTP'
   *    parameters:
   *       - name: id
   *         in: path
   *         description: The ID of the student to change state
   *         required: true
   *         schema:
   *           type: number
   *           example: 1656383737153
   *

   */
  public modifyStateStudent = async (req: Request, res: Response) => {
    if (!req.params.id) {
      error.E400(res, 'Missing id parameter');
      return;
    }
    if (!req.params.id.match(/^\d+$/)) {
      error.E400(res, 'Invalid id ( must be a number )');
      return;
    }
    await this._studentService
      .modifyStateStudent(Number(req.params.id), req.body)
      .then(data => {
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

import SubjectService from '../services/SubjectService';
import { IController } from './IController';
import { Request, Response, Router } from 'express';

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
   * components:
   *  schemas:
   *     CreateSubject:
   *       type: object
   *       required:
   *         - id
   *         - name
   *         - credits
   *         - code
   *         - slots
   *         - availableSlots
   *         - status
   *         
   *       properties:
   *         id:
   *           type: number
   *           description: ID of the subject
   *           format: int64
   *           required: true
   *         name:
   *           type: string
   *           description: Name of the subject
   *           format: varchar2
   *           required: true
   *         code:
   *           type: string
   *           description: Code of the subject
   *           format: varchar2
   *           required: true
   *         slots:
   *           type: number
   *           description: Number of maximum slots of the subject
   *           format: int64
   *           required: true
   *         availableSlots:
   *           type: number
   *           description: Available slots of the subject
   *           format: int64
   *           required: true
   *         credits:
   *           type: number
   *           description: Number of credits of the subject
   *           format: int64
   *           required: true
   *         status:
   *           type: boolean
   *           description: Status of the subject
   *           format: boolean
   *           required: true
   *       example:
   *         id: 1
	 *         name: Calculo
	 *         code: calculo12
	 *         slots: 20
	 *         availableSlots: 20
	 *         credits: 5
	 *         status: true
   * 
   *     DeleteSubject:
   *       type: object
   *       required:
   *         - id
   *       properties:       
   *         id:
   *           type: number
   *           description: ID of the subject
   *           format: int64
   *           required: true
   *       example:
   *         idSubject: 1
   * 
   *     UpdateSubject:
   *       type: object
   *       required:
   *         - id
   *         - name
   *         - credits
   *         - code
   *         - slots
   *         - availableSlots
   *         - status
   *         
   *       properties:
   *         id:
   *           type: number
   *           description: ID of the subject
   *           format: int64
   *           required: false
   *         name:
   *           type: string
   *           description: Name of the subject
   *           format: varchar2
   *           required: false
   *         code:
   *           type: string
   *           description: Code of the subject
   *           format: varchar2
   *           required: false
   *         slots:
   *           type: number
   *           description: Number of maximum slots of the subject
   *           format: int64
   *           required: false
   *         availableSlots:
   *           type: number
   *           description: Available slots of the subject
   *           format: int64
   *           required: false
   *         credits:
   *           type: number
   *           description: Number of credits of the subject
   *           format: int64
   *           required: false
   *         status:
   *           type: boolean
   *           description: Status of the subject
   *           format: boolean
   *           required: false
   *       example:
   *         id: 12
	 *         name: Calculo
	 *         code: calculo12
	 *         slots: 20
	 *         availableSlots: 20
	 *         credits: 5
	 *         status: true
   *  
   *     
   */

  /**
   * @openapi
   * /subjects:
   *  get:
   *    tags:
   *      - Subject
   *    summary: Gets all subjects
   *    responses:
   *      200:
   *        description: Gets all subjects successfully
   *      500:
   *        description: Fails to get all subjects
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
   * @openapi
   * /subjects/{id}:
   *  get:
   *    tags:
   *      - Subject
   *    summary: Gets subjects by id
   *    responses:
   *      200:
   *        description: Gets all subjects by id successfully
   *      400:
   *        description: If it get a id of a subjects invalid
   *      404:
   *        description: The id of a subjects not found
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: Id of subject
   *        schema:
   *          type: number
   *          example: 1
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
          this.handleErrors(err, res);
        });
    }
  };

  handleErrors(err: Error, res: Response) {
    switch (err.message) {
      case 'Subject not found':
        res.status(404).json(err);
        break;
      case 'Invalid id':
        res.status(400).json(err);
        break;
    }
  }

  /**
   * @openapi
   * /newSubject:
   *  post:
   *    tags:
   *      - Subject
   *    summary: Create a new subject
   * 
   *    requestBody:
   *     description: Optional description in *markdown*
   *     required: true
   *     content:
   *       application/json:
   *         schema:
   *           $ref: '#/components/schemas/CreateSubject'
   *    responses:
   *      200:
   *        description: The subject was successfully created
   *        content:
   *          application/json:
   *            schema:
   *              
   *      400:
   *        description: If it get a id of a subjects invalid
   *      500:
   *        description: If it fails to creat subjects
   *        
   *       
   
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
   * @openapi
   * /updateSubject:
   *  put:
   *    tags:
   *      - Subject
   *    summary: Update subject by id
   *    requestBody:
   *     description: Optional description in *markdown*
   *     required: true
   *     content:
   *       application/json:
   *         schema:
   *           $ref: '#/components/schemas/UpdateSubject'
   *    responses:
   *      200:
   *        description: The subjects has been successfully updated
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/UpdateSubject'
   *      400:
   *        description: If it get a id of a subjects invalid
   *      500:
   *        description: If it fails to update subjects
   *    parameters:
   *       - name: id
   *         in: path
   
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
   * @openapi
   * /deleteSubject:
   *  delete:
   *    tags:
   *      - Subject
   *    summary: Delete a subject by id
   *    requestBody:
   *     description: Optional description in *markdown*
   *     required: true
   *     content:
   *       application/json:
   *         schema:
   *           $ref: '#/components/schemas/DeleteSubject'
   *    responses:
   *      200:
   *        description: If it gets all subjects successfully
   *        content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/DeleteSubject'
   *      400:
   *        description: If it get a id of a subjects invalid
   *      500:
   *        description: If it fails to delete subjects
   *    parameters:
   *       - name: id
   *         in: path
   
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

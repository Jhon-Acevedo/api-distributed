import { Collection, MongoClient } from 'mongodb';
import IRegisterRepository from './IRegisterRepository';
import { IConnection } from '../connectionDB/IConnection';
import { Register } from '../models/Register';

export default class RegisterRepository implements IRegisterRepository {
  private _dbConnection: IConnection;
  private _db: Collection;

  constructor(dbConnection: IConnection) {
    this._dbConnection = dbConnection;
    this._dbConnection.connect();
    this._db = (this._dbConnection.client as MongoClient)
      .db(process.env.DB_NAME)
      .collection(process.env.REGISTRATION_COLLECTION_NAME as string);
  }

  /**
   * Create a new register in the database
   * @param register register to create
   * @returns the created register
   */
  async create(register: Register): Promise<Register> {
    const inserted = await this._db.insertOne(register);
    return (await this._db
      .findOne({ _id: inserted.insertedId })
      .then((result) => result)) as Register;
  }

  /**
   * Find a students from a subject the database by id_subject
   * @param subject_id subject_id of the subject to find
   * @returns array of id_students
   */
  async findStudentsBySubject(subject_id: number): Promise<any> {
    const subjects = await this._db.find({ idSubject: subject_id }).toArray();
    return subjects.map((register) => register.idStudent);
  }

  /**
   * Find a subjects from a subject the database by id_student
   * @param student_id subject_id of the subject to find
   * @returns array of id_subjects
   */
  async findSubjectsByStudent(student_id: number): Promise<any> {
    const student = await this._db.find({ idStudent: student_id }).toArray();
    return student.map((register) => register.idSubject);
  }

  /**
   * Delete a register from the database by student_id and subject_id
   * @param student_id student_id of the register to delete
   * @param subject_id subject_id of the register to delete
   * @returns the deleted subject
   */
  async delete(student_id: number, subject_id: number): Promise<Register> {
    return (await this._db
      .deleteOne({
        idStudent: student_id,
        idSubject: subject_id
      })
      .then((result) => result)) as Register;
  }

  /**
   * Find all register  in the database
   * @returns all register in the database
   */
  async findAll(): Promise<Register[]> {
    return (await this._db
      .find()
      .toArray()
      .then((result) => result)) as Register[];
  }
}

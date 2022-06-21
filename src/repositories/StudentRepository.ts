
import IStudentRepository from './IStudentRepository';
import { Collection, MongoClient } from 'mongodb';
import { IConnection } from '../connectionDB/IConnection';
import { Student } from '../models/Student';

export default class StudentRepository implements IStudentRepository {
    private _dbConnection: IConnection;
    private _db: Collection;
  
    constructor(dbConnection: IConnection) {
      this._dbConnection = dbConnection;
      this._dbConnection.connect();
      this._db = (this._dbConnection.client as MongoClient)
        .db(process.env.DB_NAME)
        .collection(process.env.STUDENT_COLLECTION_NAME as string);
    }

   /**
   * Find all students in the database
   * @returns all students in the database
   */
   async findAll(): Promise<Student[]> {
    return (await this._db
        .find()
        .toArray()
        .then((result) => {
           return result;
        })) as Student[];
   }

   /**
   * Find a student by id in the database
   * @param id id of the student to find
   * @returns the found student
   */
   async findById(id: number): Promise<Student> {
    return (await this._db.findOne({ id: id }).then((result) => {
      return result;
    })) as Student;
   }

   /**
   * Create a new student in the database
   * @param student student to create
   * @returns the created student
   */
   async create(student: Student): Promise<Student> {
    const inserted = await this._db.insertOne(student);
     return (await this._db
      .findOne({ _id: inserted.insertedId })
      .then((result) => result)) as Student;
   }

   
  /**
   * Update a student in the database
   * @param student new data of the student to update
   * @returns the updated student
   */
  async update(student: Student): Promise<Student> {
    await this._db.updateOne(
      { id: student.id },
      {
        $set: {
          document_number: student.document_number,
          document_type: student.document_type,
          name: student.name,
          surname: student.surname,
          student_code: student.student_code,
          email: student.email,
          state: student.state
        }
      }
    );
    return await this.findById(student.id);
  }

    /**
   * Delete a student from the database by id
   * @param id id of the student to delete
   * @returns the deleted student
   */
     async delete(id: number): Promise<Student> {
        const studentToDelete = this.findById(id);
        await this._db.deleteOne({ id: id }).then((result) => result);
        return studentToDelete;
      }




   


}
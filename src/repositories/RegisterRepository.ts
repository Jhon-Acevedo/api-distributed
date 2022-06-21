import {Collection, MongoClient} from "mongodb";
import IRegisterRepository from "./IRegisterRepository";
import {IConnection} from '../connectionDB/IConnection';
import {Register} from '../models/Register';

export default class RegisterRepository implements IRegisterRepository {

    private _dbConnection: IConnection;
    private _db: Collection;

    constructor(dbConnection: IConnection) {
        this._dbConnection = dbConnection;
        this._dbConnection.connect();
        this._db = (this._dbConnection.client as MongoClient)
            .db(process.env.DB_NAME)
            .collection(process.env.REGISTRATION_COLLECTION_NAME);
    }

    /**
     * Create a new register in the database
     * @param register register to create
     * @returns the created register
     */
    async create(register:Register): Promise<Register> {
        const inserted = await this._db.insertOne({register});
        return (await this._db
            .findOne({_id: inserted.insertedId})
            .then((result) => result)) as Register;
    }

    /**
     * Find a students from a subject the database by id_subject
     * @param subject_id subject_id of the subject to find
     * @returns array of students
     */
    async findStudentsBySubject(subject_id: number): Promise<number[]> {
        return Promise.resolve([]);
    }

    /**
     * Find a subjects from a subject the database by id_student
     * @param student_id subject_id of the subject to find
     * @returns array of id_subjects
     */
    async findSubjectsByStudent(student_id: number): Promise<number[]> {
        const students = await this._db.find({student_id}).toArray();
        return students.map((register) => register.subject_id);
    }

    // async removeStudent(student_id: number, subject_id: number): Promise<Register> {
    //     // return await this._db.deleteOne({student_id, subject_id});
    // }

}
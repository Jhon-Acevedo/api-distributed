import { Student } from "../models/Student";

export default interface IStudentRepository{
    findAll(): Promise<Student[]>;
    findById(id: number): Promise<Student>;
    create(subject: Student): Promise<Student>;
    update(subject: Student): Promise<Student>;
    delete(id: number): Promise<Student>;
}
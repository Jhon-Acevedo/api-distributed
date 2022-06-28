import { Student } from "../models/Student";

export default interface IStudentRepository{
    findAll(): Promise<Student[]>;
    findById(id: number): Promise<Student>;
    findByStudentCode(student_code: string): Promise<Student>;
    findByNumberAndTypeDoc(document_number: string, document_type: string): Promise<Student>;
    create(student: Student): Promise<Student>;
    update(student: Student): Promise<Student>;
    modifyStateStudent(student: Student): Promise<Student>;
    delete(id: number): Promise<Student>;
}
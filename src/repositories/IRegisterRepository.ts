import { Register } from '../models/Register';
import { Student } from '../models/Student';
import { Subject } from '../models/Subject';

export default interface IRegisterRepository {

  create(register: Register): Promise<Register>;

  findAll(): Promise<Register[]>;

  findById(student_id: number, subject_id: number): Promise<Register>;

  findSubjectsByStudent(student_id: number): Promise<any[]>;

  findStudentsBySubject(subject_id: number): Promise<any[]>;

  delete(student_id: number, subject_id: number): Promise<Register>;
}
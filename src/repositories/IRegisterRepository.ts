import { Register } from '../models/Register';
import { Student } from '../models/Student';
import { Subject } from '../models/Subject';

export default interface IRegisterRepository {

  create(register: Register): Promise<Register>;

  findAll(): Promise<Register[]>;

  findSubjectsByStudent(student_id: number): Promise<number[]>;

  findStudentsBySubject(subject_id: number): Promise<number[]>;

  delete(student_id: number, subject_id: number): Promise<Register>;
}
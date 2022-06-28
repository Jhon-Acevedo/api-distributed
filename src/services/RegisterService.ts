import IRegisterRepository from '../repositories/IRegisterRepository';
import { Register } from '../models/Register';
import { Subject } from '../models/Subject';
import { Student } from '../models/Student';
import IStudentRepository from '../repositories/IStudentRepository';
import ISubjectRepository from '../repositories/ISubjectRepository';

export default class RegisterService {
  private _registerRepository: IRegisterRepository;
  private _studentRepository: IStudentRepository;
  private _subjectRepository: ISubjectRepository;

  constructor(registerRepository: IRegisterRepository,
              studentRepository: IStudentRepository,
              subjectRepository: ISubjectRepository) {
    this._registerRepository = registerRepository;
    this._studentRepository = studentRepository;
    this._subjectRepository = subjectRepository;
  }

  /**
   * Get all registers from database
   * @returns all registers
   */
  async getAll(): Promise<Register[]> {
    return await this._registerRepository.findAll();
  }

  /**
   * Create a new register in the database
   * @param register student to create
   * @returns the created register
   */
  async create(register: Register): Promise<Register> {
    if (await this._studentRepository.findById(register.idStudent) === null) {
      throw new Error('Student not found');
    } else if (await this._subjectRepository.findById(register.idSubject) === null) {
      throw new Error('Subject not found');
    } else if (await this._registerRepository.findById(register.idStudent, register.idSubject) !== null) {
      throw new Error('Register already exists');
    } else {
      await this._subjectRepository.removeSlotAvailable(register.idSubject);
      return await this._registerRepository.create(register);
    }
  }

  /**
   * Find a subjects from a subject the database by id_student
   * @param student_id subject_id of the subject to find
   * @returns array of id_subjects
   */
  async findSubjectsByStudent(student_id: number): Promise<Subject[]> {
    if (await this._studentRepository.findById(student_id) === null) {
      throw new Error('Student not found');
    } else {
      return await this._subjectRepository.getSubjectsByIds(await this._registerRepository.findSubjectsByStudent(student_id));
    }
  }

  /**
   * Find a students from a subject the database by id_subject
   * @param subject_id subject_id of the subject to find
   * @returns array of students
   */
  async findStudentsBySubject(subject_id: number): Promise<number[]> {
    if (await this._subjectRepository.findById(subject_id) === null) {
      throw new Error('Subject not found');
    } else {
      return await this._registerRepository.findStudentsBySubject(subject_id);
    }
  }

  /**
   * Delete a register from the database by student_id and subject_id
   * @param student_id student_id of the register to delete
   * @param subject_id subject_id of the register to delete
   * @returns the deleted subject
   */
  async delete(student_id: number, subject_id: number): Promise<Register> {
    if (await this._studentRepository.findById(student_id) === null || await this._subjectRepository.findById(subject_id) === null) {
      throw new Error('Student or Subject not found');
    } else {
      await this._subjectRepository.addSlotAvailable(subject_id);
      return await this._registerRepository.delete(student_id, subject_id);
    }
  }

}
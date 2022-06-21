import IStudentRepository from '../repositories/IStudentRepository';
import { Student } from '../models/Student';

export default class StudentService {
  private _studentRepository: IStudentRepository;

  constructor(studentRepository: IStudentRepository) {
    this._studentRepository = studentRepository;
  }

  /**
   * Get all student from database
   * @returns all students
   */
  async getAll(): Promise<Student[]> {
    return await this._studentRepository.findAll();
  }

  /**
   * Get a student by id
   * @param id id of the student to get
   * @returns the found student
   */
  async getById(id: number): Promise<Student> {
    return await this._studentRepository.findById(id);
  }

  /**
   * Create a new student in the database
   * @param student student to create
   * @returns the created student
   */
  async create(student: Student): Promise<Student> {
    return await this._studentRepository.create(student);
  }

  /**
   * Delete a student from the database by id
   * @param id id of the student to delete
   * @returns the deleted student
   */
  async delete(id: number): Promise<Student> {
    return await this._studentRepository.delete(id);
  }

  /**
   * Update the name of a student
   * @param id id of the student to update
   * @param student new name of the student
   * @returns the updated student
   */
  async editStudent(id: number, student: Student): Promise<Student> {
    return await this._studentRepository.update(student);
  }
}
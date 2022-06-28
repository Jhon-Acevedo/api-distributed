import ISubjectRepository from '../repositories/ISubjectRepository';
import { Subject } from '../models/Subject';

export default class SubjectService {
  private _subjectRepository: ISubjectRepository;

  constructor(subjectRepository: ISubjectRepository) {
    this._subjectRepository = subjectRepository;
  }

  /**
   * Get all subjects from database
   * @returns all subjects
   */
  async getAll(): Promise<Subject[]> {
    return await this._subjectRepository.findAll();
  }

  /**
   * Get a subject by id
   * @param id id of the subject to get
   * @returns the found subject
   */
  async getById(id: number): Promise<Subject> {
    return await this._subjectRepository.findById(id);
  }

  /**
   * Create a new subject in the database
   * @param subject subject to create
   * @returns the created subject
   */
  async create(subject: Subject): Promise<Subject> {
    return await this._subjectRepository.create(subject);
  }

  /**
   * Delete a subject from the database by id
   * @param id id of the subject to delete
   * @returns the deleted subject
   */
  async delete(id: number): Promise<Subject> {
    return await this._subjectRepository.delete(id);
  }

  /**
   * Update the name of a subject
   * @param id id of the subject to update
   * @param subject new name of the subject
   * @returns the updated subject
   */
  async editSubject(id: number, subject: Subject): Promise<Subject> {
    return await this._subjectRepository.update(id, subject);
  }
}

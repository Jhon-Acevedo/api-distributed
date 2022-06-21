import { Subject } from '../models/Subject';

export default interface ISubjectRepository {
  findAll(): Promise<Subject[]>;
  findById(id: number): Promise<Subject>;
  create(subject: Subject): Promise<Subject>;
  update(subject: Subject): Promise<Subject>;
  delete(id: number): Promise<Subject>;
  editName(id: number, name: string): Promise<Subject>;
  changeTotalSlots(id: number, totalSlots: number): Promise<Subject>;
  removeSlotAvailable(id: number): Promise<Subject>;
  addSlotAvailable(id: number): Promise<Subject>;
}
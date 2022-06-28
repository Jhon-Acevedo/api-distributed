// noinspection TypeScriptValidateJSTypes

import ISubjectRepository from './ISubjectRepository';
import { Collection, MongoClient } from 'mongodb';
import { IConnection } from '../connectionDB/IConnection';
import { Subject } from '../models/Subject';

export default class SubjectRepository implements ISubjectRepository {
  private _dbConnection: IConnection;
  private _db: Collection;

  constructor(dbConnection: IConnection) {
    this._dbConnection = dbConnection;
    this._dbConnection.connect();
    this._db = (this._dbConnection.client as MongoClient)
      .db(process.env.DB_NAME)
      .collection(process.env.SUBJECT_COLLECTION_NAME as string);
  }

  /**
   * Add a slot to a subject
   * @param id id of the subject to add a slot
   * @returns the updated subject
   */
  // TODO: controls if it want to add a new slot, don't add if it's already full
  async addSlotAvailable(id: number): Promise<Subject> {
    await this.findById(id).then(subject => {
      if (subject.availableSlots >= subject.slots)
        throw new Error('Subject is already full');
      this._db.updateOne({ id: id }, { $inc: { availableSlots: 1 } });
    });
    return await this.findById(id);
  }

  /**
   * Change the total slots of a subject (only if it's less than the current total slots)
   * @param id id of the subject
   * @param totalSlots new total slots
   * @param availableSlots new available slots
   * @returns the updated subject
   */
  async changeTotalSlots(
    id: number,
    totalSlots: number,
    availableSlots: number
  ): Promise<Subject> {
    await this._db.updateOne(
      { id: id },
      { $set: { slots: totalSlots, availableSlots: availableSlots } }
    );
    return await this.findById(id);
  }

  async getAvailableSlots(id: number): Promise<number> {
    return (await this.findById(id).then(subject => subject.availableSlots)) as number;
  }

  /**
   * Create a new subject in the database
   * @param subject subject to create
   * @returns the created subject
   */
  async create(subject: Subject): Promise<Subject> {
    await this.exist(subject.id).then(exists => {
      if (exists) throw new Error('Subject already exists');
    });
    const inserted = await this._db.insertOne(subject);
    return (await this._db
      .findOne({ _id: inserted.insertedId })
      .then(result => result)) as Subject;
  }

  /**
   * Delete a subject from the database by id
   * @param id id of the subject to delete
   * @returns the deleted subject
   */
  async delete(id: number): Promise<Subject> {
    const subjectToDelete = await this.findById(id);
    await this._db.deleteOne({ id: id }).then(result => result);
    return subjectToDelete;
  }

  /**
   * Update the name of a subject
   * @param id id of the subject to update
   * @param name new name of the subject
   * @returns the updated subject
   */
  async editName(id: number, name: string): Promise<Subject> {
    await this.findById(id).then(() => {
      this._db.updateOne({ id: id }, { $set: { name: name } });
    });
    return await this.findById(id);
  }

  /**
   * Find all subjects in the database
   * @returns all subjects in the database
   */
  async findAll(): Promise<Subject[]> {
    return (await this._db
      .find()
      .toArray()
      .then(result => {
        return result;
      })) as Subject[];
  }

  /**
   * Find a subject by id in the database
   * @param id id of the subject to find
   * @returns the found subject
   */
  async findById(id: number): Promise<Subject> {
    return (await this._db.findOne({ id: id }).then(result => {
      if (result === null) throw new Error('Subject not found');
      return result;
    })) as Subject;
  }

  /**
   * Find if a subject exists in the database
   * @param id id of the subject to find
   */
  async exist(id: number): Promise<boolean> {
    return await this.findById(id)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Remove a slot from a subject (only if it's not already empty)
   * @param id id of the subject to remove a slot
   * @returns the updated subject
   */
  async removeSlotAvailable(id: number): Promise<Subject> {
    await this.findById(id).then(subject => {
      if (subject.availableSlots <= 0)
        throw new Error('Subject is already empty');
      this._db.updateOne({ id: id }, { $inc: { availableSlots: -1 } });
    });
    return await this.findById(id);
  }

  /**
   * Update a subject in the database
   * @param id id of the subject to update
   * @param subject new data of the subject to update
   * @returns the updated subject
   */
  async update(id: number, subject: Subject): Promise<Subject> {
    await this.findById(id).then(() => {
      this._db.updateOne({ id: id }, { $set: subject });
    });
    return await this.findById(subject.id);
  }

  /**
   * Get list of subjects by id
   * @param ids list of ids of the subjects to get
   */
  async getSubjectsByIds(ids: number[]): Promise<Subject[]> {
    return (await this._db
      .find({ id: { $in: ids } })
      .toArray()
      .then(result => {
        return result;
      })) as Subject[];
  }
}

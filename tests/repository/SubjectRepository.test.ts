import SubjectRepository from '../../src/repositories/SubjectRepository';
import ConnectionMongo from '../../src/connectionDB/ConnectionMongo';
import { Subject } from '../../src/models/Subject';
import ISubjectRepository from '../../src/repositories/ISubjectRepository';
import { IConnection } from '../../src/connectionDB/IConnection';

describe('SubjectRepository', () => {
  let subjectRepository: ISubjectRepository;
  let dbConnection: IConnection;
  let subject: Subject;

  beforeEach(async () => {
    dbConnection = new ConnectionMongo();
    [subjectRepository] = await Promise.all([
      new SubjectRepository(dbConnection)
    ]);
    subject = {
      id: new Date().valueOf(),
      name: 'Test',
      code: 'code',
      slots: 10,
      availableSlots: 10,
      credits: 5,
      status: false
    } as Subject;
  });

  afterEach(async () => {
    await dbConnection.disconnect();
  });

  it('should be defined', () => {
    expect(subjectRepository).toBeDefined();
  });

  it('should be able to create a new subject', async () => {
    await subjectRepository.create(subject);
    const result = await subjectRepository.findAll();
    expect(result).toContainEqual(subject);
    await subjectRepository.delete(subject.id);
  });

  it('should be able to find a subject by id', async () => {
    await subjectRepository.create(subject);
    const result = await subjectRepository.findById(subject.id);
    expect(result).toEqual(subject);
    await subjectRepository.delete(subject.id);
  });

  it('should be able to update a subject', async () => {
    await subjectRepository.create(subject);
    const result = await subjectRepository.findById(subject.id);
    expect(result).toEqual(subject);
    subject.code = 'newCode';
    await subjectRepository.update(subject);
    const result2 = await subjectRepository.findById(subject.id);
    expect(result2).toEqual(subject);
    await subjectRepository.delete(subject.id);
  });

  it('should be able to delete a subject', async () => {
    await subjectRepository.create(subject);
    const result = await subjectRepository.findById(subject.id);
    expect(result).toEqual(subject);
    await subjectRepository.delete(subject.id);
    const result2 = await subjectRepository.findById(subject.id);
    expect(result2).toBeNull();
  });

  it('should be able to edit a subject name', async () => {
    await subjectRepository.create(subject);
    const result = await subjectRepository.findById(subject.id);
    expect(result).toEqual(subject);
    subject.name = 'NewName';
    await subjectRepository.editName(subject.id, subject.name);
    const result2 = await subjectRepository.findById(subject.id);
    expect(result2).toEqual(subject);
    await subjectRepository.delete(subject.id);
  });

  it('should be able to change a subject total slots', async () => {
    await subjectRepository.create(subject);
    const result = await subjectRepository.findById(subject.id);
    expect(result).toEqual(subject);
    subject.slots = 20;
    await subjectRepository.changeTotalSlots(subject.id, subject.slots);
    const result2 = await subjectRepository.findById(subject.id);
    expect(result2).toEqual(subject);
    await subjectRepository.delete(subject.id);
  });

  it('should be able to remove a slot available', async () => {
    await subjectRepository.create(subject);
    const result = await subjectRepository.findById(subject.id);
    expect(result).toEqual(subject);
    await subjectRepository.removeSlotAvailable(subject.id);
    subject.availableSlots = subject.availableSlots - 1;
    const result2 = await subjectRepository.findById(subject.id);
    expect(result2).toEqual(subject);
    await subjectRepository.delete(subject.id);
  });

  it('should be able to add a slot available', async () => {
    await subjectRepository.create(subject);
    const result = await subjectRepository.findById(subject.id);
    expect(result).toEqual(subject);
    await subjectRepository.addSlotAvailable(subject.id);
    subject.availableSlots++;
    const result2 = await subjectRepository.findById(subject.id);
    expect(result2).toEqual(subject);
    await subjectRepository.delete(subject.id);
  });

  it('should be able to change a subject credits', async () => {
    await subjectRepository.create(subject);
    const result = await subjectRepository.findById(subject.id);
    expect(result).toEqual(subject);
    subject.credits = 10;
    await subjectRepository.delete(subject.id);
  });
});

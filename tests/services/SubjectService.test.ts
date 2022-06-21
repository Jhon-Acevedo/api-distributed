import SubjectRepository from '../../src/repositories/SubjectRepository';
import SubjectService from '../../src/services/SubjectService';
import { Subject } from '../../src/models/Subject';
import { IConnection } from '../../src/connectionDB/IConnection';
import ConnectionMongo from '../../src/connectionDB/ConnectionMongo';

describe('SubjectService', () => {
  let subjectService: SubjectService;
  let dbConnection: IConnection;
  let subject: Subject;

  beforeEach(() => {
    dbConnection = new ConnectionMongo();
    subjectService = new SubjectService(new SubjectRepository(dbConnection));
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

  it('should be able to create a new subject', async () => {
    await subjectService.create(subject);
    const result = await subjectService.getAll();
    expect(result).toContainEqual(subject);
    await subjectService.delete(subject.id);
  });

  it('should be defined', () => {
    expect(subjectService).toBeDefined();
  });

  it('should be able to get all subjects', async () => {
    const subject2 = {
      id: new Date().valueOf(),
      name: 'Test2',
      code: 'code2',
      slots: 10,
      availableSlots: 10,
      credits: 5,
      status: false
    } as Subject;
    await subjectService.create(subject);
    await subjectService.create(subject2);
    const result = await subjectService.getAll();
    expect(result).toContainEqual(subject);
    expect(result).toContainEqual(subject2);
    await subjectService.delete(subject.id);
  });

  it('should be able to get a subject by id', async () => {
    await subjectService.create(subject);
    const result = await subjectService.getById(subject.id);
    expect(result).toEqual(subject);
    await subjectService.delete(subject.id);
  });

  it('should be able to update a subject', async () => {
    await subjectService.create(subject);
    const result = await subjectService.getById(subject.id);
    expect(result).toEqual(subject);
    subject.code = 'newCode';
    await subjectService.editSubject(subject.id, subject);
    const result2 = await subjectService.getById(subject.id);
    expect(result2).toEqual(subject);
    await subjectService.delete(subject.id);
  });

  it('should be able to delete a subject', async () => {
    await subjectService.create(subject);
    const result = await subjectService.getById(subject.id);
    expect(result).toEqual(subject);
    await subjectService.delete(subject.id);
    const result2 = await subjectService.getById(subject.id);
    expect(result2).toBeNull();
  });
});

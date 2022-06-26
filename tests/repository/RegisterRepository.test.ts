import { IConnection } from '../../src/connectionDB/IConnection';
import { Register } from '../../src/models/Register';
import ConnectionMongo from '../../src/connectionDB/ConnectionMongo';
import RegisterRepository from '../../src/repositories/RegisterRepository';
import SubjectRepository from '../../src/repositories/SubjectRepository';
import StudentRepository from '../../src/repositories/StudentRepository';
import IRegisterRepository from '../../src/repositories/IRegisterRepository';
import ISubjectRepository from '../../src/repositories/ISubjectRepository';
import IStudentRepository from '../../src/repositories/IStudentRepository';

describe('RegisterRepository', () => {
  let registerRepository: IRegisterRepository;
  let subjectRepository: ISubjectRepository;
  let studentRepository: IStudentRepository;
  let dbConnection: IConnection;
  let register: Register;

  beforeEach(() => {
    dbConnection = new ConnectionMongo();
    registerRepository = new RegisterRepository(dbConnection);
    subjectRepository = new SubjectRepository(dbConnection);
    studentRepository = new StudentRepository(dbConnection);
    register = {
      idStudent: 1655829922404,
      idSubject: 1,
      dateRegister: new Date()
    } as Register;
  });

  afterEach(async () => {
    await dbConnection.disconnect();
  });

  it('should be defined', async () => {
    expect(registerRepository).toBeDefined();
  });

  it('should be able to create a new register', async () => {
    await registerRepository.create(register);
    const result = await registerRepository.findAll();
    expect(result).toContainEqual(register);
    await registerRepository.delete(register.idStudent, register.idSubject);  });

  it(' should be able to find a student by idSubject', async () => {
    await registerRepository.create(register);
    const result = await registerRepository.findSubjectsByStudent(register.idStudent);
    const expected = (await subjectRepository.findAll()).map(subject => {
      return subject.id;
    });
    expect(expected).toEqual(expect.arrayContaining(result));
    await registerRepository.delete(register.idStudent, register.idSubject);
  });

  it('should be able to find a student by idStudent', async () => {
    await registerRepository.create(register);
    const result = await registerRepository.findStudentsBySubject(register.idSubject);
    const expected = (await studentRepository.findAll()).map(student => {
      return student.id;
    });
    expect(expected).toEqual(expect.arrayContaining(result));
    await registerRepository.delete(register.idStudent, register.idSubject);
  });

});

import { IConnection } from '../../src/connectionDB/IConnection';
import { Register } from '../../src/models/Register';
import ConnectionMongo from '../../src/connectionDB/ConnectionMongo';
import RegisterService from '../../src/services/RegisterService';
import RegisterRepository from '../../src/repositories/RegisterRepository';
import SubjectRepository from '../../src/repositories/SubjectRepository';
import StudentRepository from '../../src/repositories/StudentRepository';
import { Student } from '../../src/models/Student';
import { Subject } from '../../src/models/Subject';

describe('RegisterService', () => {
  let registerService: RegisterService;
  let registerRepository: RegisterRepository;
  let subjectRepository: SubjectRepository;
  let studentRepository: StudentRepository;
  let dbConnection: IConnection;
  let register: Register;
  let student: Student;
  let subject: Subject;

  beforeEach(async () => {
    dbConnection = new ConnectionMongo();
    studentRepository = new StudentRepository(dbConnection);
    subjectRepository = new SubjectRepository(dbConnection);
    registerRepository = new RegisterRepository(dbConnection);
    registerService = new RegisterService(
      registerRepository,
      studentRepository,
      subjectRepository
    );
    subject = {
      id: 19999999,
      name: 'Calculo I',
      credits: 3,
      code: '1000MAT',
      slots: 3,
      availableSlots: 3,
      status: true
    };

    student = {
      id: 19999999,
      document_number: '123456789',
      document_type: 'CC',
      name: 'Juan',
      surname: 'Perez',
      student_code: '123456789',
      email: 'este@mail.com',
      state: true
    };
    register = {
      idStudent: student.id,
      idSubject: subject.id,
      dateRegister: new Date()
    } as Register;

    await studentRepository.create(student);
    await subjectRepository.create(subject);
  });

  afterEach(async () => {
    await studentRepository.delete(student.id).catch(() => console.log(''));
    await subjectRepository.delete(subject.id).catch(() => console.log(''));
    await dbConnection.disconnect();
  });

  it('should be defined', () => {
    expect(registerService).toBeDefined();
  }, 20000);

  it('should be able to create a new register', async () => {
    await subjectRepository.exist(subject.id).then(async exist => {
      if (!exist) {
        await subjectRepository.create(subject);
      }
    });
    await studentRepository.create(student);
    await registerService.create(register);
    const result = await registerService.getAll();
    expect(result).toContainEqual(register);
    await registerService.delete(register.idStudent, register.idSubject);
  }, 20000);
});

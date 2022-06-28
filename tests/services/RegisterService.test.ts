import { IConnection } from '../../src/connectionDB/IConnection';
import { Register } from '../../src/models/Register';
import ConnectionMongo from '../../src/connectionDB/ConnectionMongo';
import RegisterService from '../../src/services/RegisterService';
import RegisterRepository from '../../src/repositories/RegisterRepository';
import SubjectRepository from '../../src/repositories/SubjectRepository';
import StudentRepository from '../../src/repositories/StudentRepository';
import { Student } from '../../src/models/Student';
import { Subject } from '../../src/models/Subject';
import StudentService from '../../src/services/StudentService';
import SubjectService from '../../src/services/SubjectService';

describe('RegisterService', () => {
  let registerService: RegisterService;
  let studentService: StudentService;
  let subjectService: SubjectService;
  let dbConnection: IConnection;
  let register: Register;
  let student: Student;
  let subject: Subject;

  beforeEach(() => {
    dbConnection = new ConnectionMongo();
    registerService = new RegisterService(
      new RegisterRepository(dbConnection),
      new StudentRepository(dbConnection),
      new SubjectRepository(dbConnection)
    );
    studentService = new StudentService(new StudentRepository(dbConnection));
    subjectService = new SubjectService(new SubjectRepository(dbConnection));

    student = {
      id: 1655829917379,
      document_number: '123456789',
      document_type: 'CC',
      name: 'Juan',
      surname: 'Perez',
      student_code: '123456789',
      email: 'juan.perez@uptc.edu.co',
      state: true
    };

    subject = {
      id: 2,
      name: 'Calculo II',
      credits: 3,
      code: '1001CAL',
      slots: 3,
      availableSlots: 3,
      status: true
    };

    register = {
      idStudent: 1655829917379,
      idSubject: 2,
      dateRegister: new Date()
    } as Register;

    studentService.create(student);
    subjectService.create(subject);
  });

  afterEach(async () => {
    await dbConnection.disconnect();
  });

  it('should be defined', () => {
    expect(registerService).toBeDefined();
  },20000);

  it('should be able to create a new register', async () => {
    await registerService.create(register);
    const result = await registerService.getAll();
    expect(result).toContainEqual(register);
    await registerService.delete(register.idStudent, register.idSubject);
  }, 20000);

  it(' should be able to find a student by idSubject', async () => {
    await registerService.create(register);
    const result = await registerService.findSubjectsByStudent(register.idStudent);
    const expected = (await subjectService.getAll()).map(subject => {
      return subject.id;
    });
    expect(expected).toEqual(expect.arrayContaining(result));
    await registerService.delete(register.idStudent, register.idSubject);
  }, 20000);

  it('should be able to find a student by idStudent', async () => {
    await registerService.create(register);
    const result = await registerService.findStudentsBySubject(register.idSubject);
    const expected = (await studentService.getAll()).map(student => {
      return student.id;
    });
    expect(expected).toEqual(expect.arrayContaining(result));
    await registerService.delete(register.idStudent, register.idSubject);
  },20000);

});

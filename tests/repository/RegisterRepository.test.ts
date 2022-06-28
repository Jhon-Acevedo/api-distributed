import { IConnection } from '../../src/connectionDB/IConnection';
import { Register } from '../../src/models/Register';
import ConnectionMongo from '../../src/connectionDB/ConnectionMongo';
import RegisterRepository from '../../src/repositories/RegisterRepository';
import SubjectRepository from '../../src/repositories/SubjectRepository';
import StudentRepository from '../../src/repositories/StudentRepository';
import IRegisterRepository from '../../src/repositories/IRegisterRepository';
import ISubjectRepository from '../../src/repositories/ISubjectRepository';
import IStudentRepository from '../../src/repositories/IStudentRepository';
import { Student } from '../../src/models/Student';
import { Subject } from '../../src/models/Subject';

describe('RegisterRepository', () => {
  let registerRepository: IRegisterRepository;
  let subjectRepository: ISubjectRepository;
  let studentRepository: IStudentRepository;
  let dbConnection: IConnection;
  let register: Register;
  let student: Student;
  let subject: Subject;

  beforeEach(async () => {
    dbConnection = new ConnectionMongo();

    subjectRepository = new SubjectRepository(dbConnection);
    studentRepository = new StudentRepository(dbConnection);
    registerRepository = new RegisterRepository(dbConnection);

    student = {
      id: 1655829922404,
      document_number: '123456789',
      document_type: 'CC',
      name: 'Juan',
      surname: 'Perez',
      student_code: '123456789',
      email: 'juan.perez@uptc.edu.co',
      state: true
    };

    subject = {
      id: 1999999,
      name: 'Calculo I',
      credits: 3,
      code: '1001CAL',
      slots: 3,
      availableSlots: 3,
      status: true
    };

    register = {
      idStudent: student.id,
      idSubject: subject.id,
      dateRegister: new Date()
    } as Register;
    await subjectRepository.create(subject);
    await studentRepository.create(student);
  });

  afterEach(async () => {
    await studentRepository.delete(student.id).catch(() => console.log(''));
    await subjectRepository.delete(subject.id).catch(() => console.log(''));
  });

  it('should be defined', async () => {
    expect(registerRepository).toBeDefined();
  });

  it('should be able to create a new register', async () => {
    await registerRepository.create(register);
    const result = await registerRepository.findAll();
    expect(result).toContainEqual(register);
    await registerRepository.delete(register.idStudent, register.idSubject);
  });

  it(' should be able to find a student by idSubject', async () => {
    await registerRepository.create(register);
    const result = await registerRepository.findSubjectsByStudent(
      register.idStudent
    );

    expect(result).toContain(subject.id);
    await registerRepository.delete(register.idStudent, register.idSubject);
  }, 10000);

  it('should be able to find a student by idStudent', async () => {
    await registerRepository.create(register);
    const result = await registerRepository.findStudentsBySubject(
      register.idSubject
    );
    const expected = (await studentRepository.findAll()).map(student => {
      return student.id;
    });
    expect(expected).toEqual(expect.arrayContaining(result));
    await registerRepository.delete(register.idStudent, register.idSubject);
  });
});

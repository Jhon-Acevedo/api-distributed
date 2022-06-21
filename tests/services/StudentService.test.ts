import StudentRepository from "../../src/repositories/StudentRepository";
import StudentService from "../../src/services/StudentService";
import { Student } from "../../src/models/Student";
import { IConnection } from '../../src/connectionDB/IConnection';
import ConnectionMongo from '../../src/connectionDB/ConnectionMongo';

describe('StudentService', () => {
    let studentService: StudentService;
    let dbConnection: IConnection;
    let student: Student;
  
    beforeEach(() => {
      dbConnection = new ConnectionMongo();
      studentService = new StudentService(new StudentRepository(dbConnection));
      student = {
        id: new Date().valueOf(),
        document_number: '11223344',
        document_type: "CC",
        name:'Pedro',
        surname:'Rodriguez',
        student_code:'1111',
        email:'pedro.rodriguez@uptc.edu.co',
        state:true
      } as Student;
    });
  
    afterEach(async () => {
      await dbConnection.disconnect();
    });

    it('should be defined', () => {
        expect(studentService).toBeDefined();
      });

    it('should be able to create a new student', async () => {
      await studentService.create(student);
      const result = await studentService.getAll();
      expect(result).toContainEqual(student);
      await studentService.delete(student.id);
    });

    it('should be able to get all student', async () => {
      const student2 = {
        id: new Date().valueOf(),
        document_number: '54321',
        document_type: "CC",
        name:'Lucia',
        surname:'Carrasco',
        student_code:'5555',
        email:'lucia.carrasco@uptc.edu.co',
        state:true
      } as Student;

      await studentService.create(student);
      await studentService.create(student2);
      const result = await studentService.getAll();
      expect(result).toContainEqual(student);
      expect(result).toContainEqual(student2);
      await studentService.delete(student.id);
    });
  
    it('should be able to get a student by id', async () => {
      await studentService.create(student);
      const result = await studentService.getById(student.id);
      expect(result).toEqual(student);
      await studentService.delete(student.id);
    });
  
    it('should be able to update a student', async () => {
      await studentService.create(student);
      const result = await studentService.getById(student.id);
      expect(result).toEqual(student);
      student.name = 'Rodolfo';
      await studentService.editStudent(student.id, student);
      const result2 = await studentService.getById(student.id);
      expect(result2).toEqual(student);
      await studentService.delete(student.id);
    });
  
    it('should be able to delete a student', async () => {
      await studentService.create(student);
      const result = await studentService.getById(student.id);
      expect(result).toEqual(student);
      await studentService.delete(student.id);
      const result2 = await studentService.getById(student.id);
      expect(result2).toBeNull();
    });
  });
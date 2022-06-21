import StudentRepository from "../../src/repositories/StudentRepository";
import ConnectionMongo from "../../src/connectionDB/ConnectionMongo";
import { Student } from "../../src/models/Student";
import IStudentRepository from "../../src/repositories/IStudentRepository";
import { IConnection } from "../../src/connectionDB/IConnection";

describe('StudentRepository', () => {
    let studentRepository: IStudentRepository;
    let dbConnection: IConnection;
    let student: Student;

    beforeEach(() => {
        dbConnection = new ConnectionMongo();
        studentRepository = new StudentRepository(dbConnection);
        student = {
            id: new Date().valueOf(),
            document_number: '123456',
            document_type: "CC",
            name:'Pepito',
            surname:'Peréz',
            student_code:'1242',
            email:'pepito1.perez@uptc.edu.co',
            state:true
        } as Student;
    });

    afterEach(async () => {
        await dbConnection.disconnect();
    });

    it('should be defined', async () => {
        expect(studentRepository).toBeDefined();
    });

    it('should be able to create a new student', async () => {
        await studentRepository.create(student);
        const result = await studentRepository.findAll();
        expect(result).toContainEqual(student);
        await studentRepository.delete(student.id);
      });
    
      it('should be able to find a student by id', async () => {
        await studentRepository.create(student);
        const result = await studentRepository.findById(student.id);
        expect(result).toEqual(student);
        await studentRepository.delete(student.id);
      });
    
      it('should be able to update a student', async () => {
        await studentRepository.create(student);
        const result = await studentRepository.findById(student.id);
        expect(result).toEqual(student);
        student.name = 'Juanito';
        await studentRepository.update(student);
        const result2 = await studentRepository.findById(student.id);
        expect(result2).toEqual(student);
        await studentRepository.delete(student.id);
      });
    
      it('should be able to delete a student', async () => {
        await studentRepository.create(student);
        const result = await studentRepository.findById(student.id);
        expect(result).toEqual(student);
        await studentRepository.delete(student.id);
        const result2 = await studentRepository.findById(student.id);
        expect(result2).toBeNull();
      });

});
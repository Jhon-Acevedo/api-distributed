import SubjectService from './services/SubjectService';
import SubjectRepository from './repositories/SubjectRepository';
import StudentService from './services/StudentService';
import StudentRepository from './repositories/StudentRepository';
import ConnectionMongo from './connectionDB/ConnectionMongo';

export const ServiceLocator = {
  getStudentService: () => {
    const dbConnection = new ConnectionMongo();
    const studentRepository = new StudentRepository(dbConnection);
    return new StudentService(studentRepository);
  },

  getSubjectService: () => {
    const dbConnection = new ConnectionMongo();
    const subjectRepository = new SubjectRepository(dbConnection);
    return new SubjectService(subjectRepository);
  }

};

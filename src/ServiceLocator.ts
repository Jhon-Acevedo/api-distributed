import SubjectService from './services/SubjectService';
import SubjectRepository from './repositories/SubjectRepository';
import ConnectionMongo from './connectionDB/ConnectionMongo';

export const ServiceLocator = {
  getSubjectService: () => {
    const dbConnection = new ConnectionMongo();
    const subjectRepository = new SubjectRepository(dbConnection);
    return new SubjectService(subjectRepository);
  }
};

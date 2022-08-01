import PostsController from './controllers/SubjectController';
import PostsStudentController from './controllers/StudentController';
import PostRegisterController from './controllers/RegisterController';
import { ServiceLocator } from './ServiceLocator';
import App from './app';
import GenericController from './controllers/GenericController';

const logService = ServiceLocator.getLogService()

export const server = new App(
  [
    new PostsController(ServiceLocator.getSubjectService(), logService),
    new PostsStudentController(ServiceLocator.getStudentService(), logService),
    new PostRegisterController(ServiceLocator.getRegisterService(), logService),
    new GenericController()
  ],
  5000
);

server.listen();

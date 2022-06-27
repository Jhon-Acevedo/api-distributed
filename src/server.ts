import PostsController from './controllers/SubjectController';
import PostsStudentController from './controllers/StudentController';
import PostRegisterController from './controllers/RegisterController';
import { ServiceLocator } from './ServiceLocator';
import App from './app';

export const server = new App(
  [
    new PostsController(ServiceLocator.getSubjectService()),
    new PostsStudentController(ServiceLocator.getStudentService()),
    new PostRegisterController(ServiceLocator.getRegisterService())
  ],
  5000
);

server.listen();

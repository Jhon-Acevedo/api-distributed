import PostsController from './controllers/SubjectController';
import PostsStudentController from './controllers/StudentController';
import { ServiceLocator } from './ServiceLocator';
import App from './app';

export const server = new App(
  [new PostsController(ServiceLocator.getSubjectService()),
   new PostsStudentController(ServiceLocator.getStudentService())],
  5000
);

server.listen();

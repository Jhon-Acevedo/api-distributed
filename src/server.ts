import PostsController from './controllers/SubjectController';
import { ServiceLocator } from './ServiceLocator';
import App from './app';

export const server = new App(
  [new PostsController(ServiceLocator.getSubjectService())],
  5000
);

server.listen();

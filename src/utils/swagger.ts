import { Express, Request, Response } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Academic API',
      version: version,
      description: 'API to manage academic information',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    }
  },
  apis: ['src/controllers/**/*.ts']
};

const swaggerDoc = swaggerJsDoc(options);

function swaggerRouter(app: Express) {
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}
export default swaggerRouter;

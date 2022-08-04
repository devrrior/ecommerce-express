import { Express, Request, Response } from 'express';
import swaggerJsDoc, { OAS3Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { version } from '../../../../package.json';
import logger from './logger';

const options: OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API Docs',
      description: 'REST API for Ecommerce',
      version,
    },
    servers: [
      {
        url: 'http://127.0.0.1:3000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          name: 'Authorization',
        },
      },
    },
  },
  apis: ['./src/api/v1/**/*.routes.ts', './src/api/v1/**/*.schema.ts'],
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app: Express, port: number) => {
  // Swagger page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('docs.json', (_: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  logger.info(`Swagger docs available at http://localhost:${port}/docs`);
};

export default swaggerDocs;

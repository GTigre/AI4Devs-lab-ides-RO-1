import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { Logger } from '../logging/Logger';
import candidateRoutes from './routes/candidate.routes';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api/candidates', candidateRoutes);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ATS API Documentation',
      version: '1.0.0',
      description: 'API documentation for the ATS (Applicant Tracking System)',
    },
    servers: [
      {
        url: 'http://localhost:3010',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/infrastructure/api/routes/*.ts'], // Path to the API routes
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  Logger.error('Unhandled error:', err);
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_SERVER_ERROR',
    },
  });
});

export default app; 
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { Logger } from '../logging/Logger';
import candidateRoutes from './routes/candidate.routes';
import authRoutes from './routes/auth.routes';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    Logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed'
    });
  }
});

// Mount routes
app.use('/api/candidates', candidateRoutes);
app.use('/auth', authRoutes);

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
        url: 'http://localhost:5000',
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
  if (err.stack) {
    console.error('Error stack:', err.stack);
  }
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_SERVER_ERROR',
      stack: err.stack || undefined,
    },
  });
});

export default app; 
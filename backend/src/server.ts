import app from './infrastructure/api/app';
import candidateRoutes from './infrastructure/api/routes/candidate.routes';
import { Logger } from './infrastructure/logging/Logger';

const PORT = process.env.PORT || 3001;

// Register routes
app.use('/api/candidates', candidateRoutes);

// Start server
app.listen(PORT, () => {
  Logger.info(`Server is running on port ${PORT}`);
  Logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
}); 
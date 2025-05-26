import app from './infrastructure/api/app';
import candidateRoutes from './infrastructure/api/routes/candidate.routes';
import authRoutes from './infrastructure/api/routes/auth.routes';
import { Logger } from './infrastructure/logging/Logger';

const PORT = process.env.PORT || 3001;

// Register routes
app.use('/api/candidates', candidateRoutes);
app.use('/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  Logger.info(`Server is running on port ${PORT}`);
  Logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
}); 
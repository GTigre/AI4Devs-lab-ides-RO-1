import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import app from './infrastructure/api/app';
import candidateRoutes from './infrastructure/api/routes/candidate.routes';
import authRoutes from './infrastructure/api/routes/auth.routes';
import { Logger } from './infrastructure/logging/Logger';

dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

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

// Create test users if they don't exist
async function createTestUsers() {
  try {
    // Check if test users already exist
    const existingCandidate = await prisma.user.findUnique({
      where: { email: 'candidate@example.com' }
    });

    const existingRecruiter = await prisma.user.findUnique({
      where: { email: 'recruiter@example.com' }
    });

    // Create candidate if not exists
    if (!existingCandidate) {
      const candidatePassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          email: 'candidate@example.com',
          password: candidatePassword,
          name: 'John Candidate',
          role: 'CANDIDATE',
          candidate: {
            create: {
              phone: '1234567890',
              location: 'New York',
              experience: '5 years',
              education: 'Bachelor in Computer Science'
            }
          }
        }
      });
      Logger.info('Test candidate user created');
    }

    // Create recruiter if not exists
    if (!existingRecruiter) {
      const recruiterPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          email: 'recruiter@example.com',
          password: recruiterPassword,
          name: 'Jane Recruiter',
          role: 'RECRUITER',
          recruiter: {
            create: {
              company: 'Tech Corp',
              position: 'Senior Recruiter'
            }
          }
        }
      });
      Logger.info('Test recruiter user created');
    }
  } catch (error) {
    Logger.error('Error creating test users:', error);
  }
}

// Create test users when server starts
createTestUsers();

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
});

// Protected route example
app.get('/api/profile', authenticateToken, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching profile', error });
  }
});

// Register routes
app.use('/api/candidates', candidateRoutes);
app.use('/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  Logger.info(`Server is running on port ${PORT}`);
  Logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

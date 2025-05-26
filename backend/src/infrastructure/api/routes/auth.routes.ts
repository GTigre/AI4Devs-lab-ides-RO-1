import express from 'express';
import { UserRole } from '../../../domain/entities/User';
import { Logger } from '../../logging/Logger';

const router = express.Router();

// Mock users for testing
const users = [
  {
    id: '1',
    email: 'candidate@example.com',
    password: 'Candidate123!',
    name: 'John Candidate',
    role: UserRole.CANDIDATE
  },
  {
    id: '2',
    email: 'recruiter@example.com',
    password: 'Recruiter123!',
    name: 'Jane Recruiter',
    role: UserRole.RECRUITER
  }
];

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // In a real app, you would generate a JWT token here
  const token = 'mock-jwt-token';
  res.json({ user, token });
});

// Register endpoint
router.post('/register', (req, res) => {
  const { email, password, name, role } = req.body;

  // Check if user already exists
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user
  const newUser = {
    id: String(users.length + 1),
    email,
    password,
    name,
    role
  };

  users.push(newUser);
  Logger.info(`New user registered: ${email}`);

  // In a real app, you would generate a JWT token here
  const token = 'mock-jwt-token';
  res.status(201).json({ user: newUser, token });
});

export default router; 
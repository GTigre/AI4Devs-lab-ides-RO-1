import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { UserRole } from '../domain/entities/User';

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // Create candidate user
    const candidatePassword = await bcrypt.hash('password123', 10);
    const candidate = await prisma.user.create({
      data: {
        email: 'candidate@example.com',
        password: candidatePassword,
        name: 'John Candidate',
        role: UserRole.CANDIDATE,
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

    // Create recruiter user
    const recruiterPassword = await bcrypt.hash('password123', 10);
    const recruiter = await prisma.user.create({
      data: {
        email: 'recruiter@example.com',
        password: recruiterPassword,
        name: 'Jane Recruiter',
        role: UserRole.RECRUITER,
        recruiter: {
          create: {
            company: 'Tech Corp',
            position: 'Senior Recruiter'
          }
        }
      }
    });

    console.log('Test users created successfully:');
    console.log('Candidate:', candidate.email);
    console.log('Recruiter:', recruiter.email);
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers(); 
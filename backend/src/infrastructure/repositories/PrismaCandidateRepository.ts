import { PrismaClient, Candidate as PrismaCandidate } from '@prisma/client';
import { Candidate } from '../../domain/entities/Candidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { Logger } from '../logging/Logger';

export class PrismaCandidateRepository implements ICandidateRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(candidate: Candidate): Promise<Candidate> {
    try {
      const prismaCandidate = await this.prisma.candidate.create({
        data: {
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          email: candidate.email,
          phone: candidate.phone,
          country: candidate.country,
          address: candidate.address,
          education: candidate.education,
          experience: candidate.experience,
          processStatus: candidate.processStatus,
          cvUrl: candidate.cvUrl,
          consentAccepted: candidate.consentAccepted,
          consentAcceptedAt: candidate.consentAcceptedAt,
        },
      });
      return this.mapToDomain(prismaCandidate);
    } catch (error) {
      Logger.error('Error creating candidate in database', { error });
      throw error;
    }
  }

  async findById(id: string): Promise<Candidate | null> {
    try {
      const prismaCandidate = await this.prisma.candidate.findUnique({
        where: { id },
      });
      return prismaCandidate ? this.mapToDomain(prismaCandidate) : null;
    } catch (error) {
      Logger.error('Error finding candidate by ID in database', { error, id });
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    try {
      const prismaCandidate = await this.prisma.candidate.findUnique({
        where: { email },
      });
      return prismaCandidate ? this.mapToDomain(prismaCandidate) : null;
    } catch (error) {
      Logger.error('Error finding candidate by email in database', { error, email });
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Candidate | null> {
    try {
      const prismaCandidate = await this.prisma.candidate.findFirst({
        where: { userId },
      });
      return prismaCandidate ? this.mapToDomain(prismaCandidate) : null;
    } catch (error) {
      Logger.error('Error finding candidate by user ID in database', { error, userId });
      throw error;
    }
  }

  async update(id: string, candidateData: Partial<Candidate>): Promise<Candidate> {
    try {
      const prismaCandidate = await this.prisma.candidate.update({
        where: { id },
        data: {
          firstName: candidateData.firstName,
          lastName: candidateData.lastName,
          email: candidateData.email,
          phone: candidateData.phone,
          country: candidateData.country,
          address: candidateData.address,
          education: candidateData.education,
          experience: candidateData.experience,
          processStatus: candidateData.processStatus,
          cvUrl: candidateData.cvUrl,
          consentAccepted: candidateData.consentAccepted,
          consentAcceptedAt: candidateData.consentAcceptedAt,
        },
      });
      return this.mapToDomain(prismaCandidate);
    } catch (error) {
      Logger.error('Error updating candidate in database', { error, id });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.candidate.delete({
        where: { id },
      });
    } catch (error) {
      Logger.error('Error deleting candidate from database', { error, id });
      throw error;
    }
  }

  async list(): Promise<Candidate[]> {
    try {
      const prismaCandidates = await this.prisma.candidate.findMany();
      return prismaCandidates.map(this.mapToDomain);
    } catch (error) {
      Logger.error('Error listing candidates from database', { error });
      throw error;
    }
  }

  private mapToDomain(prismaCandidate: PrismaCandidate): Candidate {
    return new Candidate({
      id: prismaCandidate.id,
      firstName: prismaCandidate.firstName,
      lastName: prismaCandidate.lastName,
      email: prismaCandidate.email,
      phone: prismaCandidate.phone,
      country: prismaCandidate.country,
      address: prismaCandidate.address,
      education: prismaCandidate.education,
      experience: prismaCandidate.experience,
      processStatus: prismaCandidate.processStatus,
      cvUrl: prismaCandidate.cvUrl,
      consentAccepted: prismaCandidate.consentAccepted,
      consentAcceptedAt: prismaCandidate.consentAcceptedAt,
      createdAt: prismaCandidate.createdAt,
      updatedAt: prismaCandidate.updatedAt,
      deletedAt: prismaCandidate.deletedAt,
    });
  }
} 
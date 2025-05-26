import { Candidate } from '../../domain/entities/Candidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { ValidationError, NotFoundError, DuplicateError } from '../../domain/errors/ApplicationError';
import { Logger } from '../../infrastructure/logging/Logger';
import { ProcessStatus } from '@prisma/client';

export class CandidateService {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async createCandidate(candidateData: Omit<Candidate, 'id'>): Promise<Candidate> {
    Logger.info('Creating new candidate', { email: candidateData.email });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(candidateData.email)) {
      Logger.warn('Invalid email format', { email: candidateData.email });
      throw new ValidationError('Invalid email format');
    }

    // Check if email already exists
    const existingCandidate = await this.candidateRepository.findByEmail(candidateData.email);
    if (existingCandidate) {
      Logger.warn('Email already registered', { email: candidateData.email });
      throw new DuplicateError('Email already registered');
    }

    // Validate phone number based on country
    // This is a simplified validation - in production, use a proper phone validation library
    if (!candidateData.phone || candidateData.phone.length < 8) {
      Logger.warn('Invalid phone number', { phone: candidateData.phone });
      throw new ValidationError('Invalid phone number');
    }

    try {
      // Create new candidate with IN_REVIEW status
      const candidate = new Candidate({
        ...candidateData,
        processStatus: 'IN_REVIEW',
        consentAcceptedAt: candidateData.consentAccepted ? new Date() : undefined,
      });

      const created = await this.candidateRepository.create(candidate);
      Logger.info('Candidate created successfully', { id: created.id });
      return created;
    } catch (error) {
      Logger.error('Error creating candidate', { error, candidateData });
      throw error;
    }
  }

  async getCandidateByUserId(userId: string): Promise<Candidate> {
    Logger.info('Fetching candidate by user ID', { userId });
    try {
      const candidate = await this.candidateRepository.findByUserId(userId);
      if (!candidate) {
        Logger.warn('Candidate not found for user', { userId });
        throw new NotFoundError('Candidate not found');
      }
      return candidate;
    } catch (error) {
      Logger.error('Error fetching candidate by user ID', { error, userId });
      throw error;
    }
  }

  async updateCandidateByUserId(userId: string, candidateData: Partial<Candidate>): Promise<Candidate> {
    Logger.info('Updating candidate by user ID', { userId });
    try {
      const existingCandidate = await this.candidateRepository.findByUserId(userId);
      if (!existingCandidate) {
        Logger.warn('Candidate not found for update', { userId });
        throw new NotFoundError('Candidate not found');
      }

      // Remove processStatus from update data for candidates
      const { processStatus, ...updateData } = candidateData;

      const updated = await this.candidateRepository.update(existingCandidate.id, updateData);
      Logger.info('Candidate updated successfully', { id: updated.id });
      return updated;
    } catch (error) {
      Logger.error('Error updating candidate by user ID', { error, userId });
      throw error;
    }
  }

  async getCandidate(id: string): Promise<Candidate> {
    Logger.info('Fetching candidate', { id });
    try {
      const candidate = await this.candidateRepository.findById(id);
      if (!candidate) {
        Logger.warn('Candidate not found', { id });
        throw new NotFoundError('Candidate not found');
      }
      return candidate;
    } catch (error) {
      Logger.error('Error fetching candidate', { error, id });
      throw error;
    }
  }

  async updateCandidate(id: string, candidateData: Partial<Candidate>): Promise<Candidate> {
    Logger.info('Updating candidate', { id });
    try {
      const existingCandidate = await this.candidateRepository.findById(id);
      if (!existingCandidate) {
        Logger.warn('Candidate not found for update', { id });
        throw new NotFoundError('Candidate not found');
      }

      // If email is being updated, check for duplicates
      if (candidateData.email && candidateData.email !== existingCandidate.email) {
        const emailExists = await this.candidateRepository.findByEmail(candidateData.email);
        if (emailExists) {
          Logger.warn('Email already registered during update', { email: candidateData.email });
          throw new DuplicateError('Email already registered');
        }
      }

      const updated = await this.candidateRepository.update(id, candidateData);
      Logger.info('Candidate updated successfully', { id });
      return updated;
    } catch (error) {
      Logger.error('Error updating candidate', { error, id, candidateData });
      throw error;
    }
  }

  async updateProcessStatus(id: string, status: ProcessStatus): Promise<Candidate> {
    Logger.info('Updating candidate process status', { id, status });
    try {
      const existingCandidate = await this.candidateRepository.findById(id);
      if (!existingCandidate) {
        Logger.warn('Candidate not found for status update', { id });
        throw new NotFoundError('Candidate not found');
      }

      const updated = await this.candidateRepository.update(id, { processStatus: status });
      Logger.info('Candidate status updated successfully', { id, status });
      return updated;
    } catch (error) {
      Logger.error('Error updating candidate status', { error, id, status });
      throw error;
    }
  }

  async deleteCandidate(id: string): Promise<void> {
    Logger.info('Deleting candidate', { id });
    try {
      const existingCandidate = await this.candidateRepository.findById(id);
      if (!existingCandidate) {
        Logger.warn('Candidate not found for deletion', { id });
        throw new NotFoundError('Candidate not found');
      }

      await this.candidateRepository.delete(id);
      Logger.info('Candidate deleted successfully', { id });
    } catch (error) {
      Logger.error('Error deleting candidate', { error, id });
      throw error;
    }
  }

  async listCandidates(): Promise<Candidate[]> {
    Logger.info('Listing all candidates');
    try {
      const candidates = await this.candidateRepository.list();
      Logger.info('Candidates listed successfully', { count: candidates.length });
      return candidates;
    } catch (error) {
      Logger.error('Error listing candidates', { error });
      throw error;
    }
  }
} 
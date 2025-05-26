import { PrismaClient, candidate } from '@prisma/client';
import { Candidate, CandidateProps } from '../../domain/entities/Candidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';

export class PrismaCandidateRepository implements ICandidateRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(candidate: Candidate): Promise<Candidate> {
    const data = candidate.toJSON();
    const created = await this.prisma.candidate.create({
      data: {
        ...data,
        id: undefined, // Let Prisma generate the ID
      },
    });
    return new Candidate(created as CandidateProps);
  }

  async findById(id: string): Promise<Candidate | null> {
    const found = await this.prisma.candidate.findUnique({
      where: { id },
    });
    return found ? new Candidate(found as CandidateProps) : null;
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    const found = await this.prisma.candidate.findUnique({
      where: { email },
    });
    return found ? new Candidate(found as CandidateProps) : null;
  }

  async update(id: string, candidateData: Partial<Candidate>): Promise<Candidate> {
    const data = candidateData.toJSON?.() || {};
    const updated = await this.prisma.candidate.update({
      where: { id },
      data,
    });
    return new Candidate(updated as CandidateProps);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.candidate.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async list(): Promise<Candidate[]> {
    const candidates = await this.prisma.candidate.findMany({
      where: { deletedAt: null },
    });
    return candidates.map((candidate) => new Candidate(candidate as CandidateProps));
  }
} 
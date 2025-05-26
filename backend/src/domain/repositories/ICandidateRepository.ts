import { Candidate } from '../entities/Candidate';

export interface ICandidateRepository {
  create(candidate: Candidate): Promise<Candidate>;
  findById(id: string): Promise<Candidate | null>;
  findByEmail(email: string): Promise<Candidate | null>;
  update(id: string, candidate: Partial<Candidate>): Promise<Candidate>;
  delete(id: string): Promise<void>;
  list(): Promise<Candidate[]>;
} 
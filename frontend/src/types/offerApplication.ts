import { ProcessStatus } from './candidate';

export interface OfferApplication {
  id: string;
  offerId: string;
  candidateId: string;
  processStatus: ProcessStatus;
  appliedAt: string;
  updatedAt?: string;
} 
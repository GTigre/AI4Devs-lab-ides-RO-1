export enum ProcessStatus {
  NEW = 'NEW',
  IN_REVIEW = 'IN_REVIEW',
  REJECTED = 'REJECTED',
  FINALIST = 'FINALIST',
  HIRED = 'HIRED'
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  education: string;
  experience: string;
  processStatus: ProcessStatus;
  cvUrl: string;
  consentAccepted: boolean;
  consentAcceptedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
} 
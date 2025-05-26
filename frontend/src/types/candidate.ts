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
  processStatus?: 'NEW' | 'IN_REVIEW' | 'DISCARDED' | 'FINALIST' | 'HIRED';
  cvUrl?: string;
  consentAccepted: boolean;
  consentAcceptedAt?: string;
} 
export enum UserRole {
  CANDIDATE = 'CANDIDATE',
  RECRUITER = 'RECRUITER'
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
} 
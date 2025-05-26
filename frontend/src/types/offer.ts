export interface Offer {
  id: string;
  title: string;
  description: string;
  location: string;
  requirements: string;
  dueDate: string; // ISO string
  createdAt?: string;
  updatedAt?: string;
} 
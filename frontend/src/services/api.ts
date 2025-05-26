import axios from 'axios';
import { Candidate, ProcessStatus } from '../types/candidate';
import { User, UserRole } from '../types/user';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string, name: string, role: UserRole) => {
  const response = await api.post('/auth/register', { email, password, name, role });
  return response.data;
};

// Candidate endpoints
export const listCandidates = async (): Promise<Candidate[]> => {
  const response = await api.get('/candidates');
  return response.data;
};

export const getCandidate = async (id: string): Promise<Candidate> => {
  const response = await api.get(`/candidates/${id}`);
  return response.data;
};

export const createCandidate = async (candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Candidate> => {
  const response = await api.post('/candidates', candidate);
  return response.data;
};

export const updateCandidate = async (id: string, candidate: Partial<Candidate>): Promise<Candidate> => {
  const response = await api.put(`/candidates/${id}`, candidate);
  return response.data;
};

export const deleteCandidate = async (id: string): Promise<void> => {
  await api.delete(`/candidates/${id}`);
};

export const updateProcessStatus = async (id: string, status: ProcessStatus): Promise<Candidate> => {
  const response = await api.put(`/candidates/${id}/status`, { status });
  return response.data;
};

// User profile endpoints
export const getMyProfile = async () => {
  const response = await api.get('/candidates/me');
  return response.data;
};

export const updateMyProfile = async (candidate: Partial<Candidate>) => {
  const response = await api.put('/candidates/me', candidate);
  return response.data;
};

export const uploadCv = async (id: string, file: File): Promise<Candidate> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/candidates/${id}/cv`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}; 
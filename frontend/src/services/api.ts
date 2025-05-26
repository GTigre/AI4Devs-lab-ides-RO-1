import axios from 'axios';
import { Candidate } from '../types/candidate';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

export const candidateApi = {
  getAll: async (): Promise<Candidate[]> => {
    const response = await api.get('/candidates');
    return response.data;
  },

  get: async (id: string): Promise<Candidate> => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  create: async (candidate: Omit<Candidate, 'id'>): Promise<Candidate> => {
    const response = await api.post('/candidates', candidate);
    return response.data;
  },

  update: async (id: string, candidate: Partial<Candidate>): Promise<Candidate> => {
    const response = await api.put(`/candidates/${id}`, candidate);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/candidates/${id}`);
  },

  uploadCv: async (id: string, file: File): Promise<Candidate> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/candidates/${id}/cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
}; 
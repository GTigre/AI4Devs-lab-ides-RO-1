import axios from 'axios';
import { Candidate, ProcessStatus } from '../types/candidate';
import { User, UserRole } from '../types/user';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 5000, // 5 second timeout
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('Unable to connect to the server. Please check if the server is running.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      throw new Error('Failed to make request');
    }
  }
);

// Health check
export const checkServerHealth = async () => {
  try {
    const response = await api.get('/health');
    if (response.data.status === 'ok') {
      return response.data;
    }
    throw new Error('Server health check failed');
  } catch (error: any) {
    console.error('Health check failed:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Server is not running. Please start the backend server.');
    }
    throw new Error('Server is not responding. Please check if the server is running.');
  }
};

// Auth endpoints
export const login = async (email: string, password: string) => {
  try {
    // First check if server is healthy
    await checkServerHealth();
    
    const response = await api.post('/api/login', { email, password });
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const register = async (candidate: any) => {
  const response = await api.post('/auth/register', candidate);
  return response.data;
};

// Candidate endpoints
export const listCandidates = async (): Promise<Candidate[]> => {
  const response = await api.get('/api/candidates');
  return response.data;
};

export const getCandidate = async (id: string): Promise<Candidate> => {
  const response = await api.get(`/api/candidates/${id}`);
  return response.data;
};

export const createCandidate = async (candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Candidate> => {
  const response = await api.post('/api/candidates', candidate);
  return response.data;
};

export const updateCandidate = async (id: string, candidate: Partial<Candidate>): Promise<Candidate> => {
  const response = await api.put(`/api/candidates/${id}`, candidate);
  return response.data;
};

export const deleteCandidate = async (id: string): Promise<void> => {
  await api.delete(`/api/candidates/${id}`);
};

export const updateProcessStatus = async (id: string, status: ProcessStatus): Promise<Candidate> => {
  const response = await api.put(`/api/candidates/${id}/status`, { status });
  return response.data;
};

// User profile endpoints
export const getMyProfile = async () => {
  const response = await api.get('/api/candidates/me');
  return response.data;
};

export const updateMyProfile = async (candidate: Partial<Candidate>) => {
  const response = await api.put('/api/candidates/me', candidate);
  return response.data;
};

export const uploadCv = async (id: string, file: File): Promise<Candidate> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/api/candidates/${id}/cv`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}; 
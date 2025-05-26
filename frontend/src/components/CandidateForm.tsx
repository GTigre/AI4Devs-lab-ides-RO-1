import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Candidate, ProcessStatus } from '../types/candidate';
import { UserRole } from '../types/user';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import { createCandidate, updateCandidate } from '../services/api';

interface CandidateFormProps {
  candidate?: Candidate;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({ candidate }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<Candidate>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    address: '',
    education: '',
    experience: '',
    processStatus: ProcessStatus.NEW,
    ...candidate
  });
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (e: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      processStatus: e.target.value as ProcessStatus
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (candidate) {
        await updateCandidate(candidate.id, formData as Candidate);
      } else {
        await createCandidate(formData as Candidate);
      }
      navigate('/candidates');
    } catch (err) {
      setError('Failed to save candidate');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {candidate ? 'Edit Candidate' : 'Add Candidate'}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            autoFocus
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          {user?.role === UserRole.RECRUITER && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="processStatus"
                value={formData.processStatus}
                label="Status"
                onChange={handleStatusChange}
              >
                {Object.values(ProcessStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {candidate ? 'Update' : 'Create'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/candidates')}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
}; 
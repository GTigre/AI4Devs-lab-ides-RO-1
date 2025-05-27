import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { createCandidate } from '../services/api';
import { Candidate, ProcessStatus } from '../types/candidate';

export const RegisterCandidate: React.FC = () => {
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
    consentAccepted: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.consentAccepted) {
      setError('Candidate must accept the consent to proceed.');
      return;
    }

    try {
      await createCandidate(formData as Candidate);
      setSuccess('Candidate registered successfully!');
      // Clear form after successful registration
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        address: '',
        education: '',
        experience: '',
        processStatus: ProcessStatus.NEW,
        consentAccepted: false
      });
    } catch (err: any) {
      setError(err.message || 'Failed to register candidate');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Register New Candidate
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
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
          <TextField
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="country"
            label="Country"
            name="country"
            autoComplete="country"
            value={formData.country}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="address"
            label="Address"
            name="address"
            autoComplete="street-address"
            value={formData.address}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="education"
            label="Education"
            name="education"
            value={formData.education}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="experience"
            label="Experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.consentAccepted}
                onChange={handleChange}
                name="consentAccepted"
                required
              />
            }
            label="I confirm that the candidate has accepted the data processing consent."
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register Candidate
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/recruiter')}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
}; 
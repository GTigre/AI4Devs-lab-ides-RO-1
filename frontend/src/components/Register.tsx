import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    country: '',
    address: '',
    education: '',
    experience: '',
    consentAccepted: false
  });
  const [error, setError] = useState('');
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const [registeredPassword, setRegisteredPassword] = useState('');

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
    if (!formData.consentAccepted) {
      setError('You must accept the consent to proceed.');
      return;
    }
    try {
      await register(formData);
      setRegisteredPassword(formData.password);
      setShowPasswordAlert(true);
    } catch (err) {
      setError('Registration failed. Please try again.');
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
          Sign up
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone"
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
            autoComplete="education"
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
            autoComplete="experience"
            value={formData.experience}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <Box display="flex" alignItems="center">
              <input
                type="checkbox"
                id="consentAccepted"
                name="consentAccepted"
                checked={formData.consentAccepted}
                onChange={handleChange}
                style={{ marginRight: 8 }}
              />
              <InputLabel htmlFor="consentAccepted" style={{ position: 'static', transform: 'none' }}>
                I accept the data processing consent.
              </InputLabel>
            </Box>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
          >
            Already have an account? Sign In
          </Button>
        </Box>
      </Box>
      {showPasswordAlert && (
        <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
          Your password is: {registeredPassword}
        </Alert>
      )}
    </Container>
  );
}; 
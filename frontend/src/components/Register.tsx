import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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

interface RegisterProps {
  isEditMode?: boolean;
}

export const Register: React.FC<RegisterProps> = ({ isEditMode = false }) => {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: UserRole.CANDIDATE
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode && user) {
      setFormData({
        email: user.email,
        password: '',
        name: user.name,
        role: user.role
      });
    }
  }, [isEditMode, user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (e: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      role: e.target.value as UserRole
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await register(formData.email, formData.password, formData.name, formData.role);
      navigate('/');
    } catch (err) {
      setError(isEditMode ? 'Profile update failed. Please try again.' : 'Registration failed. Please try again.');
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
          {isEditMode ? 'Update Profile' : 'Sign up'}
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
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
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
            disabled={isEditMode}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={isEditMode ? 'New Password (leave blank to keep current)' : 'Password'}
            type="password"
            id="password"
            autoComplete={isEditMode ? 'new-password' : 'new-password'}
            value={formData.password}
            onChange={handleChange}
          />
          {!isEditMode && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleRoleChange}
              >
                <MenuItem value={UserRole.CANDIDATE}>Candidate</MenuItem>
                <MenuItem value={UserRole.RECRUITER}>Recruiter</MenuItem>
              </Select>
            </FormControl>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isEditMode ? 'Update Profile' : 'Sign Up'}
          </Button>
          {!isEditMode && (
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
            >
              Already have an account? Sign In
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}; 
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Box, TextField, Button, Typography, Container, MenuItem, Alert, Checkbox, FormControlLabel } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { getMyProfile, updateMyProfile, uploadCv } from '../services/api';
import { Candidate, ProcessStatus } from '../types/candidate';

const processStatusOptions = [
  ProcessStatus.NEW,
  ProcessStatus.IN_REVIEW,
  ProcessStatus.REJECTED,
  ProcessStatus.FINALIST,
  ProcessStatus.HIRED,
];

export const CandidateProfileForm: React.FC = () => {
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
    cvUrl: '',
    consentAccepted: false,
    consentAcceptedAt: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile();
        setFormData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          phone: profile.phone || '',
          country: profile.country || '',
          address: profile.address || '',
          education: profile.education || '',
          experience: profile.experience || '',
          processStatus: profile.processStatus || ProcessStatus.NEW,
          cvUrl: profile.cvUrl || '',
          consentAccepted: profile.consentAccepted || false,
          consentAcceptedAt: profile.consentAcceptedAt || '',
        });
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCvChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleUploadCv = async () => {
    if (cvFile && user) {
      try {
        const updated = await uploadCv(user.id, cvFile);
        setFormData(prev => ({ ...prev, cvUrl: updated.cvUrl as string }));
        setSuccess('CV uploaded successfully!');
      } catch {
        setError('Failed to upload CV.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!formData.consentAccepted) {
      setError('You must accept the consent to proceed.');
      return;
    }
    try {
      await updateMyProfile(formData);
      setSuccess('Profile updated successfully!');
    } catch {
      setError('Failed to update profile.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Update My Work Profile</Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField margin="normal" required fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
          <TextField margin="normal" required fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
          <TextField margin="normal" required fullWidth label="Email" name="email" value={formData.email} disabled />
          <TextField margin="normal" required fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          <TextField margin="normal" required fullWidth label="Country" name="country" value={formData.country} onChange={handleChange} />
          <TextField margin="normal" required fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} />
          <TextField margin="normal" required fullWidth label="Education" name="education" value={formData.education} onChange={handleChange} />
          <TextField margin="normal" required fullWidth label="Experience" name="experience" value={formData.experience} onChange={handleChange} />
          <TextField margin="normal" fullWidth label="Process Status" name="processStatus" value={formData.processStatus} InputProps={{ readOnly: true }} select>
            {processStatusOptions.map(status => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </TextField>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Button variant="outlined" component="label">
              Upload CV
              <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleCvChange} />
            </Button>
            {cvFile && <Button sx={{ ml: 2 }} onClick={handleUploadCv}>Save CV</Button>}
            {formData.cvUrl && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Current CV: <a href={formData.cvUrl} target="_blank" rel="noopener noreferrer">View CV</a>
              </Typography>
            )}
          </Box>
          <FormControlLabel
            control={<Checkbox checked={!!formData.consentAccepted} onChange={handleChange} name="consentAccepted" required />}
            label="I accept the data processing consent."
          />
          {formData.consentAcceptedAt && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Consent accepted at: {new Date(formData.consentAcceptedAt).toLocaleString()}
            </Typography>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Update Profile
          </Button>
        </Box>
      </Box>
    </Container>
  );
}; 
import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const CandidateHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to your Candidate Dashboard
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2, mb: 2 }}
        onClick={() => navigate('/offers')}
      >
        Find Offers to Apply
      </Button>
      <Button
        variant="outlined"
        onClick={() => navigate('/profile')}
      >
        Update My Work Profile
      </Button>
    </Box>
  );
}; 
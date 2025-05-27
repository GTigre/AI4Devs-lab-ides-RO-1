import React from 'react';
import { Box, Typography, Button, Card, CardContent, CardActions, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const RecruiterDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: 8, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        Recruiter Dashboard
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Review Candidates</Typography>
              <Typography variant="body2">Review new candidate profiles that have registered over the platform.</Typography>
            </CardContent>
            <CardActions>
              <Button fullWidth variant="contained" onClick={() => navigate('/recruiter/review-candidates')}>
                Review Candidates
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">List Offers</Typography>
              <Typography variant="body2">List the offers registered over the platform and review candidates for each offer.</Typography>
            </CardContent>
            <CardActions>
              <Button fullWidth variant="contained" onClick={() => navigate('/recruiter/offers')}>
                List Offers
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Add Offer</Typography>
              <Typography variant="body2">Add a new offer with all required fields, including due date.</Typography>
            </CardContent>
            <CardActions>
              <Button fullWidth variant="contained" onClick={() => navigate('/recruiter/add-offer')}>
                Add Offer
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Register Candidate</Typography>
              <Typography variant="body2">Register a new candidate on their behalf with all required information.</Typography>
            </CardContent>
            <CardActions>
              <Button fullWidth variant="contained" onClick={() => navigate('/recruiter/register-candidate')}>
                Register Candidate
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 
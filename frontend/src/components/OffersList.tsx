import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Checkbox, Snackbar, Alert } from '@mui/material';

// Mock offers data
const offers = [
  { id: 1, title: 'Frontend Developer', company: 'Tech Corp', location: 'Remote' },
  { id: 2, title: 'Backend Developer', company: 'DataSoft', location: 'New York' },
  { id: 3, title: 'Full Stack Engineer', company: 'WebWorks', location: 'San Francisco' },
];

export const OffersList: React.FC = () => {
  const [checked, setChecked] = useState<{ [key: number]: boolean }>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState<string | null>(null);

  const handleCheck = (id: number) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApply = (offerTitle: string, id: number) => {
    if (checked[id]) {
      setAppliedOffer(offerTitle);
      setSnackbarOpen(true);
      setChecked((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <Box sx={{ mt: 8, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Job Offers
      </Typography>
      <List>
        {offers.map((offer) => (
          <ListItem key={offer.id} divider secondaryAction={
            <>
              <Checkbox
                checked={!!checked[offer.id]}
                onChange={() => handleCheck(offer.id)}
                inputProps={{ 'aria-label': 'Confirm quick apply' }}
              />
              <Button
                variant="contained"
                color="primary"
                disabled={!checked[offer.id]}
                onClick={() => handleApply(offer.title, offer.id)}
              >
                Quick Apply
              </Button>
            </>
          }>
            <ListItemText
              primary={offer.title}
              secondary={`${offer.company} - ${offer.location}`}
            />
          </ListItem>
        ))}
      </List>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          {appliedOffer ? `Applied to ${appliedOffer}!` : 'Applied!'}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/user';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Link
} from '@mui/material';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          LTI Recruitment Platform
        </Typography>
        {user ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {user.role === UserRole.RECRUITER && (
              <Button
                color="inherit"
                component={RouterLink}
                to="/candidates"
              >
                Candidates
              </Button>
            )}
            <Button
              color="inherit"
              component={RouterLink}
              to="/profile"
            >
              Profile
            </Button>
            <Button
              color="inherit"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/login"
            >
              Login
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/register"
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}; 
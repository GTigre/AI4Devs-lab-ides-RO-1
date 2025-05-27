import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Candidate, ProcessStatus } from '../types/candidate';
import { listCandidates, deleteCandidate, updateProcessStatus } from '../services/api';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export const CandidateList: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const data = await listCandidates();
      setCandidates(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch candidates');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await deleteCandidate(id);
        setCandidates(candidates.filter(c => c.id !== id));
      } catch (err) {
        setError('Failed to delete candidate');
      }
    }
  };

  const handleStatusChange = async (id: string, status: ProcessStatus) => {
    try {
      await updateProcessStatus(id, status);
      setCandidates(candidates.map(c => 
        c.id === id ? { ...c, processStatus: status } : c
      ));
    } catch (err) {
      setError('Failed to update status');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Candidates</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/candidates/new')}
        >
          Add Candidate
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>{candidate.firstName} {candidate.lastName}</TableCell>
                <TableCell>{candidate.email}</TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={candidate.processStatus}
                      onChange={(e: SelectChangeEvent) => 
                        handleStatusChange(candidate.id, e.target.value as ProcessStatus)
                      }
                    >
                      {Object.values(ProcessStatus).map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => navigate(`/candidates/${candidate.id}`)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(candidate.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 
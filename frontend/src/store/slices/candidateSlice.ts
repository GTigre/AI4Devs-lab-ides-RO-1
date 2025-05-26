import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Candidate } from '../../types/candidate';
import { candidateApi } from '../../services/api';

interface CandidateState {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
}

const initialState: CandidateState = {
  candidates: [],
  loading: false,
  error: null,
};

export const fetchCandidates = createAsyncThunk(
  'candidates/fetchAll',
  async () => {
    return await candidateApi.getAll();
  }
);

export const createCandidate = createAsyncThunk(
  'candidates/create',
  async (candidate: Omit<Candidate, 'id'>) => {
    return await candidateApi.create(candidate);
  }
);

export const updateCandidate = createAsyncThunk(
  'candidates/update',
  async ({ id, candidate }: { id: string; candidate: Partial<Candidate> }) => {
    return await candidateApi.update(id, candidate);
  }
);

export const deleteCandidate = createAsyncThunk(
  'candidates/delete',
  async (id: string) => {
    await candidateApi.delete(id);
    return id;
  }
);

export const uploadCv = createAsyncThunk(
  'candidates/uploadCv',
  async ({ id, file }: { id: string; file: File }) => {
    return await candidateApi.uploadCv(id, file);
  }
);

const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch candidates
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch candidates';
      })
      // Create candidate
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.candidates.push(action.payload);
      })
      // Update candidate
      .addCase(updateCandidate.fulfilled, (state, action) => {
        const index = state.candidates.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.candidates[index] = action.payload;
        }
      })
      // Delete candidate
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.candidates = state.candidates.filter((c) => c.id !== action.payload);
      })
      // Upload CV
      .addCase(uploadCv.fulfilled, (state, action) => {
        const index = state.candidates.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.candidates[index] = action.payload;
        }
      });
  },
});

export default candidateSlice.reducer; 
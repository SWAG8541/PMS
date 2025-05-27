import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/axiosInstance';

export const createSprint = createAsyncThunk(
  'sprints/create', 
  async (sprintData, { rejectWithValue }) => {
    try {
      const res = await API.post('/sprints', sprintData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create sprint');
    }
  }
);

export const fetchSprints = createAsyncThunk(
  'sprints/fetch', 
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/sprints/project/${projectId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch sprints');
    }
  }
);

const sprintSlice = createSlice({
  name: 'sprint',
  initialState: {
    sprints: [],
    loading: false,
    error: null
  },
  reducers: {
    clearSprintErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSprint.pending, (state) => { 
        state.loading = true;
        state.error = null;
      })
      .addCase(createSprint.fulfilled, (state, action) => {
        state.loading = false;
        state.sprints.push(action.payload);
      })
      .addCase(createSprint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSprints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSprints.fulfilled, (state, action) => {
        state.loading = false;
        state.sprints = action.payload;
      })
      .addCase(fetchSprints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSprintErrors } = sprintSlice.actions;
export default sprintSlice.reducer;
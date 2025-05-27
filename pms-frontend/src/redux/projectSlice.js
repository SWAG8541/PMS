import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/axiosInstance';

export const createProject = createAsyncThunk(
  'project/create', 
  async (projectData, { rejectWithValue }) => {
    try {
      const res = await API.post('/projects', projectData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create project');
    }
  }
);

export const fetchProjects = createAsyncThunk(
  'project/fetchAll', 
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/projects');
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch projects');
    }
  }
);

export const getProjectById = createAsyncThunk(
  'project/getById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/projects/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch project');
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState: { 
    projects: [], 
    currentProject: null,
    loading: false, 
    error: null 
  },
  reducers: {
    clearProjectErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create project cases
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch projects cases
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get project by ID cases
      .addCase(getProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProjectErrors } = projectSlice.actions;
export default projectSlice.reducer;
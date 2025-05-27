import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/axiosInstance';

export const createTask = createAsyncThunk(
  'tasks/create', 
  async (taskData, { rejectWithValue }) => {
    try {
      const res = await API.post('/tasks', taskData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create task');
    }
  }
);

export const fetchTasksBySprint = createAsyncThunk(
  'tasks/fetchBySprint', 
  async (sprintId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/tasks/sprint/${sprintId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch tasks');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/tasks/${taskId}/status`, { status });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update task status');
    }
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: [],
    loading: false,
    error: null
  },
  reducers: {
    clearTaskErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => { 
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTasksBySprint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksBySprint.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksBySprint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      });
  }
});

export const { clearTaskErrors } = taskSlice.actions;
export default taskSlice.reducer;
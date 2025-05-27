import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import projectReducer from './projectSlice';
import sprintReducer from './sprintSlice';
import taskReducer from './taskSlice';

// Load token from localStorage on app initialization
const preloadedState = {
  auth: {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  }
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    sprint: sprintReducer,
    task: taskReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/rejected', 'auth/register/rejected'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.error', 'project.error', 'sprint.error', 'task.error'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
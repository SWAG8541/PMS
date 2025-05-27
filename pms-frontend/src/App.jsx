import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { authSuccess } from './redux/authSlice';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import ProjectPage from './pages/ProjectPage';
import SprintPage from './pages/SprintPage';
import TaskPage from './pages/TaskPage';
import 'bootstrap/dist/css/bootstrap.min.css';

// Protected route component with improved navigation handling
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector(state => state.auth);
  const location = useLocation();
  
  if (!token) {
    // Redirect to login if not authenticated, but remember where user was trying to go
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }
  
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  
  // Check for token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Restore auth state from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        dispatch(authSuccess({ user, token }));
      } catch (error) {
        // Handle potential JSON parse error
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        console.error('Error restoring auth state:', error);
      }
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - redirect to dashboard if already logged in */}
        <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Project routes */}
        <Route path="/projects" element={
          <ProtectedRoute>
            <ProjectPage />
          </ProtectedRoute>
        } />
        <Route path="/projects/:projectId" element={
          <ProtectedRoute>
            <ProjectPage />
          </ProtectedRoute>
        } />
        
        {/* Sprint routes - updated for global sprints */}
        <Route path="/sprints" element={
          <ProtectedRoute>
            <SprintPage />
          </ProtectedRoute>
        } />
        <Route path="/sprints/:sprintId" element={
          <ProtectedRoute>
            <SprintPage />
          </ProtectedRoute>
        } />
        <Route path="/projects/:projectId/sprints" element={
          <ProtectedRoute>
            <SprintPage />
          </ProtectedRoute>
        } />
        
        {/* Task routes */}
        <Route path="/tasks" element={
          <ProtectedRoute>
            <TaskPage />
          </ProtectedRoute>
        } />
        <Route path="/tasks/:taskId" element={
          <ProtectedRoute>
            <TaskPage />
          </ProtectedRoute>
        } />
        <Route path="/projects/:projectId/tasks" element={
          <ProtectedRoute>
            <TaskPage />
          </ProtectedRoute>
        } />
        
        {/* Catch all route - redirect to dashboard if logged in, otherwise to login */}
        <Route path="*" element={
          token ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// src/components/projects/ProjectList.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, clearProjectErrors } from '../../redux/projectSlice';
import { Link } from 'react-router-dom';
import { Alert, Button, Spinner } from 'react-bootstrap';

const ProjectList = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.project);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
    
    // Clear any errors when component unmounts
    return () => {
      dispatch(clearProjectErrors());
    };
  }, [dispatch]);

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchProjects())
      .finally(() => setRefreshing(false));
  };

  if (loading && !refreshing) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading projects...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">My Projects</h2>
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span className="ms-2">Refreshing...</span>
            </>
          ) : 'Refresh'}
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => dispatch(clearProjectErrors())}>
          {typeof error === 'string' ? error : 'Failed to load projects. Please try again.'}
        </Alert>
      )}

      {projects.length === 0 && !loading ? (
        <Alert variant="info">
          No projects found. Create your first project to get started!
        </Alert>
      ) : (
        <div className="list-group">
          {projects.map((project) => (
            <Link 
              key={project._id} 
              to={`/projects/${project._id}`}
              className="list-group-item list-group-item-action"
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{project.name}</h5>
                <small>{new Date(project.createdAt).toLocaleDateString()}</small>
              </div>
              <p className="mb-1 text-muted">{project.description}</p>
              <small>Tasks: {project.taskCount || 0}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
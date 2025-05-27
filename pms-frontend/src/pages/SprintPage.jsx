import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Table, Badge, ButtonGroup } from 'react-bootstrap';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import API from '../utils/axiosInstance';

const SprintPage = () => {
  const { projectId, sprintId } = useParams();
  const { user, token } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [sprints, setSprints] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sprintDetails, setSprintDetails] = useState(null);
  const [sprintTasks, setSprintTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    projectId: projectId || ''
  });
  
  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    
    fetchProjects();
    
    if (sprintId) {
      fetchSprintDetails(sprintId);
    } else {
      fetchSprints();
    }
  }, [token, navigate, projectId, sprintId]);
  
  const fetchProjects = async () => {
    try {
      const response = await API.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };
  
  const fetchSprints = async () => {
    try {
      setLoading(true);
      // If projectId is provided, fetch sprints for that project
      // Otherwise fetch all sprints
      const endpoint = projectId ? `/sprints/project/${projectId}` : '/sprints';
      
      const response = await API.get(endpoint);
      setSprints(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch sprints');
      setLoading(false);
      console.error(err);
    }
  };
  
  const fetchSprintDetails = async (id) => {
    try {
      setLoading(true);
      const response = await API.get(`/sprints/${id}/details`);
      setSprintDetails(response.data.sprint);
      setSprintTasks(response.data.tasks);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch sprint details');
      setLoading(false);
      console.error(err);
    }
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/sprints', formData);
      
      // Add the new sprint to the list
      setSprints([...sprints, response.data]);
      
      // Reset form
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        projectId: projectId || ''
      });
    } catch (err) {
      setError('Failed to create sprint');
      console.error(err);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
    navigate('/');
  };

const getProjectName = (projectId) => {
  if (!projectId) return 'Global Task';
  
  // If projectId is an object with name property (already populated)
  if (typeof projectId === 'object' && projectId.name) {
    return projectId.name;
  }
  
  // If projectId is a string (ID reference)
  const project = projects.find(p => p._id === projectId);
  return project ? project.name : 'Unknown Project';
};

  const handleStatusChange = async (taskId, newStatus) => {
  try {
    const response = await API.put(`/tasks/${taskId}/status`, { status: newStatus });
    
    // Update task in the list
    const updatedTasks = sprintTasks.map(task => 
      task._id === taskId ? response.data : task
    );
    
    setSprintTasks(updatedTasks);
  } catch (err) {
    console.error('Failed to update task status:', err);
    setError('Failed to update task status');
  }
};


  // Render sprint details view
  if (sprintId) {
    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand as={Link} to="/dashboard">Project Management System</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/projects">Projects</Nav.Link>
                <Nav.Link as={Link} to="/sprints">Sprints</Nav.Link>
                <Nav.Link as={Link} to="/tasks">Tasks</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Item className="text-light d-flex align-items-center me-3">
                  Welcome, {user?.name || user?.email || 'User'}
                </Nav.Item>
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container>
          {loading ? (
            <p>Loading sprint details...</p>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>{sprintDetails?.name || 'Sprint Details'}</h1>
                <Button 
                  variant="secondary"
                  onClick={() => navigate('/sprints')}
                >
                  Back to Sprints
                </Button>
              </div>
              
              <Card className="mb-4">
                <Card.Header>Sprint Information</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Project:</strong> {sprintDetails?.projectId ? getProjectName(sprintDetails.projectId) : 'Global Sprint'}</p>
                      <p><strong>Start Date:</strong> {new Date(sprintDetails?.startDate).toLocaleDateString()}</p>
                      <p><strong>End Date:</strong> {new Date(sprintDetails?.endDate).toLocaleDateString()}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Created By:</strong> {sprintDetails?.createdBy?.name || sprintDetails?.createdBy?.email || 'Unknown'}</p>
                      <p><strong>Tasks:</strong> {sprintTasks.length}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <Card>
                <Card.Header>Sprint Tasks</Card.Header>
                <Card.Body>
                  {sprintTasks.length === 0 ? (
                    <p>No tasks in this sprint yet.</p>
                  ) : (
                   <Table striped bordered hover>
  <thead>
    <tr>
      <th>Task</th>
      <th>Project</th>
      <th>Status</th>
      <th>Priority</th>
      <th>Assigned To</th>
      <th>Created On</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {sprintTasks.map(task => (
      <tr key={task._id}>
        <td>{task.title}</td>
        <td>{getProjectName(task.projectId)}</td>
        <td>
          <Badge bg={
            task.status === 'To Do' ? 'secondary' : 
            task.status === 'In Progress' ? 'primary' : 
            'success'
          }>
            {task.status}
          </Badge>
        </td>
        <td>
          <Badge bg={
            task.priority === 'Low' ? 'success' : 
            task.priority === 'Medium' ? 'warning' : 
            'danger'
          }>
            {task.priority}
          </Badge>
        </td>
        <td>
          {task.assignedTo?.name || task.assignedTo?.email || 'Unassigned'}
        </td>
        <td>{new Date(task.createdAt).toLocaleDateString()}</td>
        <td>
          <ButtonGroup size="sm">
            <Button 
              variant={task.status === 'To Do' ? 'primary' : 'outline-primary'} 
              onClick={() => handleStatusChange(task._id, 'To Do')}
            >
              To Do
            </Button>
            <Button 
              variant={task.status === 'In Progress' ? 'primary' : 'outline-primary'} 
              onClick={() => handleStatusChange(task._id, 'In Progress')}
            >
              In Progress
            </Button>
            <Button 
              variant={task.status === 'Done' ? 'primary' : 'outline-primary'} 
              onClick={() => handleStatusChange(task._id, 'Done')}
            >
              Done
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    ))}
  </tbody>
</Table>
                  )}
                </Card.Body>
              </Card>
            </>
          )}
        </Container>
      </>
    );
  }

  // Render sprint list view
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/dashboard">Project Management System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/projects">Projects</Nav.Link>
              <Nav.Link as={Link} to="/sprints">Sprints</Nav.Link>
              <Nav.Link as={Link} to="/tasks">Tasks</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Item className="text-light d-flex align-items-center me-3">
                Welcome, {user?.name || user?.email || 'User'}
              </Nav.Item>
              <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <h1 className="mb-4">
          {projectId ? 'Project Sprints' : 'All Sprints'}
          {projectId && (
            <Button 
              variant="secondary" 
              size="sm" 
              className="ms-3"
              onClick={() => navigate('/projects')}
            >
              Back to Projects
            </Button>
          )}
        </h1>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <Row>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Header>Create New Sprint</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sprint Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Project (Optional)</Form.Label>
                    <Form.Select 
                      name="projectId" 
                      value={formData.projectId} 
                      onChange={handleChange}
                    >
                      <option value="">Global Sprint (No Project)</option>
                      {projects.map(project => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Leave empty to create a global sprint across all projects
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="startDate" 
                      value={formData.startDate} 
                      onChange={handleChange} 
                      required 
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="endDate" 
                      value={formData.endDate} 
                      onChange={handleChange} 
                      required 
                    />
                  </Form.Group>
                  
                  <Button variant="primary" type="submit">
                    Create Sprint
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={8}>
            <Card>
              <Card.Header>Sprint List</Card.Header>
              <Card.Body>
                {loading ? (
                  <p>Loading sprints...</p>
                ) : sprints.length === 0 ? (
                  <p>No sprints found. Create your first sprint!</p>
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Project</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sprints.map(sprint => (
                        <tr key={sprint._id}>
                          <td>{sprint.name}</td>
                          <td>{sprint.projectId ? getProjectName(sprint.projectId) : 'Global Sprint'}</td>
                          <td>{new Date(sprint.startDate).toLocaleDateString()}</td>
                          <td>{new Date(sprint.endDate).toLocaleDateString()}</td>
                          <td>
                            <Button 
                              variant="info" 
                              size="sm" 
                              className="me-2"
                              onClick={() => navigate(`/sprints/${sprint._id}`)}
                            >
                              View
                            </Button>
                            <Button 
                              variant="success" 
                              size="sm"
                              onClick={() => navigate(`/tasks?sprintId=${sprint._id}`)}
                            >
                              Tasks
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SprintPage;
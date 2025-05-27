import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import API from '../utils/axiosInstance';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const ProjectPage = () => {
  const { projectId } = useParams();
  const { user, token } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  
  // Fetch projects on component mount
  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    
    fetchProjects();
  }, [token, navigate]);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await API.get('/projects');
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch projects');
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
      const response = await API.post('/projects', formData);
      
      // Add the new project to the list
      setProjects([...projects, response.data]);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: ''
      });
    } catch (err) {
      setError('Failed to create project');
      console.error(err);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
    navigate('/');
  };

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
        <h1 className="mb-4">Projects</h1>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <Row>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Header>Create New Project</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange} 
                    />
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
                    Create Project
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={8}>
            <Card>
              <Card.Header>Your Projects</Card.Header>
              <Card.Body>
                {loading ? (
                  <p>Loading projects...</p>
                ) : projects.length === 0 ? (
                  <p>No projects found. Create your first project!</p>
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(project => (
                        <tr key={project._id}>
                          <td>{project.name}</td>
                          <td>{project.description}</td>
                          <td>{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</td>
                          <td>{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</td>
                          <td>
                            <Button 
                              variant="info" 
                              size="sm" 
                              className="me-2"
                              onClick={() => navigate(`/projects/${project._id}`)}
                            >
                              View
                            </Button>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              className="me-2"
                              onClick={() => navigate(`/projects/${project._id}/sprints`)}
                            >
                              Sprints
                            </Button>
                            <Button 
                              variant="success" 
                              size="sm"
                              onClick={() => navigate(`/projects/${project._id}/tasks`)}
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

export default ProjectPage;
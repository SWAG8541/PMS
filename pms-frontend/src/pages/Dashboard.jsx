import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { logout } from '../redux/authSlice';
import API from '../utils/axiosInstance';

const Dashboard = () => {
  const { user, token } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    projects: 0,
    sprints: 0,
    tasks: 0
  });
  
  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    
    // Fetch dashboard stats from API
    const fetchStats = async () => {
      try {
        const [projectsRes, sprintsRes, tasksRes] = await Promise.all([
          API.get('/projects'),
          API.get('/sprints'),
          API.get('/tasks')
        ]);
        
        setStats({
          projects: projectsRes.data.length,
          sprints: sprintsRes.data.length,
          tasks: tasksRes.data.length
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    
    fetchStats();
  }, [token, navigate]);
  
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
          <Navbar.Brand href="/dashboard">Project Management System</Navbar.Brand>
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
        <h1 className="mb-4">Dashboard</h1>
        
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center mb-3">
              <Card.Body>
                <Card.Title>{stats.projects}</Card.Title>
                <Card.Text>Total Projects</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center mb-3">
              <Card.Body>
                <Card.Title>{stats.sprints}</Card.Title>
                <Card.Text>Total Sprints</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center mb-3">
              <Card.Body>
                <Card.Title>{stats.tasks}</Card.Title>
                <Card.Text>Total Tasks</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row>
          <Col md={4} className="mb-3">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Projects</Card.Title>
                <Card.Text>Manage and view all your projects.</Card.Text>
                <Button as={Link} to="/projects" variant="primary">Go to Projects</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Sprints</Card.Title>
                <Card.Text>View sprints across your projects.</Card.Text>
                <Button as={Link} to="/sprints" variant="primary">Go to Sprints</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Tasks</Card.Title>
                <Card.Text>Track and manage tasks in your sprints.</Card.Text>
                <Button as={Link} to="/tasks" variant="primary">Go to Tasks</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
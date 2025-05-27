import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import API from '../utils/axiosInstance';

const TaskPage = () => {
  const { projectId, sprintId } = useParams();
  const { user, token } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  // Add projects state
  const [projects, setProjects] = useState([]);


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    projectId: projectId || '',
    sprintId: sprintId || '',
    assignedTo: '',
    createdBy: user?._id || ''
  });



  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    fetchTasks();
    fetchSprints();
    fetchUsers();
    fetchProjects(); // Add this line
  }, [token, navigate, projectId, sprintId]);


  // Add fetchProjects function
  const fetchProjects = async () => {
    try {
      const response = await API.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Determine the endpoint based on available params
      let endpoint = '/tasks';
      if (sprintId) {
        endpoint = `/tasks/sprint/${sprintId}`;
      } else if (projectId) {
        endpoint = `/tasks/project/${projectId}`;
      }

      const response = await API.get(endpoint);
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tasks');
      setLoading(false);
      console.error(err);
    }
  };

  const fetchSprints = async () => {
    try {
      const response = await API.get(projectId ? `/sprints/project/${projectId}` : '/sprints');
      setSprints(response.data);
    } catch (err) {
      console.error('Failed to fetch sprints:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await API.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
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
      const taskData = {
        ...formData,
        createdBy: user._id
      };

      const response = await API.post('/tasks', taskData);
      setTasks([...tasks, response.data]);

      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        sprintId: sprintId || '',
        assignedTo: '',
        createdBy: user._id
      });
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  const handleAssignTask = (task) => {
    setSelectedTask(task);
    setSelectedUser(task.assignedTo || '');
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async () => {
    try {
      console.log('Assigning task:', selectedTask?._id, 'to user:', selectedUser);

      // Make sure we have a task selected
      if (!selectedTask?._id) {
        setError('No task selected');
        return;
      }

      const response = await API.put(`/tasks/${selectedTask._id}/assign`, { userId: selectedUser });

      // Update task in the list with the response data
      const updatedTasks = tasks.map(task =>
        task._id === selectedTask._id
          ? response.data
          : task
      );

      setTasks(updatedTasks);
      setShowAssignModal(false);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Failed to assign task:', err);
      setError(`Failed to assign task: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleUnassignTask = async (taskId) => {
    try {
      const response = await API.put(`/tasks/${taskId}/unassign`);

      // Update task in the list with the response data
      const updatedTasks = tasks.map(task =>
        task._id === taskId
          ? response.data
          : task
      );

      setTasks(updatedTasks);
    } catch (err) {
      console.error('Failed to unassign task:', err);
      setError('Failed to unassign task');
    }
  };

  const handleAddToSprint = async (taskId, newSprintId) => {
    try {
      const response = await API.put(`/tasks/${taskId}/sprint/${newSprintId}`);

      // Update task in the list with the response data
      const updatedTasks = tasks.map(task =>
        task._id === taskId
          ? response.data
          : task
      );

      setTasks(updatedTasks);
    } catch (err) {
      console.error('Failed to add task to sprint:', err);
      setError('Failed to add task to sprint');
    }
  };

  const handleRemoveFromSprint = async (taskId) => {
    try {
      const response = await API.put(`/tasks/${taskId}/removeSprint`);

      // Update task in the list with the response data
      const updatedTasks = tasks.map(task =>
        task._id === taskId
          ? response.data
          : task
      );

      setTasks(updatedTasks);
    } catch (err) {
      console.error('Failed to remove task from sprint:', err);
      setError('Failed to remove task from sprint');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
    navigate('/');
  };

  // In TaskPage.jsx, update the getUserName function:

  const getUserName = (userId) => {
    if (!userId) return 'Unassigned';

    // Find user in users array
    const foundUser = users.find(u => u._id === userId);

    // If user object is directly provided instead of just ID
    if (typeof userId === 'object' && userId.name) {
      return userId.name || userId.email || 'Unknown User';
    }

    return foundUser ? (foundUser.name || foundUser.email) : 'Unknown User';
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
        <h1 className="mb-4">
          {sprintId ? 'Sprint Tasks' : projectId ? 'Project Tasks' : 'All Tasks'}
          {(projectId || sprintId) && (
            <Button
              variant="secondary"
              size="sm"
              className="ms-3"
              onClick={() => navigate(projectId ? '/projects' : '/sprints')}
            >
              Back to {projectId ? 'Projects' : 'Sprints'}
            </Button>
          )}
        </h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <Row>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Header>Create New Task</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Task Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
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
                    <Form.Label>Project (Optional)</Form.Label>
                    <Form.Select
                      name="projectId"
                      value={formData.projectId}
                      onChange={handleChange}
                    >
                      <option value="">No Project (Global Task)</option>
                      {projects.map(project => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Leave empty to create a task outside of any project
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Sprint</Form.Label>
                    <Form.Select
                      name="sprintId"
                      value={formData.sprintId}
                      onChange={handleChange}
                    >
                      <option value="">No Sprint (Backlog)</option>
                      {sprints.map(sprint => (
                        <option key={sprint._id} value={sprint._id}>
                          {sprint.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Leave empty to create a task outside of any sprint
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Assign To</Form.Label>
                    <Form.Select
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleChange}
                    >
                      <option value="">Unassigned</option>
                      {users.map(user => (
                        <option key={user._id} value={user._id}>
                          {user.name || user.email}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </Form.Select>
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Create Task
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <Card>
              <Card.Header>Task List</Card.Header>
              <Card.Body>
                {loading ? (
                  <p>Loading tasks...</p>
                ) : tasks.length === 0 ? (
                  <p>No tasks found. Create your first task!</p>
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Assigned To</th>
                        <th>Sprint</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map(task => (
                        <tr key={task._id}>
                          <td>{task.title}</td>
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
                            {task.assignedTo ?
                              (typeof task.assignedTo === 'object' ?
                                (task.assignedTo.name || task.assignedTo.email) :
                                getUserName(task.assignedTo)
                              ) : 'Unassigned'}
                          </td>
                          <td>
                            {task.sprintId ?
                              sprints.find(s => s._id === task.sprintId)?.name || 'Sprint' :
                              'No Sprint'
                            }
                          </td>
                          <td>
                            <Button
                              variant="info"
                              size="sm"
                              className="me-1 mb-1"
                              onClick={() => handleAssignTask(task)}
                            >
                              Assign
                            </Button>
                            {task.assignedTo && (
                              <Button
                                variant="warning"
                                size="sm"
                                className="me-1 mb-1"
                                onClick={() => handleUnassignTask(task._id)}
                              >
                                Unassign
                              </Button>
                            )}
                            {!task.sprintId ? (
                              <Button
                                variant="success"
                                size="sm"
                                className="me-1 mb-1"
                                onClick={() => {
                                  setSelectedTask(task);
                                  setShowAssignModal(true);
                                }}
                              >
                                Add to Sprint
                              </Button>
                            ) : (
                              <Button
                                variant="secondary"
                                size="sm"
                                className="me-1 mb-1"
                                onClick={() => handleRemoveFromSprint(task._id)}
                              >
                                Remove from Sprint
                              </Button>
                            )}
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

      {/* Assign User Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedTask?.assignedTo ? 'Reassign Task' : 'Assign Task'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Task: {selectedTask?.title}</Form.Label>
              <Form.Select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Unassigned</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name || user.email}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAssignSubmit}>
            Assign
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add to Sprint Modal - Separate from Assign User Modal */}
      <Modal
        show={showAssignModal && selectedTask && !selectedTask.sprintId}
        onHide={() => setShowAssignModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Task to Sprint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Task: {selectedTask?.title}</Form.Label>
              <Form.Select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Select Sprint</option>
                {sprints.map(sprint => (
                  <option key={sprint._id} value={sprint._id}>
                    {sprint.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (selectedTask && selectedUser) {
                handleAddToSprint(selectedTask._id, selectedUser);
              }
              setShowAssignModal(false);
            }}
          >
            Add to Sprint
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskPage;
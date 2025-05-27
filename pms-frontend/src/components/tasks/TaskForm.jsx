import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../../redux/taskSlice';

const TaskForm = ({ projectId, sprintId }) => {
  const [formData, setFormData] = useState({ title: '', description: '', assignedTo: '' });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createTask({ ...formData, projectId, sprintId }));
    setFormData({ title: '', description: '', assignedTo: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Task Title" value={formData.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
      <input name="assignedTo" placeholder="Assign to (User ID)" value={formData.assignedTo} onChange={handleChange} />
      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;
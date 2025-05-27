import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSprint } from '../../redux/sprintSlice';

const SprintForm = ({ projectId }) => {
  const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '' });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createSprint({ ...formData, projectId }));
    setFormData({ name: '', startDate: '', endDate: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Sprint Name" value={formData.name} onChange={handleChange} required />
      <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
      <input name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
      <button type="submit">Create Sprint</button>
    </form>
  );
};

export default SprintForm;
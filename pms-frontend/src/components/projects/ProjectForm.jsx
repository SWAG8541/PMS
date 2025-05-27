import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject } from '../../redux/projectSlice';

export default function ProjectForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createProject({ name, description }));
    setName('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Project</h3>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project Name" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <button type="submit">Create</button>
    </form>
  );
}

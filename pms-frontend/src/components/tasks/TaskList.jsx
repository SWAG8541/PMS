import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasksBySprint } from '../../redux/taskSlice';

const TaskList = ({ sprintId }) => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.task);

  useEffect(() => {
    if (sprintId) dispatch(fetchTasksBySprint(sprintId));
  }, [dispatch, sprintId]);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {tasks && tasks.map((task) => (
        <li key={task._id}>
          <strong>{task.title}</strong> - {task.status}
          <div>Assigned to: {task.assignedTo?.email || 'Unassigned'}</div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
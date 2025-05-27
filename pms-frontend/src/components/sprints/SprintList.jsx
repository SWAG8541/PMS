import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSprints } from '../../redux/sprintSlice';

const SprintList = ({ projectId }) => {
  const dispatch = useDispatch();
  const { sprints, loading, error } = useSelector((state) => state.sprint);

  useEffect(() => {
    if (projectId) dispatch(fetchSprints(projectId));
  }, [dispatch, projectId]);

  if (loading) return <p>Loading sprints...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {sprints && sprints.map((sprint) => (
        <li key={sprint._id}>
          <strong>{sprint.name}</strong> ({sprint.startDate} → {sprint.endDate})
        </li>
      ))}
    </ul>
  );
};

export default SprintList;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../../services/Api';

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getAllUsers();
        const foundUser = response.users.find((u) => u._id === userId);
        if (foundUser) {
          setUser(foundUser);
        } else {
          setError('User not found.');
        }
      } catch (err) {
        setError('Failed to fetch user: ' + (err.error || err.message));
      }
    };

    fetchUser();
  }, [userId]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Detail</h2>
      <p><strong>ID:</strong> {user._id}</p>
      <p><strong>Name:</strong> {user.name || 'N/A'}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Status:</strong> {user.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}</p>
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default UserDetail;
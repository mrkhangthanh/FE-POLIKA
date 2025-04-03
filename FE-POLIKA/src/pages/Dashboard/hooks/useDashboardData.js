import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { getAllUsers, getStats, deleteUser } from '../../../services/Api';

const useDashboardData = (token, role) => {
  const navigate = useNavigate(); // Thêm navigate
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    newUsers: [],
    completedOrders: [],
    totalRevenue: 0,
    totalOrders: 0,
    completionRate: 0,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await getAllUsers();
        setUsers(Array.isArray(response.data.users) ? response.data.users : []);
      } catch (err) {
        if (err.response?.status === 401) {
          // Nếu lỗi 401, xóa token và điều hướng về trang đăng nhập
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
          navigate('/admin-login', { replace: true });
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError('Failed to fetch users: ' + (err.message || 'Không xác định'));
        }
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await getStats();
        setStats({
          newUsers: Array.isArray(response.data.newUsers) ? response.data.newUsers : [],
          completedOrders: Array.isArray(response.data.completedOrders) ? response.data.completedOrders : [],
          totalRevenue: response.data.totalRevenue || 0,
          totalOrders: response.data.totalOrders || 0,
          completionRate: response.data.completionRate || 0,
        });
      } catch (err) {
        if (err.response?.status === 401) {
          // Nếu lỗi 401, xóa token và điều hướng về trang đăng nhập
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
          navigate('/admin-login', { replace: true });
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError((prev) => prev + '\nFailed to fetch stats: ' + (err.message || 'Không xác định'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (token && role && ['admin', 'manager', 'content_writer', 'agent', 'technician'].includes(role)) {
      fetchUsers();
      fetchStats();
    }
  }, [token, role, navigate]); // Thêm navigate vào dependencies

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await deleteUser(userId);
        if (response.data.success) {
          setUsers(users.filter((user) => user._id !== userId));
          alert('User deleted successfully.');
        } else {
          setError('Failed to delete user: ' + (response.data.message || 'Không xác định'));
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
          navigate('/admin-login', { replace: true });
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError('Failed to delete user: ' + (err.message || 'Không xác định'));
        }
      }
    }
  };

  return { users, setUsers, stats, error, setError, isLoading, handleDeleteUser };
};

export default useDashboardData;
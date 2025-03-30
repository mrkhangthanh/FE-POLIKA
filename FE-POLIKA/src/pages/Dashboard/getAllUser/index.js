import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, register, updateUser, deleteUser } from '../../../services/Api';
import './getAllUser.css';

const GetAllUserDashBoard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // State cho bộ lọc
  const [filterName, setFilterName] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [sortByDate, setSortByDate] = useState('');

  // State cho form thêm/sửa user
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone_number: '',
    role: 'customer',
    password: '',
  });
  const [editUserId, setEditUserId] = useState(null);

  // Kiểm tra đăng nhập và vai trò admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token || !user || user.role !== 'admin') {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Gọi API getAllUsers với phân trang
  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      console.log('Auth Header:', token);

      if (!token) {
        throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
      }

      const response = await getAllUsers({
        params: { page },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('API Response:', response);

      if (response.data.success) {
        setUsers(response.data.users || []); // Sửa: response.data.users
        setPagination(response.data.pagination || {});
        setCurrentPage(page);
      } else {
        setError(response.data.message || 'Không thể tải danh sách người dùng.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Không thể tải danh sách người dùng.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin-login');
  };

  // Xử lý chuyển trang
  const handleNextPage = () => {
    if (pagination?.hasNext) {
      fetchUsers(pagination.next);
    }
  };

  const handlePrevPage = () => {
    if (pagination?.hasPrev) {
      fetchUsers(pagination.prev);
    }
  };

  // Lọc và sắp xếp dữ liệu
  const filteredUsers = users
    .filter((user) => {
      const nameMatch = user.name
        ? user.name.toLowerCase().includes(filterName.toLowerCase())
        : 'N/A'.includes(filterName.toLowerCase());
      const phoneMatch = user.phone_number
        ? user.phone_number.includes(filterPhone)
        : 'N/A'.includes(filterPhone);
      return nameMatch && phoneMatch;
    })
    .sort((a, b) => {
      if (sortByDate === 'earliest') {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortByDate === 'latest') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return 0;
    });

  // Hàm xử lý thêm user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await register(newUser);
      console.log('Add User Response:', response);
      if (response.data.success) {
        setUsers([...users, response.data.user]);
        setShowAddForm(false);
        setNewUser({ name: '', email: '', phone_number: '', role: 'customer', password: '' });
      } else {
        setError(response.data.message || 'Thêm user thất bại.');
      }
    } catch (err) {
      setError('Lỗi khi thêm user: ' + (err.message || 'Không xác định'));
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý sửa user
  const handleEditUser = (userId) => {
    const userToEdit = users.find((user) => user._id === userId);
    if (userToEdit) {
      setNewUser({
        name: userToEdit.name || '',
        email: userToEdit.email,
        phone_number: userToEdit.phone_number || '',
        role: userToEdit.role,
        password: '',
      });
      setEditUserId(userId);
      setShowAddForm(true);
    }
  };

  // Hàm xử lý lưu chỉnh sửa user
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await updateUser(editUserId, newUser);
      console.log('Update User Response:', response);
      if (response.data.success) {
        setUsers(users.map((user) => (user._id === editUserId ? response.data.user : user)));
        setShowAddForm(false);
        setNewUser({ name: '', email: '', phone_number: '', role: 'customer', password: '' });
        setEditUserId(null);
      } else {
        setError(response.data.message || 'Cập nhật user thất bại.');
      }
    } catch (err) {
      setError('Lỗi khi cập nhật user: ' + (err.message || 'Không xác định'));
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý xóa user
  const handleDeleteUser = async (userId) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa user với ID: ${userId}?`)) {
      setIsLoading(true);
      try {
        const response = await deleteUser(userId);
        console.log('Delete User Response:', response);
        if (response.data.success) {
          setUsers(users.filter((user) => user._id !== userId));
        } else {
          setError(response.data.message || 'Xóa user thất bại.');
        }
      } catch (err) {
        setError('Lỗi khi xóa user: ' + (err.message || 'Không xác định'));
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Dashboard</h2>
        </div>
        <ul className="sidebar-menu">
          <li>
            <span>
              <i className="menu-icon fas fa-home"></i> Trang chủ
            </span>
          </li>
          <li>
            <span>
              <i className="menu-icon fas fa-users"></i> Quản lý người dùng
            </span>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="header">
          <h2>Dashboard</h2>
          <div className="user-info">
            <span>Chào, Admin</span>
            <button onClick={handleLogout}>Đăng xuất</button>
          </div>
        </div>

        <div className="recent-users">
          <h3>Danh sách người dùng</h3>

          {/* Phần lọc dữ liệu */}
          <div className="filter-section" style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Tìm theo tên..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              style={{ marginRight: '10px', padding: '5px' }}
            />
            <input
              type="text"
              placeholder="Tìm theo số điện thoại..."
              value={filterPhone}
              onChange={(e) => setFilterPhone(e.target.value)}
              style={{ marginRight: '10px', padding: '5px' }}
            />
            <select
              value={sortByDate}
              onChange={(e) => setSortByDate(e.target.value)}
              style={{ padding: '5px' }}
            >
              <option value="">Thời Gian Tạo</option>
              <option value="earliest">Mới nhất</option>
              <option value="latest">Lâu nhất</option>
            </select>
          </div>

          {/* Nút Add User và Form toggle */}
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditUserId(null);
              setNewUser({ name: '', email: '', phone_number: '', role: 'customer', password: '' });
            }}
            style={{ marginBottom: '10px', padding: '5px 10px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            {showAddForm ? 'Ẩn form' : 'Add User'}
          </button>

          {showAddForm && (
            <form onSubmit={editUserId ? handleSaveEdit : handleAddUser} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <input
                type="text"
                placeholder="Tên"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                style={{ marginRight: '10px', padding: '5px' }}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                style={{ marginRight: '10px', padding: '5px' }}
                required
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                value={newUser.phone_number}
                onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })}
                style={{ marginRight: '10px', padding: '5px' }}
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                style={{ marginRight: '10px', padding: '5px' }}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
              </select>
              {!editUserId && (
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  style={{ marginRight: '10px', padding: '5px' }}
                  required
                />
              )}
              <button type="submit" style={{ padding: '5px 10px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px' }}>
                {editUserId ? 'Lưu' : 'Thêm'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewUser({ name: '', email: '', phone_number: '', role: 'customer', password: '' });
                  setEditUserId(null);
                }}
                style={{ marginLeft: '10px', padding: '5px 10px', background: '#f44336', color: '#fff', border: 'none', borderRadius: '4px' }}
              >
                Hủy
              </button>
            </form>
          )}

          {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
          {isLoading ? (
            <p>Đang tải...</p>
          ) : filteredUsers.length > 0 ? (
            <>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Địa chỉ</th>
                    <th>Ngày tạo tài khoản</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.name || 'N/A'}</td>
                      <td>{user.email}</td>
                      <td>{user.phone_number || 'N/A'}</td>
                      <td>
                        {user.address
                          ? `${user.address.street || ''}${user.address.street ? ', ' : ''}${user.address.ward || ''}${user.address.ward ? ', ' : ''}${user.address.district || ''}${user.address.district ? ', ' : ''}${user.address.city || ''}${user.address.city ? ', ' : ''}${user.address.country || ''}`
                          : 'N/A'}
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                      <td>{user.role}</td>
                      <td className={user.status === 'active' ? 'status-active' : 'status-inactive'}>
                        {user.status || 'N/A'}
                      </td>
                      <td>
                        <button
                          onClick={() => handleEditUser(user._id)}
                          style={{ marginRight: '5px', padding: '2px 5px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px' }}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          style={{ padding: '2px 5px', background: '#f44336', color: '#fff', border: 'none', borderRadius: '4px' }}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pagination && (
                <div className="pagination" style={{ marginTop: '10px' }}>
                  <button
                    onClick={handlePrevPage}
                    disabled={!pagination.hasPrev}
                    style={{ marginRight: '10px' }}
                  >
                    Previous
                  </button>
                  <span>
                    Trang {currentPage} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={!pagination.hasNext}
                    style={{ marginLeft: '10px' }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>Không có người dùng nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetAllUserDashBoard;
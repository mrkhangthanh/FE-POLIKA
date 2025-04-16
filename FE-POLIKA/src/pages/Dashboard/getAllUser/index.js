import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUser, deleteUser, createUser, getCategoryService } from '../../../services/Api';
import RenderPagination from '../../../share/components/Pagination/renderPagination';
import './getAllUser.css';

const GetAllUserDashBoard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceTypes, setServiceTypes] = useState([]);
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
    address: {
      street: '',
      city: '',
      district: '',
      ward: '',
      country: '',
    },
    services: [],
    referred_by: '',
    avatar: '',
  });
  const [editUserId, setEditUserId] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  // Kiểm tra đăng nhập và vai trò admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token || !user || user.role !== 'admin') {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Lấy danh sách dịch vụ từ API getCategoryService
  const fetchServiceTypes = async () => {
    try {
      const response = await getCategoryService();
      const serviceTypesData = Array.isArray(response.data.service_types)
        ? response.data.service_types
        : [];
      setServiceTypes(serviceTypesData);
    } catch (err) {
      console.error('Error fetching service types:', err);
      setError('Không thể tải danh sách dịch vụ.');
    }
  };

  useEffect(() => {
    fetchServiceTypes();
  }, []);

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
        setUsers(response.data.users || []);
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

  // Hàm hiển thị danh sách dịch vụ của user
  const getServiceNames = (services) => {
    if (!services || services.length === 0) {
      return 'N/A';
    }

    const serviceNames = services
      .map((serviceId) => {
        const service = serviceTypes.find((type) => type._id === serviceId);
        return service ? service.label : null;
      })
      .filter((name) => name !== null);

    return serviceNames.length > 0 ? serviceNames.join(', ') : 'N/A';
  };

  // Hàm xử lý thêm user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (newUser.role === 'technician' && selectedServices.length === 0) {
        setError('Vui lòng chọn ít nhất một dịch vụ cho technician.');
        setIsLoading(false);
        return;
      }

      if (!newUser.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError('Email không đúng định dạng.');
        setIsLoading(false);
        return;
      }
      if (newUser.password.length < 8) {
        setError('Mật khẩu phải có ít nhất 8 ký tự.');
        setIsLoading(false);
        return;
      }
      if (!newUser.phone_number.match(/^[0-9]{10,11}$/)) {
        setError('Số điện thoại phải có từ 10 đến 11 chữ số.');
        setIsLoading(false);
        return;
      }

      const userData = {
        ...newUser,
        services: selectedServices,
        address: newUser.address && Object.values(newUser.address).some(val => val.trim() !== '') ? newUser.address : null,
      };

      console.log('Dữ liệu gửi lên (Add User):', JSON.stringify(userData, null, 2));

      const response = await createUser(userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('Add User Response:', response);
      if (response.data.success) {
        setUsers([...users, response.data.user]);
        setShowAddForm(false);
        setNewUser({
          name: '',
          email: '',
          phone_number: '',
          role: 'customer',
          password: '',
          address: {
            street: '',
            city: '',
            district: '',
            ward: '',
            country: '',
          },
          services: [],
          referred_by: '',
          avatar: '',
        });
        setSelectedServices([]);
      } else {
        setError(response.data.error || 'Thêm user thất bại.');
      }
    } catch (err) {
      console.error('Lỗi chi tiết:', JSON.stringify(err.response?.data, null, 2));
      setError('Lỗi khi thêm user: ' + (err.response?.data?.errors?.map(e => e.msg).join(', ') || err.message || 'Không xác định'));
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
        address: userToEdit.address || {
          street: '',
          city: '',
          district: '',
          ward: '',
          country: '',
        },
        services: userToEdit.services || [],
        referred_by: userToEdit.referred_by || '',
        avatar: userToEdit.avatar || '',
      });
      setSelectedServices(userToEdit.services || []);
      setEditUserId(userId);
      setShowAddForm(true);
    }
  };

  // Hàm xử lý lưu chỉnh sửa user
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Validation trước khi gửi
      if (newUser.role === 'technician' && selectedServices.length === 0) {
        setError('Vui lòng chọn ít nhất một dịch vụ cho technician.');
        setIsLoading(false);
        return;
      }

      if (!newUser.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError('Email không đúng định dạng.');
        setIsLoading(false);
        return;
      }
      if (newUser.phone_number && !newUser.phone_number.match(/^[0-9]{10,11}$/)) {
        setError('Số điện thoại phải có từ 10 đến 11 chữ số.');
        setIsLoading(false);
        return;
      }

      const hasAddressData = Object.values(newUser.address).some((value) => value.trim() !== '');
      const userData = {
        ...newUser,
        services: selectedServices,
        address: hasAddressData ? newUser.address : null,
      };

      console.log('Dữ liệu gửi lên (Update User):', JSON.stringify(userData, null, 2));

      const response = await updateUser(editUserId, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('Update User Response:', response);
      if (response.data.success) {
        setUsers(users.map((user) => (user._id === editUserId ? response.data.user : user)));
        setShowAddForm(false);
        setNewUser({
          name: '',
          email: '',
          phone_number: '',
          role: 'customer',
          password: '',
          address: {
            street: '',
            city: '',
            district: '',
            ward: '',
            country: '',
          },
          services: [],
          referred_by: '',
          avatar: '',
        });
        setSelectedServices([]);
        setEditUserId(null);
      } else {
        setError(response.data.message || 'Cập nhật user thất bại.');
      }
    } catch (err) {
      console.error('Lỗi chi tiết:', JSON.stringify(err.response?.data, null, 2));
      setError('Lỗi khi cập nhật user: ' + (err.response?.data?.message || err.message || 'Không xác định'));
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

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm xử lý chọn dịch vụ
  const handleServiceChange = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="dashboard-wrapperuser">
      <div className="main-contentuser">
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
              <option value="earliest">Lâu nhất</option>
              <option value="latest">Mới nhất</option>
            </select>
          </div>

          {/* Nút Add User và Form toggle */}
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditUserId(null);
              setNewUser({
                name: '',
                email: '',
                phone_number: '',
                role: 'customer',
                password: '',
                address: {
                  street: '',
                  city: '',
                  district: '',
                  ward: '',
                  country: '',
                },
                services: [],
                referred_by: '',
                avatar: '',
              });
              setSelectedServices([]);
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
                required
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                style={{ marginRight: '10px', padding: '5px' }}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="content_writer">Content Writer</option>
                <option value="agent">Agent</option>
                <option value="technician">Technician</option>
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
              <div style={{ marginTop: '10px' }}>
                <h4>Địa chỉ</h4>
                <input
                  type="text"
                  placeholder="Đường"
                  value={newUser.address.street}
                  onChange={(e) => setNewUser({ ...newUser, address: { ...newUser.address, street: e.target.value } })}
                  style={{ marginRight: '10px', padding: '5px', marginTop: '5px' }}
                />
                <input
                  type="text"
                  placeholder="Phường/Xã"
                  value={newUser.address.ward}
                  onChange={(e) => setNewUser({ ...newUser, address: { ...newUser.address, ward: e.target.value } })}
                  style={{ marginRight: '10px', padding: '5px', marginTop: '5px' }}
                />
                <input
                  type="text"
                  placeholder="Quận/Huyện"
                  value={newUser.address.district}
                  onChange={(e) => setNewUser({ ...newUser, address: { ...newUser.address, district: e.target.value } })}
                  style={{ marginRight: '10px', padding: '5px', marginTop: '5px' }}
                />
                <input
                  type="text"
                  placeholder="Thành phố"
                  value={newUser.address.city}
                  onChange={(e) => setNewUser({ ...newUser, address: { ...newUser.address, city: e.target.value } })}
                  style={{ marginRight: '10px', padding: '5px', marginTop: '5px' }}
                />
                <input
                  type="text"
                  placeholder="Quốc gia"
                  value={newUser.address.country}
                  onChange={(e) => setNewUser({ ...newUser, address: { ...newUser.address, country: e.target.value } })}
                  style={{ marginRight: '10px', padding: '5px', marginTop: '5px' }}
                />
              </div>
              {newUser.role === 'technician' && (
                <div style={{ marginTop: '10px' }}>
                  <h4>Lĩnh vực Công việc</h4>
                  {serviceTypes.length > 0 ? (
                    serviceTypes.map((service) => (
                      <label key={service._id} style={{ marginRight: '10px' }}>
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service._id)}
                          onChange={() => handleServiceChange(service._id)}
                        />
                        {service.label}
                      </label>
                    ))
                  ) : (
                    <p>Không có dịch vụ nào để hiển thị.</p>
                  )}
                </div>
              )}
              <div style={{ marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="Người giới thiệu"
                  value={newUser.referred_by}
                  onChange={(e) => setNewUser({ ...newUser, referred_by: e.target.value })}
                  style={{ marginRight: '10px', padding: '5px' }}
                />
              </div>
              <div style={{ marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="URL ảnh đại diện"
                  value={newUser.avatar}
                  onChange={(e) => setNewUser({ ...newUser, avatar: e.target.value })}
                  style={{ marginRight: '10px', padding: '5px' }}
                />
              </div>
              <button type="submit" style={{ padding: '5px 10px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px' }}>
                {editUserId ? 'Lưu' : 'Thêm'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewUser({
                    name: '',
                    email: '',
                    phone_number: '',
                    role: 'customer',
                    password: '',
                    address: {
                      street: '',
                      city: '',
                      district: '',
                      ward: '',
                      country: '',
                    },
                    services: [],
                    referred_by: '',
                    avatar: '',
                  });
                  setSelectedServices([]);
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
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Địa chỉ</th>
                    <th>Dịch vụ</th>
                    <th>Ngày tạo tài khoản</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name || 'N/A'}</td>
                      <td>{user.email}</td>
                      <td>{user.phone_number || 'N/A'}</td>
                      <td>
                        {user.address
                          ? `${user.address.street || ''}${user.address.street ? ', ' : ''}${user.address.ward || ''}${user.address.ward ? ', ' : ''}${user.address.district || ''}${user.address.district ? ', ' : ''}${user.address.city || ''}${user.address.city ? ', ' : ''}${user.address.country || ''}`
                          : 'N/A'}
                      </td>
                      <td>{getServiceNames(user.services)}</td>
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

              {pagination && pagination.totalPages > 1 && (
                <RenderPagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
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
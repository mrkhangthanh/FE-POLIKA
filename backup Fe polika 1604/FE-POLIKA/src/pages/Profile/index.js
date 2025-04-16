import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../share/components/Layout/Header';
// import Footer from '../../share/components/Layout/Footer';
import BottomNav from '../../share/components/BottomNav';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = localStorage.getItem('token') && user && (user.role === 'customer' || user.role === 'technician');

  // Nếu chưa đăng nhập, điều hướng về trang login
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  // Dữ liệu giả lập cho lịch sử hoạt động
  const activityHistory = [
    { id: 1, date: '2025-04-01', action: user.role === 'customer' ? 'Đặt dịch vụ sửa ống nước' : 'Hoàn thành sửa ống nước', status: 'Hoàn thành' },
    { id: 2, date: '2025-03-28', action: user.role === 'customer' ? 'Đặt dịch vụ sửa điện' : 'Hoàn thành sửa điện', status: 'Hoàn thành' },
    { id: 3, date: '2025-03-25', action: user.role === 'customer' ? 'Đặt dịch vụ lắp điều hòa' : 'Hoàn thành lắp điều hòa', status: 'Đang xử lý' },
  ];

  // Danh sách các mục menu
  const profileMenuItems = [
    { icon: 'fa-solid fa-star', label: 'Khách hàng thân thiết', path: '/loyalty' },
    { icon: 'fa-solid fa-comment', label: 'Đánh giá của tôi', path: '/reviews' },
    { icon: 'fa-solid fa-gift', label: 'Ưu đãi của toi', path: '/offers' },
    { icon: 'fa-solid fa-user-plus', label: 'Giới thiệu bạn bè', path: '/referrals' },
    { icon: 'fa-solid fa-users', label: 'Đại lý/ Cộng tác viên', path: '/affiliates' },
    { icon: 'fa-solid fa-handshake', label: 'Trở thành đối tác', path: '/become-partner' },
  ];

  return (
    <>
      <Header />
      <div className="profile-container">
        {/* Phần tiêu đề */}
        <div className="profile-header">
          <h2>
            <i className="fa-solid fa-user-circle" style={{ marginRight: '10px' }} />
            Hồ sơ cá nhân
          </h2>
        </div>

        {/* Phần thông tin cá nhân và menu */}
        <div className="profile-section profile-grid">
          {/* Thông tin cá nhân (bên trái) */}
          <div className="profile-info-section">
            <h3>
              <i className="fa-solid fa-info-circle" style={{ marginRight: '8px' }} />
              Thông tin cá nhân
            </h3>
            <div className="profile-info">
              <p>
                <i className="fa-solid fa-user" style={{ marginRight: '8px' }} />
                <strong>Họ và tên:</strong> {user.name || 'Chưa cập nhật'}
              </p>
              <p>
                <i className="fa-solid fa-envelope" style={{ marginRight: '8px' }} />
                <strong>Email:</strong> {user.email || 'Chưa cập nhật'}
              </p>
              <p>
                <i className="fa-solid fa-phone" style={{ marginRight: '8px' }} />
                <strong>Số điện thoại:</strong> {user.phone_number || 'Chưa cập nhật'}
              </p>
              <p>
                <i className="fa-solid fa-briefcase" style={{ marginRight: '8px' }} />
                <strong>Vai trò:</strong> {user.role === 'customer' ? 'Khách hàng' : 'Kỹ thuật viên'}
              </p>
              <p>
                <i className="fa-solid fa-map-marker-alt" style={{ marginRight: '8px' }} />
                <strong>Địa chỉ:</strong>{' '}
                {user.address && Object.keys(user.address).length > 0
                  ? `${user.address.street || ''}, ${user.address.ward || ''}, ${user.address.district || ''}, ${user.address.city || ''}, ${user.address.country || ''}`
                  : 'Chưa cập nhật'}
              </p>
              {user.role === 'technician' && (
                <p>
                  <i className="fa-solid fa-tools" style={{ marginRight: '8px' }} />
                  <strong>Chuyên môn:</strong>{' '}
                  {user.specialization && user.specialization.length > 0
                    ? user.specialization.join(', ')
                    : 'Chưa cập nhật'}
                </p>
              )}
            </div>
            <div className="profile-actions">
              <button className="action-btn" onClick={() => navigate('/edit-profile')}>
                <i className="fa-solid fa-edit" style={{ marginRight: '5px' }} />
                Chỉnh sửa thông tin
              </button>
              <button className="action-btn" onClick={() => navigate('/change-password')}>
                <i className="fa-solid fa-key" style={{ marginRight: '5px' }} />
                Thay đổi mật khẩu
              </button>
            </div>
          </div>

          {/* Danh sách các mục (bên phải) */}
          <div className="profile-menu-section">
            <h3>
              <i className="fa-solid fa-list" style={{ marginRight: '8px' }} />
              Tùy chọn
            </h3>
            <ul className="profile-menu">
              {profileMenuItems.map((item, index) => (
                <li key={index} className="profile-menu-item">
                  <Link to={item.path}>
                    <i className={item.icon} style={{ marginRight: '10px' }} />
                    <span>{item.label}</span>
                    {/*  Thêm icon mũi tên bên phải */}
                    <i className="fa-solid fa-chevron-right menu-arrow" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Phần lịch sử hoạt động */}
        <div className="profile-section">
          <h3>
            <i className="fa-solid fa-history" style={{ marginRight: '8px' }} />
            Lịch sử hoạt động
          </h3>
          {activityHistory.length > 0 ? (
            <>
              {/* Bảng cho desktop và tablet */}
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Hành động</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {activityHistory.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.date}</td>
                      <td>{activity.action}</td>
                      <td>
                        <span className={`status ${activity.status === 'Hoàn thành' ? 'completed' : 'processing'}`}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Danh sách cho mobile */}
              <div className="activity-list">
                {activityHistory.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <p>
                      <strong>Ngày:</strong> {activity.date}
                    </p>
                    <p>
                      <strong>Hành động:</strong> {activity.action}
                    </p>
                    <p>
                      <strong>Trạng thái:</strong>{' '}
                      <span className={`status ${activity.status === 'Hoàn thành' ? 'completed' : 'processing'}`}>
                        {activity.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>Chưa có hoạt động nào.</p>
          )}
          <div className="profile-actions">
            <button className="action-btn" onClick={() => navigate('/activity-history')}>
              <i className="fa-solid fa-list" style={{ marginRight: '5px' }} />
              Xem chi tiết lịch sử
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Profile;
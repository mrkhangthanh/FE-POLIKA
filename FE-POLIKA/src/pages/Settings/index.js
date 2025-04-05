import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../share/components/Layout/Header';
import BottomNav from '../../share/components/BottomNav';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = localStorage.getItem('token') && user && (user.role === 'customer' || user.role === 'technician');

  // Nếu chưa đăng nhập, điều hướng về trang login
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  // Danh sách các mục cài đặt
  const settingsMenuItems = [
    { icon: 'fa-solid fa-user', label: 'Thông tin cá nhân', path: '/edit-profile' },
    { icon: 'fa-solid fa-bell', label: 'Thông báo', path: '/settings/notifications' },
    { icon: 'fa-solid fa-globe', label: 'Ngôn ngữ', path: '/settings/language' },
    { icon: 'fa-solid fa-lock', label: 'Bảo mật', path: '/change-password' },
    { icon: 'fa-solid fa-paint-brush', label: 'Chế độ giao diện', path: '/settings/theme' },
    { icon: 'fa-solid fa-sign-out-alt', label: 'Đăng xuất', action: 'logout' },
  ];

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Xử lý khi nhấn vào một mục cài đặt
  const handleMenuItemClick = (item) => {
    if (item.action === 'logout') {
      handleLogout();
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      <Header />
      <div className="settings-container">
        {/* Tiêu đề (ẩn trên mobile) */}
        <div className="settings-header desktop-only">
          <h2>
            <i className="fa-solid fa-gear" style={{ marginRight: '10px' }} />
            Cài đặt
          </h2>
        </div>

        {/* Danh sách các mục cài đặt */}
        <div className="settings-section">
          <ul className="settings-menu">
            {settingsMenuItems.map((item, index) => (
              <li key={index} className="settings-menu-item">
                <div onClick={() => handleMenuItemClick(item)} className="settings-menu-link">
                  <i className={item.icon} style={{ marginRight: '10px' }} />
                  <span>{item.label}</span>
                  <i className="fa-solid fa-chevron-right menu-arrow" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <BottomNav />
      </div>
    </>
  );
};

export default Settings;
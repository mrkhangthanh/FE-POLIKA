import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  // Danh sách các mục cho Bottom Navigation Bar
  const bottomNavItems = [
    { icon: 'fa-solid fa-home', label: 'Trang chủ', path: '/' },
    { icon: 'fa-solid fa-file-invoice', label: 'Đơn hàng', path: '/orders' },
    { icon: 'fa-solid fa-plus', label: 'Tạo Đơn', path: '/create-order', isProminent: true }, // Mục nổi bật
    { icon: 'fa-solid fa-headset', label: 'Hỗ trợ', path: '/support' },
    { icon: 'fa-solid fa-circle-user', label: 'Tài khoản', path: '/profile' }, // 🔴 Cập nhật icon
  ];

  // Danh sách các mục trong menu "Tài khoản"
  const accountMenuItems = [
    { icon: 'fa-solid fa-circle-user', label: 'Thông tin tài khoản', path: '/profile' },
    { icon: 'fa-solid fa-gear', label: 'Cài đặt', path: '/settings' },
    { icon: 'fa-solid fa-sign-out-alt', label: 'Đăng xuất', action: 'logout' }, // Mục đăng xuất
  ];

  // Xử lý đăng xuất
  const handleLogout = () => {
    // Xóa token và thông tin người dùng từ localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Chuyển hướng về trang đăng nhập
    navigate('/login');
  };

  // Xử lý khi nhấn vào mục "Tài khoản"
  const handleAccountClick = (e) => {
    e.preventDefault(); // Ngăn điều hướng mặc định
    setIsAccountMenuOpen(!isAccountMenuOpen); // Toggle menu
  };

  // Xử lý khi nhấn vào một mục trong menu
  const handleMenuItemClick = (item) => {
    if (item.action === 'logout') {
      handleLogout();
    } else {
      navigate(item.path);
    }
    setIsAccountMenuOpen(false); // Đóng menu sau khi chọn
  };

  return (
    <div className="bottom-nav">
      {bottomNavItems.map((item, index) => (
        <div key={index} className="bottom-nav-item-wrapper">
          <Link
            to={item.path}
            className={`bottom-nav-item ${item.isProminent ? 'prominent' : ''}`}
            onClick={item.label === 'Tài khoản' ? handleAccountClick : undefined}
          >
            <i className={item.icon} />
            <span>{item.label}</span>
          </Link>

          {/* Menu hiển thị khi nhấn vào "Tài khoản" */}
          {item.label === 'Tài khoản' && isAccountMenuOpen && (
            <div className="account-menu">
              {accountMenuItems.map((menuItem, menuIndex) => (
                <div
                  key={menuIndex}
                  className="account-menu-item"
                  onClick={() => handleMenuItemClick(menuItem)}
                >
                  <i className={menuItem.icon} />
                  <span>{menuItem.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BottomNav;
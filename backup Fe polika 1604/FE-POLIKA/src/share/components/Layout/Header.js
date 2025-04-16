import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

// Component con cho dropdown của user
const UserDropdown = ({ user, onLogout, isOpen, toggle }) => (
  <div
    className="user-menu"
    onClick={toggle}
    onMouseEnter={() => toggle(true)}
    onMouseLeave={() => toggle(false)}
  >
    <p className="welcome-text">
      <i className="fa-solid fa-user" style={{ marginRight: '5px' }} />
      Chào, {user.name}
      <i className="fa-solid fa-chevron-down" style={{ marginLeft: '5px' }} />
    </p>
    {isOpen && (
      <div
        className="dropdown-menu"
        onMouseEnter={() => toggle(true)}
        onMouseLeave={() => toggle(false)}
      >
        <Link to="/profile" className="dropdown-item">
          <i className="fa-solid fa-user-circle" style={{ marginRight: '5px' }} />
          Thông tin tài khoản
        </Link>
        <Link to="/settings" className="dropdown-item">
          <i className="fa-solid fa-gear" style={{ marginRight: '5px' }} />
          Cài đặt
        </Link>
        <button className="dropdown-item logout-button" onClick={onLogout}>
          <i className="fa-solid fa-sign-out-alt" style={{ marginRight: '5px' }} />
          Đăng Xuất
        </button>
      </div>
    )}
  </div>
);

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = token && user && (user.role === 'customer' || user.role === 'technician');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const toggleDropdown = (value) => {
    setIsDropdownOpen(value !== undefined ? value : !isDropdownOpen);
  };

  // Danh sách dịch vụ
  const services = [
    'dịch vụ 1',
    'dịch vụ 2',
    'dịch vụ 3',
    'dịch vụ 4',
    'dịch vụ 5',
    'dịch vụ 6',
    'dịch vụ 7',
    'dịch vụ 8',
    'dịch vụ 9',
    'dịch vụ 10',
    'dịch vụ 11',
    'dịch vụ 12',
    'dịch vụ 13',
    'dịch vụ 14',
  ];

  // Component thông báo
  const Notification = () => (
    <a href="#">
      <p className="notification">
        <i className="fa-regular fa-bell" /> Thông báo
      </p>
    </a>
  );

  return (
    <div id="header">
      <div className="container-fluid bgheader">
        <div className="row align-items-center">
          <div className="col-lg-2 col-md-2 col-sm-12 text-center logo-container">
            <p className="logo-name">
              <a className="stlogo" href="/">PUTINKA</a>
            </p>
          </div>
          <div className="tkiem col-lg-6 col-md-6 col-sm-12 d-flex justify-content-center">
            <input id="search" name="search_item" type="search" placeholder=" Nhập Tìm Kiếm ..." />
            <button id="btn_search">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </div>
          <div className="form_login col-lg-4 col-md-4 col-sm-12 d-flex justify-content-center align-items-center">
            {isLoggedIn ? (
              <>
                <UserDropdown
                  user={user}
                  onLogout={handleLogout}
                  isOpen={isDropdownOpen}
                  toggle={toggleDropdown}
                />
                <Notification />
              </>
            ) : (
              <>
                <Link to="/register">
                  <button id="myBtn" className="myBtn">Đăng Ký</button>
                </Link>
                <p className="space">|</p>
                <Link to="/login">
                  <button id="dangNhap" className="myBtn">Đăng Nhập</button>
                </Link>
                <Notification />
              </>
            )}
          </div>
        </div>
        <div className="row">
          <div className="ketNoi col-lg-2 col-md-2 col-sm-12 d-flex justify-content-center">
            <p>Kết nối </p>
            <a href>
              <i className="fa-brands fa-facebook" />
            </a>
            <a href>
              <i className="fa-brands fa-tiktok" />
            </a>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <ul className="services d-flex">
              {services.map((service, index) => (
                <a key={index} href="#">
                  <li>{service}</li>
                </a>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
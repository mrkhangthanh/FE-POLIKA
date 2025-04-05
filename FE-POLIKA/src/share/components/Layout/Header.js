import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <div id="header">
        <div className="container-fluid bgheader">
          <div className="row align-items-center">
            <div className="col-lg-2 col-md-2 col-sm-12 text-center .logo-container">
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
                  <div
                    className="user-menu"
                    onClick={toggleDropdown}
                    onMouseEnter={() => setIsDropdownOpen(true)} // Mở dropdown khi hover
                    onMouseLeave={() => setIsDropdownOpen(false)} // Đóng dropdown khi rời chuột
                  >
                    <p className="welcome-text">
                      <i className="fa-solid fa-user" style={{ marginRight: '5px' }} /> {/* Icon user */}
                      Chào, {user.name}
                      {/*  [SỬA] Thêm icon mũi tên chỉ xuống */}
                      <i className="fa-solid fa-chevron-down" style={{ marginLeft: '5px' }} />
                    </p>
                    {isDropdownOpen && (
                      <div
                        className="dropdown-menu"
                        onMouseEnter={() => setIsDropdownOpen(true)} //  [SỬA] Giữ dropdown mở khi hover vào dropdown
                        onMouseLeave={() => setIsDropdownOpen(false)} //  [SỬA] Đóng dropdown khi rời chuột khỏi dropdown
                      >
                        <Link to="/profile" className="dropdown-item">
                          <i className="fa-solid fa-user-circle" style={{ marginRight: '5px' }} />
                          Thông tin tài khoản
                        </Link>
                        <Link to="/settings" className="dropdown-item">
                          <i className="fa-solid fa-gear" style={{ marginRight: '5px' }} />
                          Cài đặt
                        </Link>
                      </div>
                    )}
                  </div>
                  <p className="space">|</p>
                  <button id="dangXuat" className="myBtn" onClick={handleLogout}>
                    Đăng Xuất
                  </button>
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
                </>
              )}
              <p className="space">|</p>
              <a href="#">
                <p>
                  <i className="fa-solid fa-cart-shopping" />
                </p>
              </a>
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
                <a href="#">
                  <li>dịch vụ 1 </li>
                </a>
                <a href="#">
                  <li>dịch vụ 2 </li>
                </a>
                <a href="#">
                  <li>dịch vụ 3 </li>
                </a>
                <a href="#">
                  <li>dịch vụ 4 </li>
                </a>
                <a href="#">
                  <li>dịch vụ 5 </li>
                </a>
                <a href="#">
                  <li>dịch vụ 6 </li>
                </a>
                <a href="#">
                  <li>dịch vụ 7 </li>
                </a>
                <a href="#">
                  <li>dịch vụ 8 </li>
                </a>
                <a href="#">
                  <li>dịch vụ 9 </li>
                </a>
                <a href="#">
                  <li>dịch vụ 8 </li>
                </a>
                <a href="#">
                  <li>dịch vụ 9 </li>
                </a>
              </ul>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <ul className="maintence d-flex justify-content-center">
                <a href="#">
                  <li>Kênh Thợ </li>
                </a>
                <a href="#">
                  <li>Kênh Khách Hàng</li>
                </a>
                <a href="#">
                  <li>
                    <i className="fa-regular fa-bell" /> Thông báo
                  </li>
                </a>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
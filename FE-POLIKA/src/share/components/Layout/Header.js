import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
    <div id="header">
    <div className="container-fluid bgheader">
      <div className="row align-items-center">
        <div className="col-lg-2 col-md-2 col-sm-12 text-center .logo-container">
          <p className="logo-name"><a className="stlogo" href = "/">PUTINKA</a></p>
        </div>
        <div className="tkiem col-lg-6 col-md-6 col-sm-12 d-flex justify-content-center">
          <input id="search" name="search_item" type="search" placeholder=" Nhập Tìm Kiếm ..." />
          <button id="btn_search"> <i className="fa-solid fa-magnifying-glass" />
          </button></div>
        <div className="form_login col-lg-4 col-md-4 col-sm-12 d-flex justify-content-center align-items-center">
          <Link to='/dang-ky'><button id="myBtn" className="myBtn">Đăng Ký</button></Link>
          <p className="space">|</p>
          <Link to='/login'><button id="dangNhap" className="myBtn">Đăng Nhập</button></Link>
          <p className="space">|</p>
          <a href="#">
            <p><i className="fa-solid fa-cart-shopping" /></p>
          </a>
        </div>
      </div>
      <div className="row">
        <div className="ketNoi col-lg-2 col-md-2 col-sm-12 d-flex justify-content-center">
          <p>Kết nối </p>
          <a href><i className="fa-brands fa-facebook" /></a>
          <a href><i className="fa-brands fa-tiktok" /></a>
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
              <li><i className="fa-regular fa-bell" /> Thông báo</li>
            </a>
          </ul>
        </div>
      </div>
    </div>
  </div>
    </>
  )
}

export default Header
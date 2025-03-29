import React from 'react';
import Header from '../../share/components/Layout/Header';
import Footer from '../../share/components/Layout/Footer';
// import './Register.module.css'

const Register = () => {
  return (
    <>
    <Header/>
    <div className="registration-container-rg">
  <form className="registration-form-rg">
    <h2>Đăng ký tài khoản</h2>
    <div className="input-group-rg">
      <label htmlFor="username">Tên người dùng:</label>
      <input type="text" id="username-rg" placeholder="Nhập tên người dùng" required />
    </div>
    <div className="input-group-rg">
      <label htmlFor="email">Email:</label>
      <input type="email" id="email-rg" placeholder="Nhập email của bạn" required />
    </div>
    <div className="input-group-rg">
      <label htmlFor="password">Mật khẩu:</label>
      <input type="password" id="password-rg" placeholder="Nhập mật khẩu" required />
    </div>
    <div className="input-group-rg checkbox-group-rg">
      <input type="checkbox" id="terms-rg" required />
      <label htmlFor="terms-">Tôi đồng ý với <a href="#">điều khoản dịch vụ</a></label>
    </div>
    <div className='button-rg'><button type="submit-rg">Đăng ký</button></div>
  
    
    <p className="login-link-rg">Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
  </form>
</div>
<Footer/>
</>
  );
};

export default Register;
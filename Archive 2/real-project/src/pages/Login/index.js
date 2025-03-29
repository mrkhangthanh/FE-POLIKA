import React from 'react';
import Header from '../../share/components/Layout/Header';
import Footer from '../../share/components/Layout/Footer';
import './Login.css'; // Import file CSS riêng cho trang đăng nhập

const Login = () => {
  return (
    <>
      <Header />
      <div className="login-container-lg">
        <form className="login-form-lg">
          <h2>Đăng nhập</h2>
          <div className="input-group-lg">
            <label htmlFor="email-lg">Email</label>
            <input type="email" id="email-lg" placeholder="Nhập email của bạn" required />
          </div>
          <div className="input-group-lg">
            <label htmlFor="password-lg">Mật khẩu</label>
            <input type="password" id="password-lg" placeholder="Nhập mật khẩu" required />
          </div>
          {/* <div className="input-group-lg checkbox-group-lg">
            <input type="checkbox" id="remember-lg" />
            <label htmlFor="remember-lg">Nhớ tôi</label>
          </div> */}
          <div className="button-lg">
            <button type="submit">Đăng nhập</button>
          </div>
          <p className="register-link-lg">
            Chưa có tài khoản? <a href="/dang-ky">Đăng ký</a>
          </p>
          <p className="forgot-password-lg">
            <a href="/forgot-password">Quên mật khẩu?</a>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
import React from 'react';
import Header from '../../share/components/Layout/Header';
import Footer from '../../share/components/Layout/Footer';
import './ForgotPassword.css'; // Import file CSS riêng

const ForgotPassword = () => {
  return (
    <>
      <Header />
      <div className="forgot-password-container-fp">
        <form className="forgot-password-form-fp">
          <h2>Quên mật khẩu</h2>
          <p>Nhập email của bạn để khôi phục mật khẩu.</p>
          <div className="input-group-fp">
            <input
              type="email"
              id="email-fp"
              placeholder="Nhập email của bạn"
              required
            />
          </div>
          <div className="button-fp">
            <button type="submit">Gửi yêu cầu</button>
          </div>
          <p className="back-link-fp">
            <a href="/login">Quay lại đăng nhập</a>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
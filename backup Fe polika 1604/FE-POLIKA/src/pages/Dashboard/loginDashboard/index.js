import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../services/Api';
import { BASE_API } from '../../../constants/app';
import Header from '../../../share/components/Layout/Header';
import Footer from '../../../share/components/Layout/Footer';
import './loginDashboard.css';

const LoginDashboard = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const allowedRoles = ['admin', 'manager', 'content_writer', 'agent', 'technician'];
    if (token && user && allowedRoles.includes(user.role)) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    if (!identifier || !password) {
      setError('Vui lòng điền đầy đủ thông tin.');
      setIsLoading(false);
      return;
    }

    try {
      // console.log('Sending login request to:', `${BASE_API}/login`);
      // console.log('Payload:', { identifier, password });

      const response = await login({ identifier, password });

      setMessage(response.data.message || 'Đăng nhập thành công!');
      const { accessToken, user } = response.data;
      console.log('Token:', accessToken);
      console.log('User:', user);

      // Lưu token và user vào localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);

      const allowedRoles = ['admin', 'manager', 'content_writer', 'agent', 'technician'];
      if (!allowedRoles.includes(user.role)) {
        setError('Tài khoản này không được phép đăng nhập ở đây. Vui lòng sử dụng trang /login.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setIsLoading(false);
        return;
      }

      // [SỬA] Giảm thời gian trì hoãn và đảm bảo localStorage được cập nhật
      setTimeout(() => {
        navigate('/dashboard', { replace: true }); // Thêm replace: true để tránh vòng lặp điều hướng
        setIsLoading(false);
      }, 100); // Giảm từ 1000ms xuống 100ms
    } catch (err) {
      console.error('Error details:', err);
      console.log('Full error response:', err.response);

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-container-lg">
        <form className="login-form-lg" onSubmit={handleLogin}>
          <h2>Trang Quản Trị</h2>
          {error && <p className="error-message-lg">{error}</p>}
          {message && <p className="success-message-lg">{message}</p>}
          <div className="input-group-lg">
            <label htmlFor="identifier-lg">Số Điện Thoại hoặc Email</label>
            <input
              type="text"
              id="identifier-lg"
              placeholder="Nhập SĐT hoặc Email của bạn"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="input-group-lg">
            <label htmlFor="password-lg">Mật khẩu</label>
            <input
              type="password"
              id="password-lg"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="button-lg">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
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

export default LoginDashboard;
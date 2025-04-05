import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/Api';
import Header from '../../share/components/Layout/Header';
import Footer from '../../share/components/Layout/Footer';
import BottomNav from '../../share/components/BottomNav';
import './Login.css';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      if (user.role === 'customer') {
        navigate('/');
      } else if (user.role === 'technician') {
        navigate('/');
      } else if (user.role === 'admin') {
        navigate('/dashboard');
      }
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
      console.log('Payload:', { identifier, password });
      const response = await login({ identifier, password });
      console.log('Login response:', response.data);

      setMessage('Đăng nhập thành công!');
      const { accessToken, user } = response.data;

      //  [SỬA] Lưu vào localStorage và đảm bảo đồng bộ
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);

      //  [SỬA] Kiểm tra xem localStorage đã được lưu chưa
      const storedToken = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user'));
      console.log('Stored in localStorage:', { storedToken, storedUser });

      const allowedRoles = ['customer', 'technician'];
      if (!allowedRoles.includes(user.role)) {
        setError('Chỉ khách hàng (customer) hoặc kỹ thuật viên (technician) mới có thể đăng nhập tại đây.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setIsLoading(false);
        return;
      }

      //  [SỬA] Điều hướng trực tiếp đến trang đích và đảm bảo đồng bộ
      setTimeout(() => {
        if (user.role === 'customer') {
          navigate('/', { replace: true });
        } else if (user.role === 'technician') {
          navigate('/', { replace: true });
        }
        setIsLoading(false);
      }, 100);
    } catch (err) {
      console.error('Error details:', err);
      console.log('Error response:', err.response); //  [SỬA] Thêm log chi tiết
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
          <h2>Đăng nhập</h2>
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
            Chưa có tài khoản? <a href="/register">Đăng ký</a>
          </p>
          <p className="forgot-password-lg">
            <a href="/forgot-password">Quên mật khẩu?</a>
          </p>
        </form>
      </div>
      <BottomNav />
      {/* Footer */}
      <Footer />
    </>
  );
};

export default Login;
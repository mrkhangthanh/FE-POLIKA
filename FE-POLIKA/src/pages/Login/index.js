import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../services/Api';
import Header from '../../share/components/Layout/Header';
import Footer from '../../share/components/Layout/Footer';
import BottomNav from '../../share/components/BottomNav';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  // Cuộn lên đầu trang và focus vào form khi trang được tải
  useEffect(() => {
    if (location.state?.scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (formRef.current) {
      formRef.current.querySelector('input')?.focus();
    }
  }, [location]);

  // Kiểm tra nếu người dùng đã đăng nhập (chỉ chạy một lần khi component mount)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      const allowedRoles = ['customer', 'technician'];
      if (allowedRoles.includes(user.role)) {
        navigate(location.state?.redirectTo || '/', { replace: true });
      } else if (user.role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        // Nếu vai trò không hợp lệ, xóa localStorage và ở lại trang đăng nhập
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setError('Chỉ khách hàng (customer) hoặc kỹ thuật viên (technician) mới có thể đăng nhập tại đây.');
      }
    }
  }, [navigate, location.state]);

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
      const response = await login({ identifier, password });

      const { accessToken, user } = response.data;

      // Lưu vào localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);

      // Kiểm tra vai trò
      const allowedRoles = ['customer', 'technician'];
      if (!allowedRoles.includes(user.role)) {
        setError('Chỉ khách hàng (customer) hoặc kỹ thuật viên (technician) mới có thể đăng nhập tại đây.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setIsLoading(false);
        return;
      }

      // Hiển thị thông báo thành công
      setMessage('Đăng nhập thành công!');
      toast.success('Đăng nhập thành công!');

      // Điều hướng ngay sau khi hiển thị toast
      setTimeout(() => {
        if (user.role === 'customer' || user.role === 'technician') {
          navigate(location.state?.redirectTo || '/', { replace: true });
        }
      }, 900); // Delay 1 giây để toast hiển thị
    } catch (err) {
      console.error('Error details:', err);
      console.log('Error response:', err.response);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-container-lg">
        <form className="login-form-lg" onSubmit={handleLogin} ref={formRef}>
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
      <Footer />
    </>
  );
};

export default Login;
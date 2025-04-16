import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, updateUserFcmToken } from '../../services/Api';
import Header from '../../share/components/Layout/Header';
import Footer from '../../share/components/Layout/Footer';
import BottomNav from '../../share/components/BottomNav';
import { getFcmToken } from '../../firebase';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ identifier: '', password: '', general: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  useEffect(() => {
    if (location.state?.scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (formRef.current) {
      formRef.current.querySelector('input')?.focus();
    }
  }, [location]);

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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setErrors({ ...errors, general: 'Chỉ khách hàng (customer) hoặc kỹ thuật viên (technician) mới có thể đăng nhập tại đây.' });
      }
    }
  }, [navigate, location.state]);

  const retryRequest = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (err) {
        if (i === retries - 1) throw err;
        console.log(`Retrying request (${i + 1}/${retries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  // <span style="color:red">[CHỈNH SỬA]</span>: Xóa lỗi khi người dùng nhập lại
  const handleIdentifierChange = (e) => {
    setIdentifier(e.target.value);
    if (errors.identifier) {
      setErrors({ ...errors, identifier: '' });
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: '' });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // <span style="color:red">[CHỈNH SỬA]</span>: Xóa tất cả lỗi trước khi kiểm tra
    setErrors({ identifier: '', password: '', general: '' });
    setMessage('');
    setIsLoading(true);

    if (!identifier || !password) {
      setErrors({
        identifier: !identifier ? 'Vui lòng nhập email hoặc số điện thoại.' : '',
        password: !password ? 'Vui lòng nhập mật khẩu.' : '',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await retryRequest(() => login({ identifier, password }), 3, 1000);

      const { accessToken, user } = response.data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);

      const allowedRoles = ['customer', 'technician'];
      if (!allowedRoles.includes(user.role)) {
        setErrors({ ...errors, general: 'Chỉ khách hàng (customer) hoặc kỹ thuật viên (technician) mới có thể đăng nhập tại đây.' });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setIsLoading(false);
        return;
      }

      const fcmToken = await getFcmToken();
      if (fcmToken) {
        try {
          await updateUserFcmToken(user._id, fcmToken);
          console.log('FCM token saved:', fcmToken);
        } catch (error) {
          console.error('Error saving FCM token:', error);
          toast.warn('Không thể lưu FCM token. Một số tính năng thông báo có thể không hoạt động.');
        }
      } else {
        console.warn('No FCM token available.');
        toast.warn('Không thể lấy FCM token. Vui lòng cấp quyền thông báo để nhận thông báo từ hệ thống.');
      }

      setMessage('Đăng nhập thành công!');
      toast.success('Đăng nhập thành công!');

      setTimeout(() => {
        if (user.role === 'customer' || user.role === 'technician') {
          navigate(location.state?.redirectTo || '/', { replace: true });
        }
      }, 900);
    } catch (err) {
      console.error('Error details:', err);
      console.log('Error response:', err.response);

      const errorData = err.response?.data || {};
      const errorCode = errorData.errorCode || 'UNKNOWN_ERROR';
      const errorMessage = errorData.errorMessage || 'Đăng nhập thất bại. Vui lòng thử lại.';
      const errorField = errorData.field || 'general';

      setErrors({ ...errors, [errorField]: errorMessage });
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
          {errors.general && <p className="error-message-lg">{errors.general}</p>}
          {message && <p className="success-message-lg">{message}</p>}
          <div className="input-group-lg">
            <label htmlFor="identifier-lg">Số Điện Thoại hoặc Email</label>
            <input
              type="text"
              id="identifier-lg"
              placeholder="Nhập SĐT hoặc Email của bạn"
              value={identifier}
              onChange={handleIdentifierChange} // <span style="color:red">[CHỈNH SỬA]</span>: Sử dụng hàm mới
              required
              disabled={isLoading}
            />
            {errors.identifier && <p className="error-message-lg">{errors.identifier}</p>}
          </div>
          <div className="input-group-lg">
            <label htmlFor="password-lg">Mật khẩu</label>
            <input
              type="password"
              id="password-lg"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={handlePasswordChange} // <span style="color:red">[CHỈNH SỬA]</span>: Sử dụng hàm mới
              required
              disabled={isLoading}
            />
            {errors.password && <p className="error-message-lg">{errors.password}</p>}
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
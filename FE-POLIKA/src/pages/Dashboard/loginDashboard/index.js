import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../services/Api'; // Đã sửa tên import từ Api thành Apis để đồng bộ với cấu trúc thư mục
import { BASE_API } from '../../../constants/app';
import Header from '../../../share/components/Layout/Header';
import Footer from '../../../share/components/Layout/Footer';
import './loginDashboard.css';

const LoginDashboard = () => {
  const [identifier, setIdentifier] = useState(''); // 🔴 [SỬA] Đổi từ email thành identifier để hỗ trợ cả email và số điện thoại
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
  const navigate = useNavigate();

  // Kiểm tra nếu đã đăng nhập thì điều hướng về Dashboard
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
    setIsLoading(true); // Bật trạng thái loading

    // Kiểm tra input
    if (!identifier || !password) { // 🔴 [SỬA] Đổi email thành identifier
      setError('Vui lòng điền đầy đủ thông tin.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Sending login request to:', `${BASE_API}/login`);
      console.log('Payload:', { identifier, password }); // 🔴 [SỬA] Sử dụng identifier thay vì email

      const response = await login({ identifier, password }); // 🔴 [SỬA] Sử dụng identifier thay vì email

      // Xử lý phản hồi từ API
      setMessage(response.data.message || 'Đăng nhập thành công!');
      const { accessToken, user } = response.data; // 🔴 [SỬA] Sử dụng accessToken thay vì token
      console.log('Token:', accessToken);
      console.log('User:', user);

      // Lưu token và user vào localStorage
      localStorage.setItem('token', accessToken); // 🔴 [SỬA] Sử dụng accessToken
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role); // Lưu role để kiểm tra quyền truy cập

      // Kiểm tra quyền
      const allowedRoles = ['admin', 'manager', 'content_writer', 'agent', 'technician'];
      if (!allowedRoles.includes(user.role)) {
        setError('Tài khoản này không được phép đăng nhập ở đây. Vui lòng sử dụng trang /login.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setIsLoading(false);
        return;
      }

      // Điều hướng về Dashboard sau 1 giây
      setTimeout(() => {
        navigate('/dashboard');
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error details:', err);
      console.log('Full error response:', err.response); // Thêm dòng này để ghi lại phản hồi lỗi đầy đủ

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
              type="text" // 🔴 [SỬA] Sử dụng type="text" để hỗ trợ cả email và số điện thoại
              id="identifier-lg" // 🔴 [SỬA] Đổi id từ email-lg thành identifier-lg
              placeholder="Nhập SĐT hoặc Email của bạn"
              value={identifier} // 🔴 [SỬA] Đổi từ email thành identifier
              onChange={(e) => setIdentifier(e.target.value)} // 🔴 [SỬA] Đổi từ setEmail thành setIdentifier
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
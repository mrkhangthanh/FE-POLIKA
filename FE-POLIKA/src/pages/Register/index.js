import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/Api'; // Import phương thức register
import Header from '../../share/components/Layout/Header';
import Footer from '../../share/components/Layout/Footer';
import './Register.css'; // Sử dụng file CSS của bạn

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // Thêm thông báo thành công
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
  const navigate = useNavigate();

  // Xử lý submit form
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true); // Hiển thị trạng thái loading

    // Kiểm tra dữ liệu cơ bản
    if (!name || !email || !password || !phoneNumber) {
      setError('Vui lòng điền đầy đủ thông tin.');
      setIsLoading(false);
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ.');
      setIsLoading(false);
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      setIsLoading(false);
      return;
    }

    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Số điện thoại phải có đúng 10 chữ số.');
      setIsLoading(false);
      return;
    }

    try {
      // Gọi API đăng ký
      const response = await register({
        name,
        email,
        password,
        phone_number: phoneNumber, // Đảm bảo API chấp nhận 'phone_number'
        role,
      });

      setMessage(response.data.message || 'Đăng ký thành công!');
      console.log('Register successful:', response.data);

      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      setRole('customer');

      // Chuyển hướng sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.error || err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
      );
      console.error('Error:', err);
    } finally {
      setIsLoading(false); // Tắt trạng thái loading
    }
  };

  return (
    <>
      <Header />
      <div className="register-container-lg">
        <form className="register-form-lg" onSubmit={handleRegister}>
          <h2>Đăng ký tài khoản</h2>
          {error && <p className="error-message-lg" style={{ color: 'red' }}>{error}</p>}
          {message && <p className="success-message-lg" style={{ color: 'green' }}>{message}</p>}
          <div className="input-group-lg">
            <label htmlFor="name-lg">Tên người dùng</label>
            <input
              type="text"
              id="name-lg"
              placeholder="Nhập tên của bạn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="input-group-lg">
            <label htmlFor="email-lg">Email</label>
            <input
              type="email"
              id="email-lg"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
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
              disabled={isLoading}
              required
            />
          </div>
          <div className="input-group-lg">
            <label htmlFor="phone-lg">Số điện thoại</label>
            <input
              type="tel"
              id="phone-lg"
              placeholder="Nhập số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="input-group-lg">
            <label htmlFor="role-lg">Vai trò</label>
            <select
              id="role-lg"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
            >
              <option value="customer">Khách hàng</option>
              <option value="technician">Thợ</option>
              <option value="agent">Đại lý</option>
            </select>
          </div>
          <div className="button-lg">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </div>
          <p className="login-link-lg">
            Đã có tài khoản? <a href="/login">Đăng nhập</a>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Register;
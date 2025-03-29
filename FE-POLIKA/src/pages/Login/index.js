import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/Api';
import { BASE_API } from '../../constants/app';
import Header from '../../share/components/Layout/Header';
import Footer from '../../share/components/Layout/Footer';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      console.log('Sending login request to:', `${BASE_API}/login`);
      console.log('Payload:', { email, password });
      const response = await login({
        email,
        password,
      });
      setMessage(response.data.message || 'Đăng nhập thành công!');

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role !== 'admin') {
        setError('Chỉ admin mới có thể truy cập dashboard.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return;
      }

      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <>
      <Header />
      <div className="login-container-lg">
        <form className="login-form-lg" onSubmit={handleLogin}>
          <h2>Đăng nhập</h2>
          {error && <p className="error-message-lg" style={{ color: 'red' }}>{error}</p>}
          {message && <p className="success-message-lg" style={{ color: 'green' }}>{message}</p>}
          <div className="input-group-lg">
            <label htmlFor="email-lg">Email</label>
            <input
              type="email"
              id="email-lg"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
            />
          </div>
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
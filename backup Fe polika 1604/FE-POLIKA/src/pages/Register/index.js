import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, getCategoryService } from '../../services/Api';
import Header from '../../share/components/Layout/Header';
import Footer from '../../share/components/Layout/Footer';
import BottomNav from '../../share/components/BottomNav';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('customer');
  const [address, setAddress] = useState({
    street: '',
    ward: '',
    district: '',
    city: '',
    country: 'Vietnam',
  });
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const navigate = useNavigate();

  // Lấy danh mục dịch vụ từ API khi component mount
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await getCategoryService();
        const serviceTypes = Array.isArray(response.data.service_types)
          ? response.data.service_types
          : [];
        setServiceTypes(serviceTypes);
      } catch (err) {
        console.error('Error fetching service types:', err);
      }
    };

    fetchServiceTypes();
  }, []);

  // Xử lý thay đổi vai trò
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    if (selectedRole === 'technician') {
      setShowModal(true);
    } else {
      setShowModal(false);
      setSelectedServices([]);
      setAddress({
        street: '',
        ward: '',
        district: '',
        city: '',
        country: 'Vietnam',
      });
      setAgreeToTerms(false);
    }
  };

  // Xử lý chọn lĩnh vực công việc
  const handleServiceChange = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Xử lý thay đổi địa chỉ
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedServices([]);
    setAddress({
      street: '',
      ward: '',
      district: '',
      city: '',
      country: 'Vietnam',
    });
    setAgreeToTerms(false);
    setRole('customer');
  };

  // Kiểm tra xem tất cả thông tin trong modal đã được điền đầy đủ chưa
  const isModalComplete = () => {
    return (
      selectedServices.length > 0 &&
      address.street &&
      address.ward &&
      address.district &&
      address.city &&
      address.country &&
      agreeToTerms
    );
  };

  // Chia danh sách dịch vụ thành 2 cột
  const splitServicesIntoColumns = () => {
    // Tách dịch vụ "Khác..." ra khỏi danh sách
    const otherService = serviceTypes.find((service) => service.label === 'Khác...');
    const otherServices = serviceTypes.filter((service) => service.label !== 'Khác...');

    // Chia các dịch vụ còn lại thành 2 cột
    const midPoint = Math.ceil(otherServices.length / 2);
    const leftColumn = otherServices.slice(0, midPoint);
    const rightColumn = otherServices.slice(midPoint);

    // Đảm bảo mỗi cột có tối đa 6 dòng (bao gồm "Khác..." ở dòng cuối của cột phải)
    const maxPerColumn = 5; // Để lại 1 vị trí cho "Khác..." ở cột phải
    const leftColumnLimited = leftColumn.slice(0, maxPerColumn);
    const rightColumnLimited = rightColumn.slice(0, maxPerColumn);

    // Thêm "Khác..." vào dòng cuối của cột phải
    if (otherService) {
      rightColumnLimited.push(otherService);
    }

    return { leftColumn: leftColumnLimited, rightColumn: rightColumnLimited };
  };

  const { leftColumn, rightColumn } = splitServicesIntoColumns();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    // Validation cơ bản
    if (!name || !email || !password || !phoneNumber) {
      setError('Vui lòng điền đầy đủ thông tin.');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      setIsLoading(false);
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Số điện thoại phải có đúng 10 chữ số.');
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        name,
        email,
        password,
        phone_number: phoneNumber,
        role,
        address: role === 'technician' ? address : undefined,
        services: role === 'technician' ? selectedServices : [],
      };

      console.log('Register payload:', userData);

      const response = await register(userData);

      setMessage(response.data.message || 'Đăng ký thành công!');
      console.log('Register successful:', response.data);

      setName('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      setRole('customer');
      setAddress({
        street: '',
        ward: '',
        district: '',
        city: '',
        country: 'Vietnam',
      });
      setSelectedServices([]);
      setAgreeToTerms(false);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.error || err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
      );
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
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
              onChange={handleRoleChange}
              disabled={isLoading}
            >
              <option value="customer">Khách hàng</option>
              <option value="technician">Thợ</option>
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

      {/* Modal chọn thông tin thợ */}
      {showModal && (
        <div className="modal-overlay-lg">
          <div className="modal-content-lg">
            <h3>Thông tin Thợ</h3>

            {/* Phần chọn lĩnh vực công việc */}
            <div className="modal-section-lg">
              <h4>Lĩnh vực công việc</h4>
              <div className="service-columns-lg">
                {/* Cột trái */}
                <div className="service-column-lg">
                  {leftColumn.map((service) => (
                    <label key={service._id} className="service-checkbox-lg">
                      <input
                        type="checkbox"
                        value={service._id}
                        checked={selectedServices.includes(service._id)}
                        onChange={() => handleServiceChange(service._id)}
                      />
                      {service.label}
                    </label>
                  ))}
                </div>
                {/* Cột phải */}
                <div className="service-column-lg">
                  {rightColumn.map((service) => (
                    <label key={service._id} className="service-checkbox-lg">
                      <input
                        type="checkbox"
                        value={service._id}
                        checked={selectedServices.includes(service._id)}
                        onChange={() => handleServiceChange(service._id)}
                      />
                      {service.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Phần nhập địa chỉ */}
            <div className="modal-section-lg">
              <h4>Thông tin địa chỉ</h4>
              <div className="input-group-lg">
                <label htmlFor="street-modal-lg">Đường</label>
                <input
                  type="text"
                  id="street-modal-lg"
                  name="street"
                  placeholder="Nhập tên đường"
                  value={address.street}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="input-group-lg">
                <label htmlFor="ward-modal-lg">Phường/Xã</label>
                <input
                  type="text"
                  id="ward-modal-lg"
                  name="ward"
                  placeholder="Nhập phường/xã"
                  value={address.ward}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="input-group-lg">
                <label htmlFor="district-modal-lg">Quận/Huyện</label>
                <input
                  type="text"
                  id="district-modal-lg"
                  name="district"
                  placeholder="Nhập quận/huyện"
                  value={address.district}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="input-group-lg">
                <label htmlFor="city-modal-lg">Thành phố</label>
                <input
                  type="text"
                  id="city-modal-lg"
                  name="city"
                  placeholder="Nhập thành phố"
                  value={address.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="input-group-lg">
                <label htmlFor="country-modal-lg">Quốc gia</label>
                <input
                  type="text"
                  id="country-modal-lg"
                  name="country"
                  placeholder="Nhập quốc gia"
                  value={address.country}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>

            {/* Checkbox điều khoản */}
            <div className="modal-section-lg terms-checkbox-lg">
              <label>
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                />
                Tôi đồng ý với mọi, <a href="/terms" target="_blank">điều khoản và dịch vụ</a>
              </label>
            </div>

            <div className="modal-actions-lg">
              <button onClick={handleCloseModal} className="modal-button-lg cancel">
                Hủy
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="modal-button-lg confirm"
                disabled={!isModalComplete()}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
      <Footer />
    </>
  );
};

export default Register;
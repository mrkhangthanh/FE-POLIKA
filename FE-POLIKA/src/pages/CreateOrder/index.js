import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../share/components/Layout/Header';
import BottomNav from '../../share/components/BottomNav';
import { createOrder, getCategoryService } from '../../services/Api'; // Import API mới
import './CreateOrder.css';

const CreateOrder = () => {
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = localStorage.getItem('token') && user && (user.role === 'customer' || user.role === 'technician');

  // State để quản lý form
  const [formData, setFormData] = useState({
    service_type: '',
    description: '',
    street: '',
    city: '',
    district: '',
    ward: '',
    country: 'Vietnam',
    phone_number: '',
    price: '',
  });

  // State để quản lý danh sách service_type từ BE
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // State để quản lý lỗi và thông báo
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Nếu chưa đăng nhập, điều hướng về trang login
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { redirectTo: '/create-order' } });
    }
  }, [isLoggedIn, navigate]);

  // Gọi API để lấy danh sách service_type khi component được mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await getCategoryService();
        setCategories(response.data.service_types); // Lưu danh sách service_types từ BE
      } catch (err) {
        console.error('Error fetching service types:', err);
        setErrors({ general: 'Không thể tải danh sách dịch vụ. Vui lòng thử lại.' });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Xóa lỗi khi người dùng nhập
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    setIsLoading(true);

    // Validation
    const newErrors = {};
    if (!formData.service_type) newErrors.service_type = 'Vui lòng chọn danh mục dịch vụ';
    if (!formData.description) newErrors.description = 'Vui lòng nhập mô tả vấn đề';
    if (!formData.street) newErrors.street = 'Vui lòng nhập số nhà, đường';
    if (!formData.city) newErrors.city = 'Vui lòng nhập thành phố';
    if (!formData.district) newErrors.district = 'Vui lòng nhập quận/huyện';
    if (!formData.ward) newErrors.ward = 'Vui lòng nhập phường/xã';
    if (!formData.country) newErrors.country = 'Vui lòng nhập quốc gia';
    if (!formData.phone_number) {
      newErrors.phone_number = 'Vui lòng nhập số điện thoại';
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Số điện thoại phải có 10 chữ số.';
    }
    if (!formData.price) {
      newErrors.price = 'Vui lòng nhập mức giá';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Mức giá phải là số lớn hơn 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Chuẩn bị dữ liệu gửi lên BE
    const orderData = {
      service_type: formData.service_type,
      description: formData.description,
      address: {
        street: formData.street,
        city: formData.city,
        district: formData.district,
        ward: formData.ward,
        country: formData.country,
      },
      phone_number: formData.phone_number,
      price: parseFloat(formData.price),
    };

    // Log dữ liệu gửi lên
    console.log('Order Data Sent:', orderData);

    try {
      // Gọi API tạo đơn hàng
      const response = await createOrder(orderData);
      console.log('Create Order Response:', response);

      // Kiểm tra địa chỉ trong response
  if (response.order && response.order.address) {
    console.log('Saved Address:', response.order.address);
  }

      setMessage('Đơn hàng đã được tạo thành công!');
      setTimeout(() => {
        setIsLoading(false);
        navigate('/list-orders');
      }, 1000);
    } catch (err) {
      console.error('Error creating order:', err);
      console.log('Error Response Data:', err.response?.data);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Tạo đơn hàng thất bại. Vui lòng thử lại.';
      setErrors({ general: errorMessage });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="create-order-container">
        <div className="create-order-header">
          <h2>
            <i className="fa-solid fa-plus" style={{ marginRight: '10px' }} />
            Tạo Đơn Hàng
          </h2>
        </div>

        <div className="create-order-section">
          <form onSubmit={handleSubmit}>
            {/* Thông báo lỗi chung hoặc thành công */}
            {errors.general && <p className="error">{errors.general}</p>}
            {message && <p className="success">{message}</p>}

            {/* Danh mục dịch vụ (service_type) */}
            <div className="form-group">
              <label htmlFor="service_type">
                Danh mục dịch vụ <span className="required">*</span>
              </label>
              <select
                id="service_type"
                name="service_type"
                value={formData.service_type}
                onChange={handleInputChange}
                disabled={isLoading || isLoadingCategories}
              >
                <option value="">{isLoadingCategories ? 'Đang tải...' : 'Chọn danh mục'}</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.service_type && <p className="error">{errors.service_type}</p>}
            </div>

            {/* Mô tả vấn đề (description) */}
            <div className="form-group">
              <label htmlFor="description">
                Mô tả vấn đề <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mô tả chi tiết vấn đề của bạn"
                rows="4"
                disabled={isLoading}
              />
              {errors.description && <p className="error">{errors.description}</p>}
            </div>

            {/* Địa chỉ (address) */}
            <div className="form-group">
              <label htmlFor="street">
                Số nhà, Đường <span className="required">*</span>
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Ví dụ: 123 Đường Láng"
                disabled={isLoading}
              />
              {errors.street && <p className="error">{errors.street}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="city">
                Thành phố <span className="required">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Ví dụ: Hà Nội"
                disabled={isLoading}
              />
              {errors.city && <p className="error">{errors.city}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="district">
                Quận/Huyện <span className="required">*</span>
              </label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                placeholder="Ví dụ: Ba Đình"
                disabled={isLoading}
              />
              {errors.district && <p className="error">{errors.district}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="ward">
                Phường/Xã <span className="required">*</span>
              </label>
              <input
                type="text"
                id="ward"
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                placeholder="Ví dụ: Trúc Bạch"
                disabled={isLoading}
              />
              {errors.ward && <p className="error">{errors.ward}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="country">
                Quốc gia <span className="required">*</span>
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Ví dụ: Việt Nam"
                disabled={isLoading}
              />
              {errors.country && <p className="error">{errors.country}</p>}
            </div>

            {/* Số điện thoại (phone_number) */}
            <div className="form-group">
              <label htmlFor="phone_number">
                Số điện thoại <span className="required">*</span>
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="Ví dụ: 0393456789"
                disabled={isLoading}
              />
              {errors.phone_number && <p className="error">{errors.phone_number}</p>}
            </div>

            {/* Mức giá (price) */}
            <div className="form-group">
              <label htmlFor="price">
                Mức giá (VND) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Ví dụ: 100000"
                disabled={isLoading}
              />
              {errors.price && <p className="error">{errors.price}</p>}
            </div>

            {/* Nút tạo đơn */}
            <button type="submit" className="create-order-button" disabled={isLoading}>
              {isLoading ? 'Đang tạo đơn...' : 'Tạo đơn'}
            </button>
          </form>
        </div>

        <BottomNav />
      </div>
    </>
  );
};

export default CreateOrder;
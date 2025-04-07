import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../share/components/Layout/Header';
import BottomNav from '../../share/components/BottomNav';
import './CreateOrder.css';

// Mock data chung (sẽ được chia sẻ với Orders.js)
const mockOrdersData = {
  customer: [
    {
      id: 1,
      date: '2025-04-01',
      action: 'Đặt dịch vụ sửa ống nước',
      status: 'Hoàn thành',
      technician: 'Nguyễn Văn A',
      completedDate: '2025-04-02',
      note: 'Hoàn thành sớm 1 ngày.',
    },
    {
      id: 2,
      date: '2025-03-28',
      action: 'Đặt dịch vụ sửa điện',
      status: 'Hoàn thành',
      technician: 'Trần Văn B',
      completedDate: '2025-03-29',
      note: 'Đã kiểm tra kỹ.',
    },
    {
      id: 3,
      date: '2025-03-25',
      action: 'Đặt dịch vụ lắp điều hòa',
      status: 'Đang xử lý',
      technician: 'Lê Văn C',
      note: 'Đang chờ linh kiện.',
    },
    {
      id: 4,
      date: '2025-03-20',
      action: 'Đặt dịch vụ sửa máy giặt',
      status: 'Chưa hoàn thành',
      technician: 'Phạm Văn D',
      note: 'Chưa liên hệ khách hàng.',
    },
  ],
  technician: [
    {
      id: 1,
      date: '2025-04-01',
      action: 'Sửa ống nước',
      status: 'Hoàn thành',
      customer: 'Nguyễn Thị X',
      completedDate: '2025-04-02',
      note: 'Hoàn thành sớm 1 ngày.',
    },
    {
      id: 2,
      date: '2025-03-28',
      action: 'Sửa điện',
      status: 'Hoàn thành',
      customer: 'Trần Thị Y',
      completedDate: '2025-03-29',
      note: 'Đã kiểm tra kỹ.',
    },
    {
      id: 3,
      date: '2025-03-25',
      action: 'Lắp điều hòa',
      status: 'Đang xử lý',
      customer: 'Lê Thị Z',
      note: 'Đang chờ linh kiện.',
    },
    {
      id: 4,
      date: '2025-03-20',
      action: 'Sửa máy giặt',
      status: 'Chưa hoàn thành',
      customer: 'Phạm Thị W',
      note: 'Chưa liên hệ khách hàng.',
    },
  ],
};

const CreateOrder = () => {
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = localStorage.getItem('token') && user && (user.role === 'customer' || user.role === 'technician');

  // State để quản lý form
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    fullName: '',
    category: '',
    price: 'Thỏa thuận',
    note: '',
  });

  // State để quản lý lỗi validation
  const [errors, setErrors] = useState({});

  // Nếu chưa đăng nhập, điều hướng về trang login
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  // Danh sách danh mục
  const categories = ['Điện nước', 'Điều hòa', 'Dọn vệ sinh', 'Sửa máy giặt', 'Khác'];

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
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.phone) newErrors.phone = 'Số điện thoại là bắt buộc';
    if (!formData.address) newErrors.address = 'Địa chỉ là bắt buộc';
    if (!formData.fullName) newErrors.fullName = 'Họ tên là bắt buộc';
    if (!formData.category) newErrors.category = 'Vui lòng chọn danh mục';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Tạo đơn hàng mới
    const newOrder = {
      id: mockOrdersData[user.role].length + 1,
      date: new Date().toISOString().split('T')[0], // Ngày hiện tại
      action: `Đặt dịch vụ ${formData.category.toLowerCase()}`,
      status: 'Chưa hoàn thành',
      [user.role === 'customer' ? 'technician' : 'customer']: user.role === 'customer' ? 'Chưa chỉ định' : user.fullName,
      note: formData.note || 'Không có ghi chú',
    };

    // Thêm đơn hàng mới vào mock data
    mockOrdersData[user.role].push(newOrder);

    // Điều hướng đến trang danh sách đơn hàng
    navigate('/list-orders');
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
            {/* Số điện thoại */}
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại <span className="required">*</span></label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
              />
              {errors.phone && <p className="error">{errors.phone}</p>}
            </div>

            {/* Địa chỉ */}
            <div className="form-group">
              <label htmlFor="address">Địa chỉ <span className="required">*</span></label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ"
              />
              {errors.address && <p className="error">{errors.address}</p>}
            </div>

            {/* Họ tên */}
            <div className="form-group">
              <label htmlFor="fullName">Họ tên <span className="required">*</span></label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Nhập họ tên"
              />
              {errors.fullName && <p className="error">{errors.fullName}</p>}
            </div>

            {/* Danh mục */}
            <div className="form-group">
              <label htmlFor="category">Danh mục <span className="required">*</span></label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <p className="error">{errors.category}</p>}
            </div>

            {/* Mức giá */}
            <div className="form-group">
              <label htmlFor="price">Mức giá</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Nhập mức giá hoặc để mặc định là 'Thỏa thuận'"
              />
            </div>

            {/* Ghi chú */}
            <div className="form-group">
              <label htmlFor="note">Ghi chú</label>
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Nhập ghi chú (nếu có)"
                rows="4"
              />
            </div>

            {/* Nút tạo đơn */}
            <button type="submit" className="create-order-button">
              Tạo đơn
            </button>
          </form>
        </div>

        <BottomNav />
      </div>
    </>
  );
};

export default CreateOrder;
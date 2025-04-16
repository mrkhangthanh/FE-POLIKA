import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../share/components/Layout/Header';
import BottomNav from '../../share/components/BottomNav';
import { createOrder, getCategoryService, getUserInfo, getCustomerOrders } from '../../services/Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socket from '../../utils/Socket';
import './CreateOrder.css';

const CreateOrder = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = localStorage.getItem('token') && user && (user.role === 'customer' || user.role === 'technician');

  // Khởi tạo formData với địa chỉ từ user trong localStorage (nếu có)
  const [formData, setFormData] = useState({
    service_type: '',
    description: '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    district: user?.address?.district || '',
    ward: user?.address?.ward || '',
    country: user?.address?.country || 'Vietnam',
    phone_number: user?.phone_number || '',
    price: '',
  });

  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { redirectTo: '/create-order' } });
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        console.log('User Info from API:', userInfo); // Log để kiểm tra dữ liệu trả về
        if (userInfo) {
          setFormData((prev) => ({
            ...prev,
            phone_number: userInfo.phone_number || prev.phone_number,
            street: userInfo.address?.street || prev.street,
            city: userInfo.address?.city || prev.city,
            district: userInfo.address?.district || prev.district,
            ward: userInfo.address?.ward || prev.ward,
            country: userInfo.address?.country || prev.country || 'Vietnam',
          }));
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
        toast.error('Không thể tải thông tin người dùng.');
      }
    };

    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await getCategoryService();
        const serviceTypes = response.data.service_types || [];

        const otherCategory = serviceTypes.find((category) => category.label === 'Khác...');
        const otherCategories = serviceTypes.filter((category) => category.label !== 'Khác...');
        const sortedCategories = [...otherCategories];
        if (otherCategory) {
          sortedCategories.push(otherCategory);
        }

        setCategories(sortedCategories);
        console.log('Service Types from API:', sortedCategories);
      } catch (err) {
        console.error('Error fetching service types:', err);
        toast.error('Không thể tải danh sách dịch vụ.');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    socket.on('order_update', (orders) => {
      console.log('Received order_update:', orders);
      toast.info('Danh sách đơn hàng đã được cập nhật!');
    });

    fetchUserInfo();
    fetchCategories();

    return () => {
      socket.off('order_update');
    };
  }, [isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const retryRequest = async (fn, orderData, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fn();
        return response;
      } catch (err) {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };
        const recentOrdersResponse = await getCustomerOrders(config);
        const recentOrders = recentOrdersResponse.data || [];

        const isDuplicate = recentOrders.some((order) => {
          return (
            order.service_type === orderData.service_type &&
            order.customer_id === user._id &&
            new Date(order.created_at) > new Date(Date.now() - 5 * 60 * 1000)
          );
        });

        if (isDuplicate) {
          console.log('Order already created, skipping retry.');
          toast.success('Đơn hàng đã được tạo trước đó.');
          setTimeout(() => {
            setIsLoading(false);
            navigate('/list-orders');
          }, 1000);
          return;
        }

        if (i === retries - 1) throw err;
        console.log(`Retrying request (${i + 1}/${retries})...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    setIsLoading(true);

    const newErrors = {};
    if (!formData.service_type) {
      newErrors.service_type = 'Vui lòng chọn loại dịch vụ để gọi thợ.';
    }
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

    const serviceTypeValue = formData.service_type;
    const serviceTypeMapping = {
      'dien-nuoc': 'DienNuoc',
      'don-ve-sinh': 'DonVeSinh',
      'sua-may-giat': 'SuaMayGiat',
      'dieu-hoa': 'DieuHoa',
      'chong-tham': 'ChongTham',
      'tho-xay-dung': 'ThoXayDung',
      'other': 'other',
    };
    const formattedServiceType = serviceTypeMapping[serviceTypeValue] || serviceTypeValue;

    const orderData = {
      service_type: formattedServiceType,
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

    console.log('Order Data Sent:', orderData);

    try {
      const response = await retryRequest(() => createOrder(orderData), orderData, 3, 1000);
      if (!response) return;

      console.log('Create Order Response:', response);

      if (response.user?.isFirstOrder) {
        toast.info('Địa chỉ của bạn đã được lưu để sử dụng cho các lần sau.');
      }

      toast.success('Đơn hàng đã được tạo thành công! Thông báo đã được gửi đến các thợ phù hợp.');
      setTimeout(() => {
        setIsLoading(false);
        navigate('/list-orders');
      }, 1000);
    } catch (err) {
      console.error('Error creating order:', err);
      console.log('Error Response Data:', err.response?.data);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.details ||
        'Tạo đơn hàng thất bại. Vui lòng thử lại.';
      setErrors({ general: errorMessage });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer autoClose={2000} />
      <div className="create-order-container">
        <div className="create-order-header">
          <h2>
            <i className="fa-solid fa-plus" style={{ marginRight: '10px' }} />
            Tạo Đơn Hàng
          </h2>
        </div>

        <div className="create-order-section">
          <form onSubmit={handleSubmit}>
            {errors.general && <p className="error">{errors.general}</p>}
            {message && <p className="success">{message}</p>}

            <div className="form-group">
              <label htmlFor="service_type">
                Loại dịch vụ cần gọi thợ <span className="required">*</span>
              </label>
              <select
                id="service_type"
                name="service_type"
                value={formData.service_type}
                onChange={handleInputChange}
                disabled={isLoading || isLoadingCategories}
              >
                <option value="">{isLoadingCategories ? 'Đang tải...' : 'Chọn loại dịch vụ'}</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.service_type && <p className="error">{errors.service_type}</p>}
            </div>

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

            <div className="form-group">
              <label htmlFor="phone_number">
                Số điện thoại <span className="required">*</span>
                <span className="default-note"> (Mặc định từ tài khoản của bạn)</span>
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
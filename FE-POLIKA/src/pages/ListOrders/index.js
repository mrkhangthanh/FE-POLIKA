import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../share/components/Layout/Header';
import BottomNav from '../../share/components/BottomNav';
import { getCustomerOrders } from '../../services/Api';
import './ListOrders.css';

// Hàm định dạng ngày theo dd/mm/yyyy hh:mm:ss
const formatDate = (dateString) => {
  if (!dateString) return 'Không xác định';

  let normalizedDateString = dateString;
  if (dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
    normalizedDateString = `${dateString}.000Z`;
  }

  const date = new Date(normalizedDateString);
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString);
    return 'Không xác định';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

// Hàm chuyển đổi trạng thái sang tiếng Việt
const getStatusLabel = (status) => {
  switch (status) {
    case 'completed':
      return 'Hoàn thành';
    case 'cancelled':
      return 'Đã hủy';
    case 'pending':
    case 'accepted':
    default:
      return 'Đang xử lý';
  }
};

// Hàm lấy class CSS cho trạng thái
const getStatusClass = (status) => {
  switch (status) {
    case 'completed':
      return 'status-completed';
    case 'cancelled':
      return 'status-cancelled';
    case 'pending':
    case 'accepted':
    default:
      return 'status-processing';
  }
};

const Orders = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = localStorage.getItem('token') && user && (user.role === 'customer' || user.role === 'technician');

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { redirectTo: '/list-orders' } });
    }
  }, [isLoggedIn, navigate]);

  const fetchOrders = async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getCustomerOrders({
        params: { page, limit: 10, sort: '-created_at' }, // Sửa sort thành created_at
      });
      const fetchedOrders = response.data.orders || [];
      // Log để kiểm tra dữ liệu
      console.log('Fetched orders:', fetchedOrders);
      setOrders(fetchedOrders);
      setPagination(response.data.pagination || {});
      setFilteredOrders(fetchedOrders);
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn, location.state?.refresh]);

  const filterOrdersByDate = () => {
    if (!startDate || !endDate) {
      setFilteredOrders(orders);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      alert('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!');
      return;
    }

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.created_at); // Sửa createdAt thành created_at
      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(filtered);
  };

  const openModal = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="orders-container">
        <div className="orders-header">
          <h2>
            <i className="fa-solid fa-file-invoice" style={{ marginRight: '10px' }} />
            Danh Sách Đơn Hàng
          </h2>
        </div>

        <div className="date-filter">
          <div className="date-input-group">
            <label htmlFor="start-date">Ngày bắt đầu:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="end-date">Ngày kết thúc:</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button className="search-button" onClick={filterOrdersByDate}>
            Tìm kiếm
          </button>
        </div>

        <div className="orders-section">
          {isLoading ? (
            <p>Đang tải...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : filteredOrders.length === 0 ? (
            <p className="no-orders">
              {startDate || endDate ? 'Không tìm thấy đơn hàng trong khoảng thời gian này.' : 'Bạn chưa có đơn hàng nào.'}
            </p>
          ) : (
            <ul className="orders-list">
              {filteredOrders.map((order) => (
                <li key={order._id} className="order-item" onClick={() => openModal(order)}>
                  <div className="order-details">
                    <p className="order-date">
                      <strong>Ngày:</strong> {formatDate(order.created_at)} {/* Sửa createdAt thành created_at */}
                    </p>
                    <p className="order-action">
                      <strong>Hành động:</strong> Đặt dịch vụ {order.service_type}
                    </p>
                    <p className="order-status">
                      <strong>Trạng thái:</strong>{' '}
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="pagination">
            <p>
              Trang: {pagination.currentPage} / {pagination.totalPages}
            </p>
            {pagination.prevPage && (
              <button onClick={() => fetchOrders(pagination.prevPage)}>Trang trước</button>
            )}
            {pagination.nextPage && (
              <button onClick={() => fetchOrders(pagination.nextPage)}>Trang sau</button>
            )}
          </div>
        )}

        {selectedOrder && (
          <div className="order-detail-modal">
            <div className="order-detail-modal-content">
              <div className="order-detail-modal-header">
                <h3>Chi tiết đơn hàng</h3>
                <button className="close-button" onClick={closeModal}>
                  <i className="fa-solid fa-times" />
                </button>
              </div>
              <div className="order-detail-modal-body">
                <p className="order-detail-item">
                  <strong>Ngày:</strong> {formatDate(selectedOrder.created_at)} {/* Sửa createdAt thành created_at */}
                </p>
                <p className="order-detail-item">
                  <strong>Hành động:</strong> Đặt dịch vụ {selectedOrder.service_type}
                </p>
                <p className="order-detail-item">
                  <strong>Trạng thái:</strong>{' '}
                  <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </p>
                <p className="order-detail-item">
                  <strong>{user.role === 'customer' ? 'Kỹ thuật viên:' : 'Khách hàng:'}</strong>{' '}
                  {user.role === 'customer'
                    ? selectedOrder.technician?.name || 'Chưa có kỹ thuật viên'
                    : selectedOrder.user?.name || 'Không xác định'}
                </p>
                {selectedOrder.updated_at && selectedOrder.status === 'completed' && ( /* Sửa updatedAt thành updated_at */
                  <p className="order-detail-item">
                    <strong>Ngày hoàn thành:</strong> {formatDate(selectedOrder.updated_at)} {/* Sửa updatedAt thành updated_at */}
                  </p>
                )}
                {selectedOrder.description && (
                  <p className="order-detail-item">
                    <strong>Mô tả:</strong> {selectedOrder.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </>
  );
};

export default Orders;
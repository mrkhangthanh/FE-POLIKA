import React, { useState, useEffect } from 'react';
import { getPublicOrders, getCategoryService } from '../../services/Api';
import socket from '../../utils/Socket';
import './listOrdersHome.css';

const ListOrdersHome = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [newOrderIds, setNewOrderIds] = useState(new Set());
  const [serviceTypes, setServiceTypes] = useState([]);
  const [fieldFilter, setFieldFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [totalRows, setTotalRows] = useState(0);

  const userId = localStorage.getItem('userId') || 'worker_123';

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await getCategoryService();
        if (response.data.success) {
          const fetchedServiceTypes = response.data.service_types || [];
          const sortedServiceTypes = fetchedServiceTypes.sort((a, b) => {
            if (a.label === 'Khác...') return 1;
            if (b.label === 'Khác...') return -1;
            return a.label.localeCompare(b.label);
          });
          setServiceTypes(sortedServiceTypes);
        }
      } catch (err) {
        console.error('Error fetching service types:', err);
      }
    };
    fetchServiceTypes();
  }, []);

  const fetchOrders = async (currentPage, append = false) => {
    try {
      setLoading(true);
      const config = {
        params: {
          page: currentPage,
          limit: limit,
          service_type: fieldFilter || undefined,
          'address.city': areaFilter || undefined,
        },
      };
      const response = await getPublicOrders(config);
      if (response.data.success) {
        const newOrders = response.data.orders || [];
        if (append) {
          setOrders((prevOrders) => [...prevOrders, ...newOrders]);
        } else {
          setOrders(newOrders);
        }
        const total = response.data.pagination?.totalRows || 0;
        setTotalRows(total);
        setHasMore(currentPage * limit < total);
      } else {
        setError('Không thể lấy dữ liệu đơn hàng.');
        setHasMore(false);
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra: ' + (err.message || 'Unknown error'));
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setOrders([]);
    fetchOrders(1, false);
  }, [fieldFilter, areaFilter]);

  useEffect(() => {
    socket.on('order_update', (updatedOrders) => {
      console.log('Received order_update:', updatedOrders);
      if (updatedOrders.length > 0) {
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        const newOrders = updatedOrders.filter((order) => {
          const createdAt = new Date(order.created_at);
          return createdAt >= fiveMinutesAgo;
        });
        const newOrderIdsSet = new Set(newOrders.map((order) => order._id));
        setNewOrderIds(newOrderIdsSet);
        setOrders(updatedOrders);
        setTotalRows(updatedOrders.length);
        setHasMore(page * limit < updatedOrders.length);
      }
    });

    socket.emit('join', userId);

    return () => {
      socket.off('order_update');
    };
  }, [page, limit]);

  useEffect(() => {
    if (selectedOrder) {
      socket.emit('joinChatRoom', { orderId: selectedOrder._id, userId });
      socket.on('newMessage', (message) => {
        setChatMessages((prevMessages) => [...prevMessages, message]);
      });
      setChatMessages([]);
    }

    return () => {
      if (selectedOrder) {
        socket.emit('leaveChatRoom', { orderId: selectedOrder._id, userId });
      }
      socket.off('newMessage');
    };
  }, [selectedOrder]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedOrder) {
      const message = {
        orderId: selectedOrder._id,
        userId,
        message: newMessage,
        timestamp: new Date().toISOString(),
      };
      socket.emit('sendMessage', message);
      setNewMessage('');
    }
  };

  const handleViewDetails = (order) => {
    const isAuthenticated = !!localStorage.getItem('token');
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchOrders(nextPage, true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.district}, ${address.city}`;
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber || phoneNumber.length < 10) return 'N/A';
    const firstThree = phoneNumber.slice(0, 3);
    const lastThree = phoneNumber.slice(-3);
    return `${firstThree}****${lastThree}`;
  };

  const truncateName = (name) => {
    if (!name) return 'N/A';
    if (name.length <= 10) return name;
    return name.slice(0, 10) + '...';
  };

  const areas = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'N/A'];

  const handleFieldFilterChange = (e) => {
    const selectedLabel = e.target.value;
    setFieldFilter(selectedLabel || '');
  };

  return (
    <div className="list-orders-home">
      <h2>Danh sách tất cả đơn hàng</h2>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="fieldFilter">Lĩnh vực:</label>
          <select
            id="fieldFilter"
            value={fieldFilter}
            onChange={handleFieldFilterChange}
          >
            <option value="">Tất cả</option>
            {serviceTypes.map((service) => (
              <option key={service._id} value={service.label}>
                {service.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="areaFilter">Khu vực:</label>
          <select
            id="areaFilter"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          >
            <option value="">Tất cả</option>
            {areas.map((area, index) => (
              <option key={index} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="loading-spinner"></div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : orders.length === 0 ? (
        <p>Chưa có dữ liệu đơn hàng.</p>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Người đăng</th>
                <th>Giá</th>
                <th>Lĩnh vực</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className={newOrderIds.has(order._id) ? 'new-order' : ''}
                >
                  <td>
                    <div className="user-info">
                      <span className="user-name" title={order.customer_id?.name || 'N/A'}>
                        {truncateName(order.customer_id?.name)}
                      </span>
                      <span className="user-date">
                        {order.created_at ? formatDate(order.created_at) : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="price-info">
                      <span className="price">
                        {order.total_amount
                          ? order.total_amount.toLocaleString('vi-VN') + ' VNĐ'
                          : 'N/A'}
                      </span>
                      <span
                        className={`status status-${order.status?.toLowerCase() || 'unknown'}`}
                      >
                        {order.status || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td>{order.service_type?.label || 'N/A'}</td>
                  <td>
                    <button
                      className="details-btn"
                      onClick={() => handleViewDetails(order)}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Nút "Xem thêm" */}
          {hasMore && (
            <div className="load-more-wrapper">
              <button
                className="load-more-btn"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? 'Đang tải...' : (
                  <>
                    Xem thêm
                    <span className="load-more-icon"> ↓ ↓ ↓</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {isModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Chi tiết đơn hàng</h3>
            <div className="modal-body">
              <p>
                <strong>Người đăng:</strong> {selectedOrder.customer_id?.name || 'N/A'}
              </p>
              <p>
                <strong>Lĩnh vực:</strong> {selectedOrder.service_type?.label || 'N/A'}
              </p>
              <p>
                <strong>Mô tả:</strong> {selectedOrder.description || 'N/A'}
              </p>
              <p>
                <strong>Địa chỉ:</strong>{' '}
                {selectedOrder.address ? formatAddress(selectedOrder.address) : 'N/A'}
              </p>
              <p>
                <strong>Số điện thoại:</strong>{' '}
                {selectedOrder.phone_number
                  ? formatPhoneNumber(selectedOrder.phone_number)
                  : 'N/A'}
              </p>
              <p>
                <strong>Giá:</strong>{' '}
                {selectedOrder.total_amount
                  ? selectedOrder.total_amount.toLocaleString('vi-VN') + ' VNĐ'
                  : 'N/A'}
              </p>
              <p>
                <strong>Trạng thái:</strong> {selectedOrder.status || 'N/A'}
              </p>
              <p>
                <strong>Thời gian:</strong>{' '}
                {selectedOrder.created_at ? formatDate(selectedOrder.created_at) : 'N/A'}
              </p>
              {selectedOrder.technician_id && (
                <p>
                  <strong>Thợ:</strong> {selectedOrder.technician_id?.name || 'N/A'}
                </p>
              )}

              <div className="chat-section">
                <h4>Chat với khách hàng</h4>
                <div className="chat-messages">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`chat-message ${
                        msg.userId === userId ? 'sent' : 'received'
                      }`}
                    >
                      <span className="chat-user">
                        {msg.userId === userId ? 'Bạn' : 'Khách hàng'}:
                      </span>
                      <span className="chat-text">{msg.message}</span>
                      <span className="chat-time">{formatDate(msg.timestamp)}</span>
                    </div>
                  ))}
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                  />
                  <button onClick={handleSendMessage}>Gửi</button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="close-btn" onClick={handleCloseModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOrdersHome;
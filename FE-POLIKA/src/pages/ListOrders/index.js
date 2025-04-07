import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../share/components/Layout/Header';

import BottomNav from '../../share/components/BottomNav';
import './ListOrders.css';

// Mock data chung (được chia sẻ với CreateOrder.js)
export const mockOrdersData = {
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

const Orders = () => {
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = localStorage.getItem('token') && user && (user.role === 'customer' || user.role === 'technician');

  // State để quản lý modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  // State để quản lý ngày bắt đầu, ngày kết thúc và danh sách đơn hàng đã lọc
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Lấy danh sách đơn hàng dựa trên vai trò người dùng
  const orders = user.role === 'customer' ? mockOrdersData.customer : mockOrdersData.technician;

  // Hàm lọc đơn hàng theo khoảng ngày
  const filterOrdersByDate = () => {
    if (!startDate || !endDate) {
      setFilteredOrders(orders);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Kiểm tra nếu ngày kết thúc nhỏ hơn ngày bắt đầu
    if (end < start) {
      alert('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!');
      return;
    }

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(filtered);
  };

  // Khởi tạo danh sách đơn hàng ban đầu
  useEffect(() => {
    setFilteredOrders(orders);
  }, [user.role]);

  // Hàm mở modal
  const openModal = (order) => {
    setSelectedOrder(order);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setSelectedOrder(null);
  };

  // Kiểm tra đăng nhập
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  return (
    <>
      <Header />
      <div className="orders-container">
        {/* Tiêu đề */}
        <div className="orders-header">
          <h2>
            <i className="fa-solid fa-file-invoice" style={{ marginRight: '10px' }} />
            Danh Sách Đơn Hàng
          </h2>
        </div>

        {/* Mục chọn ngày */}
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

        {/* Danh sách đơn hàng */}
        <div className="orders-section">
          {filteredOrders.length === 0 ? (
            <p className="no-orders">
              {startDate || endDate ? 'Không tìm thấy đơn hàng trong khoảng thời gian này.' : 'Bạn chưa có đơn hàng nào.'}
            </p>
          ) : (
            <ul className="orders-list">
              {filteredOrders.map((order) => (
                <li key={order.id} className="order-item" onClick={() => openModal(order)}>
                  <div className="order-details">
                    <p className="order-date">
                      <strong>Ngày:</strong> {order.date}
                    </p>
                    <p className="order-action">
                      <strong>Hành động:</strong> {order.action}
                    </p>
                    <p className="order-status">
                      <strong>Trạng thái:</strong>{' '}
                      <span
                        className={`status-badge ${
                          order.status === 'Hoàn thành'
                            ? 'status-completed'
                            : order.status === 'Đang xử lý'
                            ? 'status-processing'
                            : 'status-pending'
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Modal chi tiết đơn hàng */}
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
                  <strong>Ngày:</strong> {selectedOrder.date}
                </p>
                <p className="order-detail-item">
                  <strong>Hành động:</strong> {selectedOrder.action}
                </p>
                <p className="order-detail-item">
                  <strong>Trạng thái:</strong>{' '}
                  <span
                    className={`status-badge ${
                      selectedOrder.status === 'Hoàn thành'
                        ? 'status-completed'
                        : selectedOrder.status === 'Đang xử lý'
                        ? 'status-processing'
                        : 'status-pending'
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </p>
                <p className="order-detail-item">
                  <strong>{user.role === 'customer' ? 'Kỹ thuật viên:' : 'Khách hàng:'}</strong>{' '}
                  {user.role === 'customer' ? selectedOrder.technician : selectedOrder.customer}
                </p>
                {selectedOrder.completedDate && (
                  <p className="order-detail-item">
                    <strong>Ngày hoàn thành:</strong> {selectedOrder.completedDate}
                  </p>
                )}
                {selectedOrder.note && (
                  <p className="order-detail-item">
                    <strong>Ghi chú:</strong> {selectedOrder.note}
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
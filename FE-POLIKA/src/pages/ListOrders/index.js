import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../share/components/Layout/Header';
import Footer from '../../share/components/Layout/Footer';
import BottomNav from '../../share/components/BottomNav';
import './ListOrders.css';

const Orders = () => {
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = localStorage.getItem('token') && user && (user.role === 'customer' || user.role === 'technician');

  // Nếu chưa đăng nhập, điều hướng về trang login
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  // Dữ liệu giả (mock data) cho danh sách đơn hàng
  const mockOrders = {
    customer: [
      {
        id: 1,
        date: '2025-04-01',
        action: 'Đặt dịch vụ sửa ống nước',
        status: 'Hoàn thành',
      },
      {
        id: 2,
        date: '2025-03-28',
        action: 'Đặt dịch vụ sửa điện',
        status: 'Hoàn thành',
      },
      {
        id: 3,
        date: '2025-03-25',
        action: 'Đặt dịch vụ lắp điều hòa',
        status: 'Đang xử lý',
      },
      {
        id: 4,
        date: '2025-03-20',
        action: 'Đặt dịch vụ sửa máy giặt',
        status: 'Chưa hoàn thành',
      },
    ],
    technician: [
      {
        id: 1,
        date: '2025-04-01',
        action: 'Sửa ống nước',
        status: 'Hoàn thành',
      },
      {
        id: 2,
        date: '2025-03-28',
        action: 'Sửa điện',
        status: 'Hoàn thành',
      },
      {
        id: 3,
        date: '2025-03-25',
        action: 'Lắp điều hòa',
        status: 'Đang xử lý',
      },
      {
        id: 4,
        date: '2025-03-20',
        action: 'Sửa máy giặt',
        status: 'Chưa hoàn thành',
      },
    ],
  };

  // Lấy danh sách đơn hàng dựa trên vai trò người dùng
  const orders = user.role === 'customer' ? mockOrders.customer : mockOrders.technician;

  return (
    <>
      <Header />
      <div className="orders-container">
        {/* Tiêu đề (ẩn trên mobile) */}
        <div className="orders-header desktop-only">
          <h2>
            <i className="fa-solid fa-file-invoice" style={{ marginRight: '10px' }} />
            Đơn hàng
          </h2>
        </div>

        {/* Danh sách đơn hàng */}
        <div className="orders-section">
          {orders.length === 0 ? (
            <p className="no-orders">Bạn chưa có đơn hàng nào.</p>
          ) : (
            <ul className="orders-list">
              {orders.map((order) => (
                <li key={order.id} className="order-item">
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

        <BottomNav />
      </div>
      <Footer />
    </>
  );
};

export default Orders;
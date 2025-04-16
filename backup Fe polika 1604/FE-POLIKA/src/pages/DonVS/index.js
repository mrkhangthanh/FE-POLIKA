import React, { useState, useEffect, useRef } from 'react';


const DonVs = () => {
  // 1. Khai báo state để quản lý dữ liệu và trạng thái
  const [activeTab, setActiveTab] = useState('Khách Hàng'); // Quản lý tab đang active
  const [orders, setOrders] = useState([]); // Quản lý danh sách đơn hàng (nếu lấy từ API)
  const [selectedOrder, setSelectedOrder] = useState(null); // Quản lý đơn hàng được chọn để xem chi tiết
  const currencyContainerRef = useRef(null); // Tham chiếu đến container để scroll

  // 2. useEffect để gọi API hoặc xử lý logic khi component mount/update
  useEffect(() => {
    // Gọi API từ backend Node.js để lấy danh sách đơn hàng (ví dụ)
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/orders'); // URL API từ backend
        const data = await response.json();
        setOrders(data); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      }
    };

    fetchOrders();
  }, []); // Chạy một lần khi component mount

  // 3. Xử lý sự kiện cho các nút
  const handleTabClick = (tab) => {
    setActiveTab(tab); // Chuyển đổi tab
    // Có thể thêm logic để lọc dữ liệu dựa trên tab (Khách Hàng/Thợ Nhận Đơn)
  };

  const scrollLeft = () => {
    if (currencyContainerRef.current) {
      currencyContainerRef.current.scrollLeft -= 200; // Cuộn sang trái 200px
    }
  };

  const scrollRight = () => {
    if (currencyContainerRef.current) {
      currencyContainerRef.current.scrollLeft += 200; // Cuộn sang phải 200px
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order); // Hiển thị modal với thông tin đơn hàng được chọn
  };

  const handleCloseModal = () => {
    setSelectedOrder(null); // Đóng modal
  };

  const handleAcceptOrder = () => {
    // Xử lý khi nhấn "Chấp Nhận" (ví dụ: gửi API, cập nhật trạng thái đơn hàng)
    console.log('Chấp nhận đơn hàng:', selectedOrder);
    alert('Đơn hàng đã được chấp nhận!');
    setSelectedOrder(null); // Đóng modal sau khi chấp nhận
  };

  return (
    <>
      <div className="container" id="create-oder">
        <div className="list-oder">
          <div className="top-bar">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'Khách Hàng' ? 'active' : ''}`}
                onClick={() => handleTabClick('Khách Hàng')}
              >
                Khách Hàng
              </button>
              <button
                className={`tab ${activeTab === 'Thợ Nhận Đơn' ? 'active' : ''}`}
                onClick={() => handleTabClick('Thợ Nhận Đơn')}
              >
                Thợ Nhận Đơn
              </button>
            </div>
            <div className="currency-container" ref={currencyContainerRef}>
              {/* Nội dung cuộn (nếu có) */}
              <button className="scroll-btn left" onClick={scrollLeft}>
                ❮
              </button>
              <button className="scroll-btn right" onClick={scrollRight}>
                ❯
              </button>
            </div>
          </div>
          <table className="marketplace-table">
            <h1>Danh Sách Đơn Hàng Dọn Vệ Sinh (Đây là test)</h1>
            <thead>
              <tr>
                <th>Người Đăng Tin</th>
                <th>Giá</th>
                <th>Khả dụng/Giới hạn lệnh</th>
                <th>Thanh toán</th>
                <th>Giao dịch</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={index} className="listing featured">
                    <td className="info">
                      <div className="user-info">
                        <div>
                          <h3>
                            <img
                              src={order.avatar || './images/vc1.png'}
                              alt="Avatar"
                              className="user-avatar"
                            />
                            {order.userName || 'VipTrader'}
                          </h3>
                          <span className="rating">⭐⭐⭐⭐⭐</span>
                          <p>
                            {order.ordersCount || '14372'} lệnh |{' '}
                            {order.completionRate || '99.30%'} hoàn tất
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="price">{order.price || '26,327 VND'}</td>
                    <td className="availability">
                      {order.availability || '22,621.90 USDT'}
                    </td>
                    <td className="payment">
                      {order.payment || 'Chuyển khoản ngân hàng'}
                    </td>
                    <td className="action">
                      <button
                        className="view-btn"
                        onClick={() => handleViewOrder(order)}
                      >
                        Xem Đơn
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Không có đơn hàng nào để hiển thị.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal hiển thị chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="order-detail">
              <div className="order-header">
                <img
                  src={selectedOrder.avatar || './images/vc1.png'}
                  alt="Avatar"
                  className="order-avatar"
                />
                <h2>{selectedOrder.userName || selectedOrder.title || 'Tài khoản dọn vệ sinh'}</h2>
                <span className="order-rating">
                  {selectedOrder.completionRate || '99.30%'}
                </span>
              </div>
              <div className="order-info">
                <p>
                  <strong>Giá:</strong> {selectedOrder.price || '26,327 VND'}
                </p>
                <p>
                  <strong>Khả dụng/Giới hạn lệnh:</strong>{' '}
                  {selectedOrder.availability || '22,621.90 USDT'}
                </p>
                <p>
                  <strong>Phương thức thanh toán:</strong>{' '}
                  {selectedOrder.payment || 'Chuyển khoản ngân hàng'}
                </p>
              </div>
              <div className="order-actions">
                <button className="cancel-btn" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button className="accept-btn" onClick={handleAcceptOrder}>
                  Xem Đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DonVs;
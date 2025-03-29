import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';


const HeaderListOrder = () => {
  const [activeCurrency, setActiveCurrency] = useState(null);
  const [activeTab, setActiveTab] = useState('customer');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const currencyWrapperRef = useRef(null);

  const changeColor = (index) => {
    setActiveCurrency(index);
  };

  const currencies = [
    'Dọn Vệ Sinh',
    'Nội Thất',
    'Điện Nước',
    'Xây Dựng',
    'Chống Thấm',
    'Mạng-Internet',
    'Điều Hoà',
    'Giúp Việc',
    'Spa-Tại-Nhà',
    'Hút-Bể-Phốt',
    'Việc-Vặt',
    'Tổng-Hợp',
  ];

  const orders = [
    {
      id: 0,
      currency: 'Dọn Vệ Sinh',
      user: 'Tài khoản dọn vệ sinh',
      price: '26,327 VND',
      availability: '22,621.90 USDT',
      payment: 'Chuyển khoản ngân hàng',
      description: 'Đơn hàng đã hoàn thành trong vòng 24h',
      conditions: [
        'Chào buổi chiều! Đây là tài khoản dọn vệ sinh. Tất cả vui lòng hỗ trợ.',
        'Vui lòng xem xét các điều kiện để duy trì chất lượng giao dịch.',
        'Trong giao dịch chuyển khoản, hãy đặt phí giao dịch trước.',
        'Đối với các giao dịch lớn hơn, quý khách vui lòng đăng ký.',
        'Thông tin giao dịch, vui lòng liên hệ ngay để hoàn thành.',
      ],
    },
    {
      id: 1,
      currency: 'Nội Thất',
      user: 'TK Nội Thất',
      price: '30,000 VND',
      availability: '20,000.00 USDT',
      payment: 'Chuyển khoản ngân hàng',
      description: 'Đơn hàng đã hoàn thành trong vòng 24h',
      conditions: [
        'Chào buổi chiều! Đây là tài khoản nội thất. Tất cả vui lòng hỗ trợ.',
        'Vui lòng xem xét các điều kiện để duy trì chất lượng giao dịch.',
        'Trong giao dịch chuyển khoản, hãy đặt phí giao dịch trước.',
        'Đối với các giao dịch lớn hơn, quý khách vui lòng đăng ký.',
        'Thông tin giao dịch, vui lòng liên hệ ngay để hoàn thành.',
      ],
    },
    {
      id: 2,
      currency: 'Điện Nước',
      user: 'TK Điện nước',
      price: '28,000 VND',
      availability: '18,000.00 USDT',
      payment: 'Chuyển khoản ngân hàng',
      description: 'Đơn hàng đã hoàn thành trong vòng 24h',
      conditions: [
        'Chào buổi chiều! Đây là tài khoản điện nước. Tất cả vui lòng hỗ trợ.',
        'Vui lòng xem xét các điều kiện để duy trì chất lượng giao dịch.',
        'Trong giao dịch chuyển khoản, hãy đặt phí giao dịch trước.',
        'Đối với các giao dịch lớn hơn, quý khách vui lòng đăng ký.',
        'Thông tin giao dịch, vui lòng liên hệ ngay để hoàn thành.',
      ],
    },
  ];

  const filteredOrders = activeCurrency !== null
    ? orders.filter((order) => order.currency === currencies[activeCurrency])
    : orders;

  const scrollLeft = () => {
    if (currencyWrapperRef.current) {
      currencyWrapperRef.current.scrollBy({
        left: -100,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (currencyWrapperRef.current) {
      currencyWrapperRef.current.scrollBy({
        left: 100,
        behavior: 'smooth',
      });
    }
  };

  const showAllOrders = () => {
    setActiveCurrency(null);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="container" id="create-order">
      <div className="list-order">
        <div className="top-bar">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'customer' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('customer');
                setActiveCurrency(null);
              }}
            >
              Khách Hàng
            </button>
            <button
              className={`tab ${activeTab === 'worker' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('worker');
                setActiveCurrency(null);
              }}
            >
              Thợ Nhận Đơn
            </button>
            <button
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={showAllOrders}
            >
              Tất cả Đơn hàng
            </button>
          </div>
          <div className="currency-container">
            <button className="scroll-btn left" onClick={scrollLeft}>
              ❮
            </button>
            <div className="currency-wrapper" ref={currencyWrapperRef}>
              {currencies.map((currency, index) => (
                <span
                  key={index}
                  className={`currency ${activeCurrency === index ? 'active' : ''}`}
                  onClick={() => changeColor(index)}
                  style={{
                    backgroundColor: activeCurrency === index ? 'red' : 'transparent',
                    color: activeCurrency === index ? 'white' : 'black',
                  }}
                >
                  <Link
                    to={`/Don-Hang/${currency.replace(/\s+/g, '-').toLowerCase()}`}
                    style={{ color: 'inherit' }}
                  >
                    {currency}
                  </Link>
                </span>
              ))}
            </div>
            <button className="scroll-btn right" onClick={scrollRight}>
              ❯
            </button>
          </div>
        </div>
        <table className="marketplace-table">
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
            {filteredOrders.map((order) => (
              <tr key={order.id} className="listing featured">
                <td className="info">
                  <div className="user-info">
                    <div>
                      <h3>
                        <img
                          src={`${process.env.PUBLIC_URL}/images/vc1.png`}
                          alt="Avatar"
                          className="user-avatar"
                        />
                        {order.user}
                      </h3>
                      <p>14372 lệnh | 99.30% hoàn tất</p>
                    </div>
                  </div>
                </td>
                <td className="price">{order.price}</td>
                <td className="availability">{order.availability}</td>
                <td className="payment">{order.payment}</td>
                <td className="action">
                  <button
                    className="view-btn"
                    onClick={() => handleViewOrder(order)}
                  >
                    Xem Đơn
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={handleCloseModal} />
      )}
    </div>
  );
};

// Component Modal
const OrderDetailModal = ({ order, onClose }) => {
  const [sellAmount, setSellAmount] = useState('5,000,000 - 9,766,229 VND');
  const [receiveAmount, setReceiveAmount] = useState('0.00 USDT');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="order-header">
          <h3>{order.user}</h3>
          <p>{'14372 lệnh | 99.30% hoàn tất'}</p>
        </div>
        <div className="order-info">
          <div className="price-info">
            <p>Giá: {order.price}</p>
            <p>{order.availability}</p>
          </div>
          <div className="conditions">
            <p>✔ {order.description}</p>
            {order.conditions.map((condition, index) => (
              <p key={index}>✔ {condition}</p>
            ))}
          </div>
          <div className="payment-form">
            <div className="form-group">
              <label>Bán thanh toán</label>
              <input
                type="text"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Bán nhận được</label>
              <input
                type="text"
                value={receiveAmount}
                onChange={(e) => setReceiveAmount(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="order-actions">
          <button className="cancel-btn" onClick={onClose}>
            Hủy
          </button>
          <button className="accept-btn">Mua USD</button>
        </div>
      </div>
    </div>
  );
};

export default HeaderListOrder;
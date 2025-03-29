import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetailModal = ({ order, onClose }) => {
  const [sellAmount, setSellAmount] = useState('5,000,000 - 9,766,229 VND');
  const [receiveAmount, setReceiveAmount] = useState('0.00 USDT');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="order-header">
          <h3>{order.name}</h3>
          <p>{order.ordersCount} lệnh | {order.completionRate} hoàn tất</p>
        </div>
        <div className="order-info">
          <div className="price-info">
            <p>Giá: {order.price}</p>
            <p>{order.availability}</p>
          </div>
          <div className="conditions">
            <p>✔ {order.description}</p>
            <p>✔ {order.conditions[0]}</p>
            <p>✔ {order.conditions[1]}</p>
            <p>✔ {order.conditions[2]}</p>
            <p>✔ {order.conditions[3]}</p>
            <p>✔ {order.conditions[4]}</p>
          </div>
          <div className="payment-form">
            <div className="form-group">
              <label>Bán thanh toán</label>
              <input type="text" value={sellAmount} onChange={(e) => setSellAmount(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Bán nhận được</label>
              <input type="text" value={receiveAmount} onChange={(e) => setReceiveAmount(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="order-actions">
          <button className="cancel-btn" onClick={onClose}>Hủy</button>
          <button className="accept-btn">Mua USD</button>
        </div>
      </div>
    </div>
  );
};

const ListOrder = () => {
  const { id } = useParams();
  const currencyContainerRef = useRef(null);

  const [orders, setOrders] = useState([
    {
      id: 0,
      name: 'Tài khoản dọn vệ sinh',
      avatar: `/images/vc1.png`,
      ordersCount: 14372,
      completionRate: '99.30%',
      price: '26,327 VND',
      availability: '22,621.90 USDT',
      payment: 'Chuyển khoản ngân hàng',
      description: 'Đơn hàng đã hoàn thành trong vòng 24h',
      conditions: [
        'Chào buổi chiều! Đây La Cript29-FEE. Tất cả vui có có hỗ trợ tác với bạn',
        'Vui lòng xem xét các điều kiện để duy trì chất lượng giao dịch.',
        'Trong giao dịch chuyển khoản, hãy đặt phí giao dịch trước nếu số đơn hàng',
        'Đối với các giao dịch lớn hơn quý khách vui lòng đăng ký.',
        'Anh từ sức vọng với mọi kỳ có giá 6 chất sự của sự độ làm hàng',
        'Chi chạp hàng. Thông tin giao dịch chuyển khoản, vui lòng tác cả khoản ngay để hoàn thành Binace.'
      ],
    },
    {
      id: 1,
      name: 'TK Nội Thất',
      avatar: `/images/vc1.png`,
      ordersCount: 14372,
      completionRate: '99.30%',
      price: '30,000 VND',
      availability: '20,000.00 USDT',
      payment: 'Chuyển khoản ngân hàng',
      description: 'Đơn hàng đã hoàn thành trong vòng 24h',
      conditions: [
        'Chào buổi chiều! Đây La Cript29-FEE. Tất cả vui có có hỗ trợ tác với bạn',
        'Vui lòng xem xét các điều kiện để duy trì chất lượng giao dịch.',
        'Trong giao dịch chuyển khoản, hãy đặt phí giao dịch trước nếu số đơn hàng',
        'Đối với các giao dịch lớn hơn quý khách vui lòng đăng ký.',
        'Anh từ sức vọng với mọi kỳ có giá 6 chất sự của sự độ làm hàng',
        'Chi chạp hàng. Thông tin giao dịch chuyển khoản, vui lòng tác cả khoản ngay để hoàn thành Binace.'
      ],
    },
    {
      id: 2,
      name: 'TK Điện nước',
      avatar: `/images/vc1.png`,
      ordersCount: 14372,
      completionRate: '99.30%',
      price: '28,000 VND',
      availability: '18,000.00 USDT',
      payment: 'Chuyển khoản ngân hàng',
      description: 'Đơn hàng đã hoàn thành trong vòng 24h',
      conditions: [
        'Chào buổi chiều! Đây La Cript29-FEE. Tất cả vui có có hỗ trợ tác với bạn',
        'Vui lòng xem xét các điều kiện để duy trì chất lượng giao dịch.',
        'Trong giao dịch chuyển khoản, hãy đặt phí giao dịch trước nếu số đơn hàng',
        'Đối với các giao dịch lớn hơn quý khách vui lòng đăng ký.',
        'Anh từ sức vọng với mọi kỳ có giá 6 chất sự của sự độ làm hàng',
        'Chi chạp hàng. Thông tin giao dịch chuyển khoản, vui lòng tác cả khoản ngay để hoàn thành Binace.'
      ],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const selectedOrderData = orders.find((order) => order.id === parseInt(id)) || orders[0];

  const scrollLeft = () => {
    if (currencyContainerRef.current) {
      currencyContainerRef.current.scrollLeft -= 200;
    }
  };

  const scrollRight = () => {
    if (currencyContainerRef.current) {
      currencyContainerRef.current.scrollLeft += 200;
    }
  };

  return (
    <div className="container" id="create-oder">
      <div className="list-oder">
        <div className="top-bar">
          <div className="tabs">
            <button className="tab active">Khách Hàng</button>
            <button className="tab">Thợ Nhận Đơn</button>
          </div>
          <div className="currency-container" ref={currencyContainerRef}>
            <button className="scroll-btn left" onClick={scrollLeft}>
              ❮
            </button>
            <button className="scroll-btn right" onClick={scrollRight}>
              ❯
            </button>
          </div>
        </div>
        <table className="marketplace-table">
          <h1>Danh Sách Đơn Hàng {selectedOrderData.name} (Đây là test)</h1>
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
            {orders.map((order, index) => (
              <tr key={index} className="listing featured">
                <td className="info">
                  <div className="user-info">
                    <div>
                      <h3>
                        <img
                          src={order.avatar}
                          alt="Avatar"
                          className="user-avatar"
                        />
                        {order.name}
                      </h3>
                      <span className="rating">⭐⭐⭐⭐⭐</span>
                      <p>
                        {order.ordersCount} lệnh | {order.completionRate} hoàn tất
                      </p>
                    </div>
                  </div>
                </td>
                <td className="price">{order.price}</td>
                <td className="availability">{order.availability}</td>
                <td className="payment">{order.payment}</td>
                <td className="action">
                  <button className="view-btn" onClick={() => handleViewOrder(order)}>
                    Xem Đơn
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={handleCloseModal} />}
    </div>
  );
};

export default ListOrder;
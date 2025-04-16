import React, { useState, useEffect } from 'react';
import './Cart.css'; // Import file CSS

function ShoppingCart() {
  // Danh sách các tỉnh thành
  const provinces = [
    { value: "1", latitude: "21.027764", longitude: "105.83416", text: "Hà Nội" },
    { value: "79", latitude: "10.823099", longitude: "106.629664", text: "Hồ Chí Minh" },
    { value: "48", latitude: "16.05194", longitude: "108.21528", text: "Đà Nẵng" },
    { value: "74", latitude: "10.99333", longitude: "106.65611", text: "Bình Dương" },
    { value: "31", latitude: "20.86194", longitude: "106.68028", text: "Hải Phòng" },
    { value: "56", latitude: "12.23889", longitude: "109.19694", text: "Khánh Hòa" },
    { value: "8", latitude: "21.81861", longitude: "105.21167", text: "Tuyên Quang" },
    { value: "11", latitude: "21.36667", longitude: "103.00861", text: "Điện Biên" },
    { value: "12", latitude: "22.3860763", longitude: "103.4693761", text: "Lai Châu" },
    { value: "14", latitude: "21.3320071", longitude: "103.9089422", text: "Sơn La" },
    { value: "2", latitude: "22.7662056", longitude: "104.9388853", text: "Hà Giang" },
    { value: "15", latitude: "21.71667", longitude: "104.89861", text: "Yên Bái" },
    { value: "17", latitude: "20.816688", longitude: "105.3425842", text: "Hòa Bình" },
    { value: "19", latitude: "21.5675", longitude: "105.82556", text: "Thái Nguyên" },
    { value: "20", latitude: "21.85417", longitude: "106.76167", text: "Lạng Sơn" },
    { value: "22", latitude: "20.97194", longitude: "107.04528", text: "Quảng Ninh" },
    { value: "24", latitude: "21.29139", longitude: "106.18694", text: "Bắc Giang" },
    { value: "25", latitude: "21.3127148", longitude: "105.3972141", text: "Phú Thọ" },
    { value: "26", latitude: "21.29889", longitude: "105.60611", text: "Vĩnh Phúc" },
    { value: "27", latitude: "21.18528", longitude: "106.05639", text: "Bắc Ninh" },
    { value: "30", latitude: "20.93972", longitude: "106.3125", text: "Hải Dương" },
    { value: "33", latitude: "20.63667", longitude: "106.05694", text: "Hưng Yên" },
    { value: "34", latitude: "20.4475", longitude: "106.3375", text: "Thái Bình" },
    { value: "35", latitude: "20.5430094", longitude: "105.9123685", text: "Hà Nam" },
    { value: "36", latitude: "20.42", longitude: "106.16833", text: "Nam Định" },
    { value: "37", latitude: "20.25111", longitude: "105.975", text: "Ninh Bình" },
    { value: "38", latitude: "19.8075", longitude: "105.77639", text: "Thanh Hóa" },
    { value: "40", latitude: "18.68083", longitude: "105.68167", text: "Nghệ An" },
    { value: "42", latitude: "18.3397563", longitude: "105.895225", text: "Hà Tĩnh" },
    { value: "44", latitude: "17.46861", longitude: "106.59944", text: "Quảng Bình" },
    { value: "45", latitude: "16.74694", longitude: "107.19389", text: "Quảng Trị" },
    { value: "46", latitude: "16.467397", longitude: "107.5905326", text: "Thừa Thiên Huế" },
    { value: "4", latitude: "22.66694", longitude: "106.26028", text: "Cao Bằng" },
    { value: "49", latitude: "15.5393538", longitude: "108.019102", text: "Quảng Nam" },
    { value: "51", latitude: "15.12389", longitude: "108.81167", text: "Quảng Ngãi" },
    { value: "52", latitude: "13.775", longitude: "109.23333", text: "Bình Định" },
    { value: "54", latitude: "13.08222", longitude: "109.31611", text: "Phú Yên" },
    { value: "10", latitude: "22.44028", longitude: "104.00278", text: "Lào Cai" },
    { value: "58", latitude: "11.56667", longitude: "108.99167", text: "Ninh Thuận" },
    { value: "60", latitude: "10.92222", longitude: "108.10944", text: "Bình Thuận" },
    { value: "62", latitude: "14.35", longitude: "107.99861", text: "Kon Tum" },
    { value: "64", latitude: "13.98361", longitude: "1080", text: "Gia Lai" },
    { value: "66", latitude: "12.66667", longitude: "108.03889", text: "Đắk Lắk" },
    { value: "67", latitude: "12.0073426", longitude: "107.683687", text: "Đắk Nông" },
    { value: "68", latitude: "11.5752791", longitude: "108.1428669", text: "Lâm Đồng" },
    { value: "70", latitude: "11.5378854", longitude: "106.9006317", text: "Bình Phước" },
    { value: "72", latitude: "11.36778", longitude: "106.11917", text: "Tây Ninh" },
    { value: "6", latitude: "22.3032923", longitude: "105.876004", text: "Bắc Kạn" },
    { value: "75", latitude: "10.95694", longitude: "106.84306", text: "Đồng Nai" },
    { value: "77", latitude: "10.34583", longitude: "107.08472", text: "Bà Rịa - Vũng Tàu" },
    { value: "80", latitude: "10.63194", longitude: "106.49306", text: "Long An" },
    { value: "82", latitude: "10.35417", longitude: "106.36528", text: "Tiền Giang" },
    { value: "83", latitude: "10.241361", longitude: "106.3762601", text: "Bến Tre" },
    { value: "84", latitude: "9.95139", longitude: "106.33472", text: "Trà Vinh" },
    { value: "86", latitude: "10.24583", longitude: "105.95833", text: "Vĩnh Long" },
    { value: "87", latitude: "10.2550873", longitude: "105.9730645", text: "Đồng Tháp" },
    { value: "89", latitude: "10.37528", longitude: "105.41833", text: "An Giang" },
    { value: "91", latitude: "10.02083", longitude: "105.09028", text: "Kiên Giang" },
    { value: "92", latitude: "10.03278", longitude: "105.78389", text: "Cần Thơ" },
    { value: "93", latitude: "9.7817821", longitude: "105.4766698", text: "Hậu Giang" },
    { value: "94", latitude: "9.60389", longitude: "105.97417", text: "Sóc Trăng" },
    { value: "95", latitude: "9.25889", longitude: "105.75194", text: "Bạc Liêu" },
    { value: "96", latitude: "9.18361", longitude: "105.15", text: "Cà Mau" },
  ];

  return (
    <div className="shopping-cart">
      {/* Header */}
      <header className="header">
        <i className="back-arrow">←</i>
        <h1>Giỏ hàng(2)</h1>
      </header>

      {/* Cart Items */}
      <section className="cart-items">
        <CartItem
          image="path/to/image1.jpg"
          name="Rule1 Protein 5lbs Chocolate Peanut Butter"
          initialQuantity={2}
          price="3,180,000đ"
          subtotal="2,920,000đ"
          gift="Quà tặng: Bình lắc WheyStore 1 ngăn 700ml"
        />
        <CartItem
          image="path/to/image2.jpg"
          name="Chocolate Peanut Butter"
          initialQuantity={2}
          price="3,180,000đ"
          subtotal="3,180,000đ"
        />
        <div className="order-subtotal">
          <p>Tạm tính: <span>6,100,000đ</span></p> {/* Tổng tạm tính ban đầu */}
          <a href="#">Chọn hoặc nhập mã</a>
        </div>
      </section>

      {/* Shipping Information */}
      <section className="shipping-info">
        <h2>Thông tin khách hàng</h2>
        <form>
          <label>Họ và tên (bắt buộc)</label>
          <input type="text" placeholder="Nhập họ và tên" required />
          <label>Số điện thoại (bắt buộc)</label>
          <input type="tel" placeholder="Nhập số điện thoại" required />
          <label>Email (Đừng để trống để nhận thông tin...)</label>
          <input type="email" placeholder="Nhập email" />
          <p className="warning">
            Nếu bạn không dùng Email, vui lòng nhắn tin Messenger hoặc Chat Zalo để được hỗ trợ
          </p>
          <label>Chọn địa chỉ nhận hàng</label>
          <div className="address-dropdowns">
            <select
              name="city_id"
              id="city_id"
              className="city_id_load input_text input_text_33 type-ship-2"
            >
              <option value="">Tỉnh/Thành</option>
              {provinces.map((province) => (
                <option
                  key={province.value}
                  value={province.value}
                  latitude={province.latitude}
                  longitude={province.longitude}
                >
                  {province.text}
                </option>
              ))}
            </select>
            <select>
              <option>Quận/Huyện</option>
              {/* Thêm các tùy chọn Quận/Huyện nếu cần */}
            </select>
            <select>
              <option>Phường/Xã</option>
              {/* Thêm các tùy chọn Phường/Xã nếu cần */}
            </select>
          </div>
          <label>Số nhà, tên đường...</label>
          <input type="text" placeholder="Nhập số nhà, tên đường" />
          <label>Mã xác nhận</label>
          <div className="verification">
            <input type="text" value="nNShV" readOnly />
          </div>
          <label>Ghi chú (nếu có)...</label>
          <input type="text" placeholder="Nhập ghi chú" />
          <div className="invoice-checkbox">
            <input type="checkbox" id="invoice" />
            <label htmlFor="invoice">Đồng ý nhận hóa đơn</label>
          </div>
        </form>
      </section>

      {/* Payment Method */}
      <section className="payment-method">
        <h2>Hình thức thanh toán</h2>
        <div>
          <input type="radio" id="cod" name="payment" defaultChecked />
          <label htmlFor="cod">Thanh toán tại nhà khi nhận hàng (COD)</label>
        </div>
        <div>
          <input type="radio" id="bank" name="payment" />
          <label htmlFor="bank">Chuyển khoản ngân hàng</label>
        </div>
      </section>

      {/* Bottom Summary */}
      <section className="bottom-summary">
        <p>Cân nặng khoáng: <span>4,600 gram</span></p>
        <p>Tính cước: <span className="free-shipping">0đ</span></p>
        <p>Tổng cộng: <span className="total">6,100,000đ</span></p> {/* Tổng ban đầu */}
        <p>Tiền cọc: <span className="total">1,180,000đ</span></p>
        <p>Còn lại khi nhận hàng: <span className="total">4,920,000đ</span></p>
      </section>

      {/* Checkout Button */}
      <button className="checkout-button">Hoàn tất đơn hàng</button>
    </div>
  );
}

// Component con để hiển thị từng sản phẩm trong giỏ hàng với logic quantity
function CartItem({ image, name, initialQuantity, price, subtotal, gift }) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [itemSubtotal, setItemSubtotal] = useState(parseInt(subtotal.replace(/[^0-9]/g, '')));

  useEffect(() => {
    const basePrice = parseInt(subtotal.replace(/[^0-9]/g, '')) / initialQuantity;
    setItemSubtotal(basePrice * quantity);
  }, [quantity, subtotal, initialQuantity]);

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="cart-item">
      <img src={image} alt={name} className="product-image" />
      <div className="product-details">
        <h3>{name}</h3>
        {gift && <p className="gift">{gift}</p>}
        <div className="quantity-selector">
          <button onClick={handleDecrease}>-</button>
          <input type="number" value={quantity} readOnly />
          <button onClick={handleIncrease}>+</button>
        </div>
        <p className="price">{price}</p>
        <p className="subtotal">Tạm tính: {itemSubtotal.toLocaleString()}đ</p>
      </div>
    </div>
  );
}

export default ShoppingCart;
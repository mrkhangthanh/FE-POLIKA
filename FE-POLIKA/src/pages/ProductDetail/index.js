import React, { useState } from 'react';
import Header from '../../share/components/Layout/Header';
import Footer from '../../share/components/Layout/Footer';
import './ProductDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const ProductDetail = () => {
  // State để quản lý số lượng
  const [quantity, setQuantity] = useState(1);

  // State để quản lý danh sách bình luận và bình luận mới
  const [comments, setComments] = useState([
    { id: 1, user: 'Nguyễn Văn A', content: 'Sản phẩm rất đẹp, chất lượng tốt!', date: '10/03/2025' },
    { id: 2, user: 'Trần Thị B', content: 'Giao hàng nhanh, nhưng size hơi nhỏ.', date: '09/03/2025' },
  ]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');

  // Hàm tăng/giảm số lượng
  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  // Hàm thêm bình luận mới
  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() && userName.trim()) {
      const newCommentObj = {
        id: comments.length + 1,
        user: userName,
        content: newComment,
        date: new Date().toLocaleDateString('vi-VN'),
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
      setUserName('');
    }
  };

  // Hàm hiển thị các ngôi sao dựa trên đánh giá (giả sử 4.5/5)
  const renderStars = (rating = 4.5) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={i <= Math.floor(rating) ? 'star-filled' : i === Math.ceil(rating) && rating % 1 !== 0 ? 'star-half' : 'star-empty'}
        />
      );
    }
    return stars;
  };

  return (
    <>
      <Header />
      <div className="product-detail-container">
        {/* Phần chính: Chi tiết sản phẩm */}
        <section className="product-main">
          <div className="product-gallery">
            <img
              src="/images/product-2.png"
              alt="Hình ảnh sản phẩm"
              className="main-image"
            />
            <div className="thumbnail-gallery">
              <img src="/images/product-3.png" alt="Thumbnail 1" />
              <img src="/images/product-4.png" alt="Thumbnail 2" />
              <img src="https://via.placeholder.com/100x100" alt="Thumbnail 3" />
            </div>
          </div>
          <div className="product-info">
            <h2>Tên sản phẩm: Áo thun cao cấp</h2>
            <p className="product-sku">Mã sản phẩm: SP12345</p>
            <div className="product-rating">
              {renderStars()} <span>(4.5/5 - 120 lượt đánh giá)</span>
            </div>
            <p className="product-price">Giá: 350,000 VNĐ</p>
            <p className="product-status">Tình trạng: Còn hàng</p>
            <div className="product-options">
              <label htmlFor="size">Kích thước:</label>
              <select id="size">
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
            {/* Phần số lượng và nút Thêm vào giỏ, Mua ngay */}
            <div className="product-cart-actions">
              <div className="quantity-selector">
                <label>Số lượng:</label>
                <div className="quantity-input">
                  <button type="button" onClick={handleDecrease}>-</button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                  />
                  <button type="button" onClick={handleIncrease}>+</button>
                </div>
              </div>
              <div className="cart-buttons">
                <button className="add-to-cart-btn">THÊM VÀO GIỎ</button>
                <button className="buy-now-btn">MUA NGAY</button>
              </div>
              <p className="support-contact">
                Gói đặt mua: <a href="tel:0902966689">0902.966.689</a> [8h30 - 22h30]
              </p>
            </div>
            <div className="product-actions">
              <button className="share-btn">Chia sẻ</button>
              <button className="wishlist-btn">Yêu thích</button>
            </div>
          </div>
        </section>

        {/* Mô tả sản phẩm */}
        <section className="product-description">
          <h3>Mô tả sản phẩm</h3>
          <p>
            Đây là một chiếc áo thun cao cấp được làm từ 100% cotton, mềm mại và thoáng mát. Sản phẩm phù hợp với mọi lứa tuổi, thiết kế đơn giản nhưng tinh tế, dễ dàng phối đồ trong nhiều dịp khác nhau. Chất liệu bền, không xù lông sau nhiều lần giặt.
          </p>
          <ul>
            <li>Chất liệu: 100% cotton</li>
            <li>Màu sắc: Đen, Trắng, Xanh</li>
            <li>Kích thước: S, M, L, XL</li>
            <li>Bảo hành: 6 tháng</li>
          </ul>
        </section>

        {/* Bình luận sản phẩm */}
        <section className="product-comments">
          <h3>Bình luận sản phẩm</h3>
          <div className="comment-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <p><strong>{comment.user}:</strong> {comment.content}</p>
                  <p>Ngày: {comment.date}</p>
                </div>
              ))
            ) : (
              <p>Chưa có bình luận nào.</p>
            )}
          </div>
          <form className="comment-form" onSubmit={handleAddComment}>
            <h4>Viết bình luận của bạn</h4>
            <input
              type="text"
              placeholder="Nhập tên của bạn..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <textarea
              placeholder="Nhập bình luận của bạn..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="4"
              required
            ></textarea>
            <button type="submit">Gửi bình luận</button>
          </form>
        </section>

        {/* Sản phẩm liên quan */}
        <section className="related-products">
          <h3>Sản phẩm liên quan</h3>
          <div className="related-products-list">
            <div className="related-product">
              <img src="https://via.placeholder.com/200x200" alt="Sản phẩm liên quan 1" />
              <h4>Áo thun nam</h4>
              <p>250,000 VNĐ</p>
            </div>
            <div className="related-product">
              <img src="https://via.placeholder.com/200x200" alt="Sản phẩm liên quan 2" />
              <h4>Áo thun nữ</h4>
              <p>280,000 VNĐ</p>
            </div>
            <div className="related-product">
              <img src="https://via.placeholder.com/200x200" alt="Sản phẩm liên quan 3" />
              <h4>Áo thun trẻ em</h4>
              <p>200,000 VNĐ</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
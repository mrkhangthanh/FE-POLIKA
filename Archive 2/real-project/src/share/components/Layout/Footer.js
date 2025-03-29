import React from 'react';
import './Footer.css'; // Import file CSS riêng

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section contact">
          <h3>Liên hệ với chúng tôi</h3>
          <p>Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
          <p>Điện thoại: 0909 123 456</p>
          <p>Email: support@example.com</p>
        </div>
        
       
        <div className="footer-section intro">
          <h3>GIỚI THIỆU CHUNG</h3>
          <ul>
            <li><a href="#">Giới thiệu về Polika</a></li>
            <li><a href="#">Hướng dẫn đặt hàng</a></li>
            <li><a href="#">Hướng dẫn thanh toán</a></li>
            <li><a href="#">Quy định chung</a></li>
            <li><a href="#">Nội quy cửa hàng</a></li>
            <li><a href="#">Liên hệ & khiếu nại</a></li>
            <li><a href="#">Điều khoản giao dịch</a></li>
          </ul>
        </div>
        <div className="footer-section map">
          <h3>Bản đồ</h3>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.671077405533!2d106.69570631494573!3d10.776843762314645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f0ba0d2d7dd%3A0x5e95b8e0f2e5e9b!2zMTIzIFBo4buRIEzhu5EgQsOgYywgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1634567890!5m2!1svi!2s"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
        <div className="footer-section social">
          <h3>Kết nối với chúng tôi</h3>
          <p>Chia sẻ trang lên Facebook:</p>
          <button
            className="share-facebook-btn"
            onClick={() =>
              window.open(
                'https://www.facebook.com/sharer/sharer.php?u=' +
                  encodeURIComponent(window.location.href),
                '_blank'
              )
            }
          >
            Chia sẻ trên Facebook
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
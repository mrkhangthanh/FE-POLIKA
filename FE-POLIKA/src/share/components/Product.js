import React from 'react';

const Product = () => {
  return (
    <div id="newProducts">
    <div className="container">
      <div className="products">
        <h3> Sản Phẩm Nổi Bật </h3>
        <div className="product-list row row-cols-3 row-cols-lg-6 row-cols-md-3">
          <div className="product-items">
            <div className="product-item-inner card">
              <a href="#"><img height={160} src={`/images/product-1.png`} alt /></a>
              <h4><a href="#">IPhone XS mAxx</a></h4>
              <p>Gia ban :<span>32.000.000</span>
              </p>
            </div>
          </div>
          <div className="product-items">
            <div className="product-item-inner card">
              <a href="#"><img height={160} src={`/images/product-2.png`} alt /></a>
              <h4><a href="#">IPhone XS mAxx</a></h4>
              <p>Gia ban :<span>32.000.000</span>
              </p>
            </div>
          </div>
          <div className="product-items">
            <div className="product-item-inner card">
              <a href="#"><img height={160} src={`/images/product-3.png`} alt /></a>
              <h4><a href="#">IPhone XS mAxx</a></h4>
              <p>Gia ban :<span>32.000.000</span>
              </p>
            </div>
          </div>
          <div className="product-items">
            <div className="product-item-inner card">
              <a href="#"><img height={160} src={`/images/product-4.png`} alt /></a>
              <h4><a href="#">IPhone XS mAxx</a></h4>
              <p>Gia ban :<span>32.000.000</span>
              </p>
            </div>
          </div>
          <div className="product-items">
            <div className="product-item-inner card">
              <a href="#"><img height={160} src={`/images/product-5.png`} alt /></a>
              <h4><a href="#">IPhone XS mAxx</a></h4>
              <p>Gia ban :<span>32.000.000</span>
              </p>
            </div>
          </div>
          <div className="product-items">
            <div className="product-item-inner card">
              <a href="#"><img height={160} src={`/images/product-6.png`} alt /></a>
              <h4><a href="#">IPhone XS mAxx</a></h4>
              <p>Gia ban :<span>32.000.000</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Product
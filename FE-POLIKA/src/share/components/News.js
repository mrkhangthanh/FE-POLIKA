import React from 'react'

const News = () => {
  return (
    <>
    <div id="news">
    <div className="container">
      <h3>Tin tức – bài viết mới cập nhật :</h3>
      <div className="row row-cols-1 row-cols-lg-4 row-cols-md-2 ">
        <div className="col mb-4">
          <div className="card">
            <img src= {`/images/content1.jpg`} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Card title</h5>
              <p className="card-text">This is a longer card with supporting text below as a natural lead-in
                to additional content. This content is a little bit longer.</p>
              <a href>
                <p style={{textAlign: 'right', color: 'orange'}}>Xem Chi Tiết...</p>
              </a>
            </div>
          </div>
        </div>
        <div className="col mb-4">
          <div className="card">
            <img src={`/images/content1.jpg`} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Card title</h5>
              <p className="card-text">This is a longer card with supporting text below as a natural lead-in
                to additional content. This content is a little bit longer.</p>
              <a href>
                <p style={{textAlign: 'right', color: 'orange'}}>Xem Chi Tiết...</p>
              </a>
            </div>
          </div>
        </div>
        <div className="col mb-4">
          <div className="card">
            <img src={`/images/content1.jpg`} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Card title</h5>
              <p className="card-text">This is a longer card with supporting text below as a natural lead-in
                to additional content. This content is a little bit longer.</p>
              <a href>
                <p style={{textAlign: 'right', color: 'orange'}}>Xem Chi Tiết...</p>
              </a>
            </div>
          </div>
        </div>
        <div className="col mb-4">
          <div className="card">
            <img src={`/images/content1.jpg`} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Card title</h5>
              <p className="card-text">This is a longer card with supporting text below as a natural lead-in
                to additional content. This content is a little bit longer.</p>
              <a href>
                <p style={{textAlign: 'right', color: 'orange'}}>Xem Chi Tiết...</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  )
}

export default News
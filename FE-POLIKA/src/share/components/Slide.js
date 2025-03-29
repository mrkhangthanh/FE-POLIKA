import React, { useEffect } from 'react';

const Slide = () => {
  useEffect(() => {
    console.log("Slide component mounted");
    const carouselElement = document.querySelector('#carouselExampleIndicators');
    if (carouselElement && window.bootstrap) {
      console.log("Initializing carousel");
      const carousel = new window.bootstrap.Carousel(carouselElement, {
        interval: 2000, // Chuyển slide sau 3 giây
        ride: 'carousel',
        wrap: true,
        touch: true,
      });
    } else {
      console.error('Bootstrap or carouselElement not loaded', { carouselElement, bootstrap: window.bootstrap });
    }

    // Preload hình ảnh
    const images = ['/images/anh1.jpeg', '/images/anhsl2.jpeg', '/images/anhsl3.jpeg'];
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <>
      <div id="welcomeMessage" style={{ display: 'none', height: 600 }}>
        <p className="success-message" id="userWelcome" />
      </div>
      <div id="slideTop">
        <div className="container">
          <div className="row">
            <div className="itemSlide col-lg-8 col-md-8 col-sm-1">
              <div id="carouselExampleIndicators" className="carousel slide">
                <ol className="carousel-indicators">
                  <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" />
                  <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" />
                  <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" />
                </ol>
                <div className="bdSlide carousel-inner">
                  <div className="carousel-item active">
                    <img src="/images/anh1.jpeg" className="d-block w-100" alt="Slide 1" loading="lazy" />
                  </div>
                  <div className="carousel-item">
                    <img src="/images/anhsl2.jpeg" className="d-block w-100" alt="Slide 2" loading="lazy" />
                  </div>
                  <div className="carousel-item">
                    <img src="/images/anhsl3.jpeg" className="d-block w-100" alt="Slide 3" loading="lazy" />
                  </div>
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon" aria-hidden="true" />
                  <span className="sr-only">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon" aria-hidden="true" />
                  <span className="sr-only">Next</span>
                </button>
              </div>
            </div>
            <div className="picRight col-lg-4 col-md-4 col-sm-1">
              <a href="#">
                <img className="bnRight1 img-fluid" src="./images/bnR1.jpeg" alt="Banner Right 1" />
              </a>
              <a href="#">
                <img className="bnRight2 img-fluid" src="./images/brR2.jpeg" alt="Banner Right 2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Slide;
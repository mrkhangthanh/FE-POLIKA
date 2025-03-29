import React from 'react'
import { PUBLIC_URL } from '../../constants/app';

const BanerCenter = () => {
  return (
    <div id="bnCenter">
    <div className="container">
      <div className="row col-lg-12 col-md-12 col-sm-12">
        <a href="#"><img
                className="img-fluid"
                src={`/images/bncenter.png`}
                alt="Banner Center" // Thêm giá trị alt
              /></a>
      </div>
    </div>
  </div>
  )
}

export default BanerCenter;
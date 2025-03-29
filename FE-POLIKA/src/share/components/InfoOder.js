import React from 'react'

const InfoOder = () => {
  return (
    <div id="form-xem-don" style={{display: 'none'}}>
    <form>
      <h2>Thông tin đơn hàng</h2>
      <label>Tên khách hàng:</label>
      <input type="text" name="ten-khach-hang" required />
      <br />
      <label>Số điện thoại:</label>
      <input type="text" name="so-dien-thoai" required />
      <br />
      <label>Địa chỉ:</label>
      <input type="text" name="dia-chi" required />
      <br />
      <div className="button-group">
        <button type="button" id="btn-huy">Hủy</button>
        <button type="submit">Đặt hàng</button>
      </div>
    </form>
  </div>
  )
}

export default InfoOder
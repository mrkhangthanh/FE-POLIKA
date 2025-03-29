import React from 'react'

const Register = () => {
  return (
    <>
    
    <div id="welcomeMessage" style={{display: 'none'}}>
    <p className="success-message" id="userWelcome" />
  </div>
  <form action>
    <div id="myModal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <p id="formTitle_Register"> Đăng Ký Tài khoản :</p>
          <span className="close-register">×</span>
        </div>
        <div className="modal-body">
          <p>Tên tài khoản và mật khẩu :</p>
          <input id="loginUser" name="loginUser" className="login-pass" type="text" placeholder="Tên Đăng Nhập..." required />
          <input id="passWordUser" name="passWordUser" className="login-pass" type="password" placeholder="Nhập Mật Khẩu ..." required />
          <div className="status_user">
            <label htmlFor="accountType">Chọn Loại Tài Khoản : </label>
            <select id="accountType" name="account_Type" required>
              <option value="luaChon">Vui lòng lựa chọn...</option>
              <option value="khachHang">Khách Hàng</option>
              <option value="nhaBanHang">Nhà Bán Hàng</option>
            </select>
          </div>
          <div className="dieuKhoan">
            <input type="checkbox" name="checkbox" defaultChecked /> <span>Tôi đồng ý với điều khoản chính sách của công ty.</span>
          </div>
        </div>
        <p id="toggleForm" onclick="changeFormLg()" style={{textAlign: 'center', marginTop: 10, color: '#007bff', cursor: 'pointer'}}>
          Đã có tài khoản? Đăng nhập
        </p>
        <div className="modal-footer">
          <button id="btn_register" type="submit">Đăng Ký</button>
        </div>
      </div>
    </div>
  </form>
    </>
  )
}

export default Register
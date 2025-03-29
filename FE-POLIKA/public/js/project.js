
// register-login 
// form dangky modal 
const myModal = document.getElementById('myModal');
const formTitle_Register = document.getElementById('formTitle_Register');
const formTitle_Login = document.getElementById('formTitle_Login');
const btn = document.getElementById("myBtn");
const myModalLg = document.getElementById('myModalLg');
const btnLg = document.getElementById('dangNhap');
const loginUser = document.getElementById('loginUser');
const passWordUser = document.getElementById('passWordUser');
const accountType = document.getElementById('accountType');
const login_User = document.getElementById('login_User');
const login_Password = document.getElementById('login_Password')
const toggleForm = document.getElementById('toggleForm');
const btn_login = document.getElementById('btn_login');
const welcomeMessage = document.getElementById('welcomeMessage');
const userWelcome = document.getElementById('userWelcome')
const span = document.getElementsByClassName('close-register')[0];
const span2 = document.getElementsByClassName('close-login')[0];
btn.onClick = ()=> {
    myModal.style.display = "block";
};
span.onClick = ()=>{
    myModal.style.display = "none";
}
// end form dangky modal 
// form dangky modal 
btnLg.onClick = ()=> {
  myModalLg.style.display = "block";
}
span2.onClick =()=>{
  myModalLg.style.display = "none";
}
// Chuyển đổi giữa Đăng Ký và Đăng Nhập
let isRegistering = true;
function changeFormLg(){
  isRegistering = !isRegistering; 
  if (isRegistering) {
      myModal.style.display = "flex";
      myModalLg.style.display = "none";
  } else {
      myModal.style.display = "none";
      myModalLg.style.display = "flex";
  }
};
let notRegistering = true;
function changeFormRg(){
  notRegistering = !notRegistering; 
  if (notRegistering) {
      myModalLg.style.display = "flex";
      myModal.style.display = "none";
  } else {
      myModalLg.style.display = "none";
      myModal.style.display = "flex";
  }
};

// end register-login 
// Du lieu tai khoan gia lap 

let users=[];

// xu ly dang ky 
document.addEventListener('DOMContentLoaded', () => {
  const btn_register = document.getElementById('btn_register');
  btn_register.addEventListener('click', () => {
    const username = loginUser.value.trim();
    const password= passWordUser.value.trim();
      
      if (username === '' || password ===''){

        alert('vui lòng điền đầy đủ thông tin !');
        return;
      }
      // Lấy danh sách user từ localStorage (nếu chưa có thì khởi tạo mảng rỗng)
    let users = JSON.parse(localStorage.getItem('list_user')) || [];
      // kiem tra tai khoan trung lap
      const isExist = users.some(user => user.username === username);
    if (isExist) {
      alert('Tài khoản đã tồn tại !')
      return;
    }
    // Thêm tài khoản vào danh sach
    const newUser = {username, password}
    users.push(newUser);
    alert('Đăng ký thành công !');
    localStorage.setItem('list_user', JSON.stringify(users));
    loginUser.value = '';
    passWordUser.value = '';
    myModal.style.display = 'none';
    myModalLg.style.display = 'block';
 
   
  });
  

  // xu ly dang nhap
  // Xử lý đăng nhập
  btn_login.addEventListener('click', (event) => {
  event.preventDefault(); // Ngăn hành vi gửi form mặc định

  const username = login_User.value.trim();
  const password = login_Password.value.trim();

  if (username === '' || password === '') {
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }
 // Lấy danh sách user từ localStorage
 const users = JSON.parse(localStorage.getItem('list_user')) || [];


  // Kiểm tra thông tin tài khoản
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    return;
  }

  // Hiển thị thông báo chào mừng
  myModalLg.style.display = 'none'; // Ẩn modal đăng nhập
  welcomeMessage.style.display = 'block'; // Hiển thị thông báo
  userWelcome.textContent = `Xin chào: ${username}`; // Chào mừng người dùng
});

});

// vuốt oder list 
function scroLeft() {
  const wrapper = document.querySelector('.currency-wrapper');
  wrapper.scrollBy({ left: -200, behavior: 'smooth' });
}

function scrollRight() {
  const wrapper = document.querySelector('.currency-wrapper');
  wrapper.scrollBy({ left: 200, behavior: 'smooth' });
}
// end vuốt oder list 
// đây là code để ấn nút xem đơn hiển thị form
// Lấy tất cả các button "Xem Đơn"
// Lấy tất cả các button "Xem Đơn"
const buttons = document.querySelectorAll('.buy-btn');

// Thêm sự kiện click vào từng button
buttons.forEach(button => {
  button.addEventListener('click', () => {
    // Hiển thị form khi button được click
    const form = document.getElementById('form-xem-don');
    form.style.display = 'block';
  });
});

// Thêm sự kiện click vào nút hủy
const btnHuy = document.getElementById('btn-huy');
btnHuy.addEventListener('click', () => {
  // Ẩn form khi nút hủy được click
  const form = document.getElementById('form-xem-don');
  form.style.display = 'none';
});

// đây là code để kết thúc ấn nút xem đơn hiển thị form

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  FaTachometerAlt,
  FaUsers,
  FaLock,
  FaUserCheck,
  FaBox,
  FaTags,
  FaFileAlt,
  FaShoppingCart,
  FaTools,
  FaUserFriends,
  FaChartLine,
  FaChartBar,
  FaMoneyBillWave,
  FaCreditCard,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaChevronDown,
} from 'react-icons/fa';
import './Dashboard.css';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Người dùng' };
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Trạng thái toggle sidebar
  const [openGroups, setOpenGroups] = useState({
    'quan-ly-tai-khoan': false,
    'quan-ly-san-pham-dich-vu': false,
    'quan-ly-bai-viet': false,
    'quan-ly-don-hang': false,
    'quan-ly-nguoi-dung': false,
    'thong-ke-va-bao-cao': false,
    'quan-ly-giao-dich': false,
    'cai-dat': false,
  }); // Trạng thái mở/đóng cho từng nhóm

  // Dữ liệu giả (mock data)
  const mockUsers = [
    { id: 'USR-0001', name: 'Nguyễn Văn A', role: 'customer', email: 'vana@example.com', status: 'Hoạt động' },
    { id: 'USR-0002', name: 'Trần Thị B', role: 'technician', email: 'thib@example.com', status: 'Hoạt động' },
    { id: 'USR-0003', name: 'Lê Văn C', role: 'agent', email: 'vanc@example.com', status: 'Ngừng hoạt động' },
  ];

  const chartData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Người dùng mới',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: '#ff4500',
        tension: 0.1,
      },
      {
        label: 'Đơn hàng hoàn thành',
        data: [28, 48, 40, 19, 86, 27],
        fill: false,
        borderColor: '#00c4b4',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Thống kê người dùng và đơn hàng' },
    },
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
    console.log(`Toggled group: ${group}, State: ${!openGroups[group]}`); // Debug log
  };

  return (
    <div className="dashboard-wrapper">
      {/* Nút toggle cho mobile */}
      <button className="toggle-sidebar" onClick={toggleSidebar}>
        {isSidebarOpen ? 'Ẩn Menu' : 'Hiện Menu'}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>PUTINKA</h2>
        </div>
        <ul className="sidebar-menu">
      
          <li
            className={activeMenu === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveMenu('dashboard')}
          >
            <span>
            <FaTachometerAlt className="menu-icon" />
            Dashboard
             </span>
          </li>
          

          {/* Quản lý tài khoản */}
          <li className="menu-group">
            <span
              className="menu-group-title"
              onClick={() => toggleGroup('quan-ly-tai-khoan')}
              style={{ cursor: 'pointer' }}
            >
                Quản lý tài khoản   
              <FaChevronDown
                className="toggle-icon"
                style={{
                  transform: openGroups['quan-ly-tai-khoan'] ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              />
            </span>
            <ul className={`submenu ${openGroups['quan-ly-tai-khoan'] ? 'open' : ''}`}>
              <li
                className={activeMenu === 'accounts' ? 'active' : ''}
                onClick={() => setActiveMenu('accounts')}
              >
                <span>
                  <FaUsers className="submenu-icon" />
                  <span>Danh sách tài khoản</span>
                </span>
              </li>
              <li
                className={activeMenu === 'roles' ? 'active' : ''}
                onClick={() => setActiveMenu('roles')}
              >
                <span>
                  <FaUserCheck className="submenu-icon" />
                  <span>Quản lý vai trò</span>
                </span>
              </li>
              <li
                className={activeMenu === 'locked-accounts' ? 'active' : ''}
                onClick={() => setActiveMenu('locked-accounts')}
              >
                <span>
                  <FaLock className="submenu-icon" />
                  <span>Tài khoản bị khóa</span>
                </span>
              </li>
            </ul>
          </li>

          {/* Quản lý sản phẩm/dịch vụ */}
          <li className="menu-group">
            <span
              className="menu-group-title"
              onClick={() => toggleGroup('quan-ly-san-pham-dich-vu')}
              style={{ cursor: 'pointer' }}
            >
              Quản lý sản phẩm/dịch vụ
              <FaChevronDown
                className="toggle-icon"
                style={{
                  transform: openGroups['quan-ly-san-pham-dich-vu'] ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              />
            </span>
            <ul className={`submenu ${openGroups['quan-ly-san-pham-dich-vu'] ? 'open' : ''}`}>
              <li
                className={activeMenu === 'products' ? 'active' : ''}
                onClick={() => setActiveMenu('products')}
              >
                <span>
                  <FaBox className="submenu-icon" />
                  <span>Danh sách sản phẩm/dịch vụ</span>
                </span>
              </li>
              <li
                className={activeMenu === 'product-categories' ? 'active' : ''}
                onClick={() => setActiveMenu('product-categories')}
              >
                <span>
                  <FaTags className="submenu-icon" />
                  <span>Danh mục sản phẩm/dịch vụ</span>
                </span>
              </li>
              <li
                className={activeMenu === 'promotions' ? 'active' : ''}
                onClick={() => setActiveMenu('promotions')}
              >
                <span>
                  <FaTags className="submenu-icon" />
                  <span>Khuyến mãi</span>
                </span>
              </li>
            </ul>
          </li>

          {/* Quản lý bài viết */}
          <li className="menu-group">
            <span
              className="menu-group-title"
              onClick={() => toggleGroup('quan-ly-bai-viet')}
              style={{ cursor: 'pointer' }}
            >
              Quản lý bài viết
              <FaChevronDown
                className="toggle-icon"
                style={{
                  transform: openGroups['quan-ly-bai-viet'] ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              />
            </span>
            <ul className={`submenu ${openGroups['quan-ly-bai-viet'] ? 'open' : ''}`}>
              <li
                className={activeMenu === 'posts' ? 'active' : ''}
                onClick={() => setActiveMenu('posts')}
              >
                <span>
                  <FaFileAlt className="submenu-icon" />
                  <span>Danh sách bài viết</span>
                </span>
              </li>
              <li
                className={activeMenu === 'post-categories' ? 'active' : ''}
                onClick={() => setActiveMenu('post-categories')}
              >
                <span>
                  <FaTags className="submenu-icon" />
                  <span>Danh mục bài viết</span>
                </span>
              </li>
              <li
                className={activeMenu === 'featured-posts' ? 'active' : ''}
                onClick={() => setActiveMenu('featured-posts')}
              >
                <span>
                  <FaFileAlt className="submenu-icon" />
                  <span>Bài viết nổi bật</span>
                </span>
              </li>
            </ul>
          </li>

          {/* Quản lý đơn hàng */}
          <li className="menu-group">
            <span
              className="menu-group-title"
              onClick={() => toggleGroup('quan-ly-don-hang')}
              style={{ cursor: 'pointer' }}
            >
              Quản lý đơn hàng
              <FaChevronDown
                className="toggle-icon"
                style={{
                  transform: openGroups['quan-ly-don-hang'] ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              />
            </span>
            <ul className={`submenu ${openGroups['quan-ly-don-hang'] ? 'open' : ''}`}>
              <li
                className={activeMenu === 'orders' ? 'active' : ''}
                onClick={() => setActiveMenu('orders')}
              >
                <span>
                  <FaShoppingCart className="submenu-icon" />
                  <span>Danh sách đơn hàng</span>
                </span>
              </li>
              <li
                className={activeMenu === 'repair-orders' ? 'active' : ''}
                onClick={() => setActiveMenu('repair-orders')}
              >
                <span>
                  <FaTools className="submenu-icon" />
                  <span>Đơn hàng thuê người sửa chữa</span>
                </span>
              </li>
              <li
                className={activeMenu === 'pending-orders' ? 'active' : ''}
                onClick={() => setActiveMenu('pending-orders')}
              >
                <span>
                  <FaShoppingCart className="submenu-icon" />
                  <span>Đơn hàng đang xử lý</span>
                </span>
              </li>
              <li
                className={activeMenu === 'completed-orders' ? 'active' : ''}
                onClick={() => setActiveMenu('completed-orders')}
              >
                <span>
                  <FaShoppingCart className="submenu-icon" />
                  <span>Đơn hàng hoàn thành</span>
                </span>
              </li>
              <li
                className={activeMenu === 'cancelled-orders' ? 'active' : ''}
                onClick={() => setActiveMenu('cancelled-orders')}
              >
                <span>
                  <FaShoppingCart className="submenu-icon" />
                  <span>Đơn hàng bị hủy</span>
                </span>
              </li>
            </ul>
          </li>

          {/* Quản lý người dùng */}
          <li className="menu-group">
            <span
              className="menu-group-title"
              onClick={() => toggleGroup('quan-ly-nguoi-dung')}
              style={{ cursor: 'pointer' }}
            >
              Quản lý người dùng
              <FaChevronDown
                className="toggle-icon"
                style={{
                  transform: openGroups['quan-ly-nguoi-dung'] ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              />
            </span>
            <ul className={`submenu ${openGroups['quan-ly-nguoi-dung'] ? 'open' : ''}`}>
              <li
                className={activeMenu === 'customers' ? 'active' : ''}
                onClick={() => setActiveMenu('customers')}
              >
                <span>
                  <FaUserFriends className="submenu-icon" />
                  <span>Danh sách khách hàng</span>
                </span>
              </li>
              <li
                className={activeMenu === 'technicians' ? 'active' : ''}
                onClick={() => setActiveMenu('technicians')}
              >
                <span>
                  <FaTools className="submenu-icon" />
                  <span>Danh sách thợ</span>
                </span>
              </li>
              <li
                className={activeMenu === 'agents' ? 'active' : ''}
                onClick={() => setActiveMenu('agents')}
              >
                <span>
                  <FaUserFriends className="submenu-icon" />
                  <span>Danh sách đại lý</span>
                </span>
              </li>
              <li
                className={activeMenu === 'potential-customers' ? 'active' : ''}
                onClick={() => setActiveMenu('potential-customers')}
              >
                <span>
                  <FaUserFriends className="submenu-icon" />
                  <span>Khách hàng tiềm năng</span>
                </span>
              </li>
            </ul>
          </li>

          {/* Thống kê và báo cáo */}
          <li className="menu-group">
            <span
              className="menu-group-title"
              onClick={() => toggleGroup('thong-ke-va-bao-cao')}
              style={{ cursor: 'pointer' }}
            >
              Thống kê và báo cáo
              <FaChevronDown
                className="toggle-icon"
                style={{
                  transform: openGroups['thong-ke-va-bao-cao'] ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              />
            </span>
            <ul className={`submenu ${openGroups['thong-ke-va-bao-cao'] ? 'open' : ''}`}>
              <li
                className={activeMenu === 'revenue-stats' ? 'active' : ''}
                onClick={() => setActiveMenu('revenue-stats')}
              >
                <span>
                  <FaChartLine className="submenu-icon" />
                  <span>Thống kê doanh thu</span>
                </span>
              </li>
              <li
                className={activeMenu === 'order-stats' ? 'active' : ''}
                onClick={() => setActiveMenu('order-stats')}
              >
                <span>
                  <FaChartBar className="submenu-icon" />
                  <span>Thống kê đơn hàng</span>
                </span>
              </li>
              <li
                className={activeMenu === 'user-stats' ? 'active' : ''}
                onClick={() => setActiveMenu('user-stats')}
              >
                <span>
                  <FaChartBar className="submenu-icon" />
                  <span>Thống kê người dùng</span>
                </span>
              </li>
              <li
                className={activeMenu === 'technician-performance' ? 'active' : ''}
                onClick={() => setActiveMenu('technician-performance')}
              >
                <span>
                  <FaChartLine className="submenu-icon" />
                  <span>Báo cáo hiệu suất thợ</span>
                </span>
              </li>
            </ul>
          </li>

          {/* Quản lý giao dịch */}
          <li className="menu-group">
            <span
              className="menu-group-title"
              onClick={() => toggleGroup('quan-ly-giao-dich')}
              style={{ cursor: 'pointer' }}
            >
              Quản lý giao dịch
              <FaChevronDown
                className="toggle-icon"
                style={{
                  transform: openGroups['quan-ly-giao-dich'] ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              />
            </span>
            <ul className={`submenu ${openGroups['quan-ly-giao-dich'] ? 'open' : ''}`}>
              <li
                className={activeMenu === 'transactions' ? 'active' : ''}
                onClick={() => setActiveMenu('transactions')}
              >
                <span>
                  <FaMoneyBillWave className="submenu-icon" />
                  <span>Lịch sử giao dịch</span>
                </span>
              </li>
              <li
                className={activeMenu === 'unpaid-transactions' ? 'active' : ''}
                onClick={() => setActiveMenu('unpaid-transactions')}
              >
                <span>
                  <FaCreditCard className="submenu-icon" />
                  <span>Giao dịch chưa thanh toán</span>
                </span>
              </li>
              <li
                className={activeMenu === 'refunds' ? 'active' : ''}
                onClick={() => setActiveMenu('refunds')}
              >
                <span>
                  <FaMoneyBillWave className="submenu-icon" />
                  <span>Hoàn tiền</span>
                </span>
              </li>
            </ul>
          </li>

          {/* Cài đặt */}
          <li className="menu-group">
            <span
              className="menu-group-title"
              onClick={() => toggleGroup('cai-dat')}
              style={{ cursor: 'pointer' }}
            >
              Cài đặt
              <FaChevronDown
                className="toggle-icon"
                style={{
                  transform: openGroups['cai-dat'] ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              />
            </span>
            <ul className={`submenu ${openGroups['cai-dat'] ? 'open' : ''}`}>
              <li
                className={activeMenu === 'system-config' ? 'active' : ''}
                onClick={() => setActiveMenu('system-config')}
              >
                <span>
                  <FaCog className="submenu-icon" />
                  <span>Cấu hình hệ thống</span>
                </span>
              </li>
              <li
                className={activeMenu === 'notifications' ? 'active' : ''}
                onClick={() => setActiveMenu('notifications')}
              >
                <span>
                  <FaBell className="submenu-icon" />
                  <span>Quản lý thông báo</span>
                </span>
              </li>
              <li
                className={activeMenu === 'account-settings' ? 'active' : ''}
                onClick={() => setActiveMenu('account-settings')}
              >
                <span>
                  <FaCog className="submenu-icon" />
                  <span>Cài đặt tài khoản</span>
                </span>
              </li>
            </ul>
          </li>

          <li onClick={handleLogout}>
          <span>
            <FaSignOutAlt className="menu-icon" />
            Đăng xuất
            </span>
          </li>
        </ul>
      </div>

      {/* Nội dung chính */}
      <div className="main-content">
        <div className="header">
          <h2>Dashboard</h2>
          <div className="user-info">
            <span>Xin chào, {user.name}</span>
            <button onClick={handleLogout}>Đăng xuất</button>
          </div>
        </div>
        <div className="stats">
          <div className="stat-box">
            <h3>Tổng người dùng</h3>
            <p>14,372</p>
          </div>
          <div className="stat-box">
            <h3>Khách hàng</h3>
            <p>10,500</p>
          </div>
          <div className="stat-box">
            <h3>Thợ</h3>
            <p>3,500</p>
          </div>
          <div className="stat-box">
            <h3>Doanh thu</h3>
            <p>26,321 VND</p>
          </div>
        </div>
        <div className="charts">
          <div className="chart-box">
            <Line data={chartData} options={chartOptions} />
          </div>
          <div className="satisfaction-box">
            <h3>Tỷ lệ hoàn thành đơn hàng</h3>
            <p>84%</p>
          </div>
        </div>
        <div className="additional-stats">
          <div className="stat-box">
            <h3>Tổng khách hàng</h3>
            <p>10,500</p>
          </div>
          <div className="stat-box">
            <h3>Tổng thợ</h3>
            <p>3,500</p>
          </div>
          <div className="stat-box">
            <h3>Tổng đơn hàng</h3>
            <p>5,230</p>
          </div>
          <div className="stat-box">
            <h3>Doanh thu</h3>
            <p>26,321 VND</p>
          </div>
        </div>
        <div className="recent-users">
          <h3>Người dùng gần đây</h3>
          <p>Tổng người dùng: 14,372.</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Vai trò</th>
                <th>Email</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={user.status === 'Hoạt động' ? 'status-active' : 'status-inactive'}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
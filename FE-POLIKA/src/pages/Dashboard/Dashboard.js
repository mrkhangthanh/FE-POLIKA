import React, { useState, useEffect } from 'react';
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
import { getAllUsers, deleteUser, getStats } from '../../services/Api';
import './Dashboard.css';
import GetAllUserDashBoard from './getAllUser';
import './getAllUser/getAllUser.css';



ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

// Component con cho từng mục menu
const DashboardContent = ({ users, stats, chartData, chartOptions, navigate, handleDeleteUser }) => (
  <div className="content-section">
    <div className="stats">
      <div className="stat-box">
        <h3>Tổng người dùng</h3>
        <p>{users.length}</p>
      </div>
      <div className="stat-box">
        <h3>Khách hàng</h3>
        <p>{users.filter((u) => u.role === 'customer').length}</p>
      </div>
      <div className="stat-box">
        <h3>Thợ</h3>
        <p>{users.filter((u) => u.role === 'technician').length}</p>
      </div>
      <div className="stat-box">
        <h3>Doanh thu</h3>
        <p>{stats.totalRevenue.toLocaleString('vi-VN')} VND</p>
      </div>
    </div>
    <div className="charts">
      <div className="chart-box">
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="satisfaction-box">
        <h3>Tỷ lệ hoàn thành đơn hàng</h3>
        <p>{stats.completionRate}%</p>
      </div>
    </div>
    <div className="additional-stats">
      <div className="stat-box">
        <h3>Tổng khách hàng</h3>
        <p>{users.filter((u) => u.role === 'customer').length}</p>
      </div>
      <div className="stat-box">
        <h3>Tổng thợ</h3>
        <p>{users.filter((u) => u.role === 'technician').length}</p>
      </div>
      <div className="stat-box">
        <h3>Tổng đơn hàng</h3>
        <p>{stats.totalOrders.toLocaleString('vi-VN')}</p>
      </div>
      <div className="stat-box">
        <h3>Doanh thu</h3>
        <p>{stats.totalRevenue.toLocaleString('vi-VN')} VND</p>
      </div>
    </div>
    <div className="recent-users">
      <h3>Người dùng gần đây</h3>
      <p>Tổng người dùng: {users.length}.</p>
      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Vai trò</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name || 'N/A'}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>
                  <span className={user.status === 'active' ? 'status-active' : 'status-inactive'}>
                    {user.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </td>
                <td>
                  <button onClick={() => navigate(`/user/${user._id}`)}>View</button>
                  <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có người dùng nào.</p>
      )}
    </div>
  </div>
);


// Quản lý tài khoản
const Accounts = ({ users }) => (
  <div className="content-section">
    <h3>Danh sách tài khoản</h3>
    <p>Tổng tài khoản: {users.length}</p>
    {users.length > 0 ? (
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
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name || 'N/A'}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>
              <td>
                <span className={user.status === 'active' ? 'status-active' : 'status-inactive'}>
                  {user.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>Không có tài khoản nào.</p>
    )}
  </div>
);


const Roles = () => (
  <div className="content-section">
    <h3>Quản lý vai trò</h3>
    <p>Chưa có dữ liệu vai trò.</p>
  </div>
);

const LockedAccounts = ({ users }) => (
  <div className="content-section">
    <h3>Tài khoản bị khóa</h3>
    <p>Tổng tài khoản bị khóa: {users.filter((u) => u.status === 'inactive').length}</p>
    {users.filter((u) => u.status === 'inactive').length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Vai trò</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((u) => u.status === 'inactive')
            .map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name || 'N/A'}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
              </tr>
            ))}
        </tbody>
      </table>
    ) : (
      <p>Không có tài khoản nào bị khóa.</p>
    )}
  </div>
);

// Quản lý sản phẩm/dịch vụ
const Products = () => (
  <div className="content-section">
    <h3>Danh sách sản phẩm/dịch vụ</h3>
    <p>Chưa có dữ liệu sản phẩm/dịch vụ.</p>
  </div>
);

const ProductCategories = () => (
  <div className="content-section">
    <h3>Danh mục sản phẩm/dịch vụ</h3>
    <p>Chưa có dữ liệu danh mục sản phẩm/dịch vụ.</p>
  </div>
);

const Promotions = () => (
  <div className="content-section">
    <h3>Khuyến mãi</h3>
    <p>Chưa có dữ liệu khuyến mãi.</p>
  </div>
);

// Quản lý bài viết
const Posts = () => (
  <div className="content-section">
    <h3>Danh sách bài viết</h3>
    <p>Chưa có dữ liệu bài viết.</p>
  </div>
);

const PostCategories = () => (
  <div className="content-section">
    <h3>Danh mục bài viết</h3>
    <p>Chưa có dữ liệu danh mục bài viết.</p>
  </div>
);

const FeaturedPosts = () => (
  <div className="content-section">
    <h3>Bài viết nổi bật</h3>
    <p>Chưa có dữ liệu bài viết nổi bật.</p>
  </div>
);

// Quản lý đơn hàng
const Orders = () => (
  <div className="content-section">
    <h3>Danh sách đơn hàng</h3>
    <p>Chưa có dữ liệu đơn hàng.</p>
  </div>
);

const RepairOrders = () => (
  <div className="content-section">
    <h3>Đơn hàng thuê người sửa chữa</h3>
    <p>Chưa có dữ liệu đơn hàng thuê người sửa chữa.</p>
  </div>
);

const PendingOrders = () => (
  <div className="content-section">
    <h3>Đơn hàng đang xử lý</h3>
    <p>Chưa có dữ liệu đơn hàng đang xử lý.</p>
  </div>
);

const CompletedOrders = () => (
  <div className="content-section">
    <h3>Đơn hàng hoàn thành</h3>
    <p>Chưa có dữ liệu đơn hàng hoàn thành.</p>
  </div>
);

const CancelledOrders = () => (
  <div className="content-section">
    <h3>Đơn hàng bị hủy</h3>
    <p>Chưa có dữ liệu đơn hàng bị hủy.</p>
  </div>
);

// Quản lý người dùng
const Customers = ({ users }) => (
  <GetAllUserDashBoard />
);

const Technicians = ({ users }) => (
  <div className="content-section">
    <h3>Danh sách thợ</h3>
    <p>Tổng thợ: {users.filter((u) => u.role === 'technician').length}</p>
    {users.filter((u) => u.role === 'technician').length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((u) => u.role === 'technician')
            .map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email}</td>
                <td>
                  <span className={user.status === 'active' ? 'status-active' : 'status-inactive'}>
                    {user.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    ) : (
      <p>Không có thợ nào.</p>
    )}
  </div>
);

const Agents = ({ users }) => (
  <div className="content-section">
    <h3>Danh sách đại lý</h3>
    <p>Tổng đại lý: {users.filter((u) => u.role === 'agent').length}</p>
    {users.filter((u) => u.role === 'agent').length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((u) => u.role === 'agent')
            .map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email}</td>
                <td>
                  <span className={user.status === 'active' ? 'status-active' : 'status-inactive'}>
                    {user.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    ) : (
      <p>Không có đại lý nào.</p>
    )}
  </div>
);

const PotentialCustomers = () => (
  <div className="content-section">
    <h3>Khách hàng tiềm năng</h3>
    <p>Chưa có dữ liệu khách hàng tiềm năng.</p>
  </div>
);

// Thống kê và báo cáo
const RevenueStats = () => (
  <div className="content-section">
    <h3>Thống kê doanh thu</h3>
    <p>Chưa có dữ liệu thống kê doanh thu.</p>
  </div>
);

const OrderStats = () => (
  <div className="content-section">
    <h3>Thống kê đơn hàng</h3>
    <p>Chưa có dữ liệu thống kê đơn hàng.</p>
  </div>
);

const UserStats = () => (
  <div className="content-section">
    <h3>Thống kê người dùng</h3>
    <p>Chưa có dữ liệu thống kê người dùng.</p>
  </div>
);

const TechnicianPerformance = () => (
  <div className="content-section">
    <h3>Báo cáo hiệu suất thợ</h3>
    <p>Chưa có dữ liệu báo cáo hiệu suất thợ.</p>
  </div>
);

// Quản lý giao dịch
const Transactions = () => (
  <div className="content-section">
    <h3>Lịch sử giao dịch</h3>
    <p>Chưa có dữ liệu lịch sử giao dịch.</p>
  </div>
);

const UnpaidTransactions = () => (
  <div className="content-section">
    <h3>Giao dịch chưa thanh toán</h3>
    <p>Chưa có dữ liệu giao dịch chưa thanh toán.</p>
  </div>
);

const Refunds = () => (
  <div className="content-section">
    <h3>Hoàn tiền</h3>
    <p>Chưa có dữ liệu hoàn tiền.</p>
  </div>
);

// Cài đặt
const SystemConfig = () => (
  <div className="content-section">
    <h3>Cấu hình hệ thống</h3>
    <p>Chưa có dữ liệu cấu hình hệ thống.</p>
  </div>
);

const Notifications = () => (
  <div className="content-section">
    <h3>Quản lý thông báo</h3>
    <p>Chưa có dữ liệu thông báo.</p>
  </div>
);

const AccountSettings = () => (
  <div className="content-section">
    <h3>Cài đặt tài khoản</h3>
    <p>Chưa có dữ liệu cài đặt tài khoản.</p>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Người dùng' };
  const token = localStorage.getItem('token'); //  [THÊM] Lấy token từ localStorage
  const role = localStorage.getItem('role'); //  [THÊM] Lấy role từ localStorage
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({
    'quan-ly-tai-khoan': true,
    'quan-ly-san-pham-dich-vu': true,
    'quan-ly-bai-viet': true,
    'quan-ly-don-hang': false,
    'quan-ly-nguoi-dung': false,
    'thong-ke-va-bao-cao': false,
    'quan-ly-giao-dich': false,
    'cai-dat': false,
  });
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    newUsers: [],
    completedOrders: [],
    totalRevenue: 0,
    totalOrders: 0,
    completionRate: 0,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  //  [SỬA] Kiểm tra quyền truy cập
  useEffect(() => {
    const allowedRoles = ['admin', 'manager', 'content_writer', 'agent', 'technician'];
    if (!token || !allowedRoles.includes(role)) {
      alert('Access denied. Only authorized roles can access the Dashboard.');
      localStorage.removeItem('token'); // Xóa token để tránh vòng lặp
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      navigate('/admin-login', { replace: true }); // Sử dụng replace để tránh vòng lặp
      return;
    }
  }, [token, role, navigate]); //  [SỬA] Thêm token và role vào dependency array

  //  [SỬA] Tách logic fetch dữ liệu để tránh vòng lặp
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await getAllUsers();
        setUsers(response.data.users || []);
      } catch (err) {
        setError('Failed to fetch users: ' + (err.message || 'Không xác định'));
      } finally {
        setIsLoading(false);
      }
    };

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await getStats();
        setStats({
          newUsers: response.data.newUsers || [],
          completedOrders: response.data.completedOrders || [],
          totalRevenue: response.data.totalRevenue || 0,
          totalOrders: response.data.totalOrders || 0,
          completionRate: response.data.completionRate || 0,
        });
      } catch (err) {
        setError((prev) => prev + '\nFailed to fetch stats: ' + (err.message || 'Không xác định'));
      } finally {
        setIsLoading(false);
      }
    };

    // Chỉ fetch dữ liệu nếu đã qua kiểm tra quyền
    if (token && role && ['admin', 'manager', 'content_writer', 'agent', 'technician'].includes(role)) {
      fetchUsers();
      fetchStats();
    }
  }, [token, role]); //  [SỬA] Thêm token và role vào dependency array

  const chartData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Người dùng mới',
        data: stats.newUsers.length > 0 ? stats.newUsers : [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: '#ff4500',
        tension: 0.1,
      },
      {
        label: 'Đơn hàng hoàn thành',
        data: stats.completedOrders.length > 0 ? stats.completedOrders : [28, 48, 40, 19, 86, 27],
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
    localStorage.removeItem('role');
    navigate('/admin-login');
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await deleteUser(userId);
        if (response.data.success) {
          setUsers(users.filter((user) => user._id !== userId));
          alert('User deleted successfully.');
        } else {
          setError('Failed to delete user: ' + (response.data.message || 'Không xác định'));
        }
      } catch (err) {
        setError('Failed to delete user: ' + (err.message || 'Không xác định'));
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  //  [THÊM] Hàm kiểm tra quyền truy cập menu dựa trên vai trò
  const canViewMenu = (menu) => {
    if (role === 'admin') return true; // Admin thấy tất cả

    const menuPermissions = {
      'dashboard': ['admin', 'manager', 'content_writer', 'agent', 'technician'],
      'quan-ly-tai-khoan': ['admin'],
      'quan-ly-san-pham-dich-vu': ['admin'],
      'quan-ly-bai-viet': ['admin', 'content_writer'],
      'quan-ly-don-hang': ['admin', 'manager', 'agent', 'technician'],
      'quan-ly-nguoi-dung': ['admin', 'manager'],
      'thong-ke-va-bao-cao': ['admin', 'manager'],
      'quan-ly-giao-dich': ['admin'],
      'cai-dat': ['admin', 'manager', 'content_writer', 'agent', 'technician'],
    };

    return menuPermissions[menu]?.includes(role) || false;
  };

  //  [THÊM] Hàm kiểm tra quyền truy cập submenu dựa trên vai trò
  const canViewSubmenu = (submenu) => {
    if (role === 'admin') return true; // Admin thấy tất cả

    const submenuPermissions = {
      'accounts': ['admin'],
      'roles': ['admin'],
      'locked-accounts': ['admin'],
      'products': ['admin'],
      'product-categories': ['admin'],
      'promotions': ['admin'],
      'posts': ['admin', 'content_writer'],
      'post-categories': ['admin', 'content_writer'],
      'featured-posts': ['admin', 'content_writer'],
      'orders': ['admin', 'manager', 'agent', 'technician'],
      'repair-orders': ['admin', 'manager', 'agent', 'technician'],
      'pending-orders': ['admin', 'manager', 'agent', 'technician'],
      'completed-orders': ['admin', 'manager', 'agent', 'technician'],
      'cancelled-orders': ['admin', 'manager', 'agent', 'technician'],
      'customers': ['admin', 'manager'],
      'technicians': ['admin', 'manager'],
      'agents': ['admin', 'manager'],
      'potential-customers': ['admin', 'manager'],
      'revenue-stats': ['admin', 'manager'],
      'order-stats': ['admin', 'manager'],
      'user-stats': ['admin', 'manager'],
      'technician-performance': ['admin', 'manager'],
      'transactions': ['admin'],
      'unpaid-transactions': ['admin'],
      'refunds': ['admin'],
      'system-config': ['admin', 'manager', 'content_writer', 'agent', 'technician'],
      'notifications': ['admin', 'manager', 'content_writer', 'agent', 'technician'],
      'account-settings': ['admin', 'manager', 'content_writer', 'agent', 'technician'],
    };

    return submenuPermissions[submenu]?.includes(role) || false;
  };

  // Hàm render nội dung dựa trên activeMenu
  const renderContent = () => {
    //  [SỬA] Kiểm tra quyền truy cập trước khi render nội dung
    if (!canViewSubmenu(activeMenu)) {
      return <div className="content-section"><h3>Access Denied</h3><p>Bạn không có quyền truy cập mục này.</p></div>;
    }

    switch (activeMenu) {
      case 'dashboard':
        return (
          <DashboardContent
            users={users}
            stats={stats}
            chartData={chartData}
            chartOptions={chartOptions}
            navigate={navigate}
            handleDeleteUser={handleDeleteUser}
          />
        );
      // Quản lý tài khoản
      case 'accounts':
        return <Accounts users={users} />;
      case 'roles':
        return <Roles />;
      case 'locked-accounts':
        return <LockedAccounts users={users} />;
      // Quản lý sản phẩm/dịch vụ
      case 'products':
        return <Products />;
      case 'product-categories':
        return <ProductCategories />;
      case 'promotions':
        return <Promotions />;
      // Quản lý bài viết
      case 'posts':
        return <Posts />;
      case 'post-categories':
        return <PostCategories />;
      case 'featured-posts':
        return <FeaturedPosts />;
      // Quản lý đơn hàng
      case 'orders':
        return <Orders />;
      case 'repair-orders':
        return <RepairOrders />;
      case 'pending-orders':
        return <PendingOrders />;
      case 'completed-orders':
        return <CompletedOrders />;
      case 'cancelled-orders':
        return <CancelledOrders />;
      // Quản lý người dùng
      case 'customers':
        return <Customers users={users} />;
      case 'technicians':
        return <Technicians users={users} />;
      case 'agents':
        return <Agents users={users} />;
      case 'potential-customers':
        return <PotentialCustomers />;
      // Thống kê và báo cáo
      case 'revenue-stats':
        return <RevenueStats />;
      case 'order-stats':
        return <OrderStats />;
      case 'user-stats':
        return <UserStats />;
      case 'technician-performance':
        return <TechnicianPerformance />;
      // Quản lý giao dịch
      case 'transactions':
        return <Transactions />;
      case 'unpaid-transactions':
        return <UnpaidTransactions />;
      case 'refunds':
        return <Refunds />;
      // Cài đặt
      case 'system-config':
        return <SystemConfig />;
      case 'notifications':
        return <Notifications />;
      case 'account-settings':
        return <AccountSettings />;
      default:
        return (
          <DashboardContent
            users={users}
            stats={stats}
            chartData={chartData}
            chartOptions={chartOptions}
            navigate={navigate}
            handleDeleteUser={handleDeleteUser}
          />
        );
    }
  };
  return (
     
      <div className="dashboard-wrapper">
        <button className="toggle-sidebar" onClick={toggleSidebar}>
          {isSidebarOpen ? 'Ẩn Menu' : 'Hiện Menu'}
        </button>
    
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>PUTINKA</h2>
          </div>
          <ul className="sidebar-menu">
            {/*  [SỬA] Thêm kiểm tra quyền truy cập cho menu Dashboard */}
            {canViewMenu('dashboard') && (
              <li
                className={activeMenu === 'dashboard' ? 'active' : ''}
                onClick={() => handleMenuClick('dashboard')}
              >
                <span>
                  <FaTachometerAlt className="menu-icon" />
                  Dashboard
                </span>
              </li>
            )}
    
            {/*  [SỬA] Thêm kiểm tra quyền truy cập cho menu Quản lý tài khoản */}
            {canViewMenu('quan-ly-tai-khoan') && (
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
                  {canViewSubmenu('accounts') && (
                    <li
                      className={activeMenu === 'accounts' ? 'active' : ''}
                      onClick={() => handleMenuClick('accounts')}
                    >
                      <span>
                        <FaUsers className="submenu-icon" />
                        <span>Danh sách tài khoản</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('roles') && (
                    <li
                      className={activeMenu === 'roles' ? 'active' : ''}
                      onClick={() => handleMenuClick('roles')}
                    >
                      <span>
                        <FaUserCheck className="submenu-icon" />
                        <span>Quản lý vai trò</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('locked-accounts') && (
                    <li
                      className={activeMenu === 'locked-accounts' ? 'active' : ''}
                      onClick={() => handleMenuClick('locked-accounts')}
                    >
                      <span>
                        <FaLock className="submenu-icon" />
                        <span>Tài khoản bị khóa</span>
                      </span>
                    </li>
                  )}
                </ul>
              </li>
            )}
    
            {/*  [SỬA] Thêm kiểm tra quyền truy cập cho menu Sản phẩm - Dịch vụ */}
            {canViewMenu('quan-ly-san-pham-dich-vu') && (
              <li className="menu-group">
                <span
                  className="menu-group-title"
                  onClick={() => toggleGroup('quan-ly-san-pham-dich-vu')}
                  style={{ cursor: 'pointer' }}
                >
                  Sản phẩm - Dịch vụ
                  <FaChevronDown
                    className="toggle-icon"
                    style={{
                      transform: openGroups['quan-ly-san-pham-dich-vu'] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                    }}
                  />
                </span>
                <ul className={`submenu ${openGroups['quan-ly-san-pham-dich-vu'] ? 'open' : ''}`}>
                  {canViewSubmenu('products') && (
                    <li
                      className={activeMenu === 'products' ? 'active' : ''}
                      onClick={() => handleMenuClick('products')}
                    >
                      <span>
                        <FaBox className="submenu-icon" />
                        <span>Danh sách sản phẩm/dịch vụ</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('product-categories') && (
                    <li
                      className={activeMenu === 'product-categories' ? 'active' : ''}
                      onClick={() => handleMenuClick('product-categories')}
                    >
                      <span>
                        <FaTags className="submenu-icon" />
                        <span>Danh mục sản phẩm/dịch vụ</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('promotions') && (
                    <li
                      className={activeMenu === 'promotions' ? 'active' : ''}
                      onClick={() => handleMenuClick('promotions')}
                    >
                      <span>
                        <FaTags className="submenu-icon" />
                        <span>Khuyến mãi</span>
                      </span>
                    </li>
                  )}
                </ul>
              </li>
            )}
    
            {/*  [SỬA] Thêm kiểm tra quyền truy cập cho menu Quản lý bài viết */}
            {canViewMenu('quan-ly-bai-viet') && (
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
                  {canViewSubmenu('posts') && (
                    <li
                      className={activeMenu === 'posts' ? 'active' : ''}
                      onClick={() => handleMenuClick('posts')}
                    >
                      <span>
                        <FaFileAlt className="submenu-icon" />
                        <span>Danh sách bài viết</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('post-categories') && (
                    <li
                      className={activeMenu === 'post-categories' ? 'active' : ''}
                      onClick={() => handleMenuClick('post-categories')}
                    >
                      <span>
                        <FaTags className="submenu-icon" />
                        <span>Danh mục bài viết</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('featured-posts') && (
                    <li
                      className={activeMenu === 'featured-posts' ? 'active' : ''}
                      onClick={() => handleMenuClick('featured-posts')}
                    >
                      <span>
                        <FaFileAlt className="submenu-icon" />
                        <span>Bài viết nổi bật</span>
                      </span>
                    </li>
                  )}
                </ul>
              </li>
            )}
    
            {/*  [SỬA] Thêm kiểm tra quyền truy cập cho menu Quản lý đơn hàng */}
            {canViewMenu('quan-ly-don-hang') && (
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
                  {canViewSubmenu('orders') && (
                    <li
                      className={activeMenu === 'orders' ? 'active' : ''}
                      onClick={() => handleMenuClick('orders')}
                    >
                      <span>
                        <FaShoppingCart className="submenu-icon" />
                        <span>Danh sách đơn hàng</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('repair-orders') && (
                    <li
                      className={activeMenu === 'repair-orders' ? 'active' : ''}
                      onClick={() => handleMenuClick('repair-orders')}
                    >
                      <span>
                        <FaTools className="submenu-icon" />
                        <span>Đơn hàng thuê người sửa chữa</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('pending-orders') && (
                    <li
                      className={activeMenu === 'pending-orders' ? 'active' : ''}
                      onClick={() => handleMenuClick('pending-orders')}
                    >
                      <span>
                        <FaShoppingCart className="submenu-icon" />
                        <span>Đơn hàng đang xử lý</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('completed-orders') && (
                    <li
                      className={activeMenu === 'completed-orders' ? 'active' : ''}
                      onClick={() => handleMenuClick('completed-orders')}
                    >
                      <span>
                        <FaShoppingCart className="submenu-icon" />
                        <span>Đơn hàng hoàn thành</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('cancelled-orders') && (
                    <li
                      className={activeMenu === 'cancelled-orders' ? 'active' : ''}
                      onClick={() => handleMenuClick('cancelled-orders')}
                    >
                      <span>
                        <FaShoppingCart className="submenu-icon" />
                        <span>Đơn hàng bị hủy</span>
                      </span>
                    </li>
                  )}
                </ul>
              </li>
            )}
    
            {/*  [SỬA] Thêm kiểm tra quyền truy cập cho menu Quản lý người dùng */}
            {canViewMenu('quan-ly-nguoi-dung') && (
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
                  {canViewSubmenu('customers') && (
                    <li
                      className={activeMenu === 'customers' ? 'active' : ''}
                      onClick={() => handleMenuClick('customers')}
                    >
                      <span>
                        <FaUserFriends className="submenu-icon" />
                        <span>Danh sách khách hàng</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('technicians') && (
                    <li
                      className={activeMenu === 'technicians' ? 'active' : ''}
                      onClick={() => handleMenuClick('technicians')}
                    >
                      <span>
                        <FaTools className="submenu-icon" />
                        <span>Danh sách thợ</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('agents') && (
                    <li
                      className={activeMenu === 'agents' ? 'active' : ''}
                      onClick={() => handleMenuClick('agents')}
                    >
                      <span>
                        <FaUserFriends className="submenu-icon" />
                        <span>Danh sách đại lý</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('potential-customers') && (
                    <li
                      className={activeMenu === 'potential-customers' ? 'active' : ''}
                      onClick={() => handleMenuClick('potential-customers')}
                    >
                      <span>
                        <FaUserFriends className="submenu-icon" />
                        <span>Khách hàng tiềm năng</span>
                      </span>
                    </li>
                  )}
                </ul>
              </li>
            )}
    
            {/*  [SỬA] Thêm kiểm tra quyền truy cập cho menu Thống kê và báo cáo */}
            {canViewMenu('thong-ke-va-bao-cao') && (
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
                  {canViewSubmenu('revenue-stats') && (
                    <li
                      className={activeMenu === 'revenue-stats' ? 'active' : ''}
                      onClick={() => handleMenuClick('revenue-stats')}
                    >
                      <span>
                        <FaChartLine className="submenu-icon" />
                        <span>Thống kê doanh thu</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('order-stats') && (
                    <li
                      className={activeMenu === 'order-stats' ? 'active' : ''}
                      onClick={() => handleMenuClick('order-stats')}
                    >
                      <span>
                        <FaChartBar className="submenu-icon" />
                        <span>Thống kê đơn hàng</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('user-stats') && (
                    <li
                      className={activeMenu === 'user-stats' ? 'active' : ''}
                      onClick={() => handleMenuClick('user-stats')}
                    >
                      <span>
                        <FaChartBar className="submenu-icon" />
                        <span>Thống kê người dùng</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('technician-performance') && (
                    <li
                      className={activeMenu === 'technician-performance' ? 'active' : ''}
                      onClick={() => handleMenuClick('technician-performance')}
                    >
                      <span>
                        <FaChartLine className="submenu-icon" />
                        <span>Báo cáo hiệu suất thợ</span>
                      </span>
                    </li>
                  )}
                </ul>
              </li>
            )}
    
            {/*  [SỬA] Thêm kiểm tra quyền truy cập cho menu Quản lý giao dịch */}
            {canViewMenu('quan-ly-giao-dich') && (
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
                  {canViewSubmenu('transactions') && (
                    <li
                      className={activeMenu === 'transactions' ? 'active' : ''}
                      onClick={() => handleMenuClick('transactions')}
                    >
                      <span>
                        <FaMoneyBillWave className="submenu-icon" />
                        <span>Lịch sử giao dịch</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('unpaid-transactions') && (
                    <li
                      className={activeMenu === 'unpaid-transactions' ? 'active' : ''}
                      onClick={() => handleMenuClick('unpaid-transactions')}
                    >
                      <span>
                        <FaCreditCard className="submenu-icon" />
                        <span>Giao dịch chưa thanh toán</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('refunds') && (
                    <li
                      className={activeMenu === 'refunds' ? 'active' : ''}
                      onClick={() => handleMenuClick('refunds')}
                    >
                      <span>
                        <FaMoneyBillWave className="submenu-icon" />
                        <span>Hoàn tiền</span>
                      </span>
                    </li>
                  )}
                </ul>
              </li>
            )}
    
            {/*  [SỬA] Thêm kiểm tra quyền truy cập cho menu Cài đặt */}
            {canViewMenu('cai-dat') && (
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
                  {canViewSubmenu('system-config') && (
                    <li
                      className={activeMenu === 'system-config' ? 'active' : ''}
                      onClick={() => handleMenuClick('system-config')}
                    >
                      <span>
                        <FaCog className="submenu-icon" />
                        <span>Cấu hình hệ thống</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('notifications') && (
                    <li
                      className={activeMenu === 'notifications' ? 'active' : ''}
                      onClick={() => handleMenuClick('notifications')}
                    >
                      <span>
                        <FaBell className="submenu-icon" />
                        <span>Quản lý thông báo</span>
                      </span>
                    </li>
                  )}
                  {canViewSubmenu('account-settings') && (
                    <li
                      className={activeMenu === 'account-settings' ? 'active' : ''}
                      onClick={() => handleMenuClick('account-settings')}
                    >
                      <span>
                        <FaCog className="submenu-icon" />
                        <span>Cài đặt tài khoản</span>
                      </span>
                    </li>
                  )}
                </ul>
              </li>
            )}
    
            <li onClick={handleLogout}>
              <span>
                <FaSignOutAlt className="menu-icon" />
                Đăng xuất
              </span>
            </li>
          </ul>
        </div>
    
        <div className="main-content">
          <div className="header">
            <h2>Dashboard</h2>
            <div className="user-info">
              <span>Xin chào, {user.name}</span>
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          {isLoading ? <p>Đang tải...</p> : renderContent()}
        </div>
      </div>
    
  );
};

export default Dashboard;
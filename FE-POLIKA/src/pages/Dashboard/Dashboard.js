import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import useAuth from '../Dashboard/hooks/useAuth';
import useDashboardData from '../Dashboard/hooks/useDashboardData';
import useChartData from '../Dashboard/hooks/useChartData';
import {
  DashboardContent,
  Sidebar,
  Header,
  Accounts,
  Roles,
  LockedAccounts,
  Orders,
  RepairOrders,
  PendingOrders,
  CompletedOrders,
  CancelledOrders,
  Customers,
  Technicians,
  Agents,
  PotentialCustomers,
  RevenueStats,
  OrderStats,
  UserStats,
  TechnicianPerformance,
  Transactions,
  UnpaidTransactions,
  Refunds,
  SystemConfig,
  Notifications,
  AccountSettings,
  Service,
  ServiceCategories,
  Promotions,
  Posts,
  PostCategories,
  FeaturedPosts,
} from '../Dashboard';
import ErrorBoundary from '../Dashboard/ErrorBoundary';
import './Dashboard.css';







ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Người dùng' };
  const { token, role, canViewMenu, canViewSubmenu } = useAuth();

  // Kiểm tra token và role
  const allowedRoles = ['admin', 'manager', 'content_writer', 'agent', 'technician'];
  const isAuthenticated = token && role && allowedRoles.includes(role);

  // Gọi useDashboardData vô điều kiện
  const { users, setUsers, stats, error, setError, isLoading, handleDeleteUser } = useDashboardData(
    isAuthenticated ? token : null,
    isAuthenticated ? role : null
  );

  // Gọi useChartData vô điều kiện
  const { chartData, chartOptions } = useChartData(stats);

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

  // Theo dõi lỗi từ useDashboardData và điều hướng nếu cần
  useEffect(() => {
    if (error && error.includes('Phiên đăng nhập đã hết hạn')) {
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      navigate('/admin-login', { replace: true });
    }
  }, [error, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/admin-login');
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
  console.log('Active Menu:', activeMenu);
  const renderContent = () => {
    if (!canViewSubmenu(activeMenu)) {
      return <div className="content-section"><h3>Access Denied</h3><p>Bạn không có quyền truy cập mục này.</p></div>;
    }

    switch (activeMenu) {
      case 'dashboard':
        return (
          <ErrorBoundary>
            {Array.isArray(users) ? (
              <DashboardContent
                users={users}
                stats={stats}
                chartData={chartData}
                chartOptions={chartOptions}
                navigate={navigate}
                handleDeleteUser={handleDeleteUser}
              />
            ) : (
              <div className="content-section"><p>Lỗi: Dữ liệu người dùng không hợp lệ.</p></div>
            )}
          </ErrorBoundary>
        );
      case 'accounts':
        return Array.isArray(users) ? (
          <Accounts users={users} />
        ) : (
          <div className="content-section"><p>Lỗi: Dữ liệu người dùng không hợp lệ.</p></div>
        );
      case 'roles':
        return <Roles />;
      case 'locked-accounts':
        return Array.isArray(users) ? (
          <LockedAccounts users={users} />
        ) : (
          <div className="content-section"><p>Lỗi: Dữ liệu người dùng không hợp lệ.</p></div>
        );
      case 'Service':
        return <Service />;
      case 'service-categories':
        return <ServiceCategories />;
      case 'promotions':
        return <Promotions />;
      case 'posts':
        return <Posts />;
      case 'post-categories':
        return <PostCategories />;
      case 'featured-posts':
        return <FeaturedPosts />;
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
      case 'customers':
        return <Customers />;
      case 'technicians':
        return Array.isArray(users) ? (
          <Technicians users={users} />
        ) : (
          <div className="content-section"><p>Lỗi: Dữ liệu người dùng không hợp lệ.</p></div>
        );
      case 'agents':
        return Array.isArray(users) ? (
          <Agents users={users} />
        ) : (
          <div className="content-section"><p>Lỗi: Dữ liệu người dùng không hợp lệ.</p></div>
        );
      case 'potential-customers':
        return <PotentialCustomers />;
      case 'revenue-stats':
        return <RevenueStats />;
      case 'order-stats':
        return <OrderStats />;
      case 'user-stats':
        return <UserStats />;
      case 'technician-performance':
        return <TechnicianPerformance />;
      case 'transactions':
        return <Transactions />;
      case 'unpaid-transactions':
        return <UnpaidTransactions />;
      case 'refunds':
        return <Refunds />;
      case 'system-config':
        return <SystemConfig />;
      case 'notifications':
        return <Notifications />;
      case 'account-settings':
        return <AccountSettings />;
      default:
        return (
          <ErrorBoundary>
            {Array.isArray(users) ? (
              <DashboardContent
                users={users}
                stats={stats}
                chartData={chartData}
                chartOptions={chartOptions}
                navigate={navigate}
                handleDeleteUser={handleDeleteUser}
              />
            ) : (
              <div className="content-section"><p>Lỗi: Dữ liệu người dùng không hợp lệ.</p></div>
            )}
          </ErrorBoundary>
        );
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar
        activeMenu={activeMenu}
        handleMenuClick={handleMenuClick}
        handleLogout={handleLogout}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        openGroups={openGroups}
        toggleGroup={toggleGroup}
        canViewMenu={canViewMenu}
        canViewSubmenu={canViewSubmenu}
      />
      <div className="main-content">
        <Header user={user} handleLogout={handleLogout} />
        {error && <p className="error">{error}</p>}
        {isLoading ? <p>Đang tải...</p> : renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
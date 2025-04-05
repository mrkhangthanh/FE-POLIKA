import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const allowedRoles = ['admin', 'manager', 'content_writer', 'agent', 'technician'];

    // Kiểm tra token và role
    if (!token || !role) {
      // Nếu không có token hoặc role, điều hướng về login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      navigate('/admin-login', { replace: true });
      return;
    }

    // Kiểm tra vai trò
    if (!allowedRoles.includes(role)) {
      alert('Access denied. Only authorized roles can access the Dashboard.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      navigate('/admin-login', { replace: true });
    }
  }, [token, role, navigate]);

  const canViewMenu = (menu) => {
    if (role === 'admin') return true;
    const menuPermissions = {
      dashboard: ['admin', 'manager', 'content_writer', 'agent', 'technician'],
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

  const canViewSubmenu = (submenu) => {
    if (role === 'admin') return true;
    const submenuPermissions = {
      accounts: ['admin'],
      roles: ['admin'],
      'locked-accounts': ['admin'],
      products: ['admin'],
      'product-categories': ['admin'],
      promotions: ['admin'],
      posts: ['admin', 'content_writer'],
      'post-categories': ['admin', 'content_writer'],
      'featured-posts': ['admin', 'content_writer'],
      orders: ['admin', 'manager', 'agent', 'technician'],
      'repair-orders': ['admin', 'manager', 'agent', 'technician'],
      'pending-orders': ['admin', 'manager', 'agent', 'technician'],
      'completed-orders': ['admin', 'manager', 'agent', 'technician'],
      'cancelled-orders': ['admin', 'manager', 'agent', 'technician'],
      customers: ['admin', 'manager'],
      technicians: ['admin', 'manager'],
      agents: ['admin', 'manager'],
      'potential-customers': ['admin', 'manager'],
      'revenue-stats': ['admin', 'manager'],
      'order-stats': ['admin', 'manager'],
      'user-stats': ['admin', 'manager'],
      'technician-performance': ['admin', 'manager'],
      transactions: ['admin'],
      'unpaid-transactions': ['admin'],
      refunds: ['admin'],
      'system-config': ['admin', 'manager', 'content_writer', 'agent', 'technician'],
      notifications: ['admin', 'manager', 'content_writer', 'agent', 'technician'],
      'account-settings': ['admin', 'manager', 'content_writer', 'agent', 'technician'],
    };
    return submenuPermissions[submenu]?.includes(role) || false;
  };

  return { token, role, canViewMenu, canViewSubmenu };
};

export default useAuth;
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
  
  const Sidebar = ({
    activeMenu,
    handleMenuClick,
    handleLogout,
    isSidebarOpen,
    toggleSidebar,
    openGroups,
    toggleGroup,
    canViewMenu,
    canViewSubmenu,
  }) => (
    <>
      <button className="toggle-sidebar" onClick={toggleSidebar}>
        {isSidebarOpen ? 'Ẩn Menu' : 'Hiện Menu'}
      </button>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>PUTINKA</h2>
        </div>
        <ul className="sidebar-menu">
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
                {canViewSubmenu('Service') && (
                  <li
                    className={activeMenu === 'Service' ? 'active' : ''}
                    onClick={() => handleMenuClick('Service')}
                  >
                    <span>
                      <FaBox className="submenu-icon" />
                      <span>Danh sách sản phẩm/dịch vụ</span>
                    </span>
                  </li>
                )}
                {canViewSubmenu('service-categories') && (
                  <li
                    className={activeMenu === 'service-categories' ? 'active' : ''}
                    onClick={() => handleMenuClick('service-categories')}
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
    </>
  );
  
  export default Sidebar;
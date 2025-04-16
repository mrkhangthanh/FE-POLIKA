import { Line } from 'react-chartjs-2';

const DashboardContent = ({ users, stats, chartData, chartOptions, navigate, handleDeleteUser }) => {
  // Kiểm tra các props
  if (!Array.isArray(users)) {
    console.error('users is not an array:', users);
    return <div className="content-section"><p>Lỗi: Dữ liệu người dùng không hợp lệ.</p></div>;
  }

  if (!stats || typeof stats !== 'object') {
    console.error('stats is invalid:', stats);
    return <div className="content-section"><p>Lỗi: Dữ liệu thống kê không hợp lệ.</p></div>;
  }

  if (typeof navigate !== 'function') {
    console.error('navigate is not a function:', navigate);
    return <div className="content-section"><p>Lỗi: Chức năng điều hướng không hợp lệ.</p></div>;
  }

  if (typeof handleDeleteUser !== 'function') {
    console.error('handleDeleteUser is not a function:', handleDeleteUser);
    return <div className="content-section"><p>Lỗi: Chức năng xóa người dùng không hợp lệ.</p></div>;
  }

  return (
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
          <p>{typeof stats.totalRevenue === 'number' ? stats.totalRevenue.toLocaleString('vi-VN') : 0} VND</p>
        </div>
      </div>
      <div className="charts">
        <div className="chart-box">
          {chartData && chartOptions ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <p>Đang tải biểu đồ...</p>
          )}
        </div>
        <div className="satisfaction-box">
          <h3>Tỷ lệ hoàn thành đơn hàng</h3>
          <p>{typeof stats.completionRate === 'number' ? stats.completionRate : 0}%</p>
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
          <p>{typeof stats.totalOrders === 'number' ? stats.totalOrders.toLocaleString('vi-VN') : 0}</p>
        </div>
        <div className="stat-box">
          <h3>Doanh thu</h3>
          <p>{typeof stats.totalRevenue === 'number' ? stats.totalRevenue.toLocaleString('vi-VN') : 0} VND</p>
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
};

export default DashboardContent;
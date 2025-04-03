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
  
  export default Technicians;
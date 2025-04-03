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
  
  export default Accounts;
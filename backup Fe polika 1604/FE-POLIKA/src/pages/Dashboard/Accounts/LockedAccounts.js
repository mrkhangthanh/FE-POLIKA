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
  
  export default LockedAccounts;
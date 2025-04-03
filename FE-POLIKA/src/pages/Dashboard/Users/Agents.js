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
  
  export default Agents;
const Header = ({ user, handleLogout }) => (
    <div className="header">
      <h2>Dashboard</h2>
      <div className="user-info">
        <span>Xin chào, {user.name}</span>
        <button onClick={handleLogout}>Đăng xuất</button>
      </div>
    </div>
  );
  
  export default Header;
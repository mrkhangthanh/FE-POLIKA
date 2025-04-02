import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

import './Dashboard.css';
import './getAllUser/getAllUser.css';

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
export default DashboardContent;
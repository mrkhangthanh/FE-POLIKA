// src/apps/auth/controllers/statsController.js
const User = require('../../auth/models/user');
const Order = require('../../order/models/order'); // Giả sử bạn có model Order

exports.getStats = async (req, res) => {
  try {
    // Thống kê người dùng mới (theo tháng)
    const newUsers = await User.aggregate([
      {
        $group: {
          _id: { $month: '$created_at' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    // Thống kê đơn hàng hoàn thành (theo tháng)
    const completedOrders = await Order.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: { $month: '$created_at' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    // Chuẩn hóa dữ liệu cho 6 tháng gần nhất
    const months = [1, 2, 3, 4, 5, 6];
    const newUsersData = months.map((month) => {
      const found = newUsers.find((item) => item._id === month);
      return found ? found.count : 0;
    });
    const completedOrdersData = months.map((month) => {
      const found = completedOrders.find((item) => item._id === month);
      return found ? found.count : 0;
    });

    res.status(200).json({
      success: true,
      data: {
        newUsers: newUsersData,
        completedOrders: completedOrdersData,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Không thể lấy thống kê.', error: err.message });
  }
};
const UserModel = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');
const logger = require('../../../common/logger'); // Giả định bạn có logger (ví dụ: winston)

// Tạo tài khoản người dùng mới
exports.createUser = async (req, res) => {
  try {
    // 1. Kiểm tra lỗi validation từ middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
      // Note: Trả về lỗi 400 nếu dữ liệu đầu vào không hợp lệ (được kiểm tra bởi express-validator trong route).
    }

    // 2. Kiểm tra quyền truy cập (chỉ admin được tạo tài khoản)
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Only admins can create users.' });
      // Note: Đảm bảo chỉ admin mới được tạo tài khoản mới (req.user từ authMiddleware).
    }

    // 3. Lấy dữ liệu từ body
    const { name, email, password, phone_number, role, reference_id, roleReferenceModel, referred_by } = req.body;

    // 4. Kiểm tra email và phone_number đã tồn tại chưa
    const existingUser = await UserModel.findOne({ $or: [{ email }, { phone_number }] }).lean();
    if (existingUser) {
      return res.status(400).json({ error: 'Email or phone number already exists.' });
      // Note: Tránh trùng lặp email hoặc số điện thoại (đã có index unique trong model, nhưng thêm kiểm tra để trả về thông báo thân thiện).
    }

    // 5. Tạo tài khoản mới
    const user = new UserModel({
      name,
      email,
      password, // Mật khẩu sẽ được mã hóa tự động bởi hook pre-save trong model
      phone_number,
      role,
      reference_id,
      roleReferenceModel,
      referred_by,
    });

    const savedUser = await user.save();

    // 6. Populate dữ liệu để trả về thông tin chi tiết
    const populatedUser = await UserModel.findById(savedUser._id)
      .populate('reference_id', 'name email phone_number') // Lấy thông tin tham chiếu (Customer/Technician)
      .populate('referred_by', 'name email phone_number') // Lấy thông tin người giới thiệu (nếu có)
      .lean(); // Tăng hiệu suất bằng cách trả về plain object

    // 7. Trả về kết quả
    res.status(201).json(populatedUser);
    logger.info(`User created successfully by admin ${req.user.id}`, { userId: savedUser._id });
    // Note: Trả về status 201 (Created) với thông tin tài khoản đầy đủ. Ghi log để theo dõi.

  } catch (err) {
    logger.error('Error creating user', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Internal server error', details: err.message });
    // Note: Trả về lỗi 500 với thông tin chi tiết, tránh lộ stack trace nhạy cảm.
  }
};

// Lấy danh sách tất cả người dùng (có phân trang)
exports.getAllUsers = async (req, res) => {
  try {
    // 1. Kiểm tra quyền truy cập (chỉ admin được xem danh sách)
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Only admins can view all users.' });
      // Note: Đảm bảo chỉ admin mới được xem danh sách người dùng.
    }

    // 2. Lấy tham số phân trang từ query (nếu có)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // Note: Hỗ trợ phân trang để tránh tải toàn bộ dữ liệu (ví dụ: page=1, limit=10).

    // 3. Đếm tổng số người dùng
    const totalUsers = await UserModel.countDocuments();
    // Note: Dùng để tính tổng số trang.

    // 4. Lấy danh sách người dùng với phân trang
    const users = await UserModel.find()
      .skip(skip) // Bỏ qua các bản ghi trước trang hiện tại
      .limit(limit) // Giới hạn số bản ghi trả về
      .populate('reference_id', 'name email phone_number') // Lấy thông tin tham chiếu
      .populate('referred_by', 'name email phone_number') // Lấy thông tin người giới thiệu
      .lean(); // Tăng hiệu suất

    // 5. Trả về kết quả
    res.status(200).json({
      users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
    logger.info(`Fetched all users by admin ${req.user.id}`, { page, limit });
    // Note: Trả về danh sách người dùng với thông tin phân trang.

  } catch (err) {
    logger.error('Error fetching users', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Internal server error', details: err.message });
    // Note: Trả về lỗi 500 nếu có lỗi server.
  }
};

// Lấy thông tin chi tiết một người dùng theo ID
exports.getUserById = async (req, res) => {
  try {
    // 1. Lấy thông tin người dùng
    const user = await UserModel.findById(req.params.id)
      .populate('reference_id', 'name email phone_number')
      .populate('referred_by', 'name email phone_number')
      .lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
      // Note: Trả về lỗi 404 nếu không tìm thấy người dùng.
    }

    // 2. Kiểm tra quyền: Chỉ admin hoặc chính người dùng đó được xem
    if (req.user.role !== 'admin' && req.user.id !== req.params.id.toString()) {
      return res.status(403).json({ error: 'Access denied. You can only view your own profile.' });
      // Note: Đảm bảo chỉ admin hoặc chính người dùng đó mới xem được thông tin.
    }

    // 3. Trả về kết quả
    res.status(200).json(user);
    logger.info(`Fetched user ${req.params.id} by ${req.user.id}`);
    // Note: Trả về thông tin chi tiết của người dùng.

  } catch (err) {
    logger.error('Error fetching user by ID', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Internal server error', details: err.message });
    // Note: Trả về lỗi 500 nếu có lỗi server.
  }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    // 1. Kiểm tra lỗi validation từ middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
      // Note: Trả về lỗi 400 nếu dữ liệu không hợp lệ.
    }

    const userId = req.params.id;

    // 2. Kiểm tra quyền: Chỉ admin hoặc chính người dùng đó được cập nhật
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Access denied. You can only update your own profile.' });
      // Note: Đảm bảo chỉ admin hoặc chính người dùng đó mới cập nhật được thông tin.
    }

    // 3. Kiểm tra người dùng tồn tại
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
      // Note: Trả về lỗi 404 nếu không tìm thấy người dùng.
    }

    // 4. Mã hóa mật khẩu nếu có cập nhật password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      // Note: Mã hóa mật khẩu mới trước khi lưu.
    }

    // 5. Cập nhật thông tin người dùng
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('reference_id', 'name email phone_number')
      .populate('referred_by', 'name email phone_number')
      .lean();

    // 6. Trả về kết quả
    res.status(200).json(updatedUser);
    logger.info(`User ${userId} updated by ${req.user.id}`, { updatedFields: Object.keys(req.body) });
    // Note: Trả về thông tin người dùng đã được cập nhật.

  } catch (err) {
    logger.error('Error updating user', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Internal server error', details: err.message });
    // Note: Trả về lỗi 500 nếu có lỗi server.
  }
};

// Xóa người dùng theo ID
exports.deleteUser = async (req, res) => {
  try {
    // 1. Kiểm tra quyền: Chỉ admin được xóa
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Only admins can delete users.' });
      // Note: Đảm bảo chỉ admin mới được xóa tài khoản.
    }

    // 2. Xóa người dùng
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
      // Note: Trả về lỗi 404 nếu không tìm thấy người dùng.
    }

    // 3. Trả về kết quả
    res.status(200).json({ message: 'User deleted successfully' });
    logger.info(`User ${req.params.id} deleted by admin ${req.user.id}`);
    // Note: Trả về thông báo xóa thành công.

  } catch (err) {
    logger.error('Error deleting user', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Internal server error', details: err.message });
    // Note: Trả về lỗi 500 nếu có lỗi server.
  }
};

// Đăng nhập người dùng và trả về JWT
exports.loginUser = async (req, res) => {
  try {
    // 1. Kiểm tra lỗi validation từ middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
      // Note: Trả về lỗi 400 nếu thiếu email hoặc password.
    }

    const { email, password } = req.body;

    // 2. Tìm người dùng theo email
    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
      // Note: Trả về lỗi 404 nếu không tìm thấy người dùng.
    }

    // 3. Kiểm tra trạng thái tài khoản
    if (user.status === 'inactive') {
      return res.status(403).json({ error: 'Account is inactive. Please contact admin.' });
      // Note: Không cho phép đăng nhập nếu tài khoản bị khóa.
    }

    // 4. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
      // Note: Trả về lỗi 400 nếu mật khẩu không khớp.
    }

    // 5. Cập nhật thời gian đăng nhập cuối cùng
    await UserModel.updateOne({ _id: user._id }, { last_login: new Date() });
    // Note: Ghi nhận thời gian đăng nhập để theo dõi hoạt động.

    // 6. Tạo JWT
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Payload: thông tin user
      config.get('app.jwtSecret'), // Secret key từ config
      { expiresIn: '1h' } // Token hết hạn sau 1 giờ
    );

    // 7. Trả về kết quả
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      last_login: user.last_login,
    };
    res.status(200).json({ message: 'Login successful', token, user: userResponse });
    logger.info(`User ${user.email} logged in successfully`, { userId: user._id });
    // Note: Trả về token và thông tin người dùng (không bao gồm mật khẩu).

  } catch (err) {
    logger.error('Error during login', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Internal server error', details: err.message });
    // Note: Trả về lỗi 500 nếu có lỗi server.
  }
};

// Đặt lại mật khẩu (yêu cầu mã OTP hoặc email xác nhận)
exports.resetPassword = async (req, res) => {
  try {
    // 1. Kiểm tra lỗi validation từ middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
      // Note: Trả về lỗi 400 nếu dữ liệu không hợp lệ.
    }

    const { email, newPassword, otp } = req.body;

    // 2. Tìm người dùng theo email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
      // Note: Trả về lỗi 404 nếu không tìm thấy người dùng.
    }

    // 3. Kiểm tra mã OTP (giả định bạn đã gửi OTP qua email hoặc SMS)
    // TODO: Thêm logic kiểm tra OTP (ví dụ: lưu OTP tạm thời trong database và so sánh)
    if (!otp) {
      return res.status(400).json({ error: 'OTP is required for password reset.' });
      // Note: Yêu cầu OTP để xác minh (cần tích hợp hệ thống gửi OTP trước).
    }

    // 4. Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 5. Cập nhật mật khẩu
    user.password = hashedPassword;
    await user.save();

    // 6. Trả về kết quả
    res.status(200).json({ message: 'Password reset successful' });
    logger.info(`Password reset for user ${email}`);
    // Note: Trả về thông báo thành công.

  } catch (err) {
    logger.error('Error resetting password', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Internal server error', details: err.message });
    // Note: Trả về lỗi 500 nếu có lỗi server.
  }
};
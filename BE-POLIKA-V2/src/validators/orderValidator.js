const { body, query, param } = require('express-validator');
const UserModel = require('../apps/models/user');

exports.createOrderValidation = [
    body('service_type')
      .notEmpty()
      .withMessage('Loại dịch vụ không được để trống.')
      .isIn(['plumbing', 'electrical', 'carpentry', 'hvac'])
      .withMessage('Loại dịch vụ phải là một trong: plumbing, electrical, carpentry, hvac'),
  
    body('description')
      .notEmpty()
      .withMessage('Mô tả không được để trống.')
      .trim(),
  
    body('address.street')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Địa chỉ đường không được để trống nếu đã cung cấp.'),
  
    body('address.city')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Thành phố không được để trống nếu đã cung cấp.'),
  
    body('address.district')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Quận/Huyện không được để trống nếu đã cung cấp.'),
  
    body('address.ward')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Phường/Xã không được để trống nếu đã cung cấp.'),
  
    body('address.country')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Quốc gia không được để trống nếu đã cung cấp.'),
  
    // Validation cho phone_number
    body('phone_number')
      .optional()
      .trim()
      .matches(/^[0-9]{10,11}$/)
      .withMessage('Số điện thoại phải có từ 10 đến 11 chữ số.')
      .custom(async (value, { req }) => {
        if (value) {
          const user = await UserModel.findOne({ phone_number: value });
          if (user && user._id.toString() !== req.user._id.toString()) {
            throw new Error('Số điện thoại đã tồn tại.');
          }
        }
        return true;
      }),

  
   // Thêm validation cho price
   body('price')
   .notEmpty()
   .withMessage('Giá trị đơn hàng không được để trống.')
   .isFloat({ min: 0 })
   .withMessage('Giá trị đơn hàng phải là số không âm.'),
];

// Validation cho getCustomerOrders
exports.getCustomerOrdersValidation = [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Trang phải là một số nguyên dương.'),
  
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Giới hạn phải nằm trong khoảng từ 1 đến 100.'),
  
    query('sortBy')
      .optional()
      .isIn(['created_at', 'service_type', 'status', 'price'])
      .withMessage('Sắp xếp theo phải là một trong: created_at, service_type, status, price'),
  
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Thứ tự sắp xếp phải là "asc" hoặc "desc".'),
  
    query('status')
      .optional()
      .isIn(['pending', 'accepted', 'in_progress', 'completed', 'cancelled'])
      .withMessage('Trạng thái phải là một trong: pending, accepted, in_progress, completed, cancelled'),
];
  
exports.cancelOrderValidation = [
    param('id')
      .isMongoId()
      .withMessage('ID đơn hàng không hợp lệ.'),
];

// Validation cho hoàn tất đơn hàng
exports.completeOrderValidation = [
    param('id')
      .isMongoId()
      .withMessage('ID đơn hàng không hợp lệ.'),
];

// Validation cho acceptOrder
exports.acceptOrderValidation = [
    param('id')
      .isMongoId()
      .withMessage('Invalid order ID.'),
];

// Validation cho rejectOrder
exports.rejectOrderValidation = [
    param('id')
      .isMongoId()
      .withMessage('Invalid order ID.'),
];

// Thêm validation cho getCommission
exports.getCommissionValidation = [
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Ngày bắt đầu phải là một ngày hợp lệ theo định dạng ISO 8601.'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('Ngày kết thúc phải là một ngày hợp lệ theo định dạng ISO 8601.'),
    query('startDate')
      .if(query('endDate').exists())
      .custom((startDate, { req }) => {
        const start = new Date(startDate);
        const end = new Date(req.query.endDate);
        if (start > end) {
          throw new Error('Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.');
        }
        return true;
      }),
  ];
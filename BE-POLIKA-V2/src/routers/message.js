const express = require('express');
const router = express.Router();
const messageController = require('../apps/Controllers/apis/messageController');
const messageValidator = require('../validators/messageValidator')
const authMiddleware = require('../apps/middlewares/auth');
// const requireRole = require('../apps/middlewares/requireRole');
const { body, validationResult } = require('express-validator');

// Nhắn tin
router.post('/messages',authMiddleware,messageValidator.sendMessageValidation,messageController.sendMessage);
  
  router.get('/messages', authMiddleware, messageController.getMessages);

  module.exports = router;
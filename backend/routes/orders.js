const express = require('express');
const { body } = require('express-validator');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getAllOrders);

router.get('/:id', getOrderById);

router.post('/', [
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .trim(),
  body('valueRs')
    .isFloat({ min: 0 })
    .withMessage('Order value must be a positive number'),
  body('assignedRoute')
    .isMongoId()
    .withMessage('Valid assigned route ID is required'),
  body('customerName')
    .notEmpty()
    .withMessage('Customer name is required')
    .trim(),
  body('customerAddress')
    .notEmpty()
    .withMessage('Customer address is required')
    .trim(),
  body('customerPhone')
    .optional()
    .trim(),
  body('plannedDeliveryTime')
    .optional()
    .isISO8601()
    .withMessage('Planned delivery time must be a valid date'),
  body('deliveryTimestamp')
    .optional()
    .isISO8601()
    .withMessage('Delivery timestamp must be a valid date'),
  body('status')
    .optional()
    .isIn(['pending', 'assigned', 'in_transit', 'delivered', 'failed'])
    .withMessage('Status must be one of: pending, assigned, in_transit, delivered, failed')
], createOrder);

router.put('/:id', [
  body('valueRs')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Order value must be a positive number'),
  body('assignedRoute')
    .optional()
    .isMongoId()
    .withMessage('Valid assigned route ID is required'),
  body('assignedDriver')
    .optional()
    .isMongoId()
    .withMessage('Valid assigned driver ID is required'),
  body('customerName')
    .optional()
    .notEmpty()
    .withMessage('Customer name cannot be empty')
    .trim(),
  body('customerAddress')
    .optional()
    .notEmpty()
    .withMessage('Customer address cannot be empty')
    .trim(),
  body('customerPhone')
    .optional()
    .trim(),
  body('plannedDeliveryTime')
    .optional()
    .isISO8601()
    .withMessage('Planned delivery time must be a valid date'),
  body('deliveryTimestamp')
    .optional()
    .isISO8601()
    .withMessage('Delivery timestamp must be a valid date'),
  body('status')
    .optional()
    .isIn(['pending', 'assigned', 'in_transit', 'delivered', 'failed'])
    .withMessage('Status must be one of: pending, assigned, in_transit, delivered, failed')
], updateOrder);

router.delete('/:id', deleteOrder);

module.exports = router;
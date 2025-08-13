const express = require('express');
const { body } = require('express-validator');
const {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver
} = require('../controllers/driverController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getAllDrivers);

router.get('/:id', getDriverById);

router.post('/', [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters')
    .trim(),
  body('employeeId')
    .notEmpty()
    .withMessage('Employee ID is required')
    .trim(),
  body('currentShiftHours')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('Current shift hours must be between 0 and 24'),
  body('past7DayWorkHours')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Past 7 day work hours must be non-negative'),
  body('licenseNumber')
    .notEmpty()
    .withMessage('License number is required')
    .trim(),
  body('phone')
    .optional()
    .trim()
], createDriver);

router.put('/:id', [
  body('name')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters')
    .trim(),
  body('currentShiftHours')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('Current shift hours must be between 0 and 24'),
  body('past7DayWorkHours')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Past 7 day work hours must be non-negative'),
  body('licenseNumber')
    .optional()
    .notEmpty()
    .withMessage('License number cannot be empty')
    .trim(),
  body('phone')
    .optional()
    .trim()
], updateDriver);

router.delete('/:id', deleteDriver);

module.exports = router;
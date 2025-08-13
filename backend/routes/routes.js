const express = require('express');
const { body } = require('express-validator');
const {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute
} = require('../controllers/routeController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getAllRoutes);

router.get('/:id', getRouteById);

router.post('/', [
  body('routeId')
    .notEmpty()
    .withMessage('Route ID is required')
    .trim(),
  body('name')
    .notEmpty()
    .withMessage('Route name is required')
    .isLength({ max: 100 })
    .withMessage('Route name must not exceed 100 characters')
    .trim(),
  body('distanceKm')
    .isFloat({ min: 0 })
    .withMessage('Distance must be a positive number'),
  body('trafficLevel')
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Traffic level must be Low, Medium, or High'),
  body('baseTimeMinutes')
    .isInt({ min: 1 })
    .withMessage('Base time must be a positive integer'),
  body('startLocation')
    .notEmpty()
    .withMessage('Start location is required')
    .trim(),
  body('endLocation')
    .notEmpty()
    .withMessage('End location is required')
    .trim()
], createRoute);

router.put('/:id', [
  body('name')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Route name must not exceed 100 characters')
    .trim(),
  body('distanceKm')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Distance must be a positive number'),
  body('trafficLevel')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Traffic level must be Low, Medium, or High'),
  body('baseTimeMinutes')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Base time must be a positive integer'),
  body('startLocation')
    .optional()
    .notEmpty()
    .withMessage('Start location cannot be empty')
    .trim(),
  body('endLocation')
    .optional()
    .notEmpty()
    .withMessage('End location cannot be empty')
    .trim()
], updateRoute);

router.delete('/:id', deleteRoute);

module.exports = router;
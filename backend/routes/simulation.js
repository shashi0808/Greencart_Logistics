const express = require('express');
const { body } = require('express-validator');
const {
  runSimulation,
  getSimulationHistory,
  getSimulationById,
  deleteSimulation,
  getDashboardStats
} = require('../controllers/simulationController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/dashboard-stats', getDashboardStats);

router.get('/history', getSimulationHistory);

router.get('/:id', getSimulationById);

router.post('/run', [
  body('availableDrivers')
    .isInt({ min: 1 })
    .withMessage('Available drivers must be a positive integer'),
  body('routeStartTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Route start time must be in HH:MM format (24-hour)'),
  body('maxHoursPerDriver')
    .isFloat({ min: 0.1, max: 24 })
    .withMessage('Max hours per driver must be between 0.1 and 24')
], runSimulation);

router.delete('/:id', deleteSimulation);

module.exports = router;
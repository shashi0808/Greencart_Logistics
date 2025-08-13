const { validationResult } = require('express-validator');
const SimulationResult = require('../models/SimulationResult');
const SimulationEngine = require('../utils/simulationEngine');

const runSimulation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { availableDrivers, routeStartTime, maxHoursPerDriver } = req.body;

    if (availableDrivers <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Number of available drivers must be greater than 0'
      });
    }

    if (maxHoursPerDriver <= 0 || maxHoursPerDriver > 24) {
      return res.status(400).json({
        success: false,
        message: 'Max hours per driver must be between 0 and 24'
      });
    }

    const engine = new SimulationEngine();
    const simulationData = await engine.runSimulation(
      { availableDrivers, routeStartTime, maxHoursPerDriver },
      req.user._id
    );

    const simulationResult = new SimulationResult(simulationData);
    await simulationResult.save();

    await simulationResult.populate('results.driverUtilization.driverId', 'name employeeId');

    res.json({
      success: true,
      message: 'Simulation completed successfully',
      data: { simulation: simulationResult }
    });
  } catch (error) {
    console.error('Simulation error:', error);
    
    if (error.message.includes('No available drivers') || 
        error.message.includes('No pending orders')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during simulation'
    });
  }
};

const getSimulationHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const simulations = await SimulationResult.find()
      .populate('createdBy', 'username email')
      .populate('results.driverUtilization.driverId', 'name employeeId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await SimulationResult.countDocuments();

    res.json({
      success: true,
      data: {
        simulations,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get simulation history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching simulation history'
    });
  }
};

const getSimulationById = async (req, res) => {
  try {
    const simulation = await SimulationResult.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('results.driverUtilization.driverId', 'name employeeId');

    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: 'Simulation not found'
      });
    }

    res.json({
      success: true,
      data: { simulation }
    });
  } catch (error) {
    console.error('Get simulation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching simulation'
    });
  }
};

const deleteSimulation = async (req, res) => {
  try {
    const simulation = await SimulationResult.findByIdAndDelete(req.params.id);

    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: 'Simulation not found'
      });
    }

    res.json({
      success: true,
      message: 'Simulation deleted successfully'
    });
  } catch (error) {
    console.error('Delete simulation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting simulation'
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const latestSimulation = await SimulationResult.findOne()
      .sort({ createdAt: -1 })
      .populate('results.driverUtilization.driverId', 'name employeeId');

    if (!latestSimulation) {
      return res.status(404).json({
        success: false,
        message: 'No simulation data available'
      });
    }

    const stats = {
      totalProfit: latestSimulation.results.totalProfit,
      efficiencyScore: latestSimulation.results.efficiencyScore,
      onTimeVsLate: {
        onTime: latestSimulation.results.onTimeDeliveries,
        late: latestSimulation.results.lateDeliveries
      },
      fuelCostBreakdown: latestSimulation.results.fuelCostBreakdown,
      totalDeliveries: latestSimulation.results.totalDeliveries,
      totalFuelCost: latestSimulation.results.totalFuelCost,
      driverUtilization: latestSimulation.results.driverUtilization
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard stats'
    });
  }
};

module.exports = {
  runSimulation,
  getSimulationHistory,
  getSimulationById,
  deleteSimulation,
  getDashboardStats
};
const mongoose = require('mongoose');

const simulationResultSchema = new mongoose.Schema({
  simulationId: {
    type: String,
    required: true,
    unique: true
  },
  parameters: {
    availableDrivers: {
      type: Number,
      required: true
    },
    routeStartTime: {
      type: String,
      required: true
    },
    maxHoursPerDriver: {
      type: Number,
      required: true
    }
  },
  results: {
    totalProfit: {
      type: Number,
      required: true
    },
    efficiencyScore: {
      type: Number,
      required: true
    },
    onTimeDeliveries: {
      type: Number,
      required: true
    },
    lateDeliveries: {
      type: Number,
      required: true
    },
    totalDeliveries: {
      type: Number,
      required: true
    },
    totalFuelCost: {
      type: Number,
      required: true
    },
    totalPenalties: {
      type: Number,
      required: true
    },
    totalBonuses: {
      type: Number,
      required: true
    },
    fuelCostBreakdown: [{
      trafficLevel: String,
      cost: Number,
      percentage: Number
    }],
    driverUtilization: [{
      driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver'
      },
      hoursWorked: Number,
      deliveriesCompleted: Number,
      efficiency: Number
    }]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SimulationResult', simulationResultSchema);
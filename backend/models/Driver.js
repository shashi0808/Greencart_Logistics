const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  currentShiftHours: {
    type: Number,
    default: 0,
    min: 0,
    max: 24
  },
  past7DayWorkHours: {
    type: Number,
    default: 0,
    min: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  phone: {
    type: String,
    trim: true
  },
  licenseNumber: {
    type: String,
    required: true,
    trim: true
  },
  fatigueLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalDeliveries: {
    type: Number,
    default: 0
  },
  onTimeDeliveries: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

driverSchema.virtual('efficiencyScore').get(function() {
  if (this.totalDeliveries === 0) return 0;
  return Math.round((this.onTimeDeliveries / this.totalDeliveries) * 100);
});

driverSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Driver', driverSchema);
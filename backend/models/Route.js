const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  distanceKm: {
    type: Number,
    required: true,
    min: 0
  },
  trafficLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  baseTimeMinutes: {
    type: Number,
    required: true,
    min: 1
  },
  startLocation: {
    type: String,
    required: true,
    trim: true
  },
  endLocation: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

routeSchema.virtual('baseFuelCost').get(function() {
  const baseCost = this.distanceKm * 5;
  const surcharge = this.trafficLevel === 'High' ? this.distanceKm * 2 : 0;
  return baseCost + surcharge;
});

routeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Route', routeSchema);
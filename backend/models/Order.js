const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  valueRs: {
    type: Number,
    required: true,
    min: 0
  },
  assignedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  deliveryTimestamp: {
    type: Date
  },
  plannedDeliveryTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_transit', 'delivered', 'failed'],
    default: 'pending'
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerAddress: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    trim: true
  },
  isOnTime: {
    type: Boolean
  },
  penalty: {
    type: Number,
    default: 0
  },
  bonus: {
    type: Number,
    default: 0
  },
  actualDeliveryDuration: {
    type: Number
  }
}, {
  timestamps: true
});

orderSchema.virtual('profit').get(function() {
  return this.valueRs + this.bonus - this.penalty;
});

orderSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Order = require('../models/Order');

class SimulationEngine {
  constructor() {
    this.LATE_DELIVERY_PENALTY = 50;
    this.HIGH_VALUE_THRESHOLD = 1000;
    this.HIGH_VALUE_BONUS_RATE = 0.1;
    this.BASE_FUEL_COST_PER_KM = 5;
    this.HIGH_TRAFFIC_SURCHARGE_PER_KM = 2;
    this.FATIGUE_HOURS_THRESHOLD = 8;
    this.FATIGUE_SPEED_REDUCTION = 0.3;
    this.LATE_DELIVERY_THRESHOLD_MINUTES = 10;
  }

  async runSimulation(params, userId) {
    const { availableDrivers, routeStartTime, maxHoursPerDriver } = params;

    const drivers = await Driver.find({ isAvailable: true })
      .limit(availableDrivers)
      .sort({ past7DayWorkHours: 1 });

    if (drivers.length === 0) {
      throw new Error('No available drivers found');
    }

    const orders = await Order.find({ status: 'pending' })
      .populate('assignedRoute');

    if (orders.length === 0) {
      throw new Error('No pending orders found');
    }

    const routes = await Route.find();
    
    const simulationResult = await this.allocateOrdersToDrivers(
      drivers,
      orders,
      routes,
      { routeStartTime, maxHoursPerDriver }
    );

    return {
      simulationId: this.generateSimulationId(),
      parameters: params,
      results: simulationResult,
      createdBy: userId
    };
  }

  async allocateOrdersToDrivers(drivers, orders, routes, params) {
    const { routeStartTime, maxHoursPerDriver } = params;
    const startTime = this.parseTime(routeStartTime);
    
    const driverWorkloads = drivers.map(driver => ({
      driver,
      hoursWorked: 0,
      assignedOrders: [],
      isFatigued: driver.currentShiftHours > this.FATIGUE_HOURS_THRESHOLD
    }));

    const unassignedOrders = [...orders];
    const completedDeliveries = [];

    while (unassignedOrders.length > 0) {
      const order = unassignedOrders.shift();
      const availableDriver = this.findAvailableDriver(
        driverWorkloads, 
        maxHoursPerDriver,
        order.assignedRoute
      );

      if (!availableDriver) {
        break;
      }

      const deliveryResult = this.simulateDelivery(
        order,
        availableDriver,
        startTime
      );

      availableDriver.assignedOrders.push(order);
      availableDriver.hoursWorked += deliveryResult.timeSpent;
      completedDeliveries.push(deliveryResult);
    }

    return this.calculateKPIs(completedDeliveries, driverWorkloads, routes);
  }

  findAvailableDriver(driverWorkloads, maxHours, route) {
    const estimatedTimeHours = route.baseTimeMinutes / 60;
    
    return driverWorkloads.find(dw => 
      dw.hoursWorked + estimatedTimeHours <= maxHours
    );
  }

  simulateDelivery(order, driverWorkload, startTime) {
    const { driver, isFatigued } = driverWorkload;
    const route = order.assignedRoute;
    
    let actualDeliveryTime = route.baseTimeMinutes;
    
    if (isFatigued) {
      actualDeliveryTime += actualDeliveryTime * this.FATIGUE_SPEED_REDUCTION;
    }

    const isOnTime = actualDeliveryTime <= (route.baseTimeMinutes + this.LATE_DELIVERY_THRESHOLD_MINUTES);
    
    let penalty = 0;
    let bonus = 0;

    if (!isOnTime) {
      penalty = this.LATE_DELIVERY_PENALTY;
    }

    if (order.valueRs > this.HIGH_VALUE_THRESHOLD && isOnTime) {
      bonus = order.valueRs * this.HIGH_VALUE_BONUS_RATE;
    }

    const fuelCost = this.calculateFuelCost(route);
    const profit = order.valueRs + bonus - penalty - fuelCost;

    return {
      orderId: order.orderId,
      driverId: driver._id,
      isOnTime,
      penalty,
      bonus,
      fuelCost,
      profit,
      timeSpent: actualDeliveryTime / 60,
      trafficLevel: route.trafficLevel,
      orderValue: order.valueRs
    };
  }

  calculateFuelCost(route) {
    const baseCost = route.distanceKm * this.BASE_FUEL_COST_PER_KM;
    const surcharge = route.trafficLevel === 'High' ? 
      route.distanceKm * this.HIGH_TRAFFIC_SURCHARGE_PER_KM : 0;
    return baseCost + surcharge;
  }

  calculateKPIs(deliveries, driverWorkloads, routes) {
    const onTimeDeliveries = deliveries.filter(d => d.isOnTime).length;
    const lateDeliveries = deliveries.filter(d => !d.isOnTime).length;
    const totalDeliveries = deliveries.length;

    const totalProfit = deliveries.reduce((sum, d) => sum + d.profit, 0);
    const totalFuelCost = deliveries.reduce((sum, d) => sum + d.fuelCost, 0);
    const totalPenalties = deliveries.reduce((sum, d) => sum + d.penalty, 0);
    const totalBonuses = deliveries.reduce((sum, d) => sum + d.bonus, 0);

    const efficiencyScore = totalDeliveries > 0 ? 
      Math.round((onTimeDeliveries / totalDeliveries) * 100) : 0;

    const fuelCostBreakdown = this.calculateFuelBreakdown(deliveries);
    const driverUtilization = this.calculateDriverUtilization(driverWorkloads, deliveries);

    return {
      totalProfit: Math.round(totalProfit),
      efficiencyScore,
      onTimeDeliveries,
      lateDeliveries,
      totalDeliveries,
      totalFuelCost: Math.round(totalFuelCost),
      totalPenalties,
      totalBonuses: Math.round(totalBonuses),
      fuelCostBreakdown,
      driverUtilization
    };
  }

  calculateFuelBreakdown(deliveries) {
    const breakdown = { Low: 0, Medium: 0, High: 0 };
    const totalFuelCost = deliveries.reduce((sum, d) => sum + d.fuelCost, 0);

    deliveries.forEach(delivery => {
      breakdown[delivery.trafficLevel] += delivery.fuelCost;
    });

    return Object.keys(breakdown).map(level => ({
      trafficLevel: level,
      cost: Math.round(breakdown[level]),
      percentage: totalFuelCost > 0 ? 
        Math.round((breakdown[level] / totalFuelCost) * 100) : 0
    })).filter(item => item.cost > 0);
  }

  calculateDriverUtilization(driverWorkloads, deliveries) {
    return driverWorkloads
      .filter(dw => dw.assignedOrders.length > 0)
      .map(dw => {
        const driverDeliveries = deliveries.filter(d => 
          d.driverId.toString() === dw.driver._id.toString()
        );
        const onTimeCount = driverDeliveries.filter(d => d.isOnTime).length;
        
        return {
          driverId: dw.driver._id,
          driverName: dw.driver.name,
          hoursWorked: Math.round(dw.hoursWorked * 100) / 100,
          deliveriesCompleted: dw.assignedOrders.length,
          efficiency: dw.assignedOrders.length > 0 ? 
            Math.round((onTimeCount / dw.assignedOrders.length) * 100) : 0
        };
      });
  }

  parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  }

  generateSimulationId() {
    return 'SIM_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = SimulationEngine;
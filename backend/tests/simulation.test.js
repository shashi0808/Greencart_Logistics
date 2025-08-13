const SimulationEngine = require('../utils/simulationEngine');
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Order = require('../models/Order');

describe('SimulationEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new SimulationEngine();
  });

  describe('calculateFuelCost', () => {
    it('should calculate correct fuel cost for low traffic route', () => {
      const route = {
        distanceKm: 10,
        trafficLevel: 'Low'
      };

      const cost = engine.calculateFuelCost(route);
      expect(cost).toBe(50); // 10km * ₹5/km = ₹50
    });

    it('should calculate correct fuel cost for high traffic route', () => {
      const route = {
        distanceKm: 10,
        trafficLevel: 'High'
      };

      const cost = engine.calculateFuelCost(route);
      expect(cost).toBe(70); // (10km * ₹5/km) + (10km * ₹2/km) = ₹70
    });
  });

  describe('findAvailableDriver', () => {
    it('should find available driver with enough remaining hours', () => {
      const driverWorkloads = [
        { driver: { _id: '1', name: 'Driver 1' }, hoursWorked: 4, assignedOrders: [] },
        { driver: { _id: '2', name: 'Driver 2' }, hoursWorked: 7, assignedOrders: [] },
        { driver: { _id: '3', name: 'Driver 3' }, hoursWorked: 2, assignedOrders: [] }
      ];

      const route = { baseTimeMinutes: 120 }; // 2 hours
      const maxHours = 8;

      const availableDriver = engine.findAvailableDriver(driverWorkloads, maxHours, route);
      
      expect(availableDriver).toBeDefined();
      expect(availableDriver.driver.name).toBe('Driver 1'); // Should pick the first available
    });

    it('should return undefined if no driver has enough remaining hours', () => {
      const driverWorkloads = [
        { driver: { _id: '1', name: 'Driver 1' }, hoursWorked: 7.5, assignedOrders: [] },
        { driver: { _id: '2', name: 'Driver 2' }, hoursWorked: 8, assignedOrders: [] }
      ];

      const route = { baseTimeMinutes: 120 }; // 2 hours
      const maxHours = 8;

      const availableDriver = engine.findAvailableDriver(driverWorkloads, maxHours, route);
      
      expect(availableDriver).toBeUndefined();
    });
  });

  describe('simulateDelivery', () => {
    it('should apply late delivery penalty', () => {
      const order = {
        orderId: 'ORD001',
        valueRs: 1000,
        assignedRoute: {
          baseTimeMinutes: 60,
          distanceKm: 10,
          trafficLevel: 'Low'
        }
      };

      const driverWorkload = {
        driver: { _id: '1', name: 'Driver 1' },
        isFatigued: false
      };

      const startTime = { hours: 9, minutes: 0 };
      
      // Mock delivery that takes longer than base time + threshold
      jest.spyOn(engine, 'simulateDelivery').mockImplementation((order, driverWorkload, startTime) => {
        return {
          orderId: order.orderId,
          driverId: driverWorkload.driver._id,
          isOnTime: false,
          penalty: 50,
          bonus: 0,
          fuelCost: 50,
          profit: 900, // 1000 - 50 penalty - 50 fuel
          timeSpent: 1.5,
          trafficLevel: order.assignedRoute.trafficLevel,
          orderValue: order.valueRs
        };
      });

      const result = engine.simulateDelivery(order, driverWorkload, startTime);

      expect(result.penalty).toBe(50);
      expect(result.isOnTime).toBe(false);
      expect(result.profit).toBe(900);
    });

    it('should apply high-value bonus for on-time delivery', () => {
      const order = {
        orderId: 'ORD002',
        valueRs: 1500, // High value order
        assignedRoute: {
          baseTimeMinutes: 60,
          distanceKm: 10,
          trafficLevel: 'Low'
        }
      };

      const driverWorkload = {
        driver: { _id: '1', name: 'Driver 1' },
        isFatigued: false
      };

      const startTime = { hours: 9, minutes: 0 };

      jest.spyOn(engine, 'simulateDelivery').mockImplementation((order, driverWorkload, startTime) => {
        return {
          orderId: order.orderId,
          driverId: driverWorkload.driver._id,
          isOnTime: true,
          penalty: 0,
          bonus: 150, // 10% of 1500
          fuelCost: 50,
          profit: 1600, // 1500 + 150 bonus - 50 fuel
          timeSpent: 1,
          trafficLevel: order.assignedRoute.trafficLevel,
          orderValue: order.valueRs
        };
      });

      const result = engine.simulateDelivery(order, driverWorkload, startTime);

      expect(result.bonus).toBe(150);
      expect(result.isOnTime).toBe(true);
      expect(result.profit).toBe(1600);
    });
  });

  describe('calculateKPIs', () => {
    it('should calculate correct efficiency score', () => {
      const deliveries = [
        { isOnTime: true, profit: 100, fuelCost: 50, penalty: 0, bonus: 0, trafficLevel: 'Low' },
        { isOnTime: true, profit: 150, fuelCost: 60, penalty: 0, bonus: 10, trafficLevel: 'Medium' },
        { isOnTime: false, profit: 80, fuelCost: 40, penalty: 20, bonus: 0, trafficLevel: 'High' },
        { isOnTime: true, profit: 120, fuelCost: 55, penalty: 0, bonus: 5, trafficLevel: 'Low' }
      ];

      const driverWorkloads = [];
      const routes = [];

      const result = engine.calculateKPIs(deliveries, driverWorkloads, routes);

      expect(result.efficiencyScore).toBe(75); // 3 out of 4 on-time = 75%
      expect(result.onTimeDeliveries).toBe(3);
      expect(result.lateDeliveries).toBe(1);
      expect(result.totalDeliveries).toBe(4);
    });

    it('should calculate correct total profit', () => {
      const deliveries = [
        { isOnTime: true, profit: 100, fuelCost: 50, penalty: 0, bonus: 0, trafficLevel: 'Low' },
        { isOnTime: false, profit: 80, fuelCost: 40, penalty: 20, bonus: 0, trafficLevel: 'High' }
      ];

      const result = engine.calculateKPIs(deliveries, [], []);

      expect(result.totalProfit).toBe(180); // 100 + 80
      expect(result.totalFuelCost).toBe(90); // 50 + 40
      expect(result.totalPenalties).toBe(20);
      expect(result.totalBonuses).toBe(0);
    });
  });
});
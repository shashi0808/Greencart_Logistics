export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'manager' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  _id: string;
  name: string;
  employeeId: string;
  currentShiftHours: number;
  past7DayWorkHours: number;
  isAvailable: boolean;
  phone?: string;
  licenseNumber: string;
  fatigueLevel: number;
  totalDeliveries: number;
  onTimeDeliveries: number;
  efficiencyScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface Route {
  _id: string;
  routeId: string;
  name: string;
  distanceKm: number;
  trafficLevel: 'Low' | 'Medium' | 'High';
  baseTimeMinutes: number;
  startLocation: string;
  endLocation: string;
  isActive: boolean;
  baseFuelCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderId: string;
  valueRs: number;
  assignedRoute: Route;
  assignedDriver?: Driver;
  deliveryTimestamp?: string;
  plannedDeliveryTime?: string;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed';
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  isOnTime?: boolean;
  penalty: number;
  bonus: number;
  actualDeliveryDuration?: number;
  profit: number;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationParams {
  availableDrivers: number;
  routeStartTime: string;
  maxHoursPerDriver: number;
}

export interface FuelCostBreakdown {
  trafficLevel: string;
  cost: number;
  percentage: number;
}

export interface DriverUtilization {
  driverId: string;
  driverName: string;
  hoursWorked: number;
  deliveriesCompleted: number;
  efficiency: number;
}

export interface SimulationResults {
  totalProfit: number;
  efficiencyScore: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  totalDeliveries: number;
  totalFuelCost: number;
  totalPenalties: number;
  totalBonuses: number;
  fuelCostBreakdown: FuelCostBreakdown[];
  driverUtilization: DriverUtilization[];
}

export interface SimulationResult {
  _id: string;
  simulationId: string;
  parameters: SimulationParams;
  results: SimulationResults;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    drivers?: T[];
    routes?: T[];
    orders?: T[];
    simulations?: T[];
    pagination: {
      current: number;
      pages: number;
      total: number;
    };
  };
}
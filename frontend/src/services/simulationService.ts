import api from './api';
import { SimulationParams, SimulationResult, SimulationResults, ApiResponse, PaginatedResponse } from '../types';

export const simulationService = {
  async runSimulation(params: SimulationParams): Promise<SimulationResult> {
    const response = await api.post<ApiResponse<{ simulation: SimulationResult }>>('/simulation/run', params);
    if (response.data.success && response.data.data) {
      return response.data.data.simulation;
    }
    throw new Error(response.data.message || 'Simulation failed');
  },

  async getSimulationHistory(page: number = 1, limit: number = 10): Promise<PaginatedResponse<SimulationResult>> {
    const response = await api.get<PaginatedResponse<SimulationResult>>(`/simulation/history?page=${page}&limit=${limit}`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error('Failed to fetch simulation history');
  },

  async getSimulationById(id: string): Promise<SimulationResult> {
    const response = await api.get<ApiResponse<{ simulation: SimulationResult }>>(`/simulation/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data.simulation;
    }
    throw new Error(response.data.message || 'Failed to fetch simulation');
  },

  async deleteSimulation(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/simulation/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete simulation');
    }
  },

  async getDashboardStats(): Promise<{
    totalProfit: number;
    efficiencyScore: number;
    onTimeVsLate: { onTime: number; late: number };
    fuelCostBreakdown: Array<{ trafficLevel: string; cost: number; percentage: number }>;
    totalDeliveries: number;
    totalFuelCost: number;
    driverUtilization: Array<{ driverId: string; driverName: string; hoursWorked: number; deliveriesCompleted: number; efficiency: number }>;
  }> {
    const response = await api.get<ApiResponse<{ stats: any }>>('/simulation/dashboard-stats');
    if (response.data.success && response.data.data) {
      return response.data.data.stats;
    }
    throw new Error(response.data.message || 'No simulation data available');
  }
};
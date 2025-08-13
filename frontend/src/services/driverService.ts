import api from './api';
import { Driver, ApiResponse, PaginatedResponse } from '../types';

export interface CreateDriverData {
  name: string;
  employeeId: string;
  currentShiftHours?: number;
  past7DayWorkHours?: number;
  licenseNumber: string;
  phone?: string;
}

export interface UpdateDriverData extends Partial<CreateDriverData> {
  isAvailable?: boolean;
}

export const driverService = {
  async getAllDrivers(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<Driver>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });
    const response = await api.get<PaginatedResponse<Driver>>(`/drivers?${params}`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error('Failed to fetch drivers');
  },

  async getDriverById(id: string): Promise<Driver> {
    const response = await api.get<ApiResponse<{ driver: Driver }>>(`/drivers/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data.driver;
    }
    throw new Error(response.data.message || 'Failed to fetch driver');
  },

  async createDriver(driverData: CreateDriverData): Promise<Driver> {
    const response = await api.post<ApiResponse<{ driver: Driver }>>('/drivers', driverData);
    if (response.data.success && response.data.data) {
      return response.data.data.driver;
    }
    throw new Error(response.data.message || 'Failed to create driver');
  },

  async updateDriver(id: string, driverData: UpdateDriverData): Promise<Driver> {
    const response = await api.put<ApiResponse<{ driver: Driver }>>(`/drivers/${id}`, driverData);
    if (response.data.success && response.data.data) {
      return response.data.data.driver;
    }
    throw new Error(response.data.message || 'Failed to update driver');
  },

  async deleteDriver(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/drivers/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete driver');
    }
  }
};
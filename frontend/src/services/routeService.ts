import api from './api';
import { Route, ApiResponse, PaginatedResponse } from '../types';

export interface CreateRouteData {
  routeId: string;
  name: string;
  distanceKm: number;
  trafficLevel: 'Low' | 'Medium' | 'High';
  baseTimeMinutes: number;
  startLocation: string;
  endLocation: string;
  baseFuelCost: number;
  isActive?: boolean;
}

export interface UpdateRouteData extends Partial<CreateRouteData> {}

export const routeService = {
  async getAllRoutes(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<Route>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });
    const response = await api.get<PaginatedResponse<Route>>(`/routes?${params}`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error('Failed to fetch routes');
  },

  async getRouteById(id: string): Promise<Route> {
    const response = await api.get<ApiResponse<{ route: Route }>>(`/routes/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data.route;
    }
    throw new Error(response.data.message || 'Failed to fetch route');
  },

  async createRoute(routeData: CreateRouteData): Promise<Route> {
    const response = await api.post<ApiResponse<{ route: Route }>>('/routes', routeData);
    if (response.data.success && response.data.data) {
      return response.data.data.route;
    }
    throw new Error(response.data.message || 'Failed to create route');
  },

  async updateRoute(id: string, routeData: UpdateRouteData): Promise<Route> {
    const response = await api.put<ApiResponse<{ route: Route }>>(`/routes/${id}`, routeData);
    if (response.data.success && response.data.data) {
      return response.data.data.route;
    }
    throw new Error(response.data.message || 'Failed to update route');
  },

  async deleteRoute(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/routes/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete route');
    }
  }
};
import api from './api';
import { Order, ApiResponse, PaginatedResponse } from '../types';

export interface CreateOrderData {
  orderId: string;
  valueRs: number;
  assignedRoute: string; // Route ID
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  plannedDeliveryTime?: string;
  status?: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed';
}

export interface UpdateOrderData extends Partial<CreateOrderData> {
  assignedDriver?: string; // Driver ID
}

export const orderService = {
  async getAllOrders(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });
    const response = await api.get<PaginatedResponse<Order>>(`/orders?${params}`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error('Failed to fetch orders');
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<ApiResponse<{ order: Order }>>(`/orders/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data.order;
    }
    throw new Error(response.data.message || 'Failed to fetch order');
  },

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const response = await api.post<ApiResponse<{ order: Order }>>('/orders', orderData);
    if (response.data.success && response.data.data) {
      return response.data.data.order;
    }
    throw new Error(response.data.message || 'Failed to create order');
  },

  async updateOrder(id: string, orderData: UpdateOrderData): Promise<Order> {
    const response = await api.put<ApiResponse<{ order: Order }>>(`/orders/${id}`, orderData);
    if (response.data.success && response.data.data) {
      return response.data.data.order;
    }
    throw new Error(response.data.message || 'Failed to update order');
  },

  async deleteOrder(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/orders/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete order');
    }
  }
};
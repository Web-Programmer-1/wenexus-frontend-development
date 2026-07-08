import axios from 'axios';
import type { Booking, BookingsResponse } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/['"]/g, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  getEvents: async (params?: {
    search?: string;
    price_type?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
  }): Promise<any> => {
    const response = await apiClient.get<any>('/events', { params });
    return response.data;
  },

  getBookings: async (params: {
    event_id?: string;
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<BookingsResponse> => {
    const response = await apiClient.get<BookingsResponse>('/bookings', { params });
    return response.data;
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  createBooking: async (data: {
    event_id: string;
    customer_name: string;
    customer_email: string;
    seats: number;
    request_id: string;
  }): Promise<Booking> => {
    const response = await apiClient.post<Booking>('/bookings', data);
    return response.data;
  },
};

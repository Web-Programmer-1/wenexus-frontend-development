export interface Event {
  id: string;
  name: string;
  date: string;
  totalSeats: number;
  remainingSeats: number;
  price: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export interface Booking {
  id: string;
  eventId: string;
  customerName: string;
  customerEmail: string;
  seats: number;
  status: BookingStatus;
  requestId: string;
  createdAt: string;
  updatedAt: string;
  event?: Event;
}

export interface BookingsResponse {
  items: Booking[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

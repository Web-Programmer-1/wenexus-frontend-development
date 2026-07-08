import { useState, useEffect, useCallback } from 'react';
import type { Booking } from '../../../types';
import { apiService } from '../../../services/api';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchBookings = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const response = await apiService.getBookings({
        event_id: selectedEventId || undefined,
        status: selectedStatus || undefined,
        search: debouncedSearch || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        page: currentPage,
        limit: 8,
      });
      setBookings(response.items);
      setTotalPages(response.meta.totalPages);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError('বুকিং তালিকা লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [selectedEventId, selectedStatus, debouncedSearch, startDate, endDate, currentPage]);

  useEffect(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBookings(false);
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  const addLocalBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev.slice(0, 7)]);
  };

  const handleSetStartDate = (date: string) => {
    setStartDate(date);
    setCurrentPage(1);
  };

  const handleSetEndDate = (date: string) => {
    setEndDate(date);
    setCurrentPage(1);
  };

  return {
    bookings,
    selectedEventId,
    setSelectedEventId,
    selectedStatus,
    setSelectedStatus,
    search,
    setSearch,
    startDate,
    setStartDate: handleSetStartDate,
    endDate,
    setEndDate: handleSetEndDate,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
    error,
    addLocalBooking,
    refreshBookings: fetchBookings,
  };
}

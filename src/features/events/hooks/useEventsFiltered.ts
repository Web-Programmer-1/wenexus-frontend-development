import { useState, useEffect, useCallback } from 'react';
import type { Event } from '../../../types';
import { apiService } from '../../../services/api';

export function useEventsFiltered() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [priceType, setPriceType] = useState('');
  const [status, setStatus] = useState('');
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

  
  useEffect(() => {
    setCurrentPage(1);
  }, [priceType, status, startDate, endDate]);

  const fetchEvents = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const response = await apiService.getEvents({
        search: debouncedSearch || undefined,
        price_type: priceType || undefined,
        status: status || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        page: currentPage,
        limit: 8, 
      });
      
      if (response && response.items) {
        setEvents(response.items);
        setTotalPages(response.meta.totalPages || 1);
      } else {
        setEvents([]);
        setTotalPages(1);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching filtered events:', err);
      setError('ইভেন্ট তালিকা লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [debouncedSearch, priceType, status, startDate, endDate, currentPage]);

  useEffect(() => {
    fetchEvents(true);
  }, [fetchEvents]);

  
  useEffect(() => {
    const interval = setInterval(() => {
      fetchEvents(false);
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  const handleSetStartDate = (date: string) => {
    setStartDate(date);
    setCurrentPage(1);
  };

  const handleSetEndDate = (date: string) => {
    setEndDate(date);
    setCurrentPage(1);
  };

  return {
    events,
    search,
    setSearch,
    priceType,
    setPriceType,
    status,
    setStatus,
    startDate,
    setStartDate: handleSetStartDate,
    endDate,
    setEndDate: handleSetEndDate,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
    error,
    refreshEvents: fetchEvents,
  };
}

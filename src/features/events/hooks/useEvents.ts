import { useState, useEffect, useCallback } from 'react';
import type { Event } from '../../../types';
import { apiService } from '../../../services/api';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await apiService.getEvents();
      setEvents(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError('ইভেন্ট তালিকা লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 3500);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  return { events, loading, error, refreshEvents: fetchEvents };
}

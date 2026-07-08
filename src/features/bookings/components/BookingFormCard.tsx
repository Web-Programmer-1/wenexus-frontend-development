import React, { useState } from 'react';
import type { Event, Booking } from '@/types';
import { apiService } from '@/services/api';
import { useTranslation } from '../../../context/LanguageContext';

interface BookingFormCardProps {
  events: Event[];
  onBookingCreated: (booking: Booking) => void;
}

export const BookingFormCard: React.FC<BookingFormCardProps> = ({ events, onBookingCreated }) => {
  const { t } = useTranslation();
  const [eventId, setEventId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!eventId) { setError(t('form.errSelect')); return; }
    if (!name.trim()) { setError(t('form.errName')); return; }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError(t('form.errEmail')); return; }
    if (seats <= 0) { setError(t('form.errSeats')); return; }

    const selectedEvent = events.find(ev => ev.id === eventId);
    if (selectedEvent && selectedEvent.remainingSeats < seats) {
      
      setError(t('form.errSeats'));
      return;
    }

    setLoading(true);
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    try {
      const booking = await apiService.createBooking({
        event_id: eventId,
        customer_name: name,
        customer_email: email,
        seats,
        request_id: requestId,
      });
      setSuccessMsg(t('form.success'));
      onBookingCreated(booking);
      setEventId('');
      setName('');
      setEmail('');
      setSeats(1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">{t('form.selectEvent')}</label>
        <select
          className="form-control form-select"
          value={eventId}
          onChange={e => { setEventId(e.target.value); setSeats(1); }}
        >
          <option value="">{t('form.selectPlaceholder')}</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>
              {ev.name} ({t('form.remaining')}: {ev.remainingSeats}/{ev.totalSeats})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">{t('form.customerName')}</label>
        <input
          type="text"
          className="form-control"
          placeholder={t('form.namePlaceholder')}
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('form.email')}</label>
        <input
          type="email"
          className="form-control"
          placeholder="email@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('form.seats')}</label>
        <select
          className="form-control form-select"
          value={seats}
          onChange={e => setSeats(parseInt(e.target.value) || 1)}
        >
          {Array.from({ length: Math.max(1, eventId ? Math.min(10, events.find(ev => ev.id === eventId)?.remainingSeats || 1) : 10) }, (_, i) => i + 1).map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="form-alert form-alert-error">{error}</div>}
      {successMsg && <div className="form-alert form-alert-success">{successMsg}</div>}

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? t('form.processing') : `+ ${t('form.submit')}`}
      </button>
    </form>
  );
};

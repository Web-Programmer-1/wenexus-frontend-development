import React, { useEffect, useState } from 'react';
import type { Booking, Event } from '@/types';
import { useTranslation } from '@/context/LanguageContext';

const ArrowUpRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>
);

const TrendUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TicketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="m9 5 6 14" />
  </svg>
);

const BanknoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

const ArmchairIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
    <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
    <path d="M5 18v2" />
    <path d="M19 18v2" />
  </svg>
);

const AnimatedCounter: React.FC<{
  value: number;
  formatter: (val: number) => string;
  duration?: number;
}> = ({ value, formatter, duration = 800 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;
    const endValue = value;

    if (endValue <= 0) {
      setCount(0);
      return;
    }

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      
      const easeProgress = progress * (2 - progress);

      setCount(Math.floor(startValue + easeProgress * (endValue - startValue)));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <>{formatter(count)}</>;
};

interface StatsGridProps {
  bookings: Booking[];
  events: Event[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ bookings, events }) => {
  const { t } = useTranslation();
  const totalBookings = bookings.length;

  const totalRevenue = bookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((sum, b) => {
      const price = parseFloat(b.event?.price || '0');
      return sum + (price * b.seats);
    }, 0);

  const totalRemainingSeats = events.reduce((sum, e) => sum + e.remainingSeats, 0);
  const totalSeatsCapacity = events.reduce((sum, e) => sum + e.totalSeats, 0);
  const seatsFillPct = totalSeatsCapacity > 0
    ? Math.round(((totalSeatsCapacity - totalRemainingSeats) / totalSeatsCapacity) * 100)
    : 0;

  return (
    <div className="stats-grid">
      
      <div className="stat-card stat-primary animate-zoom-in" style={{ animationDelay: '100ms' }}>
        <div className="stat-card-top">
          <div className="stat-card-title-group">
            <div className="stat-card-icon-wrapper bookings">
              <TicketIcon />
            </div>
            <span className="stat-card-label">{t('stats.totalBookings')}</span>
          </div>
          <button className="stat-card-arrow">
            <ArrowUpRightIcon />
          </button>
        </div>
        <div className="stat-card-value">
          <AnimatedCounter value={totalBookings} formatter={(val) => `+${val}`} />
        </div>
        <div className="stat-card-sub">
          <span className="stat-card-sub-icon">
            <TrendUpIcon />
          </span>
          <span>{t('stats.increased')}</span>
        </div>
      </div>

      
      <div className="stat-card animate-zoom-in" style={{ animationDelay: '200ms' }}>
        <div className="stat-card-top">
          <div className="stat-card-title-group">
            <div className="stat-card-icon-wrapper revenue">
              <BanknoteIcon />
            </div>
            <span className="stat-card-label">{t('stats.totalRevenue')}</span>
          </div>
          <button className="stat-card-arrow">
            <ArrowUpRightIcon />
          </button>
        </div>
        <div className="stat-card-value" style={{ fontSize: 26 }}>
          <AnimatedCounter
            value={totalRevenue}
            formatter={(val) =>
              `৳${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toLocaleString()}`
            }
          />
        </div>
        <div className="stat-card-sub">
          <span className="stat-green-text">+20.1%</span>
          <span>{t('stats.increased')}</span>
        </div>
      </div>

      
      <div className="stat-card animate-zoom-in" style={{ animationDelay: '300ms' }}>
        <div className="stat-card-top">
          <div className="stat-card-title-group">
            <div className="stat-card-icon-wrapper seats">
              <ArmchairIcon />
            </div>
            <span className="stat-card-label">{t('stats.availableSeats')}</span>
          </div>
          <button className="stat-card-arrow">
            <ArrowUpRightIcon />
          </button>
        </div>
        <div className="stat-card-value">
          <AnimatedCounter value={totalRemainingSeats} formatter={(val) => `${val}`} />
        </div>
        <div className="stat-card-sub">
          <span style={{ color: '#6b7280' }}>{seatsFillPct}% {t('stats.filled')}</span>
          <span>{t('stats.of')} {totalSeatsCapacity} {t('stats.total')}</span>
        </div>
        <div className="seats-bar" style={{ marginTop: 10 }}>
          <div className="seats-bar-track">
            <div
              className="seats-bar-fill"
              style={{ width: `${seatsFillPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};


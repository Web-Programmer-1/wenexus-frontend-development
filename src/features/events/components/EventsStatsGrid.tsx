import React, { useEffect, useState } from 'react';
import type { Event } from '../../../types';
import { useTranslation } from '../../../context/LanguageContext';

const ArrowUpRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ArmchairIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
    <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
    <path d="M5 18v2" />
    <path d="M19 18v2" />
  </svg>
);

const TicketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="m9 5 6 14" />
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

interface EventsStatsGridProps {
  events: Event[];
}

export const EventsStatsGrid: React.FC<EventsStatsGridProps> = ({ events }) => {
  const { t, language } = useTranslation();

  const totalEvents = events.length;
  const totalCapacity = events.reduce((sum, e) => sum + e.totalSeats, 0);
  const totalRemaining = events.reduce((sum, e) => sum + e.remainingSeats, 0);
  const ticketsSold = totalCapacity - totalRemaining;
  
  const fillPct = totalCapacity > 0 ? Math.round((ticketsSold / totalCapacity) * 100) : 0;
  

  
  const formatNum = (num: number) => {
    return num.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US');
  };

  return (
    <div className="stats-grid">
      
      <div className="stat-card stat-primary animate-zoom-in" style={{ animationDelay: '100ms' }}>
        <div className="stat-card-top">
          <div className="stat-card-title-group">
            <div className="stat-card-icon-wrapper bookings">
              <CalendarIcon />
            </div>
            <span className="stat-card-label">{t('eventStats.totalEvents')}</span>
          </div>
          <button className="stat-card-arrow">
            <ArrowUpRightIcon />
          </button>
        </div>
        <div className="stat-card-value">
          <AnimatedCounter value={totalEvents} formatter={(val) => `+${formatNum(val)}`} />
        </div>
        <div className="stat-card-sub">
          <span className="stat-green-text">
            {formatNum(totalEvents)}
          </span>
          <span> {t('eventStats.active')}</span>
        </div>
      </div>

      
      <div className="stat-card animate-zoom-in" style={{ animationDelay: '200ms' }}>
        <div className="stat-card-top">
          <div className="stat-card-title-group">
            <div className="stat-card-icon-wrapper seats">
              <ArmchairIcon />
            </div>
            <span className="stat-card-label">{t('eventStats.totalCapacity')}</span>
          </div>
          <button className="stat-card-arrow">
            <ArrowUpRightIcon />
          </button>
        </div>
        <div className="stat-card-value">
          <AnimatedCounter value={totalCapacity} formatter={(val) => formatNum(val)} />
        </div>
        <div className="stat-card-sub">
          <span style={{ color: '#6b7280' }}>{formatNum(totalRemaining)} {t('events.remaining')}</span>
        </div>
      </div>

      
      <div className="stat-card animate-zoom-in" style={{ animationDelay: '300ms' }}>
        <div className="stat-card-top">
          <div className="stat-card-title-group">
            <div className="stat-card-icon-wrapper revenue">
              <TicketIcon />
            </div>
            <span className="stat-card-label">{t('eventStats.ticketsSold')}</span>
          </div>
          <button className="stat-card-arrow">
            <ArrowUpRightIcon />
          </button>
        </div>
        <div className="stat-card-value">
          <AnimatedCounter value={ticketsSold} formatter={(val) => formatNum(val)} />
        </div>
        <div className="stat-card-sub">
          <span style={{ color: '#6b7280' }}>
            {formatNum(fillPct)}% {t('eventStats.sold')}
          </span>
        </div>
        <div className="seats-bar" style={{ marginTop: 10 }}>
          <div className="seats-bar-track">
            <div
              className="seats-bar-fill"
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

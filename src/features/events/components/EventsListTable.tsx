import React, { useState } from 'react';
import type { Event } from '../../../types';
import { useTranslation } from '../../../context/LanguageContext';

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

interface EventsListTableProps {
  events: Event[];
  search: string;
  setSearch: (search: string) => void;
  priceType: string;
  setPriceType: (priceType: string) => void;
  status: string;
  setStatus: (status: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  isLoading: boolean;
}

const CheckCircleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const XCircleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const EventsListTable: React.FC<EventsListTableProps> = ({
  events,
  search,
  setSearch,
  priceType,
  setPriceType,
  status,
  setStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  currentPage,
  totalPages,
  setCurrentPage,
  isLoading,
}) => {
  const { t, language } = useTranslation();
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const activeFiltersCount = [
    search !== '',
    priceType !== '',
    status !== '',
    startDate !== '',
    endDate !== ''
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSearch('');
    setPriceType('');
    setStatus('');
    setStartDate('');
    setEndDate('');
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatPrice = (price: string | number) => {
    const p = typeof price === 'string' ? parseFloat(price) : price;
    if (p === 0) return language === 'bn' ? 'ফ্রি' : 'Free';
    const formattedVal = p.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US');
    return `৳${formattedVal}`;
  };

  const getSeatStatus = (event: Event) => {
    const pct = ((event.totalSeats - event.remainingSeats) / event.totalSeats) * 100;
    if (pct >= 90) return 'critical';
    if (pct >= 60) return 'warning';
    return 'available';
  };

  return (
    <div className="card animate-zoom-in" style={{ animationDelay: '200ms' }}>
      <div className="card-header">
        <div>
          <div className="card-title">{t('events.title')}</div>
          <div className="card-subtitle">{t('events.subtitle')}</div>
        </div>
      </div>

      
      <div className="filter-bar">
        <div className="filter-label-group">
          <div className="filter-label">
            <FilterIcon />
            <span>{t('table.filter')}</span>
          </div>
          {activeFiltersCount > 0 && (
            <span className="filter-badge">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="filter-actions-row">
          {activeFiltersCount > 0 && (
            <button className="btn-clear-filters" onClick={handleResetFilters}>
              {language === 'bn' ? 'রিসেট' : 'Reset'}
            </button>
          )}
          <button
            className={`btn btn-filter-drawer ${isFiltersExpanded ? 'active' : ''}`}
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            {isFiltersExpanded
              ? (language === 'bn' ? 'ফিল্টার লুকান' : 'Hide Filters')
              : (language === 'bn' ? 'ফিল্টারসমূহ' : 'Filters')}
          </button>
        </div>
      </div>

      
      <div className={`collapsible-filter-panel ${isFiltersExpanded ? 'open' : ''}`}>
        <div className="filter-flex">
          
          <div className="filter-group search-group">
            <label className="filter-input-label">
              {language === 'bn' ? 'অনুসন্ধান করুন' : 'Search Event'}
            </label>
            <div className="search-input-wrapper">
              <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="filter-input"
                placeholder={(language === 'bn' ? 'ইভেন্টের নাম...' : 'Event Name...')}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="clear-btn" onClick={() => setSearch('')}>
                  ×
                </button>
              )}
            </div>
          </div>

          
          <div className="filter-group">
            <label className="filter-input-label">
              {language === 'bn' ? 'মূল্য প্রকার' : 'Price Type'}
            </label>
            <select
              className="filter-select-full"
              value={priceType}
              onChange={e => setPriceType(e.target.value)}
            >
              <option value="">{language === 'bn' ? 'সকল মূল্য' : 'All Prices'}</option>
              <option value="free">{language === 'bn' ? 'ফ্রি' : 'Free'}</option>
              <option value="paid">{language === 'bn' ? 'পেইড' : 'Paid'}</option>
            </select>
          </div>

          
          <div className="filter-group">
            <label className="filter-input-label">
              {language === 'bn' ? 'আসন অবস্থা' : 'Seat Status'}
            </label>
            <select
              className="filter-select-full"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="">{language === 'bn' ? 'সকল অবস্থা' : 'All Statuses'}</option>
              <option value="available">{language === 'bn' ? 'উপলব্ধ' : 'Available'}</option>
              <option value="warning">{language === 'bn' ? 'আসন দ্রুত শেষ হচ্ছে' : 'Filling Up'}</option>
              <option value="critical">{language === 'bn' ? 'আসন শেষ প্রায়' : 'Almost Full'}</option>
            </select>
          </div>

          
          <div className="filter-group">
            <label className="filter-input-label">
              {language === 'bn' ? 'শুরুর তারিখ' : 'Start Date'}
            </label>
            <input
              type="date"
              className="filter-input"
              style={{ paddingLeft: '14px' }}
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>

          
          <div className="filter-group">
            <label className="filter-input-label">
              {language === 'bn' ? 'শেষের তারিখ' : 'End Date'}
            </label>
            <input
              type="date"
              className="filter-input"
              style={{ paddingLeft: '14px' }}
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      
      {activeFiltersCount > 0 && (
        <div className="active-filters-tags animate-fade">
          {search && (
            <span className="filter-tag">
              {language === 'bn' ? 'সার্চ' : 'Search'}: "{search}"
              <button className="filter-tag-close" onClick={() => setSearch('')}>×</button>
            </span>
          )}
          {priceType && (
            <span className="filter-tag">
              {language === 'bn' ? 'মূল্য' : 'Price'}: {priceType === 'free' ? (language === 'bn' ? 'ফ্রি' : 'Free') : (language === 'bn' ? 'পেইড' : 'Paid')}
              <button className="filter-tag-close" onClick={() => setPriceType('')}>×</button>
            </span>
          )}
          {status && (
            <span className="filter-tag">
              {language === 'bn' ? 'অবস্থা' : 'Status'}: {status === 'available' ? (language === 'bn' ? 'উপলব্ধ' : 'Available') : status === 'warning' ? (language === 'bn' ? 'আসন দ্রুত শেষ হচ্ছে' : 'Filling Up') : (language === 'bn' ? 'আসন শেষ প্রায়' : 'Almost Full')}
              <button className="filter-tag-close" onClick={() => setStatus('')}>×</button>
            </span>
          )}
          {startDate && (
            <span className="filter-tag">
              {language === 'bn' ? 'শুরু' : 'Start'}: {startDate}
              <button className="filter-tag-close" onClick={() => setStartDate('')}>×</button>
            </span>
          )}
          {endDate && (
            <span className="filter-tag">
              {language === 'bn' ? 'শেষ' : 'End'}: {endDate}
              <button className="filter-tag-close" onClick={() => setEndDate('')}>×</button>
            </span>
          )}
        </div>
      )}

      
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('events.name')}</th>
              <th>{t('events.date')}</th>
              <th>{t('events.price')}</th>
              <th>{t('events.seats')}</th>
              <th>{t('events.status')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5}>
                  <div className="table-loading">
                    <div className="spinner" />
                    <span>{t('table.loading')}</span>
                  </div>
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="table-empty">
                    <img src="/logo/page-not-found-688965_1280.png" alt="No events found" className="table-empty-img" />
                    <span className="table-empty-text">{t('events.empty')}</span>
                  </div>
                </td>
              </tr>
            ) : (
              events.map((event, index) => {
                const seatStatus = getSeatStatus(event);
                const bookedSeats = event.totalSeats - event.remainingSeats;
                const fillPct = Math.round((bookedSeats / event.totalSeats) * 100);

                
                const seatsDisplay = `${bookedSeats.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}/${event.totalSeats.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}`;
                const remainingDisplay = event.remainingSeats.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US');

                return (
                  <tr key={event.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade">
                    <td style={{ fontWeight: 600 }}>
                      <div className="event-name">{event.name}</div>
                    </td>
                    <td>
                      <div className="event-date">{formatDate(event.date)}</div>
                      <div className="event-time">{formatTime(event.date)}</div>
                    </td>
                    <td>
                      <span className="event-price">{formatPrice(event.price)}</span>
                    </td>
                    <td>
                      <div className="seats-info">
                        <span className="seats-text">
                          {seatsDisplay}
                        </span>
                        <div className="seats-bar">
                          <div className="seats-bar-track">
                            <div
                              className={`seats-bar-fill seats-bar-fill-${seatStatus}`}
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                        </div>
                        <span className="seats-remaining">
                          {remainingDisplay} {t('events.remaining')}
                        </span>
                      </div>
                    </td>
                    <td>
                      {seatStatus === 'critical' ? (
                        <span className="badge badge-failed">
                          <XCircleIcon />
                          {t('events.almostFull')}
                        </span>
                      ) : seatStatus === 'warning' ? (
                        <span className="badge badge-pending">
                          <AlertCircleIcon />
                          {t('events.fillingUp')}
                        </span>
                      ) : (
                        <span className="badge badge-confirmed">
                          <CheckCircleIcon />
                          {t('events.available')}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      
      {!isLoading && totalPages > 1 && (
        <div className="pagination">
          <span className="pagination-info">
            {t('table.page')} <strong>{currentPage.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}</strong> / {totalPages.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}
          </span>
          <div className="pagination-btns" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              {t('table.prev')}
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`pagination-number-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}
              </button>
            ))}

            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              {t('table.next')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import type { Booking, Event } from '@/types';
import { useTranslation } from '../../../context/LanguageContext';

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

interface BookingsListTableProps {
  bookings: Booking[];
  events: Event[];
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  search: string;
  setSearch: (search: string) => void;
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

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'CONFIRMED') return (
    <span className="badge badge-confirmed">
      <CheckCircleIcon />
      CONFIRMED
    </span>
  );
  if (status === 'FAILED') return (
    <span className="badge badge-failed">
      <XCircleIcon />
      FAILED
    </span>
  );
  return (
    <span className="badge badge-pending">
      <AlertCircleIcon />
      PENDING
    </span>
  );
};

export const BookingsListTable: React.FC<BookingsListTableProps> = ({
  bookings,
  events,
  selectedEventId,
  setSelectedEventId,
  selectedStatus,
  setSelectedStatus,
  search,
  setSearch,
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
    selectedEventId !== '',
    selectedStatus !== '',
    search !== '',
    startDate !== '',
    endDate !== ''
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSearch('');
    setSelectedEventId('');
    setSelectedStatus('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="card animate-zoom-in" style={{ animationDelay: '400ms' }}>
      <div className="card-header">
        <div>
          <div className="card-title">{t('table.title')}</div>
          <div className="card-subtitle">{t('table.subtitle')}</div>
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
              {language === 'bn' ? 'অনুসন্ধান করুন' : 'Search'}
            </label>
            <div className="search-input-wrapper">
              <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="filter-input"
                placeholder={t('header.search') + "..."}
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
            <label className="filter-input-label">{t('table.eventName')}</label>
            <select
              className="filter-select-full"
              value={selectedEventId}
              onChange={e => setSelectedEventId(e.target.value)}
            >
              <option value="">{t('table.allEvents')}</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.name}</option>
              ))}
            </select>
          </div>

          
          <div className="filter-group">
            <label className="filter-input-label">{t('table.status')}</label>
            <select
              className="filter-select-full"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
            >
              <option value="">{t('table.allStatuses')}</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="FAILED">FAILED</option>
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
              {(language === 'bn' ? 'সার্চ' : 'Search') + ': "'}
              {search}
              {'"'}
              <button className="filter-tag-close" onClick={() => setSearch('')}>×</button>
            </span>
          )}
          {selectedEventId && (
            <span className="filter-tag">
              {(language === 'bn' ? 'ইভেন্ট' : 'Event') + ': '}
              {events.find(e => e.id === selectedEventId)?.name || 'selected'}
              <button className="filter-tag-close" onClick={() => setSelectedEventId('')}>×</button>
            </span>
          )}
          {selectedStatus && (
            <span className="filter-tag">
              {(language === 'bn' ? 'স্ট্যাটাস' : 'Status') + ': '}
              {selectedStatus}
              <button className="filter-tag-close" onClick={() => setSelectedStatus('')}>×</button>
            </span>
          )}
          {startDate && (
            <span className="filter-tag">
              {(language === 'bn' ? 'শুরু' : 'Start') + ': '}
              {startDate}
              <button className="filter-tag-close" onClick={() => setStartDate('')}>×</button>
            </span>
          )}
          {endDate && (
            <span className="filter-tag">
              {(language === 'bn' ? 'শেষ' : 'End') + ': '}
              {endDate}
              <button className="filter-tag-close" onClick={() => setEndDate('')}>×</button>
            </span>
          )}
        </div>
      )}

      
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('table.refId')}</th>
              <th>{t('table.eventName')}</th>
              <th>{t('table.customerDetails')}</th>
              <th>{t('table.seats')}</th>
              <th>{t('table.status')}</th>
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
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="table-empty">
                    <img src="/logo/page-not-found-688965_1280.png" alt="No bookings found" className="table-empty-img" />
                  </div>
                </td>
              </tr>
            ) : (
              bookings.map(booking => (
                <tr key={booking.id}>
                  <td>
                    <span className="ref-id" title={booking.requestId}>
                      {booking.requestId}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {booking.event?.name || '—'}
                  </td>
                  <td>
                    <div className="customer-name">{booking.customerName}</div>
                    <div className="customer-email">{booking.customerEmail}</div>
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    {booking.seats.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')} {t('table.seatsLabel')}
                  </td>
                  <td>
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))
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

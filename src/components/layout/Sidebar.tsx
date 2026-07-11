import React from 'react';
import { toast } from 'sonner';
import { useTranslation } from '../../context/LanguageContext';


const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const TicketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <line x1="9" y1="12" x2="15" y2="12" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

interface SidebarProps {
  activeBookingCount: number;
  activeTab: 'dashboard' | 'events';
  onTabChange: (tab: 'dashboard' | 'events') => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeBookingCount, activeTab, onTabChange, isOpen, onClose }) => {
  const { t } = useTranslation();

  const handleDevFeature = (featureName: string) => {
    toast.info(t('alerts.underDev', { featureName: t(`sidebar.${featureName.toLowerCase()}`) }), {
      description: t('alerts.stayTuned'),
      duration: 3500,
    });
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Mobile close button */}
      <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon has-img">
          <img src="/logo/611-6117512_booking-icon-font-awesome-clipart-png-download-calendar.png" alt="WeNexus Logo" />
        </div>
        <div className="sidebar-logo-text-group">
          <span className="sidebar-logo-text">WeNexus</span>
          <span className="sidebar-logo-subtext">Event Booking</span>
        </div>
      </div>

      
      <div className="sidebar-section">
        <div className="sidebar-section-label">{t('sidebar.menu')}</div>
        <nav className="sidebar-nav">
          <div
            className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => onTabChange('dashboard')}
          >
            <TicketIcon />
            <span>{t('sidebar.bookings')}</span>
            {activeBookingCount > 0 && (
              <span className="sidebar-nav-badge">{activeBookingCount > 99 ? '99+' : activeBookingCount}</span>
            )}
          </div>
          <div
            className={`sidebar-nav-item ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => onTabChange('events')}
          >
            <CalendarIcon />
            <span>{t('sidebar.events')}</span>
          </div>
        </nav>
      </div>

      
      <div className="sidebar-section" style={{ marginTop: 'auto' }}>
        <div className="sidebar-section-label">{t('sidebar.general')}</div>
        <nav className="sidebar-nav">
          <div className="sidebar-nav-item" onClick={() => handleDevFeature('Settings')}>
            <SettingsIcon />
            <span>{t('sidebar.settings')}</span>
          </div>
          <div className="sidebar-nav-item" onClick={() => handleDevFeature('Logout')}>
            <LogoutIcon />
            <span>{t('sidebar.logout')}</span>
          </div>
        </nav>
      </div>
    </aside>
  );
};

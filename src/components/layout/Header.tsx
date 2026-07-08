import React from 'react';
import { useTranslation } from '../../context/LanguageContext';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();

  return (
    <header className="header">
      
      <div className="header-search">
        <SearchIcon />
        <input type="text" placeholder={t('header.search')} />
        <span className="header-search-kbd">⌘F</span>
      </div>

      
      <div className="header-actions">
        <button className="header-icon-btn">
          <MailIcon />
        </button>
        <button className="header-icon-btn">
          <BellIcon />
          <span className="header-notif-dot" />
        </button>

        <div className="header-divider" />

        
        <div className="header-user">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80"
            alt="Md Hakim"
            className="header-user-avatar"
          />
          <div className="header-user-info">
            <span className="header-user-name">Md Hakim</span>
            <span className="header-user-email">hakim@wenexus.io</span>
          </div>
        </div>

        
        <div className="lang-toggle-container">
          <button
            className={`lang-toggle-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            English
          </button>
          <button
            className={`lang-toggle-btn ${language === 'bn' ? 'active' : ''}`}
            onClick={() => setLanguage('bn')}
          >
            বাংলা
          </button>
        </div>
      </div>
    </header>
  );
};

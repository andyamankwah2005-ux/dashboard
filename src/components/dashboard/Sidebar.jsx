import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ currentView, onSelectView, mobileOpen, onCloseMobile }) {
  const { theme, toggleTheme, adminConfig, account, navigate } = useApp();
  const { branding, widgets } = adminConfig;

  const handleNavClick = (tab) => {
    onSelectView(tab);
    onCloseMobile();
  };

  return (
    <>
      <aside className={`sidebar${mobileOpen ? ' mobile-open' : ''}`} id="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand-row">
            <a
              className="brand-wrapper"
              id="brandLogo"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('dashboard');
              }}
            >
              <div className="brand-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="brand-name">
                {branding.appName || 'Mission 3'}{' '}
                <span className="brand-badge">{branding.appBadge || 'PRO'}</span>
              </div>
            </a>
            <button
              className="mobile-close-btn"
              id="mobileCloseBtn"
              aria-label="Close menu"
              onClick={onCloseMobile}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="nav-section">
            <div className="nav-label">Navigation</div>

            <a
              className={`nav-item${currentView === 'dashboard' ? ' active' : ''}`}
              id="navDashboard"
              onClick={() => handleNavClick('dashboard')}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
              </svg>
              <span>Dashboard</span>
            </a>

            {widgets.navTrades !== false && (
              <a
                className={`nav-item${currentView === 'trades' ? ' active' : ''}`}
                id="navTrades"
                onClick={() => handleNavClick('trades')}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
                <span>Trades</span>
              </a>
            )}

            {widgets.navAnalytics !== false && (
              <a
                className={`nav-item${currentView === 'analytics' ? ' active' : ''}`}
                id="navAnalytics"
                onClick={() => handleNavClick('analytics')}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                <span>Analytics</span>
              </a>
            )}

            {widgets.navCalendar !== false && (
              <a
                className={`nav-item${currentView === 'calendar' ? ' active' : ''}`}
                id="navCalendar"
                onClick={() => handleNavClick('calendar')}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Calendar</span>
              </a>
            )}

            {widgets.navSettings !== false && (
              <a
                className={`nav-item${currentView === 'settings' ? ' active' : ''}`}
                id="navSettings"
                onClick={() => handleNavClick('settings')}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Settings</span>
              </a>
            )}

            <a
              href="/admin"
              className="nav-item"
              id="navAdmin"
              style={{
                color: '#60a5fa',
                marginTop: '6px',
                background: 'rgba(59, 130, 246, 0.08)'
              }}
              onClick={(e) => {
                e.preventDefault();
                onCloseMobile();
                navigate('/admin');
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              <span>Admin Studio</span>
            </a>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="theme-toggle-wrap">
            <span className="theme-toggle-label">Theme Mode</span>
            <button
              className="theme-toggle-pill"
              id="themeToggleBtn"
              aria-label="Toggle dark/light theme"
              title="Toggle Dark/Light Mode"
              onClick={toggleTheme}
            >
              <span className="theme-icon light-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </span>
              <span className="theme-icon dark-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </span>
              <span className="theme-toggle-thumb" />
            </button>
          </div>

          <div className="user-profile-card" id="userProfileBtn">
            <img src={account.avatar} alt="User Avatar" className="user-avatar" />
            <div className="user-info">
              <span className="user-name">{branding.traderName || account.name}</span>
              <span className="user-handle">{branding.traderHandle || account.handle}</span>
            </div>
          </div>
        </div>
      </aside>

      <div
        className={`sidebar-backdrop${mobileOpen ? ' mobile-open' : ''}`}
        id="sidebarBackdrop"
        onClick={onCloseMobile}
      />
    </>
  );
}


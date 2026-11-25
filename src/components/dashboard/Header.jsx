import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Header({ currentView, onOpenMobileMenu, onOpenAddTrade }) {
  const { theme, toggleTheme, adminConfig, trades, navigate } = useApp();
  const { branding, widgets } = adminConfig;

  const viewMeta = {
    dashboard: {
      title: branding.dashboardTitle || 'Main Dashboard (Overview)',
      subtitle: 'Live Portfolio Feed'
    },
    trades: {
      title: 'Trades Journal & History',
      subtitle: `${trades.length} Total Executions`
    },
    analytics: {
      title: 'Performance Analytics',
      subtitle: 'Risk & Alpha Breakdown'
    },
    calendar: {
      title: 'Economic & Trade Calendar',
      subtitle: 'Upcoming Market Events'
    },
    settings: {
      title: 'Account Settings',
      subtitle: 'Platform Preferences'
    }
  };

  const { title, subtitle } = viewMeta[currentView] || viewMeta.dashboard;

  return (
    <header className="canvas-header">
      <div className="header-left-wrap">
        <button
          className="mobile-menu-trigger"
          id="mobileMenuTrigger"
          aria-label="Open navigation"
          onClick={onOpenMobileMenu}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="header-title-wrap">
          <h1 className="canvas-title" id="pageMainTitle">
            {title}
          </h1>
          <div className="live-pulse-badge">
            <span className="live-dot" />
            <span id="pageLiveSubtitle">{subtitle}</span>
          </div>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="header-theme-btn"
          id="headerThemeBtn"
          aria-label="Toggle Theme"
          title="Toggle Dark/Light Mode"
          onClick={toggleTheme}
        >
          <svg
            className="sun-svg"
            width="16"
            height="16"
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
          <svg
            className="moon-svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <span className="theme-text-status">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {widgets.addTradeModule !== false && (
          <button className="btn-trade-action" id="openAddTradeModalBtn" onClick={onOpenAddTrade}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>+ Add Trade</span>
          </button>
        )}

        <a
          href="/admin"
          className="btn-primary-dark"
          style={{ textDecoration: 'none' }}
          onClick={(e) => {
            e.preventDefault();
            navigate('/admin');
          }}
        >
          <span>Customize Studio</span>
        </a>
      </div>
    </header>
  );
}


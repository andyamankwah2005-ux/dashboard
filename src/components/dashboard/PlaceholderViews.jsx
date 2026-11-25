import React from 'react';
import { useApp } from '../../context/AppContext';

export function AnalyticsView({ onReturnOverview }) {
  return (
    <div className="view-panel active" id="viewAnalytics">
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>
          Analytics &amp; Risk Engine
        </h2>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '13px',
            maxWidth: '500px',
            margin: '0 auto 20px'
          }}
        >
          Detailed Sharpe ratio analysis, Maximum Adverse Excursion (MAE), and risk distributions.
        </p>
        <button className="btn-secondary" onClick={onReturnOverview}>
          Return to Overview
        </button>
      </div>
    </div>
  );
}

export function CalendarView({ onReturnOverview }) {
  return (
    <div className="view-panel active" id="viewCalendar">
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>
          Trading &amp; Economic Calendar
        </h2>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '13px',
            maxWidth: '500px',
            margin: '0 auto 20px'
          }}
        >
          Upcoming CPI releases, FOMC meetings, and trade journal profit calendar.
        </p>
        <button className="btn-secondary" onClick={onReturnOverview}>
          Return to Overview
        </button>
      </div>
    </div>
  );
}

export function SettingsView() {
  const { navigate } = useApp();
  return (
    <div className="view-panel active" id="viewSettings">
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>
          Account Settings
        </h2>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '13px',
            maxWidth: '500px',
            margin: '0 auto 20px'
          }}
        >
          Manage leverage multipliers, risk limits, API keys, and notification channels.
        </p>
        <a
          href="/admin"
          className="btn-primary-save"
          style={{ display: 'inline-flex', textDecoration: 'none' }}
          onClick={(e) => {
            e.preventDefault();
            navigate('/admin');
          }}
        >
          Open Admin Studio
        </a>
      </div>
    </div>
  );
}


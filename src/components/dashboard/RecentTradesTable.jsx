import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const FILTER_OPTIONS = [
  { key: 'ALL', label: 'All (1,284)' },
  { key: 'WON', label: 'Wins Only (980)' },
  { key: 'LOST', label: 'Losses Only (304)' },
  { key: 'CRYPTO', label: 'Crypto' },
  { key: 'STOCKS', label: 'Equities' }
];

export default function RecentTradesTable() {
  const { trades } = useApp();
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filtered = trades.filter((t) => {
    if (activeFilter === 'WON') return t.status === 'WON';
    if (activeFilter === 'LOST') return t.status === 'LOST';
    if (activeFilter === 'CRYPTO') {
      return (
        t.symbol.includes('-') ||
        t.symbol.includes('BTC') ||
        t.symbol.includes('ETH') ||
        t.symbol.includes('SOL')
      );
    }
    if (activeFilter === 'STOCKS') {
      return !t.symbol.includes('-') && !t.symbol.includes('/');
    }
    return true;
  });

  return (
    <section className="card" id="widget-recent-trades">
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 className="card-title">Recent Trades Preview</h2>
          <div className="card-subtitle">
            Detailed execution history, profit/loss, and trade analytics
          </div>
        </div>

        <div className="trades-filter-group" id="tradeFilters">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`filter-pill${activeFilter === opt.key ? ' active' : ''}`}
              onClick={() => setActiveFilter(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="positions-table-wrap">
        <table className="data-table" id="recentTradesTable">
          <thead>
            <tr>
              <th>Trade ID</th>
              <th>Asset</th>
              <th>Side</th>
              <th>Entry Price</th>
              <th>Exit Price</th>
              <th>Position Size</th>
              <th>Profit / Loss</th>
              <th>Duration</th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="recentTradesTableBody">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}
                >
                  No trades match this filter category.
                </td>
              </tr>
            ) : (
              filtered.map((t) => {
                const isWon = t.status === 'WON';
                return (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '11px' }}>
                      {t.id}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.symbol}</td>
                    <td>
                      <span
                        className={`table-badge ${t.type === 'LONG' ? 'badge-long' : 'badge-short'}`}
                      >
                        {t.side}
                      </span>
                    </td>
                    <td>
                      ${parseFloat(t.entry).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      ${parseFloat(t.exit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td>{t.size}</td>
                    <td style={{ fontWeight: 800, color: isWon ? '#059669' : '#e11d48' }}>
                      {isWon ? '+' : ''}${parseFloat(t.pnl).toFixed(2)} ({isWon ? '+' : ''}
                      {parseFloat(t.pnlPercent || 0).toFixed(2)}%)
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{t.duration || '2h'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{t.time}</td>
                    <td>
                      <span className={`status-badge ${isWon ? 'status-won' : 'status-lost'}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}


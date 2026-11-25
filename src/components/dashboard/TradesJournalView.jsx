import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function TradesJournalView({ onOpenAddTrade, onOpenImageViewer }) {
  const { trades, adminConfig } = useApp();
  const [activeTag, setActiveTag] = useState('ALL');
  const tags = adminConfig.tags || ['Scalping', 'Swing', 'News Trade', 'Breakout'];

  const wonCount = trades.filter((t) => t.status === 'WON').length;
  const winRate = trades.length ? ((wonCount / trades.length) * 100).toFixed(1) : '0.0';

  const filtered =
    activeTag === 'ALL' ? trades : trades.filter((t) => t.tag === activeTag);

  return (
    <div className="view-panel active" id="viewTrades">
      <div className="trades-journal-header">
        <div className="journal-stats-trio">
          <div className="journal-stat-card">
            <span className="j-stat-label">Logged Trades</span>
            <strong className="j-stat-val" id="journalTotalLogged">
              {trades.length.toLocaleString()}
            </strong>
          </div>
          <div className="journal-stat-card">
            <span className="j-stat-label">Journal Win Rate</span>
            <strong className="j-stat-val" style={{ color: '#059669' }} id="journalWinRate">
              {winRate}%
            </strong>
          </div>
          <div className="journal-stat-card">
            <span className="j-stat-label">Avg R:R Ratio</span>
            <strong className="j-stat-val">1 : 2.85</strong>
          </div>
        </div>

        {adminConfig.widgets?.addTradeModule !== false && (
          <button className="btn-trade-action" id="openAddTradeBtnJournal" onClick={onOpenAddTrade}>
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
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 className="card-title">Trade Log &amp; Performance Journal</h2>
            <div className="card-subtitle">
              Complete records with screenshots, tags, stop loss / take profit, and thesis notes
            </div>
          </div>

          <div className="trades-filter-group" id="journalFilterTags">
            <button
              className={`filter-pill${activeTag === 'ALL' ? ' active' : ''}`}
              onClick={() => setActiveTag('ALL')}
            >
              All Tags
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                className={`filter-pill${activeTag === tag ? ' active' : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="trades-journal-grid" id="journalTradesContainer">
          {filtered.length === 0 ? (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: 'var(--text-muted)'
              }}
            >
              No trades logged under tag: <strong>{activeTag}</strong>. Click{' '}
              <strong>+ Add Trade</strong> to record one!
            </div>
          ) : (
            filtered.map((t) => {
              const isWon = t.status === 'WON';
              const isBE = t.status === 'BREAK-EVEN';
              const statusColor = isWon ? '#059669' : isBE ? '#f59e0b' : '#e11d48';
              const statusBg = isWon
                ? 'var(--color-green-bg)'
                : isBE
                ? '#fef3c7'
                : 'var(--color-red-bg)';

              return (
                <div className="trade-card-item" key={t.id}>
                  {t.screenshot && (
                    <div
                      className="trade-card-thumb-wrap"
                      onClick={() =>
                        onOpenImageViewer(t.screenshot, `${t.symbol} - ${t.side} (${t.id})`)
                      }
                    >
                      <img src={t.screenshot} alt={t.symbol} className="trade-card-thumb" />
                      <div className="trade-thumb-overlay-hint">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="15 3 21 3 21 9" />
                          <polyline points="9 21 3 21 3 15" />
                          <line x1="21" y1="3" x2="14" y2="10" />
                          <line x1="3" y1="21" x2="10" y2="14" />
                        </svg>
                        <span style={{ marginLeft: '6px' }}>View Full Screenshot</span>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-main)' }}>
                        {t.symbol}
                      </span>
                      <span className={`table-badge ${t.type === 'LONG' ? 'badge-long' : 'badge-short'}`}>
                        {t.side}
                      </span>
                    </div>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: statusBg, color: statusColor }}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)',
                        color: statusColor
                      }}
                    >
                      {isWon ? '+' : ''}${parseFloat(t.pnl).toFixed(2)}
                    </div>
                    <span className="trade-card-tag-badge">{t.tag || 'Trade'}</span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '6px',
                      fontSize: '11px',
                      background: 'var(--canvas-bg)',
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Entry:</span>{' '}
                      <strong style={{ fontFamily: 'var(--font-mono)' }}>
                        ${parseFloat(t.entry).toLocaleString()}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Exit:</span>{' '}
                      <strong style={{ fontFamily: 'var(--font-mono)' }}>
                        ${parseFloat(t.exit).toLocaleString()}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Stop Loss:</span>{' '}
                      <strong style={{ fontFamily: 'var(--font-mono)', color: '#e11d48' }}>
                        {t.stopLoss ? `$${parseFloat(t.stopLoss).toLocaleString()}` : 'N/A'}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Take Profit:</span>{' '}
                      <strong style={{ fontFamily: 'var(--font-mono)', color: '#059669' }}>
                        {t.takeProfit ? `$${parseFloat(t.takeProfit).toLocaleString()}` : 'N/A'}
                      </strong>
                    </div>
                  </div>

                  {t.notes && <div className="trade-card-notes">“{t.notes}”</div>}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '10.5px',
                      color: 'var(--text-muted)',
                      borderTop: '1px dashed var(--card-border)',
                      paddingTop: '8px'
                    }}
                  >
                    <span>ID: {t.id}</span>
                    <span>{t.time}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}


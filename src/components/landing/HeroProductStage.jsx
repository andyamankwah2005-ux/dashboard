import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import EquityCurveChart from '../charts/EquityCurveChart';
import { RECENT_TRADES } from '../../data/mockData';

export default function HeroProductStage() {
  const { equityData, navigate } = useApp();
  const [stageTab, setStageTab] = useState('overview');

  return (
    <div className="wink-stage-sheet">
      <div className="wink-stage-chrome">
        <div className="wink-chrome-dots">
          <span />
          <span />
          <span />
        </div>
        <span>mission3.app/dashboard — Live Portfolio Feed</span>
        <span style={{ fontSize: '11px', fontWeight: 500 }}>76.4% Win Rate</span>
      </div>

      {/* Authentic Mission 3 Workspace Preview */}
      <div className="stage-app-shell">
        <aside className="stage-mini-sidebar">
          <div className="stage-mini-brand">
            <span className="wink-brand-mark" style={{ width: '22px', height: '22px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </span>
            <span>Mission 3</span>
          </div>

          <button
            type="button"
            className={`stage-nav-pill${stageTab === 'overview' ? ' active' : ''}`}
            onClick={() => setStageTab('overview')}
          >
            Dashboard Overview
          </button>
          <button
            type="button"
            className={`stage-nav-pill${stageTab === 'journal' ? ' active' : ''}`}
            onClick={() => setStageTab('journal')}
          >
            Trades Journal
          </button>
          <button
            type="button"
            className="stage-nav-pill"
            onClick={() => navigate('/admin')}
          >
            Admin Studio →
          </button>
        </aside>

        <div className="stage-mini-main">
          <div className="stage-mini-topbar">
            <div>
              <div className="stage-mini-title">
                {stageTab === 'overview'
                  ? 'Main Dashboard (Overview)'
                  : 'Trades Journal & History'}
              </div>
              <div className="stage-mini-sub">
                {stageTab === 'overview'
                  ? 'Cumulative equity, win/loss telemetry & recent executions'
                  : 'Chart screenshots, SL/TP levels, strategy tags & reflection notes'}
              </div>
            </div>
            <button
              type="button"
              className="wink-btn-primary nav-compact"
              onClick={() => navigate('/dashboard')}
            >
              Open Full App
            </button>
          </div>

          {stageTab === 'overview' ? (
            <>
              <div className="stage-kpi-grid">
                <div className="stage-kpi-card">
                  <span className="stage-kpi-label">Total Trades</span>
                  <strong className="stage-kpi-val">1,284</strong>
                  <span className="stage-kpi-delta pos">+18 this week</span>
                </div>
                <div className="stage-kpi-card">
                  <span className="stage-kpi-label">Win Rate</span>
                  <strong className="stage-kpi-val">76.4%</strong>
                  <span className="stage-kpi-delta pos">980W / 304L</span>
                </div>
                <div className="stage-kpi-card">
                  <span className="stage-kpi-label">Drawdown</span>
                  <strong className="stage-kpi-val">3.2%</strong>
                  <span className="stage-kpi-delta">Max DD: 6.8%</span>
                </div>
                <div className="stage-kpi-card">
                  <span className="stage-kpi-label">Realized P&amp;L</span>
                  <strong className="stage-kpi-val" style={{ color: '#059669' }}>
                    +$142,850
                  </strong>
                  <span className="stage-kpi-delta pos">+24.6% ROI</span>
                </div>
              </div>

              <div className="stage-chart-box">
                <div className="stage-chart-head">
                  <span>Equity Curve vs. Benchmark</span>
                  <span className="stage-chart-badge">PF 2.42 · 8 Win Streak</span>
                </div>
                <div style={{ height: '190px', width: '100%' }}>
                  <EquityCurveChart data={equityData} />
                </div>
              </div>

              <div className="stage-trades-preview">
                {RECENT_TRADES.slice(0, 3).map((t) => {
                  const isWon = t.status === 'WON';
                  return (
                    <div className="stage-trade-row" key={t.id}>
                      <span className="stage-trade-sym">{t.symbol}</span>
                      <span className="stage-trade-side">{t.side}</span>
                      <span className="stage-trade-tag">{t.tag}</span>
                      <span
                        className="stage-trade-pnl"
                        style={{ color: isWon ? '#059669' : '#e11d48' }}
                      >
                        {isWon ? '+' : ''}${t.pnl.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="stage-journal-grid">
              {RECENT_TRADES.slice(0, 2).map((t) => (
                <div className="stage-journal-card" key={t.id}>
                  <img
                    src={t.screenshot}
                    alt={t.symbol}
                    className="stage-journal-img"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="stage-journal-meta">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{t.symbol}</strong>
                      <span style={{ color: '#059669', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        +${t.pnl.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#757575', marginTop: '4px' }}>
                      Entry ${t.entry.toLocaleString()} · SL ${t.stopLoss.toLocaleString()} · TP ${t.takeProfit.toLocaleString()}
                    </div>
                    <p style={{ fontSize: '12px', color: '#1a1a1a', marginTop: '6px', lineHeight: 1.4 }}>
                      “{t.notes}”
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


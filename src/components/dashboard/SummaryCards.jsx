import React from 'react';
import { useApp } from '../../context/AppContext';

export default function SummaryCards() {
  const { account } = useApp();
  const totalTrades = account.totalTrades ?? 1284;
  const winRate = account.winRate ?? 76.4;
  const drawdown = account.currentDrawdown ?? 3.2;
  const pnl = account.totalPnL ?? 142850.0;

  return (
    <section className="overview-summary-row" id="metricsRow">
      {/* Summary Card 1: Total Trades */}
      <div className="metric-card" id="cardTotalTrades">
        <div className="metric-content">
          <div className="metric-label">Total Trades</div>
          <div className="metric-value" id="valTotalTrades">
            {totalTrades.toLocaleString()} <span className="metric-unit">trades</span>
          </div>
          <div className="metric-delta positive">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
            <span>+18 executed this week</span>
          </div>
        </div>
        <div className="sparkline-bars">
          <div className="spark-bar" style={{ height: '18px' }} />
          <div className="spark-bar" style={{ height: '32px' }} />
          <div className="spark-bar" style={{ height: '24px' }} />
          <div className="spark-bar" style={{ height: '44px' }} />
          <div className="spark-bar" style={{ height: '38px' }} />
        </div>
      </div>

      {/* Summary Card 2: Win Rate (%) */}
      <div className="metric-card" id="cardWinRate">
        <div className="metric-content">
          <div className="metric-label">Win Rate (%)</div>
          <div className="metric-value" id="valWinRate">
            {Number(winRate).toFixed(1)}
            <span className="metric-unit">%</span>
          </div>
          <div className="metric-delta positive">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
            <span>980 Wins / 304 Losses</span>
          </div>
        </div>
        <div className="sparkline-bars">
          <div className="spark-bar alt-green" style={{ height: '20px' }} />
          <div className="spark-bar alt-green" style={{ height: '36px' }} />
          <div className="spark-bar alt-green" style={{ height: '30px' }} />
          <div className="spark-bar alt-green" style={{ height: '46px' }} />
          <div className="spark-bar alt-green" style={{ height: '42px' }} />
        </div>
      </div>

      {/* Summary Card 3: Current Drawdown (%) */}
      <div className="metric-card" id="cardDrawdown">
        <div className="metric-content">
          <div className="metric-label">Current Drawdown (%)</div>
          <div className="metric-value" id="valDrawdown">
            {Number(drawdown).toFixed(1)}
            <span className="metric-unit">%</span>
          </div>
          <div className="metric-delta" style={{ color: '#059669' }}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Max DD: 6.8% (Safe)</span>
          </div>
        </div>
        <div className="sparkline-bars">
          <div className="spark-bar alt-orange" style={{ height: '26px' }} />
          <div className="spark-bar alt-orange" style={{ height: '20px' }} />
          <div className="spark-bar alt-orange" style={{ height: '14px' }} />
          <div className="spark-bar alt-orange" style={{ height: '18px' }} />
          <div className="spark-bar alt-orange" style={{ height: '12px' }} />
        </div>
      </div>

      {/* Summary Card 4: Profit/Loss */}
      <div className="metric-card" id="cardProfitLoss">
        <div className="metric-content">
          <div className="metric-label">Total Realized Profit / Loss</div>
          <div
            className="metric-value"
            id="valProfitLoss"
            style={{ color: pnl >= 0 ? '#059669' : '#e11d48' }}
          >
            {pnl >= 0 ? '+' : '-'}$
            {Math.abs(pnl).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>
          <div className="metric-delta positive">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
            <span>+24.6% All-time ROI</span>
          </div>
        </div>
        <div className="sparkline-bars">
          <div className="spark-bar alt-green" style={{ height: '22px' }} />
          <div className="spark-bar alt-green" style={{ height: '34px' }} />
          <div className="spark-bar alt-green" style={{ height: '28px' }} />
          <div className="spark-bar alt-green" style={{ height: '48px' }} />
          <div className="spark-bar alt-green" style={{ height: '44px' }} />
        </div>
      </div>
    </section>
  );
}


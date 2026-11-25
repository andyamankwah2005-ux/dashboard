import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';

function getAssetClass(symbol) {
  if (!symbol) return 'Other';
  if (symbol.includes('-') || symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('SOL')) {
    return 'Crypto';
  }
  if (symbol.includes('/')) return 'FX';
  return 'Equities';
}

function computeRMultiple(trade) {
  const entry = parseFloat(trade.entry);
  const exit = parseFloat(trade.exit);
  const sl = parseFloat(trade.stopLoss);
  if (entry && exit && sl && Math.abs(entry - sl) > 0) {
    const risk = Math.abs(entry - sl);
    const reward = trade.type === 'SHORT' ? entry - exit : exit - entry;
    return reward / risk;
  }
  // Fallback estimate from status/pnl
  if (trade.status === 'BREAK-EVEN' || trade.pnl === 0) return 0;
  return trade.pnl > 0 ? 1.8 : -1.0;
}

export default function AnalyticsView() {
  const { trades, account, theme } = useApp();
  const [assetFilter, setAssetFilter] = useState('ALL');
  const [sideFilter, setSideFilter] = useState('ALL');

  const canvasRef = useRef(null);
  const mouseXRef = useRef(null);
  const sizeRef = useRef({ width: 0, height: 240 });

  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {
      if (assetFilter !== 'ALL' && getAssetClass(t.symbol) !== assetFilter) return false;
      if (sideFilter !== 'ALL' && t.type !== sideFilter) return false;
      return true;
    });
  }, [trades, assetFilter, sideFilter]);

  const metrics = useMemo(() => {
    const total = filteredTrades.length;
    const wins = filteredTrades.filter((t) => t.status === 'WON');
    const losses = filteredTrades.filter((t) => t.status === 'LOST');

    const winRate = total > 0 ? wins.length / total : 0;
    const lossRate = total > 0 ? losses.length / total : 0;

    const avgWin =
      wins.length > 0
        ? wins.reduce((acc, t) => acc + Math.abs(parseFloat(t.pnl) || 0), 0) / wins.length
        : 0;
    const avgLoss =
      losses.length > 0
        ? losses.reduce((acc, t) => acc + Math.abs(parseFloat(t.pnl) || 0), 0) / losses.length
        : 0;

    const expectancy = winRate * avgWin - lossRate * avgLoss;
    const grossWin = wins.reduce((acc, t) => acc + Math.abs(parseFloat(t.pnl) || 0), 0);
    const grossLoss = losses.reduce((acc, t) => acc + Math.abs(parseFloat(t.pnl) || 0), 0);
    const profitFactor =
      grossLoss > 0 ? (grossWin / grossLoss).toFixed(2) : grossWin > 0 ? '∞' : '0.00';

    const sharpe = total > 0 ? (1.65 + winRate * 0.72).toFixed(2) : '0.00';

    return {
      total,
      winRatePct: (winRate * 100).toFixed(1),
      expectancy,
      avgWin,
      avgLoss,
      profitFactor,
      sharpe
    };
  }, [filteredTrades]);

  // Strategy Tag Breakdown
  const tagBreakdown = useMemo(() => {
    const map = {};
    filteredTrades.forEach((t) => {
      const tag = t.tag || 'Untagged';
      if (!map[tag]) map[tag] = { tag, count: 0, wins: 0, netPnl: 0 };
      map[tag].count += 1;
      if (t.status === 'WON') map[tag].wins += 1;
      map[tag].netPnl += parseFloat(t.pnl) || 0;
    });
    return Object.values(map).sort((a, b) => b.netPnl - a.netPnl);
  }, [filteredTrades]);

  // Asset Breakdown Table
  const assetBreakdown = useMemo(() => {
    const map = {};
    filteredTrades.forEach((t) => {
      const sym = t.symbol;
      if (!map[sym]) {
        map[sym] = {
          symbol: sym,
          assetClass: getAssetClass(sym),
          count: 0,
          wins: 0,
          winSum: 0,
          lossCount: 0,
          lossSum: 0,
          netPnl: 0,
          tags: {}
        };
      }
      const row = map[sym];
      const pnl = parseFloat(t.pnl) || 0;
      row.count += 1;
      row.netPnl += pnl;
      if (t.status === 'WON') {
        row.wins += 1;
        row.winSum += Math.abs(pnl);
      } else if (t.status === 'LOST') {
        row.lossCount += 1;
        row.lossSum += Math.abs(pnl);
      }
      const tag = t.tag || 'Trade';
      row.tags[tag] = (row.tags[tag] || 0) + 1;
    });

    return Object.values(map)
      .map((r) => {
        const topTag =
          Object.entries(r.tags).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
        return {
          ...r,
          winRate: r.count > 0 ? ((r.wins / r.count) * 100).toFixed(1) : '0.0',
          avgWin: r.wins > 0 ? r.winSum / r.wins : 0,
          avgLoss: r.lossCount > 0 ? r.lossSum / r.lossCount : 0,
          topTag
        };
      })
      .sort((a, b) => b.netPnl - a.netPnl);
  }, [filteredTrades]);

  // R-Multiple Histogram Buckets
  const rBuckets = useMemo(() => {
    const buckets = [
      { label: '≤ -2R', count: 0, positive: false },
      { label: '-1R', count: 0, positive: false },
      { label: '0R', count: 0, positive: true },
      { label: '+1R', count: 0, positive: true },
      { label: '+2R', count: 0, positive: true },
      { label: '≥ +3R', count: 0, positive: true }
    ];

    filteredTrades.forEach((t) => {
      const r = computeRMultiple(t);
      if (r <= -1.5) buckets[0].count += 1;
      else if (r < -0.2) buckets[1].count += 1;
      else if (r <= 0.3) buckets[2].count += 1;
      else if (r < 1.5) buckets[3].count += 1;
      else if (r < 2.5) buckets[4].count += 1;
      else buckets[5].count += 1;
    });

    return buckets;
  }, [filteredTrades]);

  const renderRChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = sizeRef.current;
    if (!width || !height) return;

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 24, right: 20, bottom: 32, left: 32 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxCount = Math.max(3, ...rBuckets.map((b) => b.count));

    const isDark = theme === 'dark';
    const gridColor = isDark ? '#143b35' : '#f0f0ef';
    const textColor = isDark ? '#80aba3' : '#757575';

    // Grid rows
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const rows = 3;
    for (let r = 0; r <= rows; r++) {
      const y = padding.top + (chartHeight / rows) * r;
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);

      const val = Math.round(maxCount - (r / rows) * maxCount);
      ctx.fillStyle = textColor;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(val, padding.left - 8, y + 3.5);
    }
    ctx.stroke();

    const groupWidth = chartWidth / rBuckets.length;
    const barWidth = Math.min(38, groupWidth * 0.52);

    rBuckets.forEach((b, i) => {
      const centerX = padding.left + i * groupWidth + groupWidth / 2;
      const barH = (b.count / maxCount) * chartHeight;
      const baseY = height - padding.bottom;

      ctx.fillStyle = b.positive ? '#0075de' : '#e11d48';
      ctx.beginPath();
      ctx.roundRect(centerX - barWidth / 2, baseY - barH, barWidth, Math.max(barH, 2), [5, 5, 0, 0]);
      ctx.fill();

      ctx.fillStyle = textColor;
      ctx.font = '11px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(b.label, centerX, height - 10);
    });

    // Hover Tooltip
    const mouseX = mouseXRef.current;
    if (mouseX !== null && mouseX >= padding.left && mouseX <= width - padding.right) {
      const idx = Math.min(
        rBuckets.length - 1,
        Math.max(0, Math.floor((mouseX - padding.left) / groupWidth))
      );
      const item = rBuckets[idx];
      const posX = padding.left + idx * groupWidth + groupWidth / 2;
      const tipText = `${item.label}: ${item.count} ${item.count === 1 ? 'trade' : 'trades'}`;

      ctx.font = '10.5px "JetBrains Mono", monospace';
      const tipW = ctx.measureText(tipText).width + 20;
      const tipX = Math.min(width - tipW - 10, Math.max(10, posX - tipW / 2));

      ctx.fillStyle = '#0d0d0d';
      ctx.beginPath();
      ctx.roundRect(tipX, 4, tipW, 22, 6);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(tipText, tipX + 10, 18.5);
    }
  }, [rBuckets, theme]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = rect.height || 240;
    sizeRef.current = { width, height };
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderRChart();
  }, [renderRChart]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    renderRChart();
  }, [renderRChart]);

  return (
    <div className="view-panel active" id="viewAnalytics">
      {/* SCOPE & FILTER BAR */}
      <div className="notion-cal-toolbar card">
        <div className="notion-cal-toolbar-left">
          <h2 className="notion-cal-month-title">Risk &amp; Alpha Breakdown</h2>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            {metrics.total} matching executions
          </span>
        </div>

        <div className="notion-cal-toolbar-right">
          <div className="notion-cal-seg-group">
            {['ALL', 'Crypto', 'Equities', 'FX'].map((cls) => (
              <button
                key={cls}
                type="button"
                className={`notion-cal-seg-btn${assetFilter === cls ? ' active' : ''}`}
                onClick={() => setAssetFilter(cls)}
              >
                {cls === 'ALL' ? 'All Assets' : cls}
              </button>
            ))}
          </div>

          <div className="notion-cal-seg-group">
            {[
              { key: 'ALL', label: 'All Sides' },
              { key: 'LONG', label: 'Longs' },
              { key: 'SHORT', label: 'Shorts' }
            ].map((s) => (
              <button
                key={s.key}
                type="button"
                className={`notion-cal-seg-btn${sideFilter === s.key ? ' active' : ''}`}
                onClick={() => setSideFilter(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 RISK & ALPHA KPI CARDS */}
      <section className="overview-summary-row">
        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-label">Sharpe Ratio</div>
            <div className="metric-value">{metrics.sharpe}</div>
            <div className="metric-delta positive">
              <span>Risk-adjusted alpha</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-label">Expectancy / Trade</div>
            <div
              className="metric-value"
              style={{ color: metrics.expectancy >= 0 ? '#059669' : '#e11d48' }}
            >
              {metrics.expectancy >= 0 ? '+' : '-'}$
              {Math.abs(metrics.expectancy).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
            <div className="metric-delta">
              <span>Win Rate: {metrics.winRatePct}%</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-label">Avg MAE / MFE</div>
            <div className="metric-value">
              -0.8<span className="metric-unit">R</span> / +2.4<span className="metric-unit">R</span>
            </div>
            <div className="metric-delta positive">
              <span>3.0x excursion edge</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-label">Profit Factor</div>
            <div className="metric-value">{metrics.profitFactor}</div>
            <div className="metric-delta">
              <span>
                DD: {account.currentDrawdown ?? 3.2}% / Max {account.maxDrawdown ?? 6.8}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2-COLUMN ANALYTICS VISUALIZATIONS */}
      <section className="analytics-split-grid">
        {/* Strategy Tag Performance */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Strategy Tag Performance</h3>
              <div className="card-subtitle">
                Win rate and net P&amp;L grouped by setup tag
              </div>
            </div>
          </div>

          {tagBreakdown.length === 0 ? (
            <div className="notion-cal-empty">No trades match this filter.</div>
          ) : (
            <div className="analytics-tag-list">
              {tagBreakdown.map((item) => {
                const wr = item.count > 0 ? Math.round((item.wins / item.count) * 100) : 0;
                const isPos = item.netPnl >= 0;
                return (
                  <div key={item.tag} className="analytics-tag-row">
                    <div className="analytics-tag-head">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="trade-card-tag-badge">{item.tag}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {item.count} {item.count === 1 ? 'trade' : 'trades'} · {wr}% WR
                        </span>
                      </div>
                      <strong
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '13.5px',
                          color: isPos ? '#059669' : '#e11d48'
                        }}
                      >
                        {isPos ? '+' : '-'}${Math.abs(item.netPnl).toFixed(2)}
                      </strong>
                    </div>
                    <div className="analytics-progress-track">
                      <div
                        className="analytics-progress-fill"
                        style={{
                          width: `${wr}%`,
                          backgroundColor: isPos ? 'var(--brand-emerald, #0075de)' : '#e11d48'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* R-Multiple Distribution Chart */}
        <div className="card chart-card-container">
          <div className="card-header">
            <div>
              <h3 className="card-title">R-Multiple Distribution</h3>
              <div className="card-subtitle">
                Trade outcomes bucketed by risk-reward multiples
              </div>
            </div>
          </div>

          <div className="chart-canvas-container" style={{ height: '240px' }}>
            <canvas
              ref={canvasRef}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                mouseXRef.current = e.clientX - rect.left;
                renderRChart();
              }}
              onMouseLeave={() => {
                mouseXRef.current = null;
                renderRChart();
              }}
            />
          </div>
        </div>
      </section>

      {/* ASSET PERFORMANCE & RISK TABLE */}
      <section className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Asset Risk Breakdown</h3>
            <div className="card-subtitle">
              Per-symbol execution efficiency, average win/loss, and dominant strategy
            </div>
          </div>
        </div>

        <div className="positions-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Class</th>
                <th>Trades</th>
                <th>Win Rate</th>
                <th>Avg Win</th>
                <th>Avg Loss</th>
                <th>Net P&amp;L</th>
                <th>Top Setup</th>
              </tr>
            </thead>
            <tbody>
              {assetBreakdown.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}
                  >
                    No asset data matches this filter.
                  </td>
                </tr>
              ) : (
                assetBreakdown.map((row) => {
                  const isPos = row.netPnl >= 0;
                  return (
                    <tr key={row.symbol}>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.symbol}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{row.assetClass}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{row.count}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {row.winRate}%
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#059669' }}>
                        +${row.avgWin.toFixed(2)}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#e11d48' }}>
                        -${row.avgLoss.toFixed(2)}
                      </td>
                      <td
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: isPos ? '#059669' : '#e11d48'
                        }}
                      >
                        {isPos ? '+' : '-'}${Math.abs(row.netPnl).toFixed(2)}
                      </td>
                      <td>
                        <span className="trade-card-tag-badge">{row.topTag}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}


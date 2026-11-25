import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ECONOMIC_EVENTS } from '../../data/mockData';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY_ISO = '2026-11-25';

function formatMonthTitle(year, monthIndex) {
  return new Date(year, monthIndex, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

function toISO(year, monthIndex, day) {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function getImpactDotColor(impact, category) {
  if (impact === 'HIGH') return '#f64932';
  if (category === 'Earnings' || category === 'Crypto') return '#7c3aed';
  return '#ffb110';
}

export default function CalendarView({ onOpenAddTrade, onOpenImageViewer }) {
  const { trades, adminConfig } = useApp();
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(10); // 0-indexed: 10 = November
  const [filterMode, setFilterMode] = useState('ALL'); // ALL | PROFIT | EVENTS
  const [layoutMode, setLayoutMode] = useState('month'); // month | agenda
  const [selectedDateISO, setSelectedDateISO] = useState(TODAY_ISO);

  // Group trades by dateISO
  const tradesByDate = useMemo(() => {
    const map = {};
    trades.forEach((t) => {
      const key = t.dateISO || TODAY_ISO;
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [trades]);

  // Group economic events by dateISO
  const eventsByDate = useMemo(() => {
    const map = {};
    ECONOMIC_EVENTS.forEach((ev) => {
      if (!map[ev.dateISO]) map[ev.dateISO] = [];
      map[ev.dateISO].push(ev);
    });
    return map;
  }, []);

  // Build 7-column calendar cells (Mon-Sun)
  const calendarCells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Mon=0 ... Sun=6
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];
    // Previous month leading days
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
      cells.push({
        day: d,
        dateISO: toISO(prevY, prevM, d),
        inCurrentMonth: false
      });
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        dateISO: toISO(viewYear, viewMonth, d),
        inCurrentMonth: true
      });
    }
    // Trailing days to complete last week
    const remainder = cells.length % 7;
    if (remainder !== 0) {
      const needed = 7 - remainder;
      const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
      for (let d = 1; d <= needed; d++) {
        cells.push({
          day: d,
          dateISO: toISO(nextY, nextM, d),
          inCurrentMonth: false
        });
      }
    }
    return cells;
  }, [viewYear, viewMonth]);

  // Monthly summary stats
  const monthStats = useMemo(() => {
    const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
    let netPnl = 0;
    let winDays = 0;
    let lossDays = 0;

    Object.entries(tradesByDate).forEach(([dateISO, dayTrades]) => {
      if (!dateISO.startsWith(prefix)) return;
      const daySum = dayTrades.reduce((acc, t) => acc + (parseFloat(t.pnl) || 0), 0);
      netPnl += daySum;
      if (daySum > 0) winDays++;
      else if (daySum < 0) lossDays++;
    });

    const highImpactCount = ECONOMIC_EVENTS.filter(
      (ev) => ev.dateISO.startsWith(prefix) && ev.impact === 'HIGH'
    ).length;

    return { netPnl, winDays, lossDays, highImpactCount };
  }, [tradesByDate, viewYear, viewMonth]);

  // Agenda items for current month
  const agendaDays = useMemo(() => {
    const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
    const allDates = new Set([
      ...Object.keys(tradesByDate).filter((d) => d.startsWith(prefix)),
      ...Object.keys(eventsByDate).filter((d) => d.startsWith(prefix))
    ]);

    return Array.from(allDates)
      .sort()
      .map((dateISO) => ({
        dateISO,
        trades: filterMode === 'EVENTS' ? [] : tradesByDate[dateISO] || [],
        events: filterMode === 'PROFIT' ? [] : eventsByDate[dateISO] || []
      }))
      .filter((item) => item.trades.length > 0 || item.events.length > 0);
  }, [tradesByDate, eventsByDate, viewYear, viewMonth, filterMode]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleJumpToday = () => {
    setViewYear(2026);
    setViewMonth(10);
    setSelectedDateISO(TODAY_ISO);
  };

  const selectedTrades = selectedDateISO ? tradesByDate[selectedDateISO] || [] : [];
  const selectedEvents = selectedDateISO ? eventsByDate[selectedDateISO] || [] : [];
  const selectedDayPnl = selectedTrades.reduce((acc, t) => acc + (parseFloat(t.pnl) || 0), 0);

  return (
    <div className="view-panel active" id="viewCalendar">
      {/* NOTION-STYLE CALENDAR TOOLBAR */}
      <div className="notion-cal-toolbar card">
        <div className="notion-cal-toolbar-left">
          <div className="notion-cal-nav-group">
            <button
              type="button"
              className="notion-cal-icon-btn"
              aria-label="Previous month"
              onClick={handlePrevMonth}
            >
              ‹
            </button>
            <button
              type="button"
              className="notion-cal-today-btn"
              onClick={handleJumpToday}
            >
              Today
            </button>
            <button
              type="button"
              className="notion-cal-icon-btn"
              aria-label="Next month"
              onClick={handleNextMonth}
            >
              ›
            </button>
          </div>
          <h2 className="notion-cal-month-title">{formatMonthTitle(viewYear, viewMonth)}</h2>
        </div>

        <div className="notion-cal-toolbar-right">
          <div className="notion-cal-seg-group">
            {[
              { key: 'ALL', label: 'All' },
              { key: 'PROFIT', label: 'Profit Calendar' },
              { key: 'EVENTS', label: 'Economic Events' }
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`notion-cal-seg-btn${filterMode === tab.key ? ' active' : ''}`}
                onClick={() => setFilterMode(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="notion-cal-seg-group">
            <button
              type="button"
              className={`notion-cal-seg-btn${layoutMode === 'month' ? ' active' : ''}`}
              onClick={() => setLayoutMode('month')}
            >
              Month
            </button>
            <button
              type="button"
              className={`notion-cal-seg-btn${layoutMode === 'agenda' ? ' active' : ''}`}
              onClick={() => setLayoutMode('agenda')}
            >
              Agenda
            </button>
          </div>
        </div>
      </div>

      {/* MONTHLY SUMMARY STRIP */}
      <div className="notion-cal-stats-row">
        <div className="notion-cal-stat-pill">
          <span className="cal-stat-kicker">Monthly Net P&amp;L</span>
          <strong
            className="cal-stat-val"
            style={{ color: monthStats.netPnl >= 0 ? '#059669' : '#e11d48' }}
          >
            {monthStats.netPnl >= 0 ? '+' : '-'}$
            {Math.abs(monthStats.netPnl).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </strong>
        </div>
        <div className="notion-cal-stat-pill">
          <span className="cal-stat-kicker">Green / Red Days</span>
          <strong className="cal-stat-val">
            <span style={{ color: '#059669' }}>{monthStats.winDays}W</span>
            {' · '}
            <span style={{ color: '#e11d48' }}>{monthStats.lossDays}L</span>
          </strong>
        </div>
        <div className="notion-cal-stat-pill">
          <span className="cal-stat-kicker">High-Impact Releases</span>
          <strong className="cal-stat-val">{monthStats.highImpactCount} Events</strong>
        </div>
      </div>

      {/* MAIN CALENDAR + SIDE PEEK WORKSPACE */}
      <div className={`notion-cal-workspace${selectedDateISO ? ' with-peek' : ''}`}>
        <div className="notion-cal-board card">
          {layoutMode === 'month' ? (
            <>
              <div className="notion-cal-weekdays">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="notion-cal-weekday">
                    {day}
                  </div>
                ))}
              </div>

              <div className="notion-cal-grid">
                {calendarCells.map((cell) => {
                  const dayTrades =
                    filterMode === 'EVENTS' ? [] : tradesByDate[cell.dateISO] || [];
                  const dayEvents =
                    filterMode === 'PROFIT' ? [] : eventsByDate[cell.dateISO] || [];
                  const dayPnl = dayTrades.reduce(
                    (acc, t) => acc + (parseFloat(t.pnl) || 0),
                    0
                  );
                  const hasTrades = dayTrades.length > 0;
                  const isToday = cell.dateISO === TODAY_ISO;
                  const isSelected = cell.dateISO === selectedDateISO;

                  let cellTone = '';
                  if (hasTrades && dayPnl > 0) cellTone = ' is-win-day';
                  else if (hasTrades && dayPnl < 0) cellTone = ' is-loss-day';

                  return (
                    <button
                      key={cell.dateISO}
                      type="button"
                      className={`notion-cal-cell${cell.inCurrentMonth ? '' : ' is-muted'}${
                        isSelected ? ' is-selected' : ''
                      }${cellTone}`}
                      onClick={() => setSelectedDateISO(cell.dateISO)}
                    >
                      <div className="notion-cal-cell-top">
                        <span className={`notion-cal-day-num${isToday ? ' is-today' : ''}`}>
                          {cell.day}
                        </span>
                        {hasTrades && (
                          <span className="notion-cal-trade-count">
                            {dayTrades.length} {dayTrades.length === 1 ? 'trade' : 'trades'}
                          </span>
                        )}
                      </div>

                      {hasTrades && (
                        <div
                          className="notion-cal-day-pnl"
                          style={{ color: dayPnl >= 0 ? '#059669' : '#e11d48' }}
                        >
                          {dayPnl >= 0 ? '+' : '-'}$
                          {Math.abs(dayPnl).toLocaleString(undefined, {
                            maximumFractionDigits: 0
                          })}
                        </div>
                      )}

                      <div className="notion-cal-events-stack">
                        {dayEvents.slice(0, 2).map((ev) => (
                          <div key={ev.id} className="notion-cal-event-chip" title={ev.title}>
                            <span
                              className="notion-cal-event-dot"
                              style={{
                                backgroundColor: getImpactDotColor(ev.impact, ev.category)
                              }}
                            />
                            <span className="notion-cal-event-text">{ev.title}</span>
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="notion-cal-more">+{dayEvents.length - 2} more</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="notion-cal-agenda">
              {agendaDays.length === 0 ? (
                <div className="notion-cal-empty">
                  No trades or economic events match this filter for {formatMonthTitle(viewYear, viewMonth)}.
                </div>
              ) : (
                agendaDays.map((item) => {
                  const daySum = item.trades.reduce(
                    (acc, t) => acc + (parseFloat(t.pnl) || 0),
                    0
                  );
                  const dateLabel = new Date(`${item.dateISO}T12:00:00`).toLocaleDateString(
                    'en-US',
                    { weekday: 'short', month: 'short', day: 'numeric' }
                  );

                  return (
                    <div
                      key={item.dateISO}
                      className={`notion-agenda-row${
                        selectedDateISO === item.dateISO ? ' is-selected' : ''
                      }`}
                      onClick={() => setSelectedDateISO(item.dateISO)}
                    >
                      <div className="notion-agenda-date">
                        <strong>{dateLabel}</strong>
                        {item.trades.length > 0 && (
                          <span
                            className="notion-agenda-pnl"
                            style={{ color: daySum >= 0 ? '#059669' : '#e11d48' }}
                          >
                            {daySum >= 0 ? '+' : '-'}${Math.abs(daySum).toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="notion-agenda-items">
                        {item.events.map((ev) => (
                          <div key={ev.id} className="notion-agenda-chip">
                            <span
                              className="notion-cal-event-dot"
                              style={{
                                backgroundColor: getImpactDotColor(ev.impact, ev.category)
                              }}
                            />
                            <span>
                              <strong>{ev.title}</strong> · {ev.time} ({ev.impact})
                            </span>
                          </div>
                        ))}
                        {item.trades.map((t) => (
                          <div key={t.id} className="notion-agenda-chip">
                            <span
                              className="notion-cal-event-dot"
                              style={{
                                backgroundColor: t.status === 'WON' ? '#059669' : '#e11d48'
                              }}
                            />
                            <span>
                              <strong>{t.symbol}</strong> {t.side} ·{' '}
                              {t.pnl >= 0 ? '+' : '-'}${Math.abs(t.pnl).toFixed(2)} ({t.tag})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* NOTION SIDE PEEK DAY INSPECTOR */}
        {selectedDateISO && (
          <aside className="notion-cal-peek card">
            <div className="notion-peek-header">
              <div>
                <div className="notion-peek-kicker">Day Inspector</div>
                <h3 className="notion-peek-date">
                  {new Date(`${selectedDateISO}T12:00:00`).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                aria-label="Close day inspector"
                onClick={() => setSelectedDateISO(null)}
              >
                ×
              </button>
            </div>

            {/* Day P&L Summary Box */}
            <div className="notion-peek-summary">
              <div>
                <span className="peek-sum-label">Day Net P&amp;L</span>
                <strong
                  className="peek-sum-val"
                  style={{
                    color:
                      selectedTrades.length === 0
                        ? 'var(--text-muted)'
                        : selectedDayPnl >= 0
                        ? '#059669'
                        : '#e11d48'
                  }}
                >
                  {selectedTrades.length === 0
                    ? '$0.00'
                    : `${selectedDayPnl >= 0 ? '+' : '-'}$${Math.abs(selectedDayPnl).toFixed(2)}`}
                </strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="peek-sum-label">Executions</span>
                <strong className="peek-sum-val">{selectedTrades.length}</strong>
              </div>
            </div>

            {/* Economic Releases */}
            <div className="notion-peek-section">
              <div className="notion-peek-section-title">Market &amp; Economic Events</div>
              {selectedEvents.length === 0 ? (
                <p className="notion-peek-empty">No scheduled macro or earnings events.</p>
              ) : (
                <div className="notion-peek-list">
                  {selectedEvents.map((ev) => (
                    <div key={ev.id} className="notion-peek-event-card">
                      <div className="peek-event-top">
                        <span className="peek-event-title">
                          <span
                            className="notion-cal-event-dot"
                            style={{
                              backgroundColor: getImpactDotColor(ev.impact, ev.category)
                            }}
                          />
                          {ev.title}
                        </span>
                        <span className={`peek-impact-pill impact-${ev.impact.toLowerCase()}`}>
                          {ev.impact}
                        </span>
                      </div>
                      <div className="peek-event-meta">
                        <span>{ev.time}</span>
                        <span>Forecast: {ev.forecast}</span>
                        <span>Prev: {ev.previous}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trades Logged on Selected Date */}
            <div className="notion-peek-section">
              <div className="notion-peek-section-title">Logged Trades</div>
              {selectedTrades.length === 0 ? (
                <p className="notion-peek-empty">No trades logged on this date.</p>
              ) : (
                <div className="notion-peek-list">
                  {selectedTrades.map((t) => {
                    const isWon = t.status === 'WON';
                    return (
                      <div key={t.id} className="notion-peek-trade-card">
                        <div className="peek-trade-top">
                          <strong>{t.symbol}</strong>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 700,
                              color: isWon ? '#059669' : '#e11d48'
                            }}
                          >
                            {isWon ? '+' : '-'}${Math.abs(t.pnl).toFixed(2)}
                          </span>
                        </div>
                        <div className="peek-trade-sub">
                          <span>{t.side}</span>
                          <span>·</span>
                          <span>{t.tag}</span>
                        </div>
                        {t.screenshot && (
                          <img
                            src={t.screenshot}
                            alt={t.symbol}
                            className="peek-trade-thumb"
                            onClick={() =>
                              onOpenImageViewer(t.screenshot, `${t.symbol} - ${t.side} (${t.id})`)
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {adminConfig.widgets?.addTradeModule !== false && (
              <button
                type="button"
                className="btn-trade-action"
                style={{ width: '100%', marginTop: 'auto' }}
                onClick={() => onOpenAddTrade(selectedDateISO)}
              >
                + Log Trade on {selectedDateISO}
              </button>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}


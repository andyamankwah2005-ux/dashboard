import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import SummaryCards from '../components/dashboard/SummaryCards';
import EquityCurveChart from '../components/charts/EquityCurveChart';
import WinLossChart from '../components/charts/WinLossChart';
import RecentTradesTable from '../components/dashboard/RecentTradesTable';
import TradesJournalView from '../components/dashboard/TradesJournalView';
import CalendarView from '../components/dashboard/CalendarView';
import AnalyticsView from '../components/dashboard/AnalyticsView';
import { SettingsView } from '../components/dashboard/PlaceholderViews';
import AddTradeModal from '../components/dashboard/AddTradeModal';
import ImageViewerModal from '../components/dashboard/ImageViewerModal';

const TIMEFRAME_RANGES = ['7D', '30D', '90D', '1Y', 'ALL'];

export default function DashboardPage() {
  const { adminConfig, equityData, winLossData } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addTradeOpen, setAddTradeOpen] = useState(false);
  const [addTradeDateISO, setAddTradeDateISO] = useState(null);
  const [viewerImage, setViewerImage] = useState({ src: null, title: '' });
  const [equityRange, setEquityRange] = useState('30D');

  const widgets = adminConfig.widgets || {};

  const slicedEquityData = useMemo(() => {
    if (equityRange === '7D') return equityData.slice(-4);
    if (equityRange === '30D') return equityData.slice(-12);
    return equityData;
  }, [equityData, equityRange]);

  return (
    <div className="app-container" id="appRoot">
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <main className="main-canvas">
        <Header
          currentView={currentView}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAddTrade={() => setAddTradeOpen(true)}
        />

        {currentView === 'dashboard' && (
          <div className="view-panel active" id="viewDashboard">
            {widgets.summaryCards !== false && <SummaryCards />}

            {(widgets.equityChart !== false || widgets.winLossChart !== false) && (
              <section className="overview-charts-grid">
                {widgets.equityChart !== false && (
                  <div className="card chart-card-container" id="widget-equity-curve">
                    <div className="card-header">
                      <div>
                        <h2 className="card-title">Equity Curve</h2>
                        <div className="card-subtitle">
                          Cumulative portfolio account growth vs. market benchmark
                        </div>
                      </div>

                      <div className="timeframe-pills" id="equityTimeframePills">
                        {TIMEFRAME_RANGES.map((range) => (
                          <button
                            key={range}
                            className={`tf-btn${equityRange === range ? ' active' : ''}`}
                            onClick={() => setEquityRange(range)}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="equity-legend-row">
                      <div className="legend-item">
                        <span className="legend-line" style={{ backgroundColor: '#10b981' }} />
                        <span>Account Equity ($142.8k)</span>
                      </div>
                      <div className="legend-item">
                        <span
                          className="legend-line dashed"
                          style={{ backgroundColor: '#94a7a3' }}
                        />
                        <span>Benchmark ($109.4k)</span>
                      </div>
                    </div>

                    <div className="chart-canvas-container" style={{ height: '260px' }}>
                      <EquityCurveChart data={slicedEquityData} />
                    </div>
                  </div>
                )}

                {widgets.winLossChart !== false && (
                  <div className="card chart-card-container" id="widget-winloss-perf">
                    <div className="card-header">
                      <div>
                        <h2 className="card-title">Win / Loss Performance Over Time</h2>
                        <div className="card-subtitle">
                          Monthly trade outcome distribution &amp; win ratio
                        </div>
                      </div>

                      <div className="perf-stats-tag">
                        <span>
                          Profit Factor: <strong>2.42</strong>
                        </span>
                      </div>
                    </div>

                    <div className="equity-legend-row">
                      <div className="legend-item">
                        <span className="legend-dot" style={{ backgroundColor: '#10b981' }} />
                        <span>Winning Trades</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-dot" style={{ backgroundColor: '#f43f5e' }} />
                        <span>Losing Trades</span>
                      </div>
                      <div className="legend-item" style={{ marginLeft: 'auto' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                          Win Streak: <strong style={{ color: '#10b981' }}>8</strong>
                        </span>
                      </div>
                    </div>

                    <div className="chart-canvas-container" style={{ height: '260px' }}>
                      <WinLossChart data={winLossData} />
                    </div>
                  </div>
                )}
              </section>
            )}

            {widgets.recentTrades !== false && <RecentTradesTable />}
          </div>
        )}

        {currentView === 'trades' && (
          <TradesJournalView
            onOpenAddTrade={() => setAddTradeOpen(true)}
            onOpenImageViewer={(src, title) => setViewerImage({ src, title })}
          />
        )}

        {currentView === 'analytics' && <AnalyticsView />}

        {currentView === 'calendar' && (
          <CalendarView
            onOpenAddTrade={(dateISO) => {
              setAddTradeDateISO(dateISO || null);
              setAddTradeOpen(true);
            }}
            onOpenImageViewer={(src, title) => setViewerImage({ src, title })}
          />
        )}

        {currentView === 'settings' && <SettingsView />}
      </main>

      <AddTradeModal
        isOpen={addTradeOpen}
        initialDateISO={addTradeDateISO}
        onClose={() => {
          setAddTradeOpen(false);
          setAddTradeDateISO(null);
        }}
      />

      <ImageViewerModal
        src={viewerImage.src}
        title={viewerImage.title}
        onClose={() => setViewerImage({ src: null, title: '' })}
      />
    </div>
  );
}


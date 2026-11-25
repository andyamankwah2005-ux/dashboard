import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_ACCOUNT,
  RECENT_TRADES,
  EQUITY_CURVE_DATA,
  WIN_LOSS_PERFORMANCE,
  DEFAULT_ADMIN_CONFIG
} from '../data/mockData';
import { playChime } from '../utils/audio';

const AppContext = createContext(null);

function loadSavedConfig() {
  try {
    const saved = localStorage.getItem('mission3_admin_config');
    if (!saved) return JSON.parse(JSON.stringify(DEFAULT_ADMIN_CONFIG));
    const parsed = JSON.parse(saved);
    return {
      ...DEFAULT_ADMIN_CONFIG,
      ...parsed,
      colors: { ...DEFAULT_ADMIN_CONFIG.colors, ...(parsed.colors || {}) },
      typography: { ...DEFAULT_ADMIN_CONFIG.typography, ...(parsed.typography || {}) },
      styling: { ...DEFAULT_ADMIN_CONFIG.styling, ...(parsed.styling || {}) },
      widgets: { ...DEFAULT_ADMIN_CONFIG.widgets, ...(parsed.widgets || {}) },
      branding: { ...DEFAULT_ADMIN_CONFIG.branding, ...(parsed.branding || {}) },
      tags: parsed.tags || DEFAULT_ADMIN_CONFIG.tags,
      tradingPairs: parsed.tradingPairs || DEFAULT_ADMIN_CONFIG.tradingPairs
    };
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_ADMIN_CONFIG));
  }
}

function loadSavedTrades() {
  try {
    const saved = localStorage.getItem('mission3_trades_data');
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(RECENT_TRADES));
  } catch {
    return JSON.parse(JSON.stringify(RECENT_TRADES));
  }
}

export function applyAdminCssVariables(config) {
  const root = document.documentElement;
  if (!config) return;

  if (config.colors) {
    if (config.colors.accent) root.style.setProperty('--brand-emerald', config.colors.accent);
    if (config.colors.sidebarBg) root.style.setProperty('--sidebar-bg', config.colors.sidebarBg);
    if (config.colors.canvasBg) root.style.setProperty('--canvas-bg', config.colors.canvasBg);
    if (config.colors.cardBg) root.style.setProperty('--card-bg', config.colors.cardBg);
    if (config.colors.textMain) root.style.setProperty('--text-main', config.colors.textMain);
    if (config.colors.green) root.style.setProperty('--color-green', config.colors.green);
  }

  if (config.typography) {
    if (config.typography.fontFamily) root.style.setProperty('--font-main', config.typography.fontFamily);
    if (config.typography.monoFont) root.style.setProperty('--font-mono', config.typography.monoFont);
  }

  if (config.styling) {
    if (config.styling.radius !== undefined) {
      root.style.setProperty('--radius-md', `${config.styling.radius}px`);
    }
    if (config.styling.shadowStyle === 'flat') {
      root.style.setProperty('--shadow-card', 'none');
      root.style.setProperty('--shadow-hover', 'none');
    } else if (config.styling.shadowStyle === 'elevated') {
      root.style.setProperty(
        '--shadow-card',
        '0 10px 25px -3px rgba(0,0,0,0.12), 0 4px 6px -2px rgba(0,0,0,0.05)'
      );
    } else if (config.styling.shadowStyle === 'glow') {
      root.style.setProperty('--shadow-card', `0 0 20px ${config.colors?.accent || '#10b981'}33`);
    } else {
      root.style.setProperty(
        '--shadow-card',
        '0 4px 20px -2px rgba(10, 35, 30, 0.04), 0 2px 6px -1px rgba(10, 35, 30, 0.02)'
      );
    }

    if (config.styling.borderStyle === 'none') {
      root.style.setProperty('--card-border', 'transparent');
    } else if (config.styling.borderStyle === 'medium') {
      root.style.setProperty('--card-border', '#cbdad5');
    } else {
      root.style.setProperty('--card-border', '#e6ecea');
    }
  }
}

export function AppProvider({ children }) {
  const [route, setRoute] = useState(() => window.location.pathname);
  const [theme, setTheme] = useState(() => localStorage.getItem('mission3_theme') || 'light');
  const [adminConfig, setAdminConfig] = useState(loadSavedConfig);
  const [trades, setTrades] = useState(loadSavedTrades);
  const [account, setAccount] = useState(() => ({
    ...INITIAL_ACCOUNT,
    totalTrades: adminConfig.branding?.totalTrades ?? INITIAL_ACCOUNT.totalTrades,
    winRate: adminConfig.branding?.winRate ?? INITIAL_ACCOUNT.winRate,
    currentDrawdown: adminConfig.branding?.drawdown ?? INITIAL_ACCOUNT.currentDrawdown,
    totalPnL: adminConfig.branding?.totalPnl ?? INITIAL_ACCOUNT.totalPnL
  }));
  const [equityData, setEquityData] = useState(() =>
    JSON.parse(JSON.stringify(EQUITY_CURVE_DATA))
  );
  const [winLossData] = useState(() => JSON.parse(JSON.stringify(WIN_LOSS_PERFORMANCE)));
  const [toasts, setToasts] = useState([]);

  // Sync browser back/forward navigation
  useEffect(() => {
    const handlePop = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const navigate = useCallback((path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setRoute(path);
      window.scrollTo(0, 0);
    }
  }, []);

  // Apply theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mission3_theme', theme);
  }, [theme]);

  // Apply admin CSS variables whenever adminConfig changes
  useEffect(() => {
    applyAdminCssVariables(adminConfig);
  }, [adminConfig]);

  // Live equity simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setEquityData((prev) => {
        const next = [...prev];
        const last = { ...next[next.length - 1] };
        const delta = (Math.random() - 0.48) * 120;
        last.equity = Math.max(100000, last.equity + delta);
        next[next.length - 1] = last;
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      addToast(`Switched to ${next.toUpperCase()} mode`, 'info');
      return next;
    });
  }, [addToast]);

  const addTrade = useCallback(
    (newTrade) => {
      setTrades((prev) => {
        const updated = [newTrade, ...prev];
        localStorage.setItem('mission3_trades_data', JSON.stringify(updated));
        return updated;
      });
      setAccount((prev) => ({
        ...prev,
        totalTrades: (prev.totalTrades || 1284) + 1,
        totalPnL: (prev.totalPnL || 142850) + (newTrade.pnl || 0)
      }));
      addToast(`✅ Trade logged: ${newTrade.symbol} (${newTrade.status}) [${newTrade.tag}]`, 'success');
      playChime('success');
    },
    [addToast]
  );

  const saveAllAdminState = useCallback(
    (nextConfig, nextTrades) => {
      setAdminConfig(nextConfig);
      setTrades(nextTrades);
      setAccount((prev) => ({
        ...prev,
        totalTrades: nextConfig.branding?.totalTrades ?? prev.totalTrades,
        winRate: nextConfig.branding?.winRate ?? prev.winRate,
        currentDrawdown: nextConfig.branding?.drawdown ?? prev.currentDrawdown,
        totalPnL: nextConfig.branding?.totalPnl ?? prev.totalPnL
      }));
      localStorage.setItem('mission3_admin_config', JSON.stringify(nextConfig));
      localStorage.setItem('mission3_trades_data', JSON.stringify(nextTrades));
      localStorage.setItem('mission3_tags', JSON.stringify(nextConfig.tags));
      addToast('All custom styles, widgets & trade data saved successfully!', 'success');
    },
    [addToast]
  );

  const resetAllAdminState = useCallback(() => {
    const freshConfig = JSON.parse(JSON.stringify(DEFAULT_ADMIN_CONFIG));
    const freshTrades = JSON.parse(JSON.stringify(RECENT_TRADES));
    saveAllAdminState(freshConfig, freshTrades);
    addToast('Reset to default factory settings', 'info');
    return { freshConfig, freshTrades };
  }, [saveAllAdminState, addToast]);

  return (
    <AppContext.Provider
      value={{
        route,
        navigate,
        theme,
        toggleTheme,
        adminConfig,
        setAdminConfig,
        trades,
        setTrades,
        account,
        equityData,
        winLossData,
        toasts,
        addToast,
        addTrade,
        saveAllAdminState,
        resetAllAdminState
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}


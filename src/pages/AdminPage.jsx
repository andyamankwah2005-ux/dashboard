import React, { useState, useRef, useEffect } from 'react';
import { useApp, applyAdminCssVariables } from '../context/AppContext';
import {
  DEFAULT_ADMIN_CONFIG,
  PRESET_THEMES,
  RECENT_TRADES
} from '../data/mockData';

const PRESET_LIST = [
  { key: 'notionWink', label: 'Notion Wink (Default)', color: '#0075de' },
  { key: 'emerald', label: 'Emerald Studio', color: '#10b981' },
  { key: 'cyber', label: 'Cyber Teal', color: '#06b6d4' },
  { key: 'royal', label: 'Royal Indigo', color: '#6366f1' },
  { key: 'sunset', label: 'Sunset Gold', color: '#f97316' },
  { key: 'ruby', label: 'Ruby Matrix', color: '#e11d48' },
  { key: 'darkObsidian', label: 'Dark Obsidian', color: '#3b82f6' }
];

const COLOR_FIELDS = [
  { key: 'accent', label: 'Primary Brand Accent' },
  { key: 'sidebarBg', label: 'Sidebar Background' },
  { key: 'canvasBg', label: 'Canvas Background' },
  { key: 'cardBg', label: 'Card Surface Background' },
  { key: 'textMain', label: 'Text Primary' },
  { key: 'green', label: 'Positive Green Trend / Win' }
];

export default function AdminPage() {
  const {
    theme,
    adminConfig,
    trades,
    saveAllAdminState,
    resetAllAdminState,
    addToast,
    navigate
  } = useApp();

  const [draftConfig, setDraftConfig] = useState(() =>
    JSON.parse(JSON.stringify(adminConfig))
  );
  const [draftTrades, setDraftTrades] = useState(() =>
    JSON.parse(JSON.stringify(trades))
  );
  const [activeTab, setActiveTab] = useState('theme-colors');
  const [activePreset, setActivePreset] = useState('notionWink');
  const [previewMode, setPreviewMode] = useState('dashboard');
  const [newTagName, setNewTagName] = useState('');
  const importInputRef = useRef(null);

  // Live preview of CSS variables while editing in Admin Studio
  useEffect(() => {
    applyAdminCssVariables(draftConfig, theme);
  }, [draftConfig, theme]);

  const updateColor = (key, value) => {
    setDraftConfig((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value }
    }));
  };

  const updateTypography = (key, value) => {
    setDraftConfig((prev) => ({
      ...prev,
      typography: { ...prev.typography, [key]: value }
    }));
  };

  const updateStyling = (key, value) => {
    setDraftConfig((prev) => ({
      ...prev,
      styling: { ...prev.styling, [key]: value }
    }));
  };

  const updateWidget = (key, checked) => {
    setDraftConfig((prev) => ({
      ...prev,
      widgets: { ...prev.widgets, [key]: checked }
    }));
  };

  const updateBranding = (key, value) => {
    setDraftConfig((prev) => ({
      ...prev,
      branding: { ...prev.branding, [key]: value }
    }));
  };

  const handleSelectPreset = (presetKey) => {
    setActivePreset(presetKey);
    const preset = PRESET_THEMES[presetKey];
    if (preset) {
      setDraftConfig((prev) => ({
        ...prev,
        colors: { ...prev.colors, ...preset }
      }));
    }
  };

  const handleAddTag = () => {
    const val = newTagName.trim();
    if (val && !draftConfig.tags.includes(val)) {
      setDraftConfig((prev) => ({
        ...prev,
        tags: [...prev.tags, val]
      }));
      setNewTagName('');
      addToast(`Added tag "${val}"`, 'success');
    }
  };

  const handleRemoveTag = (idx) => {
    setDraftConfig((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== idx)
    }));
    addToast('Strategy tag removed', 'info');
  };

  const handleDeleteTrade = (idx) => {
    setDraftTrades((prev) => prev.filter((_, i) => i !== idx));
    addToast('Trade record deleted', 'info');
  };

  const handleResetMockTrades = () => {
    setDraftTrades(JSON.parse(JSON.stringify(RECENT_TRADES)));
    addToast('Reset to original mock trade log', 'info');
  };

  const handleClearAllTrades = () => {
    if (window.confirm('Are you sure you want to clear all logged trades?')) {
      setDraftTrades([]);
      addToast('All trades cleared', 'info');
    }
  };

  const handleSave = () => {
    saveAllAdminState(draftConfig, draftTrades);
  };

  const handleResetDefaults = () => {
    const { freshConfig, freshTrades } = resetAllAdminState();
    setDraftConfig(freshConfig);
    setDraftTrades(freshTrades);
  };

  const handleExportJson = () => {
    const payload = { config: draftConfig, trades: draftTrades };
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'mission3_studio_export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Configuration & Trades exported successfully', 'success');
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        const nextConfig = imported.config
          ? {
              ...DEFAULT_ADMIN_CONFIG,
              ...imported.config,
              colors: { ...DEFAULT_ADMIN_CONFIG.colors, ...(imported.config.colors || {}) },
              typography: {
                ...DEFAULT_ADMIN_CONFIG.typography,
                ...(imported.config.typography || {})
              },
              styling: { ...DEFAULT_ADMIN_CONFIG.styling, ...(imported.config.styling || {}) },
              widgets: { ...DEFAULT_ADMIN_CONFIG.widgets, ...(imported.config.widgets || {}) },
              branding: { ...DEFAULT_ADMIN_CONFIG.branding, ...(imported.config.branding || {}) }
            }
          : draftConfig;
        const nextTrades = imported.trades || draftTrades;
        setDraftConfig(nextConfig);
        setDraftTrades(nextTrades);
        saveAllAdminState(nextConfig, nextTrades);
        addToast('Configuration imported and applied successfully!', 'success');
      } catch {
        addToast('Invalid JSON file format', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const { colors, typography, styling, widgets, branding } = draftConfig;

  return (
    <div className="admin-app-wrapper">
      {/* ADMIN SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-top">
          <a
            href="/"
            className="brand-wrapper"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
          >
            <div className="brand-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="brand-name" id="adminSidebarBrand">
              {branding.appName || 'Mission 3'}{' '}
              <span
                className="brand-badge"
                style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}
              >
                ADMIN
              </span>
            </div>
          </a>

          <div className="admin-nav-tabs">
            <button
              className={`admin-tab-btn${activeTab === 'theme-colors' ? ' active' : ''}`}
              onClick={() => setActiveTab('theme-colors')}
            >
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
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a7 7 0 0 0 0 14h1a2 2 0 0 1 2 2 4 4 0 0 0 4-4 9 9 0 0 0-7-12z" />
              </svg>
              <span>Colors &amp; Themes</span>
            </button>

            <button
              className={`admin-tab-btn${activeTab === 'typography' ? ' active' : ''}`}
              onClick={() => setActiveTab('typography')}
            >
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
                <polyline points="4 7 4 4 20 4 20 7" />
                <line x1="9" y1="20" x2="15" y2="20" />
                <line x1="12" y1="4" x2="12" y2="20" />
              </svg>
              <span>Typography &amp; Styles</span>
            </button>

            <button
              className={`admin-tab-btn${activeTab === 'widgets' ? ' active' : ''}`}
              onClick={() => setActiveTab('widgets')}
            >
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
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>Navigation &amp; Widgets</span>
            </button>

            <button
              className={`admin-tab-btn${activeTab === 'trades-manager' ? ' active' : ''}`}
              onClick={() => setActiveTab('trades-manager')}
            >
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Trades &amp; Tag Manager</span>
            </button>

            <button
              className={`admin-tab-btn${activeTab === 'branding' ? ' active' : ''}`}
              onClick={() => setActiveTab('branding')}
            >
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Branding &amp; Metrics</span>
            </button>
          </div>
        </div>

        <div className="sidebar-footer">
          <a
            href="/dashboard"
            className="btn-return-dashboard"
            onClick={(e) => {
              e.preventDefault();
              navigate('/dashboard');
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Dashboard</span>
          </a>
        </div>
      </aside>

      {/* ADMIN CONTENT */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1 className="admin-title">Frontend Studio &amp; Customizer</h1>
            <p className="admin-sub">
              Full control over theme colors, typography, trade journal tags, widget visibility, and
              baseline metrics.
            </p>
          </div>
          <div className="admin-header-actions">
            <button
              className="btn-secondary-admin"
              id="resetConfigBtn"
              onClick={handleResetDefaults}
            >
              Reset Defaults
            </button>
            <button
              className="btn-secondary-admin"
              id="importConfigTriggerBtn"
              onClick={() => importInputRef.current?.click()}
            >
              Import JSON
            </button>
            <input
              ref={importInputRef}
              type="file"
              id="importConfigInput"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImportJson}
            />
            <button
              className="btn-secondary-admin"
              id="exportConfigBtn"
              onClick={handleExportJson}
            >
              Export JSON
            </button>
            <button className="btn-primary-save" id="saveAllConfigBtn" onClick={handleSave}>
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
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span>Save &amp; Apply</span>
            </button>
          </div>
        </header>

        <div className="admin-grid">
          {/* LEFT: CONTROLS PANEL */}
          <div className="admin-controls-card">
            {/* TAB 1: COLORS & THEMES */}
            {activeTab === 'theme-colors' && (
              <div className="tab-panel active" id="tab-theme-colors">
                <h2 className="panel-section-title">Curated Color Themes</h2>
                <div className="preset-theme-grid">
                  {PRESET_LIST.map((preset) => (
                    <button
                      key={preset.key}
                      className={`preset-theme-card${activePreset === preset.key ? ' active' : ''}`}
                      onClick={() => handleSelectPreset(preset.key)}
                    >
                      <span className="preset-dot" style={{ background: preset.color }} />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>

                <h2 className="panel-section-title" style={{ marginTop: '24px' }}>
                  Custom Color Palette
                </h2>
                <div className="color-picker-grid">
                  {COLOR_FIELDS.map((field) => (
                    <div className="color-picker-item" key={field.key}>
                      <label>{field.label}</label>
                      <div className="picker-input-wrap">
                        <input
                          type="color"
                          value={colors[field.key]}
                          onChange={(e) => updateColor(field.key, e.target.value)}
                        />
                        <input
                          type="text"
                          className="color-text-input"
                          value={colors[field.key]}
                          onChange={(e) => updateColor(field.key, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: TYPOGRAPHY & STYLES */}
            {activeTab === 'typography' && (
              <div className="tab-panel active" id="tab-typography">
                <h2 className="panel-section-title">Typography Engine</h2>

                <div className="admin-form-group">
                  <label className="admin-label">Primary Font Family</label>
                  <select
                    className="admin-select"
                    value={typography.fontFamily}
                    onChange={(e) => updateTypography('fontFamily', e.target.value)}
                  >
                    <option value="'Plus Jakarta Sans', sans-serif">
                      Plus Jakarta Sans (Modern Clean)
                    </option>
                    <option value="'Outfit', sans-serif">Outfit (Geometric High-Tech)</option>
                    <option value="'Inter', sans-serif">Inter (Precision SaaS)</option>
                    <option value="'Poppins', sans-serif">Poppins (Smooth Rounded)</option>
                    <option value="'Space Grotesk', sans-serif">
                      Space Grotesk (Crypto Cyber)
                    </option>
                    <option value="'Roboto', sans-serif">Roboto (Industrial Standard)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Numbers / Tabular Font</label>
                  <select
                    className="admin-select"
                    value={typography.monoFont}
                    onChange={(e) => updateTypography('monoFont', e.target.value)}
                  >
                    <option value="'JetBrains Mono', monospace">
                      JetBrains Mono (Recommended)
                    </option>
                    <option value="'Courier New', monospace">Courier New</option>
                    <option value="'Plus Jakarta Sans', sans-serif">Match Primary Font</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">
                    Base Font Size: <span>{typography.baseFontSize}px</span>
                  </label>
                  <input
                    type="range"
                    className="admin-range"
                    min="12"
                    max="18"
                    value={typography.baseFontSize}
                    onChange={(e) => updateTypography('baseFontSize', parseInt(e.target.value, 10))}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">
                    Header Letter Spacing: <span>{typography.letterSpacing}px</span>
                  </label>
                  <input
                    type="range"
                    className="admin-range"
                    min="-15"
                    max="20"
                    value={Math.round(typography.letterSpacing * 10)}
                    onChange={(e) =>
                      updateTypography(
                        'letterSpacing',
                        parseFloat((parseInt(e.target.value, 10) / 10).toFixed(1))
                      )
                    }
                  />
                </div>

                <h2 className="panel-section-title" style={{ marginTop: '24px' }}>
                  Edge &amp; Card Geometry
                </h2>

                <div className="admin-form-group">
                  <label className="admin-label">
                    Card Corner Rounding (Border Radius): <span>{styling.radius}px</span>
                  </label>
                  <input
                    type="range"
                    className="admin-range"
                    min="0"
                    max="36"
                    value={styling.radius}
                    onChange={(e) => updateStyling('radius', parseInt(e.target.value, 10))}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Shadow Softness &amp; Depth</label>
                  <select
                    className="admin-select"
                    value={styling.shadowStyle}
                    onChange={(e) => updateStyling('shadowStyle', e.target.value)}
                  >
                    <option value="soft">Soft SaaS Ambient (Default)</option>
                    <option value="elevated">High Elevation Drop Shadow</option>
                    <option value="flat">Minimalist Flat (No Shadow)</option>
                    <option value="glow">Neon Ambient Glow</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Card Border Style</label>
                  <select
                    className="admin-select"
                    value={styling.borderStyle}
                    onChange={(e) => updateStyling('borderStyle', e.target.value)}
                  >
                    <option value="subtle">Subtle 1px Border</option>
                    <option value="medium">Defined 1.5px Border</option>
                    <option value="none">Seamless (No Border)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Card Padding Density</label>
                  <select
                    className="admin-select"
                    value={styling.density}
                    onChange={(e) => updateStyling('density', e.target.value)}
                  >
                    <option value="normal">Standard (24px padding)</option>
                    <option value="compact">Compact (16px padding)</option>
                    <option value="spacious">Spacious (32px padding)</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB 3: NAVIGATION & WIDGETS */}
            {activeTab === 'widgets' && (
              <div className="tab-panel active" id="tab-widgets">
                <h2 className="panel-section-title">Navigation &amp; Module Toggles</h2>
                <p className="admin-desc">
                  Enable or disable specific sections, charts, navigation links, and the Add Trade
                  module.
                </p>

                <h3
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    marginBottom: '10px'
                  }}
                >
                  Sidebar Navigation Items
                </h3>
                <div className="widget-admin-list" style={{ marginBottom: '20px' }}>
                  {[
                    {
                      key: 'navTrades',
                      title: 'Trades Journal View',
                      desc: 'Show "Trades" item in sidebar & dedicated journal page'
                    },
                    {
                      key: 'navAnalytics',
                      title: 'Analytics View',
                      desc: 'Show "Analytics" item in sidebar'
                    },
                    {
                      key: 'navCalendar',
                      title: 'Calendar View',
                      desc: 'Show "Calendar" item in sidebar'
                    },
                    {
                      key: 'navSettings',
                      title: 'Settings View',
                      desc: 'Show "Settings" item in sidebar'
                    }
                  ].map((item) => (
                    <div className="widget-admin-row" key={item.key}>
                      <div className="widget-info">
                        <strong>{item.title}</strong>
                        <span>{item.desc}</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={widgets[item.key] !== false}
                          onChange={(e) => updateWidget(item.key, e.target.checked)}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  ))}
                </div>

                <h3
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    marginBottom: '10px'
                  }}
                >
                  Dashboard &amp; Trade Modules
                </h3>
                <div className="widget-admin-list">
                  {[
                    {
                      key: 'summaryCards',
                      title: '4 Summary KPI Cards Row',
                      desc: 'Total Trades, Win Rate (%), Current Drawdown (%), Profit/Loss'
                    },
                    {
                      key: 'equityChart',
                      title: 'Equity Curve Interactive Chart',
                      desc: 'Cumulative account balance growth vs. market benchmark'
                    },
                    {
                      key: 'winLossChart',
                      title: 'Win / Loss Performance Over Time Chart',
                      desc: 'Monthly win vs loss distribution & Profit Factor telemetry'
                    },
                    {
                      key: 'recentTrades',
                      title: 'Recent Trades Preview Datatable',
                      desc: 'Recent executions table with filter pills (All, Won, Lost, Crypto, Stocks)'
                    },
                    {
                      key: 'addTradeModule',
                      title: 'Add Trade Module & Drag-Drop Uploader',
                      desc: 'Screenshot drag & drop dropzone, SL/TP, outcome, tags, and notes'
                    }
                  ].map((item) => (
                    <div className="widget-admin-row" key={item.key}>
                      <div className="widget-info">
                        <strong>{item.title}</strong>
                        <span>{item.desc}</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={widgets[item.key] !== false}
                          onChange={(e) => updateWidget(item.key, e.target.checked)}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: TRADES & TAG MANAGER */}
            {activeTab === 'trades-manager' && (
              <div className="tab-panel active" id="tab-trades-manager">
                <h2 className="panel-section-title">Strategy Tags &amp; Trade Journal Management</h2>
                <p className="admin-desc">
                  Manage strategy tags (Scalping, Swing, Breakout, etc.), supported trading pairs,
                  and edit logged trades.
                </p>

                <div className="admin-form-group">
                  <label className="admin-label">Active Strategy Tags</label>
                  <div className="tags-manager-list" id="adminTagsList">
                    {draftConfig.tags.map((tag, idx) => (
                      <div className="tag-item-chip" key={tag}>
                        <span>{tag}</span>
                        <button
                          type="button"
                          className="btn-delete-tag"
                          title="Remove tag"
                          onClick={() => handleRemoveTag(idx)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <div
                    className="tag-add-row"
                    style={{ display: 'flex', gap: '8px', marginTop: '10px' }}
                  >
                    <input
                      type="text"
                      className="admin-input"
                      id="newTagNameInput"
                      placeholder="e.g. Trend Following, Momentum"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn-secondary-admin"
                      id="addNewTagBtn"
                      onClick={handleAddTag}
                    >
                      + Add Tag
                    </button>
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginTop: '24px' }}>
                  <label className="admin-label">Default Trading Pairs / Assets</label>
                  <input
                    type="text"
                    className="admin-input"
                    id="tradingPairsInput"
                    value={draftConfig.tradingPairs || ''}
                    onChange={(e) =>
                      setDraftConfig((prev) => ({ ...prev, tradingPairs: e.target.value }))
                    }
                  />
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      display: 'block',
                      marginTop: '4px'
                    }}
                  >
                    Comma separated list used in Add Trade autocomplete suggestions.
                  </span>
                </div>

                <div className="admin-form-group" style={{ marginTop: '24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}
                  >
                    <label className="admin-label" style={{ marginBottom: 0 }}>
                      Logged Trades Database (<span id="adminTradesCount">{draftTrades.length}</span>{' '}
                      trades)
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn-secondary-admin"
                        id="adminResetMockTradesBtn"
                        style={{ fontSize: '11.5px', padding: '5px 10px' }}
                        onClick={handleResetMockTrades}
                      >
                        Reload Mock Trades
                      </button>
                      <button
                        type="button"
                        className="btn-secondary-admin"
                        id="adminClearAllTradesBtn"
                        style={{
                          fontSize: '11.5px',
                          padding: '5px 10px',
                          color: '#e11d48',
                          borderColor: 'rgba(225, 29, 72, 0.3)'
                        }}
                        onClick={handleClearAllTrades}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="admin-trades-table-wrap">
                    <table className="admin-mini-table" id="adminTradesTable">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Asset</th>
                          <th>Outcome</th>
                          <th>P&amp;L ($)</th>
                          <th>Tag</th>
                          <th>Screenshot</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody id="adminTradesTableBody">
                        {draftTrades.length === 0 ? (
                          <tr>
                            <td
                              colSpan="7"
                              style={{
                                textAlign: 'center',
                                color: 'var(--text-muted)',
                                padding: '20px'
                              }}
                            >
                              No trades in database. Click &quot;Reload Mock Trades&quot; to restore.
                            </td>
                          </tr>
                        ) : (
                          draftTrades.map((t, idx) => {
                            const isWon = t.status === 'WON';
                            return (
                              <tr key={`${t.id}-${idx}`}>
                                <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                                  {t.id}
                                </td>
                                <td style={{ fontWeight: 600 }}>{t.symbol}</td>
                                <td>
                                  <span
                                    style={{
                                      color: isWon ? '#059669' : '#e11d48',
                                      fontWeight: 700
                                    }}
                                  >
                                    {t.status}
                                  </span>
                                </td>
                                <td
                                  style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: 700,
                                    color: isWon ? '#059669' : '#e11d48'
                                  }}
                                >
                                  {isWon ? '+' : ''}${parseFloat(t.pnl).toFixed(2)}
                                </td>
                                <td>
                                  <span
                                    className="tag-item-chip"
                                    style={{ fontSize: '10px', padding: '2px 6px' }}
                                  >
                                    {t.tag || 'Trade'}
                                  </span>
                                </td>
                                <td>
                                  {t.screenshot ? (
                                    <img
                                      src={t.screenshot}
                                      className="admin-trade-thumb"
                                      alt="chart"
                                    />
                                  ) : (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                                      None
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn-table-del"
                                    onClick={() => handleDeleteTrade(idx)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: BRANDING & METRICS */}
            {activeTab === 'branding' && (
              <div className="tab-panel active" id="tab-branding">
                <h2 className="panel-section-title">Branding &amp; Overview Baseline Metrics</h2>

                <div className="admin-form-group">
                  <label className="admin-label">App / Brand Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={branding.appName || ''}
                    onChange={(e) => updateBranding('appName', e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Brand Badge Tag</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={branding.appBadge || ''}
                    onChange={(e) => updateBranding('appBadge', e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Dashboard Main Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={branding.dashboardTitle || ''}
                    onChange={(e) => updateBranding('dashboardTitle', e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Trader Account Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={branding.traderName || ''}
                    onChange={(e) => updateBranding('traderName', e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Trader Account Handle</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={branding.traderHandle || ''}
                    onChange={(e) => updateBranding('traderHandle', e.target.value)}
                  />
                </div>

                <div className="color-picker-grid" style={{ marginTop: '14px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Initial Total Trades Count</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={branding.totalTrades ?? 1284}
                      onChange={(e) =>
                        updateBranding('totalTrades', parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Initial Win Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="admin-input"
                      value={branding.winRate ?? 76.4}
                      onChange={(e) => updateBranding('winRate', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Current Drawdown (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="admin-input"
                      value={branding.drawdown ?? 3.2}
                      onChange={(e) => updateBranding('drawdown', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Total Realized Profit / Loss ($)</label>
                    <input
                      type="number"
                      step="any"
                      className="admin-input"
                      value={branding.totalPnl ?? 142850}
                      onChange={(e) => updateBranding('totalPnl', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: REAL-TIME PREVIEW CANVAS */}
          <div className="admin-preview-panel">
            <div className="preview-header">
              <div className="preview-title-wrap">
                <span className="preview-badge">LIVE PREVIEW</span>
                <span className="preview-note">Interactive Real-time Rendering</span>
              </div>
              <div className="preview-mode-switch">
                <button
                  className={`prev-mode-btn${previewMode === 'dashboard' ? ' active' : ''}`}
                  onClick={() => setPreviewMode('dashboard')}
                >
                  Overview
                </button>
                <button
                  className={`prev-mode-btn${previewMode === 'journal' ? ' active' : ''}`}
                  onClick={() => setPreviewMode('journal')}
                >
                  Journal
                </button>
                <button
                  className={`prev-mode-btn${previewMode === 'addtrade' ? ' active' : ''}`}
                  onClick={() => setPreviewMode('addtrade')}
                >
                  + Add Trade
                </button>
              </div>
              <a
                href="/dashboard"
                className="preview-external-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/dashboard');
                }}
              >
                <span>Full App</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>

            <div className="preview-frame-wrap" id="previewContainer">
              {/* MODE 1: OVERVIEW DASHBOARD PREVIEW */}
              {previewMode === 'dashboard' && (
                <div
                  className="preview-sample-dashboard prev-screen-panel active"
                  id="prevModeDashboard"
                >
                  {widgets.summaryCards !== false && (
                    <div
                      className="preview-metric-row"
                      id="prevSummaryCardsRow"
                      style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
                    >
                      <div className="preview-card">
                        <div className="prev-label">Total Trades</div>
                        <div className="prev-val" id="prevValTrades">
                          {(branding.totalTrades ?? 1284).toLocaleString()}
                        </div>
                        <div className="prev-delta">+18 this wk</div>
                      </div>
                      <div className="preview-card">
                        <div className="prev-label">Win Rate (%)</div>
                        <div className="prev-val" id="prevValWinRate">
                          {branding.winRate ?? 76.4}%
                        </div>
                        <div className="prev-delta">980W / 304L</div>
                      </div>
                      <div className="preview-card">
                        <div className="prev-label">Drawdown (%)</div>
                        <div className="prev-val" id="prevValDrawdown">
                          {branding.drawdown ?? 3.2}%
                        </div>
                        <div className="prev-delta" style={{ color: '#059669' }}>
                          Safe Zone
                        </div>
                      </div>
                      <div className="preview-card">
                        <div className="prev-label">Profit / Loss</div>
                        <div className="prev-val" id="prevValPnl" style={{ color: '#059669' }}>
                          +$
                          {(branding.totalPnl ?? 142850).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                          })}
                        </div>
                        <div className="prev-delta">+24.6% ROI</div>
                      </div>
                    </div>
                  )}

                  <div className="preview-mid-grid" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
                    {widgets.equityChart !== false && (
                      <div className="preview-card" id="prevEquityChartCard">
                        <div className="prev-label">Equity Curve (Account Growth)</div>
                        <div
                          className="prev-val"
                          style={{ color: 'var(--brand-emerald)', fontSize: '17px' }}
                        >
                          $142,850.00
                        </div>
                        <div className="prev-sub">Outperforming Benchmark by +30.5%</div>
                      </div>
                    )}

                    {widgets.winLossChart !== false && (
                      <div className="preview-card" id="prevWinLossChartCard">
                        <div className="prev-label">Win / Loss Performance</div>
                        <div className="prev-val" style={{ fontSize: '17px' }}>
                          PF 2.42
                        </div>
                        <div className="prev-sub">Avg Win $1,420 vs Avg Loss $480</div>
                      </div>
                    )}
                  </div>

                  {widgets.recentTrades !== false && (
                    <div className="preview-card" id="prevRecentTradesCard">
                      <div className="prev-label" style={{ marginBottom: '8px' }}>
                        Recent Trades Preview (Last 3)
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '5px'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontFamily: 'var(--font-mono)',
                            padding: '4px 6px',
                            background: 'var(--canvas-bg)',
                            borderRadius: '4px'
                          }}
                        >
                          <span>BTC-USD · BUY</span>
                          <strong style={{ color: '#059669' }}>+$3,551.25 (WON)</strong>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontFamily: 'var(--font-mono)',
                            padding: '4px 6px',
                            background: 'var(--canvas-bg)',
                            borderRadius: '4px'
                          }}
                        >
                          <span>ETH-USD · BUY</span>
                          <strong style={{ color: '#059669' }}>+$2,304.00 (WON)</strong>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontFamily: 'var(--font-mono)',
                            padding: '4px 6px',
                            background: 'var(--canvas-bg)',
                            borderRadius: '4px'
                          }}
                        >
                          <span>SOL-USD · SHORT</span>
                          <strong style={{ color: '#059669' }}>+$540.00 (WON)</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODE 2: TRADES JOURNAL PREVIEW */}
              {previewMode === 'journal' && (
                <div
                  className="preview-sample-journal prev-screen-panel active"
                  id="prevModeJournal"
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      marginBottom: '8px',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>Journal Cards Preview</span>
                    <span
                      style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}
                      id="prevJournalCount"
                    >
                      {draftTrades.length} Total Trades
                    </span>
                  </div>
                  <div className="prev-journal-cards-grid" id="prevJournalCardsContainer">
                    {draftTrades.slice(0, 4).map((t) => {
                      const isWon = t.status === 'WON';
                      return (
                        <div className="prev-journal-card" key={t.id}>
                          {t.screenshot && (
                            <img src={t.screenshot} className="prev-journal-thumb" alt="thumb" />
                          )}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <strong style={{ color: 'var(--text-main)', fontSize: '11px' }}>
                              {t.symbol}
                            </strong>
                            <span
                              style={{
                                fontSize: '9.5px',
                                fontWeight: 700,
                                color: isWon ? '#059669' : '#e11d48'
                              }}
                            >
                              {t.status}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: '13px',
                              fontWeight: 800,
                              fontFamily: 'var(--font-mono)',
                              color: isWon ? '#059669' : '#e11d48'
                            }}
                          >
                            {isWon ? '+' : ''}${parseFloat(t.pnl).toFixed(2)}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '9.5px',
                              color: 'var(--text-muted)'
                            }}
                          >
                            <span>
                              Tag: <strong>{t.tag || 'Trade'}</strong>
                            </span>
                            <span>{t.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MODE 3: ADD TRADE MODULE PREVIEW */}
              {previewMode === 'addtrade' && (
                <div
                  className="preview-sample-addtrade prev-screen-panel active"
                  id="prevModeAddTrade"
                >
                  <div className="preview-card" style={{ padding: '16px' }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        marginBottom: '10px'
                      }}
                    >
                      + Add Trade Form Preview
                    </div>
                    <div
                      style={{
                        border: '1.5px dashed var(--brand-emerald)',
                        borderRadius: '8px',
                        padding: '16px',
                        textAlign: 'center',
                        marginBottom: '12px',
                        background: 'rgba(16, 185, 129, 0.04)'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'var(--brand-emerald)'
                        }}
                      >
                        Drag &amp; Drop Trade Screenshot Dropzone
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        fontSize: '11px',
                        marginBottom: '10px'
                      }}
                    >
                      <div
                        style={{
                          background: 'var(--canvas-bg)',
                          padding: '6px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        Pair: <strong>BTC/USDT</strong>
                      </div>
                      <div
                        style={{
                          background: 'var(--canvas-bg)',
                          padding: '6px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        Side: <strong>BUY / LONG</strong>
                      </div>
                      <div
                        style={{
                          background: 'var(--canvas-bg)',
                          padding: '6px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        Entry: <strong>$68,450</strong>
                      </div>
                      <div
                        style={{
                          background: 'var(--canvas-bg)',
                          padding: '6px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        Exit: <strong>$70,820</strong>
                      </div>
                      <div
                        style={{
                          background: 'var(--canvas-bg)',
                          padding: '6px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        SL: <strong style={{ color: '#e11d48' }}>$67,200</strong>
                      </div>
                      <div
                        style={{
                          background: 'var(--canvas-bg)',
                          padding: '6px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        TP: <strong style={{ color: '#059669' }}>$71,500</strong>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        marginBottom: '6px'
                      }}
                    >
                      Active Tags:
                    </div>
                    <div
                      className="prev-tags-preview"
                      id="prevActiveTagsRow"
                      style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}
                    >
                      {draftConfig.tags.map((tag) => (
                        <span
                          key={tag}
                          className="tag-item-chip"
                          style={{
                            fontSize: '10px',
                            padding: '3px 8px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            borderColor: 'var(--brand-emerald)',
                            color: 'var(--brand-emerald)'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


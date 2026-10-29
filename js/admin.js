// Mission 3 - Admin Studio Customizer Logic
import { RECENT_TRADES } from './data.js';

const DEFAULT_CONFIG = {
  colors: {
    accent: '#10b981',
    sidebarBg: '#061e1b',
    canvasBg: '#f4f7f6',
    cardBg: '#ffffff',
    textMain: '#142220',
    green: '#059669'
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    monoFont: "'JetBrains Mono', monospace",
    baseFontSize: 14,
    letterSpacing: -0.5
  },
  styling: {
    radius: 20,
    shadowStyle: 'soft',
    borderStyle: 'subtle',
    density: 'normal'
  },
  widgets: {
    summaryCards: true,
    equityChart: true,
    winLossChart: true,
    recentTrades: true,
    addTradeModule: true,
    navTrades: true,
    navAnalytics: true,
    navCalendar: true,
    navSettings: true
  },
  tags: ['Scalping', 'Swing', 'News Trade', 'Breakout', 'Reversal', 'Day Trade'],
  tradingPairs: 'BTC/USDT, ETH/USD, SOL/USD, NVDA, AAPL, EUR/USD, GBP/USD, GOLD',
  branding: {
    appName: 'Mission 3',
    appBadge: 'PRO',
    dashboardTitle: 'Main Dashboard (Overview)',
    traderName: 'Alex Williamson',
    traderHandle: '#trader-1974',
    totalTrades: 1284,
    winRate: 76.4,
    drawdown: 3.2,
    totalPnl: 142850.00
  }
};

const PRESET_THEMES = {
  emerald: {
    accent: '#10b981',
    sidebarBg: '#061e1b',
    canvasBg: '#f4f7f6',
    cardBg: '#ffffff',
    textMain: '#142220',
    green: '#059669'
  },
  cyber: {
    accent: '#06b6d4',
    sidebarBg: '#081e28',
    canvasBg: '#f0f9ff',
    cardBg: '#ffffff',
    textMain: '#0c2638',
    green: '#0ea5e9'
  },
  royal: {
    accent: '#6366f1',
    sidebarBg: '#13112c',
    canvasBg: '#f5f3ff',
    cardBg: '#ffffff',
    textMain: '#1e1b4b',
    green: '#8b5cf6'
  },
  sunset: {
    accent: '#f97316',
    sidebarBg: '#231508',
    canvasBg: '#fffaf5',
    cardBg: '#ffffff',
    textMain: '#2e1804',
    green: '#ea580c'
  },
  ruby: {
    accent: '#e11d48',
    sidebarBg: '#1f080e',
    canvasBg: '#fff1f2',
    cardBg: '#ffffff',
    textMain: '#2b0711',
    green: '#f43f5e'
  },
  darkObsidian: {
    accent: '#3b82f6',
    sidebarBg: '#0b1120',
    canvasBg: '#0f172a',
    cardBg: '#1e293b',
    textMain: '#f8fafc',
    green: '#10b981'
  }
};

class AdminStudio {
  constructor() {
    this.config = this.loadConfig();
    this.trades = this.loadTrades();
    this.previewMode = 'dashboard';
    this.init();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem('mission3_admin_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          colors: { ...DEFAULT_CONFIG.colors, ...(parsed.colors || {}) },
          typography: { ...DEFAULT_CONFIG.typography, ...(parsed.typography || {}) },
          styling: { ...DEFAULT_CONFIG.styling, ...(parsed.styling || {}) },
          widgets: { ...DEFAULT_CONFIG.widgets, ...(parsed.widgets || {}) },
          branding: { ...DEFAULT_CONFIG.branding, ...(parsed.branding || {}) },
          tags: parsed.tags || DEFAULT_CONFIG.tags,
          tradingPairs: parsed.tradingPairs || DEFAULT_CONFIG.tradingPairs
        };
      }
      return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    }
  }

  loadTrades() {
    try {
      const saved = localStorage.getItem('mission3_trades_data');
      return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(RECENT_TRADES));
    } catch (e) {
      return JSON.parse(JSON.stringify(RECENT_TRADES));
    }
  }

  saveConfig() {
    localStorage.setItem('mission3_admin_config', JSON.stringify(this.config));
    localStorage.setItem('mission3_trades_data', JSON.stringify(this.trades));
    localStorage.setItem('mission3_tags', JSON.stringify(this.config.tags));
    this.showToast('All custom styles, widgets & trade data saved successfully!', 'success');
  }

  init() {
    this.setupTabs();
    this.setupPreviewModeSwitch();
    this.populateControls();
    this.renderTagsManager();
    this.renderAdminTradesTable();
    this.setupEventListeners();
    this.applyLiveStyles();
    this.updateLivePreview();
  }

  setupTabs() {
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetTab = btn.dataset.tab;
        const panel = document.getElementById(`tab-${targetTab}`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  setupPreviewModeSwitch() {
    const modeBtns = document.querySelectorAll('.prev-mode-btn');
    const panels = document.querySelectorAll('.prev-screen-panel');

    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        this.previewMode = btn.dataset.mode;
        
        if (this.previewMode === 'dashboard') {
          document.getElementById('prevModeDashboard').classList.add('active');
        } else if (this.previewMode === 'journal') {
          document.getElementById('prevModeJournal').classList.add('active');
          this.renderPreviewJournalCards();
        } else if (this.previewMode === 'addtrade') {
          document.getElementById('prevModeAddTrade').classList.add('active');
          this.renderPreviewActiveTags();
        }
      });
    });
  }

  populateControls() {
    // Colors
    document.getElementById('pickerAccent').value = this.config.colors.accent;
    document.getElementById('textAccent').value = this.config.colors.accent;
    document.getElementById('pickerSidebarBg').value = this.config.colors.sidebarBg;
    document.getElementById('textSidebarBg').value = this.config.colors.sidebarBg;
    document.getElementById('pickerCanvasBg').value = this.config.colors.canvasBg;
    document.getElementById('textCanvasBg').value = this.config.colors.canvasBg;
    document.getElementById('pickerCardBg').value = this.config.colors.cardBg;
    document.getElementById('textCardBg').value = this.config.colors.cardBg;
    document.getElementById('pickerTextMain').value = this.config.colors.textMain;
    document.getElementById('textTextMain').value = this.config.colors.textMain;
    document.getElementById('pickerGreen').value = this.config.colors.green;
    document.getElementById('textGreen').value = this.config.colors.green;

    // Typography
    document.getElementById('fontFamilySelect').value = this.config.typography.fontFamily;
    document.getElementById('monoFontSelect').value = this.config.typography.monoFont;
    document.getElementById('fontSizeSlider').value = this.config.typography.baseFontSize;
    document.getElementById('fontSizeVal').textContent = `${this.config.typography.baseFontSize}px`;
    document.getElementById('letterSpacingSlider').value = this.config.typography.letterSpacing * 10;
    document.getElementById('letterSpacingVal').textContent = `${this.config.typography.letterSpacing}px`;

    // Styling
    document.getElementById('radiusSlider').value = this.config.styling.radius;
    document.getElementById('radiusVal').textContent = `${this.config.styling.radius}px`;
    document.getElementById('shadowStyleSelect').value = this.config.styling.shadowStyle;
    document.getElementById('borderStyleSelect').value = this.config.styling.borderStyle;
    document.getElementById('densitySelect').value = this.config.styling.density;

    // Widgets & Navigation Toggles
    const setCheck = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = val !== false;
    };
    setCheck('admToggleSummaryCards', this.config.widgets.summaryCards);
    setCheck('admToggleEquityChart', this.config.widgets.equityChart);
    setCheck('admToggleWinLossChart', this.config.widgets.winLossChart);
    setCheck('admToggleRecentTrades', this.config.widgets.recentTrades);
    setCheck('admToggleAddTradeModule', this.config.widgets.addTradeModule);
    setCheck('admToggleNavTrades', this.config.widgets.navTrades);
    setCheck('admToggleNavAnalytics', this.config.widgets.navAnalytics);
    setCheck('admToggleNavCalendar', this.config.widgets.navCalendar);
    setCheck('admToggleNavSettings', this.config.widgets.navSettings);

    // Trading Pairs
    const pairsEl = document.getElementById('tradingPairsInput');
    if (pairsEl) pairsEl.value = this.config.tradingPairs || DEFAULT_CONFIG.tradingPairs;

    // Branding
    document.getElementById('brandNameInput').value = this.config.branding.appName || 'Mission 3';
    document.getElementById('brandBadgeInput').value = this.config.branding.appBadge || 'PRO';
    document.getElementById('dashboardTitleInput').value = this.config.branding.dashboardTitle || 'Main Dashboard (Overview)';
    document.getElementById('traderNameInput').value = this.config.branding.traderName || 'Alex Williamson';
    document.getElementById('traderHandleInput').value = this.config.branding.traderHandle || '#trader-1974';

    // Metrics
    const setVal = (id, v) => {
      const el = document.getElementById(id);
      if (el && v !== undefined) el.value = v;
    };
    setVal('admInpTotalTrades', this.config.branding.totalTrades);
    setVal('admInpWinRate', this.config.branding.winRate);
    setVal('admInpDrawdown', this.config.branding.drawdown);
    setVal('admInpTotalPnl', this.config.branding.totalPnl);
  }

  renderTagsManager() {
    const container = document.getElementById('adminTagsList');
    if (!container) return;

    container.innerHTML = this.config.tags.map((tag, idx) => `
      <div class="tag-item-chip">
        <span>${tag}</span>
        <button type="button" class="btn-delete-tag" data-tag-idx="${idx}" title="Remove tag">&times;</button>
      </div>
    `).join('');

    container.querySelectorAll('.btn-delete-tag').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.dataset.tagIdx);
        this.config.tags.splice(idx, 1);
        this.renderTagsManager();
        this.renderPreviewActiveTags();
        this.showToast('Strategy tag removed', 'info');
      });
    });
  }

  renderAdminTradesTable() {
    const tbody = document.getElementById('adminTradesTableBody');
    const countEl = document.getElementById('adminTradesCount');
    if (countEl) countEl.textContent = this.trades.length;
    if (!tbody) return;

    if (this.trades.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">
            No trades in database. Click "Reload Mock Trades" to restore.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.trades.map((t, idx) => {
      const isWon = t.status === 'WON';
      return `
        <tr>
          <td style="font-weight: 700; font-family: var(--font-mono);">${t.id}</td>
          <td style="font-weight: 600;">${t.symbol}</td>
          <td>
            <span style="color: ${isWon ? '#059669' : '#e11d48'}; font-weight: 700;">
              ${t.status}
            </span>
          </td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: ${isWon ? '#059669' : '#e11d48'};">
            ${isWon ? '+' : ''}$${parseFloat(t.pnl).toFixed(2)}
          </td>
          <td><span class="tag-item-chip" style="font-size: 10px; padding: 2px 6px;">${t.tag || 'Trade'}</span></td>
          <td>
            ${t.screenshot ? `<img src="${t.screenshot}" class="admin-trade-thumb" alt="chart">` : '<span style="color: var(--text-muted); font-size: 10px;">None</span>'}
          </td>
          <td>
            <button type="button" class="btn-table-del" data-trade-idx="${idx}">Delete</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-table-del').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.tradeIdx);
        this.trades.splice(idx, 1);
        this.renderAdminTradesTable();
        this.renderPreviewJournalCards();
        this.showToast('Trade record deleted', 'info');
      });
    });
  }

  renderPreviewJournalCards() {
    const container = document.getElementById('prevJournalCardsContainer');
    const countEl = document.getElementById('prevJournalCount');
    if (!container) return;

    const previewList = this.trades.slice(0, 4);
    if (countEl) countEl.textContent = `${this.trades.length} Total Trades`;

    container.innerHTML = previewList.map(t => {
      const isWon = t.status === 'WON';
      return `
        <div class="prev-journal-card">
          ${t.screenshot ? `<img src="${t.screenshot}" class="prev-journal-thumb" alt="thumb">` : ''}
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: var(--text-main); font-size: 11px;">${t.symbol}</strong>
            <span style="font-size: 9.5px; font-weight: 700; color: ${isWon ? '#059669' : '#e11d48'};">${t.status}</span>
          </div>
          <div style="font-size: 13px; font-weight: 800; font-family: var(--font-mono); color: ${isWon ? '#059669' : '#e11d48'};">
            ${isWon ? '+' : ''}$${parseFloat(t.pnl).toFixed(2)}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: var(--text-muted);">
            <span>Tag: <strong>${t.tag || 'Trade'}</strong></span>
            <span>${t.time}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  renderPreviewActiveTags() {
    const container = document.getElementById('prevActiveTagsRow');
    if (!container) return;

    container.innerHTML = this.config.tags.map(tag => `
      <span class="tag-item-chip" style="font-size: 10px; padding: 3px 8px; background: rgba(16, 185, 129, 0.1); border-color: var(--brand-emerald); color: var(--brand-emerald);">
        ${tag}
      </span>
    `).join('');
  }

  setupEventListeners() {
    // Preset Theme Buttons
    document.querySelectorAll('.preset-theme-card').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.preset-theme-card').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const preset = PRESET_THEMES[btn.dataset.preset];
        if (preset) {
          this.config.colors = { ...this.config.colors, ...preset };
          this.populateControls();
          this.applyLiveStyles();
        }
      });
    });

    // Color Pickers dual binding
    const bindColor = (pickerId, textId, key) => {
      const picker = document.getElementById(pickerId);
      const text = document.getElementById(textId);
      if (picker && text) {
        picker.addEventListener('input', (e) => {
          text.value = e.target.value;
          this.config.colors[key] = e.target.value;
          this.applyLiveStyles();
        });
        text.addEventListener('input', (e) => {
          picker.value = e.target.value;
          this.config.colors[key] = e.target.value;
          this.applyLiveStyles();
        });
      }
    };

    bindColor('pickerAccent', 'textAccent', 'accent');
    bindColor('pickerSidebarBg', 'textSidebarBg', 'sidebarBg');
    bindColor('pickerCanvasBg', 'textCanvasBg', 'canvasBg');
    bindColor('pickerCardBg', 'textCardBg', 'cardBg');
    bindColor('pickerTextMain', 'textTextMain', 'textMain');
    bindColor('pickerGreen', 'textGreen', 'green');

    // Typography
    document.getElementById('fontFamilySelect').addEventListener('change', (e) => {
      this.config.typography.fontFamily = e.target.value;
      this.applyLiveStyles();
    });

    document.getElementById('monoFontSelect').addEventListener('change', (e) => {
      this.config.typography.monoFont = e.target.value;
      this.applyLiveStyles();
    });

    document.getElementById('fontSizeSlider').addEventListener('input', (e) => {
      this.config.typography.baseFontSize = parseInt(e.target.value);
      document.getElementById('fontSizeVal').textContent = `${e.target.value}px`;
      this.applyLiveStyles();
    });

    document.getElementById('letterSpacingSlider').addEventListener('input', (e) => {
      const val = (parseInt(e.target.value) / 10).toFixed(1);
      this.config.typography.letterSpacing = parseFloat(val);
      document.getElementById('letterSpacingVal').textContent = `${val}px`;
      this.applyLiveStyles();
    });

    // Styling
    document.getElementById('radiusSlider').addEventListener('input', (e) => {
      this.config.styling.radius = parseInt(e.target.value);
      document.getElementById('radiusVal').textContent = `${e.target.value}px`;
      this.applyLiveStyles();
    });

    document.getElementById('shadowStyleSelect').addEventListener('change', (e) => {
      this.config.styling.shadowStyle = e.target.value;
      this.applyLiveStyles();
    });

    document.getElementById('borderStyleSelect').addEventListener('change', (e) => {
      this.config.styling.borderStyle = e.target.value;
      this.applyLiveStyles();
    });

    document.getElementById('densitySelect').addEventListener('change', (e) => {
      this.config.styling.density = e.target.value;
      this.applyLiveStyles();
    });

    // Widget checkboxes
    const bindWidget = (id, key, previewId) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          this.config.widgets[key] = e.target.checked;
          if (previewId) {
            const prevEl = document.getElementById(previewId);
            if (prevEl) prevEl.style.display = e.target.checked ? '' : 'none';
          }
        });
      }
    };

    bindWidget('admToggleSummaryCards', 'summaryCards', 'prevSummaryCardsRow');
    bindWidget('admToggleEquityChart', 'equityChart', 'prevEquityChartCard');
    bindWidget('admToggleWinLossChart', 'winLossChart', 'prevWinLossChartCard');
    bindWidget('admToggleRecentTrades', 'recentTrades', 'prevRecentTradesCard');
    bindWidget('admToggleAddTradeModule', 'addTradeModule');
    bindWidget('admToggleNavTrades', 'navTrades');
    bindWidget('admToggleNavAnalytics', 'navAnalytics');
    bindWidget('admToggleNavCalendar', 'navCalendar');
    bindWidget('admToggleNavSettings', 'navSettings');

    // Add New Tag
    const addTagBtn = document.getElementById('addNewTagBtn');
    const newTagInput = document.getElementById('newTagNameInput');
    if (addTagBtn && newTagInput) {
      const doAddTag = () => {
        const val = newTagInput.value.trim();
        if (val && !this.config.tags.includes(val)) {
          this.config.tags.push(val);
          newTagInput.value = '';
          this.renderTagsManager();
          this.renderPreviewActiveTags();
          this.showToast(`Added tag "${val}"`, 'success');
        }
      };
      addTagBtn.addEventListener('click', doAddTag);
      newTagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          doAddTag();
        }
      });
    }

    // Trading Pairs Input
    const pairsEl = document.getElementById('tradingPairsInput');
    if (pairsEl) {
      pairsEl.addEventListener('input', (e) => {
        this.config.tradingPairs = e.target.value;
      });
    }

    // Trades Database Action Buttons
    const resetMockBtn = document.getElementById('adminResetMockTradesBtn');
    if (resetMockBtn) {
      resetMockBtn.addEventListener('click', () => {
        this.trades = JSON.parse(JSON.stringify(RECENT_TRADES));
        this.renderAdminTradesTable();
        this.renderPreviewJournalCards();
        this.showToast('Reset to original mock trade log', 'info');
      });
    }

    const clearTradesBtn = document.getElementById('adminClearAllTradesBtn');
    if (clearTradesBtn) {
      clearTradesBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all logged trades?')) {
          this.trades = [];
          this.renderAdminTradesTable();
          this.renderPreviewJournalCards();
          this.showToast('All trades cleared', 'info');
        }
      });
    }

    // Branding text inputs
    document.getElementById('brandNameInput').addEventListener('input', (e) => {
      this.config.branding.appName = e.target.value;
      const brandEl = document.getElementById('adminSidebarBrand');
      if (brandEl) {
        brandEl.innerHTML = `${e.target.value} <span class="brand-badge" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa;">ADMIN</span>`;
      }
    });

    document.getElementById('brandBadgeInput').addEventListener('input', (e) => {
      this.config.branding.appBadge = e.target.value;
    });

    document.getElementById('dashboardTitleInput').addEventListener('input', (e) => {
      this.config.branding.dashboardTitle = e.target.value;
    });

    document.getElementById('traderNameInput').addEventListener('input', (e) => {
      this.config.branding.traderName = e.target.value;
    });

    document.getElementById('traderHandleInput').addEventListener('input', (e) => {
      this.config.branding.traderHandle = e.target.value;
    });

    // Metric numbers & live preview reactivity
    const bindMetricInput = (id, key, previewId, prefix = '', suffix = '') => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value) || 0;
          this.config.branding[key] = val;
          if (previewId) {
            const prev = document.getElementById(previewId);
            if (prev) {
              prev.textContent = `${prefix}${val.toLocaleString()}${suffix}`;
            }
          }
        });
      }
    };
    bindMetricInput('admInpTotalTrades', 'totalTrades', 'prevValTrades');
    bindMetricInput('admInpWinRate', 'winRate', 'prevValWinRate', '', '%');
    bindMetricInput('admInpDrawdown', 'drawdown', 'prevValDrawdown', '', '%');
    bindMetricInput('admInpTotalPnl', 'totalPnl', 'prevValPnl', '+$');

    // Top action buttons
    document.getElementById('saveAllConfigBtn').addEventListener('click', () => {
      this.saveConfig();
    });

    document.getElementById('resetConfigBtn').addEventListener('click', () => {
      this.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
      this.trades = JSON.parse(JSON.stringify(RECENT_TRADES));
      this.populateControls();
      this.renderTagsManager();
      this.renderAdminTradesTable();
      this.applyLiveStyles();
      this.updateLivePreview();
      this.saveConfig();
      this.showToast('Reset to default factory settings', 'info');
    });

    // Export JSON
    document.getElementById('exportConfigBtn').addEventListener('click', () => {
      const payload = {
        config: this.config,
        trades: this.trades
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "mission3_studio_export.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      this.showToast('Configuration & Trades exported successfully', 'success');
    });

    // Import JSON
    const importInput = document.getElementById('importConfigInput');
    const importTrigger = document.getElementById('importConfigTriggerBtn');
    if (importTrigger && importInput) {
      importTrigger.addEventListener('click', () => importInput.click());
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            if (imported.config) this.config = { ...DEFAULT_CONFIG, ...imported.config };
            if (imported.trades) this.trades = imported.trades;
            this.populateControls();
            this.renderTagsManager();
            this.renderAdminTradesTable();
            this.applyLiveStyles();
            this.updateLivePreview();
            this.saveConfig();
            this.showToast('Configuration imported and applied successfully!', 'success');
          } catch (err) {
            this.showToast('Invalid JSON file format', 'error');
          }
        };
        reader.readAsText(file);
      });
    }
  }

  applyLiveStyles() {
    const root = document.documentElement;

    root.style.setProperty('--brand-emerald', this.config.colors.accent);
    root.style.setProperty('--sidebar-bg', this.config.colors.sidebarBg);
    root.style.setProperty('--canvas-bg', this.config.colors.canvasBg);
    root.style.setProperty('--card-bg', this.config.colors.cardBg);
    root.style.setProperty('--text-main', this.config.colors.textMain);
    root.style.setProperty('--color-green', this.config.colors.green);

    root.style.setProperty('--font-main', this.config.typography.fontFamily);
    root.style.setProperty('--font-mono', this.config.typography.monoFont);

    root.style.setProperty('--radius-md', `${this.config.styling.radius}px`);

    if (this.config.styling.shadowStyle === 'flat') {
      root.style.setProperty('--shadow-card', 'none');
      root.style.setProperty('--shadow-hover', 'none');
    } else if (this.config.styling.shadowStyle === 'elevated') {
      root.style.setProperty('--shadow-card', '0 10px 25px -3px rgba(0,0,0,0.12), 0 4px 6px -2px rgba(0,0,0,0.05)');
    } else if (this.config.styling.shadowStyle === 'glow') {
      root.style.setProperty('--shadow-card', `0 0 20px ${this.config.colors.accent}33`);
    } else {
      root.style.setProperty('--shadow-card', '0 4px 20px -2px rgba(10, 35, 30, 0.04), 0 2px 6px -1px rgba(10, 35, 30, 0.02)');
    }

    if (this.config.styling.borderStyle === 'none') {
      root.style.setProperty('--card-border', 'transparent');
    } else if (this.config.styling.borderStyle === 'medium') {
      root.style.setProperty('--card-border', '#cbdad5');
    } else {
      root.style.setProperty('--card-border', '#e6ecea');
    }
  }

  updateLivePreview() {
    const prevTrades = document.getElementById('prevValTrades');
    const prevWinRate = document.getElementById('prevValWinRate');
    const prevDrawdown = document.getElementById('prevValDrawdown');
    const prevPnl = document.getElementById('prevValPnl');

    if (prevTrades) prevTrades.textContent = (this.config.branding.totalTrades || 1284).toLocaleString();
    if (prevWinRate) prevWinRate.textContent = `${this.config.branding.winRate || 76.4}%`;
    if (prevDrawdown) prevDrawdown.textContent = `${this.config.branding.drawdown || 3.2}%`;
    if (prevPnl) prevPnl.textContent = `+$${(this.config.branding.totalPnl || 142850).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    this.renderPreviewJournalCards();
    this.renderPreviewActiveTags();
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.adminStudio = new AdminStudio();
});

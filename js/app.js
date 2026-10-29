// Mission 3 Master Application Controller
import { ASSETS, INITIAL_ACCOUNT, EQUITY_CURVE_DATA, WIN_LOSS_PERFORMANCE, RECENT_TRADES } from './data.js';
import { EquityCurveChart, WinLossPerformanceChart } from './chart.js';
import { TradingManager } from './trading.js';

class Mission3App {
  constructor() {
    this.currentView = 'dashboard';
    this.theme = localStorage.getItem('mission3_theme') || 'light';
    this.assets = JSON.parse(JSON.stringify(ASSETS));
    this.recentTrades = JSON.parse(JSON.stringify(RECENT_TRADES));
    this.equityData = JSON.parse(JSON.stringify(EQUITY_CURVE_DATA));
    this.winLossData = JSON.parse(JSON.stringify(WIN_LOSS_PERFORMANCE));
    this.activeTradeFilter = 'ALL';
    this.activeJournalTagFilter = 'ALL';
    this.currentUploadedScreenshot = null;
    this.selectedTag = 'Scalping';

    this.tradingManager = new TradingManager(INITIAL_ACCOUNT, (account) => this.renderAccountState(account));
    this.equityChart = null;
    this.winLossChart = null;

    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.applyAdminCustomizations();
    this.initCharts();
    this.renderRecentTrades();
    this.renderTradesJournal();
    this.setupEventListeners();
    this.setupAddTradeModule();
    this.renderAccountState(this.tradingManager.account);
    this.startLiveSimulation();
  }

  applyAdminCustomizations() {
    try {
      const raw = localStorage.getItem('mission3_admin_config');
      if (!raw) return;
      const config = JSON.parse(raw);
      const root = document.documentElement;

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
        if (config.styling.radius !== undefined) root.style.setProperty('--radius-md', `${config.styling.radius}px`);
        if (config.styling.shadowStyle === 'flat') {
          root.style.setProperty('--shadow-card', 'none');
          root.style.setProperty('--shadow-hover', 'none');
        } else if (config.styling.shadowStyle === 'elevated') {
          root.style.setProperty('--shadow-card', '0 10px 25px -3px rgba(0,0,0,0.12), 0 4px 6px -2px rgba(0,0,0,0.05)');
        } else if (config.styling.shadowStyle === 'glow') {
          root.style.setProperty('--shadow-card', `0 0 20px ${config.colors?.accent || '#10b981'}33`);
        }
      }

      if (config.branding) {
        if (config.branding.appName) {
          const brandTitle = document.querySelector('.brand-name');
          if (brandTitle) {
            brandTitle.innerHTML = `${config.branding.appName} <span class="brand-badge">${config.branding.appBadge || 'PRO'}</span>`;
          }
        }
        if (config.branding.dashboardTitle) {
          const mainTitle = document.getElementById('pageMainTitle');
          if (mainTitle) mainTitle.textContent = config.branding.dashboardTitle;
        }
        if (config.branding.traderName) {
          const nameEl = document.querySelector('.user-name');
          if (nameEl) nameEl.textContent = config.branding.traderName;
        }
        if (config.branding.traderHandle) {
          const handleEl = document.querySelector('.user-handle');
          if (handleEl) handleEl.textContent = config.branding.traderHandle;
        }
      }
    } catch (e) {
      console.warn('Could not apply admin customizations', e);
    }
  }

  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mission3_theme', theme);

    const themeStatusText = document.querySelector('.theme-text-status');
    if (themeStatusText) {
      themeStatusText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }

    if (this.equityChart) this.equityChart.render();
    if (this.winLossChart) this.winLossChart.render();
  }

  toggleTheme() {
    const nextTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
    this.tradingManager.showToast(`Switched to ${nextTheme.toUpperCase()} mode`, 'info');
  }

  initCharts() {
    this.equityChart = new EquityCurveChart('equityCurveCanvas', this.equityData);
    this.winLossChart = new WinLossPerformanceChart('winLossCanvas', this.winLossData);
  }

  switchView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));

    const titleEl = document.getElementById('pageMainTitle');
    const subEl = document.getElementById('pageLiveSubtitle');

    if (viewName === 'dashboard') {
      document.getElementById('viewDashboard').classList.add('active');
      if (titleEl) titleEl.textContent = 'Main Dashboard (Overview)';
      if (subEl) subEl.textContent = 'Live Portfolio Feed';
      if (this.equityChart) setTimeout(() => this.equityChart.resize(), 50);
      if (this.winLossChart) setTimeout(() => this.winLossChart.resize(), 50);
    } else if (viewName === 'trades') {
      document.getElementById('viewTrades').classList.add('active');
      if (titleEl) titleEl.textContent = 'Trades Journal & History';
      if (subEl) subEl.textContent = `${this.recentTrades.length} Total Executions`;
      this.renderTradesJournal();
    } else if (viewName === 'analytics') {
      document.getElementById('viewAnalytics').classList.add('active');
      if (titleEl) titleEl.textContent = 'Performance Analytics';
      if (subEl) subEl.textContent = 'Risk & Alpha Breakdown';
    } else if (viewName === 'calendar') {
      document.getElementById('viewCalendar').classList.add('active');
      if (titleEl) titleEl.textContent = 'Economic & Trade Calendar';
      if (subEl) subEl.textContent = 'Upcoming Market Events';
    } else if (viewName === 'settings') {
      document.getElementById('viewSettings').classList.add('active');
      if (titleEl) titleEl.textContent = 'Account Settings';
      if (subEl) subEl.textContent = 'Platform Preferences';
    }
  }

  renderRecentTrades() {
    const tbody = document.getElementById('recentTradesTableBody');
    if (!tbody) return;

    let filtered = this.recentTrades;
    if (this.activeTradeFilter === 'WON') {
      filtered = this.recentTrades.filter(t => t.status === 'WON');
    } else if (this.activeTradeFilter === 'LOST') {
      filtered = this.recentTrades.filter(t => t.status === 'LOST');
    } else if (this.activeTradeFilter === 'CRYPTO') {
      filtered = this.recentTrades.filter(t => t.symbol.includes('-') || t.symbol.includes('BTC') || t.symbol.includes('ETH') || t.symbol.includes('SOL'));
    } else if (this.activeTradeFilter === 'STOCKS') {
      filtered = this.recentTrades.filter(t => !t.symbol.includes('-') && !t.symbol.includes('/'));
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; color: var(--text-muted); padding: 24px;">
            No trades match this filter category.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(t => {
      const isWon = t.status === 'WON';
      return `
        <tr>
          <td style="font-weight: 700; color: var(--text-muted); font-size: 11px;">${t.id}</td>
          <td style="font-weight: 700; color: var(--text-main);">${t.symbol}</td>
          <td>
            <span class="table-badge ${t.type === 'LONG' ? 'badge-long' : 'badge-short'}">
              ${t.side}
            </span>
          </td>
          <td>$${parseFloat(t.entry).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
          <td>$${parseFloat(t.exit).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
          <td>${t.size}</td>
          <td style="font-weight: 800; color: ${isWon ? '#059669' : '#e11d48'};">
            ${isWon ? '+' : ''}$${parseFloat(t.pnl).toFixed(2)} (${isWon ? '+' : ''}${parseFloat(t.pnlPercent || 0).toFixed(2)}%)
          </td>
          <td style="color: var(--text-muted);">${t.duration || '2h'}</td>
          <td style="color: var(--text-muted); font-size: 11px;">${t.time}</td>
          <td>
            <span class="status-badge ${isWon ? 'status-won' : 'status-lost'}">
              ${t.status}
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }

  renderTradesJournal() {
    const container = document.getElementById('journalTradesContainer');
    if (!container) return;

    let filtered = this.recentTrades;
    if (this.activeJournalTagFilter !== 'ALL') {
      filtered = this.recentTrades.filter(t => t.tag === this.activeJournalTagFilter);
    }

    // Update journal stats
    const totalLoggedEl = document.getElementById('journalTotalLogged');
    const winRateEl = document.getElementById('journalWinRate');
    if (totalLoggedEl) totalLoggedEl.textContent = this.recentTrades.length.toLocaleString();
    if (winRateEl) {
      const wonCount = this.recentTrades.filter(t => t.status === 'WON').length;
      const rate = this.recentTrades.length ? ((wonCount / this.recentTrades.length) * 100).toFixed(1) : '0.0';
      winRateEl.textContent = `${rate}%`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          No trades logged under tag: <strong>${this.activeJournalTagFilter}</strong>. Click <strong>+ Add Trade</strong> to record one!
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(t => {
      const isWon = t.status === 'WON';
      const isBE = t.status === 'BREAK-EVEN';
      const statusColor = isWon ? '#059669' : (isBE ? '#f59e0b' : '#e11d48');
      const statusBg = isWon ? 'var(--color-green-bg)' : (isBE ? '#fef3c7' : 'var(--color-red-bg)');

      const screenshotHtml = t.screenshot ? `
        <div class="trade-card-thumb-wrap" data-img-src="${t.screenshot}" data-img-title="${t.symbol} - ${t.side} (${t.id})">
          <img src="${t.screenshot}" alt="${t.symbol}" class="trade-card-thumb">
          <div class="trade-thumb-overlay-hint">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
            <span style="margin-left: 6px;">View Full Screenshot</span>
          </div>
        </div>
      ` : '';

      return `
        <div class="trade-card-item">
          ${screenshotHtml}
          
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 800; font-size: 15px; color: var(--text-main);">${t.symbol}</span>
              <span class="table-badge ${t.type === 'LONG' ? 'badge-long' : 'badge-short'}">${t.side}</span>
            </div>
            <span class="status-badge" style="background-color: ${statusBg}; color: ${statusColor};">
              ${t.status}
            </span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <div style="font-size: 18px; font-weight: 800; font-family: var(--font-mono); color: ${statusColor};">
              ${isWon ? '+' : ''}$${parseFloat(t.pnl).toFixed(2)}
            </div>
            <span class="trade-card-tag-badge">${t.tag || 'Trade'}</span>
          </div>

          <!-- Entry / Exit & SL / TP grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; background: var(--canvas-bg); padding: 10px; border-radius: var(--radius-sm);">
            <div><span style="color: var(--text-muted);">Entry:</span> <strong style="font-family: var(--font-mono);">$${parseFloat(t.entry).toLocaleString()}</strong></div>
            <div><span style="color: var(--text-muted);">Exit:</span> <strong style="font-family: var(--font-mono);">$${parseFloat(t.exit).toLocaleString()}</strong></div>
            <div><span style="color: var(--text-muted);">Stop Loss:</span> <strong style="font-family: var(--font-mono); color: #e11d48;">${t.stopLoss ? '$' + parseFloat(t.stopLoss).toLocaleString() : 'N/A'}</strong></div>
            <div><span style="color: var(--text-muted);">Take Profit:</span> <strong style="font-family: var(--font-mono); color: #059669;">${t.takeProfit ? '$' + parseFloat(t.takeProfit).toLocaleString() : 'N/A'}</strong></div>
          </div>

          ${t.notes ? `<div class="trade-card-notes">“${t.notes}”</div>` : ''}

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10.5px; color: var(--text-muted); border-top: 1px dashed var(--card-border); padding-top: 8px;">
            <span>ID: ${t.id}</span>
            <span>${t.time}</span>
          </div>
        </div>
      `;
    }).join('');

    // Attach click listeners to all screenshot thumbnails to open fullscreen image viewer
    container.querySelectorAll('[data-img-src]').forEach(el => {
      el.addEventListener('click', () => {
        const src = el.getAttribute('data-img-src');
        const title = el.getAttribute('data-img-title');
        this.openImageViewer(src, title);
      });
    });
  }

  openImageViewer(src, title) {
    const modal = document.getElementById('imageViewerModal');
    const imgEl = document.getElementById('imageViewerSrc');
    const titleEl = document.getElementById('imageViewerTitle');
    if (modal && imgEl) {
      imgEl.src = src;
      if (titleEl) titleEl.textContent = title || 'Trade Screenshot';
      modal.classList.add('open');
    }
  }

  setupAddTradeModule() {
    const addModal = document.getElementById('addTradeModal');
    const openBtnHeader = document.getElementById('openAddTradeModalBtn');
    const openBtnJournal = document.getElementById('openAddTradeBtnJournal');
    const closeBtn = document.getElementById('closeAddTradeModalBtn');

    const openModal = () => {
      if (addModal) addModal.classList.add('open');
    };
    const closeModal = () => {
      if (addModal) addModal.classList.remove('open');
    };

    if (openBtnHeader) openBtnHeader.addEventListener('click', openModal);
    if (openBtnJournal) openBtnJournal.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Fullscreen image viewer close button
    const imgViewerModal = document.getElementById('imageViewerModal');
    const closeImgViewerBtn = document.getElementById('closeImageViewerBtn');
    if (closeImgViewerBtn && imgViewerModal) {
      closeImgViewerBtn.addEventListener('click', () => imgViewerModal.classList.remove('open'));
    }

    // Drag & Drop Screenshot handling
    const dropZone = document.getElementById('screenshotDropZone');
    const fileInput = document.getElementById('tradeScreenshotInput');
    const dropPrompt = document.getElementById('dropzonePrompt');
    const dropPreview = document.getElementById('dropzonePreview');
    const previewImg = document.getElementById('previewImgEl');
    const removeImgBtn = document.getElementById('removeImgBtn');

    if (dropZone && fileInput) {
      dropZone.addEventListener('click', (e) => {
        if (e.target.closest('#removeImgBtn')) return;
        fileInput.click();
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropZone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropZone.classList.remove('dragover');
        });
      });

      dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          this.handleScreenshotFile(files[0], previewImg, dropPrompt, dropPreview);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          this.handleScreenshotFile(e.target.files[0], previewImg, dropPrompt, dropPreview);
        }
      });

      if (removeImgBtn) {
        removeImgBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.currentUploadedScreenshot = null;
          fileInput.value = '';
          dropPrompt.style.display = 'flex';
          dropPreview.style.display = 'none';
        });
      }
    }

    // Tag Selection Buttons
    const tagBtns = document.querySelectorAll('#tagsSelectableGroup .tag-select-btn');
    tagBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tagBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedTag = btn.dataset.tag;
      });
    });

    // Handle Add Trade Form Submission
    const addTradeForm = document.getElementById('addTradeForm');
    if (addTradeForm) {
      addTradeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const pair = document.getElementById('inpTradePair').value.trim();
        const side = document.getElementById('inpTradeSide').value;
        const entry = parseFloat(document.getElementById('inpEntryPrice').value);
        const exit = parseFloat(document.getElementById('inpExitPrice').value);
        const stopLoss = parseFloat(document.getElementById('inpStopLoss').value) || null;
        const takeProfit = parseFloat(document.getElementById('inpTakeProfit').value) || null;
        const outcome = document.getElementById('inpTradeOutcome').value;
        const pnl = parseFloat(document.getElementById('inpRealizedPnl').value) || 0;
        const notes = document.getElementById('inpTradeNotes').value.trim();

        const isWon = outcome === 'WIN';
        const isBE = outcome === 'BREAK-EVEN';
        const calculatedPnl = isWon ? Math.abs(pnl) : (isBE ? 0 : -Math.abs(pnl));
        const pnlPercent = entry > 0 ? ((exit - entry) / entry) * 100 : 5.0;

        const newTrade = {
          id: `TRD-${Math.floor(Math.random() * 900 + 9100)}`,
          symbol: pair,
          side,
          type: side.includes('LONG') ? 'LONG' : 'SHORT',
          entry,
          exit,
          stopLoss,
          takeProfit,
          size: 'Standard Lot',
          pnl: calculatedPnl,
          pnlPercent: isWon ? Math.abs(pnlPercent) : -Math.abs(pnlPercent),
          duration: '45m',
          status: isWon ? 'WON' : (isBE ? 'BREAK-EVEN' : 'LOST'),
          tag: this.selectedTag || 'Scalping',
          notes: notes || 'Executed according to trading plan.',
          screenshot: this.currentUploadedScreenshot || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
          time: 'Just now'
        };

        this.recentTrades.unshift(newTrade);
        this.renderRecentTrades();
        this.renderTradesJournal();

        // Update Overall Stats
        this.tradingManager.account.totalTrades = (this.tradingManager.account.totalTrades || 1284) + 1;
        this.tradingManager.account.totalPnL = (this.tradingManager.account.totalPnL || 142850) + calculatedPnl;
        this.renderAccountState(this.tradingManager.account);

        this.tradingManager.showToast(`✅ Trade logged: ${pair} (${newTrade.status}) [${newTrade.tag}]`, 'success');
        this.tradingManager.playChime('success');

        // Reset form
        addTradeForm.reset();
        this.currentUploadedScreenshot = null;
        if (dropPrompt && dropPreview) {
          dropPrompt.style.display = 'flex';
          dropPreview.style.display = 'none';
        }

        closeModal();
      });
    }
  }

  handleScreenshotFile(file, previewImg, dropPrompt, dropPreview) {
    if (!file.type.startsWith('image/')) {
      this.tradingManager.showToast('Please upload a valid image file (PNG, JPG, WebP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentUploadedScreenshot = e.target.result;
      if (previewImg) previewImg.src = e.target.result;
      if (dropPrompt) dropPrompt.style.display = 'none';
      if (dropPreview) dropPreview.style.display = 'inline-block';
      this.tradingManager.showToast('Screenshot attached successfully!', 'info');
    };
    reader.readAsDataURL(file);
  }

  renderAccountState(account) {
    const totalTradesEl = document.getElementById('valTotalTrades');
    if (totalTradesEl) {
      totalTradesEl.innerHTML = `${(account.totalTrades || 1284).toLocaleString()} <span class="metric-unit">trades</span>`;
    }

    const winRateEl = document.getElementById('valWinRate');
    if (winRateEl) {
      winRateEl.innerHTML = `${(account.winRate || 76.4).toFixed(1)}<span class="metric-unit">%</span>`;
    }

    const drawdownEl = document.getElementById('valDrawdown');
    if (drawdownEl) {
      drawdownEl.innerHTML = `${(account.currentDrawdown || 3.2).toFixed(1)}<span class="metric-unit">%</span>`;
    }

    const pnlEl = document.getElementById('valProfitLoss');
    if (pnlEl) {
      const pnl = account.totalPnL || 142850.00;
      pnlEl.textContent = `${pnl >= 0 ? '+' : ''}$${pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      pnlEl.style.color = pnl >= 0 ? '#059669' : '#e11d48';
    }
  }

  setupEventListeners() {
    // Theme Toggle (Header & Sidebar)
    const headerThemeBtn = document.getElementById('headerThemeBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (headerThemeBtn) headerThemeBtn.addEventListener('click', () => this.toggleTheme());
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', () => this.toggleTheme());

    // Mobile Sidebar Drawer Controls
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');

    const openSidebar = () => {
      if (sidebar) sidebar.classList.add('mobile-open');
      if (sidebarBackdrop) sidebarBackdrop.classList.add('mobile-open');
    };

    const closeSidebar = () => {
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (sidebarBackdrop) sidebarBackdrop.classList.remove('mobile-open');
    };

    if (mobileMenuTrigger) mobileMenuTrigger.addEventListener('click', openSidebar);
    if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

    // Sidebar navigation tabs switching
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        if (item.getAttribute('href')) return;
        e.preventDefault();
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        closeSidebar();
        const tab = item.dataset.tab;
        this.switchView(tab);
      });
    });

    // Equity Curve Timeframe pills
    const tfBtns = document.querySelectorAll('#equityTimeframePills .tf-btn');
    tfBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tfBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const range = btn.dataset.range;
        this.updateEquityRange(range);
      });
    });

    // Recent Trades Filter pills (Overview view)
    const filterBtns = document.querySelectorAll('#tradeFilters .filter-pill');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTradeFilter = btn.dataset.filter;
        this.renderRecentTrades();
      });
    });

    // Trades Journal Tag Filters (Trades view)
    const tagFilterBtns = document.querySelectorAll('#journalFilterTags .filter-pill');
    tagFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tagFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeJournalTagFilter = btn.dataset.tag;
        this.renderTradesJournal();
      });
    });
  }

  updateEquityRange(range) {
    let sliced = [...EQUITY_CURVE_DATA];
    if (range === '7D') sliced = sliced.slice(-4);
    else if (range === '30D') sliced = sliced.slice(-12);
    else if (range === '90D') sliced = sliced;
    
    if (this.equityChart) {
      this.equityChart.setData(sliced);
    }
  }

  startLiveSimulation() {
    setInterval(() => {
      const lastPoint = this.equityData[this.equityData.length - 1];
      const delta = (Math.random() - 0.48) * 120;
      lastPoint.equity = Math.max(100000, lastPoint.equity + delta);
      if (this.equityChart) this.equityChart.render();
    }, 2500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.mission3App = new Mission3App();
});

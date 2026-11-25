// Mission 3 - Data & Initial State

export const ASSETS = {
  'BTC-USD': {
    symbol: 'BTC-USD',
    name: 'Bitcoin / USD',
    category: 'Crypto',
    price: 64820.50,
    change24h: 3.42,
    high24h: 65400.00,
    low24h: 63120.00,
    volume: '$28.4B',
    sparkline: [63100, 63400, 63200, 63800, 64200, 63900, 64500, 64820],
    precision: 2
  },
  'ETH-USD': {
    symbol: 'ETH-USD',
    name: 'Ethereum / USD',
    category: 'Crypto',
    price: 3495.20,
    change24h: 4.85,
    high24h: 3540.00,
    low24h: 3320.00,
    volume: '$14.2B',
    sparkline: [3320, 3360, 3350, 3410, 3440, 3430, 3480, 3495],
    precision: 2
  },
  'SOL-USD': {
    symbol: 'SOL-USD',
    name: 'Solana / USD',
    category: 'Crypto',
    price: 152.80,
    change24h: -1.24,
    high24h: 158.00,
    low24h: 149.50,
    volume: '$4.1B',
    sparkline: [156, 158, 154, 152, 155, 151, 150, 152.8],
    precision: 2
  },
  'NVDA': {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    category: 'Equities',
    price: 128.40,
    change24h: 2.15,
    high24h: 130.20,
    low24h: 125.80,
    volume: '$31.6B',
    sparkline: [124, 125, 126.5, 126, 127.8, 127.2, 128.4],
    precision: 2
  },
  'AAPL': {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'Equities',
    price: 224.30,
    change24h: 0.85,
    high24h: 225.80,
    low24h: 222.10,
    volume: '$18.9B',
    sparkline: [221, 222, 223.1, 222.8, 223.9, 224.3],
    precision: 2
  }
};

export const INITIAL_ACCOUNT = {
  name: 'Alex Williamson',
  handle: '#trader-1974',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  totalTrades: 1284,
  winRate: 76.4,
  currentDrawdown: 3.2,
  maxDrawdown: 6.8,
  totalPnL: 142850.00,
  pnlChangePercent: 24.6,
  profitFactor: 2.42,
  avgWin: 1420.00,
  avgLoss: 480.00,
  winStreak: 8,
  availableMargin: 428310.00,
  usedMargin: 189260.00,
  netLiquidity: 967570.00
};

export const EQUITY_CURVE_DATA = [
  { date: 'Aug 24', equity: 100000, benchmark: 100000 },
  { date: 'Aug 27', equity: 104500, benchmark: 101200 },
  { date: 'Aug 30', equity: 103200, benchmark: 100800 },
  { date: 'Sep 02', equity: 108900, benchmark: 102400 },
  { date: 'Sep 05', equity: 114200, benchmark: 103100 },
  { date: 'Sep 08', equity: 112800, benchmark: 102900 },
  { date: 'Sep 11', equity: 119500, benchmark: 104500 },
  { date: 'Sep 14', equity: 125300, benchmark: 105800 },
  { date: 'Sep 17', equity: 122400, benchmark: 104900 },
  { date: 'Sep 20', equity: 134800, benchmark: 107200 },
  { date: 'Sep 22', equity: 139200, benchmark: 108100 },
  { date: 'Sep 23', equity: 142850, benchmark: 109400 }
];

export const WIN_LOSS_PERFORMANCE = [
  { period: 'Apr', wins: 84, losses: 26, winRate: 76.3, pnl: 22400 },
  { period: 'May', wins: 98, losses: 29, winRate: 77.1, pnl: 28900 },
  { period: 'Jun', wins: 76, losses: 28, winRate: 73.0, pnl: 18500 },
  { period: 'Jul', wins: 112, losses: 31, winRate: 78.3, pnl: 34200 },
  { period: 'Aug', wins: 105, losses: 32, winRate: 76.6, pnl: 31800 },
  { period: 'Sep', wins: 94, losses: 24, winRate: 79.6, pnl: 36450 }
];

export const RECENT_TRADES = [
  {
    id: 'TRD-9042',
    symbol: 'BTC-USD',
    side: 'BUY / LONG',
    type: 'LONG',
    entry: 63400.00,
    exit: 64820.50,
    stopLoss: 62800.00,
    takeProfit: 65200.00,
    size: '2.5 BTC',
    pnl: 3551.25,
    pnlPercent: 11.20,
    duration: '4h 12m',
    status: 'WON',
    tag: 'Breakout',
    notes: 'Clean 4H bull flag breakout with massive delta volume inflow. Scaled out 50% at TP1.',
    screenshot: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
    time: 'Today, 01:45'
  },
  {
    id: 'TRD-9041',
    symbol: 'ETH-USD',
    side: 'BUY / LONG',
    type: 'LONG',
    entry: 3380.00,
    exit: 3495.20,
    stopLoss: 3310.00,
    takeProfit: 3520.00,
    size: '20.0 ETH',
    pnl: 2304.00,
    pnlPercent: 17.04,
    duration: '6h 30m',
    status: 'WON',
    tag: 'Swing',
    notes: 'Key daily demand block retest with bullish RSI divergence on 1H timeframe.',
    screenshot: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=600&q=80',
    time: 'Today, 00:15'
  },
  {
    id: 'TRD-9040',
    symbol: 'SOL-USD',
    side: 'SELL / SHORT',
    type: 'SHORT',
    entry: 156.40,
    exit: 152.80,
    stopLoss: 158.50,
    takeProfit: 151.00,
    size: '150 SOL',
    pnl: 540.00,
    pnlPercent: 11.51,
    duration: '1h 45m',
    status: 'WON',
    tag: 'Scalping',
    notes: 'Quick scalp rejection at local resistance high with high CVD absorption.',
    screenshot: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=600&q=80',
    time: 'Yesterday, 22:30'
  },
  {
    id: 'TRD-9039',
    symbol: 'NVDA',
    side: 'BUY / LONG',
    type: 'LONG',
    entry: 129.50,
    exit: 128.40,
    stopLoss: 128.00,
    takeProfit: 133.00,
    size: '200 Shares',
    pnl: -220.00,
    pnlPercent: -4.24,
    duration: '2h 10m',
    status: 'LOST',
    tag: 'News Trade',
    notes: 'Earnings momentum fakeout. Hit stop loss quickly as market digested guidance.',
    screenshot: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80',
    time: 'Yesterday, 18:00'
  },
  {
    id: 'TRD-9038',
    symbol: 'EUR/USD',
    side: 'BUY / LONG',
    type: 'LONG',
    entry: 1.0840,
    exit: 1.0895,
    stopLoss: 1.0810,
    takeProfit: 1.0920,
    size: '10 Lots',
    pnl: 550.00,
    pnlPercent: 8.25,
    duration: '12h 40m',
    status: 'WON',
    tag: 'Swing',
    notes: 'ECB rate decision post-announcement continuation pattern.',
    screenshot: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
    time: 'Sep 21, 14:10'
  }
];

export const DEFAULT_ADMIN_CONFIG = {
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

export const PRESET_THEMES = {
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


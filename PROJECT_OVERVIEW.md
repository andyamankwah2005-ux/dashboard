# Mission 3 — Project Overview & Developer Intent

## What the Developer Was Trying to Build

**Mission 3** is a **trading performance dashboard, trade journal, and live frontend customization studio** designed with a modern SaaS aesthetic. The application is split into two connected experiences:

1. **Trader Dashboard & Journal (`/`)** — A client-side trading analytics and trade-logging interface for tracking portfolio performance, reviewing equity growth, inspecting win/loss distributions, and journaling individual trades with screenshots, risk parameters, strategy tags, and reflection notes.
2. **Admin Studio & Frontend Customizer (`/admin`)** — A no-code theme, layout, and data-management studio that lets the user customize the dashboard's visual appearance, toggle UI modules and navigation items, manage strategy tags and trading pairs, edit baseline portfolio metrics, and export/import configurations as JSON.

---

## Core Architecture & Features

### 1. Shared State & Persistence (`src/context/AppContext.jsx`)
The app runs entirely in the browser using React Context (`AppProvider`) backed by `localStorage` so customizations and logged trades persist across page reloads:
- `mission3_theme` — Stores `'light'` or `'dark'` mode and sets `data-theme` on `document.documentElement`.
- `mission3_admin_config` — Stores the Admin Studio configuration (colors, typography, card geometry, widget visibility, strategy tags, trading pairs, and branding/metrics) and applies them live as CSS custom properties (`--brand-emerald`, `--sidebar-bg`, `--canvas-bg`, `--card-bg`, `--text-main`, `--color-green`, `--font-main`, `--font-mono`, `--radius-md`, `--shadow-card`, `--card-border`).
- `mission3_trades_data` — Stores the list of logged trades.
- `mission3_tags` — Stores the active strategy tags.

A simulated live feed runs every 2.5 seconds in `AppContext.jsx`, applying small random fluctuations to the latest equity curve data point.

---

### 2. Trader Dashboard (`src/pages/DashboardPage.jsx`)
The main dashboard uses a persistent dark sidebar (`Sidebar.jsx`) and top header (`Header.jsx`) with five navigation views:

- **Dashboard (Overview)**:
  - **4 KPI Summary Cards (`SummaryCards.jsx`)**: Displays *Total Trades*, *Win Rate (%)*, *Current Drawdown (%)*, and *Total Realized Profit / Loss* with decorative CSS sparkline bars.
  - **Equity Curve Chart (`EquityCurveChart.jsx`)**: Custom HTML5 `<canvas>` area/line chart comparing *Account Equity* against a dashed *Benchmark* line, with timeframe filter pills (`7D`, `30D`, `90D`, `1Y`, `ALL`) and an interactive hover crosshair tooltip.
  - **Win / Loss Performance Chart (`WinLossChart.jsx`)**: Custom HTML5 `<canvas>` grouped bar chart showing monthly *Winning Trades* vs. *Losing Trades*, Profit Factor (`2.42`), Win Streak (`8`), and hover tooltips.
  - **Recent Trades Preview (`RecentTradesTable.jsx`)**: Filterable execution table (`All`, `Wins Only`, `Losses Only`, `Crypto`, `Equities`) showing trade ID, asset, side (`BUY / LONG` or `SELL / SHORT`), entry/exit prices, position size, P&L, duration, timestamp, and status.
- **Trades Journal (`TradesJournalView.jsx`)**:
  - Summary header showing *Logged Trades*, calculated *Journal Win Rate*, and *Avg R:R Ratio*.
  - Strategy tag filter pills (dynamically sourced from `adminConfig.tags`).
  - Card grid displaying each trade's chart screenshot thumbnail (clickable to open `ImageViewerModal.jsx`), side, status badge, P&L, strategy tag, Entry/Exit/Stop Loss/Take Profit grid, and reflection notes.
- **Add Trade Modal (`AddTradeModal.jsx`)**:
  - Drag-and-drop (or file browse) image uploader using `FileReader` to preview and attach chart screenshots.
  - Form inputs for trading pair (with `<datalist>` autocomplete from `adminConfig.tradingPairs`), side, entry/exit prices, stop loss, take profit, outcome (`WIN`, `LOSS`, `BREAK-EVEN`), realized P&L, selectable strategy tag buttons, and reflection notes.
  - Plays a Web Audio chime (`src/utils/audio.js`) and triggers a toast notification (`ToastContainer.jsx`) upon saving.
- **Analytics, Calendar & Settings (`PlaceholderViews.jsx`)**:
  - Stub/placeholder views for *Analytics & Risk Engine*, *Trading & Economic Calendar*, and *Account Settings* (linking back to Overview or Admin Studio).

---

### 3. Admin Studio & Frontend Customizer (`src/pages/AdminPage.jsx`)
The `/admin` route provides a two-column studio with controls on the left and a live interactive preview panel on the right:

- **Colors & Themes**: 6 curated presets (*Emerald Studio*, *Cyber Teal*, *Royal Indigo*, *Sunset Gold*, *Ruby Matrix*, *Dark Obsidian*) plus 6 dual-bound color pickers (color input + hex text input).
- **Typography & Styles**: Controls for primary font family, tabular/monospace font, base font size (`12px–18px`), header letter spacing, card border radius (`0px–36px`), shadow style (`soft`, `elevated`, `flat`, `glow`), border style, and padding density.
- **Navigation & Widgets**: Toggle switches to show/hide sidebar navigation items (*Trades*, *Analytics*, *Calendar*, *Settings*) and dashboard modules (*4 Summary KPI Cards*, *Equity Curve*, *Win/Loss Chart*, *Recent Trades Table*, *Add Trade Module*).
- **Trades & Tag Manager**: Add or remove strategy tags, edit the comma-separated default trading pairs list, and inspect/delete records in the logged trades table (plus *Reload Mock Trades* and *Clear All* actions).
- **Branding & Metrics**: Edit app name, badge label, dashboard title, trader name/handle, and baseline KPI numbers (*Total Trades*, *Win Rate*, *Drawdown*, *Total Realized P&L*).
- **Live Preview & JSON Portability**: Switchable preview modes (*Overview*, *Journal*, *+ Add Trade*) alongside *Save & Apply*, *Reset Defaults*, *Export JSON*, and *Import JSON*.

---

## Summary
Overall, the developer was building a **self-contained, customizable trading journal and analytics SaaS prototype**—combining mock market/trade data (`src/data/mockData.js`), custom HTML5 canvas charting, interactive trade logging with image attachments, and a white-label-style Admin Studio for real-time theming and layout control without requiring a backend server.


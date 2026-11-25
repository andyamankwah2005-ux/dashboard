import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  LineCompanionLeft,
  LineCompanionRight,
  DeskConnectedIllustration
} from '../components/landing/LineCompanions';
import HeroProductStage from '../components/landing/HeroProductStage';

const WORD_TOKENS = [
  { word: 'track', bg: '#eadbfa', dot: '#9333ea' },
  { word: 'journal', bg: '#ddfcfa', dot: '#03c1ba' },
  { word: 'refine', bg: '#ffe9d3', dot: '#ff6522' }
];

const USE_CASES = [
  {
    title: 'Scalping setups',
    desc: '1m–5m entries & tight stops',
    tag: 'Intraday',
    color: '#f64932',
    tint: 'rgba(246, 73, 50, 0.1)',
    view: '/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    )
  },
  {
    title: 'Swing journals',
    desc: 'Chart captures & thesis notes',
    tag: 'Journal',
    color: '#097fe8',
    tint: 'rgba(9, 127, 232, 0.1)',
    view: '/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    )
  },
  {
    title: 'Equity curves',
    desc: 'Alpha vs. benchmark tracking',
    tag: 'Telemetry',
    color: '#e89d01',
    tint: 'rgba(255, 177, 16, 0.14)',
    view: '/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    )
  },
  {
    title: 'Theme studio',
    desc: 'Live colors, fonts & widgets',
    tag: 'Customize',
    color: '#03c1ba',
    tint: 'rgba(3, 193, 186, 0.12)',
    view: '/admin',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" />
        <circle cx="17.5" cy="10.5" r=".5" />
        <circle cx="8.5" cy="7.5" r=".5" />
        <circle cx="6.5" cy="12.5" r=".5" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    )
  },
  {
    title: 'JSON exports',
    desc: 'Portable workspace backups',
    tag: 'Local-first',
    color: '#7c3aed',
    tint: 'rgba(124, 58, 237, 0.1)',
    view: '/admin',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    )
  }
];

const PORTRAIT_PROOFS = [
  {
    brand: 'Northstar Quant',
    quote: '“Having our equity curve and trade screenshots in one quiet workspace changed how we review every losing week.”',
    author: 'Elena Vance, Lead Quantitative Trader',
    img: '/images/portrait-1.jpg',
    screen: '#f64932',
    multiply: '#e32d14'
  },
  {
    brand: 'Meridian Desk',
    quote: '“We stripped away five noisy spreadsheets. Now every setup, stop loss, and reflection note lives right beside the numbers.”',
    author: 'Marcus Chen, Portfolio Manager',
    img: '/images/portrait-2.jpg',
    screen: '#097fe8',
    multiply: '#005bab'
  },
  {
    brand: 'Kestrel Options',
    quote: '“Admin Studio let us tailor the entire interface to our desk’s workflow in minutes without touching a single line of CSS.”',
    author: 'Sora Takahashi, Options Strategist',
    img: '/images/portrait-3.jpg',
    screen: '#ffb110',
    multiply: '#e89d01'
  }
];

export default function LandingPage() {
  const { navigate, adminConfig } = useApp();
  const [tokenIdx, setTokenIdx] = useState(0);
  const appName = adminConfig.branding?.appName || 'Mission 3';

  useEffect(() => {
    const timer = setInterval(() => {
      setTokenIdx((prev) => (prev + 1) % WORD_TOKENS.length);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  const currentToken = WORD_TOKENS[tokenIdx];

  return (
    <div className="wink-landing">
      {/* GLOBAL NAVIGATION */}
      <header className="wink-nav">
        <a
          href="/"
          className="wink-nav-brand"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span className="wink-brand-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </span>
          <span>{appName}</span>
        </a>

        <nav className="wink-nav-center" aria-label="Primary">
          <a href="#features" className="wink-nav-link">
            Product
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
          <a href="#proof" className="wink-nav-link">
            Customers
          </a>
          <a
            href="/dashboard"
            className="wink-nav-link"
            onClick={(e) => {
              e.preventDefault();
              navigate('/dashboard');
            }}
          >
            Dashboard
          </a>
          <a
            href="/admin"
            className="wink-nav-link"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin');
            }}
          >
            Admin Studio
          </a>
        </nav>

        <div className="wink-nav-right">
          <a
            href="/admin"
            className="wink-nav-link"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin');
            }}
          >
            Customize
          </a>
          <a
            href="/dashboard"
            className="wink-btn-primary nav-compact"
            onClick={(e) => {
              e.preventDefault();
              navigate('/dashboard');
            }}
          >
            Get {appName} free
          </a>
        </div>
      </header>

      {/* FIRST SCREEN: PLAYFUL PROMISE ABOVE A WORKING PRODUCT */}
      <section className="wink-hero">
        <h1 className="wink-display">
          Trade with clarity.
          <br />
          Everything you{' '}
          <span
            className="wink-word-token"
            style={{ backgroundColor: currentToken.bg }}
          >
            <span
              className="wink-token-dot"
              style={{ backgroundColor: currentToken.dot }}
            />
            {currentToken.word}
          </span>{' '}
          in one place.
        </h1>

        <p className="wink-deck">
          Capture every execution, inspect your equity curve, and customize your trading
          workspace without the clutter.
        </p>

        <div className="wink-hero-actions">
          <a
            href="/dashboard"
            className="wink-btn-primary"
            onClick={(e) => {
              e.preventDefault();
              navigate('/dashboard');
            }}
          >
            Get {appName} free
          </a>
          <a
            href="/admin"
            className="wink-btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin');
            }}
          >
            Open Admin Studio
          </a>
        </div>

        {/* 960px INTERFACE STAGE WITH PEEKING LINE-DRAWN COMPANIONS */}
        <div className="wink-stage-wrap">
          <LineCompanionLeft />
          <LineCompanionRight />
          <HeroProductStage />
        </div>

        <div className="wink-trust-strip" aria-label="Desk capabilities">
          <span className="wink-trust-item">1,284+ logged executions</span>
          <span className="wink-trust-item">2.42 Profit Factor</span>
          <span className="wink-trust-item">Local-first JSON portability</span>
          <span className="wink-trust-item">Light &amp; Dark studio modes</span>
        </div>
      </section>

      {/* OUTCOME BENTO CHAPTER */}
      <section className="wink-chapter" id="features">
        <h2 className="wink-heading-lg">
          Built for how real traders review,
          <br />
          measure, and refine.
        </h2>

        <div className="wink-bento-grid">
          {/* Card 1 */}
          <div className="wink-bento-card has-bg-img">
            <img
              src="/images/trade-chart-1.jpg"
              alt=""
              className="wink-bento-bg-img"
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
            <div className="wink-bento-bg-wash" />
            <div className="wink-bento-head">
              <div>
                <div className="wink-eyebrow">Equity &amp; drawdown telemetry</div>
                <h3 className="wink-card-title">
                  See portfolio growth against your benchmark at a glance
                </h3>
              </div>
              <button
                type="button"
                className="wink-circle-arrow"
                aria-label="Open Dashboard"
                onClick={() => navigate('/dashboard')}
              >
                →
              </button>
            </div>
            <div className="wink-bento-collage">
              <div className="wink-sheet-fragment">
                <div className="wink-mini-row">
                  <strong>Account Equity</strong>
                  <span style={{ color: '#059669', fontWeight: 700 }}>+$142,850.00</span>
                </div>
                <div className="wink-mini-row">
                  <span>Benchmark comparison</span>
                  <span className="wink-mini-pill" style={{ background: '#e6f3fe', color: '#005bab' }}>
                    +30.5% alpha
                  </span>
                </div>
                <div className="wink-mini-row">
                  <span>Current drawdown</span>
                  <span>3.2% (Max 6.8%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="wink-bento-card has-bg-img">
            <img
              src="/images/trade-chart-2.jpg"
              alt=""
              className="wink-bento-bg-img"
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
            <div className="wink-bento-bg-wash" />
            <div className="wink-bento-head">
              <div>
                <div className="wink-eyebrow">Screenshot trade journal</div>
                <h3 className="wink-card-title">
                  Log charts, stop loss, take profit, and honest notes
                </h3>
              </div>
              <button
                type="button"
                className="wink-circle-arrow"
                aria-label="Open Trade Journal"
                onClick={() => navigate('/dashboard')}
              >
                →
              </button>
            </div>
            <div className="wink-bento-collage">
              <div className="wink-sheet-fragment">
                <div className="wink-mini-row">
                  <strong>BTC-USD · BUY / LONG</strong>
                  <span className="wink-mini-pill" style={{ background: '#ecfdf5', color: '#059669' }}>
                    WON +$3,551.25
                  </span>
                </div>
                <div className="wink-mini-row">
                  <span>Entry $63,400 · Exit $64,820</span>
                  <span className="wink-mini-pill" style={{ background: '#eadbfa', color: '#0d0d0d' }}>
                    Breakout
                  </span>
                </div>
                <div className="wink-mini-row">
                  <span style={{ color: '#757575' }}>“Clean 4H bull flag breakout with delta inflow.”</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width horizontal demonstration */}
          <div className="wink-bento-card full-span has-bg-img">
            <img
              src="/images/hero-3d-terminal.jpg"
              alt=""
              className="wink-bento-bg-img"
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
            <div className="wink-bento-bg-wash" />
            <div className="wink-bento-head" style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="wink-eyebrow">Live Admin Studio</div>
                <h3 className="wink-card-title" style={{ maxWidth: '340px' }}>
                  Tune colors, typography, tags, and visible widgets in real time
                </h3>
                <p style={{ fontSize: '14px', color: '#757575', lineHeight: '20px', marginTop: '10px', maxWidth: '360px' }}>
                  Switch between six curated palettes, adjust card corner radius, toggle
                  dashboard modules, and export your entire setup as JSON.
                </p>
              </div>
              <button
                type="button"
                className="wink-circle-arrow"
                aria-label="Open Admin Studio"
                onClick={() => navigate('/admin')}
              >
                →
              </button>
            </div>

            <div className="wink-bento-collage">
              <div className="wink-sheet-fragment">
                <div className="wink-mini-row">
                  <strong>Active Theme Preset</strong>
                  <span className="wink-mini-pill" style={{ background: '#e6f3fe', color: '#005bab' }}>
                    Live Preview Sync
                  </span>
                </div>
                <div className="wink-mini-row">
                  <span>Strategy Tags</span>
                  <span>Scalping · Swing · Breakout · Reversal</span>
                </div>
                <div className="wink-mini-row">
                  <span>Trading Pairs</span>
                  <span>BTC/USDT, ETH/USD, NVDA, EUR/USD</span>
                </div>
                <div className="wink-mini-row">
                  <span>Configuration</span>
                  <span style={{ color: '#0075de', fontWeight: 600 }}>Export / Import JSON</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5-COLUMN COMPACT USE-CASE TILES */}
        <div className="wink-usecases-label">Jump straight into a workflow</div>
        <div className="wink-usecases-grid">
          {USE_CASES.map((item) => (
            <a
              key={item.title}
              href={item.view}
              className="wink-usecase-tile"
              style={{ '--tile-accent': item.color, '--tile-tint': item.tint }}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.view);
              }}
            >
              <div className="wink-usecase-top">
                <span
                  className="wink-usecase-icon"
                  style={{ backgroundColor: item.tint, color: item.color }}
                >
                  {item.icon}
                </span>
                <span className="wink-usecase-tag">{item.tag}</span>
              </div>
              <div>
                <div className="wink-usecase-title">
                  <span>{item.title}</span>
                  <span className="wink-usecase-arrow">→</span>
                </div>
                <div className="wink-usecase-desc">{item.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* PORTRAIT PROOF & QUIET STATISTICS */}
      <section className="wink-chapter" id="proof" style={{ paddingTop: '24px' }}>
        <h2 className="wink-heading-lg">
          Trusted by disciplined desks
          <br />
          and solo traders.
        </h2>

        <div className="wink-proof-grid">
          {PORTRAIT_PROOFS.map((p) => (
            <div className="wink-portrait-card" key={p.brand}>
              <img
                src={p.img}
                alt={p.author}
                className="wink-portrait-img"
                loading="lazy"
                decoding="async"
              />
              <div
                className="wink-portrait-screen"
                style={{ backgroundColor: p.screen }}
              />
              <div
                className="wink-portrait-multiply"
                style={{ backgroundColor: p.multiply }}
              />
              <div className="wink-portrait-legibility" />

              <div className="wink-portrait-content">
                <div className="wink-portrait-brand">{p.brand}</div>
                <div>
                  <p className="wink-portrait-quote">{p.quote}</p>
                  <div className="wink-portrait-author">{p.author}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="wink-stats-strip">
          <div className="wink-stat-inline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>
              <strong>76.4%</strong> sample desk win rate tracked across 1,284 trades
            </span>
          </div>
          <div className="wink-stat-inline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>
              <strong>2.42</strong> profit factor with real-time drawdown monitoring
            </span>
          </div>
          <div className="wink-stat-inline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>
              <strong>100%</strong> browser-local state with one-click JSON export
            </span>
          </div>
        </div>
      </section>

      {/* NEAR-FOOTER DESIGN FEATURE: CONNECTED WORKSPACE */}
      <section className="wink-chapter wink-connected-section">
        <div className="wink-connected-split">
          <div>
            <div className="wink-eyebrow" style={{ color: 'var(--color-text)' }}>
              {appName} for Trading Desks
            </div>
            <h2 className="wink-connected-heading">
              Signals, execution,
              <br />
              and journal.
              <br />
              Connected.
            </h2>
            <p className="wink-connected-sub">
              One structured workspace where solo traders and desks track equity,
              review risk, and refine setups together.
            </p>
            <a
              href="/dashboard"
              className="wink-btn-primary"
              onClick={(e) => {
                e.preventDefault();
                navigate('/dashboard');
              }}
            >
              Launch Dashboard
            </a>
          </div>

          <div className="wink-connected-art-wrap">
            <DeskConnectedIllustration />
          </div>
        </div>

        <div className="wink-connected-cards">
          <div
            className="wink-connected-card is-outlined"
            onClick={() => navigate('/dashboard')}
          >
            <h3>Trade journal</h3>
            <p>One home for every setup, screenshot, and reflection note.</p>
          </div>
          <div className="wink-connected-card" onClick={() => navigate('/dashboard')}>
            <h3>Risk &amp; alpha</h3>
            <p>Instantly surface Sharpe ratio, expectancy, and R-multiples.</p>
          </div>
          <div className="wink-connected-card" onClick={() => navigate('/dashboard')}>
            <h3>Economic calendar</h3>
            <p>Track CPI, FOMC, and daily P&amp;L in one clean calendar.</p>
          </div>
          <div className="wink-connected-card" onClick={() => navigate('/admin')}>
            <h3>Admin Studio</h3>
            <p>Customize colors, tags, and widgets without touching code.</p>
          </div>
        </div>
      </section>

      {/* QUIET CLOSING INVITATION (630px WARM GRAY) */}
      <section className="wink-closing-band">
        <h2 className="wink-closing-heading">
          Start journaling with a clearer edge today.
        </h2>
        <div className="wink-closing-actions">
          <a
            href="/dashboard"
            className="wink-btn-primary"
            onClick={(e) => {
              e.preventDefault();
              navigate('/dashboard');
            }}
          >
            Get {appName} free
          </a>
          <a
            href="/admin"
            className="wink-btn-secondary on-warm"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin');
            }}
          >
            Customize Studio
          </a>
        </div>
      </section>

      {/* PRACTICAL EDITORIAL FOOTER */}
      <footer className="wink-footer">
        <div className="wink-footer-top">
          <div>
            <a
              href="/"
              className="wink-nav-brand"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="wink-brand-mark">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </span>
              <span>{appName}</span>
            </a>
            <p className="wink-footer-thought">
              Calm software for busy markets. Keep your numbers honest and your notes close.
            </p>
          </div>

          <div className="wink-footer-cols">
            <div>
              <div className="wink-footer-col-label">Product</div>
              <ul className="wink-footer-list">
                <li>
                  <a
                    href="/dashboard"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/dashboard');
                    }}
                  >
                    Trading Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/dashboard');
                    }}
                  >
                    Trade Journal
                  </a>
                </li>
                <li>
                  <a
                    href="/admin"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/admin');
                    }}
                  >
                    Admin Studio
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="wink-footer-col-label">Capabilities</div>
              <ul className="wink-footer-list">
                <li><a href="#features">Equity Curve</a></li>
                <li><a href="#features">Win/Loss Telemetry</a></li>
                <li><a href="#features">Screenshot Uploader</a></li>
              </ul>
            </div>

            <div>
              <div className="wink-footer-col-label">Customization</div>
              <ul className="wink-footer-list">
                <li>
                  <a
                    href="/admin"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/admin');
                    }}
                  >
                    Color Themes
                  </a>
                </li>
                <li>
                  <a
                    href="/admin"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/admin');
                    }}
                  >
                    Strategy Tags
                  </a>
                </li>
                <li>
                  <a
                    href="/admin"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/admin');
                    }}
                  >
                    JSON Export
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="wink-footer-col-label">Resources</div>
              <ul className="wink-footer-list">
                <li><a href="#proof">Trader Stories</a></li>
                <li><a href="#features">Workflows</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="wink-footer-bottom">
          <span>© 2026 {appName}. Built for disciplined trading workflows.</span>
          <span className="wink-locale-pill">English (US)</span>
        </div>
      </footer>
    </div>
  );
}

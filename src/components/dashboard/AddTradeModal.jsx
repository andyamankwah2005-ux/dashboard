import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export default function AddTradeModal({ isOpen, onClose, initialDateISO }) {
  const { adminConfig, addTrade, addToast } = useApp();
  const tags = adminConfig.tags || ['Scalping', 'Swing', 'News Trade', 'Breakout', 'Reversal', 'Day Trade'];
  const pairsList = (adminConfig.tradingPairs || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [pair, setPair] = useState('BTC/USDT');
  const [side, setSide] = useState('BUY / LONG');
  const [entryPrice, setEntryPrice] = useState('64200.00');
  const [exitPrice, setExitPrice] = useState('65100.00');
  const [stopLoss, setStopLoss] = useState('63800.00');
  const [takeProfit, setTakeProfit] = useState('65400.00');
  const [outcome, setOutcome] = useState('WIN');
  const [realizedPnl, setRealizedPnl] = useState('900.00');
  const [selectedTag, setSelectedTag] = useState(tags[0] || 'Scalping');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      addToast('Please upload a valid image file (PNG, JPG, WebP)', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshot(e.target.result);
      addToast('Screenshot attached successfully!', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const sl = parseFloat(stopLoss) || null;
    const tp = parseFloat(takeProfit) || null;
    const pnlVal = parseFloat(realizedPnl) || 0;

    const isWon = outcome === 'WIN';
    const isBE = outcome === 'BREAK-EVEN';
    const calculatedPnl = isWon ? Math.abs(pnlVal) : isBE ? 0 : -Math.abs(pnlVal);
    const pnlPercent = entry > 0 ? ((exit - entry) / entry) * 100 : 5.0;

    const todayISO = new Date().toISOString().slice(0, 10);
    const chosenDate = initialDateISO || todayISO;

    const newTrade = {
      id: `TRD-${Math.floor(Math.random() * 900 + 9100)}`,
      symbol: pair.trim(),
      side,
      type: side.includes('LONG') ? 'LONG' : 'SHORT',
      entry,
      exit,
      stopLoss: sl,
      takeProfit: tp,
      size: 'Standard Lot',
      pnl: calculatedPnl,
      pnlPercent: isWon ? Math.abs(pnlPercent) : -Math.abs(pnlPercent),
      duration: '45m',
      status: isWon ? 'WON' : isBE ? 'BREAK-EVEN' : 'LOST',
      tag: selectedTag || 'Scalping',
      notes: notes.trim() || 'Executed according to trading plan.',
      screenshot:
        screenshot || '/images/trade-chart-1.jpg',
      time: initialDateISO && initialDateISO !== todayISO ? initialDateISO : 'Just now',
      dateISO: chosenDate
    };

    addTrade(newTrade);
    setScreenshot(null);
    setNotes('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  return (
    <div className="modal-overlay open" id="addTradeModal" onClick={onClose}>
      <div
        className="modal-card modal-card-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h3 className="modal-title">+ Add Trade to Journal</h3>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Log a complete trade with screenshot, metrics, stop loss, take profit, and thesis notes.
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            id="closeAddTradeModalBtn"
            onClick={onClose}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form id="addTradeForm" onSubmit={handleSubmit}>
          {/* 1. DRAG & DROP SCREENSHOT UPLOAD */}
          <div className="form-group">
            <label className="form-label">Trade Screenshot / Chart Image</label>
            <div
              className={`drag-drop-zone${isDragOver ? ' dragover' : ''}`}
              id="screenshotDropZone"
              onClick={(e) => {
                if (e.target.closest('#removeImgBtn')) return;
                fileInputRef.current?.click();
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragOver(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files?.length > 0) {
                  handleFile(e.dataTransfer.files[0]);
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="tradeScreenshotInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files?.length > 0) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />

              {!screenshot ? (
                <div className="dropzone-content" id="dropzonePrompt">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: 'var(--brand-emerald)' }}
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      marginTop: '6px'
                    }}
                  >
                    Drag &amp; drop trade screenshot here, or{' '}
                    <span style={{ color: 'var(--brand-emerald)', cursor: 'pointer' }}>browse</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Supports PNG, JPG, WebP up to 10MB
                  </span>
                </div>
              ) : (
                <div className="dropzone-preview" id="dropzonePreview" style={{ display: 'inline-block' }}>
                  <img
                    src={screenshot}
                    alt="Trade Preview"
                    id="previewImgEl"
                    className="preview-uploaded-img"
                  />
                  <button
                    type="button"
                    className="btn-remove-img"
                    id="removeImgBtn"
                    title="Remove image"
                    onClick={(e) => {
                      e.stopPropagation();
                      setScreenshot(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="trade-modal-divider">
            <span>OR MANUALLY INPUT DETAILS</span>
          </div>

          {/* 2. MANUAL INPUT FIELDS */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Trading Pair</label>
              <div className="form-input-wrap">
                <input
                  type="text"
                  className="form-input"
                  id="inpTradePair"
                  list="tradingPairsDatalist"
                  placeholder="e.g., EUR/USD, BTC/USDT"
                  value={pair}
                  onChange={(e) => setPair(e.target.value)}
                  required
                />
                <datalist id="tradingPairsDatalist">
                  {pairsList.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Side / Direction</label>
              <div className="form-input-wrap">
                <select
                  className="form-input"
                  id="inpTradeSide"
                  value={side}
                  onChange={(e) => setSide(e.target.value)}
                >
                  <option value="BUY / LONG">BUY / LONG</option>
                  <option value="SELL / SHORT">SELL / SHORT</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Entry Price ($)</label>
              <div className="form-input-wrap">
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  id="inpEntryPrice"
                  placeholder="0.00"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Exit Price ($)</label>
              <div className="form-input-wrap">
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  id="inpExitPrice"
                  placeholder="0.00"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Stop Loss ($)</label>
              <div className="form-input-wrap">
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  id="inpStopLoss"
                  placeholder="Optional SL"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Take Profit ($)</label>
              <div className="form-input-wrap">
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  id="inpTakeProfit"
                  placeholder="Optional TP"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Trade Outcome</label>
              <div className="form-input-wrap">
                <select
                  className="form-input"
                  id="inpTradeOutcome"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                >
                  <option value="WIN">Win (Profit)</option>
                  <option value="LOSS">Loss</option>
                  <option value="BREAK-EVEN">Break-even</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Position Size &amp; Realized P&amp;L ($)</label>
              <div className="form-input-wrap">
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  id="inpRealizedPnl"
                  placeholder="P&L ($)"
                  value={realizedPnl}
                  onChange={(e) => setRealizedPnl(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* 3. TAG TRADES */}
          <div className="form-group">
            <label className="form-label">Tag Trade</label>
            <div className="tags-selectable-group" id="tagsSelectableGroup">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-select-btn${selectedTag === tag ? ' active' : ''}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 4. COMMENTS / NOTES */}
          <div className="form-group">
            <label className="form-label">Trade Notes &amp; Reflection (Optional)</label>
            <textarea
              className="form-textarea"
              id="inpTradeNotes"
              rows="3"
              placeholder="Enter trade thesis, catalyst, execution discipline, emotions, key lessons..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-submit-order" id="btnSaveTrade">
            Save Trade to Journal
          </button>
        </form>
      </div>
    </div>
  );
}


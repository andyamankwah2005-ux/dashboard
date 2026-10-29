// Mission 3 - Trading Simulator & Order Terminal Engine

export class TradingManager {
  constructor(accountData, onUpdate) {
    this.account = JSON.parse(JSON.stringify(accountData));
    this.onUpdate = onUpdate;
    this.audioCtx = null;
    this.initAudio();
  }

  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    } catch (e) {
      console.warn('Audio not supported');
    }
  }

  playChime(type = 'success') {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(329.63, this.audioCtx.currentTime); // E4
      osc.frequency.exponentialRampToValueAtTime(220, this.audioCtx.currentTime + 0.2); // A3
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    }
  }

  placeOrder({ symbol, type, price, amount, leverage }) {
    const marginRequired = (price * amount) / leverage;

    if (marginRequired > this.account.availableMargin) {
      this.showToast('Insufficient margin available for this order!', 'error');
      this.playChime('error');
      return false;
    }

    const newPosition = {
      id: `pos-${Date.now()}`,
      symbol,
      type, // 'LONG' or 'SHORT'
      entryPrice: price,
      currentPrice: price,
      size: parseFloat(amount),
      margin: marginRequired,
      leverage: parseInt(leverage),
      pnl: 0,
      pnlPercent: 0,
      openTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.account.positions.unshift(newPosition);
    this.account.availableMargin -= marginRequired;
    this.account.usedMargin += marginRequired;

    this.showToast(`Order executed: ${type} ${amount} ${symbol} @ $${price.toLocaleString()}`, 'success');
    this.playChime('success');

    if (this.onUpdate) this.onUpdate(this.account);
    return true;
  }

  closePosition(posId) {
    const idx = this.account.positions.findIndex(p => p.id === posId);
    if (idx === -1) return;

    const pos = this.account.positions[idx];
    this.account.netLiquidity += pos.pnl;
    this.account.availableMargin += pos.margin + pos.pnl;
    this.account.usedMargin -= pos.margin;
    this.account.realizedPnL24h += pos.pnl;

    this.account.positions.splice(idx, 1);
    this.showToast(`Position closed: ${pos.symbol} (P&L: ${pos.pnl >= 0 ? '+' : ''}$${pos.pnl.toFixed(2)})`, pos.pnl >= 0 ? 'success' : 'error');
    this.playChime(pos.pnl >= 0 ? 'success' : 'error');

    if (this.onUpdate) this.onUpdate(this.account);
  }

  updateLivePrices(currentPrices) {
    let totalUnrealizedPnL = 0;

    this.account.positions.forEach(pos => {
      const livePrice = currentPrices[pos.symbol];
      if (livePrice) {
        pos.currentPrice = livePrice;
        if (pos.type === 'LONG') {
          pos.pnl = (livePrice - pos.entryPrice) * pos.size;
        } else {
          pos.pnl = (pos.entryPrice - livePrice) * pos.size;
        }
        pos.pnlPercent = (pos.pnl / pos.margin) * 100;
        totalUnrealizedPnL += pos.pnl;
      }
    });

    if (this.onUpdate) this.onUpdate(this.account);
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') {
      toast.style.borderLeftColor = '#e11d48';
    }

    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${type === 'error' ? '#e11d48' : '#10b981'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${type === 'error' 
          ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>' 
          : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'}
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }
}

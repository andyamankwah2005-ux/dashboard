// Mission 3 Charting & Graphics Engine

// 1. Interactive Candlestick Chart Engine
export class ChartEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.candles = [];
    this.chartType = 'candlestick';
    this.mouseX = null;
    this.mouseY = null;
    this.initEvents();
    this.resize();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height || 280;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.render();
  }

  initEvents() {
    if (!this.canvas) return;
    window.addEventListener('resize', () => this.resize());
    
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      this.render();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouseX = null;
      this.mouseY = null;
      this.render();
    });
  }

  setData(candles) {
    this.candles = candles;
    this.render();
  }

  addCandle(candle) {
    this.candles.push(candle);
    if (this.candles.length > 60) this.candles.shift();
    this.render();
  }

  updateLastCandle(price) {
    if (!this.candles.length) return;
    const last = this.candles[this.candles.length - 1];
    last.close = price;
    if (price > last.high) last.high = price;
    if (price < last.low) last.low = price;
    this.render();
  }

  render() {
    if (!this.ctx || !this.candles.length) return;
    const { ctx, width, height, candles } = this;
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 20, right: 65, bottom: 30, left: 10 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Price Bounds
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVol = 0;

    candles.forEach(c => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    });

    const priceMargin = (maxPrice - minPrice) * 0.1 || 10;
    minPrice -= priceMargin;
    maxPrice += priceMargin;
    const priceRange = maxPrice - minPrice;

    const getX = (i) => padding.left + (i / (candles.length - 1)) * chartWidth;
    const getY = (val) => padding.top + chartHeight - ((val - minPrice) / priceRange) * chartHeight;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? '#143b35' : '#eef3f1';
    const axisTextColor = isDark ? '#6e9890' : '#94a7a3';

    // Grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const gridRows = 4;
    for (let r = 0; r <= gridRows; r++) {
      const y = padding.top + (chartHeight / gridRows) * r;
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);

      const priceVal = maxPrice - (r / gridRows) * priceRange;
      ctx.fillStyle = axisTextColor;
      ctx.font = '10.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(priceVal.toFixed(2), width - padding.right + 8, y + 3.5);
    }
    ctx.stroke();

    // Volume bars
    const volBaseY = height - padding.bottom;
    const maxVolBarHeight = chartHeight * 0.22;
    const candleWidth = Math.max(3, (chartWidth / candles.length) * 0.65);

    candles.forEach((c, i) => {
      const x = getX(i);
      const isUp = c.close >= c.open;
      const volHeight = (c.volume / (maxVol || 1)) * maxVolBarHeight;

      ctx.fillStyle = isUp ? 'rgba(16, 185, 129, 0.2)' : 'rgba(225, 29, 72, 0.2)';
      ctx.fillRect(x - candleWidth / 2, volBaseY - volHeight, candleWidth, volHeight);
    });

    // Candlesticks
    candles.forEach((c, i) => {
      const x = getX(i);
      const isUp = c.close >= c.open;
      const openY = getY(c.open);
      const closeY = getY(c.close);
      const highY = getY(c.high);
      const lowY = getY(c.low);

      const color = isUp ? '#059669' : '#e11d48';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      const bodyY = Math.min(openY, closeY);
      const bodyH = Math.max(2, Math.abs(closeY - openY));
      ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyH);
    });

    // EMA-9
    const emaPeriod = 9;
    const k = 2 / (emaPeriod + 1);
    let ema = candles[0].close;
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.8;
    candles.forEach((c, i) => {
      ema = c.close * k + ema * (1 - k);
      const x = getX(i);
      const y = getY(ema);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Crosshair
    if (this.mouseX !== null && this.mouseX >= padding.left && this.mouseX <= width - padding.right) {
      const hoverIndex = Math.min(
        candles.length - 1,
        Math.max(0, Math.round(((this.mouseX - padding.left) / chartWidth) * (candles.length - 1)))
      );
      const c = candles[hoverIndex];
      const candleX = getX(hoverIndex);
      const candleY = getY(c.close);

      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#647b77';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(candleX, padding.top);
      ctx.lineTo(candleX, height - padding.bottom);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(padding.left, candleY);
      ctx.lineTo(width - padding.right, candleY);
      ctx.stroke();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(candleX, candleY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = c.close >= c.open ? '#10b981' : '#e11d48';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      const dateStr = new Date(c.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const tooltipText = `O: ${c.open.toFixed(2)}  H: ${c.high.toFixed(2)}  L: ${c.low.toFixed(2)}  C: ${c.close.toFixed(2)} [${dateStr}]`;
      
      ctx.fillStyle = '#061e1b';
      const textWidth = ctx.measureText(tooltipText).width + 20;
      const tooltipX = Math.min(width - textWidth - 20, Math.max(20, candleX - textWidth / 2));
      ctx.beginPath();
      ctx.roundRect(tooltipX, 4, textWidth, 22, 6);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(tooltipText, tooltipX + 10, 19);
    }
  }
}

// 2. Interactive Equity Curve Area Chart
export class EquityCurveChart {
  constructor(canvasId, data) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.data = data || [];
    this.mouseX = null;
    this.initEvents();
    this.resize();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height || 260;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.render();
  }

  initEvents() {
    if (!this.canvas) return;
    window.addEventListener('resize', () => this.resize());
    
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.render();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouseX = null;
      this.render();
    });
  }

  setData(data) {
    this.data = data;
    this.render();
  }

  render() {
    if (!this.ctx || !this.data.length) return;
    const { ctx, width, height, data } = this;
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 24, right: 65, bottom: 30, left: 15 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    let minVal = Infinity;
    let maxVal = -Infinity;

    data.forEach(d => {
      if (d.equity < minVal) minVal = d.equity;
      if (d.equity > maxVal) maxVal = d.equity;
      if (d.benchmark < minVal) minVal = d.benchmark;
      if (d.benchmark > maxVal) maxVal = d.benchmark;
    });

    const margin = (maxVal - minVal) * 0.12 || 5000;
    minVal -= margin;
    maxVal += margin;
    const valRange = maxVal - minVal;

    const getX = (i) => padding.left + (i / (data.length - 1)) * chartWidth;
    const getY = (val) => padding.top + chartHeight - ((val - minVal) / valRange) * chartHeight;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? '#143b35' : '#eef3f1';
    const axisTextColor = isDark ? '#6e9890' : '#94a7a3';

    // Grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const rows = 4;
    for (let r = 0; r <= rows; r++) {
      const y = padding.top + (chartHeight / rows) * r;
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);

      const val = maxVal - (r / rows) * valRange;
      ctx.fillStyle = axisTextColor;
      ctx.font = '10.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`$${Math.round(val / 1000)}k`, width - padding.right + 8, y + 3.5);
    }
    ctx.stroke();

    // Draw Benchmark Line (dashed gray)
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = isDark ? '#4b6f68' : '#94a7a3';
    ctx.lineWidth = 1.5;
    data.forEach((d, i) => {
      const x = getX(i);
      const y = getY(d.benchmark);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Equity Area Fill (Emerald gradient)
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    ctx.beginPath();
    ctx.moveTo(getX(0), height - padding.bottom);
    data.forEach((d, i) => {
      ctx.lineTo(getX(i), getY(d.equity));
    });
    ctx.lineTo(getX(data.length - 1), height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Main Equity Line
    ctx.beginPath();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    data.forEach((d, i) => {
      const x = getX(i);
      const y = getY(d.equity);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Dates on X Axis
    ctx.fillStyle = axisTextColor;
    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    const step = Math.ceil(data.length / 6);
    data.forEach((d, i) => {
      if (i % step === 0 || i === data.length - 1) {
        ctx.fillText(d.date, getX(i), height - 10);
      }
    });

    // Crosshair & Tooltip
    if (this.mouseX !== null && this.mouseX >= padding.left && this.mouseX <= width - padding.right) {
      const hoverIndex = Math.min(
        data.length - 1,
        Math.max(0, Math.round(((this.mouseX - padding.left) / chartWidth) * (data.length - 1)))
      );
      const item = data[hoverIndex];
      const posX = getX(hoverIndex);
      const posY = getY(item.equity);

      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#647b77';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(posX, padding.top);
      ctx.lineTo(posX, height - padding.bottom);
      ctx.stroke();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(posX, posY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      const tooltipText = `${item.date}: Equity $${item.equity.toLocaleString()} (Benchmark $${item.benchmark.toLocaleString()})`;
      ctx.fillStyle = '#061e1b';
      const textWidth = ctx.measureText(tooltipText).width + 24;
      const tipX = Math.min(width - textWidth - 20, Math.max(20, posX - textWidth / 2));
      ctx.beginPath();
      ctx.roundRect(tipX, 4, textWidth, 22, 6);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(tooltipText, tipX + 12, 19);
    }
  }
}

// 3. Interactive Win / Loss Performance Bar Chart
export class WinLossPerformanceChart {
  constructor(canvasId, data) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.data = data || [];
    this.mouseX = null;
    this.initEvents();
    this.resize();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height || 260;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.render();
  }

  initEvents() {
    if (!this.canvas) return;
    window.addEventListener('resize', () => this.resize());
    
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.render();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouseX = null;
      this.render();
    });
  }

  render() {
    if (!this.ctx || !this.data.length) return;
    const { ctx, width, height, data } = this;
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 24, right: 40, bottom: 30, left: 15 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    let maxTrades = 0;
    data.forEach(d => {
      const total = d.wins + d.losses;
      if (total > maxTrades) maxTrades = total;
    });

    maxTrades = Math.ceil((maxTrades * 1.15) / 10) * 10 || 120;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? '#143b35' : '#eef3f1';
    const axisTextColor = isDark ? '#6e9890' : '#94a7a3';

    // Grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const rows = 4;
    for (let r = 0; r <= rows; r++) {
      const y = padding.top + (chartHeight / rows) * r;
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);

      const val = maxTrades - (r / rows) * maxTrades;
      ctx.fillStyle = axisTextColor;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(Math.round(val), width - padding.right + 6, y + 3.5);
    }
    ctx.stroke();

    const groupWidth = chartWidth / data.length;
    const barWidth = Math.min(14, groupWidth * 0.32);

    data.forEach((d, i) => {
      const groupCenterX = padding.left + i * groupWidth + groupWidth / 2;
      const winHeight = (d.wins / maxTrades) * chartHeight;
      const lossHeight = (d.losses / maxTrades) * chartHeight;
      const baseY = height - padding.bottom;

      // Win Bar (Green)
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(groupCenterX - barWidth - 2, baseY - winHeight, barWidth, winHeight, [4, 4, 0, 0]);
      ctx.fill();

      // Loss Bar (Red)
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.roundRect(groupCenterX + 2, baseY - lossHeight, barWidth, lossHeight, [4, 4, 0, 0]);
      ctx.fill();

      // Period Label
      ctx.fillStyle = axisTextColor;
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.period, groupCenterX, height - 10);
    });

    // Tooltip on Hover
    if (this.mouseX !== null && this.mouseX >= padding.left && this.mouseX <= width - padding.right) {
      const idx = Math.min(data.length - 1, Math.max(0, Math.floor((this.mouseX - padding.left) / groupWidth)));
      const item = data[idx];
      const posX = padding.left + idx * groupWidth + groupWidth / 2;

      const tipText = `${item.period}: ${item.wins} Wins (${item.winRate}%) · ${item.losses} Losses · +$${item.pnl.toLocaleString()}`;
      ctx.fillStyle = '#061e1b';
      const textWidth = ctx.measureText(tipText).width + 24;
      const tipX = Math.min(width - textWidth - 10, Math.max(10, posX - textWidth / 2));
      
      ctx.beginPath();
      ctx.roundRect(tipX, 4, textWidth, 22, 6);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(tipText, tipX + 12, 19);
    }
  }
}

import React, { useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';

export default function WinLossChart({ data }) {
  const canvasRef = useRef(null);
  const mouseXRef = useRef(null);
  const sizeRef = useRef({ width: 0, height: 260 });
  const { theme } = useApp();

  const renderChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || !data.length) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = sizeRef.current;
    if (!width || !height) return;

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 24, right: 40, bottom: 30, left: 15 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    let maxTrades = 0;
    data.forEach((d) => {
      const total = d.wins + d.losses;
      if (total > maxTrades) maxTrades = total;
    });
    maxTrades = Math.ceil((maxTrades * 1.15) / 10) * 10 || 120;

    const isDark = theme === 'dark';
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

      // Win bar
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(groupCenterX - barWidth - 2, baseY - winHeight, barWidth, winHeight, [4, 4, 0, 0]);
      ctx.fill();

      // Loss bar
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.roundRect(groupCenterX + 2, baseY - lossHeight, barWidth, lossHeight, [4, 4, 0, 0]);
      ctx.fill();

      // Period label
      ctx.fillStyle = axisTextColor;
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.period, groupCenterX, height - 10);
    });

    // Tooltip on hover
    const mouseX = mouseXRef.current;
    if (mouseX !== null && mouseX >= padding.left && mouseX <= width - padding.right) {
      const idx = Math.min(
        data.length - 1,
        Math.max(0, Math.floor((mouseX - padding.left) / groupWidth))
      );
      const item = data[idx];
      const posX = padding.left + idx * groupWidth + groupWidth / 2;

      const tipText = `${item.period}: ${item.wins} Wins (${item.winRate}%) · ${item.losses} Losses · +$${item.pnl.toLocaleString()}`;
      ctx.font = '10px "JetBrains Mono", monospace';
      const textWidth = ctx.measureText(tipText).width + 24;
      const tipX = Math.min(width - textWidth - 10, Math.max(10, posX - textWidth / 2));

      ctx.fillStyle = '#061e1b';
      ctx.beginPath();
      ctx.roundRect(tipX, 4, textWidth, 22, 6);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(tipText, tipX + 12, 19);
    }
  }, [data, theme]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = rect.height || 260;
    sizeRef.current = { width, height };
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderChart();
  }, [renderChart]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    renderChart();
  }, [renderChart]);

  return (
    <canvas
      ref={canvasRef}
      id="winLossCanvas"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseXRef.current = e.clientX - rect.left;
        renderChart();
      }}
      onMouseLeave={() => {
        mouseXRef.current = null;
        renderChart();
      }}
    />
  );
}


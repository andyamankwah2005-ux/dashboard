import React, { useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';

export default function EquityCurveChart({ data }) {
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

    const padding = { top: 24, right: 65, bottom: 30, left: 15 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    let minVal = Infinity;
    let maxVal = -Infinity;

    data.forEach((d) => {
      if (d.equity < minVal) minVal = d.equity;
      if (d.equity > maxVal) maxVal = d.equity;
      if (d.benchmark < minVal) minVal = d.benchmark;
      if (d.benchmark > maxVal) maxVal = d.benchmark;
    });

    const margin = (maxVal - minVal) * 0.12 || 5000;
    minVal -= margin;
    maxVal += margin;
    const valRange = maxVal - minVal;

    const getX = (i) =>
      padding.left + (data.length > 1 ? (i / (data.length - 1)) * chartWidth : chartWidth / 2);
    const getY = (val) => padding.top + chartHeight - ((val - minVal) / valRange) * chartHeight;

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

      const val = maxVal - (r / rows) * valRange;
      ctx.fillStyle = axisTextColor;
      ctx.font = '10.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`$${Math.round(val / 1000)}k`, width - padding.right + 8, y + 3.5);
    }
    ctx.stroke();

    // Benchmark dashed line
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

    // Equity area fill
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

    // Main equity line
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

    // X axis dates
    ctx.fillStyle = axisTextColor;
    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    const step = Math.ceil(data.length / 6);
    data.forEach((d, i) => {
      if (i % step === 0 || i === data.length - 1) {
        ctx.fillText(d.date, getX(i), height - 10);
      }
    });

    // Crosshair & tooltip
    const mouseX = mouseXRef.current;
    if (mouseX !== null && mouseX >= padding.left && mouseX <= width - padding.right) {
      const hoverIndex = Math.min(
        data.length - 1,
        Math.max(0, Math.round(((mouseX - padding.left) / chartWidth) * (data.length - 1)))
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

      const tooltipText = `${item.date}: Equity $${Math.round(item.equity).toLocaleString()} (Benchmark $${item.benchmark.toLocaleString()})`;
      ctx.font = '10px "JetBrains Mono", monospace';
      const textWidth = ctx.measureText(tooltipText).width + 24;
      const tipX = Math.min(width - textWidth - 20, Math.max(20, posX - textWidth / 2));

      ctx.fillStyle = '#061e1b';
      ctx.beginPath();
      ctx.roundRect(tipX, 4, textWidth, 22, 6);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(tooltipText, tipX + 12, 19);
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
      id="equityCurveCanvas"
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


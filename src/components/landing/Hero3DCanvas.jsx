import React, { useRef, useEffect } from 'react';

export default function Hero3DCanvas({ accentColor = '#10b981' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = 0;
    let height = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const PARTICLE_COUNT = 75;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 1600,
      y: (Math.random() - 0.5) * 900,
      z: Math.random() * 1000 + 100,
      size: Math.random() * 2.2 + 0.8,
      speed: Math.random() * 0.9 + 0.35
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleMouseMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 90;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 60;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let time = 0;
    const draw = () => {
      time += 0.012;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Subtle 3D perspective floor grid
      const horizonY = height * 0.58 + mouse.y * 0.25;
      const fov = 360;
      ctx.save();
      ctx.strokeStyle = `${accentColor}22`;
      ctx.lineWidth = 1;

      const gridCols = 14;
      const gridSpacing = 140;
      for (let i = -gridCols; i <= gridCols; i++) {
        const x1 = width / 2 + (i * gridSpacing - mouse.x * 1.5) * (fov / 1100);
        const y1 = horizonY;
        const x2 = width / 2 + (i * gridSpacing - mouse.x * 1.5) * (fov / 180);
        const y2 = height + 40;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      const gridRows = 9;
      for (let r = 1; r <= gridRows; r++) {
        const zProgress = ((r / gridRows + (time * 0.15) % (1 / gridRows)));
        const z = 180 + zProgress * 920;
        const y = horizonY + (220 * fov) / z;
        if (y <= height + 20) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 3D Floating Nodes & Connections
      const projected = [];
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.z -= p.speed;
        if (p.z <= 60) {
          p.z = 1100;
          p.x = (Math.random() - 0.5) * 1600;
          p.y = (Math.random() - 0.5) * 900;
        }

        const scale = fov / p.z;
        const px = width / 2 + (p.x - mouse.x * 2) * scale;
        const py = height / 2 + (p.y - mouse.y * 2) * scale;
        const alpha = Math.min(1, Math.max(0.08, 1 - p.z / 1150));

        if (px >= -40 && px <= width + 40 && py >= -40 && py <= height + 40) {
          projected.push({ x: px, y: py, alpha, size: p.size * scale * 1.6 });

          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.8, p.size * scale * 1.5), 0, Math.PI * 2);
          ctx.fillStyle = accentColor;
          ctx.globalAlpha = alpha * 0.75;
          ctx.fill();
        }
      }

      // Connect nearby 3D nodes
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.strokeStyle = accentColor;
            ctx.globalAlpha = (1 - dist / 115) * 0.22;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [accentColor]);

  return <canvas ref={canvasRef} className="landing-3d-canvas" aria-hidden="true" />;
}


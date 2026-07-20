import React, { useEffect, useRef, useState } from 'react';

export default function Memory3dVisualizer() {
  const canvasRef = useRef(null);
  const rotYRef = useRef(0.4);
  const rotXRef = useRef(0.5);
  const isHoveredRef = useRef(false);
  const activeFilterRef = useRef('all');
  const animFrameRef = useRef(null);
  const timeRef = useRef(0);

  const [activeFilter, setActiveFilter] = useState('all');

  const GRID_SIZE = 4;

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    activeFilterRef.current = filter;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    const render = () => {
      timeRef.current += 0.015;
      const time = timeRef.current;

      if (!isHoveredRef.current) {
        rotYRef.current += 0.004;
      }
      const currentRotY = rotYRef.current;
      const currentRotX = rotXRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2 + 25;
      const blockSize = 28;
      const gap = 10;

      const project = (x, y, z) => {
        const cosY = Math.cos(currentRotY);
        const sinY = Math.sin(currentRotY);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        const cosX = Math.cos(currentRotX);
        const sinX = Math.sin(currentRotX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        const scale = 360 / (360 + z2);
        return {
          px: centerX + x1 * scale,
          py: centerY + y2 * scale,
          depth: z2,
          scale
        };
      };

      const cubes = [];
      const currentFilter = activeFilterRef.current;

      for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
          for (let z = 0; z < GRID_SIZE; z++) {
            const cx = (x - (GRID_SIZE - 1) / 2) * (blockSize + gap);
            const cy = (y - (GRID_SIZE - 1) / 2) * (blockSize + gap);
            const cz = (z - (GRID_SIZE - 1) / 2) * (blockSize + gap);

            const blockId = x * 16 + y * 4 + z;
            let color = '#38bdf8';
            let alpha = 0.25;
            let category = 'heap';

            if (blockId % 5 === 0) {
              color = '#10b981';
              alpha = 0.85;
              category = 'code';
            } else if (blockId % 3 === 0) {
              color = '#a78bfa';
              alpha = 0.75;
              category = 'libs';
            } else if (blockId % 7 === 0) {
              color = '#ef4444';
              alpha = 0.95;
              category = 'swap';
            } else if (blockId % 2 === 0) {
              color = '#38bdf8';
              alpha = 0.55;
              category = 'heap';
            }

            // Filtering opacity modulation
            let isDimmed = false;
            if (currentFilter !== 'all' && currentFilter !== category) {
              isDimmed = true;
              alpha = 0.05;
            }

            const pulse = Math.sin(time * 2.5 + blockId) * 0.15 + 0.85;
            const proj = project(cx, cy, cz);

            cubes.push({
              x, y, z, cx, cy, cz,
              proj,
              color,
              alpha: alpha * pulse,
              blockId,
              isDimmed
            });
          }
        }
      }

      cubes.sort((a, b) => b.proj.depth - a.proj.depth);

      cubes.forEach((cube) => {
        const { px, py, scale, color, alpha, isDimmed } = cube;
        const s = (blockSize / 2) * scale;

        // Top face
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.min(1, alpha + (isDimmed ? 0 : 0.15));
        ctx.beginPath();
        ctx.moveTo(px, py - s);
        ctx.lineTo(px + s * 1.2, py - s * 0.4);
        ctx.lineTo(px, py + s * 0.2);
        ctx.lineTo(px - s * 1.2, py - s * 0.4);
        ctx.closePath();
        ctx.fill();

        // Left face
        ctx.globalAlpha = Math.min(1, alpha * 0.75);
        ctx.beginPath();
        ctx.moveTo(px - s * 1.2, py - s * 0.4);
        ctx.lineTo(px, py + s * 0.2);
        ctx.lineTo(px, py + s * 1.2);
        ctx.lineTo(px - s * 1.2, py + s * 0.6);
        ctx.closePath();
        ctx.fill();

        // Right face
        ctx.globalAlpha = Math.min(1, alpha * 0.5);
        ctx.beginPath();
        ctx.moveTo(px, py + s * 0.2);
        ctx.lineTo(px + s * 1.2, py - s * 0.4);
        ctx.lineTo(px + s * 1.2, py + s * 0.6);
        ctx.lineTo(px, py + s * 1.2);
        ctx.closePath();
        ctx.fill();

        // Outline
        ctx.globalAlpha = isDimmed ? 0.08 : 0.4;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1 * scale;
        ctx.stroke();

        ctx.globalAlpha = 1.0;
      });

      // Data signal stream
      for (let i = 0; i < 4; i++) {
        const pTime = (time * 1.2 + i * 1.5) % 4;
        const pProg = pTime / 4;
        const startX = -120 + pProg * 240;
        const pProj = project(startX, -90, -90);

        ctx.fillStyle = '#10b981';
        ctx.globalAlpha = currentFilter === 'all' || currentFilter === 'code' ? 1.0 : 0.2;
        ctx.beginPath();
        ctx.arc(pProj.px, pProj.py, 3.5 * pProj.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div style={{
      background: 'rgba(13, 17, 32, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      borderRadius: '20px',
      padding: '1.75rem',
      color: '#ece8ff',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 35px rgba(56, 189, 248, 0.1)',
      margin: '2rem 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* HUD Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#38bdf8' }}>
            3D CODE VISUALIZER // PHYSICAL RAM MATRIX
          </div>
          <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.2rem', fontWeight: 800, color: '#faf8ff' }}>
            Real-Time 3D Memory Cube & Page Frame Allocation
          </h3>
        </div>

        {/* Interactive Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleFilterChange('all')}
            style={{
              background: activeFilter === 'all' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${activeFilter === 'all' ? '#ffffff' : 'rgba(255,255,255,0.1)'}`,
              color: activeFilter === 'all' ? '#ffffff' : '#94a3b8',
              padding: '0.35rem 0.75rem',
              borderRadius: '100px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Show All
          </button>
          <button
            onClick={() => handleFilterChange('code')}
            style={{
              background: activeFilter === 'code' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.05)',
              border: `1px solid ${activeFilter === 'code' ? '#10b981' : 'rgba(16, 185, 129, 0.2)'}`,
              color: activeFilter === 'code' ? '#10b981' : '#94a3b8',
              padding: '0.35rem 0.75rem',
              borderRadius: '100px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Code Pages
          </button>
          <button
            onClick={() => handleFilterChange('heap')}
            style={{
              background: activeFilter === 'heap' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(56, 189, 248, 0.05)',
              border: `1px solid ${activeFilter === 'heap' ? '#38bdf8' : 'rgba(56, 189, 248, 0.2)'}`,
              color: activeFilter === 'heap' ? '#38bdf8' : '#94a3b8',
              padding: '0.35rem 0.75rem',
              borderRadius: '100px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Heap Frames
          </button>
          <button
            onClick={() => handleFilterChange('libs')}
            style={{
              background: activeFilter === 'libs' ? 'rgba(167, 139, 250, 0.25)' : 'rgba(167, 139, 250, 0.05)',
              border: `1px solid ${activeFilter === 'libs' ? '#a78bfa' : 'rgba(167, 139, 250, 0.2)'}`,
              color: activeFilter === 'libs' ? '#a78bfa' : '#94a3b8',
              padding: '0.35rem 0.75rem',
              borderRadius: '100px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Shared Libs
          </button>
          <button
            onClick={() => handleFilterChange('swap')}
            style={{
              background: activeFilter === 'swap' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.05)',
              border: `1px solid ${activeFilter === 'swap' ? '#ef4444' : 'rgba(239, 68, 68, 0.2)'}`,
              color: activeFilter === 'swap' ? '#ef4444' : '#94a3b8',
              padding: '0.35rem 0.75rem',
              borderRadius: '100px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Swapped Out
          </button>
        </div>
      </div>

      {/* 3D Canvas rendering box */}
      <div 
        style={{ position: 'relative', width: '100%', height: '340px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
      >
        <canvas 
          ref={canvasRef} 
          width={700} 
          height={340}
          style={{ width: '100%', height: '100%', cursor: 'pointer' }}
        />

        {/* Telemetry overlay */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(7, 9, 19, 0.75)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '8px',
          padding: '0.4rem 0.75rem',
          fontSize: '0.72rem',
          fontFamily: 'monospace',
          color: '#38bdf8'
        }}>
          <div>FILTER: {activeFilter.toUpperCase()}</div>
          <div>MATRIX: 4x4x4 (64 FRAMES)</div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: 'rgba(7, 9, 19, 0.75)',
          border: '1px solid rgba(167, 139, 250, 0.2)',
          borderRadius: '8px',
          padding: '0.4rem 0.75rem',
          fontSize: '0.72rem',
          fontFamily: 'monospace',
          color: '#a78bfa'
        }}>
          <div>TLB HIT RATE: 97.8%</div>
          <div>PAGE FAULTS: 0.02%</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '0.75rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        fontSize: '0.75rem',
        color: '#94a3b8'
      }}>
        <span>Interactive Filter Mode: Click pills above to isolate Code, Heap, Shared Libs, or Swapped Out frames in 3D RAM.</span>
        <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>GPU CANVAS ENGINE</span>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

// ============================================================================
// PageFrame3DVisualizer.jsx
// A stunning CSS 3D Isometric cube representing physical RAM frames.
// ============================================================================

export default function PageFrame3DVisualizer() {
  const [filter, setFilter] = useState('ALL');
  const [hoveredFrame, setHoveredFrame] = useState(null);
  
  // We'll create a 4x4x4 grid (64 frames)
  // Types: 'code', 'heap', 'shared', 'swapped', 'empty'
  
  // Deterministic random generation for the visualizer
  const generateFrames = () => {
    const frames = [];
    const types = ['code', 'heap', 'shared', 'swapped', 'empty'];
    
    // Controlled distribution so it looks organic but populated
    const distribution = [
      ...Array(15).fill('code'),
      ...Array(12).fill('heap'),
      ...Array(8).fill('shared'),
      ...Array(10).fill('swapped'),
      ...Array(19).fill('empty'),
    ];
    
    // Shuffle
    for (let i = distribution.length - 1; i > 0; i--) {
      const j = Math.floor(Math.sin(i * 100) * 10000) % (i + 1); // Pseudo-random
      [distribution[i], distribution[j]] = [distribution[j], distribution[i]];
    }

    let index = 0;
    for (let z = 0; z < 4; z++) {
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          const type = distribution[index];
          let color = '#334155'; // empty
          let label = 'Free Space';
          
          if (type === 'code') { color = '#38bdf8'; label = 'Code Page (Read-Only)'; }
          if (type === 'heap') { color = '#a78bfa'; label = 'Heap Data (R/W)'; }
          if (type === 'shared') { color = '#22d3ee'; label = 'Shared Library (libc)'; }
          if (type === 'swapped') { color = '#f43f5e'; label = 'Swapped to Disk'; }

          frames.push({
            id: index,
            x, y, z,
            type,
            color,
            label,
            physAddress: `0x${(0x1000 + index * 0x40).toString(16).toUpperCase()}`
          });
          index++;
        }
      }
    }
    return frames;
  };

  const [frames] = useState(generateFrames());

  const getFilterColor = (f) => {
    switch(f) {
      case 'CODE': return '#38bdf8';
      case 'HEAP': return '#a78bfa';
      case 'SHARED': return '#22d3ee';
      case 'SWAPPED': return '#f43f5e';
      default: return '#c084fc'; // Accent
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '600px',
      background: 'rgba(10, 6, 32, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(196, 164, 255, 0.1)',
      borderRadius: '20px',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Inter", sans-serif'
    }}>
      {/* Dynamic Background Glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '500px', height: '500px',
        background: `radial-gradient(circle, ${getFilterColor(filter)}33 0%, transparent 70%)`,
        filter: 'blur(60px)',
        zIndex: 0,
        transition: 'background 0.5s ease'
      }}></div>

      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 10, position: 'relative' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#22d3ee', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
            3D Code Visualizer // Physical RAM Matrix
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Real-Time 3D Memory Cube & Page Frame Allocation
          </h2>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '400px' }}>
          {['ALL', 'CODE', 'HEAP', 'SHARED', 'SWAPPED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? `${getFilterColor(f)}22` : 'transparent',
                border: `1px solid ${filter === f ? getFilterColor(f) : 'rgba(255,255,255,0.2)'}`,
                color: filter === f ? getFilterColor(f) : '#94a3b8',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: filter === f ? `0 0 15px ${getFilterColor(f)}44` : 'none'
              }}
            >
              {f === 'CODE' ? 'Code Pages' : f === 'HEAP' ? 'Heap Frames' : f === 'SHARED' ? 'Shared Libs' : f === 'SWAPPED' ? 'Swapped Out' : 'Show All'}
            </button>
          ))}
        </div>
      </div>

      {/* HUD Info Box */}
      <div style={{
        position: 'absolute', top: '120px', left: '2rem', zIndex: 10,
        background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(196,164,255,0.2)',
        padding: '1rem', borderRadius: '12px', width: '220px',
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{ fontSize: '0.75rem', color: '#8478b8', fontWeight: 600, letterSpacing: '1px', marginBottom: '5px' }}>FILTER: {filter}</div>
        <div style={{ fontSize: '0.85rem', color: '#22d3ee', fontWeight: 700 }}>MATRIX: 4x4x4 (64 FRAMES)</div>
        
        {hoveredFrame && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', animation: 'fadeIn 0.2s' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>PHYSICAL ADDRESS</div>
            <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold', fontFamily: 'monospace' }}>{hoveredFrame.physAddress}</div>
            
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '10px' }}>CONTENTS</div>
            <div style={{ fontSize: '0.9rem', color: hoveredFrame.color, fontWeight: 600 }}>{hoveredFrame.label}</div>
          </div>
        )}
      </div>

      <div style={{
        position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 10,
        background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(196,164,255,0.2)',
        padding: '1rem', borderRadius: '12px',
        display: 'flex', flexDirection: 'column', gap: '8px'
      }}>
        <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 'bold', fontFamily: 'monospace' }}>TLB HIT RATE: 97.8%</div>
        <div style={{ fontSize: '0.8rem', color: '#f43f5e', fontWeight: 'bold', fontFamily: 'monospace' }}>PAGE FAULTS: 0.02%</div>
      </div>

      {/* 3D Scene Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1500px',
        zIndex: 5,
        marginTop: '20px'
      }}>
        {/* The Rotated Grid Container */}
        <div style={{
          position: 'relative',
          width: '300px',
          height: '300px',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(60deg) rotateZ(-45deg) translateZ(-50px)',
          transition: 'transform 1s ease'
        }}>
          {frames.map((frame) => {
            const isVisible = filter === 'ALL' || filter.toLowerCase() === frame.type || (filter === 'ALL' && frame.type !== 'empty');
            const isActive = hoveredFrame?.id === frame.id;
            const isDimmed = !isVisible && filter !== 'ALL';
            
            // Calculate 3D position
            // Spacing between cubes
            const spacing = 60;
            const px = (frame.x - 1.5) * spacing;
            const py = (frame.y - 1.5) * spacing;
            const pz = (frame.z - 1.5) * spacing;

            return (
              <div
                key={frame.id}
                onMouseEnter={() => setHoveredFrame(frame)}
                onMouseLeave={() => setHoveredFrame(null)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '30px',
                  height: '30px',
                  marginLeft: '-15px',
                  marginTop: '-15px',
                  background: isDimmed ? 'rgba(51, 65, 85, 0.1)' : `${frame.color}88`,
                  border: `1px solid ${isDimmed ? 'rgba(255,255,255,0.05)' : frame.color}`,
                  boxShadow: isActive ? `0 0 20px ${frame.color}` : (isVisible && frame.type !== 'empty' ? `0 0 8px ${frame.color}44` : 'none'),
                  transformStyle: 'preserve-3d',
                  // Elevate on Z if hovered or highlighted
                  transform: `translate3d(${px}px, ${py}px, ${pz + (isActive ? 20 : (isVisible && filter !== 'ALL' ? 10 : 0))}px)`,
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  cursor: 'pointer',
                  opacity: isDimmed ? 0.2 : (frame.type === 'empty' ? 0.4 : 1)
                }}
              >
                {/* Simulated 3D Cube faces */}
                <div style={{
                  position: 'absolute', width: '100%', height: '100%', background: isDimmed ? 'rgba(51, 65, 85, 0.1)' : `${frame.color}44`,
                  transform: 'rotateX(90deg) translateZ(15px)', border: `1px solid ${isDimmed ? 'transparent' : frame.color}`
                }} />
                <div style={{
                  position: 'absolute', width: '100%', height: '100%', background: isDimmed ? 'rgba(51, 65, 85, 0.1)' : `${frame.color}66`,
                  transform: 'rotateY(90deg) translateZ(15px)', border: `1px solid ${isDimmed ? 'transparent' : frame.color}`
                }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Text */}
      <div style={{
        position: 'absolute', bottom: '1.5rem', left: '2rem',
        fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)',
        zIndex: 10
      }}>
        Interactive Filter Mode: Click pills above to isolate Code, Heap, Shared Libs, or Swapped Out frames in 3D RAM. 
        <span style={{ color: '#22d3ee', marginLeft: '5px', fontWeight: 'bold' }}>GPU CANVAS ENGINE</span>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

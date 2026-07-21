import React, { useState } from 'react';

// ============================================================================
// PageFrame3DVisualizer.jsx
// A CSS 3D Isometric cube representing physical RAM frames with clean UI layout.
// ============================================================================

export default function PageFrame3DVisualizer() {
  const [filter, setFilter] = useState('ALL');
  const [hoveredFrame, setHoveredFrame] = useState(null);
  
  // Deterministic frame allocation for the 4x4x4 (64 frames) RAM matrix
  const generateFrames = () => {
    const frames = [];
    const distribution = [
      ...Array(15).fill('code'),
      ...Array(12).fill('heap'),
      ...Array(8).fill('shared'),
      ...Array(10).fill('swapped'),
      ...Array(19).fill('empty'),
    ];
    
    // Pseudo-random shuffle
    for (let i = distribution.length - 1; i > 0; i--) {
      const j = Math.floor(Math.sin(i * 100) * 10000) % (i + 1);
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
      default: return '#c084fc';
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '620px',
      background: 'rgba(10, 6, 32, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(196, 164, 255, 0.12)',
      borderRadius: '20px',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Background Radial Glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '550px', height: '550px',
        background: `radial-gradient(circle, ${getFilterColor(filter)}25 0%, transparent 70%)`,
        filter: 'blur(60px)',
        zIndex: 0,
        transition: 'background 0.5s ease',
        pointerEvents: 'none'
      }} />

      {/* HEADER & FILTER CONTROL BAR */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
        zIndex: 10,
        position: 'relative',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: '1.25rem'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#22d3ee', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
            3D CODE VISUALIZER // PHYSICAL RAM MATRIX
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Real-Time 3D Memory Cube & Page Frame Allocation
          </h3>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {['ALL', 'CODE', 'HEAP', 'SHARED', 'SWAPPED'].map(f => {
            const isActive = filter === f;
            const fColor = getFilterColor(f);
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: isActive ? `${fColor}22` : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${isActive ? fColor : 'rgba(255,255,255,0.12)'}`,
                  color: isActive ? fColor : '#94a3b8',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? `0 0 15px ${fColor}33` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isActive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: fColor }} />}
                {f === 'CODE' ? 'Code Pages' : f === 'HEAP' ? 'Heap Frames' : f === 'SHARED' ? 'Shared Libs' : f === 'SWAPPED' ? 'Swapped Out' : 'Show All'}
              </button>
            );
          })}
        </div>
      </div>

      {/* BODY SECTION: SIDE DOCKED HUD + 3D VIEWPORT */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        flex: 1,
        alignItems: 'center',
        zIndex: 5,
        position: 'relative'
      }}>
        
        {/* DOCKED HUD & FRAME INSPECTOR CARD */}
        <div style={{
          background: 'rgba(0,0,0,0.45)',
          border: '1px solid rgba(196,164,255,0.15)',
          padding: '1.25rem',
          borderRadius: '14px',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: '340px'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#8478b8', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
              HARDWARE HUD & STATUS
            </div>
            <div style={{ fontSize: '0.85rem', color: getFilterColor(filter), fontWeight: 700, marginTop: '2px' }}>
              ACTIVE FILTER: {filter}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>
              MATRIX DIMENSION: 4x4x4 (64 FRAMES)
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '1rem'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              FRAME INSPECTOR
            </div>
            {hoveredFrame ? (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>PHYSICAL ADDRESS:</div>
                <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 800, fontFamily: 'monospace' }}>
                  {hoveredFrame.physAddress}
                </div>
                
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>CONTENTS & PERMISSIONS:</div>
                <div style={{ fontSize: '0.88rem', color: hoveredFrame.color, fontWeight: 700 }}>
                  {hoveredFrame.label}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', marginTop: '0.5rem' }}>
                Hover any 3D RAM cube in the matrix to inspect physical frame metadata.
              </div>
            )}
          </div>
        </div>

        {/* 3D SCENE CONTAINER */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          perspective: '1400px',
          minHeight: '340px',
          position: 'relative'
        }}>
          {/* Rotated 3D Grid Matrix */}
          <div style={{
            position: 'relative',
            width: '280px',
            height: '280px',
            transformStyle: 'preserve-3d',
            transform: 'rotateX(60deg) rotateZ(-45deg) translateZ(-40px)',
            transition: 'transform 0.8s ease'
          }}>
            {frames.map((frame) => {
              const isVisible = filter === 'ALL' || filter.toLowerCase() === frame.type || (filter === 'ALL' && frame.type !== 'empty');
              const isActive = hoveredFrame?.id === frame.id;
              const isDimmed = !isVisible && filter !== 'ALL';
              
              const spacing = 55;
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
                    width: '28px',
                    height: '28px',
                    marginLeft: '-14px',
                    marginTop: '-14px',
                    background: isDimmed ? 'rgba(51, 65, 85, 0.1)' : `${frame.color}88`,
                    border: `1px solid ${isDimmed ? 'rgba(255,255,255,0.05)' : frame.color}`,
                    boxShadow: isActive ? `0 0 20px ${frame.color}` : (isVisible && frame.type !== 'empty' ? `0 0 8px ${frame.color}44` : 'none'),
                    transformStyle: 'preserve-3d',
                    transform: `translate3d(${px}px, ${py}px, ${pz + (isActive ? 20 : (isVisible && filter !== 'ALL' ? 10 : 0))}px)`,
                    transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    cursor: 'pointer',
                    opacity: isDimmed ? 0.15 : (frame.type === 'empty' ? 0.35 : 1)
                  }}
                >
                  <div style={{
                    position: 'absolute', width: '100%', height: '100%', background: isDimmed ? 'rgba(51, 65, 85, 0.1)' : `${frame.color}44`,
                    transform: 'rotateX(90deg) translateZ(14px)', border: `1px solid ${isDimmed ? 'transparent' : frame.color}`
                  }} />
                  <div style={{
                    position: 'absolute', width: '100%', height: '100%', background: isDimmed ? 'rgba(51, 65, 85, 0.1)' : `${frame.color}66`,
                    transform: 'rotateY(90deg) translateZ(14px)', border: `1px solid ${isDimmed ? 'transparent' : frame.color}`
                  }} />
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* DOCKED FOOTER BAR (Clean flex wrapping without cut-offs or collisions) */}
      <div style={{
        marginTop: 'auto',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: '1.25rem',
        zIndex: 10,
        position: 'relative'
      }}>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span>Interactive Filter Mode: Click pills above to isolate Code, Heap, Shared Libs, or Swapped Out frames in 3D RAM.</span>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            color: '#22d3ee',
            background: 'rgba(34, 211, 238, 0.1)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(34, 211, 238, 0.25)',
            letterSpacing: '1px'
          }}>
            GPU CANVAS ENGINE
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            padding: '4px 12px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            color: '#34d399',
            fontWeight: 700,
            fontFamily: 'monospace'
          }}>
            TLB HIT RATE: 97.8%
          </div>
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            padding: '4px 12px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            color: '#f43f5e',
            fontWeight: 700,
            fontFamily: 'monospace'
          }}>
            PAGE FAULTS: 0.02%
          </div>
        </div>
      </div>

    </div>
  );
}

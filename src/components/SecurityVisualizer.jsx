import React, { useState } from 'react';

export default function SecurityVisualizer() {
  const [vmOn, setVmOn] = useState(false);
  const [animState, setAnimState] = useState('idle'); // idle, writing, corrupted, protected

  const triggerWrite = () => {
    if (animState !== 'idle') return;
    setAnimState('writing');
    
    setTimeout(() => {
      if (vmOn) {
        setAnimState('protected');
      } else {
        setAnimState('corrupted');
      }
      
      setTimeout(() => {
        setAnimState('idle');
      }, 2500);
    }, 1000);
  };

  const statusDotColor = animState === 'idle' ? '#10b981' : (animState === 'writing' ? '#f59e0b' : (animState === 'corrupted' ? '#ef4444' : '#10b981'));

  return (
    <div className="ml-interactive-panel">
      {/* HUD Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: statusDotColor,
            boxShadow: `0 0 10px ${statusDotColor}`,
            transition: 'all 0.3s ease'
          }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#38bdf8' }}>
            MEMORY SECURITY // ISOLATION DEMO
          </span>
        </div>

        {/* Toggle Switch */}
        <div
          onClick={() => setVmOn(!vmOn)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', userSelect: 'none'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: vmOn ? '#10b981' : '#94a3b8', fontWeight: 600, transition: 'color 0.3s' }}>
            MMU {vmOn ? 'ENABLED' : 'DISABLED'}
          </span>
          <div style={{
            width: '40px', height: '20px', borderRadius: '100px',
            background: vmOn ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.08)',
            border: `1px solid ${vmOn ? '#10b981' : 'rgba(255,255,255,0.15)'}`,
            position: 'relative', transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '16px', height: '16px', borderRadius: '50%',
              background: vmOn ? '#10b981' : '#64748b',
              position: 'absolute', top: '1px',
              left: vmOn ? '21px' : '1px',
              transition: 'all 0.3s ease',
              boxShadow: vmOn ? '0 0 8px #10b981' : 'none'
            }} />
          </div>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: '1.5rem', padding: '2rem 0', flexWrap: 'wrap'
      }}>

        {/* Process A Block */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          textAlign: 'center',
          minWidth: '110px',
          position: 'relative'
        }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#f59e0b', fontWeight: 700, marginBottom: '0.5rem' }}>
            Process A
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace' }}>
            PID:01
          </div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.35rem' }}>
            ADDR 0x0000–0x0FFF
          </div>
          <button
            onClick={triggerWrite}
            disabled={animState !== 'idle'}
            style={{
              marginTop: '0.75rem',
              background: animState === 'idle' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(255,255,255,0.05)',
              color: animState === 'idle' ? '#fff' : '#64748b',
              border: 'none',
              padding: '0.45rem 1rem',
              borderRadius: '100px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: animState === 'idle' ? 'pointer' : 'not-allowed',
              boxShadow: animState === 'idle' ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            Malicious Write
          </button>
        </div>

        {/* Connection Line with MMU Shield */}
        <div style={{ position: 'relative', width: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Base line */}
          <div style={{
            width: '100%', height: '2px',
            background: `linear-gradient(90deg, rgba(245,158,11,0.4), ${vmOn ? 'rgba(16,185,129,0.4)' : 'rgba(129,140,248,0.4)'})`
          }} />

          {/* Traveling packet */}
          {animState !== 'idle' && (
            <div style={{
              position: 'absolute',
              top: '-5px',
              left: animState === 'writing' ? '0%' : (vmOn ? '45%' : '95%'),
              width: '12px', height: '12px',
              background: '#ef4444',
              borderRadius: '50%',
              boxShadow: '0 0 12px #ef4444, 0 0 24px rgba(239,68,68,0.4)',
              transition: animState === 'writing' ? 'left 1s linear' : 'none',
            }} />
          )}

          {/* Trailing particles */}
          {animState === 'writing' && [0, 1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute',
              top: '-2px',
              left: `${i * 8}%`,
              width: '6px', height: '6px',
              background: 'rgba(239, 68, 68, 0.5)',
              borderRadius: '50%',
              animation: `ml-border-pulse 0.5s ease-in-out ${i * 0.15}s infinite`,
            }} />
          ))}

          {/* Shield icon (when VM enabled) */}
          {vmOn && (
            <div style={{
              position: 'absolute',
              top: '-22px',
              left: '50%',
              transform: 'translateX(-50%)',
              filter: animState === 'protected' ? 'drop-shadow(0 0 16px #34d399)' : 'drop-shadow(0 0 4px rgba(52,211,153,0.3))',
              transition: 'all 0.4s ease',
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div style={{
                fontSize: '0.6rem', color: '#10b981', textAlign: 'center', fontWeight: 700, letterSpacing: '0.5px', marginTop: '2px'
              }}>MMU</div>
            </div>
          )}
        </div>

        {/* Process B Block */}
        <div style={{
          background: animState === 'corrupted' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(129, 140, 248, 0.08)',
          border: `1px solid ${animState === 'corrupted' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(129, 140, 248, 0.3)'}`,
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          textAlign: 'center',
          minWidth: '110px',
          transition: 'all 0.4s ease',
          boxShadow: animState === 'corrupted' ? '0 0 25px rgba(239,68,68,0.3)' : 'none'
        }}>
          <div style={{
            fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px',
            color: animState === 'corrupted' ? '#ef4444' : '#818cf8',
            fontWeight: 700, marginBottom: '0.5rem', transition: 'color 0.3s'
          }}>
            Process B
          </div>
          <div style={{
            fontSize: '1.5rem', fontWeight: 900,
            color: animState === 'corrupted' ? '#ef4444' : '#818cf8',
            fontFamily: 'monospace', transition: 'color 0.3s'
          }}>
            PID:02
          </div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.35rem' }}>
            ADDR 0x1000–0x1FFF
          </div>
        </div>

      </div>

      {/* Status Footer */}
      <div style={{
        marginTop: '0.25rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        minHeight: '2em',
        fontSize: '0.82rem',
        fontWeight: 600,
        color: animState === 'corrupted' ? '#ef4444' : (animState === 'protected' ? '#10b981' : '#94a3b8'),
        transition: 'color 0.3s'
      }}>
        {animState === 'idle' && "Click 'Malicious Write' to simulate Process A trying to overwrite Process B's memory."}
        {animState === 'writing' && "Process A is attempting to write to Process B's memory address space..."}
        {animState === 'corrupted' && "SYSTEM CRASH — Direct access allowed Process A to corrupt Process B's memory."}
        {animState === 'protected' && "ACCESS DENIED — MMU enforced virtual address boundary. Process B is safe."}
      </div>
    </div>
  );
}

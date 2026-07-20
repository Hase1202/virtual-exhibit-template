import React, { useState } from 'react';

export default function SharedLibraryVisualizer() {
  const [vmOn, setVmOn] = useState(false);

  const apps = [
    { name: 'Chrome', color: '#38bdf8' },
    { name: 'VS Code', color: '#10b981' },
    { name: 'Discord', color: '#a78bfa' },
    { name: 'Spotify', color: '#f59e0b' },
  ];

  const copiesUsed = vmOn ? 1 : 4;
  const ramSaved = vmOn ? 75 : 0;

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
            backgroundColor: vmOn ? '#10b981' : '#ef4444',
            boxShadow: `0 0 10px ${vmOn ? '#10b981' : '#ef4444'}`,
            transition: 'all 0.3s ease'
          }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#38bdf8' }}>
            SHARED PAGES // LIBRARY DEDUP
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
            SHARED PAGES {vmOn ? 'ON' : 'OFF'}
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

      {/* Main Visualization */}
      <div style={{
        display: 'flex', gap: '1.5rem', justifyContent: 'center',
        alignItems: 'center', padding: '1.5rem 0', flexWrap: 'wrap'
      }}>

        {/* Process list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.25rem' }}>
            4 Running Processes
          </div>
          {apps.map((app, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem'
            }}>
              <div style={{
                background: `${app.color}15`,
                border: `1px solid ${app.color}40`,
                borderRadius: '8px',
                padding: '0.4rem 0.8rem',
                fontSize: '0.75rem',
                color: app.color,
                fontWeight: 600,
                minWidth: '80px',
                textAlign: 'center'
              }}>
                {app.name}
              </div>

              {/* Connector line */}
              <div style={{ position: 'relative', width: '40px' }}>
                <div style={{
                  width: '100%', height: '1px',
                  background: vmOn
                    ? `linear-gradient(90deg, ${app.color}40, rgba(16,185,129,0.4))`
                    : `linear-gradient(90deg, ${app.color}40, rgba(239,68,68,0.4))`
                }} />
                <div style={{
                  position: 'absolute', right: '-3px', top: '-3px',
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: vmOn ? '#10b981' : '#ef4444',
                  transition: 'background 0.3s ease'
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Physical RAM */}
        <div style={{
          background: 'rgba(129, 140, 248, 0.06)',
          border: '1px solid rgba(129, 140, 248, 0.25)',
          borderRadius: '14px',
          padding: '1rem',
          minWidth: '180px'
        }}>
          <div style={{
            fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1.5px',
            color: '#818cf8', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px', verticalAlign: '-2px' }}>
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
              <rect x="9" y="9" width="6" height="6"/>
            </svg>
            Physical RAM
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {vmOn ? (
              <>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)',
                  padding: '0.7rem', borderRadius: '8px', textAlign: 'center',
                  fontSize: '0.75rem', color: '#10b981', fontWeight: 700
                }}>
                  libc (Shared Copy)
                  <div style={{ fontSize: '0.6rem', color: '#10b981', opacity: 0.7, marginTop: '2px' }}>
                    4 processes → 1 frame
                  </div>
                </div>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    border: '1px dashed rgba(71, 85, 105, 0.4)',
                    padding: '0.5rem', borderRadius: '8px', textAlign: 'center',
                    fontSize: '0.7rem', color: '#475569'
                  }}>
                    [ free frame ]
                  </div>
                ))}
              </>
            ) : (
              apps.map((app, idx) => (
                <div key={idx} style={{
                  background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '0.5rem', borderRadius: '8px', textAlign: 'center',
                  fontSize: '0.72rem', color: '#ef4444', fontWeight: 600
                }}>
                  libc ({app.name})
                </div>
              ))
            )}
          </div>

          {/* RAM Utilization Meter */}
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#64748b', marginBottom: '3px' }}>
              <span>LIBRARY RAM</span>
              <span style={{ fontFamily: 'monospace', color: vmOn ? '#10b981' : '#ef4444' }}>
                {vmOn ? '1 COPY' : '4 COPIES'}
              </span>
            </div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '100px',
                width: vmOn ? '25%' : '100%',
                background: vmOn ? '#10b981' : '#ef4444',
                transition: 'all 0.5s ease'
              }} />
            </div>
          </div>
        </div>

      </div>

      {/* Status Footer */}
      <div style={{
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        fontSize: '0.82rem',
        fontWeight: 600,
        color: vmOn ? '#10b981' : '#ef4444',
        transition: 'color 0.3s'
      }}>
        {vmOn ? (
          <span>All 4 processes share 1 physical frame for libc — {ramSaved}% RAM saved.</span>
        ) : (
          <span>Each process loads its own duplicate copy of libc — 4x wasted memory.</span>
        )}
      </div>
    </div>
  );
}

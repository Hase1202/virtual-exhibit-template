import React, { useState } from 'react';

export default function SwapVisualizer() {
  const [step, setStep] = useState(0); 
  // 0: Full RAM, 1: Swapping old app out, 2: Loading new app in, 3: Done

  const nextStep = () => {
    if (step === 3) {
      setStep(0);
    } else {
      setStep(s => s + 1);
    }
  };

  const statusLabel = ['RAM FULL', 'SWAPPING OUT', 'LOADING IN', 'COMPLETE'][step];
  const statusColor = ['#f59e0b', '#10b981', '#a855f7', '#38bdf8'][step];

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
            backgroundColor: statusColor,
            boxShadow: `0 0 10px ${statusColor}`,
            transition: 'all 0.3s ease'
          }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#38bdf8' }}>
            DEMAND PAGING // SWAP ENGINE
          </span>
        </div>
        <span style={{
          fontSize: '0.68rem', fontWeight: 700, letterSpacing: '1px',
          padding: '0.25rem 0.65rem', borderRadius: '100px',
          background: `${statusColor}20`,
          border: `1px solid ${statusColor}40`,
          color: statusColor,
          transition: 'all 0.3s ease',
          fontFamily: 'monospace'
        }}>
          {statusLabel}
        </span>
      </div>

      {/* Main Visualization */}
      <div style={{
        display: 'flex', gap: '1.5rem', width: '100%',
        justifyContent: 'center', alignItems: 'stretch',
        padding: '1.5rem 0', flexWrap: 'wrap'
      }}>
        
        {/* RAM Module */}
        <div style={{
          background: 'rgba(129, 140, 248, 0.06)',
          border: '1px solid rgba(129, 140, 248, 0.25)',
          borderRadius: '14px',
          padding: '1rem',
          minWidth: '150px',
          flex: '1',
          maxWidth: '200px'
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
            <div style={{
              background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '0.6rem', borderRadius: '8px', fontSize: '0.75rem',
              color: '#38bdf8', fontWeight: 600, textAlign: 'center'
            }}>Browser</div>
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)',
              padding: '0.6rem', borderRadius: '8px', fontSize: '0.75rem',
              color: '#f43f5e', fontWeight: 600, textAlign: 'center'
            }}>Game</div>
            
            {/* Swapping slot */}
            <div style={{ 
              background: step === 0 ? 'rgba(16, 185, 129, 0.15)' : (step >= 2 ? 'rgba(168, 85, 247, 0.15)' : 'transparent'),
              border: `1px ${step === 1 ? 'dashed' : 'solid'} ${step === 0 ? 'rgba(16,185,129,0.3)' : (step >= 2 ? 'rgba(168,85,247,0.3)' : 'rgba(100,116,139,0.3)')}`,
              padding: '0.6rem', borderRadius: '8px', fontSize: '0.75rem',
              color: step === 0 ? '#10b981' : (step >= 2 ? '#a855f7' : '#475569'),
              fontWeight: 600, textAlign: 'center',
              transition: 'all 0.4s ease'
            }}>
              {step === 0 ? 'Spotify (Idle)' : (step >= 2 ? 'Video Editor' : '[ empty ]')}
            </div>
          </div>

          {/* Utilization bar */}
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#64748b', marginBottom: '3px' }}>
              <span>UTILIZATION</span>
              <span style={{ fontFamily: 'monospace' }}>{step === 1 ? '66%' : '100%'}</span>
            </div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '100px',
                width: step === 1 ? '66%' : '100%',
                background: 'linear-gradient(90deg, #818cf8, #38bdf8)',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        </div>

        {/* Action Column */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center', gap: '0.75rem', minWidth: '130px'
        }}>
          {/* Animated directional arrow */}
          {step === 1 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              color: '#10b981', fontSize: '0.78rem', fontWeight: 600
            }}>
              <span>SWAP OUT</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'ml-border-pulse 1s ease-in-out infinite' }}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          )}
          {step === 2 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              color: '#a855f7', fontSize: '0.78rem', fontWeight: 600
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'ml-border-pulse 1s ease-in-out infinite' }}>
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>LOAD IN</span>
            </div>
          )}

          {(step === 0 || step === 3) && (
            <button
              onClick={nextStep}
              style={{
                background: step === 0 ? 'linear-gradient(135deg, #38bdf8, #818cf8)' : 'linear-gradient(135deg, #64748b, #475569)',
                color: '#fff',
                border: 'none',
                padding: '0.55rem 1.2rem',
                borderRadius: '100px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: step === 0 ? '0 4px 15px rgba(56, 189, 248, 0.3)' : 'none',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              {step === 0 ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  Open Video Editor
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                  Reset Demo
                </>
              )}
            </button>
          )}

          {(step === 1 || step === 2) && (
            <button
              onClick={nextStep}
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '0.4rem 0.8rem',
                borderRadius: '100px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Next Step →
            </button>
          )}
        </div>

        {/* Disk Module */}
        <div style={{
          background: 'rgba(100, 116, 139, 0.06)',
          border: '1px solid rgba(100, 116, 139, 0.25)',
          borderRadius: '14px',
          padding: '1rem',
          minWidth: '150px',
          flex: '1',
          maxWidth: '200px'
        }}>
          <div style={{
            fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1.5px',
            color: '#94a3b8', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px', verticalAlign: '-2px' }}>
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            Hard Disk (Swap)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ 
              background: step >= 1 ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              border: `1px ${step >= 1 ? 'solid' : 'dashed'} ${step >= 1 ? 'rgba(16,185,129,0.3)' : 'rgba(71,85,105,0.4)'}`,
              padding: '0.6rem', borderRadius: '8px', fontSize: '0.75rem',
              color: step >= 1 ? '#10b981' : '#475569',
              fontWeight: 600, textAlign: 'center',
              transition: 'all 0.4s ease'
            }}>
              {step >= 1 ? 'Spotify (Idle)' : '[ available ]'}
            </div>
            
            {step < 2 && (
              <div style={{
                background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '0.6rem', borderRadius: '8px', fontSize: '0.75rem',
                color: '#a855f7', fontWeight: 600, textAlign: 'center'
              }}>
                Video Editor
                <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '2px' }}>(waiting to load)</div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Status Footer */}
      <div style={{
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: '#94a3b8',
        minHeight: '1.5em'
      }}>
        {step === 0 && "RAM is 100% full. What happens when you need to open a new application?"}
        {step === 1 && "Step 1: OS pauses idle Spotify and moves its memory pages to the Disk Swap File."}
        {step === 2 && "Step 2: OS loads Video Editor into the newly freed RAM frames."}
        {step === 3 && (
          <span style={{ color: '#10b981', fontWeight: 600 }}>
            Done — avoided 'Out of Memory' by transparently swapping idle pages to disk.
          </span>
        )}
      </div>
    </div>
  );
}

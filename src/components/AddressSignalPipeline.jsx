import React, { useState, useEffect } from 'react';

// ============================================================================
// AddressSignalPipeline.jsx
// Interactive hardware pipeline simulation of MMU Address Translation
// ============================================================================

export default function AddressSignalPipeline() {
  const [activeSignal, setActiveSignal] = useState(null); // 'browser', 'editor', 'shared', 'fault'
  const [step, setStep] = useState(0); // 0 (idle), 1 (cpu), 2 (tlb), 3 (pt), 4 (ram)
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Data models for the simulations
  const scenarios = {
    browser: {
      id: 'browser', name: 'Browser Heap (Page 1)',
      vAddr: '0x1C4A', page: 'Page #1', offset: '0x24C',
      tlbHit: true, tlbText: 'TLB FAST HIT', tlbDesc: 'Instant hardware translation cache match!',
      ptHit: false, ptDesc: 'Skipped (TLB Hit)',
      frame: 'Frame #3', physAddr: '0x324C', status: 'VALID IN RAM',
      color: '#38bdf8'
    },
    editor: {
      id: 'editor', name: 'Code Editor (Page 2)',
      vAddr: '0x2A10', page: 'Page #2', offset: '0xA10',
      tlbHit: false, tlbText: 'TLB MISS', tlbDesc: 'Not in fast cache. Must check memory.',
      ptHit: true, ptDesc: 'Page #2 → Frame #7',
      frame: 'Frame #7', physAddr: '0x7A10', status: 'VALID IN RAM',
      color: '#a78bfa'
    },
    shared: {
      id: 'shared', name: 'Shared Kernel (Page 4)',
      vAddr: '0x4000', page: 'Page #4', offset: '0x000',
      tlbHit: true, tlbText: 'TLB FAST HIT', tlbDesc: 'Instant match for shared OS code.',
      ptHit: false, ptDesc: 'Skipped (TLB Hit)',
      frame: 'Frame #0', physAddr: '0x0000', status: 'LOCKED KERNEL RAM',
      color: '#22d3ee'
    },
    fault: {
      id: 'fault', name: 'Unmapped Page (Page Fault)',
      vAddr: '0x9FFF', page: 'Page #9', offset: '0xFFF',
      tlbHit: false, tlbText: 'TLB MISS', tlbDesc: 'Not in fast cache.',
      ptHit: false, ptDesc: 'Page #9 → INVALID (Not in RAM)',
      frame: 'DISK SWAP', physAddr: 'N/A', status: 'PAGE FAULT: EXCEPTION TRIGGERED',
      color: '#f43f5e'
    }
  };

  const current = activeSignal ? scenarios[activeSignal] : scenarios.browser;

  const triggerSimulation = (type) => {
    if (isSimulating) return;
    setActiveSignal(type);
    setIsSimulating(true);
    setStep(0);
    
    // Step 1: CPU Virtual Address
    setTimeout(() => setStep(1), 300);
    
    // Step 2: TLB
    setTimeout(() => {
      setStep(2);
      
      // Step 3: Page Table (if miss)
      if (!scenarios[type].tlbHit) {
        setTimeout(() => setStep(3), 1000);
        setTimeout(() => setStep(4), 2200);
        setTimeout(() => setIsSimulating(false), 3000);
      } else {
        // Skip straight to RAM if TLB hit
        setTimeout(() => setStep(4), 1000);
        setTimeout(() => setIsSimulating(false), 1800);
      }
    }, 1200);
  };

  const getStepStatus = (stepIndex) => {
    if (step === 0 && !activeSignal) return 'idle';
    if (step === stepIndex) return 'active';
    if (step > stepIndex) return 'completed';
    return 'pending';
  };

  return (
    <div style={{
      width: '100%',
      background: 'rgba(10, 6, 32, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(196, 164, 255, 0.12)',
      borderRadius: '20px',
      padding: '2rem',
      color: '#fff',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: '-50px', right: '-50px',
        width: '350px', height: '350px',
        background: `radial-gradient(circle, ${current.color}22 0%, transparent 70%)`,
        filter: 'blur(50px)', zIndex: 0,
        transition: 'background 0.5s ease'
      }} />

      {/* Header Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', zIndex: 10, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '2px', textTransform: 'uppercase' }}>
            HARDWARE MMU PIPELINE // VIRTUAL TO PHYSICAL MAPPER
          </div>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
          Select a test memory request below:
        </div>
      </div>

      {/* Control Buttons (Filter Chips) */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', zIndex: 10, position: 'relative', flexWrap: 'wrap' }}>
        {Object.values(scenarios).map(s => {
          const isSelected = activeSignal === s.id;
          return (
            <button
              key={s.id}
              onClick={() => triggerSimulation(s.id)}
              disabled={isSimulating}
              style={{
                background: isSelected ? `${s.color}22` : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${isSelected ? s.color : 'rgba(255,255,255,0.1)'}`,
                color: isSelected ? s.color : '#94a3b8',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: isSimulating ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isSelected ? `0 0 15px ${s.color}33` : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color }} />
              {s.name}
            </button>
          );
        })}
      </div>

      {/* PIPELINE GRID (4 RESPONSIVE STEPS) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        zIndex: 10,
        position: 'relative'
      }}>
        
        {/* STEP 1: CPU VIRTUAL ADDRESS */}
        {(() => {
          const st = getStepStatus(1);
          const isActive = st === 'active';
          const isDone = st === 'completed';
          return (
            <div style={{
              background: isActive ? `${current.color}18` : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${isActive ? current.color : (isDone ? `${current.color}66` : 'rgba(255,255,255,0.1)')}`,
              borderRadius: '14px',
              padding: '1.25rem',
              transition: 'all 0.3s ease',
              boxShadow: isActive ? `0 0 20px ${current.color}33` : 'none',
              opacity: st === 'idle' ? 0.7 : (isActive || isDone ? 1 : 0.45),
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              minHeight: '170px'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: current.color, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  1. CPU Virtual Address
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'monospace', color: '#fff', marginBottom: '6px' }}>
                  {current.vAddr}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                  Target: <strong>{current.name}</strong>
                </div>
              </div>

              <div style={{
                marginTop: 'auto',
                display: 'flex',
                justify: 'space-between',
                background: 'rgba(0,0,0,0.35)',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: '#94a3b8'
              }}>
                <span>{current.page}</span>
                <span>Offset {current.offset}</span>
              </div>
            </div>
          );
        })()}

        {/* STEP 2: MMU / TLB CACHE */}
        {(() => {
          const st = getStepStatus(2);
          const isActive = st === 'active';
          const isDone = st === 'completed';
          const isHit = current.tlbHit;
          const statusColor = isHit ? '#34d399' : '#f43f5e';
          return (
            <div style={{
              background: isActive ? `${statusColor}18` : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${isActive ? statusColor : (isDone ? `${statusColor}66` : 'rgba(255,255,255,0.1)')}`,
              borderRadius: '14px',
              padding: '1.25rem',
              transition: 'all 0.3s ease',
              boxShadow: isActive ? `0 0 20px ${statusColor}33` : 'none',
              opacity: st === 'idle' ? 0.7 : (isActive || isDone ? 1 : 0.45),
              display: 'flex',
              flexDirection: 'column',
              minHeight: '170px'
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: statusColor, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                2. MMU / TLB Cache
              </div>

              {(step >= 2 || (step === 0 && !activeSignal)) && (
                <>
                  <div style={{
                    display: 'inline-block',
                    alignSelf: 'flex-start',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    marginBottom: '10px',
                    background: isHit ? 'rgba(52, 211, 153, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                    color: statusColor,
                    border: `1px solid ${statusColor}55`
                  }}>
                    {current.tlbText}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4, marginTop: 'auto' }}>
                    {current.tlbDesc}
                  </div>
                </>
              )}
            </div>
          );
        })()}

        {/* STEP 3: PAGE TABLE LOOKUP */}
        {(() => {
          const st = getStepStatus(3);
          const isActive = st === 'active';
          const isDone = st === 'completed';
          const isSkipped = current.tlbHit;
          const statusColor = isSkipped ? '#64748b' : (current.ptHit ? '#34d399' : '#f43f5e');
          return (
            <div style={{
              background: isActive ? `${statusColor}18` : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${isActive ? statusColor : (isDone ? `${statusColor}66` : 'rgba(255,255,255,0.1)')}`,
              borderRadius: '14px',
              padding: '1.25rem',
              transition: 'all 0.3s ease',
              boxShadow: isActive ? `0 0 20px ${statusColor}33` : 'none',
              opacity: isSkipped ? 0.4 : (st === 'idle' ? 0.7 : (isActive || isDone ? 1 : 0.45)),
              display: 'flex',
              flexDirection: 'column',
              minHeight: '170px'
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: statusColor, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                3. Page Table Lookup
              </div>

              {(step >= 3 || (step === 0 && !activeSignal) || isSkipped) && (
                <>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: statusColor, marginBottom: '8px' }}>
                    {current.ptDesc}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 'auto' }}>
                    Status: <strong style={{ color: '#fff' }}>{isSkipped ? 'SKIPPED (TLB Hit)' : (current.ptHit ? 'VALID IN RAM' : 'PAGE FAULT')}</strong>
                  </div>
                </>
              )}
            </div>
          );
        })()}

        {/* STEP 4: PHYSICAL RAM LOCATION */}
        {(() => {
          const st = getStepStatus(4);
          const isActive = st === 'active';
          const isSuccess = current.ptHit || current.tlbHit;
          const statusColor = isSuccess ? '#34d399' : '#f43f5e';
          return (
            <div style={{
              background: isActive ? `${statusColor}18` : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${isActive ? statusColor : (step >= 4 ? `${statusColor}66` : 'rgba(255,255,255,0.1)')}`,
              borderRadius: '14px',
              padding: '1.25rem',
              transition: 'all 0.3s ease',
              boxShadow: isActive ? `0 0 20px ${statusColor}33` : 'none',
              opacity: st === 'idle' ? 0.7 : (step >= 4 ? 1 : 0.45),
              display: 'flex',
              flexDirection: 'column',
              minHeight: '170px'
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: statusColor, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                4. Physical RAM Location
              </div>

              {(step >= 4 || (step === 0 && !activeSignal)) && (
                <>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'monospace', color: statusColor, marginBottom: '6px' }}>
                    {current.frame}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                    Phys Address: <strong>{current.physAddr}</strong>
                  </div>
                  <div style={{ marginTop: 'auto', fontSize: '0.72rem', color: statusColor, fontWeight: 700 }}>
                    {current.status}
                  </div>
                </>
              )}
            </div>
          );
        })()}

      </div>

      {/* FOOTER BAR */}
      <div style={{
        marginTop: '2rem',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '1.25rem',
        zIndex: 10,
        position: 'relative'
      }}>
        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
          * Virtual Memory isolates processes by giving each app its own virtual translation map.
        </div>
        {!isSimulating && (
          <button 
            onClick={() => triggerSimulation(activeSignal || 'browser')}
            style={{ 
              background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
              color: '#fff',
              padding: '8px 20px',
              borderRadius: '999px', 
              fontSize: '0.82rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(129, 140, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.2s ease'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Re-run Signal Translation
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// AddressSignalPipeline.jsx
// Interactive hardware pipeline simulation of MMU Address Translation
// ============================================================================

export default function AddressSignalPipeline() {
  const [activeSignal, setActiveSignal] = useState(null); // 'browser', 'editor', 'shared', 'fault'
  const [step, setStep] = useState(0); // 0 (idle), 1 (cpu), 2 (tlb), 3 (pt), 4 (ram)
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Data models for the simulations
  const scenerios = {
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

  const current = activeSignal ? scenerios[activeSignal] : scenerios.browser;

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
      if (!scenerios[type].tlbHit) {
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

  const getCardStyle = (isActiveStep, isCompletedStep, accentColor) => ({
    flex: 1,
    background: isActiveStep ? `${accentColor}11` : 'rgba(255,255,255,0.02)',
    border: `1px solid ${isActiveStep ? accentColor : (isCompletedStep ? `${accentColor}55` : 'rgba(255,255,255,0.1)')}`,
    borderRadius: '12px',
    padding: '1.5rem',
    position: 'relative',
    transition: 'all 0.4s ease',
    boxShadow: isActiveStep ? `0 0 20px ${accentColor}22` : 'none',
    opacity: (step === 0 && !activeSignal) ? 0.5 : (isActiveStep || isCompletedStep ? 1 : 0.4),
    transform: isActiveStep ? 'scale(1.02)' : 'scale(1)',
    minHeight: '160px',
    display: 'flex',
    flexDirection: 'column'
  });

  return (
    <div style={{
      width: '100%',
      background: 'rgba(10, 6, 32, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(196, 164, 255, 0.1)',
      borderRadius: '20px',
      padding: '2rem',
      color: '#fff',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(167, 139, 250, 0.1) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }}></div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', zIndex: 10, position: 'relative' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }}></div>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '2px', textTransform: 'uppercase' }}>
          HARDWARE MMU PIPELINE // VIRTUAL TO PHYSICAL MAPPER
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '2.5rem', zIndex: 10, position: 'relative', flexWrap: 'wrap' }}>
        {Object.values(scenerios).map(s => (
          <button
            key={s.id}
            onClick={() => triggerSimulation(s.id)}
            disabled={isSimulating}
            style={{
              background: activeSignal === s.id ? `${s.color}22` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${activeSignal === s.id ? s.color : 'rgba(255,255,255,0.1)'}`,
              color: activeSignal === s.id ? s.color : '#94a3b8',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: isSimulating ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Pipeline Container */}
      <div style={{ display: 'flex', gap: '20px', zIndex: 10, position: 'relative' }}>
        
        {/* 1. CPU VIRTUAL ADDRESS */}
        <div style={getCardStyle(step === 1, step > 1, current.color)}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '15px' }}>1. CPU VIRTUAL ADDRESS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'monospace', marginBottom: '10px' }}>{current.vAddr}</div>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Target: <strong>{current.name}</strong></div>
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'monospace' }}>
            <span>{current.page}</span>
            <span>Offset {current.offset}</span>
          </div>
        </div>

        {/* Arrow 1 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', color: step >= 2 ? current.color : '#334155', transition: 'color 0.4s' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </div>

        {/* 2. MMU / TLB CACHE */}
        <div style={getCardStyle(step === 2, step > 2, current.tlbHit ? '#34d399' : '#f43f5e')}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '15px' }}>2. MMU / TLB CACHE</div>
          {(step >= 2 || (step === 0 && !activeSignal)) && (
            <>
              <div style={{ 
                display: 'inline-block', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '15px',
                background: current.tlbHit ? 'rgba(52, 211, 153, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: current.tlbHit ? '#34d399' : '#f43f5e',
                border: `1px solid ${current.tlbHit ? '#34d399' : '#f43f5e'}55`
              }}>
                {current.tlbText}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>{current.tlbDesc}</div>
            </>
          )}
        </div>

        {/* Arrow 2 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', color: step >= 3 ? current.color : '#334155', transition: 'color 0.4s' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </div>

        {/* 3. PAGE TABLE LOOKUP */}
        <div style={{...getCardStyle(step === 3, step > 3, '#a78bfa'), opacity: current.tlbHit ? 0.3 : (step >= 3 ? 1 : 0.4)}}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '15px' }}>3. PAGE TABLE LOOKUP</div>
          {(step >= 3 || (step === 0 && !activeSignal) || current.tlbHit) && (
            <>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: current.ptHit ? '#34d399' : (current.tlbHit ? '#94a3b8' : '#f43f5e'), marginBottom: '10px' }}>
                {current.ptDesc}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Status: {current.tlbHit ? 'SKIPPED' : (current.ptHit ? 'VALID IN RAM' : 'PAGE FAULT')}</div>
            </>
          )}
        </div>

        {/* Arrow 3 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', color: step >= 4 ? current.color : '#334155', transition: 'color 0.4s' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </div>

        {/* 4. PHYSICAL RAM LOCATION */}
        <div style={getCardStyle(step === 4, false, current.ptHit || current.tlbHit ? '#34d399' : '#f43f5e')}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '15px' }}>4. PHYSICAL RAM LOCATION</div>
          {(step >= 4 || (step === 0 && !activeSignal)) && (
            <>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'monospace', color: current.ptHit || current.tlbHit ? '#34d399' : '#f43f5e', marginBottom: '15px' }}>
                {current.frame}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Phys Address: <strong>{current.physAddr}</strong></div>
              <div style={{ marginTop: 'auto', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{current.status}</div>
            </>
          )}
        </div>

      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', zIndex: 10, position: 'relative' }}>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
          * Virtual Memory isolates processes by giving each app its own virtual translation map.
        </div>
        {!isSimulating && (
          <button 
            onClick={() => triggerSimulation(activeSignal || 'browser')}
            style={{ 
              background: '#818cf8', color: '#fff', padding: '8px 20px', borderRadius: '20px', 
              fontSize: '0.85rem', fontWeight: 700, border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(129, 140, 248, 0.4)', display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Re-run Address Signal
          </button>
        )}
      </div>
    </div>
  );
}

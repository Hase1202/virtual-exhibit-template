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

  return (
    <div style={{
      background: 'rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '1.5rem',
      color: '#fff',
      fontFamily: 'sans-serif',
      marginTop: '1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h4 style={{ margin: '0 0 1rem 0', color: '#f59e0b' }}>Demand Paging & Swap Demo</h4>
      
      <div style={{ display: 'flex', gap: '3rem', width: '100%', justifyContent: 'center', marginBottom: '2rem' }}>
        
        {/* RAM */}
        <div style={{ width: '120px', border: '2px solid #818cf8', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#818cf8', marginBottom: '8px', fontWeight: 'bold' }}>Physical RAM (Full)</div>
          
          <div style={{ background: '#38bdf8', padding: '10px', borderRadius: '4px', marginBottom: '4px', fontSize: '0.8rem' }}>Browser</div>
          <div style={{ background: '#f43f5e', padding: '10px', borderRadius: '4px', marginBottom: '4px', fontSize: '0.8rem' }}>Game</div>
          
          {/* Swapping slot */}
          <div style={{ 
            background: step === 0 ? '#10b981' : (step === 1 ? 'transparent' : (step >= 2 ? '#a855f7' : '#10b981')), 
            border: step === 1 ? '2px dashed #64748b' : 'none',
            padding: step === 1 ? '8px' : '10px', 
            borderRadius: '4px', 
            fontSize: '0.8rem',
            color: step === 1 ? 'transparent' : '#fff'
          }}>
            {step === 0 ? 'Spotify (Idle)' : (step >= 2 ? 'Video Editor' : 'empty')}
          </div>
        </div>

        {/* The Action Area */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '150px' }}>
          {step === 0 && <button onClick={nextStep} style={{ padding: '8px', cursor: 'pointer' }}>Open Video Editor</button>}
          {step === 1 && <div style={{ color: '#10b981', textAlign: 'center', fontSize: '0.9rem' }}>Moving Idle App to Disk... ➡️</div>}
          {step === 2 && <div style={{ color: '#a855f7', textAlign: 'center', fontSize: '0.9rem' }}>⬅️ Loading New App to RAM...</div>}
          {step === 3 && <button onClick={nextStep} style={{ padding: '8px', cursor: 'pointer' }}>Reset</button>}
        </div>

        {/* Disk Swap */}
        <div style={{ width: '120px', border: '2px solid #64748b', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 'bold' }}>Hard Disk (Swap)</div>
          
          <div style={{ 
            background: step >= 1 ? '#10b981' : 'transparent',
            border: step >= 1 ? 'none' : '2px dashed #475569',
            padding: step >= 1 ? '10px' : '8px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            color: step >= 1 ? '#fff' : 'transparent',
            transition: 'all 0.3s'
          }}>
            Spotify (Idle)
          </div>
          
          {step < 2 && (
             <div style={{ marginTop: '20px', background: '#a855f7', padding: '10px', borderRadius: '4px', fontSize: '0.8rem' }}>
               Video Editor<br/>(Waiting to load)
             </div>
          )}
        </div>

      </div>

      <div style={{ fontSize: '0.9rem', color: '#cbd5e1', height: '20px' }}>
        {step === 0 && "RAM is 100% full. What happens if we open a new app?"}
        {step === 1 && "1. OS pauses Spotify (idle) and moves it to the Hard Disk Swap File."}
        {step === 2 && "2. OS loads Video Editor into the newly freed RAM space."}
        {step === 3 && "Done! We avoided an 'Out of Memory' error by swapping to Disk."}
      </div>

    </div>
  );
}

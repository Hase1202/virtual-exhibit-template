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

  return (
    <div style={{
      background: 'rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '1.5rem',
      color: '#fff',
      fontFamily: 'sans-serif',
      marginTop: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#38bdf8' }}>Memory Security Demo</h4>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input type="checkbox" checked={vmOn} onChange={(e) => setVmOn(e.target.checked)} />
          Virtual Memory (MMU) Enabled
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', height: '150px' }}>
        
        {/* App A */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', background: '#f59e0b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', margin: '0 auto' }}>A</div>
          <button onClick={triggerWrite} disabled={animState !== 'idle'} style={{ marginTop: '10px', padding: '4px 8px', fontSize: '0.8rem', cursor: animState === 'idle' ? 'pointer' : 'not-allowed' }}>Malicious Write</button>
        </div>

        {/* The Gap / MMU */}
        <div style={{ position: 'relative', width: '200px', height: '2px', background: 'rgba(255,255,255,0.2)' }}>
          {/* Packet */}
          {animState !== 'idle' && (
            <div style={{
              position: 'absolute', top: '-4px', left: animState === 'writing' ? '0%' : (vmOn ? '50%' : '100%'),
              width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%',
              transition: animState === 'writing' ? 'left 1s linear' : 'none',
              boxShadow: '0 0 10px #ef4444'
            }}></div>
          )}

          {/* Shield */}
          {vmOn && (
            <div style={{
              position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)',
              fontSize: '2rem', filter: animState === 'protected' ? 'drop-shadow(0 0 10px #34d399)' : 'none',
              transition: 'all 0.3s'
            }}>
              🛡️
            </div>
          )}
        </div>

        {/* App B's Memory */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '60px', height: '60px', 
            background: animState === 'corrupted' ? '#ef4444' : '#818cf8', 
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', margin: '0 auto',
            transition: 'background 0.3s'
          }}>
            B
          </div>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginTop: '10px' }}>App B Memory</span>
        </div>

      </div>
      
      {/* Status Text */}
      <div style={{ textAlign: 'center', marginTop: '1rem', minHeight: '1.5em', color: animState === 'corrupted' ? '#ef4444' : (animState === 'protected' ? '#34d399' : '#94a3b8') }}>
        {animState === 'idle' && "Click 'Malicious Write' to see what happens."}
        {animState === 'writing' && "App A is attempting to write to App B's memory address..."}
        {animState === 'corrupted' && "CRASH! Direct Access allowed App A to corrupt App B."}
        {animState === 'protected' && "BLOCKED! Virtual Memory enforces strict boundaries."}
      </div>
    </div>
  );
}

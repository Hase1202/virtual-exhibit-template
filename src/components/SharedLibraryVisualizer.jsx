import React, { useState } from 'react';

export default function SharedLibraryVisualizer() {
  const [vmOn, setVmOn] = useState(false);

  return (
    <div style={{
      background: 'rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '1.5rem',
      color: '#fff',
      fontFamily: 'sans-serif',
      marginTop: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#a78bfa' }}>Shared Pages Demo</h4>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input type="checkbox" checked={vmOn} onChange={(e) => setVmOn(e.target.checked)} />
          Virtual Memory Enabled
        </label>
      </div>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* Virtual Apps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', fontWeight: 'bold' }}>4 Programs Running</div>
          {[1, 2, 3, 4].map(app => (
            <div key={app} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#334155', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem' }}>
                App {app}
              </div>
              <div style={{ position: 'relative', width: '50px', borderBottom: '2px dotted rgba(255,255,255,0.3)' }}>
                {/* Arrow head */}
                <div style={{ position: 'absolute', right: -5, top: -4, color: 'rgba(255,255,255,0.3)' }}>▶</div>
              </div>
            </div>
          ))}
        </div>

        {/* Physical RAM */}
        <div style={{ 
          border: '2px solid #818cf8', 
          borderRadius: '8px', 
          padding: '1rem', 
          width: '180px',
          background: 'rgba(129, 140, 248, 0.1)'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#818cf8', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>
            Physical RAM
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {vmOn ? (
              <>
                <div style={{ background: '#10b981', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  Standard C Library (libc)<br/>(Shared Copy)
                </div>
                <div style={{ border: '2px dashed #475569', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '0.8rem', color: '#475569' }}>Free Space</div>
                <div style={{ border: '2px dashed #475569', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '0.8rem', color: '#475569' }}>Free Space</div>
                <div style={{ border: '2px dashed #475569', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '0.8rem', color: '#475569' }}>Free Space</div>
              </>
            ) : (
              <>
                <div style={{ background: '#ef4444', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '0.8rem' }}>libc (App 1 Copy)</div>
                <div style={{ background: '#ef4444', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '0.8rem' }}>libc (App 2 Copy)</div>
                <div style={{ background: '#ef4444', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '0.8rem' }}>libc (App 3 Copy)</div>
                <div style={{ background: '#ef4444', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '0.8rem' }}>libc (App 4 Copy)</div>
              </>
            )}
          </div>
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#cbd5e1', fontSize: '0.9rem', height: '1.5em' }}>
        {vmOn 
          ? "✅ Smart! All 4 apps map their virtual library to the SAME physical frame. RAM saved!" 
          : "❌ Wasted Memory! Each app loads its own duplicate copy of the exact same library."}
      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';

// Theme constants
const colors = {
  cpu: "#f87171", // red
  tlb: "#22d3ee", // cyan
  ram: "#818cf8", // blue
  disk: "#a78bfa", // purple
  success: "#34d399", // green
  bg: "rgba(255, 255, 255, 0.03)",
  border: "rgba(196, 164, 255, 0.1)"
};

export default function TlbSimulator() {
  const [activeAddress, setActiveAddress] = useState(null);
  const [packetPos, setPacketPos] = useState(null); // 'cpu', 'tlb', 'ram', 'disk', 'done'
  const [outcome, setOutcome] = useState(''); // 'hit', 'miss', 'fault'
  const [log, setLog] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Hardcode behavior:
  // Page 0: Hit
  // Page 1: Miss (RAM)
  // Page 2: Page Fault (Disk)

  const simulate = (page) => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveAddress(page);
    setPacketPos('cpu');
    setOutcome('');
    setLog(`CPU requesting Virtual Page ${page}...`);

    let targetOutcome = 'hit';
    if (page === 1) targetOutcome = 'miss';
    if (page === 2) targetOutcome = 'fault';

    // Timeline
    setTimeout(() => {
      setPacketPos('tlb');
      setLog('Checking TLB Cache (Extremely Fast)...');
      
      setTimeout(() => {
        if (targetOutcome === 'hit') {
          setOutcome('hit');
          setLog('TLB HIT! Page found in cache. Translating instantly.');
          setTimeout(() => {
            setPacketPos('done');
            setIsSimulating(false);
          }, 1000);
        } else {
          setOutcome('miss');
          setLog('TLB MISS! Not in cache. Traveling to Main Memory (RAM)...');
          
          setTimeout(() => {
            setPacketPos('ram');
            
            setTimeout(() => {
              if (targetOutcome === 'miss') {
                setLog('PAGE TABLE HIT! Found in RAM. Loading into TLB...');
                setTimeout(() => {
                  setPacketPos('tlb');
                  setTimeout(() => {
                    setPacketPos('done');
                    setOutcome('hit'); // successful translation
                    setIsSimulating(false);
                  }, 800);
                }, 1000);
              } else {
                setOutcome('fault');
                setLog('PAGE FAULT! Not in RAM. Requesting from Hard Disk (Super Slow!)...');
                
                setTimeout(() => {
                  setPacketPos('disk');
                  
                  setTimeout(() => {
                    setLog('Loaded from Disk into RAM.');
                    setPacketPos('ram');
                    
                    setTimeout(() => {
                      setLog('Updating TLB and translating...');
                      setPacketPos('tlb');
                      
                      setTimeout(() => {
                        setPacketPos('done');
                        setOutcome('hit');
                        setIsSimulating(false);
                      }, 1000);
                    }, 1000);
                  }, 2000); // Super slow disk delay
                }, 1000);
              }
            }, 1000);
          }, 1000);
        }
      }, 1000);
    }, 800);
  };

  const NodeBox = ({ title, desc, color, active }) => (
    <div style={{
      background: active ? `${color}33` : colors.bg,
      border: `2px solid ${active ? color : colors.border}`,
      borderRadius: '12px',
      padding: '1.5rem',
      textAlign: 'center',
      width: '180px',
      boxShadow: active ? `0 0 20px ${color}66` : 'none',
      transition: 'all 0.3s ease',
      position: 'relative',
      zIndex: 2
    }}>
      <div style={{ fontSize: '1rem', fontWeight: 800, color: active ? '#fff' : color }}>{title}</div>
      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>{desc}</div>
    </div>
  );

  return (
    <div className="animate-fade-up in-view" style={{
      background: "rgba(255, 255, 255, 0.02)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(196, 164, 255, 0.1)",
      borderRadius: "20px",
      padding: "2rem",
      fontFamily: "'Inter', sans-serif",
      color: "#ece8ff",
      margin: "2rem 0",
      boxShadow: "0 4px 24px rgba(0, 0, 0, 0.45)"
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#faf8ff' }}>The Speed Racer: TLB Pipeline</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
          Select an address to translate. Watch the data packet travel through the system to see why caching is so important!
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <button onClick={() => simulate(0)} disabled={isSimulating} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: colors.success, color: '#000', fontWeight: 700, cursor: isSimulating ? 'not-allowed' : 'pointer', opacity: isSimulating ? 0.5 : 1 }}>
          Run TLB Hit Test
        </button>
        <button onClick={() => simulate(1)} disabled={isSimulating} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#f59e0b', color: '#000', fontWeight: 700, cursor: isSimulating ? 'not-allowed' : 'pointer', opacity: isSimulating ? 0.5 : 1 }}>
          Run TLB Miss Test
        </button>
        <button onClick={() => simulate(2)} disabled={isSimulating} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: colors.cpu, color: '#000', fontWeight: 700, cursor: isSimulating ? 'not-allowed' : 'pointer', opacity: isSimulating ? 0.5 : 1 }}>
          Run Page Fault Test
        </button>
      </div>

      {/* The Visual Pipeline */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem', margin: '2rem 0' }}>
        
        {/* Wires */}
        <div style={{ position: 'absolute', top: '10%', bottom: '10%', left: '50%', width: '4px', background: colors.border, transform: 'translateX(-50%)', zIndex: 1 }}></div>

        <NodeBox title="1. CPU" desc="Requests a memory address" color={colors.cpu} active={packetPos === 'cpu'} />
        
        <NodeBox title="2. TLB Cache" desc="Super fast hardware cache" color={colors.tlb} active={packetPos === 'tlb' || outcome === 'hit'} />

        <NodeBox title="3. Page Table (RAM)" desc="Main memory lookup" color={colors.ram} active={packetPos === 'ram'} />
        
        <NodeBox title="4. Hard Disk" desc="Agonizingly slow storage" color={colors.disk} active={packetPos === 'disk'} />

        {/* Data Packet Indicator */}
        {packetPos && packetPos !== 'done' && (
          <div style={{
            position: 'absolute',
            left: 'calc(50% - 15px)',
            width: '30px',
            height: '30px',
            background: outcome === 'fault' ? colors.cpu : (outcome === 'miss' ? '#f59e0b' : colors.success),
            borderRadius: '50%',
            boxShadow: `0 0 20px ${outcome === 'fault' ? colors.cpu : colors.success}`,
            transition: 'top 0.8s ease-in-out',
            top: packetPos === 'cpu' ? '5%' : (packetPos === 'tlb' ? '30%' : (packetPos === 'ram' ? '58%' : '85%')),
            zIndex: 3
          }} />
        )}
      </div>

      <div style={{
        background: "rgba(0, 0, 0, 0.4)",
        borderRadius: '12px',
        padding: '1.5rem',
        textAlign: 'center',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${colors.border}`
      }}>
        <strong style={{ fontSize: '1.1rem', color: outcome === 'fault' ? colors.cpu : (outcome === 'miss' ? '#f59e0b' : (outcome === 'hit' ? colors.success : '#fff')) }}>
          {log || "Waiting for address request..."}
        </strong>
      </div>
    </div>
  );
}

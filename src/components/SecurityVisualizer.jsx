import React, { useState, useEffect } from 'react';
import discordLogo from '../assets/Discord_Logo.png?url';
import spotifyLogo from '../assets/Spotify_Logo.png?url';
import valorantLogo from '../assets/Valorant_Logo.png?url';
import chromeLogo from '../assets/Chrome_Logo.png?url';

// ============================================================================
// SecurityVisualizer.jsx (V2.4)
// Refresh Button & Vulnerability Warning
// ============================================================================

export default function SecurityVisualizer() {
  const [step, setStep] = useState(-1);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [animStage, setAnimStage] = useState(0);
  const [animTrigger, setAnimTrigger] = useState(0);

  useEffect(() => {
    setAnimStage(0);
    if (step === 1) {
      const t1 = setTimeout(() => setAnimStage(1), 200);  
      const t2 = setTimeout(() => setAnimStage(2), 1700); 
      const t3 = setTimeout(() => setAnimStage(3), 3200); 
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
    if (step === 3) {
      const t1 = setTimeout(() => setAnimStage(1), 200);  
      const t2 = setTimeout(() => setAnimStage(2), 1700); 
      const t3 = setTimeout(() => setAnimStage(3), 3200); 
      const t4 = setTimeout(() => setAnimStage(4), 4000); 
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
    if (step === 4) {
      const timeouts = [];
      for(let i = 1; i <= 10; i++) {
         timeouts.push(setTimeout(() => setAnimStage(i), i * 80));
      }
      return () => { timeouts.forEach(t => clearTimeout(t)); };
    }
    if (step === 5) {
      const t1 = setTimeout(() => setAnimStage(1), 200);
      const t2 = setTimeout(() => setAnimStage(2), 1000);
      const t3 = setTimeout(() => setAnimStage(3), 2200);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
    if (step === 6) {
      const t1 = setTimeout(() => setAnimStage(1), 500);  
      const t2 = setTimeout(() => setAnimStage(2), 1700); 
      const t3 = setTimeout(() => setAnimStage(3), 2900); 
      const t4 = setTimeout(() => setAnimStage(4), 4100); 
      const t5 = setTimeout(() => setAnimStage(5), 5300); 
      const t6 = setTimeout(() => setAnimStage(6), 6500); 
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); };
    }
  }, [step, animTrigger]);

  const handlePlay = () => {
    setHasPlayed(true);
    setTimeout(() => setStep(0), 100);
  };

  const handleNext = () => setStep((s) => Math.min(6, s + 1));
  const handleBack = () => setStep((s) => Math.max(0, s - 1));
  const handleRefresh = () => setAnimTrigger((t) => t + 1);

  const slotCenters = [...Array(10)].map((_, i) => 14.5 + i * 9);

  let discordSlots, spotifySlots, valorantSlots;
  if (step === 3) {
    discordSlots = [1, 2];
    valorantSlots = [7, 8, 9];
    spotifySlots = [4, 5]; 
  } else {
    discordSlots = [0, 1];
    spotifySlots = [2, 3];
    valorantSlots = [4, 5, 6];
  }

  const yDiscord = 16;   
  const ySpotify = 42;   
  const yValorant = 68;  
  const yChrome = 94;

  const apps = [
    { id: 'discord', icon: discordLogo, name: 'Discord', color: '#a855f7', top: `${yDiscord}%`, slots: discordSlots },
    { id: 'spotify', icon: spotifyLogo, name: 'Spotify', color: '#34d399', top: `${ySpotify}%`, slots: spotifySlots },
    { id: 'valorant', icon: valorantLogo, name: 'Valorant', color: '#f43f5e', top: `${yValorant}%`, slots: valorantSlots }
  ];

  // STEP 4 Virtual Memory Configuration
  const step4Mappings = [
    { app: apps[0], vSlots: [0, 1], pSlots: [0, 2] },
    { app: apps[1], vSlots: [2, 3], pSlots: [3, 4] },
    { app: apps[2], vSlots: [4, 5, 6], pSlots: [6, 7, 9] }
  ];
  const chromePhysical = [1, 5, 8];
  const chromeApp = { id: 'chrome', icon: chromeLogo, name: 'Chrome', color: '#facc15', top: `${yChrome}%` };

  const SPLIT_X = 45; 

  return (
    <div style={{
      background: 'rgba(10, 6, 32, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(196, 164, 255, 0.1)',
      borderRadius: '20px',
      padding: '2rem 5rem',
      color: '#fff',
      fontFamily: '"Inter", sans-serif',
      marginTop: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '650px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px',
        background: step === 2 || step === 3 ? 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 60%)' :
                    step === 4 ? 'radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, transparent 60%)' :
                    step === 5 ? 'radial-gradient(circle, rgba(250, 204, 21, 0.15) 0%, transparent 60%)' :
                    step === 6 ? 'radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 60%)' :
                    'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 60%)',
        filter: 'blur(40px)', zIndex: 0, transition: 'background 0.5s ease'
      }}></div>

      {!hasPlayed && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <button onClick={handlePlay} style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', border: 'none', borderRadius: '50%', width: '100px', height: '100px',
              color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 30px rgba(56, 189, 248, 0.5)'
            }}>PLAY</button>
        </div>
      )}

      {/* REFRESH BUTTON */}
      <div style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', zIndex: 60, opacity: hasPlayed ? 1 : 0, transition: 'all 0.5s' }}>
        <button onClick={handleRefresh} className="btn-refresh" style={{
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px',
          color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>
      </div>

      {/* SIDE CONTROLS */}
      <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 30, opacity: hasPlayed ? 1 : 0, transition: 'all 0.8s' }}>
        <button onClick={handleBack} disabled={step <= 0} style={sideBtnStyle(step > 0)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      </div>
      <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 30, opacity: hasPlayed ? 1 : 0, transition: 'all 0.8s' }}>
        <button onClick={handleNext} disabled={step === 6} style={sideBtnStyle(step < 6, true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <div style={{ zIndex: 10, position: 'relative', marginBottom: '1rem', opacity: hasPlayed ? 1 : 0, transition: 'opacity 0.5s' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '2px', textTransform: 'uppercase' }}>Memory Protection Simulator</div>
        <h4 style={{ margin: '5px 0 0 0', fontSize: '1.4rem', color: '#fff', minHeight: '32px' }}>
          {step === 0 && "System Booted"}
          {step === 1 && "Direct Memory Access (Normal)"}
          {step === 2 && "The Vulnerability"}
          {step === 3 && "The Wild West (Security Crash!)"}
          {step === 4 && "Pages & Frames (The Fix)"}
          {step === 5 && "Running Apps Safely"}
          {step === 6 && "Virtual Memory Mapping"}
        </h4>
      </div>

      <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
        
        {/* STEP 2 VULNERABILITY WARNING */}
        {step === 2 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
            <div className="blink-warning" style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', border: '2px solid #ef4444', borderRadius: '24px', padding: '2rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <div style={{ color: '#ef4444', fontWeight: 'bold', marginTop: '1rem', fontSize: '1.2rem', letterSpacing: '2px' }}>NO BOUNDARY CHECKS</div>
            </div>
          </div>
        )}

        {/* SVG PATHS */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
          <defs>
            <marker id="arrowPurple" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#a855f7" /></marker>
            <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#38bdf8" /></marker>
            <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#34d399" /></marker>
            <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#f43f5e" /></marker>
            <marker id="arrowCrash" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#ef4444" /></marker>
            <marker id="arrowYellow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#facc15" /></marker>
          </defs>

          {/* STATE 1: Normal Lines */}
          {step === 1 && (
            <>
              {animStage >= 1 && (
                <>
                  <path d={`M 18 ${yDiscord} L ${SPLIT_X} ${yDiscord}`} fill="none" stroke="#a855f7" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                  {apps[0].slots.map(s => (
                    <path key={s} d={`M ${SPLIT_X} ${yDiscord} L ${SPLIT_X} ${slotCenters[s]} L 78 ${slotCenters[s]}`} fill="none" stroke="#a855f7" strokeWidth="1" pathLength="100" markerEnd="url(#arrowPurple)" className="anim-branch-fade" />
                  ))}
                </>
              )}
              {animStage >= 2 && (
                <>
                  <path d={`M 18 ${ySpotify} L ${SPLIT_X} ${ySpotify}`} fill="none" stroke="#34d399" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                  {apps[1].slots.map(s => (
                    <path key={s} d={`M ${SPLIT_X} ${ySpotify} L ${SPLIT_X} ${slotCenters[s]} L 78 ${slotCenters[s]}`} fill="none" stroke="#34d399" strokeWidth="1" pathLength="100" markerEnd="url(#arrowGreen)" className="anim-branch-fade" />
                  ))}
                </>
              )}
              {animStage >= 3 && (
                <>
                  <path d={`M 18 ${yValorant} L ${SPLIT_X} ${yValorant}`} fill="none" stroke="#f43f5e" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                  {apps[2].slots.map(s => (
                    <path key={s} d={`M ${SPLIT_X} ${yValorant} L ${SPLIT_X} ${slotCenters[s]} L 78 ${slotCenters[s]}`} fill="none" stroke="#f43f5e" strokeWidth="1" pathLength="100" markerEnd="url(#arrowRed)" className="anim-branch-fade" />
                  ))}
                </>
              )}
            </>
          )}

          {/* STATE 3: Crash */}
          {step === 3 && (
            <>
              {animStage >= 1 && (
                <>
                  <path d={`M 18 ${yDiscord} L ${SPLIT_X} ${yDiscord}`} fill="none" stroke="#a855f7" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                  {apps[0].slots.map(s => (
                    <path key={s} d={`M ${SPLIT_X} ${yDiscord} L ${SPLIT_X} ${slotCenters[s]} L 78 ${slotCenters[s]}`} fill="none" stroke="#a855f7" strokeWidth="1" pathLength="100" markerEnd="url(#arrowPurple)" className="anim-branch-fade" />
                  ))}
                </>
              )}
              {animStage >= 2 && (
                <>
                  <path d={`M 18 ${yValorant} L ${SPLIT_X} ${yValorant}`} fill="none" stroke="#f43f5e" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                  {apps[2].slots.map(s => (
                    <path key={s} d={`M ${SPLIT_X} ${yValorant} L ${SPLIT_X} ${slotCenters[s]} L 78 ${slotCenters[s]}`} fill="none" stroke="#f43f5e" strokeWidth="1" pathLength="100" markerEnd="url(#arrowRed)" className="anim-branch-fade" />
                  ))}
                </>
              )}
              {animStage >= 3 && (
                <>
                  <path d={`M 18 ${ySpotify} L ${SPLIT_X} ${ySpotify}`} fill="none" stroke="#ef4444" strokeWidth="1.5" pathLength="100" className="anim-trunk-fade" />
                  <path d={`M ${SPLIT_X} ${ySpotify} L ${SPLIT_X} ${slotCenters[6]} L 78 ${slotCenters[6]}`} fill="none" stroke="#34d399" strokeWidth="1" pathLength="100" markerEnd="url(#arrowGreen)" className="anim-branch-fade" />
                  <path d={`M ${SPLIT_X} ${ySpotify} L ${SPLIT_X} ${slotCenters[7]} L 78 ${slotCenters[7]}`} fill="none" stroke="#ef4444" strokeWidth="1.5" pathLength="100" markerEnd="url(#arrowCrash)" className="anim-branch-fade" />
                </>
              )}
            </>
          )}

          {/* STATE 5: Chrome Paths */}
          {step === 5 && (
            <>
               {(step === 5 && animStage >= 2) && (
                 <>
                   <path d={`M 18 ${yChrome} L 27.5 ${yChrome}`} fill="none" stroke="#facc15" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                   {[7, 8, 9].map(v => (
                     <path key={`c-v-${v}`} d={`M 27.5 ${yChrome} L 27.5 ${slotCenters[v]} L 37 ${slotCenters[v]}`} fill="none" stroke="#facc15" strokeWidth="1" pathLength="100" markerEnd="url(#arrowYellow)" className="anim-branch-fade" />
                   ))}
                 </>
               )}
               {(step === 5 && animStage >= 3) && [7, 8, 9].map((v, i) => {
                 const p = chromePhysical[i];
                 return (
                   <React.Fragment key={`c-p-${v}`}>
                     <path d={`M 59 ${slotCenters[v]} L 68.5 ${slotCenters[v]}`} fill="none" stroke="#facc15" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                     <path d={`M 68.5 ${slotCenters[v]} L 68.5 ${slotCenters[p]} L 78 ${slotCenters[p]}`} fill="none" stroke="#facc15" strokeWidth="1" pathLength="100" markerEnd="url(#arrowYellow)" className="anim-branch-fade" />
                   </React.Fragment>
                 )
               })}
            </>
          )}

          {/* STATE 6: Virtual Memory */}
          {step === 6 && (
            <>
              {/* DISCORD */}
              {animStage >= 1 && (
                <>
                  <path d={`M 18 ${yDiscord} L 27.5 ${yDiscord}`} fill="none" stroke="#a855f7" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                  {step4Mappings[0].vSlots.map(v => (
                    <path key={`d-v-${v}`} d={`M 27.5 ${yDiscord} L 27.5 ${slotCenters[v]} L 37 ${slotCenters[v]}`} fill="none" stroke="#a855f7" strokeWidth="1" pathLength="100" markerEnd="url(#arrowPurple)" className="anim-branch-fade" />
                  ))}
                </>
              )}
              {animStage >= 2 && step4Mappings[0].vSlots.map((v, i) => {
                const p = step4Mappings[0].pSlots[i];
                return (
                  <React.Fragment key={`d-p-${v}`}>
                    <path d={`M 59 ${slotCenters[v]} L 68.5 ${slotCenters[v]}`} fill="none" stroke="#a855f7" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                    <path d={`M 68.5 ${slotCenters[v]} L 68.5 ${slotCenters[p]} L 78 ${slotCenters[p]}`} fill="none" stroke="#a855f7" strokeWidth="1" pathLength="100" markerEnd="url(#arrowPurple)" className="anim-branch-fade" />
                  </React.Fragment>
                )
              })}

              {/* SPOTIFY */}
              {animStage >= 3 && (
                <>
                  <path d={`M 18 ${ySpotify} L 27.5 ${ySpotify}`} fill="none" stroke="#34d399" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                  {step4Mappings[1].vSlots.map(v => (
                    <path key={`s-v-${v}`} d={`M 27.5 ${ySpotify} L 27.5 ${slotCenters[v]} L 37 ${slotCenters[v]}`} fill="none" stroke="#34d399" strokeWidth="1" pathLength="100" markerEnd="url(#arrowGreen)" className="anim-branch-fade" />
                  ))}
                </>
              )}
              {animStage >= 4 && step4Mappings[1].vSlots.map((v, i) => {
                const p = step4Mappings[1].pSlots[i];
                return (
                  <React.Fragment key={`s-p-${v}`}>
                    <path d={`M 59 ${slotCenters[v]} L 68.5 ${slotCenters[v]}`} fill="none" stroke="#34d399" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                    <path d={`M 68.5 ${slotCenters[v]} L 68.5 ${slotCenters[p]} L 78 ${slotCenters[p]}`} fill="none" stroke="#34d399" strokeWidth="1" pathLength="100" markerEnd="url(#arrowGreen)" className="anim-branch-fade" />
                  </React.Fragment>
                )
              })}

              {/* VALORANT */}
              {animStage >= 5 && (
                <>
                  <path d={`M 18 ${yValorant} L 27.5 ${yValorant}`} fill="none" stroke="#f43f5e" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                  {step4Mappings[2].vSlots.map(v => (
                    <path key={`v-v-${v}`} d={`M 27.5 ${yValorant} L 27.5 ${slotCenters[v]} L 37 ${slotCenters[v]}`} fill="none" stroke="#f43f5e" strokeWidth="1" pathLength="100" markerEnd="url(#arrowRed)" className="anim-branch-fade" />
                  ))}
                </>
              )}
              {animStage >= 6 && step4Mappings[2].vSlots.map((v, i) => {
                const p = step4Mappings[2].pSlots[i];
                return (
                  <React.Fragment key={`v-p-${v}`}>
                    <path d={`M 59 ${slotCenters[v]} L 68.5 ${slotCenters[v]}`} fill="none" stroke="#f43f5e" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                    <path d={`M 68.5 ${slotCenters[v]} L 68.5 ${slotCenters[p]} L 78 ${slotCenters[p]}`} fill="none" stroke="#f43f5e" strokeWidth="1" pathLength="100" markerEnd="url(#arrowRed)" className="anim-branch-fade" />
                  </React.Fragment>
                )
              })}
            </>
          )}
        </svg>

        {/* COLUMN 1: APPS */}
        <div style={{ position: 'relative', width: '18%', transform: hasPlayed ? 'translateX(0)' : 'translateX(-100px)', opacity: hasPlayed ? 1 : 0, transition: 'all 0.8s ease' }}>
          {apps.map((app, i) => (
            <div key={app.id} style={{
              position: 'absolute', top: app.top, left: 0, right: 0, transform: `translateY(-50%) ${(step === 1 && animStage === i+1) || (step === 3 && animStage === i+1) || (step === 6 && (animStage === i*2+1 || animStage === i*2+2)) ? 'scale(1.05)' : 'scale(1)'}`,
              background: 'rgba(15, 23, 42, 0.9)', border: `2px solid ${app.color}`, borderRadius: '10px', padding: '0.6rem 0', textAlign: 'center',
              boxShadow: (step === 1 && animStage > i) || (step === 3 && animStage > i && i < 2) || (step === 6 && animStage > i*2) ? `0 0 15px ${app.color}66` : 'none',
              transition: 'all 0.3s ease'
            }}>
              <img src={app.icon} alt={app.name} style={{ width: '32px', height: '32px', marginBottom: '4px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{app.name}</div>
            </div>
          ))}

          {/* CHROME APP (Step 5+) */}
          <div style={{
            position: 'absolute', top: chromeApp.top, left: 0, right: 0, 
            transform: `translateY(-50%) ${step >= 5 ? 'scale(1)' : 'scale(0)'}`,
            background: 'rgba(15, 23, 42, 0.9)', border: `2px solid ${chromeApp.color}`, borderRadius: '10px', padding: '0.6rem 0', textAlign: 'center',
            boxShadow: step >= 5 ? `0 0 15px ${chromeApp.color}66` : 'none',
            opacity: step >= 5 ? 1 : 0, transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', pointerEvents: 'none'
          }}>
            <img src={chromeApp.icon} alt={chromeApp.name} style={{ width: '32px', height: '32px', marginBottom: '4px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{chromeApp.name}</div>
          </div>
        </div>

        {/* COLUMN 2: VIRTUAL RAM */}
        <div style={{ width: '22%', transform: step >= 4 ? 'translateY(0)' : 'translateY(-50px)', opacity: step >= 4 ? 1 : 0, pointerEvents: step >= 4 ? 'auto' : 'none', transition: 'all 0.6s' }}>
          <div style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', border: '2px dashed #a78bfa', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: '10%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold', color: '#a78bfa', textAlign: 'center' }}>
              VIRTUAL RAM<br/>(10 SLOTS)
            </div>
            {[...Array(10)].map((_, i) => {
              let owner = null;
              let isDrawingNow = false;
              let pageText = null;

              if (step >= 4) {
                if (step === 4) {
                  if (animStage > i) {
                     pageText = `Page ${i}`;
                     if (animStage === i + 1) isDrawingNow = true;
                  }
                } else if (step === 5) {
                  pageText = `Page ${i}`;
                  if ([7, 8, 9].includes(i) && animStage >= 2) { owner = { name: 'Chrome', color: '#facc15' }; if (animStage === 2) isDrawingNow = true; }
                } else if (step === 6) {
                  pageText = `Page ${i}`;
                  if ([7, 8, 9].includes(i)) { owner = { name: 'Chrome', color: '#facc15' }; }
                  else if (step4Mappings[0].vSlots.includes(i) && animStage >= 1) { owner = apps[0]; if (animStage === 1) isDrawingNow = true; }
                  else if (step4Mappings[1].vSlots.includes(i) && animStage >= 3) { owner = apps[1]; if (animStage === 3) isDrawingNow = true; }
                  else if (step4Mappings[2].vSlots.includes(i) && animStage >= 5) { owner = apps[2]; if (animStage === 5) isDrawingNow = true; }
                }
              }

              return (
                <div key={`vram-${i}`} style={{ height: '9%', borderBottom: i < 9 ? '1px solid #1e293b' : 'none', position: 'relative' }}>
                  {!owner && pageText && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                      {pageText}
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: owner ? owner.color : 'transparent',
                    opacity: owner ? 1 : 0, transition: `opacity ${owner ? '0.3s' : '0s'} ${isDrawingNow ? '0.8s' : '0s'}`
                  }}>
                    {owner && (
                      <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                        {owner.name}<span className="loading-dots"></span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 3: PHYSICAL RAM */}
        <div style={{ width: '22%', transform: hasPlayed ? 'translateX(0)' : 'translateX(100px)', opacity: hasPlayed ? 1 : 0, transition: 'all 0.8s ease' }}>
          <div style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', border: '2px solid #334155', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: '10%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold', color: '#cbd5e1', textAlign: 'center' }}>
              8GB PHYSICAL<br/>RAM (10 SLOTS)
            </div>
            
            {[...Array(10)].map((_, i) => {
              let owner = null;
              let isCorrupted = false;
              let isDrawingNow = false;
              let frameText = null;

              if (step === 1 || step === 2) {
                if (apps[0].slots.includes(i) && (step === 2 || animStage >= 1)) { owner = apps[0]; if (step === 1 && animStage === 1) isDrawingNow = true; }
                if (apps[1].slots.includes(i) && (step === 2 || animStage >= 2)) { owner = apps[1]; if (step === 1 && animStage === 2) isDrawingNow = true; }
                if (apps[2].slots.includes(i) && (step === 2 || animStage >= 3)) { owner = apps[2]; if (step === 1 && animStage === 3) isDrawingNow = true; }
              } else if (step === 3) {
                if (apps[0].slots.includes(i) && animStage >= 1) { owner = apps[0]; if (animStage === 1) isDrawingNow = true; }
                if (apps[2].slots.includes(i) && animStage >= 2) { owner = apps[2]; if (animStage === 2) isDrawingNow = true; }
                if (i === 6 && animStage >= 3) { owner = apps[1]; if (animStage === 3) isDrawingNow = true; } 
                if (i === 7 && animStage >= 4) { isCorrupted = true; } // Wait for arrow to hit!
              } else if (step >= 4) {
                if (step === 4) {
                  if (animStage > i) {
                     frameText = `Frame ${i}`;
                     if (animStage === i + 1) isDrawingNow = true;
                  }
                } else if (step === 5) {
                  frameText = `Frame ${i}`;
                  if (chromePhysical.includes(i) && animStage >= 3) {
                    owner = { name: 'Chrome', color: '#facc15' }; 
                    if (animStage === 3) isDrawingNow = true;
                  }
                } else if (step === 6) {
                  frameText = `Frame ${i}`;
                  if (chromePhysical.includes(i)) { owner = { name: 'Chrome', color: '#facc15' }; }
                  else if (step4Mappings[0].pSlots.includes(i) && animStage >= 2) { owner = apps[0]; if (animStage === 2) isDrawingNow = true; }
                  else if (step4Mappings[1].pSlots.includes(i) && animStage >= 4) { owner = apps[1]; if (animStage === 4) isDrawingNow = true; }
                  else if (step4Mappings[2].pSlots.includes(i) && animStage >= 6) { owner = apps[2]; if (animStage === 6) isDrawingNow = true; }
                }
              }
              
              const doShake = step === 3 && animStage >= 4 && i === 7;

              return (
                <div key={`pram-${i}`} style={{ height: '9%', borderBottom: i < 9 ? '1px solid #1e293b' : 'none', position: 'relative' }}>
                  {!owner && frameText && !isCorrupted && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                      {frameText}
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isCorrupted ? '#ef4444' : (owner ? owner.color : 'transparent'),
                    opacity: (owner || isCorrupted) ? 1 : 0, transition: `opacity ${(owner || isCorrupted) ? '0.3s' : '0s'} ${isDrawingNow ? '0.8s' : '0s'}`,
                    animation: doShake ? 'shake 0.4s infinite' : ''
                  }}>
                    {owner && !isCorrupted && (
                      <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                        {owner.name}<span className="loading-dots"></span>
                      </div>
                    )}
                    {isCorrupted && <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '1px' }}>CORRUPTED!</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FOOTER TEXT */}
      <div style={{ marginTop: '2rem', padding: '1.2rem', borderRadius: '12px', height: '110px', display: 'flex', alignItems: 'center', zIndex: 10, background: step === 3 ? 'rgba(239, 68, 68, 0.1)' : (step === 4 ? 'rgba(167, 139, 250, 0.1)' : (step === 6 ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255,255,255,0.05)')), borderLeft: `4px solid ${step === 3 ? '#ef4444' : (step === 4 ? '#a78bfa' : (step === 6 ? '#34d399' : '#38bdf8'))}`, opacity: hasPlayed ? 1 : 0, transition: 'all 0.5s' }}>
        <p style={{ margin: 0, fontSize: '1rem', color: '#e2e8f0', lineHeight: '1.6' }}>
          {step === 0 && "Welcome to the Direct Memory Access architecture. When you are ready, press Next to see how programs access RAM."}
          {step === 1 && "In early OS architectures, apps wrote directly to specific hardware addresses. When everyone stayed in their lane, it worked fine."}
          {step === 2 && "But there are flaws. Because there are no physical boundaries or checks, any program can technically write to any address in the RAM."}
          {step === 3 && <span style={{ color: '#fca5a5' }}><strong>FATAL ERROR:</strong> Spotify had a bug and wrote data to an address it didn't own. It physically overwrote Valorant's memory, causing the whole system to crash!</span>}
          {step === 4 && "To fix this, Virtual Memory divides RAM into chunks called Pages (in Virtual RAM) and Frames (in Physical RAM)."}
          {step === 5 && "Let's assume we already have Chrome running safely in its own isolated Pages and Frames."}
          {step === 6 && "Now if we run our apps, the OS gives every app an isolated 'Virtual RAM' starting from index 0. The hardware MMU strictly maps these sandboxes into fragmented Physical RAM behind the scenes, blocking apps from ever touching each other."}
        </p>
      </div>

      <style>{`
        @keyframes drawTrunk {
          from { stroke-dashoffset: 100; stroke-dasharray: 100; }
          to { stroke-dashoffset: 0; stroke-dasharray: 100; }
        }
        @keyframes drawBranch {
          from { stroke-dashoffset: 100; stroke-dasharray: 100; opacity: 0; }
          to { stroke-dashoffset: 0; stroke-dasharray: 100; opacity: 1; }
        }
        @keyframes fadeOutPath {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes dots {
          0% { content: ''; }
          25% { content: '.'; }
          50% { content: '..'; }
          75% { content: '...'; }
        }
        @keyframes blinkWarning {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 40px rgba(239, 68, 68, 0.4); }
          50% { opacity: 0.7; transform: scale(0.97); box-shadow: 0 0 15px rgba(239, 68, 68, 0.1); }
        }

        .anim-trunk-fade {
          stroke-dasharray: 100; stroke-dashoffset: 100;
          animation: drawTrunk 0.4s linear forwards, fadeOutPath 0.3s ease 1.5s forwards;
        }
        .anim-branch-fade {
          stroke-dasharray: 100; stroke-dashoffset: 100; opacity: 0;
          animation: drawBranch 0.4s linear 0.4s forwards, fadeOutPath 0.3s ease 1.5s forwards;
        }
        
        .anim-trunk {
          stroke-dasharray: 100; stroke-dashoffset: 100;
          animation: drawTrunk 0.4s linear forwards;
        }
        .anim-branch {
          stroke-dasharray: 100; stroke-dashoffset: 100; opacity: 0;
          animation: drawBranch 0.4s linear 0.4s forwards;
        }

        .loading-dots::after {
          content: '';
          animation: dots 1.5s infinite steps(1);
        }
        .blink-warning {
          animation: blinkWarning 1.5s infinite ease-in-out;
        }

        .btn-refresh:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.05);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        }
        .btn-refresh:active {
          transform: scale(0.95);
        }
        .btn-refresh svg {
          transition: transform 0.4s ease;
        }
        .btn-refresh:hover svg {
          transform: rotate(180deg);
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
        }
      `}</style>
    </div>
  );
}

const sideBtnStyle = (active, isNext = false) => ({
  background: active ? (isNext ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.1)') : 'rgba(255,255,255,0.02)',
  color: active ? (isNext ? '#38bdf8' : '#fff') : '#475569',
  border: `1px solid ${active ? (isNext ? '#38bdf8' : 'rgba(255,255,255,0.2)') : 'transparent'}`,
  borderRadius: '50%', width: '48px', height: '48px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: active ? 'pointer' : 'not-allowed',
  transition: 'all 0.2s',
  boxShadow: active && isNext ? '0 0 15px rgba(56, 189, 248, 0.3)' : 'none'
});


const virtualBoxStyle = (color) => ({
  background: `${color}22`, border: `1px solid ${color}55`, borderRadius: '6px', padding: '8px',
  fontSize: '0.8rem', color: '#fff', width: '100%', textAlign: 'center', marginBottom: '10px'
});

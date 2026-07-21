import React, { useState, useEffect } from 'react';
import discordLogo from '../assets/Discord_Logo.png?url';
import spotifyLogo from '../assets/Spotify_Logo.png?url';
import valorantLogo from '../assets/Valorant_Logo.png?url';
import chromeLogo from '../assets/Chrome_Logo.png?url';

export default function SwapVisualizer() {
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
    if (step === 4) {
      const t1 = setTimeout(() => setAnimStage(1), 500);  // Discord -> Disk
      const t2 = setTimeout(() => setAnimStage(2), 2500); // Chrome -> RAM
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [step, animTrigger]);

  const handlePlay = () => {
    setHasPlayed(true);
    setTimeout(() => setStep(0), 100);
  };

  const handleNext = () => setStep((s) => Math.min(4, s + 1));
  const handleBack = () => setStep((s) => Math.max(0, s - 1));
  const handleRefresh = () => setAnimTrigger((t) => t + 1);

  const slotCenters = [...Array(10)].map((_, i) => 14.5 + i * 9);

  const discordSlots = [0, 1, 2];
  const spotifySlots = [3, 4, 5];
  const valorantSlots = [6, 7, 8, 9];
  const chromeSlots = [0, 1, 2]; 

  const yDiscord = 15;   
  const ySpotify = 40;   
  const yValorant = 65;  
  const yChrome = 90;    

  const apps = [
    { id: 'discord', icon: discordLogo, name: 'Discord', color: '#a855f7', top: `${yDiscord}%`, slots: discordSlots },
    { id: 'spotify', icon: spotifyLogo, name: 'Spotify', color: '#34d399', top: `${ySpotify}%`, slots: spotifySlots },
    { id: 'valorant', icon: valorantLogo, name: 'Valorant', color: '#f43f5e', top: `${yValorant}%`, slots: valorantSlots }
  ];
  const chromeApp = { id: 'chrome', icon: chromeLogo, name: 'Chrome', color: '#facc15', top: `${yChrome}%`, slots: chromeSlots };

  const APP_L = step >= 2 ? 5 : 15;
  const RAM_L = step >= 2 ? 35 : 55;
  const SWAP_L = 70;
  
  const APP_R = APP_L + 18; 
  const RAM_R = RAM_L + 22;

  const SPLIT_X = APP_R + (RAM_L - APP_R) / 2;
  const SWAP_SPLIT_X = RAM_R + (SWAP_L - RAM_R) / 2;

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
        background: step === 4 ? 'radial-gradient(circle, rgba(250, 204, 21, 0.15) 0%, transparent 60%)' :
                    'radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, transparent 60%)',
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
        <button onClick={handleRefresh} className="btn-refresh">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>
      </div>

      {/* SIDE CONTROLS */}
      <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 30, opacity: hasPlayed ? 1 : 0, transition: 'all 0.8s' }}>
        <button onClick={handleBack} disabled={step <= 0} className={`side-btn ${step > 0 ? 'active' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      </div>
      <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 30, opacity: hasPlayed ? 1 : 0, transition: 'all 0.8s' }}>
        <button onClick={handleNext} disabled={step === 4} className={`side-btn ${step < 4 ? 'active next' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <div style={{ zIndex: 10, position: 'relative', marginBottom: '1rem', opacity: hasPlayed ? 1 : 0, transition: 'opacity 0.5s' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '2px', textTransform: 'uppercase' }}>Memory Capacity Simulator</div>
        <h4 style={{ margin: '5px 0 0 0', fontSize: '1.4rem', color: '#fff', minHeight: '32px' }}>
          {step === 0 && "System Booted"}
          {step === 1 && "Memory Filled (100% Usage)"}
          {step === 2 && "Insufficient Memory (Out of RAM)"}
          {step === 3 && "Idle Application Detected"}
          {step === 4 && "Swapping / Demand Paging"}
        </h4>
      </div>

      <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'space-between', zIndex: 10, minHeight: '450px' }}>
        
        {/* SVG PATHS */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
          <defs>
            <marker id="arrowPurple" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#a855f7" /></marker>
            <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#34d399" /></marker>
            <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#f43f5e" /></marker>
            <marker id="arrowYellow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#facc15" /></marker>
            <marker id="arrowGray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8" /></marker>
          </defs>

          {/* STATE 1: Fill RAM */}
          {step === 1 && (
            <>
              {animStage >= 1 && (
                <>
                  <path d={`M ${APP_R} ${yDiscord} L ${SPLIT_X} ${yDiscord}`} fill="none" stroke="#a855f7" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                  {apps[0].slots.map(s => (
                    <path key={s} d={`M ${SPLIT_X} ${yDiscord} L ${SPLIT_X} ${slotCenters[s]} L ${RAM_L} ${slotCenters[s]}`} fill="none" stroke="#a855f7" strokeWidth="1" pathLength="100" markerEnd="url(#arrowPurple)" className="anim-branch-fade" />
                  ))}
                </>
              )}
              {animStage >= 2 && (
                <>
                  <path d={`M ${APP_R} ${ySpotify} L ${SPLIT_X} ${ySpotify}`} fill="none" stroke="#34d399" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                  {apps[1].slots.map(s => (
                    <path key={s} d={`M ${SPLIT_X} ${ySpotify} L ${SPLIT_X} ${slotCenters[s]} L ${RAM_L} ${slotCenters[s]}`} fill="none" stroke="#34d399" strokeWidth="1" pathLength="100" markerEnd="url(#arrowGreen)" className="anim-branch-fade" />
                  ))}
                </>
              )}
              {animStage >= 3 && (
                <>
                  <path d={`M ${APP_R} ${yValorant} L ${SPLIT_X} ${yValorant}`} fill="none" stroke="#f43f5e" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                  {apps[2].slots.map(s => (
                    <path key={s} d={`M ${SPLIT_X} ${yValorant} L ${SPLIT_X} ${slotCenters[s]} L ${RAM_L} ${slotCenters[s]}`} fill="none" stroke="#f43f5e" strokeWidth="1" pathLength="100" markerEnd="url(#arrowRed)" className="anim-branch-fade" />
                  ))}
                </>
              )}
            </>
          )}

          {/* STATE 4: Swapping */}
          {step === 4 && (
            <>
              {/* Discord traces from RAM to SWAP */}
              {animStage >= 1 && apps[0].slots.map((s, i) => (
                <React.Fragment key={`ram-disk-${s}`}>
                  <path d={`M ${RAM_R} ${slotCenters[s]} L ${SWAP_SPLIT_X} ${slotCenters[s]}`} fill="none" stroke="#94a3b8" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                  <path d={`M ${SWAP_SPLIT_X} ${slotCenters[s]} L ${SWAP_SPLIT_X} ${slotCenters[s]} L ${SWAP_L} ${slotCenters[s]}`} fill="none" stroke="#94a3b8" strokeWidth="1" pathLength="100" markerEnd="url(#arrowGray)" className="anim-branch-fade" />
                </React.Fragment>
              ))}

              {/* Chrome traces from Apps to RAM */}
              {animStage >= 2 && (
                <>
                  <path d={`M ${APP_R} ${yChrome} L ${SPLIT_X} ${yChrome}`} fill="none" stroke="#facc15" strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
                  {chromeApp.slots.map((s, i) => (
                    <path key={`chrome-${s}`} d={`M ${SPLIT_X} ${yChrome} L ${SPLIT_X} ${slotCenters[s]} L ${RAM_L} ${slotCenters[s]}`} fill="none" stroke="#facc15" strokeWidth="1" pathLength="100" markerEnd="url(#arrowYellow)" className="anim-branch-fade" />
                  ))}
                </>
              )}
            </>
          )}
        </svg>

        {/* COLUMN 1: APPS */}
        <div style={{ position: 'absolute', left: `${APP_L}%`, width: '18%', height: '100%', transition: 'all 0.8s ease', opacity: hasPlayed ? 1 : 0 }}>
          {apps.map((app, i) => {
            // If Discord gets swapped to disk in step 3, grey it out
            const isSwapped = step >= 3 && app.id === 'discord';
            return (
              <div key={app.id} style={{
                position: 'absolute', top: app.top, left: 0, right: 0, transform: `translateY(-50%) ${step === 1 && animStage === i+1 ? 'scale(1.05)' : 'scale(1)'}`,
                background: 'rgba(15, 23, 42, 0.9)', border: `2px solid ${isSwapped ? '#475569' : app.color}`, borderRadius: '10px', padding: '0.6rem 0', textAlign: 'center',
                boxShadow: step === 1 && animStage > i ? `0 0 15px ${app.color}66` : 'none',
                opacity: isSwapped ? 0.4 : 1, filter: isSwapped ? 'grayscale(100%)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                <img src={app.icon} alt={app.name} style={{ width: '32px', height: '32px', marginBottom: '4px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{app.name}{isSwapped ? ' (PAUSED)' : ''}</div>
              </div>
            );
          })}
          
          {/* Chrome App (Appears in Step 2) */}
          <div style={{
            position: 'absolute', top: chromeApp.top, left: 0, right: 0, transform: `translateY(-50%) ${step === 4 && animStage === 2 ? 'scale(1.05)' : 'scale(1)'}`,
            background: 'rgba(15, 23, 42, 0.9)', border: `2px solid ${chromeApp.color}`, borderRadius: '10px', padding: '0.6rem 0', textAlign: 'center',
            boxShadow: step === 4 && animStage >= 2 ? `0 0 15px ${chromeApp.color}66` : 'none',
            opacity: step >= 2 ? 1 : 0, transition: 'all 0.8s ease'
          }}>
            <img src={chromeApp.icon} alt={chromeApp.name} style={{ width: '32px', height: '32px', marginBottom: '4px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{chromeApp.name}</div>
          </div>
        </div>

        {/* COLUMN 2: PHYSICAL RAM */}
        <div style={{ position: 'absolute', left: `${RAM_L}%`, width: '22%', height: '100%', transform: hasPlayed ? 'translateX(0)' : 'translateX(100px)', opacity: hasPlayed ? 1 : 0, transition: 'all 0.8s ease' }}>
          <div style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', border: '2px solid #334155', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: '10%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold', color: '#e2e8f0', textAlign: 'center' }}>
              PHYSICAL RAM<br/>(10 SLOTS)
            </div>
            {[...Array(10)].map((_, i) => {
              let owner = null;
              let isDrawingNow = false;

              if (step === 1 || step === 2 || step === 3) {
                if (apps[0].slots.includes(i) && (step >= 2 || animStage >= 1)) { owner = apps[0]; if (step===1 && animStage === 1) isDrawingNow = true; }
                if (apps[1].slots.includes(i) && (step >= 2 || animStage >= 2)) { owner = apps[1]; if (step===1 && animStage === 2) isDrawingNow = true; }
                if (apps[2].slots.includes(i) && (step >= 2 || animStage >= 3)) { owner = apps[2]; if (step===1 && animStage === 3) isDrawingNow = true; }
              } else if (step === 4) {
                if (apps[0].slots.includes(i) && animStage < 2) { 
                   owner = apps[0];
                   if (animStage === 1) isDrawingNow = false; 
                }
                if (apps[1].slots.includes(i)) { owner = apps[1]; }
                if (apps[2].slots.includes(i)) { owner = apps[2]; }
                
                if (chromeApp.slots.includes(i) && animStage >= 2) { owner = chromeApp; if (animStage === 2) isDrawingNow = true; }
              }

              const isLeaving = step === 4 && animStage >= 1 && apps[0].slots.includes(i) && animStage < 2;

              return (
                <div key={`pram-${i}`} className={isDrawingNow ? 'fade-block-delayed' : isLeaving ? 'fade-block-out' : 'fade-block'} style={{ 
                  height: '9%', borderBottom: i < 9 ? '1px solid #1e293b' : 'none', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: owner ? owner.color : 'transparent', transition: 'background 0.3s'
                }}>
                  {owner && (
                    <>
                      <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                        {owner.name}
                        {owner.name !== 'Discord' || step !== 3 ? <span className="loading-dots"></span> : null}
                      </div>
                      {owner.name === 'Discord' && step === 3 && <div className="floating-zzz">zzZ</div>}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 3: HARD DRIVE (SWAP FILE) */}
        <div style={{ position: 'absolute', left: `${SWAP_L}%`, width: '22%', height: '100%', transform: step >= 2 ? 'translateY(0)' : 'translateY(100px)', opacity: step >= 2 ? 1 : 0, transition: 'all 0.8s ease' }}>
          <div style={{ background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)', border: '2px dashed #94a3b8', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: '10%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold', color: '#94a3b8', textAlign: 'center' }}>
              HARD DRIVE<br/>(SWAP FILE)
            </div>
            {[...Array(10)].map((_, i) => {
              let owner = null;
              let isDrawingNow = false;

              if (step === 4 && animStage >= 1) {
                if ([0, 1, 2].includes(i)) { owner = apps[0]; if (animStage === 1) isDrawingNow = true; }
              }

              return (
                <div key={`swap-${i}`} className={isDrawingNow ? 'fade-block-delayed' : 'fade-block'} style={{ 
                  height: '9%', borderBottom: i < 9 ? '1px solid #1e293b' : 'none', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: owner ? '#581c87' : 'transparent', transition: 'background 0.3s'
                }}>
                  {owner && (
                    <>
                      <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                        {owner.name}
                      </div>
                      <div className="floating-zzz">zzZ</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* FOOTER TEXT */}
      <div style={{ marginTop: '2rem', padding: '1.2rem', borderRadius: '12px', height: '110px', display: 'flex', alignItems: 'center', zIndex: 10, background: step === 2 ? 'rgba(239, 68, 68, 0.1)' : (step === 3 ? 'rgba(167, 139, 250, 0.1)' : (step === 4 ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255,255,255,0.05)')), borderLeft: `4px solid ${step === 2 ? '#ef4444' : (step === 3 ? '#a78bfa' : (step === 4 ? '#34d399' : '#38bdf8'))}`, opacity: hasPlayed ? 1 : 0, transition: 'all 0.5s' }}>
        <p style={{ margin: 0, fontSize: '1rem', color: '#e2e8f0', lineHeight: '1.6' }}>
          {step === 0 && "Welcome to the Demand Paging simulator. Let's see what happens when we run out of memory."}
          {step === 1 && "Discord, Spotify, and Valorant have completely filled up our Physical RAM."}
          {step === 2 && "Oh no! We just launched Google Chrome, which demands multiple memory slots, but our Physical RAM is 100% full! Older architectures would crash or throw an 'Out of Memory' error."}
          {step === 3 && "Luckily, the Virtual Memory Manager is running. It constantly monitors apps and notices that Discord is currently inactive in the background."}
          {step === 4 && "The OS 'swaps' the inactive Discord program out into the Hard Drive's Swap File. This frees up Physical RAM for Chrome to use immediately!"}
        </p>
      </div>

      <style>{`
        .btn-play {
          background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%);
          border: none; border-radius: 50%; width: 100px; height: 100px;
          color: #fff; fontSize: 1.2rem; fontWeight: bold; cursor: pointer; 
          box-shadow: 0 0 30px rgba(56, 189, 248, 0.5);
          transition: transform 0.3s;
        }
        .btn-play:hover { transform: scale(1.05); }
        
        .btn-refresh {
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); 
          border-radius: 8px; padding: 8px; color: #fff; cursor: pointer; 
          display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .btn-refresh:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.05); box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        }
        .btn-refresh:active { transform: scale(0.95); }
        .btn-refresh svg { transition: transform 0.4s ease; }
        .btn-refresh:hover svg { transform: rotate(180deg); }

        .side-btn {
          background: rgba(255,255,255,0.02); color: #475569;
          border: 1px solid transparent; border-radius: 50%; width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; cursor: not-allowed;
        }
        .side-btn.active {
          background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); cursor: pointer;
        }
        .side-btn.active.next {
          background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid #38bdf8;
        }
        .side-btn.active.next:hover {
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
        }

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
        @keyframes fadeInBlock {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOutBlock {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        .anim-trunk-fade {
          stroke-dasharray: 100; stroke-dashoffset: 100;
          animation: drawTrunk 0.4s linear forwards, fadeOutPath 0.3s ease 1.5s forwards;
        }
        .anim-branch-fade {
          stroke-dasharray: 100; stroke-dashoffset: 100; opacity: 0;
          animation: drawBranch 0.4s linear 0.4s forwards, fadeOutPath 0.3s ease 1.5s forwards;
        }
        
        .fade-block-delayed { opacity: 0; animation: fadeInBlock 0.3s ease 0.8s forwards; }
        .fade-block { opacity: 1; }
        .fade-block-out { opacity: 1; animation: fadeOutBlock 0.5s ease 0.8s forwards; }
        
        @keyframes dots {
          0% { content: ''; }
          25% { content: '.'; }
          50% { content: '..'; }
          75% { content: '...'; }
        }
        .loading-dots::after {
          content: '';
          animation: dots 1.5s infinite steps(1);
        }
        
        @keyframes float-zzz {
          0% { transform: translate(0, 0) scale(0.8); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(15px, -15px) scale(1.2); opacity: 0; }
        }
        .floating-zzz {
          position: absolute;
          top: -2px;
          right: 5px;
          color: #c084fc;
          font-weight: 900;
          font-size: 0.95rem;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
          animation: float-zzz 2s infinite ease-in;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

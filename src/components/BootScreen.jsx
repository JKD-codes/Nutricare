import { useEffect, useState } from 'react';
import { Droplets } from 'lucide-react';

export default function BootScreen({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 1.8 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1800);

    // Unmount completely after 2.3 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#080c16',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.5s ease-in-out',
      pointerEvents: 'none',
    }}>
      {/* Ambient background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease',
        animation: 'pulseGlowBoot 2s infinite',
      }} />

      {/* Logo container */}
      <div style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        animation: 'slideUpFade 0.6s ease-out forwards',
      }}>
        {/* Logo icon */}
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'linear-gradient(135deg, #10b981, #0d9488)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
          position: 'relative',
        }}>
          <Droplets style={{ width: 40, height: 40, color: 'white', zIndex: 2 }} />
          {/* Ripple effect */}
          <div style={{
            position: 'absolute', inset: -4, borderRadius: 28,
            border: '2px solid rgba(16, 185, 129, 0.5)',
            animation: 'ripple 1.5s ease-out infinite',
          }} />
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '2rem', fontWeight: 800, color: 'white',
            letterSpacing: '-0.02em', marginBottom: 8,
          }}>
            NutriCare
          </h1>
          <div style={{
            fontSize: '0.875rem', fontWeight: 500, color: '#10b981',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            Smart Nutrition
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; border-width: 0px; }
        }
        @keyframes pulseGlowBoot {
          0%, 100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, BarChart3, Droplets, Menu, X, RotateCcw, Activity, Heart, Sparkles } from 'lucide-react';
import { resetAll } from '../utils/storage';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/shopping', label: 'Shopping List', icon: ShoppingCart },
  { path: '/report', label: 'Weekly Report', icon: BarChart3 },
];

const conditionConfig = {
  PCOS: { gradient: 'linear-gradient(135deg, #a855f7, #ec4899)', icon: Sparkles, label: 'PCOS' },
  Diabetes: { gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)', icon: Activity, label: 'Diabetes' },
  Hypertension: { gradient: 'linear-gradient(135deg, #f43f5e, #ef4444)', icon: Heart, label: 'Hypertension' }
};

export default function Layout({ children, profile, condition }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (confirm('Reset all data and start over?')) {
      resetAll();
      window.location.href = '/';
    }
  };

  const goHome = () => navigate('/dashboard');
  const condCfg = conditionConfig[condition] || conditionConfig.PCOS;

  const NavContent = ({ mobile = false }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <button
        onClick={() => { goHome(); if (mobile) setSidebarOpen(false); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          margin: '0 auto 32px', padding: 0, border: 'none',
          background: 'none', cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg, #10b981, #0d9488)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
        }}>
          <Droplets style={{ width: 20, height: 20, color: 'white' }} />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
          NutriCare
        </span>
      </button>

      {/* Condition Badge */}
      {condition && (
        <div style={{
          marginBottom: 24, padding: '14px 16px', borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.04)',
          background: 'rgba(255,255,255,0.02)',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: condCfg.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}>
              <condCfg.icon style={{ width: 16, height: 16, color: 'white' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.625rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                Managing
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white' }}>{condCfg.label}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); if (mobile) setSidebarOpen(false); }}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                padding: '14px 16px', borderRadius: 12,
                fontSize: '0.875rem', fontWeight: 600,
                border: 'none', cursor: 'pointer',
                transition: 'all 0.2s',
                background: active ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                color: active ? '#10b981' : '#94a3b8',
                boxShadow: active ? 'inset 0 1px 4px rgba(16, 185, 129, 0.05)' : 'none',
              }}
            >
              <item.icon style={{ width: 16, height: 16, flexShrink: 0 }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ paddingTop: 20, marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {profile && (
          <div style={{
            padding: '8px 12px', fontSize: '0.75rem', textAlign: 'center',
            color: '#64748b', background: 'rgba(255,255,255,0.01)', borderRadius: 8,
          }}>
            {profile.personalInfo.gender === 'female' ? '♀' : '♂'} {profile.personalInfo.age}y · {profile.personalInfo.weight}kg · {profile.personalInfo.height}cm
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '14px 16px', borderRadius: 12,
            fontSize: '0.875rem', fontWeight: 500,
            border: 'none', cursor: 'pointer',
            background: 'transparent', color: '#94a3b8',
            transition: 'all 0.2s',
          }}
        >
          <RotateCcw style={{ width: 16, height: 16 }} /> Start Over
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#080c16', display: 'flex' }}>
      {/* Desktop sidebar */}
      <aside style={{
        width: 260, flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.04)',
        position: 'sticky', top: 0, height: '100vh',
        padding: 20, overflowY: 'auto',
        display: 'none',
      }} className="lg-sidebar">
        <NavContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 40,
              animation: 'fadeIn 0.15s ease',
            }}
          />
          <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0,
            width: 260, maxWidth: '75vw',
            background: '#0c1120',
            borderRight: '1px solid rgba(148, 163, 184, 0.06)',
            zIndex: 50,
            animation: 'slideInLeft 0.25s ease',
            overflowY: 'auto',
            padding: '20px 16px',
          }}>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#64748b', padding: 4,
              }}
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
            <NavContent mobile />
          </div>
        </>
      )}

      {/* Mobile top bar */}
      <div className="mobile-topbar" style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 30,
        background: 'rgba(8, 12, 22, 0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', height: 64, width: '100%',
        }}>
          <button onClick={goHome} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'none', border: 'none', cursor: 'pointer',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #10b981, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
            }}>
              <Droplets style={{ width: 16, height: 16, color: 'white' }} />
            </div>
            <span style={{ fontWeight: 700, color: 'white', fontSize: '1rem', letterSpacing: '-0.02em' }}>NutriCare</span>
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              color: '#94a3b8', border: 'none', cursor: 'pointer',
            }}
          >
            <Menu style={{ width: 20, height: 20 }} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto' }} className="main-content">
        <div className="main-inner">{children}</div>
      </main>

      <style>{`
        .lg-sidebar { display: none !important; }
        .mobile-topbar { display: flex !important; }
        .main-inner { padding-top: 48px; }
        @media (min-width: 1024px) {
          .lg-sidebar { display: block !important; }
          .mobile-topbar { display: none !important; }
          .main-content { max-height: 100vh; }
          .main-inner { padding-top: 0; }
        }
      `}</style>
    </div>
  );
}

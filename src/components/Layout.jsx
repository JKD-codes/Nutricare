import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, BarChart3, Droplets, Menu, X, RotateCcw, Activity, Heart, Sparkles, Home } from 'lucide-react';
import { resetAll } from '../utils/storage';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/shopping', label: 'Shopping List', icon: ShoppingCart },
  { path: '/report', label: 'Weekly Report', icon: BarChart3 },
];

const conditionConfig = {
  PCOS: { gradient: 'from-purple-500 to-pink-500', icon: Sparkles, label: 'PCOS' },
  Diabetes: { gradient: 'from-blue-500 to-cyan-500', icon: Activity, label: 'Diabetes' },
  Hypertension: { gradient: 'from-rose-500 to-red-500', icon: Heart, label: 'Hypertension' }
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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <button
        onClick={() => { goHome(); if (mobile) setSidebarOpen(false); }}
        className="flex items-center gap-3 mx-auto mb-8 hover:opacity-80 transition-opacity"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">NutriCare</span>
      </button>

      {/* Condition */}
      {condition && (
        <div className="mb-6 px-4 py-3 rounded-2xl border border-white/[0.04] bg-white/[0.02] text-center">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${condCfg.gradient} flex items-center justify-center shadow-lg`}>
              <condCfg.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[0.65rem] text-slate-500 uppercase tracking-wider mb-0.5">Managing</div>
              <div className="text-sm font-bold text-white">{condCfg.label}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); if (mobile) setSidebarOpen(false); }}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'bg-primary/10 text-primary shadow-inner shadow-primary/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="pt-5 mt-5 border-t border-white/[0.04] space-y-2">
        {profile && (
          <div className="px-3 py-2 text-xs text-center text-slate-500 bg-white/[0.01] rounded-lg">
            {profile.personalInfo.gender === 'female' ? '♀' : '♂'} {profile.personalInfo.age}y · {profile.personalInfo.weight}kg · {profile.personalInfo.height}cm
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/[0.04] transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Start Over
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080c16] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[260px] shrink-0 border-r border-white/[0.04] sticky top-0 h-screen p-5">
        <NavContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <>
          <div className="mobile-nav-overlay lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="mobile-nav-drawer lg:hidden">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
            <NavContent mobile />
          </div>
        </>
      )}

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#080c16]/90 backdrop-blur-lg border-b border-white/[0.04]">
        <div className="flex items-center justify-between px-5 h-16">
          <button onClick={goHome} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-base tracking-tight">NutriCare</span>
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.04] text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-y-auto lg:max-h-screen">
        <div className="pt-12 lg:pt-0">{children}</div>
      </main>
    </div>
  );
}

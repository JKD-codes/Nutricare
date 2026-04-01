import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, BarChart3, Droplets, Menu, X, LogOut, Activity, Heart, Sparkles } from 'lucide-react';
import { resetAll } from '../utils/storage';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/shopping', label: 'Shopping List', icon: ShoppingCart },
  { path: '/report', label: 'Weekly Report', icon: BarChart3 },
];

const conditionConfig = {
  PCOS: { gradient: 'from-purple-500 to-pink-500', icon: Sparkles, label: 'PCOS Management' },
  Diabetes: { gradient: 'from-blue-500 to-cyan-500', icon: Activity, label: 'Diabetes Care' },
  Hypertension: { gradient: 'from-rose-500 to-red-500', icon: Heart, label: 'BP Management' }
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

  const condCfg = conditionConfig[condition] || conditionConfig.PCOS;

  const SidebarContent = ({ mobile = false }) => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 ${mobile ? 'mb-8' : 'p-6 border-b border-white/5'}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-white">NutriCare<span className="text-primary">AI</span></span>
          <div className="text-[0.65rem] text-slate-500 font-medium tracking-wide">PERSONALIZED NUTRITION</div>
        </div>
      </div>

      {/* Condition badge */}
      {condition && (
        <div className={`${mobile ? 'mb-6' : 'mx-5 my-5'}`}>
          <div className={`p-3.5 rounded-2xl bg-gradient-to-r ${condCfg.gradient} bg-opacity-5 border border-white/5`}
               style={{ background: `linear-gradient(135deg, rgba(16,185,129,0.06), rgba(14,165,233,0.04))` }}>
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${condCfg.gradient} flex items-center justify-center`}>
                <condCfg.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[0.65rem] text-slate-500 font-medium uppercase tracking-wider">Managing</div>
                <div className="font-semibold text-white text-sm">{condCfg.label}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className={`space-y-1 ${mobile ? 'mb-8' : 'flex-1 px-3 py-3'}`}>
        <div className="section-label px-4 mb-3">MENU</div>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); if (mobile) setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] ${active ? 'text-primary' : ''}`} />
              {item.label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </nav>

      {/* User info */}
      <div className={`${mobile ? 'mt-auto pt-6 border-t border-white/5' : 'p-4 border-t border-white/5'}`}>
        {profile && (
          <div className="px-3 py-2.5 mb-2 rounded-xl bg-white/[0.02]">
            <div className="text-xs font-medium text-slate-300">Your Profile</div>
            <div className="text-[0.7rem] text-slate-500 mt-0.5">
              {profile.personalInfo.gender === 'female' ? '♀' : '♂'} {profile.personalInfo.age}y • {profile.personalInfo.weight}kg • {profile.personalInfo.height}cm
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Reset & Start Over
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex w-[260px] flex-col border-r border-white/5 bg-[#0c1120]/80 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile overlay + drawer */}
      {sidebarOpen && (
        <>
          <div className="mobile-nav-overlay lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="mobile-nav-drawer lg:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent mobile />
          </div>
        </>
      )}

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">NutriCare<span className="text-primary">AI</span></span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/5 text-slate-400"
          >
            <Menu className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto lg:max-h-screen">
        <div className="pt-14 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}

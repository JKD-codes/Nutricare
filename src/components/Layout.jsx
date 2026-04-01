import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, BarChart3, Droplets, Menu, X, ChefHat, LogOut } from 'lucide-react';
import { resetAll } from '../utils/storage';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/shopping', label: 'Shopping List', icon: ShoppingCart },
  { path: '/report', label: 'Weekly Report', icon: BarChart3 },
];

const conditionColors = {
  PCOS: 'from-purple-500 to-pink-500',
  Diabetes: 'from-blue-500 to-cyan-500',
  Hypertension: 'from-rose-500 to-red-500'
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

  return (
    <div className="min-h-screen bg-surface-dark flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800 bg-surface-dark/50">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">NutriCare<span className="text-primary">AI</span></span>
          </div>
        </div>

        {/* Condition badge */}
        {condition && (
          <div className="px-6 py-4">
            <div className={`px-3 py-2 rounded-xl bg-gradient-to-r ${conditionColors[condition] || 'from-emerald-500 to-teal-500'} bg-opacity-10`}
                 style={{ background: `linear-gradient(135deg, rgba(16,185,129,0.1), rgba(14,165,233,0.1))` }}>
              <div className="text-xs text-slate-400 mb-0.5">Managing</div>
              <div className="font-semibold text-white text-sm">{condition}</div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User info + Logout */}
        <div className="p-4 border-t border-slate-800">
          {profile && (
            <div className="px-4 py-2 mb-2">
              <div className="text-sm text-slate-400">
                {profile.personalInfo.age}y, {profile.personalInfo.weight}kg
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Reset & Start Over
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-surface-dark/90 backdrop-blur border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">NutriCare<span className="text-primary">AI</span></span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 p-2">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav dropdown */}
        {sidebarOpen && (
          <div className="px-4 pb-4 space-y-1 animate-fade-in">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active ? 'bg-primary/10 text-primary' : 'text-slate-400'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400"
            >
              <LogOut className="w-5 h-5" />
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto lg:max-h-screen">
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}

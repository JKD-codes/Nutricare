import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Droplets, ArrowRight, Sparkles, Shield, ChartBar, Utensils, ChevronRight } from 'lucide-react';

const conditions = [
  {
    id: 'PCOS', name: 'PCOS', full: 'Polycystic Ovary Syndrome',
    icon: Sparkles, color: 'from-purple-500 to-pink-500',
    desc: 'Hormone balance, anti-inflammatory diet, insulin management',
    features: ['Low GI carbs', 'Anti-inflammatory foods', 'Inositol-rich meals', 'Hormone support']
  },
  {
    id: 'Diabetes', name: 'Diabetes Type 2', full: 'Type 2 Diabetes Mellitus',
    icon: Activity, color: 'from-blue-500 to-cyan-500',
    desc: 'Blood sugar control, consistent carb management, weight support',
    features: ['Glycemic control', 'Carb counting', 'Plate method', 'Medication support']
  },
  {
    id: 'Hypertension', name: 'Hypertension', full: 'High Blood Pressure',
    icon: Heart, color: 'from-rose-500 to-red-500',
    desc: 'DASH diet, sodium reduction, potassium balance, heart health',
    features: ['DASH framework', 'Sodium tracking', 'Potassium balance', 'Heart-healthy fats']
  }
];

const stats = [
  { value: '500+', label: 'Recipes', icon: Utensils },
  { value: '3', label: 'Conditions', icon: Shield },
  { value: '7-Day', label: 'Meal Plans', icon: ChartBar },
  { value: '100%', label: 'Personalized', icon: Sparkles }
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#080c16] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-30%] left-[5%] w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[10%] w-[350px] h-[350px] bg-blue-500/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="relative">
        {/* Nav */}
        <nav className="max-w-5xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">NutriCare</span>
          </div>
          <button onClick={() => navigate('/onboarding')} className="btn-primary text-sm py-2.5 px-6">
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/[0.06] border border-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Science-Backed Nutrition Plans
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            Your Personalized
            <br />
            <span className="gradient-text">Diet Planner</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Clinically-informed meal plans for <strong className="text-slate-200 font-medium">PCOS</strong>, <strong className="text-slate-200 font-medium">Diabetes</strong>, and <strong className="text-slate-200 font-medium">Hypertension</strong> — backed by evidence-based nutrition science.
          </p>

          <button
            onClick={() => navigate('/onboarding')}
            className="btn-primary text-lg py-4 px-10 animate-pulse-glow"
          >
            Start Your Free Plan <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        </div>

        {/* Stats */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className={`stat-card text-center animate-fade-in-up stagger-${i + 1}`} style={{ opacity: 0 }}>
                <s.icon className="w-5 h-5 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-white leading-none mb-1">{s.value}</div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Condition Cards */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="text-center mb-12">
            <div className="section-label mb-3">CONDITIONS WE SUPPORT</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">Choose Your Condition</h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
              Evidence-based dietary guidelines tailored to your specific condition
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {conditions.map((c, i) => (
              <button
                key={c.id}
                onClick={() => navigate('/onboarding', { state: { condition: c.id } })}
                className={`glass-interactive p-6 sm:p-8 text-center flex flex-col items-center group animate-fade-in-up stagger-${i + 1}`}
                style={{ opacity: 0 }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-lg`}>
                  <c.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-1.5">{c.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{c.full}</p>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">{c.desc}</p>

                <div className="space-y-2 flex flex-col items-center">
                  {c.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-slate-300">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${c.color}`} />
                      {f}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 mt-8 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                  Get Started <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="text-center mb-12">
            <div className="section-label mb-3">HOW IT WORKS</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">Three Simple Steps</h2>
            <p className="text-slate-500 text-sm sm:text-base">Get your personalized plan in under a minute</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { n: '01', title: 'Tell Us About You', desc: 'Share your condition, dietary preferences, and health goals.' },
              { n: '02', title: 'Get Your Plan', desc: 'Our engine generates a 7-day meal plan with precise calculations.' },
              { n: '03', title: 'Track & Improve', desc: 'Monitor nutrition, rate meals, and watch your plan adapt.' }
            ].map((s, i) => (
              <div key={i} className="stat-card p-8 text-center flex flex-col items-center">
                <div className="text-5xl font-black gradient-text mb-5 inline-block">{s.n}</div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-base text-slate-400 leading-relaxed max-w-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="glass-elevated p-10 sm:p-14 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Transform Your Diet?</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              Science-backed nutrition plans personalized to your chronic condition.
            </p>
            <button onClick={() => navigate('/onboarding')} className="btn-primary text-base py-3.5 px-8">
              Create Your Free Plan <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.03] py-6">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.65rem] text-slate-600">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3 h-3 text-primary" />
              NutriCare — Evidence-based nutrition
            </div>
            <div>Built for health. Powered by science.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

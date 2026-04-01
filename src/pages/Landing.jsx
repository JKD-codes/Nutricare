import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Droplets, ArrowRight, Sparkles, Shield, ChartBar, Utensils, ChevronRight } from 'lucide-react';

const conditions = [
  {
    id: 'PCOS',
    name: 'PCOS',
    fullName: 'Polycystic Ovary Syndrome',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    shadowColor: 'shadow-purple-500/10',
    description: 'Hormone balance, anti-inflammatory diet, insulin management',
    features: ['Low GI carbs', 'Anti-inflammatory foods', 'Inositol-rich meals', 'Hormone support']
  },
  {
    id: 'Diabetes',
    name: 'Diabetes Type 2',
    fullName: 'Type 2 Diabetes Mellitus',
    icon: Activity,
    color: 'from-blue-500 to-cyan-500',
    shadowColor: 'shadow-blue-500/10',
    description: 'Blood sugar control, consistent carb management, weight support',
    features: ['Glycemic control', 'Carb counting', 'Plate method', 'Medication support']
  },
  {
    id: 'Hypertension',
    name: 'Hypertension',
    fullName: 'High Blood Pressure',
    icon: Heart,
    color: 'from-rose-500 to-red-500',
    shadowColor: 'shadow-rose-500/10',
    description: 'DASH diet, sodium reduction, potassium balance, heart health',
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
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[15%] w-[400px] h-[400px] bg-secondary/[0.03] rounded-full blur-[100px]" />
        <div className="absolute top-[40%] right-[5%] w-[300px] h-[300px] bg-accent-pcos/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="relative">
        {/* Nav */}
        <nav className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">NutriCare</span>
              <div className="text-[0.55rem] text-slate-600 font-medium tracking-widest uppercase">SMART NUTRITION</div>
            </div>
          </div>
          <button onClick={() => navigate('/onboarding')} className="btn-primary text-sm py-2.5 px-5">
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-14 sm:pb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/[0.06] border border-primary/10 text-primary text-xs sm:text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Science-Backed Nutrition Plans
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5 tracking-tight">
            Your Personalized
            <br />
            <span className="gradient-text">Diet Planner</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Clinically-informed meal plans tailored to your condition — manage <strong className="text-slate-200">PCOS</strong>, <strong className="text-slate-200">Diabetes</strong>, or <strong className="text-slate-200">Hypertension</strong> with evidence-based nutrition.
          </p>

          <button
            onClick={() => navigate('/onboarding')}
            className="btn-primary text-base sm:text-lg px-8 py-4 animate-pulse-glow"
          >
            Start Your Free Plan <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((stat, i) => (
              <div key={i} className={`stat-card text-center animate-fade-in-up stagger-${i + 1}`}
                   style={{ opacity: 0 }}>
                <stat.icon className="w-4 h-4 text-primary mx-auto mb-2.5" />
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Condition Cards */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="text-center mb-12">
            <div className="section-label mb-3">CONDITIONS WE SUPPORT</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3">
              Choose Your Condition
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto">
              Each plan follows evidence-based dietary guidelines specific to your condition
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {conditions.map((condition, i) => (
              <button
                key={condition.id}
                onClick={() => navigate('/onboarding', { state: { condition: condition.id } })}
                className={`glass-card glass-card-hover p-6 sm:p-7 text-left cursor-pointer group
                            animate-fade-in-up stagger-${i + 1}`}
                style={{ opacity: 0 }}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${condition.color} 
                                flex items-center justify-center mb-5 
                                group-hover:scale-105 transition-transform duration-300
                                shadow-lg ${condition.shadowColor}`}>
                  <condition.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                <h3 className="text-lg font-bold text-white mb-0.5">{condition.name}</h3>
                <p className="text-xs text-slate-600 mb-3">{condition.fullName}</p>
                <p className="text-slate-400 text-sm mb-5 leading-relaxed">{condition.description}</p>

                <div className="space-y-2.5">
                  {condition.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${condition.color}`} />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-6 text-primary font-medium text-sm
                                group-hover:gap-3 transition-all">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">Three Simple Steps</h2>
            <p className="text-slate-500 text-sm sm:text-base">Get your personalized nutrition plan in under a minute</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: '01', title: 'Tell Us About You', desc: 'Share your health condition, dietary preferences, and goals.' },
              { step: '02', title: 'Get Your Plan', desc: 'Our engine generates a 7-day meal plan with precise nutrition calculations.' },
              { step: '03', title: 'Track & Improve', desc: 'Monitor nutrition, rate meals, and watch your plan adapt over time.' }
            ].map((item, i) => (
              <div key={i} className="text-center sm:text-left stat-card p-6">
                <div className="text-4xl sm:text-5xl font-black gradient-text mb-4 inline-block">{item.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <div className="glass-card p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">Ready to Transform Your Diet?</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto text-sm sm:text-base">
              Join thousands managing their chronic conditions through personalized, science-backed nutrition plans.
            </p>
            <button onClick={() => navigate('/onboarding')} className="btn-primary text-base px-8 py-4">
              Create Your Free Plan <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-600 text-xs">
              <Droplets className="w-3.5 h-3.5 text-primary" />
              NutriCare — Evidence-based nutrition for chronic disease
            </div>
            <div className="text-slate-700 text-xs">
              Built for health. Powered by science.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

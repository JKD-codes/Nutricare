import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Droplets, ArrowRight, Sparkles, Shield, ChartBar, Utensils } from 'lucide-react';

const conditions = [
  {
    id: 'PCOS',
    name: 'PCOS',
    fullName: 'Polycystic Ovary Syndrome',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-500/30',
    bgGlow: 'rgba(168, 85, 247, 0.15)',
    description: 'Hormone balance, anti-inflammatory diet, insulin management',
    features: ['Low GI carbs', 'Anti-inflammatory foods', 'Inositol-rich meals', 'Hormone support']
  },
  {
    id: 'Diabetes',
    name: 'Diabetes Type 2',
    fullName: 'Type 2 Diabetes Mellitus',
    icon: Activity,
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/30',
    bgGlow: 'rgba(59, 130, 246, 0.15)',
    description: 'Blood sugar control, consistent carb management, weight support',
    features: ['Glycemic control', 'Carb counting', 'Plate method', 'Medication support']
  },
  {
    id: 'Hypertension',
    name: 'Hypertension',
    fullName: 'High Blood Pressure',
    icon: Heart,
    color: 'from-rose-500 to-red-500',
    borderColor: 'border-rose-500/30',
    bgGlow: 'rgba(244, 63, 94, 0.15)',
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
    <div className="min-h-screen bg-surface-dark">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-pcos/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20">
          {/* Logo + Nav */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">NutriCare<span className="text-primary">AI</span></span>
            </div>
            <button
              onClick={() => navigate('/onboarding')}
              className="btn-primary text-sm"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </nav>

          {/* Hero content */}
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Nutrition for Chronic Disease Management
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              Your Personalized
              <br />
              <span className="gradient-text">Diet Planner</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Clinically-informed meal plans tailored to your condition.
              Manage <strong className="text-white">PCOS</strong>, <strong className="text-white">Diabetes</strong>, or <strong className="text-white">Hypertension</strong> with
              science-backed nutrition.
            </p>

            <button
              onClick={() => navigate('/onboarding')}
              className="btn-primary text-lg px-8 py-4 animate-pulse-glow"
            >
              Start Your Free Plan <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className={`glass-card p-4 text-center animate-fade-in-up stagger-${i + 1}`}
                   style={{ opacity: 0 }}>
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Condition Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Choose Your Condition
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Each plan is specifically designed with evidence-based dietary guidelines
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {conditions.map((condition, i) => (
            <button
              key={condition.id}
              onClick={() => navigate('/onboarding', { state: { condition: condition.id } })}
              className={`glass-card glass-card-hover p-8 text-left cursor-pointer group
                          animate-fade-in-up stagger-${i + 1}`}
              style={{ opacity: 0 }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${condition.color} 
                              flex items-center justify-center mb-5 
                              group-hover:scale-110 transition-transform duration-300`}>
                <condition.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{condition.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{condition.fullName}</p>
              <p className="text-slate-400 text-sm mb-5">{condition.description}</p>

              <div className="space-y-2">
                {condition.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm text-slate-300">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${condition.color}`}></div>
                    {feature}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-6 text-primary font-medium text-sm
                              group-hover:gap-3 transition-all">
                Get Started <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-slate-400 text-lg">Three simple steps to your personalized nutrition plan</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Tell Us About You', desc: 'Share your health condition, dietary preferences, and goals. Our system profiles your unique needs.' },
            { step: '02', title: 'Get Your Plan', desc: 'Our AI generates a 7-day meal plan optimized for your condition with precise nutrition calculations.' },
            { step: '03', title: 'Track & Improve', desc: 'Monitor your nutrition, rate meals, and watch your plan adapt to your preferences over time.' }
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-6xl font-black text-primary/20 mb-4">{item.step}</div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Droplets className="w-4 h-4 text-primary" />
            NutriCareAI — Evidence-based nutrition for chronic disease
          </div>
          <div className="text-slate-600 text-sm">
            Built for health. Powered by science.
          </div>
        </div>
      </footer>
    </div>
  );
}

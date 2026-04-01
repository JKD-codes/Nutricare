import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Flame, Droplets, Zap, ChefHat, Clock, RefreshCw, AlertTriangle, CheckCircle, Info, ArrowRight, TrendingUp, Salad } from 'lucide-react';
import { generateMealPlan, generateFeedback } from '../utils/mealPlanner';
import { saveMealPlan } from '../utils/storage';

const MACRO_COLORS = { carbs: '#3b82f6', protein: '#10b981', fat: '#f59e0b' };
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MEAL_ICONS = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };
const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' };

export default function Dashboard({ profile, mealPlanData, onRegenerate }) {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(0);

  const plan = mealPlanData?.plan || [];
  const metrics = mealPlanData?.metrics || {};
  const currentDay = plan[selectedDay];
  const summary = currentDay?.summary || {};

  const macroData = useMemo(() => [
    { name: 'Carbs', value: summary.macroPercentages?.carbs || 0, grams: summary.carbs || 0, color: MACRO_COLORS.carbs },
    { name: 'Protein', value: summary.macroPercentages?.protein || 0, grams: summary.protein || 0, color: MACRO_COLORS.protein },
    { name: 'Fat', value: summary.macroPercentages?.fat || 0, grams: summary.fat || 0, color: MACRO_COLORS.fat },
  ], [summary]);

  const weeklyCalories = useMemo(() =>
    plan.map((day, i) => ({
      name: DAY_SHORT[i],
      calories: day.summary?.calories || 0,
    }))
  , [plan]);

  const feedback = useMemo(() => {
    if (!summary.calories) return [];
    return generateFeedback(summary, metrics, mealPlanData?.condition);
  }, [summary, metrics, mealPlanData?.condition]);

  const handleRegenerate = () => {
    if (!profile) return;
    const newPlan = generateMealPlan(profile);
    saveMealPlan(newPlan);
    onRegenerate(newPlan);
  };

  const calPct = Math.min(100, ((summary.calories || 0) / (metrics.targetCalories || 1)) * 100);

  const alertStyle = (t) => ({
    danger: 'bg-red-500/[0.06] border-red-500/10 text-red-400',
    warning: 'bg-amber-500/[0.06] border-amber-500/10 text-amber-400',
    success: 'bg-emerald-500/[0.06] border-emerald-500/10 text-emerald-400',
  }[t] || 'bg-blue-500/[0.06] border-blue-500/10 text-blue-400');

  const alertIcon = (t) => ({
    danger: <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />,
    success: <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />,
  }[t] || <Info className="w-4 h-4 shrink-0 mt-0.5" />);

  const tooltipStyle = {
    contentStyle: { background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)', borderRadius: '12px', color: '#e2e8f0', fontSize: '13px', padding: '10px 14px' }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center gap-5 mb-10 w-full">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">Your Meal Plan</h1>
          <p className="text-base text-slate-400">
            <span className="text-primary font-semibold">{metrics.targetCalories}</span> kcal/day · {mealPlanData?.condition} focused
          </p>
        </div>
        <button onClick={handleRegenerate} className="btn-secondary text-sm py-2.5 px-6 shrink-0 mt-2">
          <RefreshCw className="w-4 h-4" /> Generate New Plan
        </button>
      </div>

      {/* Day selector */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-10 overflow-x-auto scrollbar-hide -mx-2 px-2 pb-2">
        {DAY_NAMES.map((day, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
              selectedDay === i
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white/[0.03] text-slate-400 border border-white/[0.05] hover:text-slate-200 hover:bg-white/[0.06]'
            }`}
          >
            <span className="sm:hidden">{DAY_SHORT[i]}</span>
            <span className="hidden sm:inline">{day}</span>
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Calories', value: summary.calories || 0, sub: `/ ${metrics.targetCalories}`, icon: Flame, color: 'text-orange-400' },
          { label: 'Protein', value: `${summary.protein || 0}g`, sub: `${summary.macroPercentages?.protein || 0}%`, icon: Zap, color: 'text-emerald-400' },
          { label: 'Fiber', value: `${Math.round(summary.fiber || 0)}g`, sub: `/ ${metrics.macroDistribution?.fiberMin || 25}g`, icon: Salad, color: 'text-green-400' },
          { label: 'Sodium', value: `${Math.round(summary.sodium || 0)}`, sub: `/ ${metrics.sodiumLimit || 2300}mg`, icon: Droplets, color: 'text-blue-400' },
        ].map((stat, i) => (
          <div key={i} className="stat-card flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="section-label">{stat.label}</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Main content - Single Centered Column */}
      <div className="flex flex-col items-center w-full space-y-12">
        {/* Meals */}
        <div className="w-full max-w-4xl space-y-5">
          <div className="section-label mb-6 text-center text-lg">{DAY_NAMES[selectedDay]}'S MEALS</div>

          {currentDay?.meals.map((meal, idx) => (
            <button
              key={idx}
              onClick={() => navigate(`/meal/${selectedDay}/${idx}`)}
              className="w-full meal-card text-center group flex flex-col items-center"
            >
              <div className="text-5xl lg:text-6xl mb-5 shrink-0 transition-transform group-hover:scale-110 duration-300">{MEAL_ICONS[meal.type]}</div>
              <div className="flex flex-col items-center w-full">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="tag tag-primary text-sm px-4 py-1.5">{MEAL_LABELS[meal.type]}</span>
                  <span className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4" /> {meal.time}
                  </span>
                </div>

                <h3 className="text-white font-bold text-2xl sm:text-3xl leading-snug mb-5 group-hover:text-primary transition-colors px-4">
                  {meal.recipe.name}
                </h3>

                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-5">
                  <span className="macro-pill text-base px-4 py-1.5">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span className="text-white font-bold">{meal.recipe.nutrition.calories}</span> <span className="text-slate-400 text-sm">kcal</span>
                  </span>
                  <span className="macro-pill text-sm px-4 py-1.5"><span className="dot bg-blue-500 w-2 h-2" /> <span className="text-slate-400 mr-1">Carbs</span><span className="text-white font-medium">{meal.recipe.nutrition.carbs}g</span></span>
                  <span className="macro-pill text-sm px-4 py-1.5"><span className="dot bg-emerald-500 w-2 h-2" /> <span className="text-slate-400 mr-1">Protein</span><span className="text-white font-medium">{meal.recipe.nutrition.protein}g</span></span>
                  <span className="macro-pill text-sm px-4 py-1.5"><span className="dot bg-amber-500 w-2 h-2" /> <span className="text-slate-400 mr-1">Fat</span><span className="text-white font-medium">{meal.recipe.nutrition.fat}g</span></span>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  {meal.recipe.tags.slice(0, 3).map((t, j) => (
                    <span key={j} className="tag bg-white/[0.03] border-white/[0.05]">{t}</span>
                  ))}
                  <span className="tag flex items-center gap-2 bg-white/[0.03] border-white/[0.05]">
                    <ChefHat className="w-4 h-4" /> {meal.recipe.cookingTime} min
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Daily Progress & Macros (Side-by-side or stacked on mobile) */}
        <div className="w-full max-w-4xl grid sm:grid-cols-2 gap-8">
          {/* Calorie ring */}
          <div className="glass-elevated p-8 sm:p-10 text-center flex flex-col items-center justify-center">
            <div className="section-label mb-8 text-lg">DAILY PROGRESS</div>
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-40 h-40 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(148,163,184,0.05)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="3"
                    strokeDasharray={`${calPct} ${100 - calPct}`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.8s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                  <span className="text-3xl font-bold text-white leading-none">{Math.round(calPct)}%</span>
                  <span className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Target</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">{summary.calories || 0}</div>
                <div className="text-lg text-slate-400 mb-2">of {metrics.targetCalories} kcal</div>
                <div className="text-sm px-4 py-1.5 rounded-lg bg-white/[0.03] inline-block text-slate-400 font-medium border border-white/[0.05]">
                  {(summary.calories || 0) > metrics.targetCalories ? <span className="text-rose-400">⚠ Over target</span> : <>{metrics.targetCalories - (summary.calories || 0)} <span className="text-slate-500">remaining</span></>}
                </div>
              </div>
            </div>
          </div>

          {/* Macro donut */}
          <div className="glass-elevated p-8 sm:p-10 text-center flex flex-col items-center justify-center">
            <div className="section-label mb-8 text-lg">MACRO SPLIT</div>
            <div className="chart-container w-full max-w-[240px]" style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={macroData} innerRadius="60%" outerRadius="85%" paddingAngle={5} dataKey="value" strokeWidth={0}>
                    {macroData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 w-full mt-8 gap-2">
              {macroData.map((m, i) => (
                <div key={i} className="text-center p-3 rounded-2xl bg-white/[0.02]">
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                    <span className="text-xs text-slate-400 uppercase font-medium tracking-wider">{m.name}</span>
                  </div>
                  <div className="text-xl font-bold text-white leading-none mb-1">{m.value}%</div>
                  <div className="text-xs text-slate-500">{m.grams}g</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nutrients & Insights */}
        <div className="w-full max-w-4xl space-y-8">
          {/* Nutrients */}
          <div className="glass-elevated p-8 sm:p-12 text-center">
            <div className="section-label mb-8 text-lg">KEY NUTRIENTS</div>
            <div className="space-y-6 max-w-2xl mx-auto">
              {[
                { label: 'Fiber', value: summary.fiber, target: metrics.macroDistribution?.fiberMin || 25, unit: 'g', color: 'bg-green-500' },
                { label: 'Sodium', value: summary.sodium, target: metrics.sodiumLimit || 2300, unit: 'mg', color: (summary.sodium || 0) > (metrics.sodiumLimit || 2300) ? 'bg-rose-500' : 'bg-blue-500' },
                { label: 'Potassium', value: summary.potassium, target: 4700, unit: 'mg', color: 'bg-purple-500' },
                { label: 'Calcium', value: summary.calcium, target: 1000, unit: 'mg', color: 'bg-cyan-500' },
                { label: 'Iron', value: summary.iron, target: 18, unit: 'mg', color: 'bg-orange-500' },
              ].map((n, i) => (
                <div key={i}>
                  <div className="flex justify-between text-base sm:text-lg mb-2.5 px-1">
                    <span className="text-slate-400 font-medium">{n.label}</span>
                    <span className="text-white tabular-nums font-bold">
                      {Math.round(n.value || 0)} <span className="text-slate-500 font-normal text-sm">/ {n.target}{n.unit}</span>
                    </span>
                  </div>
                  <div className="nutrition-bar h-2.5 bg-slate-800 border border-white/[0.02]">
                    <div className={`nutrition-bar-fill ${n.color} relative`} style={{ width: `${Math.min(100, ((n.value || 0) / n.target) * 100)}%` }}>
                      <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-white/20 to-transparent" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          {feedback.length > 0 && (
            <div className="glass-elevated p-8 sm:p-12 text-center flex flex-col items-center">
              <div className="section-label mb-8 flex items-center justify-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-primary" /> INSIGHTS
              </div>
              <div className="space-y-4 w-full max-w-2xl">
                {feedback.map((a, i) => (
                  <div key={i} className={`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-5 sm:p-6 rounded-2xl border text-base leading-relaxed ${alertStyle(a.type)}`}>
                    <div className="p-2 rounded-xl bg-white/[0.05] shrink-0">
                      {alertIcon(a.type)}
                    </div>
                    <span className="mt-1">{a.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly chart */}
      <div className="w-full max-w-4xl glass-elevated p-8 sm:p-12 mb-10 text-center flex flex-col items-center mx-auto">
        <div className="section-label mb-8 flex items-center justify-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-primary" /> WEEKLY CALORIES
        </div>
        <div className="chart-container w-full" style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyCalories} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: '#475569', fontSize: 13 }} axisLine={false} tickLine={false} width={45} dx={-10} />
              <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(16,185,129,0.03)' }} />
              <Bar dataKey="calories" fill="url(#bGrad)" radius={[10, 10, 0, 0]} />
              <defs>
                <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

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

      {/* Main grid */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Meals */}
        <div className="lg:col-span-3 space-y-5">
          <div className="section-label mb-4 text-center">{DAY_NAMES[selectedDay]}'S MEALS</div>

          {currentDay?.meals.map((meal, idx) => (
            <button
              key={idx}
              onClick={() => navigate(`/meal/${selectedDay}/${idx}`)}
              className="w-full meal-card text-center group flex flex-col items-center"
            >
              <div className="text-4xl sm:text-5xl mb-4 shrink-0">{MEAL_ICONS[meal.type]}</div>
              <div className="flex flex-col items-center w-full">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="tag tag-primary">{MEAL_LABELS[meal.type]}</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {meal.time}
                  </span>
                </div>

                <h3 className="text-white font-bold text-lg sm:text-xl leading-snug mb-4 group-hover:text-primary transition-colors px-2">
                  {meal.recipe.name}
                </h3>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4">
                  <span className="macro-pill">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-white font-semibold">{meal.recipe.nutrition.calories}</span> kcal
                  </span>
                  <span className="macro-pill"><span className="dot bg-blue-500" /> C:{meal.recipe.nutrition.carbs}g</span>
                  <span className="macro-pill"><span className="dot bg-emerald-500" /> P:{meal.recipe.nutrition.protein}g</span>
                  <span className="macro-pill"><span className="dot bg-amber-500" /> F:{meal.recipe.nutrition.fat}g</span>
                </div>

                <div className="flex flex-wrap justify-center gap-2.5">
                  {meal.recipe.tags.slice(0, 3).map((t, j) => (
                    <span key={j} className="tag">{t}</span>
                  ))}
                  <span className="tag flex items-center gap-1.5">
                    <ChefHat className="w-3.5 h-3.5" /> {meal.recipe.cookingTime} min
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calorie ring */}
          <div className="glass-elevated p-8 text-center flex flex-col items-center">
            <div className="section-label mb-6">DAILY PROGRESS</div>
            <div className="flex flex-col items-center gap-5">
              <div className="relative w-32 h-32 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(148,163,184,0.05)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="3"
                    strokeDasharray={`${calPct} ${100 - calPct}`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.8s ease' }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{Math.round(calPct)}%</span>
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">{summary.calories || 0}</div>
                <div className="text-base text-slate-400 mb-2">of {metrics.targetCalories} kcal</div>
                <div className="text-sm text-slate-500 font-medium">
                  {(summary.calories || 0) > metrics.targetCalories ? '⚠ Over target' : `${metrics.targetCalories - (summary.calories || 0)} remaining`}
                </div>
              </div>
            </div>
          </div>

          {/* Macro donut */}
          <div className="glass-elevated p-8 text-center flex flex-col items-center">
            <div className="section-label mb-6">MACRO SPLIT</div>
            <div className="chart-container w-full" style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={macroData} innerRadius="55%" outerRadius="80%" paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {macroData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around mt-6 w-full">
              {macroData.map((m, i) => (
                <div key={i} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                    <span className="text-xs text-slate-400 uppercase font-medium">{m.name}</span>
                  </div>
                  <div className="text-xl font-bold text-white leading-none mb-1.5">{m.value}%</div>
                  <div className="text-sm text-slate-500">{m.grams}g</div>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrients */}
          <div className="glass-elevated p-8 text-center">
            <div className="section-label mb-6">KEY NUTRIENTS</div>
            <div className="space-y-5">
              {[
                { label: 'Fiber', value: summary.fiber, target: metrics.macroDistribution?.fiberMin || 25, unit: 'g', color: 'bg-green-500' },
                { label: 'Sodium', value: summary.sodium, target: metrics.sodiumLimit || 2300, unit: 'mg', color: (summary.sodium || 0) > (metrics.sodiumLimit || 2300) ? 'bg-red-500' : 'bg-blue-500' },
                { label: 'Potassium', value: summary.potassium, target: 4700, unit: 'mg', color: 'bg-purple-500' },
                { label: 'Calcium', value: summary.calcium, target: 1000, unit: 'mg', color: 'bg-cyan-500' },
                { label: 'Iron', value: summary.iron, target: 18, unit: 'mg', color: 'bg-orange-500' },
              ].map((n, i) => (
                <div key={i}>
                  <div className="flex justify-between text-base mb-2 px-1">
                    <span className="text-slate-400">{n.label}</span>
                    <span className="text-white tabular-nums font-semibold">
                      {Math.round(n.value || 0)}<span className="text-slate-500 font-normal">/{n.target}{n.unit}</span>
                    </span>
                  </div>
                  <div className="nutrition-bar">
                    <div className={`nutrition-bar-fill ${n.color}`} style={{ width: `${Math.min(100, ((n.value || 0) / n.target) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          {feedback.length > 0 && (
            <div className="glass-elevated p-8 text-center flex flex-col items-center">
              <div className="section-label mb-5 flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> INSIGHTS
              </div>
              <div className="space-y-3 w-full">
                {feedback.map((a, i) => (
                  <div key={i} className={`flex flex-col items-center text-center gap-2 p-4 rounded-xl border text-sm leading-relaxed ${alertStyle(a.type)}`}>
                    {alertIcon(a.type)}
                    <span>{a.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly chart */}
      <div className="glass-elevated p-8 mt-8 text-center flex flex-col items-center">
        <div className="section-label mb-6 flex items-center justify-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> WEEKLY CALORIES
        </div>
        <div className="chart-container w-full" style={{ height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyCalories} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} dy={8} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} width={40} dx={-8} />
              <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(16,185,129,0.03)' }} />
              <Bar dataKey="calories" fill="url(#bGrad)" radius={[8, 8, 0, 0]} />
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

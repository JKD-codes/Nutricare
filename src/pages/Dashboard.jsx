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
      target: metrics.targetCalories || 0
    }))
  , [plan, metrics]);

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

  const calPercent = Math.min(100, ((summary.calories || 0) / (metrics.targetCalories || 1)) * 100);

  const getAlertStyle = (type) => {
    switch (type) {
      case 'danger': return 'bg-red-500/8 border-red-500/15 text-red-400';
      case 'warning': return 'bg-amber-500/8 border-amber-500/15 text-amber-400';
      case 'success': return 'bg-emerald-500/8 border-emerald-500/15 text-emerald-400';
      default: return 'bg-blue-500/8 border-blue-500/15 text-blue-400';
    }
  };
  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger': case 'warning': return <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />;
      case 'success': return <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />;
      default: return <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">Your Meal Plan</h1>
          <p className="text-sm text-slate-500 mt-1">
            <span className="text-primary font-semibold">{metrics.targetCalories}</span> kcal/day · {mealPlanData?.condition} focused
          </p>
        </div>
        <button onClick={handleRegenerate} className="btn-secondary text-sm py-2.5 px-4">
          <RefreshCw className="w-3.5 h-3.5" /> New Plan
        </button>
      </div>

      {/* Day selector — horizontally scrollable */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
        {DAY_NAMES.map((day, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
              selectedDay === i
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white/[0.03] text-slate-500 border border-white/5 hover:text-slate-300 hover:bg-white/[0.06]'
            }`}
          >
            <span className="sm:hidden">{DAY_SHORT[i]}</span>
            <span className="hidden sm:inline">{day}</span>
          </button>
        ))}
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Calories', value: summary.calories || 0, sub: `/ ${metrics.targetCalories}`, icon: Flame, color: 'text-orange-400' },
          { label: 'Protein', value: `${summary.protein || 0}g`, sub: `${summary.macroPercentages?.protein || 0}%`, icon: Zap, color: 'text-emerald-400' },
          { label: 'Fiber', value: `${Math.round(summary.fiber || 0)}g`, sub: `/ ${metrics.macroDistribution?.fiberMin || 25}g`, icon: Salad, color: 'text-green-400' },
          { label: 'Sodium', value: `${Math.round(summary.sodium || 0)}`, sub: `/ ${metrics.sodiumLimit || 2300}mg`, icon: Droplets, color: 'text-blue-400' },
        ].map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="section-label">{stat.label}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">{stat.value}</div>
            <div className="text-[0.7rem] text-slate-500 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* LEFT: Meals list */}
        <div className="lg:col-span-3 space-y-3">
          <div className="section-label mb-2">{DAY_NAMES[selectedDay]}'S MEALS</div>

          {currentDay?.meals.map((meal, mealIdx) => (
            <button
              key={mealIdx}
              onClick={() => navigate(`/meal/${selectedDay}/${mealIdx}`)}
              className="w-full meal-card text-left group cursor-pointer"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="text-2xl sm:text-3xl mt-0.5">{MEAL_ICONS[meal.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="tag-primary tag">{MEAL_LABELS[meal.type]}</span>
                    <span className="text-[0.65rem] text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {meal.time}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-[0.95rem] sm:text-base mb-2.5 truncate pr-4 group-hover:text-primary transition-colors">
                    {meal.recipe.name}
                  </h3>

                  {/* Macro pills */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-3">
                    <span className="macro-pill">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-white font-semibold">{meal.recipe.nutrition.calories}</span> kcal
                    </span>
                    <span className="macro-pill">
                      <span className="dot bg-blue-500" />
                      C: {meal.recipe.nutrition.carbs}g
                    </span>
                    <span className="macro-pill">
                      <span className="dot bg-emerald-500" />
                      P: {meal.recipe.nutrition.protein}g
                    </span>
                    <span className="macro-pill hidden sm:flex">
                      <span className="dot bg-amber-500" />
                      F: {meal.recipe.nutrition.fat}g
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {meal.recipe.tags.slice(0, 3).map((tag, j) => (
                      <span key={j} className="tag">{tag}</span>
                    ))}
                    <span className="tag flex items-center gap-1">
                      <ChefHat className="w-3 h-3" /> {meal.recipe.cookingTime}m
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-primary transition-colors shrink-0 mt-3" />
              </div>
            </button>
          ))}
        </div>

        {/* RIGHT: Nutrition sidebar */}
        <div className="lg:col-span-2 space-y-4">
          {/* Calorie ring */}
          <div className="glass-card p-5 sm:p-6">
            <div className="section-label mb-4">DAILY PROGRESS</div>
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(148,163,184,0.06)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#10b981" strokeWidth="3"
                    strokeDasharray={`${calPercent} ${100 - calPercent}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-white">{Math.round(calPercent)}%</span>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{summary.calories || 0}</div>
                <div className="text-xs text-slate-500">of {metrics.targetCalories} kcal</div>
                <div className="text-[0.65rem] text-slate-600 mt-1">
                  {summary.calories > metrics.targetCalories ? '⚠ Over target' : `${metrics.targetCalories - (summary.calories || 0)} remaining`}
                </div>
              </div>
            </div>
          </div>

          {/* Macro donut */}
          <div className="glass-card p-5 sm:p-6">
            <div className="section-label mb-3">MACRO SPLIT</div>
            <div className="chart-container" style={{ height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    innerRadius="55%"
                    outerRadius="80%"
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {macroData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around mt-1">
              {macroData.map((item, i) => (
                <div key={i} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-[0.65rem] text-slate-500 font-medium uppercase tracking-wider">{item.name}</span>
                  </div>
                  <div className="font-bold text-white text-sm">{item.value}%</div>
                  <div className="text-[0.65rem] text-slate-600">{item.grams}g</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key nutrients */}
          <div className="glass-card p-5 sm:p-6">
            <div className="section-label mb-4">KEY NUTRIENTS</div>
            <div className="space-y-3.5">
              {[
                { label: 'Fiber', value: summary.fiber, target: metrics.macroDistribution?.fiberMin || 25, unit: 'g', color: 'bg-green-500' },
                { label: 'Sodium', value: summary.sodium, target: metrics.sodiumLimit || 2300, unit: 'mg', color: summary.sodium > (metrics.sodiumLimit || 2300) ? 'bg-red-500' : 'bg-blue-500' },
                { label: 'Potassium', value: summary.potassium, target: 4700, unit: 'mg', color: 'bg-purple-500' },
                { label: 'Calcium', value: summary.calcium, target: 1000, unit: 'mg', color: 'bg-cyan-500' },
                { label: 'Iron', value: summary.iron, target: 18, unit: 'mg', color: 'bg-orange-500' },
              ].map((nutrient, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[0.72rem] mb-1.5">
                    <span className="text-slate-400 font-medium">{nutrient.label}</span>
                    <span className="text-slate-300 font-semibold tabular-nums">
                      {Math.round(nutrient.value || 0)}<span className="text-slate-500 font-normal">/{nutrient.target}{nutrient.unit}</span>
                    </span>
                  </div>
                  <div className="nutrition-bar">
                    <div
                      className={`nutrition-bar-fill ${nutrient.color}`}
                      style={{ width: `${Math.min(100, ((nutrient.value || 0) / nutrient.target) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          {feedback.length > 0 && (
            <div className="glass-card p-5 sm:p-6">
              <div className="section-label mb-3 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-primary" />
                INSIGHTS
              </div>
              <div className="space-y-2">
                {feedback.map((alert, i) => (
                  <div key={i} className={`flex items-start gap-2 p-3 rounded-xl border text-[0.72rem] leading-relaxed ${getAlertStyle(alert.type)}`}>
                    {getAlertIcon(alert.type)}
                    <span>{alert.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly chart */}
      <div className="glass-card p-5 sm:p-6 mt-6">
        <div className="section-label mb-4 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          WEEKLY CALORIES
        </div>
        <div className="chart-container" style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyCalories} barSize={24} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                contentStyle={{
                  background: '#1e293b', border: '1px solid rgba(148,163,184,0.1)',
                  borderRadius: '14px', color: '#e2e8f0', fontSize: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
                cursor={{ fill: 'rgba(16,185,129,0.03)' }}
              />
              <Bar dataKey="calories" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
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

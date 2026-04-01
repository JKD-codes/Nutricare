import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Flame, Droplets, Zap, ChefHat, Clock, Star, RefreshCw, AlertTriangle, CheckCircle, Info, ArrowRight, TrendingUp } from 'lucide-react';
import { generateMealPlan, generateFeedback } from '../utils/mealPlanner';
import { saveMealPlan } from '../utils/storage';

const MACRO_COLORS = { carbs: '#3b82f6', protein: '#10b981', fat: '#f59e0b' };
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
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
      name: DAY_NAMES[i].substring(0, 3),
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

  const getAlertStyle = (type) => {
    switch (type) {
      case 'danger': return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'warning': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'success': return 'bg-green-500/10 border-green-500/20 text-green-400';
      default: return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    }
  };
  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger': return <AlertTriangle className="w-4 h-4 shrink-0" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 shrink-0" />;
      case 'success': return <CheckCircle className="w-4 h-4 shrink-0" />;
      default: return <Info className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Your Meal Plan</h1>
          <p className="text-slate-400">
            {metrics.targetCalories} kcal/day target • {mealPlanData?.condition} management
          </p>
        </div>
        <button onClick={handleRegenerate} className="btn-secondary">
          <RefreshCw className="w-4 h-4" /> Regenerate Plan
        </button>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {DAY_NAMES.map((day, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedDay === i
                ? 'bg-primary text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT: Meals list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-2">
            {DAY_NAMES[selectedDay]}'s Meals
          </h2>

          {currentDay?.meals.map((meal, mealIdx) => (
            <button
              key={mealIdx}
              onClick={() => navigate(`/meal/${selectedDay}/${mealIdx}`)}
              className="w-full glass-card glass-card-hover p-5 text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{MEAL_ICONS[meal.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">
                      {MEAL_LABELS[meal.type]}
                    </span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {meal.time}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold mb-2 truncate">{meal.recipe.name}</h3>

                  {/* Nutrition mini-bars */}
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      {meal.recipe.nutrition.calories} kcal
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      C: {meal.recipe.nutrition.carbs}g
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      P: {meal.recipe.nutrition.protein}g
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      F: {meal.recipe.nutrition.fat}g
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {meal.recipe.tags.slice(0, 3).map((tag, j) => (
                      <span key={j} className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs">
                        {tag}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 text-xs flex items-center gap-1">
                      <ChefHat className="w-3 h-3" /> {meal.recipe.cookingTime} min
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors shrink-0 mt-2" />
              </div>
            </button>
          ))}
        </div>

        {/* RIGHT: Nutrition sidebar */}
        <div className="space-y-6">
          {/* Calorie summary */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-medium text-slate-400 mb-4">Daily Summary</h3>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-white">{summary.calories || 0}</div>
              <div className="text-sm text-slate-400">of {metrics.targetCalories} kcal target</div>
              <div className="mt-2 nutrition-bar">
                <div
                  className="nutrition-bar-fill bg-gradient-to-r from-emerald-500 to-teal-400"
                  style={{ width: `${Math.min(100, ((summary.calories || 0) / (metrics.targetCalories || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Macro donut */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-medium text-slate-400 mb-4">Macro Split</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    innerRadius={55}
                    outerRadius={80}
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
            <div className="flex justify-around mt-2">
              {macroData.map((item, i) => (
                <div key={i} className="text-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-xs text-slate-400">{item.name}</span>
                  </div>
                  <div className="font-semibold text-white text-sm">{item.value}%</div>
                  <div className="text-xs text-slate-500">{item.grams}g</div>
                </div>
              ))}
            </div>
          </div>

          {/* Micronutrients */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-medium text-slate-400 mb-4">Key Nutrients</h3>
            <div className="space-y-3">
              {[
                { label: 'Fiber', value: summary.fiber, target: metrics.macroDistribution?.fiberMin || 25, unit: 'g', color: 'bg-green-500' },
                { label: 'Sodium', value: summary.sodium, target: metrics.sodiumLimit || 2300, unit: 'mg', color: summary.sodium > (metrics.sodiumLimit || 2300) ? 'bg-red-500' : 'bg-blue-500', inverse: true },
                { label: 'Potassium', value: summary.potassium, target: 4700, unit: 'mg', color: 'bg-purple-500' },
                { label: 'Calcium', value: summary.calcium, target: 1000, unit: 'mg', color: 'bg-cyan-500' },
                { label: 'Iron', value: summary.iron, target: 18, unit: 'mg', color: 'bg-orange-500' },
              ].map((nutrient, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{nutrient.label}</span>
                    <span className="text-slate-300">
                      {Math.round(nutrient.value || 0)}{nutrient.unit} / {nutrient.target}{nutrient.unit}
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

          {/* Alerts / Feedback */}
          {feedback.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Nutrition Insights
              </h3>
              <div className="space-y-2">
                {feedback.map((alert, i) => (
                  <div key={i} className={`flex items-start gap-2 p-3 rounded-xl border text-xs ${getAlertStyle(alert.type)}`}>
                    {getAlertIcon(alert.type)}
                    <span>{alert.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly calories chart */}
      <div className="glass-card p-6 mt-8">
        <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Weekly Calorie Overview
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyCalories} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#1e293b',
                  border: '1px solid rgba(148,163,184,0.1)',
                  borderRadius: '12px',
                  color: '#e2e8f0'
                }}
              />
              <Bar dataKey="calories" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Flame, Droplets, Zap, ChefHat, Clock, RefreshCw, AlertTriangle, CheckCircle, Info, ArrowRight, TrendingUp, Salad, Plus, Minus, Printer } from 'lucide-react';
import { generateMealPlan, generateFeedback, swapMeal } from '../utils/mealPlanner';
import { saveMealPlan, getDailyLog, saveDailyLog } from '../utils/storage';

const MACRO_COLORS = { carbs: '#3b82f6', protein: '#10b981', fat: '#f59e0b' };
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MEAL_ICONS = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };
const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' };

export default function Dashboard({ profile, mealPlanData, onRegenerate }) {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(0);
  const [dailyLog, setDailyLog] = useState(() => getDailyLog());

  const updateLog = (field, value) => {
    const newLog = { ...dailyLog, [field]: value };
    setDailyLog(newLog);
    saveDailyLog(newLog);
  };

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
    danger: { bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.1)', color: '#f87171' },
    warning: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.1)', color: '#fbbf24' },
    success: { bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.1)', color: '#34d399' },
  }[t] || { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.1)', color: '#60a5fa' });

  const alertIcon = (t) => ({
    danger: <AlertTriangle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />,
    warning: <AlertTriangle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />,
    success: <CheckCircle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />,
  }[t] || <Info style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />);

  const tooltipStyle = {
    contentStyle: { background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 12, color: '#e2e8f0', fontSize: 13, padding: '10px 14px' }
  };

  const sectionLabel = { fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569' };

  return (
    <div style={{ padding: '24px 20px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20, marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: 12 }}>Your Meal Plan</h1>
          <p style={{ fontSize: '1rem', color: '#94a3b8' }}>
            <span style={{ color: '#10b981', fontWeight: 600 }}>{metrics.targetCalories}</span> kcal/day · {mealPlanData?.condition} focused
          </p>
        </div>
        <button onClick={handleRegenerate} className="btn-secondary" style={{ fontSize: '0.875rem', padding: '10px 24px' }}>
          <RefreshCw style={{ width: 16, height: 16 }} /> Generate New Plan
        </button>
      </div>

      {/* Day selector */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40,
        overflowX: 'auto', paddingBottom: 8,
      }}>
        {DAY_NAMES.map((day, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            style={{
              padding: '10px 20px', borderRadius: 12,
              fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
              border: selectedDay === i ? 'none' : '1px solid rgba(255,255,255,0.05)',
              background: selectedDay === i ? '#10b981' : 'rgba(255,255,255,0.03)',
              color: selectedDay === i ? 'white' : '#94a3b8',
              cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: selectedDay === i ? '0 4px 16px rgba(16,185,129,0.2)' : 'none',
            }}
          >
            <span className="day-short">{DAY_SHORT[i]}</span>
            <span className="day-full">{day}</span>
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Calories', value: summary.calories || 0, sub: `/ ${metrics.targetCalories}`, icon: Flame, color: '#fb923c' },
          { label: 'Protein', value: `${summary.protein || 0}g`, sub: `${summary.macroPercentages?.protein || 0}%`, icon: Zap, color: '#34d399' },
          { label: 'Fiber', value: `${Math.round(summary.fiber || 0)}g`, sub: `/ ${metrics.macroDistribution?.fiberMin || 25}g`, icon: Salad, color: '#4ade80' },
          { label: 'Sodium', value: `${Math.round(summary.sodium || 0)}`, sub: `/ ${metrics.sodiumLimit || 2300}mg`, icon: Droplets, color: '#60a5fa' },
        ].map((stat, i) => (
          <div key={i} className="stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <stat.icon style={{ width: 16, height: 16, color: stat.color }} />
              <span style={sectionLabel}>{stat.label}</span>
            </div>
            <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'white', marginBottom: 8 }}>{stat.value}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Daily Tracker Section */}
      <div className="glass-elevated" style={{ margin: '0 auto 40px', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ ...sectionLabel, marginBottom: 24, fontSize: '0.875rem' }}>TODAY'S VITALS & WATER</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32 }}>
          {/* Water */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: 12 }}>Water Intake ({dailyLog.water}/8 glasses)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button 
                onClick={() => updateLog('water', Math.max(0, dailyLog.water - 1))}
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Minus style={{ width: 16, height: 16 }} />
              </button>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6', width: 40, textAlign: 'center' }}>{dailyLog.water}</div>
              <button 
                onClick={() => updateLog('water', Math.min(15, dailyLog.water + 1))}
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', border: 'none', color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: i < dailyLog.water ? '#3b82f6' : 'rgba(255,255,255,0.05)' }} />
              ))}
            </div>
          </div>

          {/* Vitals */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: 6 }}>Weight (kg)</div>
              <input 
                type="number" 
                value={dailyLog.weight} 
                onChange={e => updateLog('weight', e.target.value)}
                placeholder="e.g. 70.5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: 8, color: 'white', width: 120, textAlign: 'center' }}
              />
            </div>
            {mealPlanData?.condition !== 'PCOS' && (
              <div>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: 6 }}>
                  {mealPlanData?.condition === 'Diabetes' ? 'Fasting Sugar (mg/dL)' : 'Blood Pressure'}
                </div>
                <input 
                  type="text" 
                  value={mealPlanData?.condition === 'Diabetes' ? dailyLog.sugar : dailyLog.bp} 
                  onChange={e => updateLog(mealPlanData?.condition === 'Diabetes' ? 'sugar' : 'bp', e.target.value)}
                  placeholder={mealPlanData?.condition === 'Diabetes' ? "e.g. 110" : "e.g. 120/80"}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: 8, color: 'white', width: 140, textAlign: 'center' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 48 }}>
        {/* Meals */}
        <div style={{ width: '100%', maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ ...sectionLabel, marginBottom: 8, textAlign: 'center', fontSize: '0.875rem' }}>{DAY_NAMES[selectedDay]}'S MEALS</div>

          {currentDay?.meals.map((meal, idx) => (
            <button
              key={idx}
              onClick={() => navigate(`/meal/${selectedDay}/${idx}`)}
              className="meal-card"
              style={{
                width: '100%', textAlign: 'center', position: 'relative',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                border: '1px solid rgba(148,163,184,0.04)',
                cursor: 'pointer', background: 'rgba(15,23,42,0.4)',
              }}
            >
              <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', marginBottom: 20, transition: 'transform 0.3s' }}>{MEAL_ICONS[meal.type]}</div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                <span className="tag tag-primary" style={{ fontSize: '0.875rem', padding: '6px 16px' }}>{MEAL_LABELS[meal.type]}</span>
                <span style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                  <Clock style={{ width: 16, height: 16 }} /> {meal.time}
                </span>
              </div>

              <h3 style={{ color: 'white', fontWeight: 700, fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', lineHeight: 1.3, marginBottom: 20, padding: '0 16px', transition: 'color 0.2s' }}>
                {meal.recipe.name}
              </h3>

              <div style={{ position: 'absolute', top: 16, right: 16 }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newPlan = swapMeal(mealPlanData, selectedDay, idx, profile);
                    saveMealPlan(newPlan);
                    onRegenerate(newPlan);
                  }}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)' }}
                >
                  <RefreshCw style={{ width: 12, height: 12 }} /> Swap
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '1rem' }}>
                  <Flame style={{ width: 20, height: 20, color: '#fb923c' }} />
                  <span style={{ color: 'white', fontWeight: 700 }}>{meal.recipe.nutrition.calories}</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>kcal</span>
                </span>
                {[
                  { label: 'Carbs', val: meal.recipe.nutrition.carbs, color: '#3b82f6' },
                  { label: 'Protein', val: meal.recipe.nutrition.protein, color: '#10b981' },
                  { label: 'Fat', val: meal.recipe.nutrition.fat, color: '#f59e0b' },
                ].map((m, j) => (
                  <span key={j} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }} />
                    <span style={{ color: '#94a3b8' }}>{m.label}</span>
                    <span style={{ color: 'white', fontWeight: 500 }}>{m.val}g</span>
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                {meal.recipe.tags.slice(0, 3).map((t, j) => (
                  <span key={j} className="tag" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>{t}</span>
                ))}
                <span className="tag" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <ChefHat style={{ width: 14, height: 14 }} /> {meal.recipe.cookingTime} min
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Daily Progress & Macros */}
        <div style={{ width: '100%', maxWidth: 800, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Calorie ring */}
          <div className="glass-elevated" style={{ padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ ...sectionLabel, marginBottom: 32, fontSize: '0.875rem' }}>DAILY PROGRESS</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
              <div style={{ position: 'relative', width: 160, height: 160 }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(148,163,184,0.05)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="3"
                    strokeDasharray={`${calPct} ${100 - calPct}`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.8s ease' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                  <span style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>{Math.round(calPct)}%</span>
                  <span style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Target</span>
                </div>
              </div>
              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'white', marginBottom: 8 }}>{summary.calories || 0}</div>
                <div style={{ fontSize: '1.0625rem', color: '#94a3b8', marginBottom: 8 }}>of {metrics.targetCalories} kcal</div>
                <div style={{
                  fontSize: '0.875rem', padding: '6px 16px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.03)', display: 'inline-block',
                  color: '#94a3b8', fontWeight: 500,
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  {(summary.calories || 0) > metrics.targetCalories
                    ? <span style={{ color: '#fb7185' }}>⚠ Over target</span>
                    : <>{metrics.targetCalories - (summary.calories || 0)} <span style={{ color: '#64748b' }}>remaining</span></>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Macro donut */}
          <div className="glass-elevated" style={{ padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ ...sectionLabel, marginBottom: 32, fontSize: '0.875rem' }}>MACRO SPLIT</div>
            <div style={{ width: '100%', maxWidth: 240, height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={macroData} innerRadius="60%" outerRadius="85%" paddingAngle={5} dataKey="value" strokeWidth={0}>
                    {macroData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', width: '100%', marginTop: 32, gap: 8 }}>
              {macroData.map((m, i) => (
                <div key={i} style={{ textAlign: 'center', padding: 12, borderRadius: 16, background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.color }} />
                    <span style={{ fontSize: '0.6875rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.06em' }}>{m.name}</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', lineHeight: 1, marginBottom: 4 }}>{m.value}%</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.grams}g</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Nutrients */}
        <div style={{ width: '100%', maxWidth: 800 }}>
          <div className="glass-elevated" style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ ...sectionLabel, marginBottom: 32, fontSize: '0.875rem' }}>KEY NUTRIENTS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 600, margin: '0 auto' }}>
              {[
                { label: 'Fiber', value: summary.fiber, target: metrics.macroDistribution?.fiberMin || 25, unit: 'g', color: '#22c55e' },
                { label: 'Sodium', value: summary.sodium, target: metrics.sodiumLimit || 2300, unit: 'mg', color: (summary.sodium || 0) > (metrics.sodiumLimit || 2300) ? '#f43f5e' : '#3b82f6' },
                { label: 'Potassium', value: summary.potassium, target: 4700, unit: 'mg', color: '#a855f7' },
                { label: 'Calcium', value: summary.calcium, target: 1000, unit: 'mg', color: '#06b6d4' },
                { label: 'Iron', value: summary.iron, target: 18, unit: 'mg', color: '#f97316' },
              ].map((n, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', marginBottom: 10, padding: '0 4px' }}>
                    <span style={{ color: '#94a3b8', fontWeight: 500 }}>{n.label}</span>
                    <span style={{ color: 'white', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {Math.round(n.value || 0)} <span style={{ color: '#64748b', fontWeight: 400, fontSize: '0.8125rem' }}>/ {n.target}{n.unit}</span>
                    </span>
                  </div>
                  <div style={{ height: 10, borderRadius: 5, background: '#1e293b', border: '1px solid rgba(255,255,255,0.02)', overflow: 'hidden' }}>
                    <div className="progress-fill" style={{
                      height: '100%', borderRadius: 5, background: n.color, position: 'relative',
                      width: `${Math.min(100, ((n.value || 0) / n.target) * 100)}%`,
                    }}>
                      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 32, background: 'linear-gradient(to left, rgba(255,255,255,0.2), transparent)' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        {feedback.length > 0 && (
          <div style={{ width: '100%', maxWidth: 800 }}>
            <div className="glass-elevated" style={{ padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ ...sectionLabel, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.875rem' }}>
                <Zap style={{ width: 20, height: 20, color: '#10b981' }} /> INSIGHTS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 600 }}>
                {feedback.map((a, i) => {
                  const st = alertStyle(a.type);
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '16px 20px', borderRadius: 16,
                      background: st.bg, border: `1px solid ${st.border}`,
                      color: st.color, fontSize: '0.9375rem', lineHeight: 1.6, textAlign: 'left',
                    }}>
                      <div style={{ padding: 8, borderRadius: 12, background: 'rgba(255,255,255,0.05)', flexShrink: 0 }}>
                        {alertIcon(a.type)}
                      </div>
                      <span>{a.message}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Weekly chart */}
      <div className="glass-elevated" style={{
        maxWidth: 800, margin: '48px auto 40px', padding: '32px 24px',
        textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ ...sectionLabel, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.875rem' }}>
          <TrendingUp style={{ width: 20, height: 20, color: '#10b981' }} /> WEEKLY CALORIES
        </div>
        <div style={{ width: '100%', height: 300 }}>
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

      <style>{`
        .day-full { display: none; }
        .day-short { display: inline; }
        @media (min-width: 640px) {
          .day-full { display: inline; }
          .day-short { display: none; }
        }
      `}</style>
    </div>
  );
}

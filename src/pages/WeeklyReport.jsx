import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { TrendingUp, Target, Award, Flame, Droplets, Zap, Heart, Activity } from 'lucide-react';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const tooltipStyle = {
  contentStyle: {
    background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)',
    borderRadius: '14px', color: '#e2e8f0', fontSize: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  }
};

export default function WeeklyReport({ mealPlanData, profile }) {
  const plan = mealPlanData?.plan || [];
  const metrics = mealPlanData?.metrics || {};
  const condition = mealPlanData?.condition;

  const weeklyData = useMemo(() =>
    plan.map((day, i) => ({
      name: DAY_NAMES[i],
      calories: day.summary?.calories || 0,
      carbs: day.summary?.carbs || 0,
      protein: day.summary?.protein || 0,
      fat: day.summary?.fat || 0,
      fiber: day.summary?.fiber || 0,
      sodium: day.summary?.sodium || 0,
      potassium: day.summary?.potassium || 0,
    }))
  , [plan]);

  const averages = useMemo(() => {
    if (!weeklyData.length) return {};
    const keys = ['calories', 'carbs', 'protein', 'fat', 'fiber', 'sodium', 'potassium'];
    const avgs = {};
    keys.forEach(key => {
      avgs[key] = Math.round(weeklyData.reduce((sum, d) => sum + d[key], 0) / weeklyData.length);
    });
    return avgs;
  }, [weeklyData]);

  const radarData = useMemo(() => {
    const targets = { fiber: metrics.macroDistribution?.fiberMin || 25, potassium: 4700, calcium: 1000, magnesium: 400, iron: 18 };
    return [
      { nutrient: 'Fiber', value: Math.min(100, (averages.fiber / targets.fiber) * 100) },
      { nutrient: 'Potassium', value: Math.min(100, (averages.potassium / targets.potassium) * 100) },
      { nutrient: 'Low Na', value: Math.min(100, ((metrics.sodiumLimit || 2300) / Math.max(1, averages.sodium)) * 100) },
      { nutrient: 'Protein', value: Math.min(100, (averages.protein / (metrics.macroGrams?.protein || 80)) * 100) },
      { nutrient: 'Carbs', value: Math.min(100, (averages.carbs / (metrics.macroGrams?.carbs || 200)) * 100) },
    ];
  }, [averages, metrics]);

  const adherenceScore = useMemo(() => {
    if (!radarData.length) return 0;
    return Math.round(radarData.reduce((s, d) => s + d.value, 0) / radarData.length);
  }, [radarData]);

  const conditionInsights = useMemo(() => {
    if (condition === 'PCOS') return [
      { icon: '🌿', label: 'Anti-inflammatory Focus', status: 'Active', color: 'text-green-400' },
      { icon: '📊', label: 'Low GI Carbs', status: 'All meals GI ≤ 55', color: 'text-blue-400' },
      { icon: '🥚', label: 'Protein per Meal', status: 'Included in every meal', color: 'text-emerald-400' },
    ];
    if (condition === 'Diabetes') return [
      { icon: '📉', label: 'Glycemic Control', status: 'Low GI targets met', color: 'text-blue-400' },
      { icon: '🍽️', label: 'Plate Method', status: 'Applied to meals', color: 'text-green-400' },
      { icon: '⏰', label: 'Meal Timing', status: 'Consistent schedule', color: 'text-amber-400' },
    ];
    return [
      { icon: '🧂', label: 'Sodium Control', status: `Avg ${averages.sodium}mg/day`, color: averages.sodium <= 1500 ? 'text-green-400' : 'text-amber-400' },
      { icon: '🍌', label: 'Potassium Balance', status: `Avg ${averages.potassium}mg/day`, color: 'text-purple-400' },
      { icon: '💚', label: 'DASH Compliance', status: 'Following framework', color: 'text-emerald-400' },
    ];
  }, [condition, averages]);

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">Weekly Report</h1>
        <p className="text-sm text-slate-500 mt-1">Your nutrition performance at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Adherence', value: `${adherenceScore}%`, icon: Award, color: 'text-primary', desc: 'Plan compliance' },
          { label: 'Avg Calories', value: averages.calories, icon: Flame, color: 'text-orange-400', desc: `Target: ${metrics.targetCalories}` },
          { label: 'Avg Fiber', value: `${averages.fiber}g`, icon: Zap, color: 'text-green-400', desc: `Target: ${metrics.macroDistribution?.fiberMin || 25}g` },
          { label: 'Avg Sodium', value: `${averages.sodium}mg`, icon: Droplets, color: 'text-blue-400', desc: `Limit: ${metrics.sodiumLimit || 2300}mg` },
        ].map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="section-label">{stat.label}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">{stat.value}</div>
            <div className="text-[0.65rem] text-slate-600 mt-0.5">{stat.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Macro trends */}
        <div className="glass-card p-5 sm:p-6">
          <div className="section-label mb-4 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-primary" /> MACRO TRENDS
          </div>
          <div className="chart-container" style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="carbs" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Carbs" />
                <Line type="monotone" dataKey="protein" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Protein" />
                <Line type="monotone" dataKey="fat" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Fat" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar */}
        <div className="glass-card p-5 sm:p-6">
          <div className="section-label mb-4 flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-primary" /> NUTRIENT BALANCE
          </div>
          <div className="chart-container" style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="nutrient" tick={{ fill: '#64748b', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Balance" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Calorie chart */}
        <div className="glass-card p-5 sm:p-6">
          <div className="section-label mb-4 flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-orange-400" /> DAILY CALORIES
          </div>
          <div className="chart-container" style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
                <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(16,185,129,0.03)' }} />
                <Bar dataKey="calories" fill="url(#barGrad)" radius={[6, 6, 0, 0]} name="Calories" />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Condition insights */}
        <div className="glass-card p-5 sm:p-6">
          <div className="section-label mb-4 flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> {condition?.toUpperCase()} INSIGHTS
          </div>
          <div className="space-y-3">
            {conditionInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <span className="text-xl">{insight.icon}</span>
                <div>
                  <div className="font-medium text-white text-sm">{insight.label}</div>
                  <div className={`text-xs ${insight.color} mt-0.5`}>{insight.status}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-xl bg-primary/[0.04] border border-primary/8">
            <div className="section-label mb-3">TARGET MACROS</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Carbs', target: `${metrics.macroDistribution?.carbs.target || 0}%`, actual: `${Math.round((averages.carbs * 4) / (averages.calories || 1) * 100)}%` },
                { label: 'Protein', target: `${metrics.macroDistribution?.protein.target || 0}%`, actual: `${Math.round((averages.protein * 4) / (averages.calories || 1) * 100)}%` },
                { label: 'Fat', target: `${metrics.macroDistribution?.fat.target || 0}%`, actual: `${Math.round((averages.fat * 9) / (averages.calories || 1) * 100)}%` },
              ].map((m, i) => (
                <div key={i}>
                  <div className="text-[0.65rem] text-slate-500 uppercase tracking-wider">{m.label}</div>
                  <div className="text-lg font-bold text-white mt-0.5">{m.actual}</div>
                  <div className="text-[0.6rem] text-slate-600">goal: {m.target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fiber & Sodium */}
      <div className="glass-card p-5 sm:p-6">
        <div className="section-label mb-4 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-primary" /> FIBER & SODIUM TRENDS
        </div>
        <div className="chart-container" style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line yAxisId="left" type="monotone" dataKey="fiber" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Fiber (g)" />
              <Line yAxisId="right" type="monotone" dataKey="sodium" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} name="Sodium (mg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

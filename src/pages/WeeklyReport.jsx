import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { TrendingUp, Target, Award, Flame, Droplets, Zap, Heart, Activity } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const tt = { contentStyle: { background: '#1e293b', border: '1px solid rgba(148,163,184,0.06)', borderRadius: '10px', color: '#e2e8f0', fontSize: '10px', padding: '6px 10px' } };

export default function WeeklyReport({ mealPlanData, profile }) {
  const plan = mealPlanData?.plan || [];
  const metrics = mealPlanData?.metrics || {};
  const condition = mealPlanData?.condition;

  const wd = useMemo(() => plan.map((d, i) => ({
    name: DAYS[i], calories: d.summary?.calories || 0,
    carbs: d.summary?.carbs || 0, protein: d.summary?.protein || 0,
    fat: d.summary?.fat || 0, fiber: d.summary?.fiber || 0,
    sodium: d.summary?.sodium || 0, potassium: d.summary?.potassium || 0,
  })), [plan]);

  const avg = useMemo(() => {
    if (!wd.length) return {};
    const keys = ['calories', 'carbs', 'protein', 'fat', 'fiber', 'sodium', 'potassium'];
    const a = {};
    keys.forEach(k => a[k] = Math.round(wd.reduce((s, d) => s + d[k], 0) / wd.length));
    return a;
  }, [wd]);

  const radar = useMemo(() => {
    const t = { fiber: metrics.macroDistribution?.fiberMin || 25, potassium: 4700, calcium: 1000 };
    return [
      { n: 'Fiber', v: Math.min(100, (avg.fiber / t.fiber) * 100) },
      { n: 'Potassium', v: Math.min(100, (avg.potassium / t.potassium) * 100) },
      { n: 'Low Na', v: Math.min(100, ((metrics.sodiumLimit || 2300) / Math.max(1, avg.sodium)) * 100) },
      { n: 'Protein', v: Math.min(100, (avg.protein / (metrics.macroGrams?.protein || 80)) * 100) },
      { n: 'Carbs', v: Math.min(100, (avg.carbs / (metrics.macroGrams?.carbs || 200)) * 100) },
    ];
  }, [avg, metrics]);

  const score = useMemo(() => radar.length ? Math.round(radar.reduce((s, d) => s + d.v, 0) / radar.length) : 0, [radar]);

  const insights = useMemo(() => {
    if (condition === 'PCOS') return [
      { icon: '🌿', label: 'Anti-inflammatory Focus', status: 'Active', color: 'text-green-400' },
      { icon: '📊', label: 'Low GI Carbs', status: 'All meals GI ≤ 55', color: 'text-blue-400' },
      { icon: '🥚', label: 'Protein Coverage', status: 'Included every meal', color: 'text-emerald-400' },
    ];
    if (condition === 'Diabetes') return [
      { icon: '📉', label: 'Glycemic Control', status: 'Low GI targets met', color: 'text-blue-400' },
      { icon: '🍽️', label: 'Plate Method', status: 'Applied', color: 'text-green-400' },
      { icon: '⏰', label: 'Meal Timing', status: 'Consistent', color: 'text-amber-400' },
    ];
    return [
      { icon: '🧂', label: 'Sodium Control', status: `Avg ${avg.sodium}mg/day`, color: avg.sodium <= 1500 ? 'text-green-400' : 'text-amber-400' },
      { icon: '🍌', label: 'Potassium Balance', status: `Avg ${avg.potassium}mg/day`, color: 'text-purple-400' },
      { icon: '💚', label: 'DASH Compliance', status: 'Following framework', color: 'text-emerald-400' },
    ];
  }, [condition, avg]);

  return (
    <div className="page-container">
      <div className="flex flex-col items-center justify-center text-center gap-3 mb-10 w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">Weekly Report</h1>
        <p className="text-base text-slate-400">Your nutrition performance snapshot</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Adherence', value: `${score}%`, icon: Award, color: 'text-primary', desc: 'Plan compliance' },
          { label: 'Avg Calories', value: avg.calories, icon: Flame, color: 'text-orange-400', desc: `Target: ${metrics.targetCalories}` },
          { label: 'Avg Fiber', value: `${avg.fiber}g`, icon: Zap, color: 'text-green-400', desc: `Target: ${metrics.macroDistribution?.fiberMin || 25}g` },
          { label: 'Avg Sodium', value: `${avg.sodium}mg`, icon: Droplets, color: 'text-blue-400', desc: `Limit: ${metrics.sodiumLimit || 2300}mg` },
        ].map((s, i) => (
          <div key={i} className="stat-card flex flex-col items-center text-center p-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="section-label">{s.label}</span>
            </div>
            <div className="text-3xl font-bold text-white leading-none mb-2">{s.value}</div>
            <div className="text-sm text-slate-500">{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Macro trends */}
        <div className="glass-elevated p-8 flex flex-col items-center text-center">
          <div className="section-label mb-6 flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> MACRO TRENDS
          </div>
          <div className="chart-container w-full" style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wd}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.04)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} dy={8} />
                <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip {...tt} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="carbs" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Carbs" />
                <Line type="monotone" dataKey="protein" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Protein" />
                <Line type="monotone" dataKey="fat" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Fat" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar */}
        <div className="glass-elevated p-8 flex flex-col items-center text-center">
          <div className="section-label mb-6 flex items-center justify-center gap-2">
            <Target className="w-4 h-4 text-primary" /> NUTRIENT BALANCE
          </div>
          <div className="chart-container w-full" style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="n" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="v" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Calories */}
        <div className="glass-elevated p-8 flex flex-col items-center text-center">
          <div className="section-label mb-6 flex items-center justify-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" /> DAILY CALORIES
          </div>
          <div className="chart-container w-full" style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wd} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.04)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} dy={8} />
                <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip {...tt} cursor={{ fill: 'rgba(16,185,129,0.04)' }} />
                <Bar dataKey="calories" fill="url(#gB)" radius={[6, 6, 0, 0]} />
                <defs><linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#059669" /></linearGradient></defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Condition insights */}
        <div className="glass-elevated p-8 flex flex-col items-center text-center">
          <div className="section-label mb-6 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" /> {condition?.toUpperCase()} INSIGHTS
          </div>
          <div className="space-y-3 w-full">
            {insights.map((ins, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl bg-white/[0.015] border border-white/[0.03]">
                <span className="text-2xl mb-1">{ins.icon}</span>
                <div className="text-sm font-bold text-white">{ins.label}</div>
                <div className={`text-xs ${ins.color} font-medium`}>{ins.status}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 w-full p-5 rounded-xl bg-primary/[0.03] border border-primary/10">
            <div className="section-label mb-4 text-center">TARGET MACROS</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { l: 'Carbs', t: `${metrics.macroDistribution?.carbs?.target || 0}%`, a: `${Math.round((avg.carbs * 4) / (avg.calories || 1) * 100)}%` },
                { l: 'Protein', t: `${metrics.macroDistribution?.protein?.target || 0}%`, a: `${Math.round((avg.protein * 4) / (avg.calories || 1) * 100)}%` },
                { l: 'Fat', t: `${metrics.macroDistribution?.fat?.target || 0}%`, a: `${Math.round((avg.fat * 9) / (avg.calories || 1) * 100)}%` },
              ].map((m, i) => (
                <div key={i}>
                  <div className="text-[0.7rem] text-slate-500 uppercase tracking-wider">{m.l}</div>
                  <div className="text-xl font-bold text-white mt-1 mb-0.5">{m.a}</div>
                  <div className="text-xs text-slate-500">goal: {m.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fiber & Sodium */}
      <div className="glass-elevated p-8 flex flex-col items-center text-center">
        <div className="section-label mb-6 flex items-center justify-center gap-2">
          <Activity className="w-4 h-4 text-primary" /> FIBER & SODIUM
        </div>
        <div className="chart-container w-full" style={{ height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={wd}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} dy={8} />
              <YAxis yAxisId="l" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} width={30} dx={-5} />
              <YAxis yAxisId="r" orientation="right" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} width={40} dx={5} />
              <Tooltip {...tt} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line yAxisId="l" type="monotone" dataKey="fiber" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Fiber (g)" />
              <Line yAxisId="r" type="monotone" dataKey="sodium" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} name="Sodium (mg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

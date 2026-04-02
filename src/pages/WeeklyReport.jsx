import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { TrendingUp, Target, Award, Flame, Droplets, Zap, Heart, Activity, Printer } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const tt = { contentStyle: { background: '#1e293b', border: '1px solid rgba(148,163,184,0.06)', borderRadius: 10, color: '#e2e8f0', fontSize: 10, padding: '6px 10px' } };

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
      { icon: '🌿', label: 'Anti-inflammatory Focus', status: 'Active', color: '#4ade80' },
      { icon: '📊', label: 'Low GI Carbs', status: 'All meals GI ≤ 55', color: '#60a5fa' },
      { icon: '🥚', label: 'Protein Coverage', status: 'Included every meal', color: '#34d399' },
    ];
    if (condition === 'Diabetes') return [
      { icon: '📉', label: 'Glycemic Control', status: 'Low GI targets met', color: '#60a5fa' },
      { icon: '🍽️', label: 'Plate Method', status: 'Applied', color: '#4ade80' },
      { icon: '⏰', label: 'Meal Timing', status: 'Consistent', color: '#fbbf24' },
    ];
    return [
      { icon: '🧂', label: 'Sodium Control', status: `Avg ${avg.sodium}mg/day`, color: avg.sodium <= 1500 ? '#4ade80' : '#fbbf24' },
      { icon: '🍌', label: 'Potassium Balance', status: `Avg ${avg.potassium}mg/day`, color: '#c084fc' },
      { icon: '💚', label: 'DASH Compliance', status: 'Following framework', color: '#34d399' },
    ];
  }, [condition, avg]);

  const sectionLabel = { fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569' };

  return (
    <div style={{ padding: '24px 20px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, marginBottom: 40, position: 'relative' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: 8 }}>Weekly Report</h1>
          <p style={{ fontSize: '1rem', color: '#94a3b8' }}>Your nutrition performance snapshot</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="btn-secondary no-print" 
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontSize: '0.8125rem' }}
        >
          <Printer style={{ width: 14, height: 14 }} /> Export as PDF
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Adherence', value: `${score}%`, icon: Award, color: '#10b981', desc: 'Plan compliance' },
          { label: 'Avg Calories', value: avg.calories, icon: Flame, color: '#fb923c', desc: `Target: ${metrics.targetCalories}` },
          { label: 'Avg Fiber', value: `${avg.fiber}g`, icon: Zap, color: '#4ade80', desc: `Target: ${metrics.macroDistribution?.fiberMin || 25}g` },
          { label: 'Avg Sodium', value: `${avg.sodium}mg`, icon: Droplets, color: '#60a5fa', desc: `Limit: ${metrics.sodiumLimit || 2300}mg` },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
              <s.icon style={{ width: 16, height: 16, color: s.color }} />
              <span style={sectionLabel}>{s.label}</span>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{s.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, width: '100%', maxWidth: 800, margin: '0 auto 40px' }}>
        {/* Macro trends */}
        <div className="glass-elevated" style={{ width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ ...sectionLabel, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.875rem' }}>
            <TrendingUp style={{ width: 20, height: 20, color: '#10b981' }} /> MACRO TRENDS
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wd}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.04)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#475569', fontSize: 13 }} axisLine={false} tickLine={false} width={40} dx={-10} />
                <Tooltip {...tt} />
                <Legend wrapperStyle={{ fontSize: 13, paddingTop: 15 }} />
                <Line type="monotone" dataKey="carbs" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Carbs" />
                <Line type="monotone" dataKey="protein" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Protein" />
                <Line type="monotone" dataKey="fat" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} name="Fat" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar */}
        <div className="glass-elevated" style={{ width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ ...sectionLabel, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.875rem' }}>
            <Target style={{ width: 20, height: 20, color: '#10b981' }} /> NUTRIENT BALANCE
          </div>
          <div style={{ width: '100%', maxWidth: 480, height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="n" tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="v" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calories */}
        <div className="glass-elevated" style={{ width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ ...sectionLabel, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.875rem' }}>
            <Flame style={{ width: 20, height: 20, color: '#fb923c' }} /> DAILY CALORIES
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wd} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.04)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#475569', fontSize: 13 }} axisLine={false} tickLine={false} width={45} dx={-10} />
                <Tooltip {...tt} cursor={{ fill: 'rgba(16,185,129,0.04)' }} />
                <Bar dataKey="calories" fill="url(#gB)" radius={[8, 8, 0, 0]} />
                <defs><linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#059669" /></linearGradient></defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Condition insights */}
        <div className="glass-elevated" style={{ width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ ...sectionLabel, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.875rem' }}>
            <Heart style={{ width: 20, height: 20, color: '#f43f5e' }} /> {condition?.toUpperCase()} INSIGHTS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
            {insights.map((ins, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
                padding: 20, borderRadius: 16,
                background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)',
              }}>
                <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>{ins.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'white', marginBottom: 4 }}>{ins.label}</div>
                  <div style={{ fontSize: '0.8125rem', color: ins.color, fontWeight: 500 }}>{ins.status}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 32, width: '100%', padding: 24, borderRadius: 16,
            background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.1)',
          }}>
            <div style={{ ...sectionLabel, marginBottom: 24, textAlign: 'center', fontSize: '0.875rem' }}>TARGET MACROS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, textAlign: 'center' }}>
              {[
                { l: 'Carbs', t: `${metrics.macroDistribution?.carbs?.target || 0}%`, a: `${Math.round((avg.carbs * 4) / (avg.calories || 1) * 100)}%` },
                { l: 'Protein', t: `${metrics.macroDistribution?.protein?.target || 0}%`, a: `${Math.round((avg.protein * 4) / (avg.calories || 1) * 100)}%` },
                { l: 'Fat', t: `${metrics.macroDistribution?.fat?.target || 0}%`, a: `${Math.round((avg.fat * 9) / (avg.calories || 1) * 100)}%` },
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.l}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginTop: 8, marginBottom: 4 }}>{m.a}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>goal: {m.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fiber & Sodium */}
        <div className="glass-elevated" style={{ width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ ...sectionLabel, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Activity style={{ width: 16, height: 16, color: '#10b981' }} /> FIBER & SODIUM
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wd}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.04)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} dy={8} />
                <YAxis yAxisId="l" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} width={30} dx={-5} />
                <YAxis yAxisId="r" orientation="right" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} width={40} dx={5} />
                <Tooltip {...tt} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Line yAxisId="l" type="monotone" dataKey="fiber" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Fiber (g)" />
                <Line yAxisId="r" type="monotone" dataKey="sodium" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} name="Sodium (mg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

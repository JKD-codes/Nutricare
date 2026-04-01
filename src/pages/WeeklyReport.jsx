import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { TrendingUp, Target, Award, Flame, Droplets, Zap, Heart, Activity } from 'lucide-react';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
    if (weeklyData.length === 0) return {};
    const keys = ['calories', 'carbs', 'protein', 'fat', 'fiber', 'sodium', 'potassium'];
    const avgs = {};
    keys.forEach(key => {
      avgs[key] = Math.round(
        weeklyData.reduce((sum, d) => sum + d[key], 0) / weeklyData.length
      );
    });
    return avgs;
  }, [weeklyData]);

  const radarData = useMemo(() => {
    const targets = {
      fiber: metrics.macroDistribution?.fiberMin || 25,
      potassium: 4700,
      calcium: 1000,
      magnesium: 400,
      iron: 18
    };
    return [
      { nutrient: 'Fiber', value: Math.min(100, (averages.fiber / targets.fiber) * 100) },
      { nutrient: 'Potassium', value: Math.min(100, (averages.potassium / targets.potassium) * 100) },
      { nutrient: 'Low Sodium', value: Math.min(100, ((metrics.sodiumLimit || 2300) / Math.max(1, averages.sodium)) * 100) },
      { nutrient: 'Protein', value: Math.min(100, (averages.protein / (metrics.macroGrams?.protein || 80)) * 100) },
      { nutrient: 'Carb Balance', value: Math.min(100, (averages.carbs / (metrics.macroGrams?.carbs || 200)) * 100) },
    ];
  }, [averages, metrics]);

  const adherenceScore = useMemo(() => {
    if (radarData.length === 0) return 0;
    return Math.round(radarData.reduce((sum, d) => sum + d.value, 0) / radarData.length);
  }, [radarData]);

  const conditionInsights = useMemo(() => {
    const insights = [];
    if (condition === 'PCOS') {
      insights.push({ icon: '🌿', label: 'Anti-inflammatory Focus', status: 'Active', color: 'text-green-400' });
      insights.push({ icon: '📊', label: 'Low GI Carbs', status: 'All meals GI ≤ 55', color: 'text-blue-400' });
      insights.push({ icon: '🥚', label: 'Protein per Meal', status: 'Included in every meal', color: 'text-emerald-400' });
    } else if (condition === 'Diabetes') {
      insights.push({ icon: '📉', label: 'Glycemic Control', status: 'Low GI targets met', color: 'text-blue-400' });
      insights.push({ icon: '🍽️', label: 'Plate Method', status: 'Applied to meals', color: 'text-green-400' });
      insights.push({ icon: '⏰', label: 'Meal Timing', status: 'Consistent schedule', color: 'text-amber-400' });
    } else if (condition === 'Hypertension') {
      insights.push({ icon: '🧂', label: 'Sodium Control', status: `Avg ${averages.sodium}mg/day`, color: averages.sodium <= 1500 ? 'text-green-400' : 'text-amber-400' });
      insights.push({ icon: '🍌', label: 'Potassium Balance', status: `Avg ${averages.potassium}mg/day`, color: 'text-purple-400' });
      insights.push({ icon: '💚', label: 'DASH Compliance', status: 'Following framework', color: 'text-emerald-400' });
    }
    return insights;
  }, [condition, averages]);

  const tooltipStyle = {
    contentStyle: {
      background: '#1e293b', border: '1px solid rgba(148,163,184,0.1)',
      borderRadius: '12px', color: '#e2e8f0', fontSize: '12px'
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Weekly Report</h1>
        <p className="text-slate-400">Your nutrition performance at a glance</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Adherence Score', value: `${adherenceScore}%`, icon: Award, color: 'text-primary', desc: 'Plan compliance' },
          { label: 'Avg Calories', value: averages.calories, icon: Flame, color: 'text-orange-400', desc: `Target: ${metrics.targetCalories}` },
          { label: 'Avg Fiber', value: `${averages.fiber}g`, icon: Zap, color: 'text-green-400', desc: `Target: ${metrics.macroDistribution?.fiberMin || 25}g` },
          { label: 'Avg Sodium', value: `${averages.sodium}mg`, icon: Droplets, color: 'text-blue-400', desc: `Limit: ${metrics.sodiumLimit || 2300}mg` },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
            <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Macro trends line chart */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Daily Macro Trends (grams)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="carbs" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Carbs" />
                <Line type="monotone" dataKey="protein" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Protein" />
                <Line type="monotone" dataKey="fat" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Fat" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Nutrient balance radar */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Nutrient Balance Score
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="nutrient" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Balance" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Calorie trend */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            Daily Calorie Intake
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="calories" fill="#10b981" radius={[6, 6, 0, 0]} name="Calories" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Condition insights */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            {condition} Management Insights
          </h3>
          <div className="space-y-4">
            {conditionInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/30">
                <span className="text-2xl">{insight.icon}</span>
                <div>
                  <div className="font-medium text-white text-sm">{insight.label}</div>
                  <div className={`text-xs ${insight.color}`}>{insight.status}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Macro distribution */}
          <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="text-xs text-primary font-medium mb-3">Target Macro Distribution</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Carbs', value: `${metrics.macroDistribution?.carbs.target || 0}%`, actual: `${Math.round((averages.carbs * 4) / (averages.calories || 1) * 100)}%` },
                { label: 'Protein', value: `${metrics.macroDistribution?.protein.target || 0}%`, actual: `${Math.round((averages.protein * 4) / (averages.calories || 1) * 100)}%` },
                { label: 'Fat', value: `${metrics.macroDistribution?.fat.target || 0}%`, actual: `${Math.round((averages.fat * 9) / (averages.calories || 1) * 100)}%` },
              ].map((m, i) => (
                <div key={i}>
                  <div className="text-xs text-slate-500">{m.label}</div>
                  <div className="text-lg font-bold text-white">{m.actual}</div>
                  <div className="text-xs text-slate-600">goal: {m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Fiber & Sodium trends */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Fiber & Sodium Daily Trends
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="fiber" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="Fiber (g)" />
              <Line yAxisId="right" type="monotone" dataKey="sodium" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4 }} name="Sodium (mg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowLeft, User, Heart, Utensils, Target, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { saveProfile, saveMealPlan, setOnboarded, saveMetrics } from '../utils/storage';
import { generateMealPlan } from '../utils/mealPlanner';
import { calculateAllMetrics } from '../utils/calculations';

const STEPS = [
  { title: 'Your Condition', icon: Heart, sub: 'Select your primary health condition' },
  { title: 'Personal Info', icon: User, sub: 'Help us calculate your nutrition needs' },
  { title: 'Health Details', icon: Heart, sub: 'Medications, allergies & more' },
  { title: 'Diet Preferences', icon: Utensils, sub: 'What and how you like to eat' },
  { title: 'Your Goals', icon: Target, sub: 'What you want to achieve' }
];

const conditions = [
  { id: 'PCOS', label: 'PCOS', desc: 'Polycystic Ovary Syndrome', gradient: 'from-purple-500 to-pink-500' },
  { id: 'Diabetes', label: 'Diabetes Type 2', desc: 'Blood sugar management', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'Hypertension', label: 'Hypertension', desc: 'High blood pressure', gradient: 'from-rose-500 to-red-500' }
];

export default function Onboarding({ onComplete }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);

  const [profile, setProfile] = useState({
    personalInfo: { age: '', gender: 'female', height: '', weight: '', activityLevel: 'moderate' },
    health: { primaryCondition: location.state?.condition || '', duration: '', medications: [], allergies: [], intolerances: [], comorbidities: [] },
    dietary: { vegetarian: false, vegan: false, cuisinePreferences: [], dislikedFoods: [], mealsPerDay: 4, cookingSkillLevel: 'intermediate' },
    goals: { weightLoss: true, weightTarget: '', primaryGoal: 'Manage condition through diet', secondaryGoals: [] }
  });

  const [medInput, setMedInput] = useState('');
  const [allergyInput, setAllergyInput] = useState('');

  const upPersonal = (f, v) => setProfile(p => ({ ...p, personalInfo: { ...p.personalInfo, [f]: v } }));
  const upHealth = (f, v) => setProfile(p => ({ ...p, health: { ...p.health, [f]: v } }));
  const upDiet = (f, v) => setProfile(p => ({ ...p, dietary: { ...p.dietary, [f]: v } }));
  const upGoals = (f, v) => setProfile(p => ({ ...p, goals: { ...p.goals, [f]: v } }));

  const addMed = () => { if (medInput.trim()) { upHealth('medications', [...profile.health.medications, medInput.trim()]); setMedInput(''); } };
  const rmMed = (i) => upHealth('medications', profile.health.medications.filter((_, x) => x !== i));
  const addAllergy = () => { if (allergyInput.trim()) { upHealth('allergies', [...profile.health.allergies, allergyInput.trim()]); setAllergyInput(''); } };
  const rmAllergy = (i) => upHealth('allergies', profile.health.allergies.filter((_, x) => x !== i));

  const canGo = () => {
    if (step === 0) return !!profile.health.primaryCondition;
    if (step === 1) return profile.personalInfo.age && profile.personalInfo.height && profile.personalInfo.weight;
    return true;
  };

  const handleFinish = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    const final = {
      ...profile,
      personalInfo: { ...profile.personalInfo, age: +profile.personalInfo.age, height: +profile.personalInfo.height, weight: +profile.personalInfo.weight }
    };
    const metrics = calculateAllMetrics(final);
    const plan = generateMealPlan(final);
    saveProfile(final); saveMetrics(metrics); saveMealPlan(plan); setOnboarded(true);
    onComplete(final, plan);
    navigate('/dashboard');
  };

  const next = () => step < STEPS.length - 1 ? setStep(s => s + 1) : handleFinish();
  const prev = () => step > 0 && setStep(s => s - 1);

  if (generating) {
    return (
      <div className="min-h-screen bg-[#080c16] flex items-center justify-center">
        <div className="text-center animate-fade-in-up px-6">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center animate-pulse-glow">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Generating Your Plan</h2>
          <p className="text-sm text-slate-400 mb-5">Creating a personalized 7-day meal plan...</p>
          <Loader2 className="w-5 h-5 text-primary mx-auto animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c16] flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-8 py-4 border-b border-white/[0.04]">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-slate-500 hover:text-white text-sm transition-colors font-medium">← Back</button>
          <span className="text-sm font-medium text-slate-500">Step {step + 1} / {STEPS.length}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 sm:px-8 pt-6">
        <div className="max-w-xl mx-auto">
          <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full progress-fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-8 py-10 overflow-y-auto">
        <div className="max-w-xl mx-auto animate-fade-in" key={step}>
          <div className="text-center mb-10">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
              {(() => { const I = STEPS[step].icon; return <I className="w-6 h-6 text-primary" />; })()}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{STEPS[step].title}</h2>
            <p className="text-sm sm:text-base text-slate-400">{STEPS[step].sub}</p>
          </div>

          {/* Step 0: Condition */}
          {step === 0 && (
            <div className="space-y-3 sm:space-y-4">
              {conditions.map(opt => (
                <button key={opt.id} onClick={() => upHealth('primaryCondition', opt.id)}
                  className={`glass-interactive w-full p-5 sm:p-6 text-left flex items-center gap-4 ${profile.health.primaryCondition === opt.id ? 'border-primary/40 bg-primary/[0.06] shadow-lg shadow-primary/5' : ''}`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${opt.gradient} flex items-center justify-center shrink-0`}>
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base sm:text-lg font-bold text-white mb-0.5">{opt.label}</div>
                    <div className="text-sm text-slate-400">{opt.desc}</div>
                  </div>
                  {profile.health.primaryCondition === opt.id && <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />}
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Age</label>
                  <input type="number" placeholder="28" value={profile.personalInfo.age} onChange={e => upPersonal('age', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Gender</label>
                  <select value={profile.personalInfo.gender} onChange={e => upPersonal('gender', e.target.value)}>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Height (cm)</label>
                  <input type="number" placeholder="165" value={profile.personalInfo.height} onChange={e => upPersonal('height', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Weight (kg)</label>
                  <input type="number" placeholder="70" value={profile.personalInfo.weight} onChange={e => upPersonal('weight', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Activity Level</label>
                <select value={profile.personalInfo.activityLevel} onChange={e => upPersonal('activityLevel', e.target.value)}>
                  <option value="sedentary">Sedentary (little exercise)</option>
                  <option value="light">Light (1-3 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                  <option value="very_active">Very Active (intense daily)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Health */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">How long have you had {profile.health.primaryCondition}? (years)</label>
                <input type="number" placeholder="3" value={profile.health.duration} onChange={e => upHealth('duration', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Current Medications</label>
                <div className="flex gap-2 sm:gap-3">
                  <input placeholder="e.g., Metformin 500mg" value={medInput} onChange={e => setMedInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMed()} />
                  <button onClick={addMed} className="btn-secondary shrink-0 py-2.5 px-5">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {profile.health.medications.map((m, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/8 text-primary text-xs">
                      {m} <button onClick={() => rmMed(i)} className="hover:text-red-400 ml-0.5">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Food Allergies</label>
                <div className="flex gap-2 sm:gap-3">
                  <input placeholder="e.g., peanuts, shellfish" value={allergyInput} onChange={e => setAllergyInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addAllergy()} />
                  <button onClick={addAllergy} className="btn-secondary shrink-0 py-2.5 px-5">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {profile.health.allergies.map((a, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/8 text-red-400 text-xs">
                      {a} <button onClick={() => rmAllergy(i)} className="hover:text-red-300 ml-0.5">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Diet */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[{ key: 'vegetarian', icon: '🥦', label: 'Vegetarian', desc: 'No meat or fish' }, { key: 'vegan', icon: '🌱', label: 'Vegan', desc: 'No animal products' }].map(d => (
                  <button key={d.key} onClick={() => upDiet(d.key, !profile.dietary[d.key])}
                    className={`glass-interactive p-4 text-center ${profile.dietary[d.key] ? 'border-green-500/30 bg-green-500/[0.04] shadow-sm shadow-green-500/10' : ''}`}>
                    <div className="text-3xl mb-2">{d.icon}</div>
                    <div className="text-sm font-bold text-white mb-1">{d.label}</div>
                    <div className="text-[0.6875rem] text-slate-400">{d.desc}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Cuisines</label>
                <div className="flex flex-wrap gap-2">
                  {['Indian', 'Mediterranean', 'Asian', 'Mexican', 'Global'].map(c => (
                    <button key={c} onClick={() => {
                      const curr = profile.dietary.cuisinePreferences;
                      upDiet('cuisinePreferences', curr.includes(c) ? curr.filter(x => x !== c) : [...curr, c]);
                    }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        profile.dietary.cuisinePreferences.includes(c) ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-white/[0.03] text-slate-400 border border-white/[0.04] hover:bg-white/[0.05]'
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Cooking Skill</label>
                <select value={profile.dietary.cookingSkillLevel} onChange={e => upDiet('cookingSkillLevel', e.target.value)}>
                  <option value="beginner">Beginner (quick & easy)</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced (complex meals)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Meals Per Day</label>
                <div className="flex gap-3">
                  {[3, 4, 5].map(n => (
                    <button key={n} onClick={() => upDiet('mealsPerDay', n)}
                      className={`flex-1 py-2.5 rounded-lg text-center text-xs font-medium transition-colors ${
                        profile.dietary.mealsPerDay === n ? 'bg-primary/15 text-primary border border-primary/20' : 'bg-white/[0.03] text-slate-400 border border-white/[0.04]'
                      }`}>
                      {n} meals
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Goals */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Primary Goal</label>
                <select value={profile.goals.primaryGoal} onChange={e => upGoals('primaryGoal', e.target.value)}>
                  <option value="Manage condition through diet">Manage condition through diet</option>
                  <option value="Weight loss">Weight loss</option>
                  <option value="Better energy levels">Better energy</option>
                  <option value="Reduce symptoms">Reduce symptoms</option>
                  <option value="Improve blood markers">Improve blood markers</option>
                </select>
              </div>

              <label className="glass-interactive flex items-start gap-3 p-5 cursor-pointer">
                <input type="checkbox" checked={profile.goals.weightLoss} onChange={e => upGoals('weightLoss', e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-slate-600 bg-slate-800 text-primary" />
                <div>
                  <div className="text-sm font-medium text-white mb-0.5">I want to lose weight</div>
                  <div className="text-xs text-slate-400">500 kcal/day deficit (~0.5 kg/week)</div>
                </div>
              </label>

              {profile.goals.weightLoss && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Target Weight (kg)</label>
                  <input type="number" placeholder="65" value={profile.goals.weightTarget} onChange={e => upGoals('weightTarget', e.target.value)} />
                </div>
              )}

              <div className="glass-interactive p-5 sm:p-6 border-primary/20 bg-primary/[0.03]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-white mb-1">Ready to generate!</div>
                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      We'll create a personalized 7-day plan for your {profile.health.primaryCondition} condition. Click "Generate Plan" below.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="px-4 sm:px-8 py-4 border-t border-white/[0.04] bg-[#080c16]/80 backdrop-blur-md sticky bottom-0 z-10">
        <div className="max-w-xl mx-auto flex justify-between">
          <button onClick={prev} disabled={step === 0} className="btn-secondary disabled:opacity-25 disabled:cursor-not-allowed">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </button>
          <button onClick={next} disabled={!canGo()} className="btn-primary disabled:opacity-25 disabled:cursor-not-allowed px-8 shadow-lg shadow-primary/20">
            {step === STEPS.length - 1 ? <><span>Generate Plan</span> <Sparkles className="w-4 h-4 ml-1.5" /></> : <><span>Continue</span> <ArrowRight className="w-4 h-4 ml-1.5" /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

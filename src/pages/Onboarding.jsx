import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowLeft, User, Heart, Utensils, Target, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { saveProfile, saveMealPlan, setOnboarded, saveMetrics } from '../utils/storage';
import { generateMealPlan } from '../utils/mealPlanner';
import { calculateAllMetrics } from '../utils/calculations';

const STEPS = [
  { title: 'Your Condition', icon: Heart, subtitle: 'Select your primary health condition' },
  { title: 'Personal Info', icon: User, subtitle: 'Help us calculate your nutrition needs' },
  { title: 'Health Details', icon: Heart, subtitle: 'Medications, allergies & more' },
  { title: 'Diet Preferences', icon: Utensils, subtitle: 'What and how you like to eat' },
  { title: 'Your Goals', icon: Target, subtitle: 'What you want to achieve' }
];

const conditionOptions = [
  { id: 'PCOS', label: 'PCOS', desc: 'Polycystic Ovary Syndrome', gradient: 'from-purple-500 to-pink-500' },
  { id: 'Diabetes', label: 'Diabetes Type 2', desc: 'Blood sugar management', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'Hypertension', label: 'Hypertension', desc: 'High blood pressure control', gradient: 'from-rose-500 to-red-500' }
];

export default function Onboarding({ onComplete }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);

  const [profile, setProfile] = useState({
    personalInfo: {
      age: '', gender: 'female', height: '', weight: '', activityLevel: 'moderate'
    },
    health: {
      primaryCondition: location.state?.condition || '',
      duration: '',
      medications: [],
      allergies: [],
      intolerances: [],
      comorbidities: []
    },
    dietary: {
      vegetarian: false,
      vegan: false,
      cuisinePreferences: [],
      dislikedFoods: [],
      mealsPerDay: 4,
      cookingSkillLevel: 'intermediate'
    },
    goals: {
      weightLoss: true,
      weightTarget: '',
      primaryGoal: 'Manage condition through diet',
      secondaryGoals: []
    }
  });

  const [medInput, setMedInput] = useState('');
  const [allergyInput, setAllergyInput] = useState('');

  const updatePersonal = (field, value) => {
    setProfile(p => ({ ...p, personalInfo: { ...p.personalInfo, [field]: value } }));
  };
  const updateHealth = (field, value) => {
    setProfile(p => ({ ...p, health: { ...p.health, [field]: value } }));
  };
  const updateDietary = (field, value) => {
    setProfile(p => ({ ...p, dietary: { ...p.dietary, [field]: value } }));
  };
  const updateGoals = (field, value) => {
    setProfile(p => ({ ...p, goals: { ...p.goals, [field]: value } }));
  };

  const addMedication = () => {
    if (medInput.trim()) {
      updateHealth('medications', [...profile.health.medications, medInput.trim()]);
      setMedInput('');
    }
  };
  const removeMedication = (i) => {
    updateHealth('medications', profile.health.medications.filter((_, idx) => idx !== i));
  };

  const addAllergy = () => {
    if (allergyInput.trim()) {
      updateHealth('allergies', [...profile.health.allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };
  const removeAllergy = (i) => {
    updateHealth('allergies', profile.health.allergies.filter((_, idx) => idx !== i));
  };

  const canProceed = () => {
    switch (step) {
      case 0: return !!profile.health.primaryCondition;
      case 1: return profile.personalInfo.age && profile.personalInfo.height && profile.personalInfo.weight;
      default: return true;
    }
  };

  const handleFinish = async () => {
    setGenerating(true);
    // Small delay for the animation
    await new Promise(r => setTimeout(r, 1500));

    const finalProfile = {
      ...profile,
      personalInfo: {
        ...profile.personalInfo,
        age: Number(profile.personalInfo.age),
        height: Number(profile.personalInfo.height),
        weight: Number(profile.personalInfo.weight)
      }
    };

    const metrics = calculateAllMetrics(finalProfile);
    const mealPlan = generateMealPlan(finalProfile);

    saveProfile(finalProfile);
    saveMetrics(metrics);
    saveMealPlan(mealPlan);
    setOnboarded(true);

    onComplete(finalProfile, mealPlan);
    navigate('/dashboard');
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else handleFinish();
  };
  const prev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  // Generating screen
  if (generating) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center animate-pulse-glow">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Generating Your Plan</h2>
          <p className="text-slate-400 mb-6">Analyzing your profile & creating a personalized 7-day meal plan...</p>
          <Loader2 className="w-8 h-8 text-primary mx-auto animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark flex flex-col">
      {/* Top bar */}
      <div className="px-6 py-4 border-b border-slate-800">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white text-sm transition-colors">
            ← Back
          </button>
          <span className="text-sm text-slate-500">Step {step + 1} of {STEPS.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 pt-4">
        <div className="max-w-2xl mx-auto">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full progress-fill"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-10 overflow-y-auto">
        <div className="max-w-2xl mx-auto animate-fade-in" key={step}>
          {/* Step header */}
          <div className="text-center mb-10">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              {(() => { const Icon = STEPS[step].icon; return <Icon className="w-7 h-7 text-primary" />; })()}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{STEPS[step].title}</h2>
            <p className="text-slate-400">{STEPS[step].subtitle}</p>
          </div>

          {/* Step 0: Condition */}
          {step === 0 && (
            <div className="grid gap-4">
              {conditionOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => updateHealth('primaryCondition', opt.id)}
                  className={`glass-card p-5 text-left flex items-center gap-4 transition-all ${
                    profile.health.primaryCondition === opt.id
                      ? 'border-primary/50 bg-primary/5'
                      : 'hover:border-slate-600'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${opt.gradient} flex items-center justify-center shrink-0`}>
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{opt.label}</div>
                    <div className="text-sm text-slate-400">{opt.desc}</div>
                  </div>
                  {profile.health.primaryCondition === opt.id && (
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Age</label>
                  <input type="number" placeholder="28" value={profile.personalInfo.age}
                    onChange={e => updatePersonal('age', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Gender</label>
                  <select value={profile.personalInfo.gender}
                    onChange={e => updatePersonal('gender', e.target.value)}>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Height (cm)</label>
                  <input type="number" placeholder="165" value={profile.personalInfo.height}
                    onChange={e => updatePersonal('height', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Weight (kg)</label>
                  <input type="number" placeholder="70" value={profile.personalInfo.weight}
                    onChange={e => updatePersonal('weight', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Activity Level</label>
                <select value={profile.personalInfo.activityLevel}
                  onChange={e => updatePersonal('activityLevel', e.target.value)}>
                  <option value="sedentary">Sedentary (little exercise)</option>
                  <option value="light">Light (1-3 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                  <option value="very_active">Very Active (intense daily)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Health Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  How long have you had {profile.health.primaryCondition}? (years)
                </label>
                <input type="number" placeholder="3" value={profile.health.duration}
                  onChange={e => updateHealth('duration', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Current Medications</label>
                <div className="flex gap-2">
                  <input placeholder="e.g., Metformin 500mg" value={medInput}
                    onChange={e => setMedInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addMedication()} />
                  <button onClick={addMedication} className="btn-secondary shrink-0">Add</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.health.medications.map((med, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      {med}
                      <button onClick={() => removeMedication(i)} className="hover:text-red-400 ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Food Allergies</label>
                <div className="flex gap-2">
                  <input placeholder="e.g., peanuts, shellfish" value={allergyInput}
                    onChange={e => setAllergyInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addAllergy()} />
                  <button onClick={addAllergy} className="btn-secondary shrink-0">Add</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.health.allergies.map((allergy, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm">
                      {allergy}
                      <button onClick={() => removeAllergy(i)} className="hover:text-red-300 ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Diet Preferences */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updateDietary('vegetarian', !profile.dietary.vegetarian)}
                  className={`glass-card p-4 text-center transition-all ${
                    profile.dietary.vegetarian ? 'border-green-500/50 bg-green-500/5' : ''
                  }`}
                >
                  <div className="text-2xl mb-2">🥦</div>
                  <div className="font-medium text-white">Vegetarian</div>
                  <div className="text-xs text-slate-400">No meat or fish</div>
                </button>
                <button
                  onClick={() => updateDietary('vegan', !profile.dietary.vegan)}
                  className={`glass-card p-4 text-center transition-all ${
                    profile.dietary.vegan ? 'border-green-500/50 bg-green-500/5' : ''
                  }`}
                >
                  <div className="text-2xl mb-2">🌱</div>
                  <div className="font-medium text-white">Vegan</div>
                  <div className="text-xs text-slate-400">No animal products</div>
                </button>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Preferred Cuisines</label>
                <div className="flex flex-wrap gap-2">
                  {['Indian', 'Mediterranean', 'Asian', 'Mexican', 'Global'].map(cuisine => (
                    <button
                      key={cuisine}
                      onClick={() => {
                        const current = profile.dietary.cuisinePreferences;
                        updateDietary('cuisinePreferences',
                          current.includes(cuisine)
                            ? current.filter(c => c !== cuisine)
                            : [...current, cuisine]
                        );
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        profile.dietary.cuisinePreferences.includes(cuisine)
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Cooking Skill Level</label>
                <select value={profile.dietary.cookingSkillLevel}
                  onChange={e => updateDietary('cookingSkillLevel', e.target.value)}>
                  <option value="beginner">Beginner (quick & easy recipes)</option>
                  <option value="intermediate">Intermediate (can follow most recipes)</option>
                  <option value="advanced">Advanced (enjoy cooking complex meals)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Meals Per Day</label>
                <div className="flex gap-3">
                  {[3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => updateDietary('mealsPerDay', n)}
                      className={`flex-1 py-3 rounded-xl text-center font-medium transition-all ${
                        profile.dietary.mealsPerDay === n
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
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
                <label className="block text-sm text-slate-400 mb-2">Primary Goal</label>
                <select value={profile.goals.primaryGoal}
                  onChange={e => updateGoals('primaryGoal', e.target.value)}>
                  <option value="Manage condition through diet">Manage condition through diet</option>
                  <option value="Weight loss">Weight loss</option>
                  <option value="Better energy levels">Better energy levels</option>
                  <option value="Reduce symptoms">Reduce symptoms</option>
                  <option value="Improve blood markers">Improve blood markers</option>
                </select>
              </div>

              <div className="glass-card p-5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.goals.weightLoss}
                    onChange={e => updateGoals('weightLoss', e.target.checked)}
                    className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary/50"
                  />
                  <div>
                    <div className="font-medium text-white">I want to lose weight</div>
                    <div className="text-sm text-slate-400">We'll create a 500 kcal/day deficit (~0.5 kg/week)</div>
                  </div>
                </label>
              </div>

              {profile.goals.weightLoss && (
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Target Weight (kg)</label>
                  <input type="number" placeholder="65" value={profile.goals.weightTarget}
                    onChange={e => updateGoals('weightTarget', e.target.value)} />
                </div>
              )}

              <div className="glass-card p-5 bg-primary/5 border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-white mb-1">Ready to generate your plan!</div>
                    <div className="text-sm text-slate-400">
                      We'll create a personalized 7-day meal plan based on your {profile.health.primaryCondition} condition,
                      preferences, and goals. Click "Generate Plan" to get started.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="px-6 py-4 border-t border-slate-800 bg-surface-dark/80 backdrop-blur">
        <div className="max-w-2xl mx-auto flex justify-between">
          <button
            onClick={prev}
            disabled={step === 0}
            className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={next}
            disabled={!canProceed()}
            className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {step === STEPS.length - 1 ? (
              <>Generate Plan <Sparkles className="w-4 h-4" /></>
            ) : (
              <>Continue <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

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
  { id: 'PCOS', label: 'PCOS', desc: 'Polycystic Ovary Syndrome', gradient: 'linear-gradient(135deg, #a855f7, #ec4899)' },
  { id: 'Diabetes', label: 'Diabetes Type 2', desc: 'Blood sugar management', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
  { id: 'Hypertension', label: 'Hypertension', desc: 'High blood pressure', gradient: 'linear-gradient(135deg, #f43f5e, #ef4444)' }
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

  // Shared styles
  const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#cbd5e1', marginBottom: 8 };
  const chipStyle = (active) => ({
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '4px 10px', borderRadius: 8,
    fontSize: '0.75rem', border: 'none', cursor: 'pointer',
    background: active ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
    color: active ? '#34d399' : '#f87171',
    transition: 'all 0.2s',
  });

  if (generating) {
    return (
      <div style={{
        minHeight: '100vh', background: '#080c16',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div className="animate-fade-in-up" style={{ textAlign: 'center', padding: '0 24px' }}>
          <div className="animate-pulse-glow" style={{
            width: 56, height: 56, margin: '0 auto 20px', borderRadius: 16,
            background: 'linear-gradient(135deg, #10b981, #0d9488)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles style={{ width: 28, height: 28, color: 'white' }} />
          </div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', marginBottom: 8 }}>Generating Your Plan</h2>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: 20 }}>Creating a personalized 7-day meal plan...</p>
          <Loader2 style={{ width: 20, height: 20, color: '#10b981', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#080c16',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate('/')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748b', fontSize: '0.875rem', fontWeight: 500,
            transition: 'color 0.2s',
          }}>
            ← Back
          </button>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>
            Step {step + 1} / {STEPS.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.03)', borderRadius: 999, overflow: 'hidden' }}>
            <div className="progress-fill" style={{
              height: '100%',
              background: 'linear-gradient(90deg, #10b981, #2dd4bf)',
              borderRadius: 999,
              width: `${((step + 1) / STEPS.length) * 100}%`,
            }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '40px 24px', overflowY: 'auto' }}>
        <div className="animate-fade-in" key={step} style={{ maxWidth: 560, margin: '0 auto' }}>
          {/* Step Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              width: 48, height: 48, margin: '0 auto 16px', borderRadius: 12,
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {(() => { const I = STEPS[step].icon; return <I style={{ width: 24, height: 24, color: '#10b981' }} />; })()}
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', fontWeight: 700, color: 'white', marginBottom: 8 }}>
              {STEPS[step].title}
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#94a3b8' }}>{STEPS[step].sub}</p>
          </div>

          {/* Step 0: Condition */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {conditions.map(opt => {
                const selected = profile.health.primaryCondition === opt.id;
                return (
                  <button key={opt.id} onClick={() => upHealth('primaryCondition', opt.id)}
                    className="glass-interactive"
                    style={{
                      width: '100%', padding: '20px 24px',
                      display: 'flex', alignItems: 'center', gap: 16,
                      textAlign: 'left',
                      borderColor: selected ? 'rgba(16,185,129,0.4)' : undefined,
                      background: selected ? 'rgba(16,185,129,0.06)' : undefined,
                      boxShadow: selected ? '0 4px 16px rgba(16,185,129,0.05)' : undefined,
                    }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                      background: opt.gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Heart style={{ width: 24, height: 24, color: 'white' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'white', marginBottom: 2 }}>{opt.label}</div>
                      <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{opt.desc}</div>
                    </div>
                    {selected && <CheckCircle2 style={{ width: 24, height: 24, color: '#10b981', flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Age</label>
                  <input type="number" placeholder="28" value={profile.personalInfo.age} onChange={e => upPersonal('age', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Gender</label>
                  <select value={profile.personalInfo.gender} onChange={e => upPersonal('gender', e.target.value)}>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Height (cm)</label>
                  <input type="number" placeholder="165" value={profile.personalInfo.height} onChange={e => upPersonal('height', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Weight (kg)</label>
                  <input type="number" placeholder="70" value={profile.personalInfo.weight} onChange={e => upPersonal('weight', e.target.value)} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Activity Level</label>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={labelStyle}>How long have you had {profile.health.primaryCondition}? (years)</label>
                <input type="number" placeholder="3" value={profile.health.duration} onChange={e => upHealth('duration', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Current Medications</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input placeholder="e.g., Metformin 500mg" value={medInput} onChange={e => setMedInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMed()} />
                  <button onClick={addMed} className="btn-secondary" style={{ flexShrink: 0, padding: '10px 20px' }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {profile.health.medications.map((m, i) => (
                    <span key={i} style={chipStyle(true)}>
                      {m} <button onClick={() => rmMed(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', marginLeft: 2, fontSize: '1rem' }}>×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Food Allergies</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input placeholder="e.g., peanuts, shellfish" value={allergyInput} onChange={e => setAllergyInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addAllergy()} />
                  <button onClick={addAllergy} className="btn-secondary" style={{ flexShrink: 0, padding: '10px 20px' }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {profile.health.allergies.map((a, i) => (
                    <span key={i} style={chipStyle(false)}>
                      {a} <button onClick={() => rmAllergy(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', marginLeft: 2, fontSize: '1rem' }}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Diet */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[{ key: 'vegetarian', icon: '🥦', label: 'Vegetarian', desc: 'No meat or fish' }, { key: 'vegan', icon: '🌱', label: 'Vegan', desc: 'No animal products' }].map(d => (
                  <button key={d.key} onClick={() => upDiet(d.key, !profile.dietary[d.key])}
                    className="glass-interactive"
                    style={{
                      padding: 16, textAlign: 'center',
                      borderColor: profile.dietary[d.key] ? 'rgba(34,197,94,0.3)' : undefined,
                      background: profile.dietary[d.key] ? 'rgba(34,197,94,0.04)' : undefined,
                    }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>{d.icon}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', marginBottom: 4 }}>{d.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{d.desc}</div>
                  </button>
                ))}
              </div>

              <div>
                <label style={labelStyle}>Preferred Cuisines</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['Indian', 'Mediterranean', 'Asian', 'Mexican', 'Global'].map(c => {
                    const sel = profile.dietary.cuisinePreferences.includes(c);
                    return (
                      <button key={c} onClick={() => {
                        const curr = profile.dietary.cuisinePreferences;
                        upDiet('cuisinePreferences', curr.includes(c) ? curr.filter(x => x !== c) : [...curr, c]);
                      }} style={{
                        padding: '8px 16px', borderRadius: 12,
                        fontSize: '0.875rem', fontWeight: 500,
                        border: `1px solid ${sel ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.04)'}`,
                        background: sel ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
                        color: sel ? '#10b981' : '#94a3b8',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}>
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Cooking Skill</label>
                <select value={profile.dietary.cookingSkillLevel} onChange={e => upDiet('cookingSkillLevel', e.target.value)}>
                  <option value="beginner">Beginner (quick & easy)</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced (complex meals)</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Meals Per Day</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[3, 4, 5].map(n => {
                    const sel = profile.dietary.mealsPerDay === n;
                    return (
                      <button key={n} onClick={() => upDiet('mealsPerDay', n)}
                        style={{
                          flex: 1, padding: '10px 0', borderRadius: 10,
                          textAlign: 'center', fontSize: '0.8125rem', fontWeight: 500,
                          border: `1px solid ${sel ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)'}`,
                          background: sel ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
                          color: sel ? '#10b981' : '#94a3b8',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                        {n} meals
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Goals */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={labelStyle}>Primary Goal</label>
                <select value={profile.goals.primaryGoal} onChange={e => upGoals('primaryGoal', e.target.value)}>
                  <option value="Manage condition through diet">Manage condition through diet</option>
                  <option value="Weight loss">Weight loss</option>
                  <option value="Better energy levels">Better energy</option>
                  <option value="Reduce symptoms">Reduce symptoms</option>
                  <option value="Improve blood markers">Improve blood markers</option>
                </select>
              </div>

              <label className="glass-interactive" style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, padding: 20, cursor: 'pointer',
              }}>
                <input type="checkbox" checked={profile.goals.weightLoss} onChange={e => upGoals('weightLoss', e.target.checked)}
                  style={{ width: 20, height: 20, marginTop: 2, accentColor: '#10b981' }} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'white', marginBottom: 2 }}>I want to lose weight</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>500 kcal/day deficit (~0.5 kg/week)</div>
                </div>
              </label>

              {profile.goals.weightLoss && (
                <div>
                  <label style={labelStyle}>Target Weight (kg)</label>
                  <input type="number" placeholder="65" value={profile.goals.weightTarget} onChange={e => upGoals('weightTarget', e.target.value)} />
                </div>
              )}

              <div className="glass-interactive" style={{
                padding: '20px 24px',
                borderColor: 'rgba(16,185,129,0.2)',
                background: 'rgba(16,185,129,0.03)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(16,185,129,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Sparkles style={{ width: 20, height: 20, color: '#10b981' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'white', marginBottom: 4 }}>Ready to generate!</div>
                    <div style={{ fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: 1.6 }}>
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
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(8,12,22,0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', bottom: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={prev} disabled={step === 0} className="btn-secondary"
            style={{ opacity: step === 0 ? 0.25 : 1, cursor: step === 0 ? 'not-allowed' : 'pointer' }}>
            <ArrowLeft style={{ width: 16, height: 16, marginRight: 6 }} /> Back
          </button>
          <button onClick={next} disabled={!canGo()} className="btn-primary"
            style={{
              padding: '11px 32px',
              opacity: canGo() ? 1 : 0.25,
              cursor: canGo() ? 'pointer' : 'not-allowed',
              boxShadow: '0 4px 16px rgba(16,185,129,0.2)',
            }}>
            {step === STEPS.length - 1
              ? <><span>Generate Plan</span> <Sparkles style={{ width: 16, height: 16, marginLeft: 6 }} /></>
              : <><span>Continue</span> <ArrowRight style={{ width: 16, height: 16, marginLeft: 6 }} /></>
            }
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

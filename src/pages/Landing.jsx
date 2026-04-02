import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Droplets, ArrowRight, Sparkles, Shield, ChartBar, Utensils, ChevronRight } from 'lucide-react';

const conditions = [
  {
    id: 'PCOS', name: 'PCOS', full: 'Polycystic Ovary Syndrome',
    icon: Sparkles, color: 'from-purple-500 to-pink-500',
    desc: 'Hormone balance, anti-inflammatory diet, insulin management',
    features: ['Low GI carbs', 'Anti-inflammatory foods', 'Inositol-rich meals', 'Hormone support']
  },
  {
    id: 'Diabetes', name: 'Diabetes Type 2', full: 'Type 2 Diabetes Mellitus',
    icon: Activity, color: 'from-blue-500 to-cyan-500',
    desc: 'Blood sugar control, consistent carb management, weight support',
    features: ['Glycemic control', 'Carb counting', 'Plate method', 'Medication support']
  },
  {
    id: 'Hypertension', name: 'Hypertension', full: 'High Blood Pressure',
    icon: Heart, color: 'from-rose-500 to-red-500',
    desc: 'DASH diet, sodium reduction, potassium balance, heart health',
    features: ['DASH framework', 'Sodium tracking', 'Potassium balance', 'Heart-healthy fats']
  }
];

const stats = [
  { value: '500+', label: 'Recipes', icon: Utensils },
  { value: '3', label: 'Conditions', icon: Shield },
  { value: '7-Day', label: 'Meal Plans', icon: ChartBar },
  { value: '100%', label: 'Personalized', icon: Sparkles }
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080c16',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-30%', left: '5%',
          width: 400, height: 400,
          background: 'rgba(16, 185, 129, 0.03)',
          borderRadius: '50%', filter: 'blur(100px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '10%',
          width: 350, height: 350,
          background: 'rgba(14, 165, 233, 0.02)',
          borderRadius: '50%', filter: 'blur(80px)',
        }} />
      </div>

      <div style={{ position: 'relative' }}>
        {/* Nav */}
        <nav style={{
          maxWidth: 960, margin: '0 auto',
          padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #10b981, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
            }}>
              <Droplets style={{ width: 20, height: 20, color: 'white' }} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>NutriCare</span>
          </div>
          <button onClick={() => navigate('/onboarding')} className="btn-primary" style={{ fontSize: '0.875rem', padding: '10px 24px' }}>
            Get Started <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
        </nav>

        {/* Hero */}
        <div className="animate-fade-in-up" style={{
          textAlign: 'center',
          maxWidth: 800,
          margin: '0 auto',
          padding: '64px 24px 64px',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 999,
            background: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.1)',
            color: '#10b981', fontSize: '0.875rem', fontWeight: 500,
            marginBottom: 32,
          }}>
            <Sparkles style={{ width: 16, height: 16 }} />
            Science-Backed Nutrition Plans
          </div>

          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 4.25rem)',
            fontWeight: 800, color: 'white',
            lineHeight: 1.1, marginBottom: 24,
            letterSpacing: '-0.02em',
          }}>
            Your Personalized
            <br />
            <span className="gradient-text">Diet Planner</span>
          </h1>

          <p style={{
            fontSize: '1.0625rem', color: '#94a3b8',
            maxWidth: 560, margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            Clinically-informed meal plans for{' '}
            <strong style={{ color: '#cbd5e1', fontWeight: 500 }}>PCOS</strong>,{' '}
            <strong style={{ color: '#cbd5e1', fontWeight: 500 }}>Diabetes</strong>, and{' '}
            <strong style={{ color: '#cbd5e1', fontWeight: 500 }}>Hypertension</strong>{' '}
            — backed by evidence-based nutrition science.
          </p>

          <button
            onClick={() => navigate('/onboarding')}
            className="btn-primary animate-pulse-glow"
            style={{ fontSize: '1.125rem', padding: '16px 40px' }}
          >
            Start Your Free Plan <ArrowRight style={{ width: 20, height: 20, marginLeft: 4 }} />
          </button>
        </div>

        {/* Stats */}
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 64px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}>
            {stats.map((s, i) => (
              <div key={i} className={`stat-card animate-fade-in-up stagger-${i + 1}`}
                style={{ textAlign: 'center', opacity: 0, padding: '20px 12px' }}>
                <s.icon style={{ width: 20, height: 20, color: '#10b981', margin: '0 auto 12px' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', lineHeight: 1, marginBottom: 6 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Condition Cards */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>CONDITIONS WE SUPPORT</div>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 700, color: 'white',
              letterSpacing: '-0.02em', marginBottom: 16,
            }}>
              Choose Your Condition
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9375rem', maxWidth: 480, margin: '0 auto' }}>
              Evidence-based dietary guidelines tailored to your specific condition
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {conditions.map((c, i) => (
              <button
                key={c.id}
                onClick={() => navigate('/onboarding', { state: { condition: c.id } })}
                className={`glass-interactive animate-fade-in-up stagger-${i + 1}`}
                style={{
                  opacity: 0,
                  padding: '32px 24px',
                  textAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}
              >
                <div className={`bg-gradient-to-br ${c.color}`} style={{
                  width: 56, height: 56, borderRadius: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s ease',
                }}>
                  <c.icon style={{ width: 28, height: 28, color: 'white' }} />
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: 6 }}>
                  {c.name}
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 16 }}>
                  {c.full}
                </p>
                <p style={{
                  color: '#cbd5e1', fontSize: '0.875rem',
                  marginBottom: 24, lineHeight: 1.6,
                  maxWidth: 260, margin: '0 auto 24px',
                }}>
                  {c.desc}
                </p>

                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 10,
                }}>
                  {c.features.map((f, j) => (
                    <div key={j} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      fontSize: '0.8125rem', color: '#cbd5e1',
                    }}>
                      <div className={`bg-gradient-to-r ${c.color}`} style={{
                        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                      }} />
                      {f}
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8, marginTop: 28,
                  color: '#10b981', fontSize: '0.875rem', fontWeight: 600,
                }}>
                  Get Started <ChevronRight style={{ width: 16, height: 16 }} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>HOW IT WORKS</div>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 700, color: 'white',
              letterSpacing: '-0.02em', marginBottom: 12,
            }}>
              Three Simple Steps
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
              Get your personalized plan in under a minute
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
          }}>
            {[
              { n: '01', title: 'Tell Us About You', desc: 'Share your condition, dietary preferences, and health goals.' },
              { n: '02', title: 'Get Your Plan', desc: 'Our engine generates a 7-day meal plan with precise calculations.' },
              { n: '03', title: 'Track & Improve', desc: 'Monitor nutrition, rate meals, and watch your plan adapt.' }
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{
                padding: '32px 24px',
                textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <div className="gradient-text" style={{
                  fontSize: '3rem', fontWeight: 900,
                  marginBottom: 20, display: 'inline-block',
                }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: 12 }}>
                  {s.title}
                </h3>
                <p style={{
                  fontSize: '0.9375rem', color: '#94a3b8',
                  lineHeight: 1.7, maxWidth: 280,
                }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px 80px' }}>
          <div className="glass-elevated" style={{
            padding: '48px 32px',
            textAlign: 'center',
          }}>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 700, color: 'white', marginBottom: 16,
            }}>
              Ready to Transform Your Diet?
            </h2>
            <p style={{
              color: '#94a3b8', marginBottom: 32,
              maxWidth: 460, margin: '0 auto 32px',
              fontSize: '0.9375rem', lineHeight: 1.7,
            }}>
              Science-backed nutrition plans personalized to your chronic condition.
            </p>
            <button onClick={() => navigate('/onboarding')} className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              Create Your Free Plan <ArrowRight style={{ width: 16, height: 16, marginLeft: 4 }} />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid rgba(255,255,255,0.03)',
          padding: '24px 0',
        }}>
          <div style={{
            maxWidth: 960, margin: '0 auto', padding: '0 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
            fontSize: '0.6875rem', color: '#475569',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Droplets style={{ width: 12, height: 12, color: '#10b981' }} />
              NutriCare — Evidence-based nutrition
            </div>
            <div>Built for health. Powered by science.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

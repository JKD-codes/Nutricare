import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Clock, ChefHat, Flame, Star, Users } from 'lucide-react';
import { getRatings, setRating as saveRating } from '../utils/storage';

const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' };
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealDetail({ mealPlanData }) {
  const { dayIndex, mealIndex } = useParams();
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const day = mealPlanData?.plan?.[Number(dayIndex)];
  const meal = day?.meals?.[Number(mealIndex)];

  if (!meal) {
    return (
      <div style={{ padding: '64px 20px', textAlign: 'center', maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: 16 }}>Meal not found.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ fontSize: '0.8125rem' }}>Go to Dashboard</button>
      </div>
    );
  }

  const recipe = meal.recipe;
  const nutrition = recipe.nutrition;
  const ratings = getRatings();
  const displayRating = userRating || ratings[recipe.id] || 0;

  const handleRate = (stars) => {
    setUserRating(stars);
    saveRating(recipe.id, stars);
  };

  const sectionLabel = { fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569' };

  return (
    <div style={{ padding: '24px 20px', maxWidth: 1100, margin: '0 auto' }}>
      <button onClick={() => navigate('/dashboard')} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        color: '#64748b', fontSize: '0.8125rem', marginBottom: 20,
        background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s',
      }}>
        <ArrowLeft style={{ width: 14, height: 14 }} /> Dashboard
      </button>

      {/* Header card */}
      <div className="glass-elevated" style={{ padding: '24px 20px', marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.75rem', marginBottom: 12 }}>
          <span className="tag tag-primary">{MEAL_LABELS[meal.type]}</span>
          <span style={{ color: '#475569' }}>·</span>
          <span style={{ color: '#94a3b8', fontWeight: 500 }}>{DAY_NAMES[Number(dayIndex)]}</span>
          <span style={{ color: '#475569' }}>·</span>
          <span style={{ color: '#94a3b8', fontWeight: 500 }}>{meal.time}</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: 'white', marginBottom: 20, lineHeight: 1.3 }}>{recipe.name}</h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, fontSize: '0.875rem', color: '#94a3b8', marginBottom: 24 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock style={{ width: 16, height: 16, color: '#10b981' }} /> {recipe.cookingTime} min</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ChefHat style={{ width: 16, height: 16, color: '#10b981' }} /> {recipe.difficulty}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users style={{ width: 16, height: 16, color: '#10b981' }} /> {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Flame style={{ width: 16, height: 16, color: '#fb923c' }} /> {nutrition.calories} kcal</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
          <span className="tag tag-primary">{recipe.cuisineType}</span>
          {recipe.tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
        </div>
      </div>

      <div className="meal-detail-grid" style={{ display: 'grid', gap: 16 }}>
        {/* Left column */}
        <div className="meal-detail-left" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Ingredients */}
          <div className="glass-elevated" style={{ padding: '24px 20px', textAlign: 'center' }}>
            <div style={{ ...sectionLabel, marginBottom: 20, display: 'inline-block' }}>INGREDIENTS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {recipe.ingredients.map((ing, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                  padding: '12px 0', borderBottom: i < recipe.ingredients.length - 1 ? '1px solid rgba(255,255,255,0.02)' : 'none',
                }}>
                  <span style={{ color: '#cbd5e1', fontSize: '0.9375rem', flex: 1, textAlign: 'left' }}>{ing.name}</span>
                  <span style={{ fontSize: '0.875rem', color: '#64748b', fontFamily: 'monospace', background: 'rgba(255,255,255,0.03)', padding: '4px 12px', borderRadius: 6 }}>
                    {ing.amount}{ing.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="glass-elevated" style={{ padding: '24px 20px' }}>
            <div style={{ ...sectionLabel, marginBottom: 24, textAlign: 'center' }}>INSTRUCTIONS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {recipe.instructions.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 16 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0, marginTop: 2,
                    background: 'rgba(16,185,129,0.1)', color: '#10b981',
                    fontSize: '0.875rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.9375rem', lineHeight: 1.7, paddingTop: 4 }}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="glass-elevated" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ ...sectionLabel, marginBottom: 8 }}>RATE THIS MEAL</div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 20 }}>Help improve your recommendations</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => handleRate(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                  style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}>
                  <Star style={{
                    width: 32, height: 32,
                    color: star <= (hoverRating || displayRating) ? '#fbbf24' : '#334155',
                    fill: star <= (hoverRating || displayRating) ? '#fbbf24' : 'none',
                    transition: 'color 0.2s',
                  }} />
                </button>
              ))}
            </div>
            {displayRating > 0 && (
              <div style={{ marginTop: 12, fontSize: '0.875rem', color: '#94a3b8', fontWeight: 500 }}>
                {[, 'Not for me', 'Okay', 'Good', 'Great!', '🎉 Amazing!'][displayRating]}
              </div>
            )}
          </div>
        </div>

        {/* Right: Nutrition */}
        <div className="meal-detail-right">
          <div className="glass-elevated" style={{ padding: '24px 20px', textAlign: 'center' }}>
            <div style={{ ...sectionLabel, marginBottom: 20, display: 'inline-block' }}>NUTRITION FACTS</div>
            <div style={{ textAlign: 'center', paddingBottom: 24, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white', lineHeight: 1, marginBottom: 4 }}>{nutrition.calories}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>calories per serving</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 24, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              {[
                { label: 'Carbs', value: nutrition.carbs, unit: 'g', color: '#3b82f6', pct: Math.round((nutrition.carbs * 4 / nutrition.calories) * 100) },
                { label: 'Protein', value: nutrition.protein, unit: 'g', color: '#10b981', pct: Math.round((nutrition.protein * 4 / nutrition.calories) * 100) },
                { label: 'Fat', value: nutrition.fat, unit: 'g', color: '#f59e0b', pct: Math.round((nutrition.fat * 9 / nutrition.calories) * 100) },
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', marginBottom: 8 }}>
                    <span style={{ color: '#94a3b8' }}>{m.label}</span>
                    <span style={{ color: 'white', fontWeight: 600 }}>{m.value}{m.unit} <span style={{ color: '#64748b', fontWeight: 400 }}>({m.pct}%)</span></span>
                  </div>
                  <div className="nutrition-bar">
                    <div className="nutrition-bar-fill" style={{ width: `${m.pct}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Fiber', value: nutrition.fiber, unit: 'g', color: '#22c55e' },
                { label: 'Sodium', value: nutrition.sodium, unit: 'mg', color: '#64748b' },
                { label: 'Potassium', value: nutrition.potassium, unit: 'mg', color: '#a855f7' },
                { label: 'Calcium', value: nutrition.calcium, unit: 'mg', color: '#06b6d4' },
                { label: 'Iron', value: nutrition.iron, unit: 'mg', color: '#f97316' },
              ].map((m, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontSize: '0.875rem', padding: '6px 8px',
                  borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.015)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }} />
                    <span style={{ color: '#94a3b8' }}>{m.label}</span>
                  </div>
                  <span style={{ color: '#e2e8f0', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{m.value}{m.unit}</span>
                </div>
              ))}
            </div>

            {nutrition.glycemicIndex > 0 && (
              <div style={{
                marginTop: 24, padding: 16, borderRadius: 12,
                background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.1)',
              }}>
                <div style={{ fontSize: '0.625rem', color: 'rgba(96,165,250,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Glycemic Index</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
                  {nutrition.glycemicIndex}
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#60a5fa', marginLeft: 8 }}>
                    {nutrition.glycemicIndex <= 55 ? 'Low ✓' : nutrition.glycemicIndex <= 69 ? 'Medium' : 'High ⚠'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .meal-detail-grid { grid-template-columns: 1fr; }
        @media (min-width: 1024px) {
          .meal-detail-grid { grid-template-columns: 3fr 2fr; }
          .meal-detail-right .glass-elevated { position: sticky; top: 24px; }
        }
      `}</style>
    </div>
  );
}

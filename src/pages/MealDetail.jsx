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
      <div className="page-container text-center py-16">
        <p className="text-slate-500 text-sm mb-4">Meal not found.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary text-xs">Go to Dashboard</button>
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

  return (
    <div className="page-container">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors mb-5 text-xs">
        <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
      </button>

      {/* Header card */}
      <div className="glass-elevated p-6 sm:p-8 mb-6 flex flex-col items-center text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs mb-3">
          <span className="tag tag-primary">{MEAL_LABELS[meal.type]}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 font-medium">{DAY_NAMES[Number(dayIndex)]}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 font-medium">{meal.time}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-5 leading-snug">{recipe.name}</h1>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400 mb-6">
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> {recipe.cookingTime} min</span>
          <span className="flex items-center gap-1.5"><ChefHat className="w-4 h-4 text-primary" /> {recipe.difficulty}</span>
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /> {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-400" /> {nutrition.calories} kcal</span>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <span className="tag tag-primary">{recipe.cuisineType}</span>
          {recipe.tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Left */}
        <div className="lg:col-span-3 space-y-6">
          {/* Ingredients */}
          <div className="glass-elevated p-6 sm:p-8 text-center">
            <div className="section-label mb-5 inline-block">INGREDIENTS</div>
            <div className="space-y-1">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-white/[0.02] last:border-0">
                  <span className="text-slate-300 text-base flex-1 text-left">{ing.name}</span>
                  <span className="text-sm text-slate-500 font-mono bg-white/[0.03] px-3 py-1 rounded-md">{ing.amount}{ing.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="glass-elevated p-6 sm:p-8">
            <div className="section-label mb-6 text-center">INSTRUCTIONS</div>
            <div className="space-y-6">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="glass-elevated p-6 sm:p-8 flex flex-col items-center text-center">
            <div className="section-label mb-2">RATE THIS MEAL</div>
            <p className="text-xs text-slate-500 mb-5">Help improve your recommendations</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => handleRate(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="p-1 transition-transform hover:scale-110">
                  <Star className={`w-8 h-8 sm:w-10 sm:h-10 ${star <= (hoverRating || displayRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} transition-colors`} />
                </button>
              ))}
            </div>
            {displayRating > 0 && (
              <div className="mt-3 text-sm text-slate-400 font-medium">
                {[, 'Not for me', 'Okay', 'Good', 'Great!', '🎉 Amazing!'][displayRating]}
              </div>
            )}
          </div>
        </div>

        {/* Right: Nutrition */}
        <div className="lg:col-span-2">
          <div className="glass-elevated p-6 sm:p-8 lg:sticky lg:top-6 text-center">
            <div className="section-label mb-5 inline-block">NUTRITION FACTS</div>
            <div className="text-center pb-6 mb-6 border-b border-white/[0.03]">
              <div className="text-5xl font-bold text-white leading-none mb-1">{nutrition.calories}</div>
              <div className="text-sm text-slate-500">calories per serving</div>
            </div>

            <div className="space-y-4 pb-6 mb-6 border-b border-white/[0.03]">
              {[
                { label: 'Carbs', value: nutrition.carbs, unit: 'g', color: 'bg-blue-500', pct: Math.round((nutrition.carbs * 4 / nutrition.calories) * 100) },
                { label: 'Protein', value: nutrition.protein, unit: 'g', color: 'bg-emerald-500', pct: Math.round((nutrition.protein * 4 / nutrition.calories) * 100) },
                { label: 'Fat', value: nutrition.fat, unit: 'g', color: 'bg-amber-500', pct: Math.round((nutrition.fat * 9 / nutrition.calories) * 100) },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-base mb-2">
                    <span className="text-slate-400">{m.label}</span>
                    <span className="text-white font-semibold">{m.value}{m.unit} <span className="text-slate-500 font-normal">({m.pct}%)</span></span>
                  </div>
                  <div className="nutrition-bar">
                    <div className={`nutrition-bar-fill ${m.color}`} style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {[
                { label: 'Fiber', value: nutrition.fiber, unit: 'g', color: 'bg-green-500' },
                { label: 'Sodium', value: nutrition.sodium, unit: 'mg', color: 'bg-slate-500' },
                { label: 'Potassium', value: nutrition.potassium, unit: 'mg', color: 'bg-purple-500' },
                { label: 'Calcium', value: nutrition.calcium, unit: 'mg', color: 'bg-cyan-500' },
                { label: 'Iron', value: nutrition.iron, unit: 'mg', color: 'bg-orange-500' },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-white/[0.015] last:border-0 px-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${m.color}`} />
                    <span className="text-slate-400">{m.label}</span>
                  </div>
                  <span className="text-slate-200 font-semibold tabular-nums">{m.value}{m.unit}</span>
                </div>
              ))}
            </div>

            {nutrition.glycemicIndex > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-blue-500/[0.06] border border-blue-500/10">
                <div className="text-[0.65rem] text-blue-400/80 uppercase tracking-wider mb-1">Glycemic Index</div>
                <div className="text-2xl font-bold text-white">
                  {nutrition.glycemicIndex}
                  <span className="text-sm font-medium text-blue-400 ml-2">
                    {nutrition.glycemicIndex <= 55 ? 'Low ✓' : nutrition.glycemicIndex <= 69 ? 'Medium' : 'High ⚠'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

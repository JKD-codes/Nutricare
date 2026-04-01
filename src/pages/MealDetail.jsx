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
      <div className="page-container text-center py-20">
        <p className="text-slate-500 mb-4">Meal not found.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">Go to Dashboard</button>
      </div>
    );
  }

  const recipe = meal.recipe;
  const nutrition = recipe.nutrition;
  const ratings = getRatings();
  const savedRating = ratings[recipe.id] || 0;
  const displayRating = userRating || savedRating;

  const handleRate = (stars) => {
    setUserRating(stars);
    saveRating(recipe.id, stars);
  };

  return (
    <div className="page-container">
      {/* Back */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </button>

      {/* Hero card */}
      <div className="glass-card p-5 sm:p-7 mb-5">
        <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
          <span className="tag-primary tag">{MEAL_LABELS[meal.type]}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">{DAY_NAMES[Number(dayIndex)]}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">{meal.time}</span>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight">{recipe.name}</h1>

        <div className="flex flex-wrap gap-3 sm:gap-5 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" /> {recipe.cookingTime} min
          </span>
          <span className="flex items-center gap-1.5">
            <ChefHat className="w-4 h-4 text-primary" /> {recipe.difficulty}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary" /> {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" /> {nutrition.calories} kcal
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="tag-primary tag">{recipe.cuisineType}</span>
          {recipe.tags.map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Left */}
        <div className="lg:col-span-3 space-y-5">
          {/* Ingredients */}
          <div className="glass-card p-5 sm:p-6">
            <div className="section-label mb-4">INGREDIENTS</div>
            <div className="space-y-0">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-white/[0.03] last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-slate-300 flex-1 text-sm">{ing.name}</span>
                  <span className="text-xs text-slate-500 font-mono bg-white/[0.03] px-2.5 py-1 rounded-lg">
                    {ing.amount}{ing.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="glass-card p-5 sm:p-6">
            <div className="section-label mb-5">INSTRUCTIONS</div>
            <div className="space-y-5">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/8 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-primary/10">
                    {i + 1}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="glass-card p-5 sm:p-6">
            <div className="section-label mb-1">RATE THIS MEAL</div>
            <p className="text-xs text-slate-500 mb-4">Help us improve your recommendations</p>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 ${
                      star <= (hoverRating || displayRating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-700'
                    } transition-colors`}
                  />
                </button>
              ))}
              {displayRating > 0 && (
                <span className="ml-3 text-sm text-slate-400">
                  {displayRating === 5 ? '🎉 Amazing!' : displayRating === 4 ? '👍 Great!' : displayRating === 3 ? 'Good' : displayRating === 2 ? 'Okay' : 'Not for me'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Nutrition */}
        <div className="lg:col-span-2">
          <div className="glass-card p-5 sm:p-6 lg:sticky lg:top-6">
            <div className="section-label mb-4">NUTRITION FACTS</div>
            <div className="text-center mb-5 pb-5 border-b border-white/[0.04]">
              <div className="text-4xl font-bold text-white tracking-tight">{nutrition.calories}</div>
              <div className="text-xs text-slate-500 mt-1">calories per serving</div>
            </div>

            {/* Macro bars */}
            <div className="space-y-3 mb-5 pb-5 border-b border-white/[0.04]">
              {[
                { label: 'Carbohydrates', value: nutrition.carbs, unit: 'g', color: 'bg-blue-500', pct: Math.round((nutrition.carbs * 4 / nutrition.calories) * 100) },
                { label: 'Protein', value: nutrition.protein, unit: 'g', color: 'bg-emerald-500', pct: Math.round((nutrition.protein * 4 / nutrition.calories) * 100) },
                { label: 'Fat', value: nutrition.fat, unit: 'g', color: 'bg-amber-500', pct: Math.round((nutrition.fat * 9 / nutrition.calories) * 100) },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">{item.label}</span>
                    <span className="text-white font-semibold">{item.value}{item.unit} <span className="text-slate-500 font-normal">({item.pct}%)</span></span>
                  </div>
                  <div className="nutrition-bar">
                    <div className={`nutrition-bar-fill ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Micros */}
            <div className="space-y-2.5">
              {[
                { label: 'Fiber', value: nutrition.fiber, unit: 'g', color: 'bg-green-500' },
                { label: 'Sodium', value: nutrition.sodium, unit: 'mg', color: 'bg-slate-500' },
                { label: 'Potassium', value: nutrition.potassium, unit: 'mg', color: 'bg-purple-500' },
                { label: 'Calcium', value: nutrition.calcium, unit: 'mg', color: 'bg-cyan-500' },
                { label: 'Magnesium', value: nutrition.magnesium, unit: 'mg', color: 'bg-pink-500' },
                { label: 'Iron', value: nutrition.iron, unit: 'mg', color: 'bg-orange-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-white/[0.02] last:border-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                    <span className="text-slate-400">{item.label}</span>
                  </div>
                  <span className="text-slate-200 font-medium tabular-nums">{item.value}{item.unit}</span>
                </div>
              ))}
            </div>

            {/* GI badge */}
            {nutrition.glycemicIndex > 0 && (
              <div className="mt-5 p-3.5 rounded-xl bg-blue-500/6 border border-blue-500/10">
                <div className="text-[0.65rem] text-blue-400 font-medium uppercase tracking-wider">Glycemic Index</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {nutrition.glycemicIndex}
                  <span className="text-sm font-normal text-blue-400 ml-2">
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

import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Clock, ChefHat, Flame, Star, Users, RefreshCw } from 'lucide-react';
import { getRatings, setRating as saveRating } from '../utils/storage';

const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' };

export default function MealDetail({ mealPlanData }) {
  const { dayIndex, mealIndex } = useParams();
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const day = mealPlanData?.plan?.[Number(dayIndex)];
  const meal = day?.meals?.[Number(mealIndex)];

  if (!meal) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-400">Meal not found.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">Go to Dashboard</button>
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

  const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {/* Hero */}
      <div className="glass-card p-6 lg:p-8 mb-6">
        <div className="flex items-center gap-2 text-sm text-primary mb-2">
          <span className="uppercase tracking-wider font-medium">
            {MEAL_LABELS[meal.type]}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">{DAY_NAMES[Number(dayIndex)]}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">{meal.time}</span>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">{recipe.name}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" />
            {recipe.cookingTime} min
          </span>
          <span className="flex items-center gap-1.5">
            <ChefHat className="w-4 h-4 text-primary" />
            {recipe.difficulty}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary" />
            {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            {nutrition.calories} kcal
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {recipe.cuisineType}
          </span>
          {recipe.tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Recipe content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Ingredients */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Ingredients</h2>
            <div className="space-y-3">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-slate-300 flex-1">{ing.name}</span>
                  <span className="text-sm text-slate-500 font-mono">
                    {ing.amount}{ing.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Instructions</h2>
            <div className="space-y-4">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-2">Rate This Meal</h2>
            <p className="text-sm text-slate-400 mb-4">Help us improve your recommendations</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || displayRating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600'
                    } transition-colors`}
                  />
                </button>
              ))}
              {displayRating > 0 && (
                <span className="ml-3 text-sm text-slate-400">
                  {displayRating === 5 ? 'Amazing!' :
                   displayRating === 4 ? 'Great!' :
                   displayRating === 3 ? 'Good' :
                   displayRating === 2 ? 'Okay' : 'Not for me'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Nutrition panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Nutrition Facts */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Nutrition Facts</h2>
            <div className="text-center mb-4 pb-4 border-b border-slate-800">
              <div className="text-4xl font-bold text-white">{nutrition.calories}</div>
              <div className="text-sm text-slate-400">calories per serving</div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Carbohydrates', value: nutrition.carbs, unit: 'g', color: 'bg-blue-500', pct: Math.round((nutrition.carbs * 4 / nutrition.calories) * 100) },
                { label: 'Protein', value: nutrition.protein, unit: 'g', color: 'bg-emerald-500', pct: Math.round((nutrition.protein * 4 / nutrition.calories) * 100) },
                { label: 'Fat', value: nutrition.fat, unit: 'g', color: 'bg-amber-500', pct: Math.round((nutrition.fat * 9 / nutrition.calories) * 100) },
                { label: 'Fiber', value: nutrition.fiber, unit: 'g', color: 'bg-green-500' },
                { label: 'Sodium', value: nutrition.sodium, unit: 'mg', color: 'bg-slate-500' },
                { label: 'Potassium', value: nutrition.potassium, unit: 'mg', color: 'bg-purple-500' },
                { label: 'Calcium', value: nutrition.calcium, unit: 'mg', color: 'bg-cyan-500' },
                { label: 'Magnesium', value: nutrition.magnesium, unit: 'mg', color: 'bg-pink-500' },
                { label: 'Iron', value: nutrition.iron, unit: 'mg', color: 'bg-orange-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-slate-800/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-slate-400">{item.label}</span>
                  </div>
                  <div className="text-slate-200 font-medium">
                    {item.value}{item.unit}
                    {item.pct && <span className="text-slate-500 ml-1 text-xs">({item.pct}%)</span>}
                  </div>
                </div>
              ))}
            </div>

            {nutrition.glycemicIndex > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="text-xs text-blue-400 font-medium">Glycemic Index</div>
                <div className="text-xl font-bold text-white">
                  {nutrition.glycemicIndex}
                  <span className="text-sm font-normal text-blue-400 ml-1">
                    {nutrition.glycemicIndex <= 55 ? '(Low ✓)' : nutrition.glycemicIndex <= 69 ? '(Medium)' : '(High ⚠)'}
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

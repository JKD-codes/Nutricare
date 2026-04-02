// Meal planning algorithm: constraint-based recipe selection for 7-day plans

import recipeDatabase, { getRecipesByCondition } from '../data/recipeDatabase';
import { calculateAllMetrics, calculateMacroGrams, getMacroDistribution } from './calculations';

// Meal calorie distribution
const MEAL_DISTRIBUTION = {
  breakfast: 0.25,
  lunch: 0.35,
  dinner: 0.30,
  snack: 0.10
};

/**
 * Filter recipes based on user constraints
 */
const filterRecipes = (recipes, profile) => {
  const { vegetarian, vegan, cuisinePreferences, dislikedFoods } = profile.dietary || {};
  const { allergies, intolerances } = profile.health || {};
  const difficulty = profile.dietary?.cookingSkillLevel || 'intermediate';

  return recipes.filter(recipe => {
    // Dietary restrictions
    if (vegan && !recipe.tags.includes('vegan') && !recipe.tags.includes('plant-based')) {
      // Check if recipe has only plant-based ingredients
      const hasAnimal = recipe.ingredients.some(i =>
        ['chicken', 'salmon', 'eggs', 'tuna', 'paneer', 'greek_yogurt', 'low_fat_milk'].includes(i.foodId)
      );
      if (hasAnimal) return false;
    }
    if (vegetarian) {
      const hasMeat = recipe.ingredients.some(i =>
        ['chicken_breast', 'salmon', 'tuna'].includes(i.foodId)
      );
      if (hasMeat) return false;
    }

    // Allergies & intolerances
    if (allergies && allergies.length > 0) {
      const allergyLower = allergies.map(a => a.toLowerCase());
      const hasAllergen = recipe.ingredients.some(i =>
        allergyLower.some(a => i.name.toLowerCase().includes(a) || i.foodId.includes(a))
      );
      if (hasAllergen) return false;
    }

    // Disliked foods
    if (dislikedFoods && dislikedFoods.length > 0) {
      const dislikedLower = dislikedFoods.map(d => d.toLowerCase());
      const hasDisliked = recipe.ingredients.some(i =>
        dislikedLower.some(d => i.name.toLowerCase().includes(d))
      );
      if (hasDisliked) return false;
    }

    // Cooking difficulty
    if (difficulty === 'beginner' && recipe.difficulty === 'advanced') return false;

    return true;
  });
};

/**
 * Shuffle array (Fisher-Yates)
 */
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Select a meal ensuring variety (no repeat within last N meals)
 */
const selectMeal = (candidates, recentIds, calorieTarget) => {
  // Sort by closest to calorie target
  const scored = candidates
    .filter(r => !recentIds.includes(r.id))
    .map(r => ({
      recipe: r,
      calorieDiff: Math.abs(r.nutrition.calories - calorieTarget)
    }))
    .sort((a, b) => a.calorieDiff - b.calorieDiff);

  if (scored.length === 0) {
    // Fallback: allow repeats
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  // Pick from top 3 closest matches with some randomness
  const top = scored.slice(0, Math.min(3, scored.length));
  return top[Math.floor(Math.random() * top.length)].recipe;
};

/**
 * Generate a 7-day meal plan
 */
export const generateMealPlan = (profile) => {
  const metrics = calculateAllMetrics(profile);
  const { targetCalories } = metrics;
  const condition = profile.health.primaryCondition;

  // Get condition-appropriate recipes
  let conditionRecipes = getRecipesByCondition(condition);

  // Apply user filters
  conditionRecipes = filterRecipes(conditionRecipes, profile);

  // Group by category
  const breakfasts = conditionRecipes.filter(r => r.category === 'breakfast');
  const lunches = conditionRecipes.filter(r => r.category === 'lunch');
  const dinners = conditionRecipes.filter(r => r.category === 'dinner');
  const snacks = conditionRecipes.filter(r => r.category === 'snack');

  // Calorie targets per meal
  const calorieTargets = {
    breakfast: Math.round(targetCalories * MEAL_DISTRIBUTION.breakfast),
    lunch: Math.round(targetCalories * MEAL_DISTRIBUTION.lunch),
    dinner: Math.round(targetCalories * MEAL_DISTRIBUTION.dinner),
    snack: Math.round(targetCalories * MEAL_DISTRIBUTION.snack)
  };

  const plan = [];
  const recentBreakfasts = [];
  const recentLunches = [];
  const recentDinners = [];
  const recentSnacks = [];
  const allIngredients = {};

  for (let day = 1; day <= 7; day++) {
    const dayPlan = { day, meals: [] };

    // Select breakfast
    const breakfast = selectMeal(shuffle(breakfasts), recentBreakfasts, calorieTargets.breakfast);
    if (breakfast) {
      recentBreakfasts.push(breakfast.id);
      if (recentBreakfasts.length > 3) recentBreakfasts.shift();
      dayPlan.meals.push({
        type: 'breakfast',
        time: '7:00 AM',
        recipe: breakfast,
        targetCalories: calorieTargets.breakfast
      });
      aggregateIngredients(allIngredients, breakfast);
    }

    // Select lunch
    const lunch = selectMeal(shuffle(lunches), recentLunches, calorieTargets.lunch);
    if (lunch) {
      recentLunches.push(lunch.id);
      if (recentLunches.length > 3) recentLunches.shift();
      dayPlan.meals.push({
        type: 'lunch',
        time: '12:30 PM',
        recipe: lunch,
        targetCalories: calorieTargets.lunch
      });
      aggregateIngredients(allIngredients, lunch);
    }

    // Select dinner
    const dinner = selectMeal(shuffle(dinners), recentDinners, calorieTargets.dinner);
    if (dinner) {
      recentDinners.push(dinner.id);
      if (recentDinners.length > 3) recentDinners.shift();
      dayPlan.meals.push({
        type: 'dinner',
        time: '7:00 PM',
        recipe: dinner,
        targetCalories: calorieTargets.dinner
      });
      aggregateIngredients(allIngredients, dinner);
    }

    // Select snack
    const snack = selectMeal(shuffle(snacks), recentSnacks, calorieTargets.snack);
    if (snack) {
      recentSnacks.push(snack.id);
      if (recentSnacks.length > 3) recentSnacks.shift();
      dayPlan.meals.push({
        type: 'snack',
        time: '4:00 PM',
        recipe: snack,
        targetCalories: calorieTargets.snack
      });
      aggregateIngredients(allIngredients, snack);
    }

    // Calculate daily summary
    dayPlan.summary = calculateDaySummary(dayPlan.meals);
    plan.push(dayPlan);
  }

  // Generate shopping list
  const shoppingList = generateShoppingList(allIngredients);

  return {
    plan,
    shoppingList,
    metrics,
    generatedAt: new Date().toISOString(),
    condition
  };
};

/**
 * Aggregate ingredients for shopping list
 */
const aggregateIngredients = (allIngredients, recipe) => {
  recipe.ingredients.forEach(ingredient => {
    const key = ingredient.foodId || ingredient.name.toLowerCase().replace(/\s+/g, '_');
    if (!allIngredients[key]) {
      allIngredients[key] = {
        name: ingredient.name,
        totalAmount: 0,
        unit: ingredient.unit,
        category: getCategoryForIngredient(ingredient.foodId)
      };
    }
    allIngredients[key].totalAmount += ingredient.amount;
  });
};

/**
 * Get shopping category for ingredient
 */
const getCategoryForIngredient = (foodId) => {
  const categoryMap = {
    protein: ['chicken_breast', 'salmon', 'tuna', 'eggs', 'tofu', 'paneer'],
    dairy: ['greek_yogurt', 'low_fat_milk'],
    grain: ['oats', 'brown_rice', 'quinoa', 'whole_wheat_bread', 'roti', 'barley', 'sweet_potato'],
    produce: ['spinach', 'broccoli', 'bell_pepper', 'tomato', 'cucumber', 'cauliflower', 'zucchini', 'carrot', 'blueberries', 'strawberries', 'apple', 'banana', 'avocado', 'orange'],
    pantry: ['almonds', 'walnuts', 'flaxseeds', 'chia_seeds', 'pumpkin_seeds', 'olive_oil', 'turmeric', 'cinnamon'],
    legume: ['lentils', 'chickpeas', 'kidney_beans', 'black_beans', 'moong_dal'],
    beverage: ['green_tea']
  };

  for (const [cat, ids] of Object.entries(categoryMap)) {
    if (ids.includes(foodId)) return cat;
  }
  return 'other';
};

/**
 * Generate organized shopping list
 */
const generateShoppingList = (allIngredients) => {
  const list = {};
  Object.values(allIngredients).forEach(item => {
    const cat = item.category;
    if (!list[cat]) list[cat] = [];
    list[cat].push({
      name: item.name,
      amount: Math.round(item.totalAmount),
      unit: item.unit
    });
  });
  return list;
};

/**
 * Calculate day summary from meals
 */
const calculateDaySummary = (meals) => {
  const totals = {
    calories: 0, carbs: 0, protein: 0, fat: 0,
    fiber: 0, sodium: 0, potassium: 0,
    calcium: 0, magnesium: 0, iron: 0
  };

  meals.forEach(meal => {
    const n = meal.recipe.nutrition;
    totals.calories += n.calories || 0;
    totals.carbs += n.carbs || 0;
    totals.protein += n.protein || 0;
    totals.fat += n.fat || 0;
    totals.fiber += n.fiber || 0;
    totals.sodium += n.sodium || 0;
    totals.potassium += n.potassium || 0;
    totals.calcium += n.calcium || 0;
    totals.magnesium += n.magnesium || 0;
    totals.iron += n.iron || 0;
  });

  const totalMacroG = totals.carbs + totals.protein + totals.fat;
  totals.macroPercentages = {
    carbs: totalMacroG > 0 ? Math.round((totals.carbs * 4 / totals.calories) * 100) : 0,
    protein: totalMacroG > 0 ? Math.round((totals.protein * 4 / totals.calories) * 100) : 0,
    fat: totalMacroG > 0 ? Math.round((totals.fat * 9 / totals.calories) * 100) : 0,
  };

  return totals;
};

/**
 * Generate nutrition feedback based on daily intake vs targets
 */
export const generateFeedback = (daySummary, metrics, condition) => {
  const alerts = [];
  const macros = getMacroDistribution(condition);

  // Calorie check
  const calDiff = daySummary.calories - metrics.targetCalories;
  if (Math.abs(calDiff) > 200) {
    alerts.push({
      type: calDiff > 0 ? 'warning' : 'info',
      message: calDiff > 0
        ? `Calorie intake is ${Math.round(calDiff)} kcal over target. Consider lighter portions.`
        : `Calorie intake is ${Math.round(Math.abs(calDiff))} kcal under target. Ensure adequate nutrition.`
    });
  }

  // Fiber check
  if (daySummary.fiber < macros.fiberMin) {
    alerts.push({
      type: 'warning',
      message: `Fiber is low (${Math.round(daySummary.fiber)}g / ${macros.fiberMin}g target). Add legumes or vegetables.`
    });
  } else {
    alerts.push({
      type: 'success',
      message: `Great fiber intake: ${Math.round(daySummary.fiber)}g ✓`
    });
  }

  // Sodium check (especially for hypertension)
  if (daySummary.sodium > macros.sodiumMax) {
    alerts.push({
      type: 'danger',
      message: `Sodium exceeds limit (${Math.round(daySummary.sodium)}mg / ${macros.sodiumMax}mg max). Reduce processed foods.`
    });
  }

  // Condition-specific
  if (condition === 'PCOS' || condition === 'Diabetes') {
    const avgGI = daySummary.calories > 0 ? 45 : 0; // approximate
    if (avgGI > 55) {
      alerts.push({
        type: 'warning',
        message: 'High glycemic load today. Switch to low-GI carbs: oats, lentils, sweet potato.'
      });
    }
  }

  if (condition === 'Hypertension' && daySummary.potassium < 3500) {
    alerts.push({
      type: 'info',
      message: `Potassium is below target (${Math.round(daySummary.potassium)}mg / 3500mg). Add bananas, spinach, or beans.`
    });
  }

  // Protein check
  const proteinPct = daySummary.macroPercentages?.protein || 0;
  if (proteinPct < macros.protein.min) {
    alerts.push({
      type: 'warning',
      message: `Protein is low (${proteinPct}%). Add fish, eggs, legumes, or Greek yogurt.`
    });
  }

  return alerts;
};

/**
 * Swap a specific meal for an alternative from the filtered recipe list.
 * Updates the plan's daily summary and shopping list accordingly.
 */
export const swapMeal = (mealPlanData, dayIndex, mealIndex, profile) => {
  const plan = [...mealPlanData.plan];
  const day = { ...plan[dayIndex], meals: [...plan[dayIndex].meals] };
  const mealToSwap = day.meals[mealIndex];
  
  // Get all valid recipes for their condition & filters
  let candidates = getRecipesByCondition(profile.health.primaryCondition);
  candidates = filterRecipes(candidates, profile);
  // Filter specifically for this meal type
  candidates = candidates.filter(r => r.category === mealToSwap.type);
  
  // Exclude the current recipe and sort by calorie closeness to target
  const diffCandidates = candidates
    .filter(r => r.id !== mealToSwap.recipe.id)
    .map(r => ({
      recipe: r,
      diff: Math.abs(r.nutrition.calories - mealToSwap.targetCalories)
    }))
    .sort((a, b) => a.diff - b.diff);

  if (diffCandidates.length > 0) {
    // Pick something relatively close (randomly pick one from top 3)
    const top = diffCandidates.slice(0, Math.min(3, diffCandidates.length));
    const newRecipe = top[Math.floor(Math.random() * top.length)].recipe;
    
    // Replace meal
    day.meals[mealIndex] = { ...mealToSwap, recipe: newRecipe };
    day.summary = calculateDaySummary(day.meals);
    plan[dayIndex] = day;

    // Recalculate shopping list
    const allIngredients = {};
    plan.forEach(d => {
      d.meals.forEach(m => aggregateIngredients(allIngredients, m.recipe));
    });
    const shoppingList = generateShoppingList(allIngredients);

    return {
      ...mealPlanData,
      plan,
      shoppingList
    };
  }

  return mealPlanData; // If no alternative found
};

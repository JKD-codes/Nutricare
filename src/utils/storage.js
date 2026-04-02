// localStorage wrapper for user data persistence

const KEYS = {
  PROFILE: 'dietplanner_profile',
  MEAL_PLAN: 'dietplanner_mealplan',
  MEAL_LOG: 'dietplanner_meallog',
  RATINGS: 'dietplanner_ratings',
  METRICS: 'dietplanner_metrics',
  ONBOARDED: 'dietplanner_onboarded',
  DAILY_LOG: 'dietplanner_dailylog',
};

const safeGet = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

// Profile
export const saveProfile = (profile) => safeSet(KEYS.PROFILE, profile);
export const getProfile = () => safeGet(KEYS.PROFILE);
export const clearProfile = () => localStorage.removeItem(KEYS.PROFILE);

// Meal Plan
export const saveMealPlan = (plan) => safeSet(KEYS.MEAL_PLAN, plan);
export const getMealPlan = () => safeGet(KEYS.MEAL_PLAN);

// Meal Log
export const getMealLog = () => safeGet(KEYS.MEAL_LOG) || [];
export const logMealEntry = (entry) => {
  const logs = getMealLog();
  logs.push({ ...entry, timestamp: new Date().toISOString() });
  safeSet(KEYS.MEAL_LOG, logs);
};
export const getMealLogForDate = (dateStr) => {
  const logs = getMealLog();
  return logs.filter(l => l.date === dateStr);
};

// Ratings
export const getRatings = () => safeGet(KEYS.RATINGS) || {};
export const setRating = (recipeId, rating) => {
  const ratings = getRatings();
  ratings[recipeId] = rating;
  safeSet(KEYS.RATINGS, ratings);
};

// Metrics (calculated health metrics)
export const saveMetrics = (metrics) => safeSet(KEYS.METRICS, metrics);
export const getMetrics = () => safeGet(KEYS.METRICS);

// Onboarding state
export const isOnboarded = () => safeGet(KEYS.ONBOARDED) === true;
export const setOnboarded = (val) => safeSet(KEYS.ONBOARDED, val);

// Daily Log (water, vitals)
const todayKey = () => new Date().toISOString().slice(0, 10);
export const getDailyLog = () => {
  const all = safeGet(KEYS.DAILY_LOG) || {};
  return all[todayKey()] || { water: 0, weight: '', bp: '', sugar: '' };
};
export const saveDailyLog = (log) => {
  const all = safeGet(KEYS.DAILY_LOG) || {};
  all[todayKey()] = log;
  safeSet(KEYS.DAILY_LOG, all);
};

// Reset everything
export const resetAll = () => {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
};

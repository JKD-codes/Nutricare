// BMR, TDEE, macronutrient, and BMI calculation engine

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
 */
export const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  }
  return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
};

/**
 * Activity level multipliers for TDEE
 */
const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

/**
 * Calculate Total Daily Energy Expenditure
 */
export const calculateTDEE = (bmr, activityLevel) => {
  const multiplier = activityMultipliers[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
};

/**
 * Get target calories based on goal
 */
export const getTargetCalories = (tdee, weightLoss) => {
  if (weightLoss) return tdee - 500; // 0.5kg/week deficit
  return tdee; // maintenance
};

/**
 * Calculate BMI
 */
export const calculateBMI = (weight, height) => {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  let category = '';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  return { value: Math.round(bmi * 10) / 10, category };
};

/**
 * Macronutrient distribution targets by condition
 * Returns { carbs, protein, fat } as percentage ranges
 */
export const getMacroDistribution = (condition) => {
  switch (condition) {
    case 'PCOS':
      return {
        carbs: { min: 40, max: 45, target: 42 },
        protein: { min: 25, max: 30, target: 28 },
        fat: { min: 25, max: 35, target: 30 },
        fiberMin: 25,
        sodiumMax: 2300,
        notes: [
          'Focus on low glycemic index carbs (GI ≤ 55)',
          'Every meal must contain protein',
          'Emphasize omega-3 fats and MUFA',
          'Limit saturated fat to < 7% of calories',
          'Include anti-inflammatory foods (berries, turmeric, cinnamon)'
        ]
      };
    case 'Diabetes':
      return {
        carbs: { min: 40, max: 50, target: 45 },
        protein: { min: 15, max: 20, target: 18 },
        fat: { min: 25, max: 35, target: 35 },
        fiberMin: 25,
        sodiumMax: 2300,
        notes: [
          'Strictly low glycemic carbs (GI < 55)',
          'Always pair carbs with protein + fat',
          'Use plate method: ½ veggies, ¼ protein, ¼ whole grain',
          'Consistent meal timing for blood sugar control',
          'Post-meal activity: 15-20 min walk recommended'
        ]
      };
    case 'Hypertension':
      return {
        carbs: { min: 50, max: 60, target: 55 },
        protein: { min: 15, max: 20, target: 18 },
        fat: { min: 20, max: 35, target: 27 },
        fiberMin: 25,
        sodiumMax: 1500,
        notes: [
          'DASH diet framework is essential',
          'Sodium target: < 1500mg/day (critical)',
          'Potassium target: 3500-4700mg/day',
          'Emphasize plant-based protein sources',
          'Calcium: 1000-1200mg/day, Magnesium: 300-420mg/day'
        ]
      };
    default:
      return {
        carbs: { min: 45, max: 55, target: 50 },
        protein: { min: 15, max: 25, target: 20 },
        fat: { min: 25, max: 35, target: 30 },
        fiberMin: 25,
        sodiumMax: 2300,
        notes: ['Balanced diet with whole foods']
      };
  }
};

/**
 * Calculate grams of macros from calorie target and percentages
 */
export const calculateMacroGrams = (totalCalories, macroDistribution) => {
  const carbsTarget = macroDistribution.carbs.target;
  const proteinTarget = macroDistribution.protein.target;
  const fatTarget = macroDistribution.fat.target;

  return {
    carbs: Math.round((totalCalories * carbsTarget / 100) / 4),      // 4 cal/g
    protein: Math.round((totalCalories * proteinTarget / 100) / 4),   // 4 cal/g
    fat: Math.round((totalCalories * fatTarget / 100) / 9),           // 9 cal/g
  };
};

/**
 * Calculate all health metrics from user profile
 */
export const calculateAllMetrics = (profile) => {
  const { age, gender, height, weight, activityLevel } = profile.personalInfo;
  const { primaryCondition } = profile.health;
  const { weightLoss } = profile.goals;

  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const targetCalories = getTargetCalories(tdee, weightLoss);
  const bmi = calculateBMI(weight, height);
  const macroDistribution = getMacroDistribution(primaryCondition);
  const macroGrams = calculateMacroGrams(targetCalories, macroDistribution);

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    bmi,
    macroDistribution,
    macroGrams,
    fiberTarget: macroDistribution.fiberMin,
    sodiumLimit: macroDistribution.sodiumMax
  };
};

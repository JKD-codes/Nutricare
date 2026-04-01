// Recipe database with full nutrition, condition flags, and cooking instructions

const recipeDatabase = [
  // ===== BREAKFAST =====
  {
    id: 'oatmeal_berries',
    name: 'Oatmeal with Berries & Almonds',
    servings: 1,
    cookingTime: 10,
    difficulty: 'easy',
    category: 'breakfast',
    cuisineType: 'Global',
    ingredients: [
      { foodId: 'oats', name: 'Rolled Oats', amount: 50, unit: 'g' },
      { foodId: 'blueberries', name: 'Blueberries', amount: 100, unit: 'g' },
      { foodId: 'almonds', name: 'Almonds (sliced)', amount: 15, unit: 'g' },
      { foodId: 'chia_seeds', name: 'Chia Seeds', amount: 10, unit: 'g' },
      { foodId: 'cinnamon', name: 'Cinnamon', amount: 2, unit: 'g' }
    ],
    instructions: [
      'Cook oats with 200ml water or low-fat milk for 5 minutes.',
      'Top with fresh blueberries and sliced almonds.',
      'Sprinkle chia seeds and cinnamon on top.',
      'Serve warm.'
    ],
    nutrition: {
      calories: 340, carbs: 48, protein: 12, fat: 13,
      saturatedFat: 1.4, fiber: 10, sodium: 8, potassium: 350,
      calcium: 120, magnesium: 140, iron: 3.5, glycemicIndex: 48
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['quick', 'high-fiber', 'anti-inflammatory', 'low-sodium']
  },
  {
    id: 'veggie_egg_scramble',
    name: 'Vegetable Egg Scramble',
    servings: 1,
    cookingTime: 12,
    difficulty: 'easy',
    category: 'breakfast',
    cuisineType: 'Global',
    ingredients: [
      { foodId: 'eggs', name: 'Eggs', amount: 100, unit: 'g' },
      { foodId: 'spinach', name: 'Spinach', amount: 50, unit: 'g' },
      { foodId: 'bell_pepper', name: 'Bell Pepper', amount: 50, unit: 'g' },
      { foodId: 'tomato', name: 'Tomato', amount: 50, unit: 'g' },
      { foodId: 'olive_oil', name: 'Olive Oil', amount: 5, unit: 'ml' }
    ],
    instructions: [
      'Heat olive oil in a non-stick pan over medium heat.',
      'Sauté diced bell pepper and tomato for 2-3 minutes.',
      'Add spinach and cook until wilted.',
      'Pour in beaten eggs and scramble until cooked through.',
      'Season with pepper and herbs.'
    ],
    nutrition: {
      calories: 245, carbs: 8, protein: 16, fat: 17,
      saturatedFat: 4.2, fiber: 3, sodium: 180, potassium: 480,
      calcium: 110, magnesium: 55, iron: 3.8, glycemicIndex: 0
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['quick', 'high-protein', 'low-carb', 'keto-friendly']
  },
  {
    id: 'greek_yogurt_parfait',
    name: 'Greek Yogurt Parfait with Nuts',
    servings: 1,
    cookingTime: 5,
    difficulty: 'easy',
    category: 'breakfast',
    cuisineType: 'Mediterranean',
    ingredients: [
      { foodId: 'greek_yogurt', name: 'Greek Yogurt', amount: 150, unit: 'g' },
      { foodId: 'strawberries', name: 'Strawberries', amount: 80, unit: 'g' },
      { foodId: 'walnuts', name: 'Walnuts', amount: 15, unit: 'g' },
      { foodId: 'flaxseeds', name: 'Ground Flaxseeds', amount: 10, unit: 'g' }
    ],
    instructions: [
      'Layer Greek yogurt in a glass or bowl.',
      'Add sliced strawberries.',
      'Top with crushed walnuts and ground flaxseeds.',
      'Enjoy immediately.'
    ],
    nutrition: {
      calories: 275, carbs: 18, protein: 22, fat: 14,
      saturatedFat: 2, fiber: 5, sodium: 65, potassium: 420,
      calcium: 210, magnesium: 75, iron: 1.5, glycemicIndex: 20
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['quick', 'high-protein', 'omega3', 'probiotic']
  },
  {
    id: 'moong_dal_chilla',
    name: 'Moong Dal Chilla (Lentil Crepe)',
    servings: 2,
    cookingTime: 20,
    difficulty: 'intermediate',
    category: 'breakfast',
    cuisineType: 'Indian',
    ingredients: [
      { foodId: 'moong_dal', name: 'Moong Dal (ground)', amount: 150, unit: 'g' },
      { foodId: 'spinach', name: 'Spinach (chopped)', amount: 50, unit: 'g' },
      { foodId: 'tomato', name: 'Tomato (diced)', amount: 50, unit: 'g' },
      { foodId: 'turmeric', name: 'Turmeric', amount: 2, unit: 'g' },
      { foodId: 'olive_oil', name: 'Oil for cooking', amount: 5, unit: 'ml' }
    ],
    instructions: [
      'Soak moong dal for 4 hours, then grind into a smooth batter.',
      'Mix in chopped spinach, tomato, turmeric, and a pinch of salt.',
      'Heat a non-stick pan with a little oil.',
      'Pour batter and spread into a thin crepe.',
      'Cook both sides until golden brown.'
    ],
    nutrition: {
      calories: 195, carbs: 26, protein: 13, fat: 5,
      saturatedFat: 0.8, fiber: 8, sodium: 60, potassium: 480,
      calcium: 55, magnesium: 70, iron: 4, glycemicIndex: 30
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['high-protein', 'high-fiber', 'low-gi', 'plant-based']
  },
  {
    id: 'avocado_toast',
    name: 'Avocado Toast with Seeds',
    servings: 1,
    cookingTime: 8,
    difficulty: 'easy',
    category: 'breakfast',
    cuisineType: 'Global',
    ingredients: [
      { foodId: 'whole_wheat_bread', name: 'Whole Wheat Bread', amount: 80, unit: 'g' },
      { foodId: 'avocado', name: 'Avocado', amount: 70, unit: 'g' },
      { foodId: 'pumpkin_seeds', name: 'Pumpkin Seeds', amount: 10, unit: 'g' },
      { foodId: 'tomato', name: 'Cherry Tomatoes', amount: 50, unit: 'g' }
    ],
    instructions: [
      'Toast the whole wheat bread slices.',
      'Mash avocado and spread on toast.',
      'Top with halved cherry tomatoes.',
      'Sprinkle pumpkin seeds and a pinch of pepper.'
    ],
    nutrition: {
      calories: 355, carbs: 38, protein: 10, fat: 19,
      saturatedFat: 3, fiber: 10, sodium: 300, potassium: 650,
      calcium: 65, magnesium: 95, iron: 2.5, glycemicIndex: 45
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['quick', 'healthy-fats', 'high-fiber']
  },

  // ===== LUNCH =====
  {
    id: 'grilled_chicken_salad',
    name: 'Grilled Chicken & Quinoa Salad',
    servings: 1,
    cookingTime: 25,
    difficulty: 'intermediate',
    category: 'lunch',
    cuisineType: 'Mediterranean',
    ingredients: [
      { foodId: 'chicken_breast', name: 'Chicken Breast', amount: 120, unit: 'g' },
      { foodId: 'quinoa', name: 'Quinoa (cooked)', amount: 100, unit: 'g' },
      { foodId: 'spinach', name: 'Baby Spinach', amount: 60, unit: 'g' },
      { foodId: 'bell_pepper', name: 'Bell Pepper', amount: 50, unit: 'g' },
      { foodId: 'cucumber', name: 'Cucumber', amount: 50, unit: 'g' },
      { foodId: 'olive_oil', name: 'Olive Oil dressing', amount: 10, unit: 'ml' }
    ],
    instructions: [
      'Season chicken breast with herbs and grill for 6-7 minutes per side.',
      'Cook quinoa according to package instructions and let cool.',
      'Combine spinach, diced bell pepper, and cucumber in a bowl.',
      'Slice grilled chicken and arrange on top.',
      'Add quinoa and drizzle with olive oil and lemon juice.'
    ],
    nutrition: {
      calories: 450, carbs: 32, protein: 42, fat: 16,
      saturatedFat: 2.5, fiber: 6, sodium: 130, potassium: 720,
      calcium: 110, magnesium: 105, iron: 4, glycemicIndex: 45
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['high-protein', 'balanced', 'meal-prep']
  },
  {
    id: 'dal_brown_rice',
    name: 'Dal Tadka with Brown Rice',
    servings: 1,
    cookingTime: 30,
    difficulty: 'intermediate',
    category: 'lunch',
    cuisineType: 'Indian',
    ingredients: [
      { foodId: 'lentils', name: 'Yellow Lentils (Toor Dal)', amount: 100, unit: 'g' },
      { foodId: 'brown_rice', name: 'Brown Rice (cooked)', amount: 120, unit: 'g' },
      { foodId: 'tomato', name: 'Tomato', amount: 80, unit: 'g' },
      { foodId: 'spinach', name: 'Spinach', amount: 50, unit: 'g' },
      { foodId: 'turmeric', name: 'Turmeric', amount: 2, unit: 'g' },
      { foodId: 'olive_oil', name: 'Ghee/Oil', amount: 8, unit: 'ml' }
    ],
    instructions: [
      'Pressure cook lentils with turmeric until soft (3-4 whistles).',
      'Heat oil, add cumin seeds, garlic, and chopped tomatoes.',
      'Add spinach and cook until wilted.',
      'Pour tempering over cooked lentils and mix well.',
      'Serve with steamed brown rice.'
    ],
    nutrition: {
      calories: 420, carbs: 62, protein: 20, fat: 10,
      saturatedFat: 1.8, fiber: 14, sodium: 35, potassium: 680,
      calcium: 85, magnesium: 95, iron: 6, glycemicIndex: 42
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['high-fiber', 'plant-based', 'comfort-food', 'low-sodium']
  },
  {
    id: 'salmon_sweet_potato',
    name: 'Baked Salmon with Sweet Potato',
    servings: 1,
    cookingTime: 30,
    difficulty: 'intermediate',
    category: 'lunch',
    cuisineType: 'Global',
    ingredients: [
      { foodId: 'salmon', name: 'Salmon Fillet', amount: 150, unit: 'g' },
      { foodId: 'sweet_potato', name: 'Sweet Potato', amount: 150, unit: 'g' },
      { foodId: 'broccoli', name: 'Broccoli', amount: 100, unit: 'g' },
      { foodId: 'olive_oil', name: 'Olive Oil', amount: 10, unit: 'ml' }
    ],
    instructions: [
      'Preheat oven to 200°C (400°F).',
      'Cube sweet potato, toss with olive oil, and roast for 15 min.',
      'Season salmon with herbs, place on baking tray.',
      'Add broccoli florets around the salmon.',
      'Bake for 12-15 minutes until salmon is flaky.'
    ],
    nutrition: {
      calories: 485, carbs: 35, protein: 35, fat: 23,
      saturatedFat: 4.5, fiber: 7, sodium: 120, potassium: 980,
      calcium: 65, magnesium: 85, iron: 2, glycemicIndex: 40
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['omega3', 'high-protein', 'anti-inflammatory']
  },
  {
    id: 'chickpea_buddha_bowl',
    name: 'Chickpea Buddha Bowl',
    servings: 1,
    cookingTime: 20,
    difficulty: 'easy',
    category: 'lunch',
    cuisineType: 'Mediterranean',
    ingredients: [
      { foodId: 'chickpeas', name: 'Chickpeas', amount: 120, unit: 'g' },
      { foodId: 'quinoa', name: 'Quinoa (cooked)', amount: 100, unit: 'g' },
      { foodId: 'avocado', name: 'Avocado', amount: 50, unit: 'g' },
      { foodId: 'spinach', name: 'Spinach', amount: 50, unit: 'g' },
      { foodId: 'carrot', name: 'Carrot (shredded)', amount: 50, unit: 'g' },
      { foodId: 'olive_oil', name: 'Tahini Dressing', amount: 10, unit: 'ml' }
    ],
    instructions: [
      'Roast seasoned chickpeas at 200°C for 15 minutes.',
      'Arrange quinoa, spinach, and shredded carrot in a bowl.',
      'Top with roasted chickpeas and sliced avocado.',
      'Drizzle with tahini dressing.'
    ],
    nutrition: {
      calories: 480, carbs: 55, protein: 18, fat: 22,
      saturatedFat: 3, fiber: 14, sodium: 55, potassium: 820,
      calcium: 100, magnesium: 120, iron: 5, glycemicIndex: 35
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['plant-based', 'high-fiber', 'vegan', 'colorful']
  },
  {
    id: 'paneer_tikka_wrap',
    name: 'Paneer Tikka Whole Wheat Wrap',
    servings: 1,
    cookingTime: 25,
    difficulty: 'intermediate',
    category: 'lunch',
    cuisineType: 'Indian',
    ingredients: [
      { foodId: 'paneer', name: 'Paneer', amount: 80, unit: 'g' },
      { foodId: 'roti', name: 'Whole Wheat Roti', amount: 80, unit: 'g' },
      { foodId: 'bell_pepper', name: 'Bell Pepper', amount: 60, unit: 'g' },
      { foodId: 'greek_yogurt', name: 'Yogurt Marinade', amount: 30, unit: 'g' },
      { foodId: 'spinach', name: 'Spinach Leaves', amount: 30, unit: 'g' }
    ],
    instructions: [
      'Marinate paneer cubes in yogurt with tikka spices for 30 minutes.',
      'Grill paneer and bell peppers until charred.',
      'Warm the whole wheat roti.',
      'Layer spinach, grilled paneer, and veggies on roti.',
      'Roll tightly and serve.'
    ],
    nutrition: {
      calories: 430, carbs: 34, protein: 24, fat: 22,
      saturatedFat: 11, fiber: 6, sodium: 85, potassium: 350,
      calcium: 450, magnesium: 55, iron: 2.5, glycemicIndex: 48
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['high-protein', 'vegetarian', 'calcium-rich']
  },
  {
    id: 'lentil_soup',
    name: 'Hearty Lentil & Vegetable Soup',
    servings: 2,
    cookingTime: 35,
    difficulty: 'easy',
    category: 'lunch',
    cuisineType: 'Mediterranean',
    ingredients: [
      { foodId: 'lentils', name: 'Green/Brown Lentils', amount: 150, unit: 'g' },
      { foodId: 'carrot', name: 'Carrot (diced)', amount: 80, unit: 'g' },
      { foodId: 'spinach', name: 'Spinach', amount: 60, unit: 'g' },
      { foodId: 'tomato', name: 'Tomatoes', amount: 100, unit: 'g' },
      { foodId: 'turmeric', name: 'Turmeric', amount: 2, unit: 'g' },
      { foodId: 'olive_oil', name: 'Olive Oil', amount: 10, unit: 'ml' }
    ],
    instructions: [
      'Heat olive oil, sauté diced carrots and onion for 5 minutes.',
      'Add chopped tomatoes, turmeric, cumin, and lentils.',
      'Add 600ml water or low-sodium broth, bring to boil.',
      'Simmer for 25 minutes until lentils are tender.',
      'Stir in spinach, cook 2 more minutes. Season to taste.'
    ],
    nutrition: {
      calories: 260, carbs: 38, protein: 16, fat: 6,
      saturatedFat: 0.8, fiber: 13, sodium: 45, potassium: 720,
      calcium: 80, magnesium: 70, iron: 5.5, glycemicIndex: 30
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['comfort-food', 'high-fiber', 'low-fat', 'batch-cook']
  },

  // ===== DINNER =====
  {
    id: 'grilled_salmon_veggies',
    name: 'Grilled Salmon with Roasted Vegetables',
    servings: 1,
    cookingTime: 25,
    difficulty: 'intermediate',
    category: 'dinner',
    cuisineType: 'Mediterranean',
    ingredients: [
      { foodId: 'salmon', name: 'Salmon Fillet', amount: 150, unit: 'g' },
      { foodId: 'broccoli', name: 'Broccoli', amount: 100, unit: 'g' },
      { foodId: 'zucchini', name: 'Zucchini', amount: 100, unit: 'g' },
      { foodId: 'bell_pepper', name: 'Bell Pepper', amount: 80, unit: 'g' },
      { foodId: 'olive_oil', name: 'Olive Oil', amount: 10, unit: 'ml' }
    ],
    instructions: [
      'Preheat oven to 200°C.',
      'Toss vegetables with olive oil and herbs, spread on baking tray.',
      'Season salmon with lemon, dill, and black pepper.',
      'Place salmon on veggies, bake 18-20 minutes.',
      'Serve with a squeeze of fresh lemon.'
    ],
    nutrition: {
      calories: 410, carbs: 14, protein: 35, fat: 25,
      saturatedFat: 4.8, fiber: 6, sodium: 110, potassium: 850,
      calcium: 70, magnesium: 80, iron: 2, glycemicIndex: 10
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['omega3', 'anti-inflammatory', 'high-protein', 'low-carb']
  },
  {
    id: 'chicken_stir_fry',
    name: 'Chicken & Vegetable Stir-Fry',
    servings: 1,
    cookingTime: 20,
    difficulty: 'easy',
    category: 'dinner',
    cuisineType: 'Asian',
    ingredients: [
      { foodId: 'chicken_breast', name: 'Chicken Breast (sliced)', amount: 120, unit: 'g' },
      { foodId: 'broccoli', name: 'Broccoli', amount: 80, unit: 'g' },
      { foodId: 'bell_pepper', name: 'Bell Pepper', amount: 60, unit: 'g' },
      { foodId: 'carrot', name: 'Carrot (julienned)', amount: 50, unit: 'g' },
      { foodId: 'brown_rice', name: 'Brown Rice (cooked)', amount: 100, unit: 'g' },
      { foodId: 'olive_oil', name: 'Sesame Oil', amount: 8, unit: 'ml' }
    ],
    instructions: [
      'Heat sesame oil in a wok over high heat.',
      'Stir-fry sliced chicken for 4-5 minutes until cooked.',
      'Add vegetables and stir-fry for 3-4 minutes (keep crisp).',
      'Add low-sodium soy sauce and a splash of rice vinegar.',
      'Serve over steamed brown rice.'
    ],
    nutrition: {
      calories: 430, carbs: 40, protein: 38, fat: 14,
      saturatedFat: 2.5, fiber: 6, sodium: 280, potassium: 650,
      calcium: 65, magnesium: 75, iron: 2.5, glycemicIndex: 45
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: false },
    tags: ['quick', 'high-protein', 'balanced']
  },
  {
    id: 'rajma_brown_rice',
    name: 'Rajma (Kidney Bean Curry) with Brown Rice',
    servings: 1,
    cookingTime: 40,
    difficulty: 'intermediate',
    category: 'dinner',
    cuisineType: 'Indian',
    ingredients: [
      { foodId: 'kidney_beans', name: 'Kidney Beans (cooked)', amount: 150, unit: 'g' },
      { foodId: 'brown_rice', name: 'Brown Rice', amount: 120, unit: 'g' },
      { foodId: 'tomato', name: 'Tomatoes', amount: 100, unit: 'g' },
      { foodId: 'olive_oil', name: 'Oil', amount: 8, unit: 'ml' },
      { foodId: 'turmeric', name: 'Turmeric', amount: 2, unit: 'g' }
    ],
    instructions: [
      'Heat oil, sauté onions until golden.',
      'Add ginger-garlic paste, tomatoes, turmeric, and spices.',
      'Cook until tomatoes break down into a thick sauce.',
      'Add cooked kidney beans and 100ml water.',
      'Simmer for 15-20 minutes. Serve with brown rice.'
    ],
    nutrition: {
      calories: 445, carbs: 68, protein: 19, fat: 11,
      saturatedFat: 1.5, fiber: 14, sodium: 40, potassium: 700,
      calcium: 75, magnesium: 90, iron: 5, glycemicIndex: 38
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['plant-based', 'high-fiber', 'comfort-food', 'iron-rich']
  },
  {
    id: 'tofu_veggie_bowl',
    name: 'Crispy Tofu & Vegetable Bowl',
    servings: 1,
    cookingTime: 25,
    difficulty: 'intermediate',
    category: 'dinner',
    cuisineType: 'Asian',
    ingredients: [
      { foodId: 'tofu', name: 'Firm Tofu', amount: 150, unit: 'g' },
      { foodId: 'brown_rice', name: 'Brown Rice', amount: 100, unit: 'g' },
      { foodId: 'broccoli', name: 'Broccoli', amount: 80, unit: 'g' },
      { foodId: 'carrot', name: 'Carrot', amount: 50, unit: 'g' },
      { foodId: 'spinach', name: 'Spinach', amount: 50, unit: 'g' },
      { foodId: 'olive_oil', name: 'Oil', amount: 10, unit: 'ml' }
    ],
    instructions: [
      'Press tofu and cut into cubes. Pan-fry until golden and crispy.',
      'Steam broccoli and carrots until tender-crisp.',
      'Wilt spinach in the same pan.',
      'Serve over brown rice with a drizzle of low-sodium teriyaki.',
      'Garnish with sesame seeds.'
    ],
    nutrition: {
      calories: 420, carbs: 42, protein: 26, fat: 18,
      saturatedFat: 2.5, fiber: 8, sodium: 65, potassium: 680,
      calcium: 750, magnesium: 100, iron: 5, glycemicIndex: 42
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['vegan', 'plant-based', 'calcium-rich', 'high-protein']
  },
  {
    id: 'palak_paneer',
    name: 'Palak Paneer with Roti',
    servings: 1,
    cookingTime: 30,
    difficulty: 'intermediate',
    category: 'dinner',
    cuisineType: 'Indian',
    ingredients: [
      { foodId: 'paneer', name: 'Paneer', amount: 80, unit: 'g' },
      { foodId: 'spinach', name: 'Spinach', amount: 200, unit: 'g' },
      { foodId: 'roti', name: 'Whole Wheat Roti', amount: 80, unit: 'g' },
      { foodId: 'tomato', name: 'Tomato', amount: 50, unit: 'g' },
      { foodId: 'olive_oil', name: 'Oil/Ghee', amount: 8, unit: 'ml' }
    ],
    instructions: [
      'Blanch spinach in boiling water for 2 minutes, then blend smooth.',
      'Sauté tomatoes with ginger-garlic paste.',
      'Add spinach puree, cumin, and garam masala.',
      'Cube paneer and add to the gravy. Simmer 5 minutes.',
      'Serve with warm whole wheat roti.'
    ],
    nutrition: {
      calories: 440, carbs: 30, protein: 26, fat: 25,
      saturatedFat: 13, fiber: 8, sodium: 175, potassium: 1050,
      calcium: 680, magnesium: 160, iron: 8, glycemicIndex: 40
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['vegetarian', 'calcium-rich', 'iron-rich', 'comfort-food']
  },
  {
    id: 'chicken_barley_soup',
    name: 'Chicken & Barley Soup',
    servings: 2,
    cookingTime: 35,
    difficulty: 'easy',
    category: 'dinner',
    cuisineType: 'Global',
    ingredients: [
      { foodId: 'chicken_breast', name: 'Chicken Breast', amount: 120, unit: 'g' },
      { foodId: 'barley', name: 'Pearl Barley', amount: 80, unit: 'g' },
      { foodId: 'carrot', name: 'Carrot', amount: 60, unit: 'g' },
      { foodId: 'spinach', name: 'Spinach', amount: 50, unit: 'g' },
      { foodId: 'tomato', name: 'Tomato', amount: 50, unit: 'g' }
    ],
    instructions: [
      'Simmer diced chicken in 800ml water with herbs for 10 min.',
      'Add barley, diced carrots and tomato. Cook 20 min.',
      'Stir in spinach in the last 2 minutes.',
      'Season with pepper, serve hot.'
    ],
    nutrition: {
      calories: 320, carbs: 38, protein: 28, fat: 6,
      saturatedFat: 1.2, fiber: 8, sodium: 120, potassium: 580,
      calcium: 65, magnesium: 60, iron: 3, glycemicIndex: 28
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['low-gi', 'comfort-food', 'high-fiber', 'low-fat']
  },
  {
    id: 'black_bean_tacos',
    name: 'Black Bean & Veggie Tacos',
    servings: 2,
    cookingTime: 20,
    difficulty: 'easy',
    category: 'dinner',
    cuisineType: 'Mexican',
    ingredients: [
      { foodId: 'black_beans', name: 'Black Beans', amount: 150, unit: 'g' },
      { foodId: 'roti', name: 'Corn Tortillas', amount: 60, unit: 'g' },
      { foodId: 'avocado', name: 'Avocado', amount: 50, unit: 'g' },
      { foodId: 'tomato', name: 'Tomato Salsa', amount: 60, unit: 'g' },
      { foodId: 'bell_pepper', name: 'Bell Pepper', amount: 50, unit: 'g' }
    ],
    instructions: [
      'Warm black beans with cumin, chili powder, and garlic.',
      'Sauté bell peppers until tender.',
      'Warm tortillas in a dry pan.',
      'Fill with beans, peppers, salsa, and sliced avocado.',
      'Top with a squeeze of lime and cilantro.'
    ],
    nutrition: {
      calories: 380, carbs: 52, protein: 16, fat: 13,
      saturatedFat: 2, fiber: 16, sodium: 60, potassium: 700,
      calcium: 65, magnesium: 100, iron: 4, glycemicIndex: 32
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['vegan', 'high-fiber', 'quick', 'fun']
  },

  // ===== SNACKS =====
  {
    id: 'apple_almond_butter',
    name: 'Apple Slices with Almond Butter',
    servings: 1,
    cookingTime: 3,
    difficulty: 'easy',
    category: 'snack',
    cuisineType: 'Global',
    ingredients: [
      { foodId: 'apple', name: 'Apple', amount: 150, unit: 'g' },
      { foodId: 'almonds', name: 'Almond Butter', amount: 15, unit: 'g' }
    ],
    instructions: [
      'Slice apple into wedges.',
      'Serve with a tablespoon of almond butter for dipping.'
    ],
    nutrition: {
      calories: 165, carbs: 24, protein: 4, fat: 8,
      saturatedFat: 0.6, fiber: 5.5, sodium: 2, potassium: 280,
      calcium: 50, magnesium: 45, iron: 0.6, glycemicIndex: 35
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['quick', 'portable', 'low-gi']
  },
  {
    id: 'trail_mix',
    name: 'Homemade Trail Mix',
    servings: 1,
    cookingTime: 2,
    difficulty: 'easy',
    category: 'snack',
    cuisineType: 'Global',
    ingredients: [
      { foodId: 'almonds', name: 'Almonds', amount: 15, unit: 'g' },
      { foodId: 'walnuts', name: 'Walnuts', amount: 10, unit: 'g' },
      { foodId: 'pumpkin_seeds', name: 'Pumpkin Seeds', amount: 10, unit: 'g' }
    ],
    instructions: [
      'Combine all nuts and seeds in a small container.',
      'Store in an airtight container for on-the-go snacking.'
    ],
    nutrition: {
      calories: 195, carbs: 6, protein: 8, fat: 17,
      saturatedFat: 1.8, fiber: 3, sodium: 2, potassium: 240,
      calcium: 55, magnesium: 100, iron: 1.5, glycemicIndex: 15
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['portable', 'omega3', 'magnesium-rich', 'no-cook']
  },
  {
    id: 'veggie_sticks_hummus',
    name: 'Veggie Sticks with Hummus',
    servings: 1,
    cookingTime: 5,
    difficulty: 'easy',
    category: 'snack',
    cuisineType: 'Mediterranean',
    ingredients: [
      { foodId: 'carrot', name: 'Carrot Sticks', amount: 60, unit: 'g' },
      { foodId: 'cucumber', name: 'Cucumber Sticks', amount: 60, unit: 'g' },
      { foodId: 'bell_pepper', name: 'Bell Pepper Strips', amount: 40, unit: 'g' },
      { foodId: 'chickpeas', name: 'Hummus', amount: 50, unit: 'g' }
    ],
    instructions: [
      'Cut vegetables into sticks.',
      'Serve with a portion of hummus for dipping.'
    ],
    nutrition: {
      calories: 140, carbs: 20, protein: 6, fat: 4,
      saturatedFat: 0.4, fiber: 6, sodium: 30, potassium: 350,
      calcium: 45, magnesium: 35, iron: 2, glycemicIndex: 15
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['low-calorie', 'high-fiber', 'quick', 'colorful']
  },
  {
    id: 'green_tea_energy_balls',
    name: 'Oat & Nut Energy Balls',
    servings: 4,
    cookingTime: 15,
    difficulty: 'easy',
    category: 'snack',
    cuisineType: 'Global',
    ingredients: [
      { foodId: 'oats', name: 'Rolled Oats', amount: 50, unit: 'g' },
      { foodId: 'almonds', name: 'Almond Butter', amount: 20, unit: 'g' },
      { foodId: 'flaxseeds', name: 'Ground Flaxseeds', amount: 10, unit: 'g' },
      { foodId: 'chia_seeds', name: 'Chia Seeds', amount: 10, unit: 'g' }
    ],
    instructions: [
      'Combine oats, almond butter, flaxseeds, and chia seeds.',
      'Add a drizzle of honey or date paste for sweetness.',
      'Mix well and roll into small balls.',
      'Refrigerate for 30 minutes before serving.'
    ],
    nutrition: {
      calories: 110, carbs: 12, protein: 4, fat: 6,
      saturatedFat: 0.6, fiber: 4, sodium: 3, potassium: 130,
      calcium: 60, magnesium: 65, iron: 1.5, glycemicIndex: 40
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['meal-prep', 'portable', 'high-fiber', 'omega3']
  },
  {
    id: 'banana_smoothie',
    name: 'Green Protein Smoothie',
    servings: 1,
    cookingTime: 5,
    difficulty: 'easy',
    category: 'snack',
    cuisineType: 'Global',
    ingredients: [
      { foodId: 'banana', name: 'Banana (frozen)', amount: 80, unit: 'g' },
      { foodId: 'spinach', name: 'Spinach', amount: 40, unit: 'g' },
      { foodId: 'greek_yogurt', name: 'Greek Yogurt', amount: 80, unit: 'g' },
      { foodId: 'flaxseeds', name: 'Ground Flaxseeds', amount: 8, unit: 'g' },
      { foodId: 'low_fat_milk', name: 'Low-Fat Milk', amount: 150, unit: 'ml' }
    ],
    instructions: [
      'Add all ingredients to a blender.',
      'Blend until smooth and creamy.',
      'Pour into a glass and enjoy immediately.'
    ],
    nutrition: {
      calories: 210, carbs: 28, protein: 14, fat: 5,
      saturatedFat: 1.5, fiber: 4, sodium: 85, potassium: 550,
      calcium: 230, magnesium: 60, iron: 1.5, glycemicIndex: 35
    },
    diseaseFlags: { pcos: true, diabetes: true, hypertension: true },
    tags: ['quick', 'high-protein', 'calcium-rich', 'refreshing']
  }
];

export const getRecipeById = (id) => recipeDatabase.find(r => r.id === id);

export const getRecipesByCategory = (category) => recipeDatabase.filter(r => r.category === category);

export const getRecipesByCondition = (condition) => {
  const flag = condition === 'PCOS' ? 'pcos' :
               condition === 'Diabetes' ? 'diabetes' :
               'hypertension';
  return recipeDatabase.filter(r => r.diseaseFlags[flag]);
};

export const getRecipesByCuisine = (cuisine) => recipeDatabase.filter(r => r.cuisineType === cuisine);

export const getRecipesByDifficulty = (difficulty) => recipeDatabase.filter(r => r.difficulty === difficulty);

export const getRecipesByTag = (tag) => recipeDatabase.filter(r => r.tags.includes(tag));

export default recipeDatabase;

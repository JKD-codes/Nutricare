// Comprehensive food database with full nutrition data per 100g serving
// Sources: USDA FoodData Central, clinical nutrition references

const foodDatabase = [
  // ===== PROTEINS =====
  {
    id: 'chicken_breast',
    name: 'Chicken Breast (Grilled)',
    category: 'protein',
    servingSize: 100,
    unit: 'g',
    nutrition: {
      calories: 165, carbs: 0, protein: 31, fat: 3.6,
      saturatedFat: 1, fiber: 0, sodium: 74, potassium: 256,
      calcium: 13, magnesium: 29, iron: 0.9, vitaminD: 0, omega3: 0.05
    },
    glycemicIndex: 0,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: false, vegan: false
    }
  },
  {
    id: 'salmon',
    name: 'Salmon (Baked)',
    category: 'protein',
    servingSize: 100,
    unit: 'g',
    nutrition: {
      calories: 208, carbs: 0, protein: 20, fat: 13,
      saturatedFat: 3.1, fiber: 0, sodium: 59, potassium: 363,
      calcium: 12, magnesium: 30, iron: 0.3, vitaminD: 11, omega3: 2.3
    },
    glycemicIndex: 0,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: false, vegan: false
    }
  },
  {
    id: 'eggs',
    name: 'Eggs (Boiled)',
    category: 'protein',
    servingSize: 50,
    unit: 'g',
    nutrition: {
      calories: 78, carbs: 0.6, protein: 6.3, fat: 5.3,
      saturatedFat: 1.6, fiber: 0, sodium: 62, potassium: 63,
      calcium: 25, magnesium: 5, iron: 0.9, vitaminD: 1.1, omega3: 0.04
    },
    glycemicIndex: 0,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: false
    }
  },
  {
    id: 'tofu',
    name: 'Tofu (Firm)',
    category: 'protein',
    servingSize: 100,
    unit: 'g',
    nutrition: {
      calories: 144, carbs: 3.4, protein: 17, fat: 8.7,
      saturatedFat: 1.3, fiber: 2.3, sodium: 14, potassium: 237,
      calcium: 683, magnesium: 58, iron: 2.7, vitaminD: 0, omega3: 0.4
    },
    glycemicIndex: 15,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'paneer',
    name: 'Paneer (Indian Cottage Cheese)',
    category: 'protein',
    servingSize: 100,
    unit: 'g',
    nutrition: {
      calories: 265, carbs: 1.2, protein: 18.3, fat: 20.8,
      saturatedFat: 13, fiber: 0, sodium: 18, potassium: 100,
      calcium: 480, magnesium: 25, iron: 0.2, vitaminD: 0.4, omega3: 0.1
    },
    glycemicIndex: 0,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: false
    }
  },
  {
    id: 'greek_yogurt',
    name: 'Greek Yogurt (Low-fat)',
    category: 'dairy',
    servingSize: 150,
    unit: 'g',
    nutrition: {
      calories: 100, carbs: 6, protein: 17, fat: 0.7,
      saturatedFat: 0.5, fiber: 0, sodium: 56, potassium: 240,
      calcium: 150, magnesium: 15, iron: 0.1, vitaminD: 0, omega3: 0
    },
    glycemicIndex: 11,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: false
    }
  },
  {
    id: 'tuna',
    name: 'Tuna (Canned in Water)',
    category: 'protein',
    servingSize: 100,
    unit: 'g',
    nutrition: {
      calories: 116, carbs: 0, protein: 25.5, fat: 0.8,
      saturatedFat: 0.2, fiber: 0, sodium: 338, potassium: 237,
      calcium: 11, magnesium: 33, iron: 1.3, vitaminD: 2.7, omega3: 0.2
    },
    glycemicIndex: 0,
    flags: {
      high_fiber: false, low_sodium: false, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: false,
      vegetarian: false, vegan: false
    }
  },

  // ===== GRAINS & CEREALS =====
  {
    id: 'oats',
    name: 'Oats (Rolled)',
    category: 'grain',
    servingSize: 50,
    unit: 'g',
    nutrition: {
      calories: 190, carbs: 33.5, protein: 6.5, fat: 3.5,
      saturatedFat: 0.6, fiber: 5, sodium: 1, potassium: 180,
      calcium: 27, magnesium: 88, iron: 2.4, vitaminD: 0, omega3: 0.04
    },
    glycemicIndex: 55,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'brown_rice',
    name: 'Brown Rice (Cooked)',
    category: 'grain',
    servingSize: 150,
    unit: 'g',
    nutrition: {
      calories: 172, carbs: 36, protein: 3.6, fat: 1.4,
      saturatedFat: 0.3, fiber: 2.7, sodium: 5, potassium: 115,
      calcium: 15, magnesium: 60, iron: 0.6, vitaminD: 0, omega3: 0.02
    },
    glycemicIndex: 50,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'quinoa',
    name: 'Quinoa (Cooked)',
    category: 'grain',
    servingSize: 150,
    unit: 'g',
    nutrition: {
      calories: 180, carbs: 32, protein: 6.4, fat: 2.8,
      saturatedFat: 0.3, fiber: 3.8, sodium: 7, potassium: 318,
      calcium: 23, magnesium: 89, iron: 2, vitaminD: 0, omega3: 0.1
    },
    glycemicIndex: 53,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'whole_wheat_bread',
    name: 'Whole Wheat Bread',
    category: 'grain',
    servingSize: 40,
    unit: 'g',
    nutrition: {
      calories: 92, carbs: 17, protein: 3.6, fat: 1.4,
      saturatedFat: 0.3, fiber: 2.4, sodium: 147, potassium: 100,
      calcium: 40, magnesium: 32, iron: 1.2, vitaminD: 0, omega3: 0.02
    },
    glycemicIndex: 54,
    flags: {
      high_fiber: false, low_sodium: false, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'sweet_potato',
    name: 'Sweet Potato (Baked)',
    category: 'grain',
    servingSize: 150,
    unit: 'g',
    nutrition: {
      calories: 135, carbs: 31, protein: 3, fat: 0.2,
      saturatedFat: 0.05, fiber: 4.5, sodium: 54, potassium: 540,
      calcium: 45, magnesium: 38, iron: 0.9, vitaminD: 0, omega3: 0
    },
    glycemicIndex: 44,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'roti',
    name: 'Whole Wheat Roti',
    category: 'grain',
    servingSize: 40,
    unit: 'g',
    nutrition: {
      calories: 104, carbs: 18, protein: 3.5, fat: 2.5,
      saturatedFat: 0.4, fiber: 2.8, sodium: 6, potassium: 70,
      calcium: 12, magnesium: 20, iron: 1, vitaminD: 0, omega3: 0.01
    },
    glycemicIndex: 52,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'barley',
    name: 'Barley (Cooked)',
    category: 'grain',
    servingSize: 150,
    unit: 'g',
    nutrition: {
      calories: 175, carbs: 38, protein: 3.6, fat: 0.7,
      saturatedFat: 0.15, fiber: 6, sodium: 5, potassium: 175,
      calcium: 18, magnesium: 40, iron: 1.6, vitaminD: 0, omega3: 0.03
    },
    glycemicIndex: 28,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },

  // ===== LEGUMES =====
  {
    id: 'lentils',
    name: 'Lentils (Cooked)',
    category: 'legume',
    servingSize: 150,
    unit: 'g',
    nutrition: {
      calories: 173, carbs: 30, protein: 13.5, fat: 0.6,
      saturatedFat: 0.1, fiber: 11.7, sodium: 3, potassium: 546,
      calcium: 28, magnesium: 54, iron: 5, vitaminD: 0, omega3: 0.05
    },
    glycemicIndex: 32,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'chickpeas',
    name: 'Chickpeas (Cooked)',
    category: 'legume',
    servingSize: 150,
    unit: 'g',
    nutrition: {
      calories: 246, carbs: 41, protein: 14.5, fat: 3.8,
      saturatedFat: 0.4, fiber: 10.5, sodium: 18, potassium: 430,
      calcium: 72, magnesium: 64, iron: 4.5, vitaminD: 0, omega3: 0.1
    },
    glycemicIndex: 28,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'kidney_beans',
    name: 'Kidney Beans (Cooked)',
    category: 'legume',
    servingSize: 150,
    unit: 'g',
    nutrition: {
      calories: 200, carbs: 36, protein: 13, fat: 0.75,
      saturatedFat: 0.1, fiber: 9.3, sodium: 6, potassium: 525,
      calcium: 52, magnesium: 54, iron: 3.3, vitaminD: 0, omega3: 0.1
    },
    glycemicIndex: 24,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'black_beans',
    name: 'Black Beans (Cooked)',
    category: 'legume',
    servingSize: 150,
    unit: 'g',
    nutrition: {
      calories: 198, carbs: 36, protein: 12.8, fat: 0.8,
      saturatedFat: 0.2, fiber: 11.4, sodium: 2, potassium: 483,
      calcium: 35, magnesium: 84, iron: 2.7, vitaminD: 0, omega3: 0.1
    },
    glycemicIndex: 30,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'moong_dal',
    name: 'Moong Dal (Cooked)',
    category: 'legume',
    servingSize: 150,
    unit: 'g',
    nutrition: {
      calories: 157, carbs: 27, protein: 12, fat: 0.6,
      saturatedFat: 0.1, fiber: 7.5, sodium: 4, potassium: 400,
      calcium: 40, magnesium: 60, iron: 3.5, vitaminD: 0, omega3: 0.02
    },
    glycemicIndex: 31,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },

  // ===== VEGETABLES =====
  {
    id: 'spinach',
    name: 'Spinach (Cooked)',
    category: 'vegetable',
    servingSize: 100,
    unit: 'g',
    nutrition: {
      calories: 23, carbs: 3.6, protein: 2.9, fat: 0.4,
      saturatedFat: 0.07, fiber: 2.2, sodium: 70, potassium: 466,
      calcium: 136, magnesium: 87, iron: 3.6, vitaminD: 0, omega3: 0.1
    },
    glycemicIndex: 15,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'broccoli',
    name: 'Broccoli (Steamed)',
    category: 'vegetable',
    servingSize: 100,
    unit: 'g',
    nutrition: {
      calories: 35, carbs: 7.2, protein: 2.4, fat: 0.4,
      saturatedFat: 0.04, fiber: 3.3, sodium: 41, potassium: 293,
      calcium: 40, magnesium: 21, iron: 0.7, vitaminD: 0, omega3: 0.1
    },
    glycemicIndex: 10,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'bell_pepper',
    name: 'Bell Pepper (Mixed)',
    category: 'vegetable',
    servingSize: 100,
    unit: 'g',
    nutrition: {
      calories: 31, carbs: 6, protein: 1, fat: 0.3,
      saturatedFat: 0.04, fiber: 2.1, sodium: 4, potassium: 211,
      calcium: 7, magnesium: 12, iron: 0.4, vitaminD: 0, omega3: 0.02
    },
    glycemicIndex: 15,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'tomato',
    name: 'Tomato (Fresh)',
    category: 'vegetable',
    servingSize: 100,
    unit: 'g',
    nutrition: {
      calories: 18, carbs: 3.9, protein: 0.9, fat: 0.2,
      saturatedFat: 0.03, fiber: 1.2, sodium: 5, potassium: 237,
      calcium: 10, magnesium: 11, iron: 0.3, vitaminD: 0, omega3: 0
    },
    glycemicIndex: 15,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    category: 'vegetable',
    servingSize: 100,
    unit: 'g',
    nutrition: {
      calories: 15, carbs: 3.6, protein: 0.7, fat: 0.1,
      saturatedFat: 0.01, fiber: 0.5, sodium: 2, potassium: 147,
      calcium: 16, magnesium: 13, iron: 0.3, vitaminD: 0, omega3: 0
    },
    glycemicIndex: 15,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower (Steamed)',
    category: 'vegetable',
    servingSize: 100,
    unit: 'g',
    nutrition: {
      calories: 23, carbs: 4.1, protein: 1.8, fat: 0.5,
      saturatedFat: 0.07, fiber: 2.8, sodium: 15, potassium: 142,
      calcium: 16, magnesium: 9, iron: 0.3, vitaminD: 0, omega3: 0.05
    },
    glycemicIndex: 15,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'zucchini',
    name: 'Zucchini (Sautéed)',
    category: 'vegetable',
    servingSize: 100,
    unit: 'g',
    nutrition: {
      calories: 17, carbs: 3.1, protein: 1.2, fat: 0.3,
      saturatedFat: 0.05, fiber: 1, sodium: 8, potassium: 261,
      calcium: 16, magnesium: 18, iron: 0.4, vitaminD: 0, omega3: 0.03
    },
    glycemicIndex: 15,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'carrot',
    name: 'Carrot',
    category: 'vegetable',
    servingSize: 80,
    unit: 'g',
    nutrition: {
      calories: 33, carbs: 7.7, protein: 0.7, fat: 0.2,
      saturatedFat: 0.03, fiber: 2.2, sodium: 55, potassium: 256,
      calcium: 26, magnesium: 10, iron: 0.2, vitaminD: 0, omega3: 0
    },
    glycemicIndex: 39,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },

  // ===== FRUITS =====
  {
    id: 'blueberries',
    name: 'Blueberries',
    category: 'fruit',
    servingSize: 100,
    unit: 'g',
    nutrition: {
      calories: 57, carbs: 14.5, protein: 0.7, fat: 0.3,
      saturatedFat: 0.02, fiber: 2.4, sodium: 1, potassium: 77,
      calcium: 6, magnesium: 6, iron: 0.3, vitaminD: 0, omega3: 0.06
    },
    glycemicIndex: 25,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'strawberries',
    name: 'Strawberries',
    category: 'fruit',
    servingSize: 100,
    unit: 'g',
    nutrition: {
      calories: 32, carbs: 7.7, protein: 0.7, fat: 0.3,
      saturatedFat: 0.01, fiber: 2, sodium: 1, potassium: 153,
      calcium: 16, magnesium: 13, iron: 0.4, vitaminD: 0, omega3: 0.07
    },
    glycemicIndex: 25,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'apple',
    name: 'Apple',
    category: 'fruit',
    servingSize: 150,
    unit: 'g',
    nutrition: {
      calories: 78, carbs: 20.7, protein: 0.4, fat: 0.3,
      saturatedFat: 0.05, fiber: 3.6, sodium: 2, potassium: 160,
      calcium: 9, magnesium: 8, iron: 0.2, vitaminD: 0, omega3: 0.01
    },
    glycemicIndex: 36,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'banana',
    name: 'Banana',
    category: 'fruit',
    servingSize: 120,
    unit: 'g',
    nutrition: {
      calories: 107, carbs: 27, protein: 1.3, fat: 0.4,
      saturatedFat: 0.13, fiber: 3.1, sodium: 1, potassium: 422,
      calcium: 6, magnesium: 32, iron: 0.3, vitaminD: 0, omega3: 0.03
    },
    glycemicIndex: 51,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'avocado',
    name: 'Avocado',
    category: 'fruit',
    servingSize: 70,
    unit: 'g',
    nutrition: {
      calories: 112, carbs: 5.9, protein: 1.4, fat: 10.3,
      saturatedFat: 1.4, fiber: 4.7, sodium: 5, potassium: 339,
      calcium: 8, magnesium: 20, iron: 0.4, vitaminD: 0, omega3: 0.07
    },
    glycemicIndex: 15,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'orange',
    name: 'Orange',
    category: 'fruit',
    servingSize: 130,
    unit: 'g',
    nutrition: {
      calories: 61, carbs: 15.4, protein: 1.2, fat: 0.2,
      saturatedFat: 0.02, fiber: 3.1, sodium: 0, potassium: 232,
      calcium: 52, magnesium: 13, iron: 0.1, vitaminD: 0, omega3: 0.01
    },
    glycemicIndex: 43,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },

  // ===== NUTS & SEEDS =====
  {
    id: 'almonds',
    name: 'Almonds',
    category: 'nut',
    servingSize: 30,
    unit: 'g',
    nutrition: {
      calories: 173, carbs: 6.5, protein: 6.3, fat: 14.9,
      saturatedFat: 1.1, fiber: 3.7, sodium: 0, potassium: 220,
      calcium: 81, magnesium: 81, iron: 1.1, vitaminD: 0, omega3: 0
    },
    glycemicIndex: 15,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'walnuts',
    name: 'Walnuts',
    category: 'nut',
    servingSize: 30,
    unit: 'g',
    nutrition: {
      calories: 196, carbs: 4.1, protein: 4.6, fat: 19.6,
      saturatedFat: 1.8, fiber: 2, sodium: 1, potassium: 132,
      calcium: 29, magnesium: 47, iron: 0.9, vitaminD: 0, omega3: 2.7
    },
    glycemicIndex: 15,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'flaxseeds',
    name: 'Flaxseeds (Ground)',
    category: 'nut',
    servingSize: 15,
    unit: 'g',
    nutrition: {
      calories: 80, carbs: 4.3, protein: 2.7, fat: 6.3,
      saturatedFat: 0.55, fiber: 4.1, sodium: 5, potassium: 122,
      calcium: 38, magnesium: 59, iron: 0.9, vitaminD: 0, omega3: 3.4
    },
    glycemicIndex: 0,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'chia_seeds',
    name: 'Chia Seeds',
    category: 'nut',
    servingSize: 20,
    unit: 'g',
    nutrition: {
      calories: 97, carbs: 8.4, protein: 3.3, fat: 6.2,
      saturatedFat: 0.7, fiber: 6.9, sodium: 3, potassium: 81,
      calcium: 126, magnesium: 67, iron: 1.5, vitaminD: 0, omega3: 3.6
    },
    glycemicIndex: 1,
    flags: {
      high_fiber: true, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'pumpkin_seeds',
    name: 'Pumpkin Seeds',
    category: 'nut',
    servingSize: 30,
    unit: 'g',
    nutrition: {
      calories: 170, carbs: 3, protein: 9, fat: 14.4,
      saturatedFat: 2.5, fiber: 1.1, sodium: 5, potassium: 253,
      calcium: 14, magnesium: 162, iron: 2.5, vitaminD: 0, omega3: 0.05
    },
    glycemicIndex: 10,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },

  // ===== FATS & OILS =====
  {
    id: 'olive_oil',
    name: 'Extra Virgin Olive Oil',
    category: 'fat',
    servingSize: 15,
    unit: 'ml',
    nutrition: {
      calories: 120, carbs: 0, protein: 0, fat: 14,
      saturatedFat: 1.9, fiber: 0, sodium: 0, potassium: 0,
      calcium: 0, magnesium: 0, iron: 0, vitaminD: 0, omega3: 0.1
    },
    glycemicIndex: 0,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },

  // ===== SPICES & EXTRAS =====
  {
    id: 'turmeric',
    name: 'Turmeric Powder',
    category: 'spice',
    servingSize: 3,
    unit: 'g',
    nutrition: {
      calories: 9, carbs: 2, protein: 0.3, fat: 0.1,
      saturatedFat: 0, fiber: 0.6, sodium: 1, potassium: 62,
      calcium: 5, magnesium: 6, iron: 1.2, vitaminD: 0, omega3: 0
    },
    glycemicIndex: 0,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'cinnamon',
    name: 'Cinnamon',
    category: 'spice',
    servingSize: 3,
    unit: 'g',
    nutrition: {
      calories: 7, carbs: 2.4, protein: 0.1, fat: 0.04,
      saturatedFat: 0.01, fiber: 1.6, sodium: 0, potassium: 13,
      calcium: 30, magnesium: 2, iron: 0.3, vitaminD: 0, omega3: 0
    },
    glycemicIndex: 0,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'green_tea',
    name: 'Green Tea (Brewed)',
    category: 'beverage',
    servingSize: 240,
    unit: 'ml',
    nutrition: {
      calories: 2, carbs: 0, protein: 0.5, fat: 0,
      saturatedFat: 0, fiber: 0, sodium: 2, potassium: 20,
      calcium: 0, magnesium: 2, iron: 0, vitaminD: 0, omega3: 0
    },
    glycemicIndex: 0,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: true
    }
  },
  {
    id: 'low_fat_milk',
    name: 'Low-Fat Milk',
    category: 'dairy',
    servingSize: 200,
    unit: 'ml',
    nutrition: {
      calories: 84, carbs: 10, protein: 6.8, fat: 2,
      saturatedFat: 1.3, fiber: 0, sodium: 86, potassium: 300,
      calcium: 240, magnesium: 22, iron: 0, vitaminD: 2.5, omega3: 0.01
    },
    glycemicIndex: 32,
    flags: {
      high_fiber: false, low_sodium: true, inflammatory: false,
      pcos_beneficial: true, diabetes_safe: true, hypertension_safe: true,
      vegetarian: true, vegan: false
    }
  }
];

export const getFoodById = (id) => foodDatabase.find(f => f.id === id);

export const getFoodsByCategory = (category) => foodDatabase.filter(f => f.category === category);

export const getFoodsByCondition = (condition) => {
  const flag = condition === 'PCOS' ? 'pcos_beneficial' :
               condition === 'Diabetes' ? 'diabetes_safe' :
               'hypertension_safe';
  return foodDatabase.filter(f => f.flags[flag]);
};

export const getVegetarianFoods = () => foodDatabase.filter(f => f.flags.vegetarian);

export const getVeganFoods = () => foodDatabase.filter(f => f.flags.vegan);

export const getLowGIFoods = (maxGI = 55) => foodDatabase.filter(f => f.glycemicIndex <= maxGI);

export default foodDatabase;

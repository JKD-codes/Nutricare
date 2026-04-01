// Medication-diet interaction rules

const medicationInteractions = {
  // Diabetes Medications
  metformin: {
    name: 'Metformin',
    condition: 'Diabetes',
    interactions: [
      { type: 'depletion', nutrient: 'Vitamin B12', severity: 'moderate',
        advice: 'May deplete B12. Include salmon, fortified cereals, eggs, or consider supplementation.' },
      { type: 'caution', nutrient: 'Alcohol', severity: 'high',
        advice: 'Avoid excessive alcohol — increases risk of lactic acidosis.' }
    ]
  },
  sulfonylureas: {
    name: 'Sulfonylureas (Glipizide, Glyburide)',
    condition: 'Diabetes',
    interactions: [
      { type: 'timing', nutrient: 'Meals', severity: 'high',
        advice: 'Risk of hypoglycemia — maintain consistent meal timing. Do not skip meals.' },
      { type: 'caution', nutrient: 'Alcohol', severity: 'moderate',
        advice: 'Alcohol may potentiate hypoglycemia. Limit intake.' }
    ]
  },
  sglt2_inhibitors: {
    name: 'SGLT2 Inhibitors (Empagliflozin, Dapagliflozin)',
    condition: 'Diabetes',
    interactions: [
      { type: 'increase', nutrient: 'Hydration', severity: 'moderate',
        advice: 'Increases urination and thirst. Drink 8-10 glasses of water daily.' },
      { type: 'caution', nutrient: 'Sodium', severity: 'low',
        advice: 'May cause mild sodium depletion. Monitor electrolytes.' }
    ]
  },
  glp1_agonists: {
    name: 'GLP-1 Agonists (Semaglutide, Liraglutide)',
    condition: 'Diabetes',
    interactions: [
      { type: 'caution', nutrient: 'Appetite', severity: 'moderate',
        advice: 'May significantly reduce appetite. Ensure adequate nutrition despite reduced hunger. Focus on nutrient-dense foods.' },
      { type: 'timing', nutrient: 'Meals', severity: 'low',
        advice: 'Eat slowly and stop when full. Smaller, frequent meals may help with nausea.' }
    ]
  },

  // Hypertension Medications
  ace_inhibitors: {
    name: 'ACE Inhibitors (Lisinopril, Enalapril, Ramipril)',
    condition: 'Hypertension',
    interactions: [
      { type: 'caution', nutrient: 'Potassium', severity: 'high',
        advice: '⚠️ May cause potassium accumulation. Monitor potassium-rich foods (bananas, potatoes, oranges). Regular blood tests recommended.' },
      { type: 'timing', nutrient: 'Salt substitutes', severity: 'high',
        advice: 'Avoid potassium-based salt substitutes — risk of hyperkalemia.' }
    ]
  },
  arbs: {
    name: 'ARBs (Losartan, Valsartan)',
    condition: 'Hypertension',
    interactions: [
      { type: 'caution', nutrient: 'Potassium', severity: 'high',
        advice: '⚠️ Similar to ACE inhibitors — monitor potassium intake carefully.' }
    ]
  },
  diuretics: {
    name: 'Diuretics (Hydrochlorothiazide, Furosemide)',
    condition: 'Hypertension',
    interactions: [
      { type: 'depletion', nutrient: 'Potassium', severity: 'high',
        advice: 'May deplete potassium. Increase potassium-rich foods: bananas, sweet potato, spinach, beans.' },
      { type: 'depletion', nutrient: 'Magnesium', severity: 'moderate',
        advice: 'May deplete magnesium. Include nuts, seeds, legumes, whole grains.' },
      { type: 'increase', nutrient: 'Hydration', severity: 'moderate',
        advice: 'Stay well-hydrated to prevent dehydration.' }
    ]
  },
  beta_blockers: {
    name: 'Beta-blockers (Atenolol, Metoprolol)',
    condition: 'Hypertension',
    interactions: [
      { type: 'caution', nutrient: 'Triglycerides', severity: 'moderate',
        advice: 'May increase triglycerides. Limit refined carbs and sugars.' },
      { type: 'timing', nutrient: 'Meals', severity: 'low',
        advice: 'Take with food to reduce stomach upset.' }
    ]
  },
  calcium_channel_blockers: {
    name: 'Calcium Channel Blockers (Amlodipine, Nifedipine)',
    condition: 'Hypertension',
    interactions: [
      { type: 'caution', nutrient: 'Grapefruit', severity: 'high',
        advice: '⚠️ Avoid grapefruit and grapefruit juice — can increase drug levels dangerously.' }
    ]
  }
};

/**
 * Get medication interactions for a list of medications
 */
export const getMedicationAlerts = (medications = []) => {
  const alerts = [];
  const medKeys = Object.keys(medicationInteractions);

  medications.forEach(med => {
    const medLower = med.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    medKeys.forEach(key => {
      const entry = medicationInteractions[key];
      const entryNameLower = entry.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      if (medLower.includes(key) || entryNameLower.includes(medLower) || medLower.includes(key.replace('_', ''))) {
        entry.interactions.forEach(interaction => {
          alerts.push({
            medication: entry.name,
            ...interaction
          });
        });
      }
    });
  });

  return alerts;
};

export default medicationInteractions;

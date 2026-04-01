import { useState } from 'react';
import { ShoppingCart, Check, Package, Carrot, Wheat, Milk, Nut, Leaf, Coffee } from 'lucide-react';

const categoryIcons = {
  protein: Package, dairy: Milk, grain: Wheat,
  produce: Carrot, pantry: Nut, legume: Leaf,
  beverage: Coffee, other: ShoppingCart
};
const categoryLabels = {
  protein: 'Protein', dairy: 'Dairy', grain: 'Grains & Starches',
  produce: 'Fruits & Vegetables', pantry: 'Nuts, Seeds & Pantry',
  legume: 'Legumes & Beans', beverage: 'Beverages', other: 'Other'
};
const categoryColors = {
  protein: 'text-rose-400 bg-rose-500/8 border-rose-500/10',
  dairy: 'text-blue-400 bg-blue-500/8 border-blue-500/10',
  grain: 'text-amber-400 bg-amber-500/8 border-amber-500/10',
  produce: 'text-green-400 bg-green-500/8 border-green-500/10',
  pantry: 'text-orange-400 bg-orange-500/8 border-orange-500/10',
  legume: 'text-emerald-400 bg-emerald-500/8 border-emerald-500/10',
  beverage: 'text-cyan-400 bg-cyan-500/8 border-cyan-500/10',
  other: 'text-slate-400 bg-slate-500/8 border-slate-500/10'
};

export default function ShoppingList({ mealPlanData }) {
  const [checked, setChecked] = useState({});
  const shoppingList = mealPlanData?.shoppingList || {};

  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

  const totalItems = Object.values(shoppingList).reduce((sum, items) => sum + items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const categoryOrder = ['produce', 'protein', 'legume', 'grain', 'dairy', 'pantry', 'beverage', 'other'];
  const sortedCategories = categoryOrder.filter(c => shoppingList[c]?.length > 0);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">Shopping List</h1>
          <p className="text-sm text-slate-500 mt-1">Weekly ingredients for your meal plan</p>
        </div>
        <div className="stat-card px-4 py-2.5 flex items-center gap-2">
          <span className="text-primary font-bold text-lg">{checkedCount}</span>
          <span className="text-slate-500 text-sm">/ {totalItems} items</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="nutrition-bar" style={{ height: '5px' }}>
          <div
            className="nutrition-bar-fill bg-gradient-to-r from-emerald-500 to-teal-400"
            style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {sortedCategories.map(category => {
          const Icon = categoryIcons[category] || ShoppingCart;
          const items = shoppingList[category];
          const colors = categoryColors[category] || categoryColors.other;

          return (
            <div key={category} className="glass-card overflow-hidden">
              <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-white/[0.04]">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colors}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h2 className="font-semibold text-white text-sm">{categoryLabels[category]}</h2>
                <span className="tag ml-auto">{items.length}</span>
              </div>
              <div>
                {items.map((item, i) => {
                  const key = `${category}-${i}`;
                  const isChecked = checked[key];
                  return (
                    <button
                      key={i}
                      onClick={() => toggle(key)}
                      className={`w-full flex items-center gap-3.5 px-5 py-3.5 text-left transition-all border-b border-white/[0.02] last:border-0 ${
                        isChecked ? 'opacity-40' : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                        isChecked
                          ? 'bg-primary border-primary'
                          : 'border-slate-700'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`flex-1 text-sm ${isChecked ? 'text-slate-600 line-through' : 'text-slate-300'}`}>
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-500 font-mono bg-white/[0.03] px-2.5 py-1 rounded-lg">
                        {item.amount}{item.unit}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {sortedCategories.length === 0 && (
        <div className="text-center py-20 text-slate-600">
          <ShoppingCart className="w-10 h-10 mx-auto mb-4 opacity-30" />
          <p className="text-sm">No shopping list generated yet.</p>
        </div>
      )}
    </div>
  );
}

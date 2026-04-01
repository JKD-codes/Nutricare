import { useState } from 'react';
import { ShoppingCart, Check, Package, Carrot, Wheat, Milk, Nut, Leaf, Coffee } from 'lucide-react';

const categoryIcons = {
  protein: Package,
  dairy: Milk,
  grain: Wheat,
  produce: Carrot,
  pantry: Nut,
  legume: Leaf,
  beverage: Coffee,
  other: ShoppingCart
};

const categoryLabels = {
  protein: 'Protein',
  dairy: 'Dairy',
  grain: 'Grains & Starches',
  produce: 'Fruits & Vegetables',
  pantry: 'Nuts, Seeds & Pantry',
  legume: 'Legumes & Beans',
  beverage: 'Beverages',
  other: 'Other'
};

const categoryColors = {
  protein: 'text-rose-400 bg-rose-500/10',
  dairy: 'text-blue-400 bg-blue-500/10',
  grain: 'text-amber-400 bg-amber-500/10',
  produce: 'text-green-400 bg-green-500/10',
  pantry: 'text-orange-400 bg-orange-500/10',
  legume: 'text-emerald-400 bg-emerald-500/10',
  beverage: 'text-cyan-400 bg-cyan-500/10',
  other: 'text-slate-400 bg-slate-500/10'
};

export default function ShoppingList({ mealPlanData }) {
  const [checked, setChecked] = useState({});
  const shoppingList = mealPlanData?.shoppingList || {};

  const toggle = (key) => {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItems = Object.values(shoppingList).reduce((sum, items) => sum + items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const categoryOrder = ['produce', 'protein', 'legume', 'grain', 'dairy', 'pantry', 'beverage', 'other'];
  const sortedCategories = categoryOrder.filter(c => shoppingList[c]?.length > 0);

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Shopping List</h1>
          <p className="text-slate-400">Weekly ingredients for your meal plan</p>
        </div>
        <div className="glass-card px-4 py-2 text-sm">
          <span className="text-primary font-semibold">{checkedCount}</span>
          <span className="text-slate-400"> / {totalItems} items</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="nutrition-bar" style={{ height: '6px' }}>
          <div
            className="nutrition-bar-fill bg-gradient-to-r from-emerald-500 to-teal-400"
            style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {sortedCategories.map(category => {
          const Icon = categoryIcons[category] || ShoppingCart;
          const items = shoppingList[category];

          return (
            <div key={category} className="glass-card overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-slate-800">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${categoryColors[category]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h2 className="font-semibold text-white">{categoryLabels[category]}</h2>
                <span className="text-xs text-slate-500 ml-auto">{items.length} items</span>
              </div>
              <div className="divide-y divide-slate-800/50">
                {items.map((item, i) => {
                  const key = `${category}-${i}`;
                  const isChecked = checked[key];
                  return (
                    <button
                      key={i}
                      onClick={() => toggle(key)}
                      className={`w-full flex items-center gap-3 p-4 text-left transition-all ${
                        isChecked ? 'opacity-50' : 'hover:bg-slate-800/30'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-primary border-primary'
                          : 'border-slate-600'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`flex-1 text-sm ${isChecked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                        {item.name}
                      </span>
                      <span className="text-sm text-slate-500 font-mono">
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
        <div className="text-center py-20 text-slate-500">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No shopping list generated yet.</p>
        </div>
      )}
    </div>
  );
}

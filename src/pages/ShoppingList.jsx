import { useState } from 'react';
import { ShoppingCart, Check, Package, Carrot, Wheat, Milk, Nut, Leaf, Coffee } from 'lucide-react';

const catIcons = { protein: Package, dairy: Milk, grain: Wheat, produce: Carrot, pantry: Nut, legume: Leaf, beverage: Coffee, other: ShoppingCart };
const catLabels = { protein: 'Protein', dairy: 'Dairy', grain: 'Grains & Starches', produce: 'Fruits & Vegetables', pantry: 'Nuts, Seeds & Pantry', legume: 'Legumes & Beans', beverage: 'Beverages', other: 'Other' };
const catColors = {
  protein: 'text-rose-400 bg-rose-500/[0.06]', dairy: 'text-blue-400 bg-blue-500/[0.06]',
  grain: 'text-amber-400 bg-amber-500/[0.06]', produce: 'text-green-400 bg-green-500/[0.06]',
  pantry: 'text-orange-400 bg-orange-500/[0.06]', legume: 'text-emerald-400 bg-emerald-500/[0.06]',
  beverage: 'text-cyan-400 bg-cyan-500/[0.06]', other: 'text-slate-400 bg-slate-500/[0.06]'
};

export default function ShoppingList({ mealPlanData }) {
  const [checked, setChecked] = useState({});
  const shoppingList = mealPlanData?.shoppingList || {};
  const toggle = (key) => setChecked(p => ({ ...p, [key]: !p[key] }));

  const totalItems = Object.values(shoppingList).reduce((s, arr) => s + arr.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const order = ['produce', 'protein', 'legume', 'grain', 'dairy', 'pantry', 'beverage', 'other'];
  const sorted = order.filter(c => shoppingList[c]?.length > 0);

  return (
    <div className="page-container">
      <div className="flex flex-col items-center justify-center text-center gap-4 mb-8 w-full">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">Shopping List</h1>
          <p className="text-base text-slate-500">Weekly ingredients</p>
        </div>
        <div className="stat-card px-5 py-2.5 flex items-center gap-2 text-sm mt-2">
          <span className="text-primary font-bold text-lg">{checkedCount}</span>
          <span className="text-slate-500">of {totalItems} items collected</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="nutrition-bar">
          <div className="nutrition-bar-fill bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${totalItems ? (checkedCount / totalItems) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map(cat => {
          const Icon = catIcons[cat] || ShoppingCart;
          const items = shoppingList[cat];
          const colors = catColors[cat] || catColors.other;

          return (
            <div key={cat} className="glass-elevated overflow-hidden">
              <div className="flex flex-col items-center justify-center text-center gap-3 px-6 py-5 border-b border-white/[0.03]">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">{catLabels[cat]}</span>
                  <span className="tag text-xs">{items.length}</span>
                </div>
              </div>
              <div>
                {items.map((item, i) => {
                  const key = `${cat}-${i}`;
                  const done = checked[key];
                  return (
                    <button key={i} onClick={() => toggle(key)}
                      className={`w-full flex items-center gap-4 px-6 py-3.5 text-left transition-colors border-b border-white/[0.02] last:border-0 ${done ? 'opacity-35' : 'hover:bg-white/[0.015]'}`}>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${done ? 'bg-primary border-primary' : 'border-slate-700'}`}>
                        {done && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className={`flex-1 text-base ${done ? 'text-slate-600 line-through' : 'text-slate-300'}`}>{item.name}</span>
                      <span className="text-sm text-slate-500 font-mono bg-white/[0.02] px-2.5 py-1 rounded-md">{item.amount}{item.unit}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!sorted.length && (
        <div className="text-center py-16 text-slate-600">
          <ShoppingCart className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-xs">No shopping list yet.</p>
        </div>
      )}
    </div>
  );
}

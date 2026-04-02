import { useState } from 'react';
import { ShoppingCart, Check, Package, Carrot, Wheat, Milk, Nut, Leaf, Coffee } from 'lucide-react';

const catIcons = { protein: Package, dairy: Milk, grain: Wheat, produce: Carrot, pantry: Nut, legume: Leaf, beverage: Coffee, other: ShoppingCart };
const catLabels = { protein: 'Protein', dairy: 'Dairy', grain: 'Grains & Starches', produce: 'Fruits & Vegetables', pantry: 'Nuts, Seeds & Pantry', legume: 'Legumes & Beans', beverage: 'Beverages', other: 'Other' };
const catColorMap = {
  protein: { color: '#fb7185', bg: 'rgba(244,63,94,0.06)' },
  dairy: { color: '#60a5fa', bg: 'rgba(59,130,246,0.06)' },
  grain: { color: '#fbbf24', bg: 'rgba(245,158,11,0.06)' },
  produce: { color: '#4ade80', bg: 'rgba(34,197,94,0.06)' },
  pantry: { color: '#fb923c', bg: 'rgba(249,115,22,0.06)' },
  legume: { color: '#34d399', bg: 'rgba(16,185,129,0.06)' },
  beverage: { color: '#22d3ee', bg: 'rgba(6,182,212,0.06)' },
  other: { color: '#94a3b8', bg: 'rgba(148,163,184,0.06)' },
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
    <div style={{ padding: '24px 20px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: 8 }}>Shopping List</h1>
          <p style={{ fontSize: '1rem', color: '#64748b' }}>Weekly ingredients</p>
        </div>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: '0.875rem' }}>
          <span style={{ color: '#10b981', fontWeight: 700, fontSize: '1.125rem' }}>{checkedCount}</span>
          <span style={{ color: '#64748b' }}>of {totalItems} items collected</span>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 20 }}>
        <div className="nutrition-bar">
          <div className="nutrition-bar-fill" style={{
            background: 'linear-gradient(90deg, #10b981, #2dd4bf)',
            width: `${totalItems ? (checkedCount / totalItems) * 100 : 0}%`,
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sorted.map(cat => {
          const Icon = catIcons[cat] || ShoppingCart;
          const items = shoppingList[cat];
          const colors = catColorMap[cat] || catColorMap.other;

          return (
            <div key={cat} className="glass-elevated" style={{ overflow: 'hidden' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.03)',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: colors.bg, color: colors.color,
                }}>
                  <Icon style={{ width: 20, height: 20 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, color: 'white', fontSize: '0.9375rem' }}>{catLabels[cat]}</span>
                  <span className="tag" style={{ fontSize: '0.75rem' }}>{items.length}</span>
                </div>
              </div>
              <div>
                {items.map((item, i) => {
                  const key = `${cat}-${i}`;
                  const done = checked[key];
                  return (
                    <button key={i} onClick={() => toggle(key)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 16,
                        padding: '14px 24px', textAlign: 'left',
                        background: 'none', border: 'none', cursor: 'pointer',
                        borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.02)' : 'none',
                        opacity: done ? 0.35 : 1,
                        transition: 'all 0.2s',
                      }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                        border: done ? '2px solid #10b981' : '2px solid #334155',
                        background: done ? '#10b981' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}>
                        {done && <Check style={{ width: 14, height: 14, color: 'white' }} />}
                      </div>
                      <span style={{
                        flex: 1, fontSize: '0.9375rem',
                        color: done ? '#475569' : '#cbd5e1',
                        textDecoration: done ? 'line-through' : 'none',
                      }}>{item.name}</span>
                      <span style={{
                        fontSize: '0.8125rem', color: '#64748b', fontFamily: 'monospace',
                        background: 'rgba(255,255,255,0.02)', padding: '4px 10px', borderRadius: 6,
                      }}>{item.amount}{item.unit}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!sorted.length && (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#475569' }}>
          <ShoppingCart style={{ width: 32, height: 32, margin: '0 auto 12px', opacity: 0.3 }} />
          <p style={{ fontSize: '0.8125rem' }}>No shopping list yet.</p>
        </div>
      )}
    </div>
  );
}

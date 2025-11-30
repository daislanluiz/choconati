import React, { useState } from 'react';
import { Ingredient, UnitType } from '../types';
import { Plus, Trash2, Save, X } from 'lucide-react';

interface InventoryProps {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

export const Inventory: React.FC<InventoryProps> = ({ ingredients, setIngredients }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    name: '',
    packagePrice: 0,
    packageQuantity: 0,
    unit: UnitType.KG,
    currentStock: 0,
    minStockThreshold: 1
  });

  const handleAdd = () => {
    if (!newIngredient.name || !newIngredient.packagePrice) return;
    
    const id = Math.random().toString(36).substr(2, 9);
    setIngredients([...ingredients, { ...newIngredient, id } as Ingredient]);
    setIsAdding(false);
    setNewIngredient({
      name: '',
      packagePrice: 0,
      packageQuantity: 0,
      unit: UnitType.KG,
      currentStock: 0,
      minStockThreshold: 1
    });
  };

  const handleDelete = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const handleUpdateStock = (id: string, val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    setIngredients(ingredients.map(i => i.id === id ? { ...i, currentStock: num } : i));
  };

  // Helper to calculate unit cost based on spreadsheet logic
  const getUnitCost = (price: number, quantity: number) => {
    if (quantity === 0) return 0;
    return price / quantity;
  };

  return (
    <div className="p-6 pb-24 md:pb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-3xl font-bold text-stone-800">Estoque e Custos</h2>
            <p className="text-stone-500">Gerencie sua matéria-prima e custos base.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700 transition"
        >
          <Plus size={20} /> Adicionar Item
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-100 mb-6 animate-fade-in">
          <h3 className="font-semibold text-stone-700 mb-4">Novo Ingrediente</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-stone-500 mb-1">Nome</label>
              <input
                type="text"
                className="w-full p-2 border border-stone-200 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="ex: Farinha de Trigo"
                value={newIngredient.name}
                onChange={e => setNewIngredient({ ...newIngredient, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Preço (Pct)</label>
              <input
                type="number"
                step="0.01"
                className="w-full p-2 border border-stone-200 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                value={newIngredient.packagePrice || ''}
                onChange={e => setNewIngredient({ ...newIngredient, packagePrice: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Tam. (Pct)</label>
              <input
                type="number"
                className="w-full p-2 border border-stone-200 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                value={newIngredient.packageQuantity || ''}
                onChange={e => setNewIngredient({ ...newIngredient, packageQuantity: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Unidade</label>
              <select
                className="w-full p-2 border border-stone-200 rounded focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                value={newIngredient.unit}
                onChange={e => setNewIngredient({ ...newIngredient, unit: e.target.value as UnitType })}
              >
                {Object.values(UnitType).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Estoque Inicial (Pcts)</label>
              <input
                type="number"
                className="w-full p-2 border border-stone-200 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                value={newIngredient.currentStock || ''}
                onChange={e => setNewIngredient({ ...newIngredient, currentStock: parseFloat(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-stone-500 hover:bg-stone-100 rounded">Cancelar</button>
            <button onClick={handleAdd} className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 flex items-center gap-2">
                <Save size={16} /> Salvar Item
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-sm">
              <th className="p-4 font-medium">Ingrediente</th>
              <th className="p-4 font-medium">Preço Pct</th>
              <th className="p-4 font-medium">Tam. Pct</th>
              <th className="p-4 font-medium">Unidade</th>
              <th className="p-4 font-medium bg-amber-50 text-amber-800">Custo Unit.</th>
              <th className="p-4 font-medium">Estoque (Pcts)</th>
              <th className="p-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {ingredients.map(ing => {
              const unitCost = getUnitCost(ing.packagePrice, ing.packageQuantity);
              return (
                <tr key={ing.id} className="hover:bg-stone-50 transition-colors group">
                  <td className="p-4 text-stone-800 font-medium">{ing.name}</td>
                  <td className="p-4 text-stone-600">R${ing.packagePrice.toFixed(2)}</td>
                  <td className="p-4 text-stone-600">{ing.packageQuantity}</td>
                  <td className="p-4 text-stone-600 uppercase text-xs font-bold tracking-wider">{ing.unit}</td>
                  <td className="p-4 text-amber-700 font-mono font-medium bg-amber-50/50">
                    R${unitCost.toFixed(4)} <span className="text-[10px] text-amber-500">/{ing.unit === UnitType.KG ? 'kg' : ing.unit === UnitType.G ? 'g' : ing.unit}</span>
                  </td>
                  <td className="p-4">
                    <input
                        type="number"
                        min="0"
                        value={ing.currentStock}
                        onChange={(e) => handleUpdateStock(ing.id, e.target.value)}
                        className={`w-20 p-1 border rounded text-center focus:ring-2 focus:ring-amber-500 outline-none ${ing.currentStock <= ing.minStockThreshold ? 'border-red-300 bg-red-50 text-red-700' : 'border-stone-200'}`}
                    />
                  </td>
                  <td className="p-4 text-right">
                    <button
                        onClick={() => handleDelete(ing.id)}
                        className="text-stone-400 hover:text-red-500 transition-colors p-2"
                        title="Excluir Ingrediente"
                    >
                        <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {ingredients.length === 0 && (
            <div className="p-12 text-center text-stone-400">
                Nenhum ingrediente encontrado. Adicione alguns para começar!
            </div>
        )}
      </div>
    </div>
  );
};
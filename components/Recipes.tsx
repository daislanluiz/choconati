import React, { useState } from 'react';
import { Ingredient, Recipe, RecipeIngredient } from '../types';
import { Plus, Trash2, Calculator, ChevronRight, X } from 'lucide-react';

interface RecipesProps {
  ingredients: Ingredient[];
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

export const Recipes: React.FC<RecipesProps> = ({ ingredients, recipes, setRecipes }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState<Partial<Recipe>>({
    name: '',
    laborCost: 0,
    profitMargin: 50,
    ingredients: []
  });

  const addIngredientToRecipe = (ingId: string) => {
    if (activeRecipe.ingredients?.find(ri => ri.ingredientId === ingId)) return;
    const newIng: RecipeIngredient = { ingredientId: ingId, quantityUsed: 0 };
    setActiveRecipe({
      ...activeRecipe,
      ingredients: [...(activeRecipe.ingredients || []), newIng]
    });
  };

  const removeIngredientFromRecipe = (ingId: string) => {
    setActiveRecipe({
      ...activeRecipe,
      ingredients: activeRecipe.ingredients?.filter(i => i.ingredientId !== ingId)
    });
  };

  const updateQuantity = (ingId: string, qty: number) => {
    setActiveRecipe({
      ...activeRecipe,
      ingredients: activeRecipe.ingredients?.map(i => i.ingredientId === ingId ? { ...i, quantityUsed: qty } : i)
    });
  };

  const calculateCost = (recipe: Partial<Recipe>) => {
    let materialCost = 0;
    recipe.ingredients?.forEach(ri => {
      const ing = ingredients.find(i => i.id === ri.ingredientId);
      if (ing) {
        const unitCost = ing.packagePrice / ing.packageQuantity;
        materialCost += unitCost * ri.quantityUsed;
      }
    });
    const totalCost = materialCost + (recipe.laborCost || 0);
    const sellingPrice = totalCost * (1 + (recipe.profitMargin || 0) / 100);
    return { materialCost, totalCost, sellingPrice };
  };

  const handleSave = () => {
    if (!activeRecipe.name || !activeRecipe.ingredients?.length) return;
    const id = Math.random().toString(36).substr(2, 9);
    setRecipes([...recipes, { ...activeRecipe, id } as Recipe]);
    setIsCreating(false);
    setActiveRecipe({ name: '', laborCost: 0, profitMargin: 50, ingredients: [] });
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  const { materialCost, totalCost, sellingPrice } = calculateCost(activeRecipe);

  return (
    <div className="p-6 pb-24 md:pb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-3xl font-bold text-stone-800">Calculadora de Preços</h2>
            <p className="text-stone-500">Crie receitas e calcule preços de venda lucrativos.</p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700 transition"
          >
            <Plus size={20} /> Criar Receita
          </button>
        )}
      </div>

      {isCreating ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Recipe Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
              <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <Calculator size={18} className="text-amber-600"/> Detalhes da Receita
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-stone-500 mb-1">Nome da Receita</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-stone-200 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="ex: Bolo de Chocolate 20cm"
                    value={activeRecipe.name}
                    onChange={e => setActiveRecipe({ ...activeRecipe, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">Mão de Obra/Custos Fixos (R$)</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-stone-200 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                    value={activeRecipe.laborCost || ''}
                    onChange={e => setActiveRecipe({ ...activeRecipe, laborCost: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">Margem de Lucro (%)</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-stone-200 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                    value={activeRecipe.profitMargin}
                    onChange={e => setActiveRecipe({ ...activeRecipe, profitMargin: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-stone-700 mb-2">Ingredientes Usados</h4>
                <div className="space-y-2">
                  {activeRecipe.ingredients?.map(ri => {
                    const ing = ingredients.find(i => i.id === ri.ingredientId);
                    if (!ing) return null;
                    const unitCost = ing.packagePrice / ing.packageQuantity;
                    const cost = unitCost * ri.quantityUsed;

                    return (
                      <div key={ri.ingredientId} className="flex items-center gap-3 p-2 bg-stone-50 rounded border border-stone-100">
                        <span className="flex-1 text-sm font-medium text-stone-700">{ing.name}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            className="w-20 p-1 border rounded text-right text-sm outline-none focus:border-amber-500"
                            placeholder="Qtd"
                            value={ri.quantityUsed || ''}
                            onChange={(e) => updateQuantity(ri.ingredientId, parseFloat(e.target.value))}
                          />
                          <span className="text-xs text-stone-400 w-8">{ing.unit === 'kg' || ing.unit === 'g' ? 'g/kg' : ing.unit}</span>
                        </div>
                        <span className="w-16 text-right text-sm font-mono text-stone-600">R${cost.toFixed(2)}</span>
                        <button onClick={() => removeIngredientFromRecipe(ri.ingredientId)} className="text-stone-400 hover:text-red-500">
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                  {activeRecipe.ingredients?.length === 0 && (
                    <p className="text-sm text-stone-400 italic">Nenhum ingrediente adicionado.</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-stone-500 mb-2">Adicionar Ingrediente do Estoque</label>
                <select 
                    className="w-full p-2 border border-stone-200 rounded bg-white text-sm"
                    onChange={(e) => {
                        if(e.target.value) {
                            addIngredientToRecipe(e.target.value);
                            e.target.value = '';
                        }
                    }}
                >
                    <option value="">Selecione um ingrediente...</option>
                    {ingredients.map(ing => (
                        <option key={ing.id} value={ing.id}>{ing.name} (Estoque: {ing.currentStock} {ing.unit})</option>
                    ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
                <button onClick={() => setIsCreating(false)} className="px-6 py-2 text-stone-600 hover:bg-stone-100 rounded-lg">Cancelar</button>
                <button onClick={handleSave} className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 shadow-lg shadow-amber-200">
                    Salvar Receita
                </button>
            </div>
          </div>

          {/* Cost Preview Card */}
          <div className="lg:col-span-1">
            <div className="bg-stone-900 text-stone-50 p-6 rounded-xl shadow-xl sticky top-6">
                <h3 className="text-lg font-bold text-amber-500 mb-6">Resumo Financeiro</h3>
                
                <div className="space-y-4">
                    <div className="flex justify-between border-b border-stone-800 pb-2">
                        <span className="text-stone-400">Custo Material</span>
                        <span className="font-mono">R${materialCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-800 pb-2">
                        <span className="text-stone-400">Mão de Obra/Fixos</span>
                        <span className="font-mono">R${(activeRecipe.laborCost || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-800 pb-2">
                        <span className="text-stone-300 font-medium">Custo Total</span>
                        <span className="font-mono font-bold">R${totalCost.toFixed(2)}</span>
                    </div>
                    
                    <div className="pt-4">
                        <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Preço de Venda Sugerido</div>
                        <div className="text-4xl font-bold text-green-400 font-mono">
                            R${sellingPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-stone-400 mt-2">
                            Com {activeRecipe.profitMargin}% de margem
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => {
            const costs = calculateCost(recipe);
            return (
              <div key={recipe.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow group relative">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteRecipe(recipe.id)} className="text-stone-300 hover:text-red-500">
                        <Trash2 size={18} />
                    </button>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-1">{recipe.name}</h3>
                <p className="text-stone-500 text-sm mb-4">{recipe.ingredients.length} ingredientes</p>
                
                <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-stone-500">Custo Prod.:</span>
                        <span className="font-medium text-stone-700">R${costs.totalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-stone-500">Preço Venda:</span>
                        <span className="font-bold text-amber-600">R${costs.sellingPrice.toFixed(2)}</span>
                    </div>
                </div>
                
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                        className="bg-green-500 h-full" 
                        style={{ width: `${(costs.materialCost / costs.sellingPrice) * 100}%`}}
                    ></div>
                </div>
                <div className="text-[10px] text-stone-400 mt-1 text-center">Eficiência de Custo</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Ingredient, Recipe, UnitType } from '../types';
import { DollarSign, AlertTriangle, PackageOpen } from 'lucide-react';

interface DashboardProps {
  ingredients: Ingredient[];
  recipes: Recipe[];
}

export const Dashboard: React.FC<DashboardProps> = ({ ingredients, recipes }) => {
  
  const stats = useMemo(() => {
    let totalValue = 0;
    let lowStock = 0;

    ingredients.forEach(ing => {
      // Calculate unit cost
      const unitCost = ing.packagePrice / ing.packageQuantity;
      // Current Value = Unit Cost * Current Stock * (Adjustment for unit type if needed)
      // For simplicity, assuming Current Stock is in same unit as package quantity context usually, 
      // or normalized. Let's assume currentStock is in Package Units (e.g., 5 bags of flour) or Base Units? 
      // Looking at the spreadsheet, "Estoque Atual" seems to be count of packages or raw units.
      // Let's assume "Estoque Atual" is in the same unit measure as Package Size for simplicity 
      // OR let's standardise: Current Stock is entered in Package Count.
      
      // Actually, standard practice: Stock is usually tracked in Base Units (g, ml) or Packages.
      // Let's assume currentStock is NUMBER OF PACKAGES/UNITS based on the spreadsheet "1" example.
      totalValue += (ing.currentStock * ing.packagePrice);

      if (ing.currentStock <= ing.minStockThreshold) {
        lowStock++;
      }
    });

    return {
      totalValue,
      lowStock,
      totalRecipes: recipes.length
    };
  }, [ingredients, recipes]);

  const stockData = ingredients.map(i => ({
    name: i.name,
    value: i.currentStock * i.packagePrice
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#d97706', '#92400e', '#78350f', '#451a03', '#f59e0b'];

  return (
    <div className="p-6 space-y-8 pb-24 md:pb-6">
      <h2 className="text-3xl font-bold text-stone-800">Visão Geral do Negócio</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex items-center space-x-4">
          <div className="p-4 bg-green-100 rounded-full text-green-700">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500">Valor Total em Estoque</p>
            <h3 className="text-2xl font-bold text-stone-800">R${stats.totalValue.toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex items-center space-x-4">
          <div className="p-4 bg-amber-100 rounded-full text-amber-700">
            <PackageOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500">Receitas Ativas</p>
            <h3 className="text-2xl font-bold text-stone-800">{stats.totalRecipes}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex items-center space-x-4">
          <div className={`p-4 rounded-full ${stats.lowStock > 0 ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-500'}`}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500">Alertas de Estoque Baixo</p>
            <h3 className="text-2xl font-bold text-stone-800">{stats.lowStock} Itens</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 h-96">
          <h3 className="text-lg font-semibold text-stone-700 mb-4">Top 5 Ingredientes por Valor</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
              <Tooltip formatter={(value: number) => `R$${value.toFixed(2)}`} />
              <Bar dataKey="value" fill="#d97706" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 h-96 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-stone-700 mb-4">Composição do Estoque</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stockData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `R$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
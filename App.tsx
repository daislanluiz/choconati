import React, { useState, useEffect } from 'react';
import { Sidebar, MobileNav } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Recipes } from './components/Recipes';
import { AiAdvisor } from './components/AiAdvisor';
import { INITIAL_INGREDIENTS, INITIAL_RECIPES } from './constants';
import { Ingredient, Recipe } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Persist state in localStorage with error handling
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    try {
      const saved = localStorage.getItem('choconati_ingredients');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_INGREDIENTS;
    } catch (error) {
      console.error("Erro ao carregar ingredientes:", error);
      return INITIAL_INGREDIENTS;
    }
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem('choconati_recipes');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_RECIPES;
    } catch (error) {
      console.error("Erro ao carregar receitas:", error);
      return INITIAL_RECIPES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('choconati_ingredients', JSON.stringify(ingredients));
    } catch (e) {
      console.error("Erro ao salvar ingredientes", e);
    }
  }, [ingredients]);

  useEffect(() => {
    try {
      localStorage.setItem('choconati_recipes', JSON.stringify(recipes));
    } catch (e) {
      console.error("Erro ao salvar receitas", e);
    }
  }, [recipes]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard ingredients={ingredients} recipes={recipes} />;
      case 'inventory':
        return <Inventory ingredients={ingredients} setIngredients={setIngredients} />;
      case 'recipes':
        return <Recipes ingredients={ingredients} recipes={recipes} setRecipes={setRecipes} />;
      case 'advisor':
        return <AiAdvisor ingredients={ingredients} recipes={recipes} />;
      default:
        return <Dashboard ingredients={ingredients} recipes={recipes} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDF8F6]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 md:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
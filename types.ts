export enum UnitType {
  KG = 'kg',
  G = 'g',
  L = 'l',
  ML = 'ml',
  UNIT = 'un'
}

export interface Ingredient {
  id: string;
  name: string;
  packagePrice: number; // "Valor pct"
  packageQuantity: number; // "Qtd. pct"
  unit: UnitType; // "Unidade"
  currentStock: number; // "Estoque Atual"
  minStockThreshold: number;
}

export interface RecipeIngredient {
  ingredientId: string;
  quantityUsed: number; // How much of the base unit is used
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  laborCost: number; // Fixed cost for time/utilities
  profitMargin: number; // Percentage (e.g., 50%)
}

export interface DashboardStats {
  totalStockValue: number;
  lowStockCount: number;
  totalRecipes: number;
}
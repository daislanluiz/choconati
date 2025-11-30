import { Ingredient, UnitType, Recipe } from './types';

export const INITIAL_INGREDIENTS: Ingredient[] = [
  {
    id: '1',
    name: 'Farinha de Trigo',
    packagePrice: 2.99,
    packageQuantity: 1,
    unit: UnitType.KG,
    currentStock: 5,
    minStockThreshold: 2
  },
  {
    id: '2',
    name: 'Leite Condensado',
    packagePrice: 6.99,
    packageQuantity: 395,
    unit: UnitType.G, // Usually sold by grams in cans
    currentStock: 12,
    minStockThreshold: 5
  },
  {
    id: '3',
    name: 'Creme de Leite',
    packagePrice: 3.99,
    packageQuantity: 200,
    unit: UnitType.G,
    currentStock: 8,
    minStockThreshold: 4
  },
  {
    id: '4',
    name: 'Açúcar',
    packagePrice: 3.89,
    packageQuantity: 1,
    unit: UnitType.KG,
    currentStock: 3,
    minStockThreshold: 1
  },
  {
    id: '5',
    name: 'Chocolate 50%',
    packagePrice: 54.99,
    packageQuantity: 1,
    unit: UnitType.KG,
    currentStock: 1.5,
    minStockThreshold: 1
  },
  {
    id: '6',
    name: 'Nutella',
    packagePrice: 45.00,
    packageQuantity: 650,
    unit: UnitType.G,
    currentStock: 2,
    minStockThreshold: 1
  }
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'r1',
    name: 'Brigadeiro Gourmet',
    laborCost: 15.00,
    profitMargin: 100,
    ingredients: [
      { ingredientId: '2', quantityUsed: 395 }, // 1 can condensed milk
      { ingredientId: '3', quantityUsed: 100 }, // half box cream
      { ingredientId: '5', quantityUsed: 50 },  // 50g chocolate
    ]
  }
];
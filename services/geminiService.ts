import { GoogleGenAI } from "@google/genai";
import { Ingredient, Recipe } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key não encontrada no ambiente");
  }
  return new GoogleGenAI({ apiKey });
};

export const getAiAdvice = async (
  prompt: string,
  ingredients: Ingredient[],
  recipes: Recipe[]
): Promise<string> => {
  try {
    const ai = getClient();
    
    // Prepare context
    const inventoryContext = ingredients.map(i => 
      `- ${i.name}: ${i.currentStock} ${i.unit} em estoque (Custo: R$${i.packagePrice}/${i.packageQuantity}${i.unit})`
    ).join('\n');

    const recipeContext = recipes.map(r => 
      `- ${r.name}: Margem ${r.profitMargin}%`
    ).join('\n');

    const systemInstruction = `
      Você é um especialista em consultoria para confeitaria da "ChocoNati".
      Seu objetivo é ajudar o dono do negócio a maximizar lucros, reduzir desperdícios e criar produtos deliciosos.
      
      Estoque Atual:
      ${inventoryContext}

      Receitas Atuais:
      ${recipeContext}

      Responda sempre em Português do Brasil.
      Mantenha um tom profissional, encorajador e útil. Foque em eficiência financeira e criatividade culinária.
      Formate sua resposta usando Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: 0 } // Fast response preferred for chat
      }
    });

    return response.text || "Não consegui gerar uma resposta no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpe, estou com dificuldades para conectar com o cérebro da confeitaria agora. Por favor, tente novamente mais tarde.";
  }
};
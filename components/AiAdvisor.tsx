import React, { useState, useRef, useEffect } from 'react';
import { Ingredient, Recipe } from '../types';
import { getAiAdvice } from '../services/geminiService';
import { Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';

interface AiAdvisorProps {
  ingredients: Ingredient[];
  recipes: Recipe[];
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({ ingredients, recipes }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Olá! Eu sou o assistente da ChocoNati. Posso ajudar você a criar novas receitas com seu estoque atual, analisar suas margens de lucro ou dar dicas sobre tendências de confeitaria. Como posso ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const response = await getAiAdvice(userMsg, ingredients, recipes);
    
    setLoading(false);
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-screen max-w-4xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-stone-800 flex items-center gap-2">
          <Sparkles className="text-amber-500" /> Consultor IA
        </h2>
        <p className="text-stone-500">Pergunte sobre redução de custos, ideias de receitas ou otimização de estoque.</p>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-amber-100 text-amber-700' : 'bg-stone-200 text-stone-600'}`}>
                {msg.role === 'ai' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'ai' 
                  ? 'bg-white border border-stone-100 text-stone-700' 
                  : 'bg-stone-800 text-stone-50'
              }`}>
                {/* Simple Markdown Rendering */}
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-1 min-h-[1.2em]">
                    {line.startsWith('- ') ? (
                        <span className="pl-2 block">• {line.substring(2)}</span>
                    ) : line.startsWith('#') ? (
                        <span className="font-bold block text-lg mb-2">{line.replace(/^#+\s/, '')}</span>
                    ) : (
                        line
                    )}
                  </p>
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div className="bg-white border border-stone-100 p-4 rounded-xl shadow-sm flex items-center gap-2 text-stone-400 text-sm">
                <Loader2 className="animate-spin" size={16} /> Pensando...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-stone-100 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border border-stone-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="Sugira uma receita com minha farinha e chocolate atuais..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-amber-600 text-white px-6 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
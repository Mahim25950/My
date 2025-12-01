import React, { useState } from 'react';
import { getGeminiHealthAdvice } from '../services/geminiService';
import { AIHealthAdvice, Gender } from '../types';
import { Sparkles, Activity, Utensils, Quote, Loader2, ChevronRight } from 'lucide-react';

interface AIInsightsProps {
  bmi: number;
  age: number;
  gender: Gender;
  category: string;
  bmr: number;
}

const AIInsights: React.FC<AIInsightsProps> = ({ bmi, age, gender, category, bmr }) => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<AIHealthAdvice | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getGeminiHealthAdvice(bmi, age, gender, category, bmr);
      setAdvice(result);
    } catch (err) {
      setError("Failed to load insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!advice && !loading) {
    return (
      <div className="mt-8 text-center">
        <button
          onClick={fetchAdvice}
          className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
          Get Professional AI Insights
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="mt-2 text-xs text-slate-400">
          Powered by Gemini 2.5 Flash • Personalized Nutrition & Fitness
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in duration-500">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Analyzing health metrics...</p>
        <p className="text-xs text-slate-400 mt-2">Generating personalized recommendations</p>
      </div>
    );
  }

  if (advice) {
    return (
      <div className="mt-8 space-y-6 animate-in slide-in-from-bottom-4 duration-700">
        
        {/* Analysis Card */}
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg shadow-sm">
          <h3 className="text-indigo-900 font-semibold flex items-center mb-2">
            <Activity className="w-5 h-5 mr-2" />
            Expert Analysis
          </h3>
          <p className="text-indigo-800 text-sm leading-relaxed">{advice.analysis}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Diet Tips */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <h4 className="text-slate-800 font-semibold flex items-center mb-4 border-b border-slate-50 pb-2">
              <Utensils className="w-5 h-5 mr-2 text-emerald-500" />
              Nutrition Strategy
            </h4>
            <ul className="space-y-3">
              {advice.dietaryTips.map((tip, idx) => (
                <li key={idx} className="flex items-start text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Exercise Tips */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <h4 className="text-slate-800 font-semibold flex items-center mb-4 border-b border-slate-50 pb-2">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              Fitness Plan
            </h4>
            <ul className="space-y-3">
              {advice.exerciseTips.map((tip, idx) => (
                <li key={idx} className="flex items-start text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quote */}
        <div className="bg-slate-900 text-white p-6 rounded-xl text-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white opacity-5 rounded-full blur-xl"></div>
          <Quote className="absolute top-4 left-4 w-8 h-8 text-white/10" />
          <p className="text-lg font-medium italic relative z-10 font-serif">"{advice.motivationalQuote}"</p>
        </div>
        
        <div className="text-center">
           <button 
             onClick={() => setAdvice(null)}
             className="text-xs text-slate-400 hover:text-indigo-600 transition-colors underline decoration-dotted"
           >
             Close Insights
           </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AIInsights;
import React, { useState, useEffect } from 'react';
import { IrrigationZone } from '../types';
import { X, Droplets, Thermometer, Activity, Sprout, Sparkles, Loader2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { GoogleGenAI } from "@google/genai";

interface ZoneDetailProps {
  zone: IrrigationZone;
  onClose: () => void;
}

export const ZoneDetail: React.FC<ZoneDetailProps> = ({ zone, onClose }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Normalize data for chart
  const chartData = zone.humidityHistory.map((val, idx) => ({
    time: `T-${zone.humidityHistory.length - idx}`,
    humidity: val
  }));

  const handleAIAnalysis = async () => {
    if (!process.env.API_KEY) {
      setAnalysis("API Key not found. Please configure the environment.");
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Act as an expert agronomist. Analyze the following irrigation zone data:
        Zone ID: ${zone.id}
        Crop: ${zone.cropType || 'Fallow Land'}
        Current Soil Humidity: ${zone.soilHumidityPercent}%
        Ambient Temperature: ${zone.ambientTemperatureC}°C
        Watering Status: ${zone.isWatering ? 'Active' : 'Inactive'}
        Recent Humidity Trend: ${zone.humidityHistory.join(', ')}

        Provide a concise 3-sentence summary on the crop's health status and a recommendation for irrigation.
        Do not use markdown formatting.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setAnalysis(response.text);
    } catch (error) {
      console.error("AI Error:", error);
      setAnalysis("Unable to generate analysis at this time.");
    } finally {
      setLoading(false);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-50 border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-green-600" />
              {zone.id}
            </h2>
            <p className="text-sm text-slate-500">{zone.cropType || 'No Crop Assigned'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Droplets className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Humidity</span>
              </div>
              <p className="text-2xl font-bold text-slate-700">{zone.soilHumidityPercent}%</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <div className="flex items-center gap-2 text-orange-600 mb-1">
                <Thermometer className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Temp</span>
              </div>
              <p className="text-2xl font-bold text-slate-700">{zone.ambientTemperatureC}°C</p>
            </div>
            <div className={`p-4 rounded-xl border ${zone.isWatering ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
              <div className={`flex items-center gap-2 mb-1 ${zone.isWatering ? 'text-emerald-600' : 'text-slate-500'}`}>
                <Activity className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Status</span>
              </div>
              <p className="text-lg font-bold text-slate-700">
                {zone.isWatering ? 'Watering' : 'Idle'}
              </p>
            </div>
             <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Valve</span>
              </div>
              <p className="text-lg font-bold text-slate-700 uppercase">{zone.valveStatus}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-500 mb-4">SOIL HUMIDITY HISTORY</h3>
            <div className="h-64 w-full bg-slate-50 rounded-lg border border-slate-100 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ stroke: '#cbd5e1' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Section */}
          <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-5 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-indigo-900">Gemini Agronomist</h3>
              </div>
              {!analysis && !loading && (
                <button 
                  onClick={handleAIAnalysis}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow active:scale-95"
                >
                  Analyze Data
                </button>
              )}
            </div>
            
            <div className="relative z-10 min-h-[60px]">
              {loading ? (
                <div className="flex items-center gap-2 text-indigo-600 animate-pulse">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">Analyzing soil patterns...</span>
                </div>
              ) : analysis ? (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                   <p className="text-indigo-800 text-sm leading-relaxed">{analysis}</p>
                   <button 
                    onClick={() => setAnalysis(null)} 
                    className="text-xs text-indigo-500 hover:text-indigo-700 mt-2 underline"
                   >
                     Reset
                   </button>
                </div>
              ) : (
                <p className="text-indigo-400 text-sm italic">
                  Tap "Analyze Data" to get real-time insights powered by Google Gemini.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

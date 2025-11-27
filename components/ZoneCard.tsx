import React from 'react';
import { IrrigationZone } from '../types';
import { Droplets, Thermometer, Sprout, Power } from 'lucide-react';

interface ZoneCardProps {
  zone: IrrigationZone;
  onClick: (zone: IrrigationZone) => void;
}

export const ZoneCard: React.FC<ZoneCardProps> = ({ zone, onClick }) => {
  const isHealthy = zone.soilHumidityPercent > 30 && zone.soilHumidityPercent < 80;

  return (
    <button 
      onClick={() => onClick(zone)}
      className="group relative bg-white rounded-xl border border-gray-200 p-5 text-left transition-all hover:shadow-lg hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 overflow-hidden"
    >
      <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${zone.isWatering ? 'bg-blue-500' : isHealthy ? 'bg-green-500' : 'bg-yellow-500'}`} />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 mb-2">
            {zone.id}
          </span>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
             <Sprout className={`w-4 h-4 ${zone.cropType ? 'text-green-600' : 'text-gray-400'}`} />
            {zone.cropType || 'Fallow'}
          </h3>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${zone.isWatering ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
          <Power className="w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <Droplets className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Humidity</span>
          </div>
          <span className={`text-lg font-semibold ${zone.soilHumidityPercent < 30 ? 'text-red-500' : 'text-gray-800'}`}>
            {zone.soilHumidityPercent}%
          </span>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <Thermometer className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Temp</span>
          </div>
          <span className="text-lg font-semibold text-gray-800">
            {zone.ambientTemperatureC}°C
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
        <span className="text-xs text-gray-400">Valve: <span className="uppercase font-semibold text-gray-600">{zone.valveStatus}</span></span>
        {zone.isWatering && (
           <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
        )}
      </div>
    </button>
  );
};

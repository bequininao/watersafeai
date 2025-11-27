import React, { useState, useMemo, useEffect } from 'react';
import { LayoutDashboard, CloudRain, ThermometerSun, Leaf, Search, Filter, Sprout, Loader2, AlertCircle } from 'lucide-react';
import { IrrigationZone } from './types';
import { ZoneCard } from './components/ZoneCard';
import { StatCard } from './components/StatCard';
import { ZoneDetail } from './components/ZoneDetail';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [zones, setZones] = useState<IrrigationZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedZone, setSelectedZone] = useState<IrrigationZone | null>(null);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'WATERING' | 'IDLE'>('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error: dbError } = await supabase
          .from('irrigation_zones')
          .select('*');

        if (dbError) throw dbError;

        if (data) {
          const mappedZones: IrrigationZone[] = data.map((row: any) => {
            let history: number[] = [];
            
            // Parse humidity history from JSON string (e.g., '{"h": [44.8, 45.1]}')
            if (row.humidityhistory) {
              try {
                const parsed = typeof row.humidityhistory === 'string' 
                  ? JSON.parse(row.humidityhistory) 
                  : row.humidityhistory;
                
                if (Array.isArray(parsed)) {
                  history = parsed;
                } else if (parsed && Array.isArray(parsed.h)) {
                  history = parsed.h;
                }
              } catch (e) {
                console.warn(`Failed to parse history for zone ${row.zoneid}`, e);
              }
            }

            return {
              id: row.zoneid,
              cropType: row.croptype,
              soilHumidityPercent: Number(row.soilhumiditypercent),
              ambientTemperatureC: Number(row.ambienttemperaturec),
              isWatering: row.iswatering,
              valveStatus: row.valvestatus,
              humidityHistory: history
            };
          });
          
          // Sort by ID naturally
          mappedZones.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
          setZones(mappedZones);
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to connect to database');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Derived Statistics
  const stats = useMemo(() => {
    const total = zones.length;
    if (total === 0) return { total: 0, activeWatering: 0, avgHum: 0, avgTemp: 0 };

    const activeWatering = zones.filter(z => z.isWatering).length;
    const avgHum = (zones.reduce((acc, curr) => acc + curr.soilHumidityPercent, 0) / total).toFixed(1);
    const avgTemp = (zones.reduce((acc, curr) => acc + curr.ambientTemperatureC, 0) / total).toFixed(1);

    return { total, activeWatering, avgHum, avgTemp };
  }, [zones]);

  // Filtered Zones
  const filteredZones = useMemo(() => {
    return zones.filter(zone => {
      const matchesSearch = (zone.cropType?.toLowerCase() || '').includes(filter.toLowerCase()) || 
                            zone.id.toLowerCase().includes(filter.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || 
                            (statusFilter === 'WATERING' ? zone.isWatering : !zone.isWatering);
      return matchesSearch && matchesStatus;
    });
  }, [zones, filter, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-green-600 mb-4" />
        <p className="font-medium">Connecting to WaterSafe Network...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md w-full text-center">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Connection Error</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-slate-800 text-white font-medium py-2.5 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-none">WaterSafe</h1>
              <p className="text-xs text-slate-500 font-medium">Irrigation Monitor</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Database Connected
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            label="Total Zones" 
            value={stats.total} 
            icon={LayoutDashboard} 
            colorClass="bg-indigo-500"
          />
          <StatCard 
            label="Active Watering" 
            value={stats.activeWatering} 
            icon={CloudRain} 
            colorClass="bg-blue-500"
            trend={stats.total > 0 ? `${Math.round((stats.activeWatering / stats.total) * 100)}% Active` : '0%'}
          />
          <StatCard 
            label="Avg. Humidity" 
            value={`${stats.avgHum}%`} 
            icon={Leaf} 
            colorClass="bg-emerald-500"
          />
          <StatCard 
            label="Avg. Temperature" 
            value={`${stats.avgTemp}°C`} 
            icon={ThermometerSun} 
            colorClass="bg-orange-500"
          />
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search zones or crops..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-shadow shadow-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <Filter className="w-4 h-4 text-gray-400 ml-2" />
            <button 
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter('WATERING')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === 'WATERING' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Watering
            </button>
            <button 
              onClick={() => setStatusFilter('IDLE')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === 'IDLE' ? 'bg-gray-200 text-gray-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Idle
            </button>
          </div>
        </div>

        {/* Zones Grid */}
        {filteredZones.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredZones.map((zone) => (
              <ZoneCard 
                key={zone.id} 
                zone={zone} 
                onClick={setSelectedZone} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No zones found matching your criteria.</p>
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedZone && (
        <ZoneDetail 
          zone={selectedZone} 
          onClose={() => setSelectedZone(null)} 
        />
      )}
    </div>
  );
};

export default App;
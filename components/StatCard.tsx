import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  colorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend, colorClass }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between transition-all hover:shadow-md">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && <p className="text-xs text-emerald-600 mt-1 font-medium">{trend}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
  );
};

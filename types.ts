import React from 'react';

export interface IrrigationZone {
  id: string;
  cropType: string | null;
  soilHumidityPercent: number;
  ambientTemperatureC: number;
  isWatering: boolean;
  valveStatus: 'OPEN' | 'CLOSED' | 'open' | 'closed';
  humidityHistory: number[];
}

export interface StatMetric {
  label: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
}
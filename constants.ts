import { IrrigationZone } from './types';

// Data derived from the user's SQL and JSON examples
export const INITIAL_ZONES: IrrigationZone[] = [
  {
    id: "zone-tmt01",
    cropType: "Tomates",
    soilHumidityPercent: 55.8,
    ambientTemperatureC: 23.5,
    isWatering: true,
    valveStatus: "open",
    humidityHistory: [60.1, 58.2, 59.0, 57.5, 55.0, 56.1, 55.8]
  },
  {
    id: "zone-miz02",
    cropType: "Maíz",
    soilHumidityPercent: 48.2,
    ambientTemperatureC: 24.1,
    isWatering: false,
    valveStatus: "closed",
    humidityHistory: [50.5, 51.0, 50.0, 49.5, 48.0, 48.5, 48.2]
  },
  {
    id: 'Z001A',
    cropType: 'Maíz',
    soilHumidityPercent: 45.21,
    ambientTemperatureC: 28.50,
    isWatering: true,
    valveStatus: 'OPEN',
    humidityHistory: [44.0, 44.5, 44.8, 45.1, 45.2]
  },
  {
    id: 'Z002B',
    cropType: 'Trigo',
    soilHumidityPercent: 68.90,
    ambientTemperatureC: 22.10,
    isWatering: false,
    valveStatus: 'CLOSED',
    humidityHistory: [69.5, 69.2, 68.9, 68.9, 68.8]
  },
  {
    id: 'Z003C',
    cropType: 'Tomate',
    soilHumidityPercent: 32.55,
    ambientTemperatureC: 30.75,
    isWatering: true,
    valveStatus: 'OPEN',
    humidityHistory: [31.5, 31.8, 32.1, 32.5, 32.6]
  },
  {
    id: 'Z004D',
    cropType: 'Algodón',
    soilHumidityPercent: 55.00,
    ambientTemperatureC: 25.00,
    isWatering: false,
    valveStatus: 'CLOSED',
    humidityHistory: [55.0, 55.0, 55.0, 55.0] // Simulated from NULL
  },
  {
    id: 'Z005E',
    cropType: 'Vid',
    soilHumidityPercent: 40.10,
    ambientTemperatureC: 31.20,
    isWatering: true,
    valveStatus: 'OPEN',
    humidityHistory: [39.5, 39.8, 40.0, 40.1, 40.2]
  },
  {
    id: 'Z006F',
    cropType: 'Patata',
    soilHumidityPercent: 75.88,
    ambientTemperatureC: 18.50,
    isWatering: false,
    valveStatus: 'CLOSED',
    humidityHistory: [76.5, 76.2, 76.0, 75.8, 75.8]
  },
  {
    id: 'Z007G',
    cropType: 'Cebada',
    soilHumidityPercent: 50.50,
    ambientTemperatureC: 27.90,
    isWatering: false,
    valveStatus: 'CLOSED',
    humidityHistory: [50.8, 50.6, 50.5, 50.5, 50.4]
  },
  {
    id: 'Z008H',
    cropType: 'Arroz',
    soilHumidityPercent: 85.15,
    ambientTemperatureC: 29.50,
    isWatering: true,
    valveStatus: 'OPEN',
    humidityHistory: [84.5, 84.8, 85.0, 85.1, 85.2]
  },
  {
    id: 'Z009I',
    cropType: 'Girasol',
    soilHumidityPercent: 38.00,
    ambientTemperatureC: 33.15,
    isWatering: false,
    valveStatus: 'CLOSED',
    humidityHistory: [39.0, 38.8, 38.5, 38.0, 37.8]
  },
  {
    id: 'Z010J',
    cropType: null, // Barbecho
    soilHumidityPercent: 60.00,
    ambientTemperatureC: 20.00,
    isWatering: false,
    valveStatus: 'CLOSED',
    humidityHistory: [60.0, 60.0, 60.0, 60.0, 60.0]
  },
  {
    id: 'Z100K',
    cropType: 'Caña de Azúcar',
    soilHumidityPercent: 52.30,
    ambientTemperatureC: 26.80,
    isWatering: false,
    valveStatus: 'CLOSED',
    humidityHistory: [52.0, 52.1, 52.1, 52.3, 52.2]
  }
];

// Helper to generate a few more to fill the grid
const generateMoreZones = (): IrrigationZone[] => {
  const more: IrrigationZone[] = [];
  const crops = ['Maíz', 'Trigo', 'Soja', 'Cebolla', 'Ajo'];
  for(let i = 11; i <= 20; i++) {
    const isWatering = Math.random() > 0.7;
    const baseHum = 40 + Math.random() * 40;
    more.push({
      id: `Z0${i}X`,
      cropType: crops[Math.floor(Math.random() * crops.length)],
      soilHumidityPercent: parseFloat(baseHum.toFixed(2)),
      ambientTemperatureC: parseFloat((20 + Math.random() * 15).toFixed(2)),
      isWatering: isWatering,
      valveStatus: isWatering ? 'OPEN' : 'CLOSED',
      humidityHistory: Array.from({length: 5}, (_, j) => baseHum + (Math.random() * 2 - 1))
    });
  }
  return more;
};

export const FULL_DATASET = [...INITIAL_ZONES, ...generateMoreZones()];

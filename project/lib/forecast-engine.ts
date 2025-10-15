import { MaterialPrediction } from './supabase';

export type ProjectInput = {
  budget: number;
  location: string;
  tower_type: string;
  substation_type: string;
  geographic_conditions: string;
  tax_rate: number;
};

const LOCATION_FACTORS: Record<string, number> = {
  'North': 1.2,
  'South': 1.0,
  'East': 1.1,
  'West': 1.15,
  'Central': 0.95,
  'Coastal': 1.3,
  'Mountain': 1.4,
  'Plain': 0.9,
};

const TOWER_TYPE_FACTORS: Record<string, number> = {
  'Transmission 400kV': 2.5,
  'Transmission 220kV': 1.8,
  'Transmission 132kV': 1.4,
  'Distribution 66kV': 1.0,
  'Distribution 33kV': 0.7,
  'Distribution 11kV': 0.5,
};

const SUBSTATION_FACTORS: Record<string, number> = {
  'None': 0,
  'Grid Substation': 3.0,
  'Switching Station': 1.5,
  'Distribution Substation': 1.2,
  'Transformation Substation': 2.0,
};

const TERRAIN_FACTORS: Record<string, number> = {
  'Plain': 0.9,
  'Hilly': 1.2,
  'Mountain': 1.5,
  'Coastal': 1.3,
  'Desert': 1.1,
  'Forest': 1.25,
};

export function generateForecast(input: ProjectInput): {
  materials: MaterialPrediction;
  confidence: number;
} {
  const locationFactor = LOCATION_FACTORS[input.location] || 1.0;
  const towerFactor = TOWER_TYPE_FACTORS[input.tower_type] || 1.0;
  const substationFactor = SUBSTATION_FACTORS[input.substation_type] || 0;
  const terrainFactor = TERRAIN_FACTORS[input.geographic_conditions] || 1.0;

  const budgetInMillions = input.budget / 1_000_000;
  const taxMultiplier = 1 + (input.tax_rate / 100);

  const baseMaterialCost = budgetInMillions * 0.45;
  const adjustedCost = baseMaterialCost * locationFactor * towerFactor * terrainFactor * taxMultiplier;

  const variance = 0.05 + Math.random() * 0.1;

  const steelTons = Math.round(adjustedCost * 15 * (1 + (Math.random() - 0.5) * variance));
  const concreteM3 = Math.round(adjustedCost * 25 * (1 + (Math.random() - 0.5) * variance));
  const copperKm = Math.round(adjustedCost * 8 * (1 + (Math.random() - 0.5) * variance) * 10) / 10;
  const insulators = Math.round(adjustedCost * 50 * (1 + (Math.random() - 0.5) * variance));

  const substationMultiplier = substationFactor > 0 ? substationFactor : 0.1;
  const transformers = Math.round(budgetInMillions * 0.3 * substationMultiplier);
  const circuitBreakers = Math.round(budgetInMillions * 0.5 * substationMultiplier);

  const baseConfidence = 85;
  const complexityPenalty = (towerFactor + terrainFactor + substationFactor) * 2;
  const confidence = Math.max(70, Math.min(95, baseConfidence - complexityPenalty + Math.random() * 5));

  return {
    materials: {
      steel_tons: steelTons,
      concrete_m3: concreteM3,
      copper_km: copperKm,
      insulators_units: insulators,
      transformers_units: transformers,
      circuit_breakers_units: circuitBreakers,
    },
    confidence: Math.round(confidence * 10) / 10,
  };
}

export function exportToCSV(projectName: string, materials: MaterialPrediction, confidence: number): string {
  const headers = ['Material', 'Quantity', 'Unit'];
  const rows = [
    ['Steel', materials.steel_tons.toString(), 'tons'],
    ['Concrete', materials.concrete_m3.toString(), 'm³'],
    ['Copper Cable', materials.copper_km.toString(), 'km'],
    ['Insulators', materials.insulators_units.toString(), 'units'],
    ['Transformers', materials.transformers_units.toString(), 'units'],
    ['Circuit Breakers', materials.circuit_breakers_units.toString(), 'units'],
    ['', '', ''],
    ['Confidence Score', confidence.toString(), '%'],
  ];

  const csvContent = [
    `Material Demand Forecast - ${projectName}`,
    `Generated: ${new Date().toLocaleString()}`,
    '',
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csvContent;
}

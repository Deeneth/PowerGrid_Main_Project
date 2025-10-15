import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Project = {
  id: string;
  name: string;
  budget: number;
  location: string;
  tower_type: string;
  substation_type: string | null;
  geographic_conditions: string;
  tax_rate: number;
  created_at: string;
  updated_at: string;
};

export type Forecast = {
  id: string;
  project_id: string;
  confidence_score: number;
  predicted_materials: MaterialPrediction;
  model_version: string;
  created_at: string;
};

export type MaterialPrediction = {
  steel_tons: number;
  concrete_m3: number;
  copper_km: number;
  insulators_units: number;
  transformers_units: number;
  circuit_breakers_units: number;
};

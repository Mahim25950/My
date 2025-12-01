export enum Gender {
  Male = 'Male',
  Female = 'Female'
}

export enum UnitSystem {
  Metric = 'Metric',
  Imperial = 'Imperial'
}

export interface UserInput {
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  unit: UnitSystem;
}

export interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  idealWeightRange: string;
  bmr: number; // Basal Metabolic Rate
  waterIntake: number; // Liters per day
  timestamp: number;
}

export interface AIHealthAdvice {
  analysis: string;
  dietaryTips: string[];
  exerciseTips: string[];
  motivationalQuote: string;
}

export interface HistoryItem extends BMIResult {
  id: string;
}
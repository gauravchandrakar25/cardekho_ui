export interface UserPreferences {
  budget: string;
  familySize: string;
  primaryUsage: string;
  fuelPreference: string;
  bodyType: string;
  topPriority: string;
}

export interface Car {
  id?: number;
  name: string;
  brand: string;
  body_type: string;
  fuel_type: string;
  price_min: number;
  price_max: number;
  mileage: number;
  safety_rating: number;
  transmission: string;
  description: string;
}

export interface RecommendedCar {
  name: string;
  score: number;
  whyFit: string;
  tradeOffs: string;
  idealBuyer: string;
}

export interface RejectedCar {
  name: string;
  reason: string;
}

export interface AIResponse {
  recommendedCars: RecommendedCar[];
  selectionReasoning: string[];
  rejectedCars: RejectedCar[];
}

export interface APIMetadata {
  candidatesCount: number;
  filtersRelaxed: boolean;
  relaxationReason: string | null;
  databaseMode: string;
  aiMode: string;
}

export interface APIShortlistResponse {
  success: boolean;
  data: AIResponse;
  metadata: APIMetadata;
  error?: string;
}

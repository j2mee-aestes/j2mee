import type { Coordinates } from "@/types/map";

export type CoastalRelation = "direct" | "adjacent";
export type EventScale = "very_large" | "large" | "medium";
export type RiskLevel = "very_high" | "high" | "medium" | "low";
export type ConfidenceLevel = "very_high" | "high" | "medium";

export interface CoastalEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  venues: string[];
  address: string;
  coordinates: Coordinates;
  coastalRelation: CoastalRelation;
  eventType: "festival" | "sports" | "film" | "exhibition";
  estimatedScale: EventScale;
  officialConfirmed: boolean;
  crowdRisk: RiskLevel;
  wasteRisk: RiskLevel;
  trafficImpact: RiskLevel;
  priority: number;
  confidence: ConfidenceLevel;
  host?: string;
  organizer?: string;
  contact?: string;
  summary: string;
  coastalImpact: string[];
  notes?: string[];
  sourceUrl?: string;
  sourceCheckedAt: string;
}

export interface EventRepository {
  getAll(): Promise<CoastalEvent[]>;
  getById(id: string): Promise<CoastalEvent | null>;
}

export type Destination = 'MOON' | 'MARS';

export type MachineStatus = 'ACTIVE' | 'SILENT' | 'INACTIVE' | 'LOST' | 'HISTORIC';

export type EquipmentCategory = 'ROVER' | 'LANDER' | 'INSTRUMENT' | 'HISTORIC_SITE';

export interface MissionArtifact {
  id: string;
  artifactId: string;
  name: string;
  mission: string;
  destination: Destination;
  landingYear: number;
  lastContactYear: number | string;
  category: EquipmentCategory;
  status: MachineStatus;
  statusDescription: string;
  locationName: string;
  coordinates: {
    lat: string;
    lng: string;
    latNum: number;
    lngNum: number;
  };
  role: string;
  story: string;
  scienceContribution: string[];
  engineeringFeat: string;
  daysActive: number | string;
  distanceTraveled?: string;
  image: string;
  imageCaption: string;
  whyLeftBehind: string;
  subsystems: {
    name: string;
    description: string;
    significance: string;
  }[];
  funFacts: string[];
  historicalQuote?: {
    text: string;
    author: string;
  };
}

export interface ConstellationNode {
  id: string;
  label: string;
  category: 'machine' | 'science' | 'breakthrough';
  destination?: Destination;
  description?: string;
  x: number;
  y: number;
}

export interface ConstellationLink {
  source: string;
  target: string;
  label?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  missionRef: string;
}

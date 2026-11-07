export type Destination = 'MOON' | 'MARS';

export type MachineStatus = 'ACTIVE' | 'SILENT' | 'INACTIVE' | 'LOST' | 'HISTORIC';

export type EquipmentCategory =
  | 'ROVER'
  | 'LANDER'
  | 'INSTRUMENT'
  | 'HISTORIC_SITE'
  | 'ENTRY_HARDWARE'
  | 'IMPACT_SITE'
  | 'AIRCRAFT';

/** A citation shown in the dossier's "Sources" list. */
export interface SourceRef {
  label: string;
  url: string;
}

export interface MissionArtifact {
  id: string;
  artifactId: string;
  name: string;
  /** Short label for map markers; defaults to the first word of `name`. */
  shortName?: string;
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
  /** One or two complete sentences for the catalogue card: the reason to open the dossier. */
  hook: string;
  story: string;
  scienceContribution: string[];
  engineeringFeat: string;
  daysActive: number | string;
  distanceTraveled?: string;
  image: string;
  imageCaption: string;
  /** NASA Image and Video Library id of `image` (public domain), e.g. "PIA17759". */
  imageNasaId: string;
  /** NSSDCA catalogue id, e.g. "2003-032A". */
  nssdcId: string;
  /** ISO date the hardware was left on the surface (landing, or crew liftoff for Apollo). */
  leftBehind: string;
  /** ISO date of the last contact; null while it is still active. */
  lastContact: string | null;
  /** Photo credit, e.g. "NASA/JPL-Caltech". */
  imageCredit: string;
  /** PDS context identifier (LID) for the spacecraft or mission, if PDS has one. */
  pdsLid?: string;
  /** The same site photographed from orbit by LRO's camera (LROC), if available. */
  orbitalView?: { image: string; nasaId: string; caption: string; credit: string };
  /** NTRS technical report about the mission. */
  ntrs: { id: string; title: string };
  /** Where the facts on this card come from. */
  sources: SourceRef[];
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

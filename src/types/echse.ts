export type SystemMode = 'V6_HARDENED' | 'V7_SYMBIOSIS' | 'HYBRID';

export type ProfileType = 'master_chris' | 'clean_slate';

export type SchnellzugriffCommand = 
  | 'ECHSE: BLUEPRINT'
  | 'ECHSE: ANALYSE'
  | 'ECHSE: CLEANING'
  | 'ECHSE: PREDICT'
  | 'ECHSE: WAR-GAME'
  | 'ECHSE: SYNTHESE'
  | 'ECHSE: AUDIT'
  | 'ECHSE: DIAGNOSTIK'
  | 'ECHSE: REFLEXION'
  | 'ECHSE: BALANCE'
  | 'ECHSE: EMPATHIE';

export interface ModuleDefinition {
  id: number;
  name: string;
  category: 
    | 'HAUSHALT & VORRAT'
    | 'FINANZEN & RECHT' 
    | 'ENERGIE & UMWELT' 
    | 'GÄRTNEREI & AGRO-TECH'
    | 'FAMILIE & GESUNDHEIT'
    | 'SCHUTZ & SOUVERÄNITÄT';
  shortDesc: string;
  directive: string;
  economicValue: string;
  iconName: string;
  status: 'ONLINE' | 'ARMED' | 'STANDBY' | 'OPTIMAL' | 'WARM' | 'RESONATING';
  systemOrigin: 'V6' | 'V7' | 'HYBRID';
}

export interface KaufgatterItem {
  id: string;
  name: string;
  price: number;
  createdAt: number;
  lockUntil: number;
  category: string;
  necessityScore: number;
  alternativesChecked: boolean;
  dopamineImpulseChecked: boolean;
  status: 'LOCKED' | 'APPROVED' | 'DISCARDED';
}

export interface FactItem {
  id: string;
  category: string;
  fact: string;
  timestamp: string;
}

export interface FixedCostItem {
  id: string;
  name: string;
  amount: number;
  cycle: string;
}

export interface ContractItem {
  id: string;
  name: string;
  noticePeriod: string;
  deadline: string;
}

export interface RitualItem {
  id: string;
  title: string;
  desc: string;
  done: boolean;
  tag: string;
}

// ==========================================
// HAUSHALT & VORRÄTE
// ==========================================
export interface PantryItem {
  id: string;
  name: string;
  category: 'Kühlschrank' | 'Tiefkühler' | 'Vorratskammer' | 'Gewürze/Trocken';
  quantity: number;
  unit: string;
  expiryDate: string; // YYYY-MM-DD
  isExpiringSoon?: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: 'Obst/Gemüse' | 'Kühltheke' | 'Trockenware' | 'Haushalt/Drogerie' | 'Tierbedarf';
  estimatedPrice: number;
  checked: boolean;
  urgent: boolean;
}

// ==========================================
// HAUSHALTS-WARTUNG & PUTZPLAN
// ==========================================
export interface CleaningTask {
  id: string;
  room: 'Küche' | 'Bad' | 'Wohnbereich' | 'Schlafbereich' | 'Technik & Geräte';
  task: string;
  intervalDays: number;
  lastDone: string; // YYYY-MM-DD
  assignedTo?: string;
  done: boolean;
  isMaintenance?: boolean; // z.B. Kaffeemaschine entkalken, Filter wechseln
}

// ==========================================
// HAUSTIER-FÜRSORGE
// ==========================================
export interface PetCareProfile {
  petName: string;
  petType: string;
  birthYearOrAge: string;
  feedingTimeMorning: string;
  feedingTimeEvening: string;
  foodStockKg: number;
  dailyGrams: number;
  nextVetDate: string;
  lastVaccination: string;
  meds: string;
}

export interface UserProfileData {
  id: ProfileType;
  userName: string;
  userRole: string;
  isConfigured: boolean;
  botanyName: string;
  botanyPhase: 'VEGI' | 'BLUETE';
  botanyTargetVpd: number;
  petName: string;
  petType: string;
  monthlyBudgetLimit: number;
  savedCapitalTotal: number;
  fixedCosts: FixedCostItem[];
  contracts: ContractItem[];
  kaufgatterItems: KaufgatterItem[];
  facts: FactItem[];
  dailyRituals: RitualItem[];
  systemNotes: string;
  // Household extensions
  pantryItems?: PantryItem[];
  shoppingList?: ShoppingItem[];
  cleaningTasks?: CleaningTask[];
  petProfile?: PetCareProfile;
}

export interface TelemetryData {
  temp: number;
  humidity: number;
  co2: number;
  vpd: number;
  dli: number;
  ph: number;
  ec: number;
  lastUpdate: string;
  status: string;
}

export interface TerminalEntry {
  id: string;
  timestamp: string;
  mode: SystemMode;
  profileId?: ProfileType;
  command?: string;
  input: string;
  output: string;
  source: 'GEMINI_NEURAL_CORE' | 'LOCAL_HARDENED_ENGINE' | 'LOCAL_SYMBIOSIS_ENGINE';
  moduleContext?: number;
}

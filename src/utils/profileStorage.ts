import { UserProfileData, ProfileType } from '../types/echse';

const STORAGE_KEY_PREFIX = 'echse_profile_v7_';

export const DEFAULT_CHRIS_PROFILE: UserProfileData = {
  id: 'master_chris',
  userName: 'Chris',
  userRole: 'Master-Operator & Schöpfer',
  isConfigured: true,
  botanyName: 'Gärtnerei & Precision CEA-Grow',
  botanyPhase: 'BLUETE',
  botanyTargetVpd: 1.25,
  petName: 'Katzen',
  petType: 'Katzen (Hardware-Interrupt Prio 1)',
  monthlyBudgetLimit: 500,
  savedCapitalTotal: 1850.0,
  fixedCosts: [
    { id: 'FC-1', name: 'Server & Domains (WSL2/Docker)', amount: 35.0, cycle: 'monatlich' },
    { id: 'FC-2', name: 'Strom & Heizung (Haushalt & CEA)', amount: 140.0, cycle: 'monatlich' },
    { id: 'FC-3', name: 'Tierbedarf (Katzenfutter & Streu)', amount: 95.0, cycle: 'monatlich' },
    { id: 'FC-4', name: 'Mobilfunk / SIM Android-Node', amount: 9.99, cycle: 'monatlich' },
  ],
  contracts: [
    { id: 'CT-1', name: 'Cloud VPS Backup', noticePeriod: '30 Tage zum Monatsende', deadline: '2026-11-15' },
    { id: 'CT-2', name: 'Internet Provider DSL', noticePeriod: '1 Monat', deadline: '2027-01-31' },
  ],
  kaufgatterItems: [
    {
      id: 'KG-1',
      name: 'Zusatz-SSD NVMe 2TB',
      price: 139.99,
      createdAt: Date.now() - 36 * 3600 * 1000,
      lockUntil: Date.now() + 12 * 3600 * 1000,
      category: 'Hardware',
      necessityScore: 6,
      alternativesChecked: true,
      dopamineImpulseChecked: true,
      status: 'LOCKED',
    }
  ],
  facts: [
    { id: 'F-001', category: 'SYSTEM', fact: '100% Isolation in WSL2/Docker. Windows-Hosts tabu.', timestamp: '2026-10-01' },
    { id: 'F-002', category: 'BOTANIK', fact: 'Grow-Zelt Ziel-VPD: 1.1 - 1.4 kPa in Blütephase. pH Soll 5.8-6.2.', timestamp: '2026-10-02' },
    { id: 'F-003', category: 'HARDWARE-INTERRUPT', fact: 'Katzen-Fütterung & Pflege besitzen absolute Priorität vor Background-Tasks.', timestamp: '2026-10-03' },
    { id: 'F-004', category: 'BUDGET', fact: '48-Stunden-Kaufgatter erzwingt Impulskauf-Sperre bei Beträgen > 50€.', timestamp: '2026-10-04' },
    { id: 'F-005', category: 'SYMBIOSIS', fact: 'Gelebte äußere Ordnung (saubere IT, versorgte Tiere, gefüllte Vorratskammer) ist die Grundlage des inneren Friedens.', timestamp: '2026-10-05' }
  ],
  dailyRituals: [
    { id: 'R1', title: 'Katzen achtsam kraulen & versorgen', desc: 'Den Tieren Zeit schenken, ihr Schnurren als Herzerdung spüren.', done: true, tag: 'Tiere' },
    { id: 'R2', title: 'Frische, warme Mahlzeit zubereiten', desc: 'Kein Fastfood am Schreibtisch; bewusste Nahrung für den Körper.', done: false, tag: 'Nahrung' },
    { id: 'R3', title: 'Pflanzen im Grow-Zelt betrachten', desc: 'Nicht nur VPD messen, sondern das Grün und den Duft der Natur erleben.', done: true, tag: 'Botanik' },
    { id: 'R4', title: 'Arbeitsplatz & Umgebung klären', desc: 'Geschirr abräumen, Schreibtisch lüften. Äußere Ordnung stiftet inneren Frieden.', done: false, tag: 'Raum' },
    { id: 'R5', title: '15 Minuten Stille ohne Bildschirme', desc: 'Den Kopf entlasten, tief atmen, das Hier und Jetzt spüren.', done: false, tag: 'Geist' }
  ],
  systemNotes: 'System Echse V7.5 Haushalt & Autarkie. Priorität: Gesunder Haushalt, Katzen und innere Ruhe.',
  
  // Haushalt & Vorrat
  pantryItems: [
    { id: 'pi-1', name: 'Katzen-Nassfutter Premium Huhn', category: 'Vorratskammer', quantity: 24, unit: 'Dosen', expiryDate: '2027-08-15' },
    { id: 'pi-2', name: 'Griechischer Bio-Joghurt', category: 'Kühlschrank', quantity: 500, unit: 'g', expiryDate: '2026-10-12', isExpiringSoon: true },
    { id: 'pi-3', name: 'Bio-Haferflocken Feinblatt', category: 'Vorratskammer', quantity: 2, unit: 'kg', expiryDate: '2027-03-01' },
    { id: 'pi-4', name: 'Frische Freiland-Eier', category: 'Kühlschrank', quantity: 6, unit: 'Stk', expiryDate: '2026-10-15' },
    { id: 'pi-5', name: 'Tiefkühl-Bio-Beeren & Spinat', category: 'Tiefkühler', quantity: 1200, unit: 'g', expiryDate: '2027-01-30' },
    { id: 'pi-6', name: 'Vollkorn-Pasta & Basmati-Reis', category: 'Vorratskammer', quantity: 3, unit: 'kg', expiryDate: '2027-11-20' },
  ],
  shoppingList: [
    { id: 'sl-1', name: 'Öko-Klumpstreu für Katzen', category: 'Tierbedarf', estimatedPrice: 14.99, checked: false, urgent: true },
    { id: 'sl-2', name: 'Natives Bio-Olivenöl Extra', category: 'Trockenware', estimatedPrice: 8.99, checked: false, urgent: false },
    { id: 'sl-3', name: 'Bio-Bananen & Zitronen', category: 'Obst/Gemüse', estimatedPrice: 4.50, checked: false, urgent: false },
    { id: 'sl-4', name: 'Hafermilch Barista Edition', category: 'Kühltheke', estimatedPrice: 2.19, checked: true, urgent: false },
  ],
  cleaningTasks: [
    { id: 'ct-1', room: 'Technik & Geräte', task: 'Kaffeemaschine entkalken & Wassertank reinigen', intervalDays: 30, lastDone: '2026-09-20', done: false, isMaintenance: true },
    { id: 'ct-2', room: 'Bad', task: 'Katzenklos komplett auswaschen & neu befüllen', intervalDays: 7, lastDone: '2026-10-01', done: true },
    { id: 'ct-3', room: 'Technik & Geräte', task: 'Grow-Zelt Abluftfilter & Staubgitter absaugen', intervalDays: 60, lastDone: '2026-08-15', done: false, isMaintenance: true },
    { id: 'ct-4', room: 'Küche', task: 'Kühlschrank auswischen & abgelaufene Reste prüfen', intervalDays: 14, lastDone: '2026-09-28', done: false },
    { id: 'ct-5', room: 'Schlafbereich', task: 'Bettwäsche bei 60°C waschen & Matratze lüften', intervalDays: 14, lastDone: '2026-09-29', done: true },
    { id: 'ct-6', room: 'Wohnbereich', task: 'Böden saugen, wischen & Arbeitsplatz ordnen', intervalDays: 3, lastDone: '2026-10-04', done: true }
  ],
  petProfile: {
    petName: 'Katzen',
    petType: 'Europäisch Kurzhaar (Wohnungskatzen)',
    birthYearOrAge: '4 Jahre',
    feedingTimeMorning: '07:30 Uhr',
    feedingTimeEvening: '19:00 Uhr',
    foodStockKg: 8.5,
    dailyGrams: 280,
    nextVetDate: '2027-03-15 (Jahres-Checkup)',
    lastVaccination: '2026-03-10 (Tollwut & Katzenschnupfen)',
    meds: 'Keine Dauermedikation; Entwurmung halbjährlich.'
  }
};

export const DEFAULT_CLEAN_SLATE_PROFILE: UserProfileData = {
  id: 'clean_slate',
  userName: 'Neuer Haushalt',
  userRole: 'Souveränes Haushalts- & Lebens-OS',
  isConfigured: false,
  botanyName: 'Gärtnerei & Zimmerpflanzen',
  botanyPhase: 'VEGI',
  botanyTargetVpd: 1.0,
  petName: 'Haustiere / Begleiter',
  petType: 'Hund, Katze oder Kleintiere',
  monthlyBudgetLimit: 600,
  savedCapitalTotal: 0,
  fixedCosts: [
    { id: 'CFC-1', name: 'Miete & Nebenkosten', amount: 750.0, cycle: 'monatlich' },
    { id: 'CFC-2', name: 'Strom & Energie', amount: 85.0, cycle: 'monatlich' },
    { id: 'CFC-3', name: 'Internet & Mobilfunk', amount: 39.99, cycle: 'monatlich' },
    { id: 'CFC-4', name: 'Haftpflicht & Hausrat', amount: 15.0, cycle: 'monatlich' },
  ],
  contracts: [
    { id: 'CCT-1', name: 'Streaming & Musik-Abo', noticePeriod: '1 Monat', deadline: '2026-12-31' },
    { id: 'CCT-2', name: 'Fitnessstudio', noticePeriod: '3 Monate vor Ablauf', deadline: '2027-03-31' }
  ],
  kaufgatterItems: [],
  facts: [],
  dailyRituals: [
    { id: 'CR-1', title: '5 Minuten Stoßlüften am Morgen', desc: 'Frische Luft, Schimmelschutz und Sauerstoff für den Kopf.', done: false, tag: 'Gesundheit' },
    { id: 'CR-2', title: 'Tagespriorität & Budget prüfen', desc: 'Keine Spontankäufe ohne 48h-Gatter.', done: false, tag: 'Finanzen' },
    { id: 'CR-3', title: 'Frische Mahlzeit & Wasser', desc: 'Bewusst kochen und ausreichend hydrieren.', done: false, tag: 'Körper' }
  ],
  systemNotes: 'Jungfräulicher Start für deinen Haushalt. Vollständige Kontrolle über Finanzen, Vorräte, Verträge und Wohlbefinden.',
  pantryItems: [
    { id: 'cpi-1', name: 'Milch / Haferdrink', category: 'Kühlschrank', quantity: 1, unit: 'L', expiryDate: '2026-10-14' },
    { id: 'cpi-2', name: 'Kaffee / Tee', category: 'Vorratskammer', quantity: 500, unit: 'g', expiryDate: '2027-06-01' },
    { id: 'cpi-3', name: 'Nudeln / Reis Grundvorrat', category: 'Vorratskammer', quantity: 2, unit: 'kg', expiryDate: '2027-10-10' },
  ],
  shoppingList: [
    { id: 'csl-1', name: 'Frisches Gemüse für die Woche', category: 'Obst/Gemüse', estimatedPrice: 12.00, checked: false, urgent: true },
    { id: 'csl-2', name: 'Spülmaschinentabs & Seife', category: 'Haushalt/Drogerie', estimatedPrice: 6.50, checked: false, urgent: false },
  ],
  cleaningTasks: [
    { id: 'cct-1', room: 'Küche', task: 'Kühlschrank durchsehen & Oberflächen reinigen', intervalDays: 7, lastDone: '2026-10-01', done: false },
    { id: 'cct-2', room: 'Bad', task: 'Armaturen & Dusche entkalken', intervalDays: 14, lastDone: '2026-09-25', done: false },
    { id: 'cct-3', room: 'Technik & Geräte', task: 'Waschmaschinen-Flusensieb & Dichtung säubern', intervalDays: 90, lastDone: '2026-08-01', done: false, isMaintenance: true },
  ],
  petProfile: {
    petName: 'Begleiter',
    petType: 'Noch konfigurieren',
    birthYearOrAge: '-',
    feedingTimeMorning: '08:00 Uhr',
    feedingTimeEvening: '18:00 Uhr',
    foodStockKg: 5.0,
    dailyGrams: 200,
    nextVetDate: '-',
    lastVaccination: '-',
    meds: 'Keine'
  }
};

export function loadProfile(profileId: ProfileType): UserProfileData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + profileId);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults so new fields are guaranteed
      const base = profileId === 'master_chris' ? DEFAULT_CHRIS_PROFILE : DEFAULT_CLEAN_SLATE_PROFILE;
      return {
        ...base,
        ...parsed,
        pantryItems: parsed.pantryItems || base.pantryItems,
        shoppingList: parsed.shoppingList || base.shoppingList,
        cleaningTasks: parsed.cleaningTasks || base.cleaningTasks,
        petProfile: parsed.petProfile || base.petProfile
      };
    }
  } catch (e) {
    console.error('Fehler beim Laden des Profils:', e);
  }
  return profileId === 'master_chris' ? { ...DEFAULT_CHRIS_PROFILE } : { ...DEFAULT_CLEAN_SLATE_PROFILE };
}

export function saveProfile(profile: UserProfileData): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + profile.id, JSON.stringify(profile));
  } catch (e) {
    console.error('Fehler beim Speichern des Profils:', e);
  }
}

export function resetProfile(profileId: ProfileType): UserProfileData {
  const fresh = profileId === 'master_chris' ? { ...DEFAULT_CHRIS_PROFILE } : { ...DEFAULT_CLEAN_SLATE_PROFILE };
  saveProfile(fresh);
  return fresh;
}

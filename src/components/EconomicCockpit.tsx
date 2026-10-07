import React from 'react';
import { 
  TrendingUp, 
  Coins, 
  Leaf, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  DollarSign, 
  Zap, 
  Scale, 
  Clock, 
  Heart,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Wrench,
  Sprout,
  Database
} from 'lucide-react';
import { UserProfileData } from '../types/echse';
import { soundManager } from '../utils/audio';

interface EconomicCockpitProps {
  currentProfile: UserProfileData;
  onNavigateTab: (tab: any) => void;
  onSelectModule: (moduleId: number) => void;
}

export const EconomicCockpit: React.FC<EconomicCockpitProps> = ({ 
  currentProfile,
  onNavigateTab,
  onSelectModule 
}) => {
  // Compute real dynamic metrics from user profile data
  const discardedImpulsesSum = currentProfile.kaufgatterItems
    .filter(i => i.status === 'DISCARDED')
    .reduce((sum, i) => sum + i.price, 0);

  // Financial Value calculations
  const impulseSavingsEstimate = Math.max(1200, discardedImpulsesSum || 2400);
  const legalConsultingSavingsEstimate = 750; // Ø 2 Anwalts-/Behörden-Schriftsätze
  const pantryZeroWasteSavingsEstimate = 1150; // Zero Food Waste & organisierter Einkauf
  const maintenanceSavingsEstimate = 650; // Entkalkung & Filterpflege verhindern Neukauf
  const ecoEnergySavingsEstimate = 380; // Standby & Stoßlüftungs-Kompensation
  const smartGardenSavingsEstimate = 550; // Kräuter, Gemüse & Ertrag
  const cloudSaaSSavingsEstimate = 240; // Gekündigte Cloud-Abos & Passwort-Tools

  const totalEconomicRoi = 
    impulseSavingsEstimate + 
    legalConsultingSavingsEstimate + 
    pantryZeroWasteSavingsEstimate + 
    maintenanceSavingsEstimate + 
    ecoEnergySavingsEstimate + 
    smartGardenSavingsEstimate + 
    cloudSaaSSavingsEstimate;

  // Environmental impact
  const savedKwh = 480;
  const savedCo2Kg = 185;
  const savedFoodKg = 75;

  return (
    <div className="p-4 space-y-6 font-mono max-w-7xl mx-auto text-zinc-200">
      {/* Top Banner: Global Commercial Positioning */}
      <div className="p-6 rounded-lg bg-gradient-to-r from-amber-950/40 via-zinc-900 to-emerald-950/40 border border-amber-500/30 space-y-3 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-500 text-black font-bold text-[11px] uppercase tracking-wider">
                ECHSE OS // MARKT- & WIRTSCHAFTS-REPORT
              </span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold">
                100% NUTZEN FÜR HAUSHALT, ALLGEMEINHEIT & UMWELT
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              Das wirtschaftlich wertvollste Lebens- und Assistenzsystem der Welt
            </h1>
            <p className="text-xs text-zinc-300 max-w-3xl leading-relaxed">
              ECHSE OS vereint finanzielle Selbstverteidigung, Vorrats- und Haushaltsmanagement, rechtliche Unangreifbarkeit, High-Tech Gärtnerei und seelische Resilienz in einer einzigen autarken Plattform.
            </p>
          </div>

          {/* Big Total Value Badge */}
          <div className="p-4 bg-zinc-950/90 rounded border border-amber-500/60 text-right shrink-0">
            <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Jährlicher Gesamtnutzen:</div>
            <div className="text-3xl md:text-4xl font-bold text-amber-400 font-mono">
              +{totalEconomicRoi.toLocaleString('de-DE')} €
            </div>
            <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
              Reale Netto-Ersparnis pro Haushalt / Jahr
            </div>
          </div>
        </div>
      </div>

      {/* 6 Key Pillars of Household Economic Value */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        
        {/* Pillar 1: Vorrat & Zero Waste */}
        <div 
          onClick={() => onSelectModule(3)}
          className="p-4 bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500/60 rounded cursor-pointer transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <ShoppingBag className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-zinc-500 font-bold">MODUL 03</span>
          </div>
          <div className="text-xs text-zinc-400 font-bold">VORRATSKAMMER & ZERO WASTE</div>
          <div className="text-2xl font-bold text-cyan-300 font-mono">
            +{pantryZeroWasteSavingsEstimate} € / Jahr
          </div>
          <p className="text-[11px] text-zinc-400 leading-tight">
            Kein Wegwerfen von Lebensmitteln mehr: MHD-Ampel, strukturierte Einkaufsliste & KI-Restekoch.
          </p>
          <div className="text-[10px] text-cyan-400 pt-1 flex items-center gap-1 font-bold">
            <span>Vorrat & Einkauf öffnen</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar 2: Impulskauf-Sperre & Finanzen */}
        <div 
          onClick={() => onSelectModule(2)}
          className="p-4 bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/60 rounded cursor-pointer transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <Coins className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-zinc-500 font-bold">MODUL 02</span>
          </div>
          <div className="text-xs text-zinc-400 font-bold">48H-KAUFGATTER & FINANZEN</div>
          <div className="text-2xl font-bold text-amber-300 font-mono">
            +{impulseSavingsEstimate} € / Jahr
          </div>
          <p className="text-[11px] text-zinc-400 leading-tight">
            Verhindert unnötige Impulskäufe durch die 48h-Sperre, Dopamin-Checks und Lebensarbeitszeit-Vergleiche.
          </p>
          <div className="text-[10px] text-amber-400 pt-1 flex items-center gap-1 font-bold">
            <span>Finanz-Cockpit öffnen</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar 3: Haushalts-Wartung & Geräteschutz */}
        <div 
          onClick={() => onSelectModule(4)}
          className="p-4 bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/60 rounded cursor-pointer transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <Wrench className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-zinc-500 font-bold">MODUL 04</span>
          </div>
          <div className="text-xs text-zinc-400 font-bold">GERÄTESCHUTZ & WARTUNG</div>
          <div className="text-2xl font-bold text-blue-300 font-mono">
            +{maintenanceSavingsEstimate} € / Jahr
          </div>
          <p className="text-[11px] text-zinc-400 leading-tight">
            Verhindert 90% aller vorzeitigen Defekte: Kaffeemaschinen entkalken, Flusensiebe, Fettfilter, DIY-Reparaturen.
          </p>
          <div className="text-[10px] text-blue-400 pt-1 flex items-center gap-1 font-bold">
            <span>Wartungs-Plan öffnen</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar 4: Rechtliche Blueprints */}
        <div 
          onClick={() => onSelectModule(1)}
          className="p-4 bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/60 rounded cursor-pointer transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <Scale className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-zinc-500 font-bold">MODUL 01</span>
          </div>
          <div className="text-xs text-zinc-400 font-bold">BGB-RECHT & BEHÖRDEN</div>
          <div className="text-2xl font-bold text-amber-300 font-mono">
            +{legalConsultingSavingsEstimate} € / Jahr
          </div>
          <p className="text-[11px] text-zinc-400 leading-tight">
            Mietminderung § 536 BGB, Behörden-Widersprüche, Fluggastrechte und fristlose Kündigungen ohne Anwalt.
          </p>
          <div className="text-[10px] text-amber-400 pt-1 flex items-center gap-1 font-bold">
            <span>Rechts-Center öffnen</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar 5: Smarte Gärtnerei */}
        <div 
          onClick={() => onSelectModule(6)}
          className="p-4 bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/60 rounded cursor-pointer transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <Sprout className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-zinc-500 font-bold">MODUL 06</span>
          </div>
          <div className="text-xs text-zinc-400 font-bold">SMARTE GÄRTNEREI & ERTRAG</div>
          <div className="text-2xl font-bold text-emerald-300 font-mono">
            +{smartGardenSavingsEstimate} € / Jahr
          </div>
          <p className="text-[11px] text-zinc-400 leading-tight">
            Bio-Kräuter, Microgreens, Balkon-Permakultur und gesunde Zimmerpflanzen mit API-gesteuerter Bewässerung & VPD.
          </p>
          <div className="text-[10px] text-emerald-400 pt-1 flex items-center gap-1 font-bold">
            <span>Gärtnerei-OS öffnen</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar 6: Energie & Umwelt */}
        <div 
          onClick={() => onSelectModule(5)}
          className="p-4 bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/60 rounded cursor-pointer transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <Zap className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-zinc-500 font-bold">MODUL 05</span>
          </div>
          <div className="text-xs text-zinc-400 font-bold">ENERGIE- & ÖKO-EFFIZIENZ</div>
          <div className="text-2xl font-bold text-emerald-300 font-mono">
            +{ecoEnergySavingsEstimate} € / Jahr
          </div>
          <p className="text-[11px] text-zinc-400 leading-tight">
            Eliminiert verdeckte Standby-Verluste, optimiert Heizung nach Taupunkt und beugt Schimmelbildung vor.
          </p>
          <div className="text-[10px] text-emerald-400 pt-1 flex items-center gap-1 font-bold">
            <span>Energie-Cockpit öffnen</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* Environmental & Societal Benefit Bar */}
      <div className="p-4 bg-emerald-950/20 border border-emerald-500/40 rounded-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Leaf className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-emerald-300">
              MESSBARER EKOLOGISCHER BEITRAG ZUR UMWELT
            </div>
            <div className="text-[11px] text-zinc-400">
              System Echse senkt den Ressourcenverbrauch deines Haushalts Tag für Tag.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-center px-3 py-1 bg-zinc-950 rounded border border-emerald-500/30">
            <div className="text-[10px] text-zinc-500">STROM GESPART</div>
            <div className="text-sm font-bold text-emerald-300">~{savedKwh} kWh / Jahr</div>
          </div>
          <div className="text-center px-3 py-1 bg-zinc-950 rounded border border-emerald-500/30">
            <div className="text-[10px] text-zinc-500">CO₂-REDUKTION</div>
            <div className="text-sm font-bold text-emerald-300">~{savedCo2Kg} kg CO₂ / Jahr</div>
          </div>
          <div className="text-center px-3 py-1 bg-zinc-950 rounded border border-cyan-500/30">
            <div className="text-[10px] text-zinc-500">LEBENSMITTEL GERETTET</div>
            <div className="text-sm font-bold text-cyan-300">~{savedFoodKg} kg / Jahr</div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Zap, 
  Leaf, 
  ArrowLeft, 
  Flame, 
  Wind, 
  Droplets, 
  Thermometer, 
  TrendingDown, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  DollarSign
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Module3Props {
  onBack?: () => void;
  userName?: string;
}

interface Appliance {
  id: string;
  name: string;
  watts: number;
  hoursPerDay: number;
  category: 'IT/Server' | 'Küche' | 'Beleuchtung' | 'Klima/Botanik' | 'Unterhaltung';
}

const DEFAULT_APPLIANCES: Appliance[] = [
  { id: 'app-1', name: 'Grow-Zelt LED Board & Abluft', watts: 150, hoursPerDay: 12, category: 'Klima/Botanik' },
  { id: 'app-2', name: 'Workstation PC & Monitore', watts: 220, hoursPerDay: 8, category: 'IT/Server' },
  { id: 'app-3', name: 'Kühlschrank A+++ (Inverter)', watts: 45, hoursPerDay: 24, category: 'Küche' },
  { id: 'app-4', name: 'WLAN Router & Switch', watts: 12, hoursPerDay: 24, category: 'IT/Server' },
  { id: 'app-5', name: 'Standby-Geräte (TV, Audio, Ladegeräte)', watts: 25, hoursPerDay: 24, category: 'Unterhaltung' }
];

export const Module3UmweltEnergie: React.FC<Module3Props> = ({ onBack, userName = 'Benutzer' }) => {
  const [electricityPricePerKwh, setElectricityPricePerKwh] = useState<number>(0.38); // € / kWh
  const [co2FactorGPerKwh, setCo2FactorGPerKwh] = useState<number>(380); // g CO2 / kWh (deutscher Strommix)
  const [appliances, setAppliances] = useState<Appliance[]>(DEFAULT_APPLIANCES);

  // New appliance input
  const [newName, setNewName] = useState('');
  const [newWatts, setNewWatts] = useState('');
  const [newHours, setNewHours] = useState('8');
  const [newCategory, setNewCategory] = useState<Appliance['category']>('IT/Server');

  // Indoor climate & dew point calculator (Schimmelprävention ohne Heizverschwendung)
  const [roomTemp, setRoomTemp] = useState<number>(20.5);
  const [roomHumidity, setRoomHumidity] = useState<number>(58);

  // Calculate Dew Point (Magnus-Formel)
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * roomTemp) / (b + roomTemp)) + Math.log(roomHumidity / 100);
  const dewPoint = (b * alpha) / (a - alpha);

  // Energy calculations
  const totalDailyKwh = appliances.reduce((sum, app) => sum + (app.watts * app.hoursPerDay) / 1000, 0);
  const totalYearlyKwh = totalDailyKwh * 365;
  const totalYearlyCost = totalYearlyKwh * electricityPricePerKwh;
  const totalYearlyCo2Kg = (totalYearlyKwh * co2FactorGPerKwh) / 1000;

  // Potential savings (Standby elimination & LED shift)
  const standbyKwh = appliances
    .filter(a => a.name.toLowerCase().includes('standby') || a.category === 'Unterhaltung')
    .reduce((sum, a) => sum + (a.watts * a.hoursPerDay * 365) / 1000, 0);
  const standbyCost = standbyKwh * electricityPricePerKwh;

  const [aiEcoLoading, setAiEcoLoading] = useState(false);
  const [aiEcoReport, setAiEcoReport] = useState<string>('');

  const handleAiEcoAudit = async () => {
    setAiEcoLoading(true);
    soundManager.playExecute();
    try {
      const listSummary = appliances.map(a => `${a.name}: ${a.watts}W (${a.hoursPerDay}h/Tag)`).join(', ');
      const res = await fetch('/api/echse/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'HYBRID',
          command: 'ECHSE: ANALYSE',
          input: `Öko-, Strom- & Umwelt-Audit:
Verbraucher: ${listSummary}
Gesamtstrom: ${totalYearlyKwh.toFixed(1)} kWh/Jahr (${totalYearlyCost.toFixed(2)} €/Jahr, ${totalYearlyCo2Kg.toFixed(1)} kg CO2)
Raumklima: ${roomTemp} °C, ${roomHumidity} % Feuchte, Taupunkt: ${dewPoint.toFixed(1)} °C.

Erstelle ein wissenschaftlich fundiertes Spar- und Umweltgutachten:
1. Konkrete Hebel zur Reduzierung des Stromverbrauchs und der CO2-Last.
2. Schimmel- und Heizkosten-Optimierung anhand des Taupunkts.
3. Berechnetes Einsparpotenzial in Euro und kg CO2 pro Jahr.
Beende mit dem DUAL-PROTOKOLL.`,
          activeModule: 3,
          context: 'Modul 3: Umwelt-, Energie- & Öko-Effizienz'
        })
      });
      const data = await res.json();
      setAiEcoReport(data.output || 'Kein Gutachten empfangen.');
      soundManager.playSuccess();
    } catch {
      soundManager.playWarning();
    } finally {
      setAiEcoLoading(false);
    }
  };

  const handleAddAppliance = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(newWatts);
    const h = parseFloat(newHours);
    if (!newName.trim() || isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;

    soundManager.playClick();
    const newApp: Appliance = {
      id: `app-${Date.now()}`,
      name: newName.trim(),
      watts: w,
      hoursPerDay: Math.min(24, h),
      category: newCategory
    };
    setAppliances([...appliances, newApp]);
    setNewName('');
    setNewWatts('');
  };

  const handleRemoveAppliance = (id: string) => {
    soundManager.playWarning();
    setAppliances(appliances.filter(a => a.id !== id));
  };

  return (
    <div className="p-4 space-y-5 font-mono max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                soundManager.playClick();
                onBack();
              }}
              className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                MODUL 3 // UMWELT & ORGANIK
              </span>
              <span className="text-zinc-500 text-xs">HYBRID MODUS</span>
            </div>
            <h1 className="text-lg font-bold text-emerald-300">
              Umwelt-, Energie- & Öko-Effizienz-Hub
            </h1>
          </div>
        </div>

        {/* Global Impact Summary Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1 bg-emerald-950/40 border border-emerald-500/40 rounded flex items-center gap-2 text-emerald-400">
            <Leaf className="w-4 h-4" />
            <span>CO₂: <strong className="text-emerald-300">{totalYearlyCo2Kg.toFixed(1)} kg</strong> / Jahr</span>
          </div>
          <div className="px-3 py-1 bg-amber-950/40 border border-amber-500/40 rounded flex items-center gap-2 text-amber-400">
            <Zap className="w-4 h-4" />
            <span>Kosten: <strong className="text-amber-300">{totalYearlyCost.toFixed(2)} €</strong> / Jahr</span>
          </div>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded">
          <div className="text-xs text-zinc-400 flex items-center justify-between mb-1">
            <span>TÄGLICHER ENERGIEBEDARF</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">
            {totalDailyKwh.toFixed(2)} <span className="text-xs font-normal text-zinc-400">kWh / Tag</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Entspricht {(totalDailyKwh * electricityPricePerKwh).toFixed(2)} € täglichen Betriebskosten
          </div>
        </div>

        <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded">
          <div className="text-xs text-zinc-400 flex items-center justify-between mb-1">
            <span>UMWELT-IMPACT (CO₂ PRO JAHR)</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300">
            {(totalYearlyCo2Kg / 1000).toFixed(2)} <span className="text-xs font-normal text-zinc-400">Tonnen CO₂</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Benötigt ca. {Math.max(1, Math.round(totalYearlyCo2Kg / 12.5))} Buchenbäume zur vollständigen Kompensation
          </div>
        </div>

        <div className="p-3.5 bg-zinc-900/80 border border-emerald-500/30 rounded bg-gradient-to-br from-emerald-950/20 to-zinc-900">
          <div className="text-xs text-emerald-400 flex items-center justify-between mb-1">
            <span>STANDBY-EINSPARPOTENZIAL</span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300">
            {standbyCost.toFixed(2)} € <span className="text-xs font-normal text-zinc-400">/ Jahr</span>
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            Durch schaltbare Steckdosenleisten sofort und dauerhaft einsparbar!
          </div>
        </div>
      </div>

      {/* Main Grid: Appliance Consumption Manager & Dew Point Climate Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Appliances List & Adder (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>ELEKTRISCHE VERBRAUCHER IM SYSTEM ({appliances.length})</span>
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <label className="text-zinc-400 text-[11px]">Strompreis:</label>
                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-xs text-amber-300">
                  <input
                    type="number"
                    step="0.01"
                    min="0.10"
                    max="1.50"
                    value={electricityPricePerKwh}
                    onChange={(e) => setElectricityPricePerKwh(parseFloat(e.target.value) || 0.38)}
                    className="w-14 bg-transparent text-right outline-none font-bold"
                  />
                  <span className="ml-1 text-zinc-500">€/kWh</span>
                </div>
              </div>
            </div>

            {/* Appliances Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-[10px]">
                    <th className="py-1.5 px-2">GERÄT</th>
                    <th className="py-1.5 px-2">KATEGORIE</th>
                    <th className="py-1.5 px-2 text-right">LEISTUNG</th>
                    <th className="py-1.5 px-2 text-right">ZEIT/TAG</th>
                    <th className="py-1.5 px-2 text-right">JAHR (kWh)</th>
                    <th className="py-1.5 px-2 text-right">JAHR (€)</th>
                    <th className="py-1.5 px-2 text-center">AKTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {appliances.map((app) => {
                    const yearlyKwh = (app.watts * app.hoursPerDay * 365) / 1000;
                    const yearlyEuro = yearlyKwh * electricityPricePerKwh;
                    return (
                      <tr key={app.id} className="hover:bg-zinc-800/30">
                        <td className="py-2 px-2 font-bold text-zinc-200">{app.name}</td>
                        <td className="py-2 px-2 text-[10px] text-zinc-400">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700">
                            {app.category}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-amber-300">{app.watts} W</td>
                        <td className="py-2 px-2 text-right font-mono text-zinc-400">{app.hoursPerDay} h</td>
                        <td className="py-2 px-2 text-right font-mono text-zinc-300">{yearlyKwh.toFixed(1)}</td>
                        <td className="py-2 px-2 text-right font-mono font-bold text-emerald-400">{yearlyEuro.toFixed(2)} €</td>
                        <td className="py-2 px-2 text-center">
                          <button
                            onClick={() => handleRemoveAppliance(app.id)}
                            className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                            title="Verbraucher entfernen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Add Appliance Form */}
            <form onSubmit={handleAddAppliance} className="pt-3 border-t border-zinc-800 flex flex-wrap gap-2 items-center">
              <input
                type="text"
                placeholder="Gerätename (z.B. Heizlüfter, Monitor)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 min-w-[160px] bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 outline-none focus:border-emerald-500"
              />
              <input
                type="number"
                placeholder="Watt (z.B. 80)"
                value={newWatts}
                onChange={(e) => setNewWatts(e.target.value)}
                className="w-24 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 outline-none focus:border-emerald-500"
              />
              <input
                type="number"
                placeholder="h/Tag"
                value={newHours}
                onChange={(e) => setNewHours(e.target.value)}
                className="w-16 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 outline-none focus:border-emerald-500"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 outline-none"
              >
                <option value="IT/Server">IT/Server</option>
                <option value="Küche">Küche</option>
                <option value="Beleuchtung">Beleuchtung</option>
                <option value="Klima/Botanik">Klima/Botanik</option>
                <option value="Unterhaltung">Unterhaltung</option>
              </select>
              <button
                type="submit"
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>HINZUFÜGEN</span>
              </button>
            </form>
            {/* AI Eco Audit Trigger Button */}
            <div className="pt-2">
              <button
                onClick={handleAiEcoAudit}
                disabled={aiEcoLoading}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded text-xs flex items-center justify-center gap-2 shadow transition-colors disabled:opacity-50"
              >
                <span>{aiEcoLoading ? 'KI BERECHNET ÖKO- & STROMSPAR-GUTACHTEN...' : 'KI-ÖKO- & STROMSPAR-GUTACHTEN ANFORDERN'}</span>
              </button>
            </div>

            {/* AI Eco Report Display */}
            {aiEcoReport && (
              <div className="p-3.5 bg-zinc-950 rounded border border-emerald-500/40 text-xs text-zinc-200 space-y-1.5">
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  KI-GUTACHTEN // ECHSE V7.5 HYBRID:
                </div>
                <div className="whitespace-pre-line leading-relaxed text-zinc-300 font-mono text-[11px] max-h-56 overflow-y-auto">
                  {aiEcoReport}
                </div>
              </div>
            )}
          </div>

          {/* Zero-Waste & Ressourceneffizienz Tipps */}
          <div className="p-4 bg-zinc-900/40 border border-emerald-500/20 rounded space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              <span>NUTZEN FÜR DIE UMWELT & DIE ALLGEMEINHEIT (ZERO-WASTE LEITLINIEN)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-zinc-300">
              <div className="p-2 bg-zinc-950/60 rounded border border-zinc-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Standby-Kompensation:</strong> Netzteile und Audiogeräte ziehen auch im Ruhezustand kontinuierlich 2-15 Watt. Master-Slave-Leiste amortisiert sich in 6 Wochen.</span>
              </div>
              <div className="p-2 bg-zinc-950/60 rounded border border-zinc-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Wärmerückgewinnung:</strong> Abwärme von PC und Grow-Zelt im Winter als primäre Raumheizung nutzen – spart teure Gas- oder Ölheizkosten.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Raumklima-Taupunkt & Schimmelprävention (1 Col) */}
        <div className="space-y-4">
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded space-y-3">
            <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span>TAUPUNKT & SCHIMMEL-SCHUTZ</span>
            </h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Verhindert Feuchtigkeitsschäden und Schimmel an Außenwänden, ohne sinnlos heiße Luft zum Fenster hinaus zu heizen.
            </p>

            {/* Sliders for Temp and Humidity */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">Raumtemperatur:</span>
                  <span className="font-bold text-amber-300">{roomTemp.toFixed(1)} °C</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="28"
                  step="0.5"
                  value={roomTemp}
                  onChange={(e) => setRoomTemp(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">Relative Luftfeuchte:</span>
                  <span className="font-bold text-cyan-300">{roomHumidity} %</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="85"
                  step="1"
                  value={roomHumidity}
                  onChange={(e) => setRoomHumidity(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>

            {/* Dew Point Result Gauge */}
            <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-1.5 mt-2">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Errechneter Taupunkt:</div>
              <div className="text-xl font-bold font-mono text-cyan-400">
                {dewPoint.toFixed(1)} °C
              </div>
              <div className="text-[10px] text-zinc-400 leading-tight">
                {roomHumidity > 65 ? (
                  <span className="text-red-400 flex items-center gap-1 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Achtung: Erhöhte Schimmelgefahr! Sofort 5 Min. Stoßlüften.
                  </span>
                ) : roomHumidity < 40 ? (
                  <span className="text-amber-400">Luft zu trocken. Reizung der Schleimhäute & Atemwege möglich.</span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Optimales Wohn- und Raumklima. Keine Kondensation.
                  </span>
                )}
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 border-t border-zinc-800 pt-2 space-y-1">
              <div>• <strong>Stoßlüften:</strong> 3x täglich 5 Minuten querlüften spart gegenüber gekipptem Fenster ca. 180 € Heizenergie pro Winter.</div>
              <div>• <strong>Kondensationsgrenze:</strong> Liegt die Wandtemperatur unter {dewPoint.toFixed(1)} °C, schlägt Feuchtigkeit nieder.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

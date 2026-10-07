import React, { useState } from 'react';
import { 
  Cat, 
  Heart, 
  ShieldAlert, 
  ArrowLeft, 
  Check, 
  Clock, 
  AlertTriangle, 
  Bot, 
  RefreshCw, 
  Sparkles, 
  Info, 
  Activity, 
  Scale, 
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface ModuleHaustierProps {
  onBack?: () => void;
  petName?: string;
  petType?: string;
  userName?: string;
}

const TOXIC_SUBSTANCES_CHECK = [
  { item: 'Lilien (alle Arten)', risk: 'TÖDLICH FÜR KATZEN', note: 'Bereits Blütenstaub oder Vasenwasser verursacht akutes Nierenversagen.' },
  { item: 'Monstera / Fensterblatt', risk: 'GIFTIG', note: 'Calziumoxalat-Nadeln führen zu Schleimhautreizung und Erbrechen.' },
  { item: 'Schokolade & Kakao', risk: 'TÖDLICH / HOCHGIFTIG', note: 'Theobromin führt zu Herzrasen, Krämpfen und Kreislaufkollaps.' },
  { item: 'Zwiebeln, Knoblauch, Lauch', risk: 'STARK GIFTIG', note: 'Zerstört rote Blutkörperchen (Hämolytische Anämie).' },
  { item: 'Weintrauben & Rosinen', risk: 'HOCHGIFTIG', note: 'Verursacht plötzliches Nierenversagen bei Hunden und Katzen.' },
  { item: 'Xylit / Birkenzucker', risk: 'TÖDLICH', note: 'Extreme Insulinausschüttung und Leberversagen binnen Minuten.' }
];

export const Module4ErdungsTakt: React.FC<ModuleHaustierProps> = ({ 
  onBack, 
  petName = 'Katzen',
  petType = 'Europäisch Kurzhaar',
  userName = 'Chris'
}) => {
  // Care Checklist
  const [careMorningFed, setCareMorningFed] = useState(true);
  const [careWaterFresh, setCareWaterFresh] = useState(true);
  const [careLitterClean, setCareLitterClean] = useState(true);
  const [carePlayTime, setCarePlayTime] = useState(false);
  const [careEveningFed, setCareEveningFed] = useState(false);

  // Hardware Interrupt
  const [interruptActive, setInterruptActive] = useState(false);
  const [interruptSecondsLeft, setInterruptSecondsLeft] = useState(600); // 10 min

  // Pet Stats
  const [foodStockKg, setFoodStockKg] = useState(8.5);
  const [dailyGrams, setDailyGrams] = useState(280);
  const daysOfFoodLeft = Math.floor((foodStockKg * 1000) / dailyGrams);

  // AI Vet State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState('');

  const triggerHardwareInterrupt = () => {
    soundManager.playAlarm();
    setInterruptActive(true);
    setInterruptSecondsLeft(600);
  };

  const endHardwareInterrupt = () => {
    soundManager.playSuccess();
    setInterruptActive(false);
    setCarePlayTime(true);
  };

  const handleAskVet = async (customPrompt?: string) => {
    const q = customPrompt || aiQuestion;
    if (!q.trim() || aiLoading) return;

    setAiLoading(true);
    soundManager.playExecute();

    try {
      const res = await fetch('/api/echse/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'HYBRID',
          command: 'ECHSE: ANALYSE',
          input: `Du bist der erfahrene Tiergesundheits- & Verhaltens-Experte für ${petName} (${petType}) im Haushalt von ${userName}.
Anfrage / Situation:
"${q}"

Aufgabe:
1. Prüfe mögliche Gefahren, Toxizität oder Verhaltensursachen.
2. Gib sofortige Erste-Hilfe-Maßnahmen und verständliche Ratschläge.
3. Kläre eindeutig, wann zwingend ein Tierarzt aufgesucht werden muss (Rot-Ampel-Kriterien).
4. Erinnere an die Bindung und das Wohlbefinden des Tieres als Prio-1 Lebensanker.
Beende mit dem SYMBIOSIS-ENDPROTOKOLL.`,
          activeModule: 7,
          context: 'Modul 7: Haustier-Fürsorge, Tiergesundheit & Erdungs-Takt'
        })
      });

      const data = await res.json();
      setAiReport(data.output || 'Keine Antwort erhalten.');
      soundManager.playSuccess();
    } catch {
      soundManager.playWarning();
      setAiReport('Verbindungsfehler zur KI. Bitte prüfe deine Eingabe.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-5 font-mono max-w-7xl mx-auto text-zinc-200">
      {/* Top Header */}
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
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold flex items-center gap-1">
                <Cat className="w-3 h-3 text-amber-400" />
                <span>HARDWARE-INTERRUPT PRIO 1</span>
              </span>
              <span className="text-zinc-500 text-xs">Modul 7</span>
            </div>
            <h1 className="text-lg font-bold text-amber-300">
              Erdungs-Takt & Haustier-Fürsorge
            </h1>
          </div>
        </div>

        {/* Global Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1 bg-amber-950/40 border border-amber-500/40 rounded flex items-center gap-2 text-amber-400">
            <Heart className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span>Begleiter: <strong className="text-amber-300">{petName}</strong></span>
          </div>
          <div className="px-3 py-1 bg-emerald-950/40 border border-emerald-500/40 rounded flex items-center gap-2 text-emerald-400">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Futtervorrat: <strong className="text-emerald-300">{daysOfFoodLeft} Tage ({foodStockKg} kg)</strong></span>
          </div>
        </div>
      </div>

      {/* Emergency Hardware Interrupt Active Screen */}
      {interruptActive && (
        <div className="p-4 bg-amber-500/20 border-2 border-amber-500 rounded-lg flex flex-wrap items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3 text-amber-300">
            <Cat className="w-8 h-8 text-amber-400" />
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-amber-400">
                HARDWARE-INTERRUPT AUSGELÖST: BILDSCHIRM-SPERRE AKTIV
              </div>
              <div className="text-xs text-zinc-300">
                Lass alle Terminals ruhen. Wende dich voll und ganz {petName} zu – Kraulen, Bürsten oder Spielen. Deine kognitive Entlastung und die Fürsorge haben Vorrang!
              </div>
            </div>
          </div>
          <button
            onClick={endHardwareInterrupt}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded transition-colors shadow-lg"
          >
            INTERRUPT ERFÜLLT (ZURÜCK ZUR KONSOLE)
          </button>
        </div>
      )}

      {/* Main Grid: Left Routines & Food, Right AI Vet & Toxicity Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Routines & Health Stats (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Daily Care Checklist */}
          <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>TÄGLICHE FÜRSORGE-ROUTINEN (PRIORITÄT 1)</span>
              </h2>
              <span className="text-[10px] text-zinc-500">Heute fällig</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 bg-zinc-950 rounded border border-zinc-800 hover:border-zinc-700 cursor-pointer">
                <div className="flex items-center gap-2.5 text-xs text-zinc-200">
                  <input
                    type="checkbox"
                    checked={careMorningFed}
                    onChange={(e) => { soundManager.playClick(); setCareMorningFed(e.target.checked); }}
                    className="rounded bg-zinc-800 border-zinc-700 text-amber-500"
                  />
                  <span>Morgendliche Fütterung & Portionierung</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">07:30 UHR</span>
              </label>

              <label className="flex items-center justify-between p-2.5 bg-zinc-950 rounded border border-zinc-800 hover:border-zinc-700 cursor-pointer">
                <div className="flex items-center gap-2.5 text-xs text-zinc-200">
                  <input
                    type="checkbox"
                    checked={careWaterFresh}
                    onChange={(e) => { soundManager.playClick(); setCareWaterFresh(e.target.checked); }}
                    className="rounded bg-zinc-800 border-zinc-700 text-amber-500"
                  />
                  <span>Frisches Trinkwasser bereitgestellt & Napf gereinigt</span>
                </div>
                <span className="text-[10px] text-cyan-400 font-mono">HYGIENE</span>
              </label>

              <label className="flex items-center justify-between p-2.5 bg-zinc-950 rounded border border-zinc-800 hover:border-zinc-700 cursor-pointer">
                <div className="flex items-center gap-2.5 text-xs text-zinc-200">
                  <input
                    type="checkbox"
                    checked={careLitterClean}
                    onChange={(e) => { soundManager.playClick(); setCareLitterClean(e.target.checked); }}
                    className="rounded bg-zinc-800 border-zinc-700 text-amber-500"
                  />
                  <span>Katzenklo / Gehege gereinigt & Füllstand geprüft</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">SAUBERKEIT</span>
              </label>

              <label className="flex items-center justify-between p-2.5 bg-zinc-950 rounded border border-zinc-800 hover:border-zinc-700 cursor-pointer">
                <div className="flex items-center gap-2.5 text-xs text-zinc-200">
                  <input
                    type="checkbox"
                    checked={carePlayTime}
                    onChange={(e) => { soundManager.playClick(); setCarePlayTime(e.target.checked); }}
                    className="rounded bg-zinc-800 border-zinc-700 text-amber-500"
                  />
                  <span>15 Min. bewusste Zuwendung, Spiel & Fellpflege</span>
                </div>
                <span className="text-[10px] text-amber-400 font-mono">HERZENSBINDUNG</span>
              </label>

              <label className="flex items-center justify-between p-2.5 bg-zinc-950 rounded border border-zinc-800 hover:border-zinc-700 cursor-pointer">
                <div className="flex items-center gap-2.5 text-xs text-zinc-200">
                  <input
                    type="checkbox"
                    checked={careEveningFed}
                    onChange={(e) => { soundManager.playClick(); setCareEveningFed(e.target.checked); }}
                    className="rounded bg-zinc-800 border-zinc-700 text-amber-500"
                  />
                  <span>Abendliche Fütterung</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">19:00 UHR</span>
              </label>
            </div>

            {/* Hardware Interrupt Trigger Button */}
            <div className="pt-2 border-t border-zinc-800">
              <button
                onClick={triggerHardwareInterrupt}
                className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs rounded transition-colors flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>NOTFALL-AUS / 10-MIN BILDSCHIRM-SPERRE ERZWINGEN</span>
              </button>
            </div>
          </div>

          {/* Food Stock & Supply Management */}
          <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-3">
            <h2 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>FUTTERVORRAT & REICHWEITEN-RECHNER</span>
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800">
                <span className="text-[11px] text-zinc-400 block mb-1">Vorrat im Haus (kg):</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={foodStockKg}
                  onChange={(e) => setFoodStockKg(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm font-bold text-emerald-400 outline-none"
                />
              </div>

              <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800">
                <span className="text-[11px] text-zinc-400 block mb-1">Tagesbedarf gesamt (g):</span>
                <input
                  type="number"
                  step="10"
                  min="10"
                  value={dailyGrams}
                  onChange={(e) => setDailyGrams(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm font-bold text-amber-400 outline-none"
                />
              </div>
            </div>

            <div className={`p-2.5 rounded border text-xs flex items-center justify-between ${
              daysOfFoodLeft < 7 
                ? 'bg-red-950/30 border-red-500/50 text-red-300' 
                : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            }`}>
              <span>Reichweite: <strong>{daysOfFoodLeft} Tage</strong></span>
              {daysOfFoodLeft < 7 && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-900 text-red-100 font-bold">
                  NACHKAUFEN!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Vet Assistant & Toxicity Radar (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* AI Vet Consultation Box */}
          <div className="p-4 bg-zinc-900 rounded-lg border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-400" />
                <span>KI-TIERGESUNDHEITS- & ERNÄHRUNGS-RATGEBER</span>
              </h2>
              <span className="text-[10px] text-zinc-500">Gemini Neural Core</span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Sofortige Klärung bei Verhaltensänderungen, Futterunverträglichkeiten oder Notfall-Symptomen für {petName}.
            </p>

            {/* Quick Questions */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Schnellfragen:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {[
                  'Katze trinkt plötzlich auffällig viel Wasser',
                  'Katze frisst nicht seit 24 Stunden - Notfall?',
                  'Welche Katzengras-Alternativen sind sicher?',
                  'Gewichts- & Portionskontrolle für Wohnungskatzen'
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskVet(q)}
                    disabled={aiLoading}
                    className="text-left text-[10px] p-2 rounded bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-zinc-300 transition-colors disabled:opacity-50"
                  >
                    🐾 {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Frage zur Gesundheit oder Ernährung von ${petName}...`}
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleAskVet()}
                  disabled={aiLoading || !aiQuestion.trim()}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {aiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>FRAGEN</span>
                </button>
              </div>

              {/* AI Report */}
              {aiReport && (
                <div className="p-3 bg-zinc-950 rounded border border-amber-500/40 text-xs text-zinc-200 space-y-1.5 mt-2">
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>TIERMEDIZINISCHES GUTACHTEN:</span>
                  </div>
                  <div className="whitespace-pre-line leading-relaxed text-zinc-300 font-mono text-[11px] max-h-56 overflow-y-auto">
                    {aiReport}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Toxic Substances & Plants Radar */}
          <div className="p-4 bg-zinc-900 rounded-lg border border-red-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-red-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>NOTFALL-GIFT-RADAR (PFLANZEN & LEBENSMITTEL)</span>
              </h2>
              <span className="text-[10px] text-red-500 font-bold">LEBENSRETTEND</span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {TOXIC_SUBSTANCES_CHECK.map((sub, idx) => (
                <div key={idx} className="p-2 bg-zinc-950 rounded border border-zinc-800 text-[11px] space-y-0.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-zinc-200">{sub.item}</strong>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800 font-bold">
                      {sub.risk}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[10px] leading-tight">
                    {sub.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

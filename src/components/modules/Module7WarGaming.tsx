import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowLeft, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  GitFork,
  Target,
  Flame,
  Bot
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Module7Props {
  onBack?: () => void;
}

interface ScenarioResult {
  bestCase: string;
  bestProbability: number;
  worstCase: string;
  worstProbability: number;
  likelyCase: string;
  likelyProbability: number;
  stopLossCriteria: string[];
  maxFinancialRisk: number;
  riskRating: 'NIEDRIG' | 'MODERAT' | 'HOCH' | 'KRITISCH';
  fullAiAnalysis?: string;
}

const PRESET_PLANS = [
  {
    id: 'plan-job',
    title: 'Kündigung & Wechsel in die Selbstständigkeit',
    capital: 12000,
    timeHorizonMonths: 12,
    details: 'Festanstellung kündigen, um ein eigenes digitales Service-/Consulting-Business aufzubauen. 12k Notgroschen vorhanden.'
  },
  {
    id: 'plan-kredit',
    title: 'Großanschaffung auf Raten / Konsumkredit',
    capital: 3500,
    timeHorizonMonths: 24,
    details: 'Finanzierung eines Fahrzeugs oder High-End Tech Setups über 24 Monate à 220 €.'
  },
  {
    id: 'plan-umzug',
    title: 'Wohnungswechsel in größere Stadt',
    capital: 5000,
    timeHorizonMonths: 6,
    details: 'Umzug mit 40% höherer Kaltmiete für mehr urbane Möglichkeiten und soziales Umfeld.'
  }
];

export const Module7WarGaming: React.FC<Module7Props> = ({ onBack }) => {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_PLANS[0].id);
  const [planTitle, setPlanTitle] = useState(PRESET_PLANS[0].title);
  const [planDetails, setPlanDetails] = useState(PRESET_PLANS[0].details);
  const [riskCapital, setRiskCapital] = useState<number>(PRESET_PLANS[0].capital);
  const [horizonMonths, setHorizonMonths] = useState<number>(PRESET_PLANS[0].timeHorizonMonths);

  const [isRunning, setIsRunning] = useState(false);
  const [scenario, setScenario] = useState<ScenarioResult>({
    bestCase: 'Schneller Markteintritt nach 3 Monaten, Break-Even im Monat 5. Monatsumsatz übertrifft altes Gehalt um 30%.',
    bestProbability: 25,
    likelyCase: 'Erste Aufträge nach 4-6 Monaten. Zähe Kundenakquise, Notgroschen schrumpft um 50%. Solide Basis nach 11 Monaten.',
    likelyProbability: 55,
    worstCase: 'Keine zahlenden Kunden nach 7 Monaten. Notgroschen vollständig aufgezehrt. Rückkehr in Festanstellung unter Zeitdruck.',
    worstProbability: 20,
    stopLossCriteria: [
      'Wenn nach 6 Monaten weniger als 2.000 € kumulierter Umsatz erzielt wurde: Sofortiges Einstellen.',
      'Wenn der Notgroschen unter 3.000 € fällt: Sofortige Bewerbungen auf Interim-Projekte.'
    ],
    maxFinancialRisk: 12000,
    riskRating: 'HOCH',
    fullAiAnalysis: ''
  });

  const handleSelectPreset = (id: string) => {
    soundManager.playClick();
    setSelectedPreset(id);
    const p = PRESET_PLANS.find(x => x.id === id);
    if (p) {
      setPlanTitle(p.title);
      setPlanDetails(p.details);
      setRiskCapital(p.capital);
      setHorizonMonths(p.timeHorizonMonths);
    }
  };

  const runSimulationWithAi = async () => {
    if (!planTitle.trim() || isRunning) return;

    soundManager.playExecute();
    setIsRunning(true);

    try {
      const res = await fetch('/api/echse/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'V6_HARDENED',
          command: 'ECHSE: WAR-GAME',
          input: `Stresstest für folgendes Vorhaben:
Titel: ${planTitle}
Details: ${planDetails}
Kapital im Risiko: ${riskCapital} €
Zeithorizont: ${horizonMonths} Monate

Führe einen kompromisslosen Stresstest durch. Berechne:
1. BEST CASE
2. MOST LIKELY CASE
3. WORST CASE
4. STOP-LOSS KRITERIEN (Konkrete, unerbittliche Ausstiegsregeln)
5. GESAMTRISIKO (NIEDRIG, MODERAT, HOCH, KRITISCH)
Beende mit dem NULL-BALLAST-ENDPROTOKOLL.`,
          activeModule: 7,
          context: 'Modul 7: Strategisches War-Gaming & Entscheidungs-Matrix'
        }),
      });

      const data = await res.json();
      const text = data.output || '';

      // Extract sections from AI response
      const bestMatch = text.match(/Best Case[:\s\n]+([\s\S]*?)(?=Likely|Most Likely|Worst|$)/i);
      const likelyMatch = text.match(/(?:Most Likely|Likely Case)[:\s\n]+([\s\S]*?)(?=Worst|Stop-Loss|$)/i);
      const worstMatch = text.match(/Worst Case[:\s\n]+([\s\S]*?)(?=Stop-Loss|Abbruch|Ergebnis|$)/i);
      const stopLossMatch = text.match(/Stop-Loss[:\s\n]+([\s\S]*?)(?=NULL-BALLAST-ENDPROTOKOLL|Ergebnis|$)/i);

      let parsedRating: ScenarioResult['riskRating'] = 'MODERAT';
      if (text.toLowerCase().includes('kritisch')) parsedRating = 'KRITISCH';
      else if (text.toLowerCase().includes('hoch')) parsedRating = 'HOCH';
      else if (text.toLowerCase().includes('niedrig')) parsedRating = 'NIEDRIG';

      let parsedStopLoss: string[] = [];
      if (stopLossMatch && stopLossMatch[1].trim()) {
        parsedStopLoss = stopLossMatch[1].split('\n')
          .map((l: string) => l.replace(/^[-*•\d.]+\s*/, '').trim())
          .filter((l: string) => l.length > 5);
      }

      setScenario({
        bestCase: bestMatch ? bestMatch[1].trim().slice(0, 200) : 'Planziel wird vorzeitig erreicht.',
        bestProbability: 25,
        likelyCase: likelyMatch ? likelyMatch[1].trim().slice(0, 200) : 'Plan stabilisiert sich mit leichten Mehrkosten.',
        likelyProbability: 55,
        worstCase: worstMatch ? worstMatch[1].trim().slice(0, 200) : 'Unerwartete Risiken führen zu Verlusten.',
        worstProbability: 20,
        stopLossCriteria: parsedStopLoss.length > 0 ? parsedStopLoss.slice(0, 3) : [
          `Abbruch bei Verlust von mehr als ${(riskCapital * 0.6).toFixed(0)} €`,
          'Keine emotionalen Kapital-Nachschüsse ohne schriftliche Neuanalyse'
        ],
        maxFinancialRisk: riskCapital,
        riskRating: parsedRating,
        fullAiAnalysis: text
      });

      soundManager.playSuccess();
    } catch {
      soundManager.playWarning();
    } finally {
      setIsRunning(false);
    }
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
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/40 font-bold flex items-center gap-1">
                <Bot className="w-3 h-3" />
                <span>KI-POWERED // V6.1 WAR-GAME</span>
              </span>
              <span className="text-zinc-500 text-xs">Stochastischer Stresstest</span>
            </div>
            <h1 className="text-lg font-bold text-purple-300">
              Strategisches War-Gaming & Entscheidungs-Matrix
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {PRESET_PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.id)}
              className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                selectedPreset === p.id
                  ? 'bg-purple-600 text-white font-bold border-purple-400 shadow'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {p.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Plan Configuration (1 Col) */}
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded space-y-3">
          <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            <span>VORHABEN-PARAMETER (FÜR KI-ANALYSE)</span>
          </h3>

          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Titel des Vorhabens:</label>
            <input
              type="text"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Details & Annahmen:</label>
            <textarea
              rows={4}
              value={planDetails}
              onChange={(e) => setPlanDetails(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-zinc-200 outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Kapital im Risiko (€):</label>
              <input
                type="number"
                value={riskCapital}
                onChange={(e) => setRiskCapital(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Zeithorizont (Monate):</label>
              <input
                type="number"
                value={horizonMonths}
                onChange={(e) => setHorizonMonths(parseInt(e.target.value) || 1)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 outline-none"
              />
            </div>
          </div>

          <button
            onClick={runSimulationWithAi}
            disabled={isRunning}
            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded text-xs flex items-center justify-center gap-1.5 shadow transition-colors disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>KI BERECHNET SZENARIEN & STOP-LOSS...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>KI-WAR-GAME STRESSTEST STARTEN</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Scenario Matrix (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          {/* Risk Level Badge */}
          <div className="flex items-center justify-between p-3 bg-zinc-900/80 border border-zinc-800 rounded">
            <div className="text-xs text-zinc-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>VON DER KI ERMITTELTES RISIKO-PROFIL:</span>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded font-bold border ${
              scenario.riskRating === 'HOCH' || scenario.riskRating === 'KRITISCH'
                ? 'bg-red-950 text-red-300 border-red-700'
                : 'bg-emerald-950 text-emerald-300 border-emerald-700'
            }`}>
              {scenario.riskRating}
            </span>
          </div>

          {/* 3 Cases */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
            {/* Best Case */}
            <div className="p-3 bg-zinc-900/60 border border-emerald-500/30 rounded flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-emerald-400">BEST CASE</span>
                  <span className="text-[11px] text-zinc-400 font-mono">KI-Prognose</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  {scenario.bestCase}
                </p>
              </div>
            </div>

            {/* Likely Case */}
            <div className="p-3 bg-zinc-900/60 border border-cyan-500/30 rounded flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-cyan-400">MOST LIKELY</span>
                  <span className="text-[11px] text-zinc-400 font-mono">KI-Prognose</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  {scenario.likelyCase}
                </p>
              </div>
            </div>

            {/* Worst Case */}
            <div className="p-3 bg-zinc-900/60 border border-red-500/30 rounded flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-red-400">WORST CASE</span>
                  <span className="text-[11px] text-zinc-400 font-mono">KI-Prognose</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  {scenario.worstCase}
                </p>
              </div>
            </div>
          </div>

          {/* Stop-Loss Criteria Box */}
          <div className="p-4 bg-zinc-900/80 border border-amber-500/30 rounded space-y-2">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>UNERBITTLICHE STOP-LOSS KRITERIEN (NOTBREMSE)</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-200">
              {scenario.stopLossCriteria.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold shrink-0">[{i + 1}]</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Full AI Output Accordion */}
          {scenario.fullAiAnalysis && (
            <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-1.5">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Vollständiger KI-Bericht:</div>
              <pre className="text-[11px] text-zinc-300 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto leading-relaxed">
                {scenario.fullAiAnalysis}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

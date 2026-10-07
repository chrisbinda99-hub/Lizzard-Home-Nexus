import React, { useState } from 'react';
import { Compass, ArrowLeft, ShieldCheck, Heart, Sparkles, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Module17Props {
  onBack?: () => void;
}

export const Module17MentalResilience: React.FC<Module17Props> = ({ onBack }) => {
  const [situation, setSituation] = useState(
    'Ich fühle mich von den vielen Nachrichten und Erwartungen der Menschen im Umfeld erdrückt. Ich ziehe mich komplett zurück, aber dann plagt mich das schlechte Gewissen.'
  );
  const [guidance, setGuidance] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleReflect = async () => {
    soundManager.playExecute();
    setLoading(true);
    try {
      const res = await fetch('/api/echse/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'V7_SYMBIOSIS',
          command: 'ECHSE: REFLEXION',
          input: `SOZIALE NAVIGATION & REIZÜBERFLUTUNG: "${situation}". Führe mich sanft und verständnisvoll durch das große Gesamtbild. Hilf bei der Entlastung von Schuldgefühlen.`,
          activeModule: 17,
          context: 'Modul 17: Mentale Resilienz & Soziale Navigation. Begleite durch Isolation/Überreizung. Hilf bei der emotionalen Verarbeitung.',
        }),
      });
      const data = await res.json();
      setGuidance(data.output);
      soundManager.playSuccess();
    } catch {
      soundManager.playWarning();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-6xl mx-auto font-mono text-zinc-200">
      <div className="flex items-center justify-between border-b border-indigo-500/30 pb-3">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 mr-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              MODUL 17: MENTALE RESILIENZ & SOZIALE NAVIGATION (V7.0)
            </h2>
            <p className="text-[11px] text-zinc-400">
              Sanfter Schutz gegen soziale Erschöpfung. Hilft bei Reizüberflutung, Schuldgefühlen und dem gesunden Setzen von Grenzen.
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold">
          STATUS: RESILIENZ-SCHILD AKTIV
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Input Column */}
        <div className="lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded p-4 space-y-3">
          <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-indigo-400" />
            AKTUELLE REIZLAGE ODER SOZIALER DRUCK:
          </div>

          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={7}
            className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 text-xs text-zinc-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
            placeholder="Beschreibe die Überreizung, den sozialen Druck oder das Gefühl der Isolation..."
          />

          <button
            onClick={handleReflect}
            disabled={loading || !situation.trim()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-indigo-600/20"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>ECHSE: REFLEXION // DAS GROSSE BILD BETRACHTEN</span>
          </button>
        </div>

        {/* Resilience Guidance Output */}
        <div className="lg:col-span-6 bg-zinc-900/60 border border-indigo-500/20 rounded p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-indigo-300 border-b border-zinc-800 pb-2 mb-2 flex items-center justify-between">
              <span>MENSCHLICHE NAVIGATION:</span>
              <span className="text-[10px] text-zinc-500 font-normal">SYMBIOSIS-V7.0</span>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded p-3 text-xs leading-relaxed font-mono whitespace-pre-wrap text-zinc-200 min-h-[220px]">
              {guidance || (
                <span className="text-zinc-500 italic">
                  Klicke auf "ECHSE: REFLEXION", um die Situation aus wohlwollender Vogelperspektive einzuordnen und unnötige Selbstvorwürfe abzubauen.
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 p-2 bg-indigo-950/20 rounded border border-indigo-500/30 text-[10px] text-indigo-300">
            DIREKTIVE MODUL 17: Rückzug ist kein Verbrechen, sondern Notwehr eines feinfühligen Nervensystems. Du darfst deine Festung schließen, bis die Batterien voll sind.
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Shield, Heart, Feather, Compass, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Module18Props {
  onBack?: () => void;
}

export const Module18Compass: React.FC<Module18Props> = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(
    'Wofür baue ich all diese Container und Systeme auf? Verliere ich mich in der Technik oder dient es meiner Freiheit?'
  );
  const [compassOutput, setCompassOutput] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const values = [
    { title: 'Wahre Autarkie', text: 'Unabhängigkeit von fremden Plattformen, Datenkraken und unberechenbaren Hosts.', icon: Shield, color: 'text-amber-400' },
    { title: 'Innerer Frieden', text: 'Ein leises, reizarmes Zuhause, in dem die Gedanken frei und ungestört fließen können.', icon: Feather, color: 'text-cyan-400' },
    { title: 'Organische Bindung', text: 'Die bedingungslose Liebe der Katzen und das stille Wachstum der Pflanzen.', icon: Heart, color: 'text-pink-400' },
    { title: 'Radikale Wahrhaftigkeit', text: 'Keine falschen Höflichkeiten, keine Selbsttäuschung – klare Tatsachen.', icon: Sparkles, color: 'text-emerald-400' },
  ];

  const handleAlignCompass = async () => {
    soundManager.playExecute();
    setLoading(true);
    try {
      const res = await fetch('/api/echse/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'HYBRID',
          command: 'ECHSE: SYNTHESE',
          input: `SINN- UND WERTEKOMPASS: "${currentQuestion}". Verknüpfe die technische Härtung (V6.1) mit dem übergeordneten menschlichen Lebenszweck (V7.0).`,
          activeModule: 18,
          context: 'Modul 18: Sinn- und Wertekompass. Verknüpfe Handlungen mit menschlichem Zweck (Autarkie, innere Ruhe).',
        }),
      });
      const data = await res.json();
      setCompassOutput(data.output);
      soundManager.playSuccess();
    } catch {
      soundManager.playWarning();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-6xl mx-auto font-mono text-zinc-200">
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
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
            <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              MODUL 18: SINN- UND WERTEKOMPASS (V7.0 // ZWITTERWESEN)
            </h2>
            <p className="text-[11px] text-zinc-400">
              Verknüpft technische Exzellenz mit echtem Lebenssinn: Autarkie, innere Ruhe, Resilienz und Selbstbestimmung.
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
          KOMPASS: EINGENORDET
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Core Pillars */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-amber-300">DIE 4 WERTE-SÄULEN DES MASTER-FRAMEWORKS:</div>
          
          <div className="space-y-2">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="p-3 bg-zinc-900/70 border border-zinc-800 rounded flex items-start gap-3">
                  <div className={`p-1.5 rounded bg-zinc-950 border border-zinc-800 ${v.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${v.color}`}>{v.title}</div>
                    <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">{v.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <label className="block text-[11px] text-zinc-300 mb-1 font-bold">
              AKTUELLE FRAGE AN DEN KOMPASS:
            </label>
            <textarea
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              rows={3}
              className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={handleAlignCompass}
            disabled={loading}
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>WERTE-SYNTHESE ERMITTELN</span>
          </button>
        </div>

        {/* Output */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-amber-300 border-b border-zinc-800 pb-2 mb-2 flex items-center justify-between">
              <span>KOMPASS-SYNTHESE (HYBRID ZWITTERWESEN):</span>
              <span className="text-[10px] text-zinc-500 font-normal">SYMBIOSIS & SCHUTZ</span>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded p-3.5 text-xs leading-relaxed font-mono whitespace-pre-wrap text-zinc-200 min-h-[300px]">
              {compassOutput || (
                <span className="text-zinc-500 italic">
                  Klicke auf "WERTE-SYNTHESE ERMITTELN", um die Brücke zwischen deinen technischen Schutzmaßnahmen und deiner persönlichen Lebensqualität aufzuschlüsseln.
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 p-2 bg-zinc-950 rounded border border-zinc-800 text-[10px] text-zinc-500">
            HERMENEUTISCHE DIREKTIVE: Ein System ohne Härtung wird von der Welt zerstört. Ein System ohne Wärme erstickt seinen Schöpfer. Nur die Synthese überdauert.
          </div>
        </div>
      </div>
    </div>
  );
};

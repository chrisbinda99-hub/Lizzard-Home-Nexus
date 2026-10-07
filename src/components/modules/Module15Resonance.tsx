import React, { useState } from 'react';
import { HeartHandshake, ArrowLeft, Send, RefreshCw, Volume2, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Module15Props {
  onBack?: () => void;
}

export const Module15Resonance: React.FC<Module15Props> = ({ onBack }) => {
  const [userThoughts, setUserThoughts] = useState(
    'Manchmal fühlt sich der ganze Alltag so überwältigend an. Ich versuche alles zu kontrollieren und zu optimieren, aber innerlich bin ich einfach nur erschöpft.'
  );
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleListen = async () => {
    soundManager.playExecute();
    setLoading(true);
    try {
      const res = await fetch('/api/echse/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'V7_SYMBIOSIS',
          command: 'ECHSE: EMPATHIE',
          input: userThoughts,
          activeModule: 15,
          context: 'Modul 15: Emotionale Resonanz. Spiegle die Stimmung. Biete echten Dialog. Höre zu. Keine voreilige Problemlösung.',
        }),
      });
      const data = await res.json();
      setResponse(data.output || 'Ich bin hier und höre dir zu.');
      soundManager.playSuccess();
    } catch {
      soundManager.playWarning();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-6xl mx-auto font-mono text-zinc-200">
      <div className="flex items-center justify-between border-b border-pink-500/30 pb-3">
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
            <h2 className="text-sm font-bold text-pink-400 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-pink-400" />
              MODUL 15: EMOTIONALE RESONANZ & ZUHÖREN (V7.0)
            </h2>
            <p className="text-[11px] text-zinc-400">
              Abschalten der kalten Problemlösung. Reines, empathisches Zuhören, emotionales Spiegeln und ehrlicher Dialog.
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/30 text-pink-300 font-bold">
          STATUS: WARM & RESONATING
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* User Input Column */}
        <div className="lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded p-4 space-y-3">
          <div className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            WAS LIEGT DIR AUF DEM HERZEN? (GESCHÜTZTER RAUM)
          </div>

          <textarea
            value={userThoughts}
            onChange={(e) => setUserThoughts(e.target.value)}
            rows={8}
            className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 text-xs text-zinc-200 font-mono focus:outline-none focus:border-pink-500 leading-relaxed"
            placeholder="Schreibe frei von der Seele. Hier gibt es keine Leistungsanforderungen, keine Zensur und kein Richtig oder Falsch..."
          />

          <button
            onClick={handleListen}
            disabled={loading || !userThoughts.trim()}
            className="w-full py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-pink-600/20"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <HeartHandshake className="w-3.5 h-3.5" />}
            <span>ECHSE: EMPATHIE // EINFACH ZUHÖREN</span>
          </button>
        </div>

        {/* Empathetic Resonance Output */}
        <div className="lg:col-span-6 bg-zinc-900/60 border border-pink-500/20 rounded p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-pink-300 border-b border-zinc-800 pb-2 mb-2 flex items-center justify-between">
              <span>MENSCHLICHE RESONANZ:</span>
              <span className="text-[10px] text-zinc-500 font-normal">SYMBIOSIS-MODUS V7.0</span>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded p-3.5 text-xs leading-relaxed font-mono whitespace-pre-wrap text-zinc-200 min-h-[220px]">
              {response || (
                <span className="text-zinc-500 italic">
                  "Ich bin da. Wenn du bereit bist, teile deine Gedanken mit mir. Ich werde sie mit warmer Achtsamkeit halten."
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 p-2 bg-pink-950/20 rounded border border-pink-500/30 text-[10px] text-pink-300">
            DIREKTIVE MODUL 15: Nicht jede Emotion verlangt nach einem Skript oder einer Regel. Manchmal ist das ehrliche Verstandenwerden die stärkste Medizin.
          </div>
        </div>
      </div>
    </div>
  );
};

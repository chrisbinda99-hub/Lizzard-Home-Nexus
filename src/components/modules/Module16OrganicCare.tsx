import React, { useState, useEffect } from 'react';
import { Coffee, Cat, Sprout, Sparkles, ArrowLeft, Check, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { RitualItem } from '../../types/echse';
import { soundManager } from '../../utils/audio';

interface Module16Props {
  onBack?: () => void;
  rituals?: RitualItem[];
  onUpdateRituals?: (rituals: RitualItem[]) => void;
  petName?: string;
}

const DEFAULT_RITUALS: RitualItem[] = [
  { id: 'R1', title: 'Achtsame Tier- & Begleiterpflege', desc: 'Den Tieren Zeit schenken, ihre Zuneigung als Herzerdung spüren.', done: true, tag: 'Tiere' },
  { id: 'R2', title: 'Frische, warme Mahlzeit zubereiten', desc: 'Kein Fastfood am Schreibtisch; bewusste Nahrung für den Körper.', done: false, tag: 'Nahrung' },
  { id: 'R3', title: 'Pflanzen & Natur betrachten', desc: 'Nicht nur messen, sondern das Grün und den Duft der Natur erleben.', done: true, tag: 'Botanik' },
  { id: 'R4', title: 'Arbeitsplatz & Umgebung klären', desc: 'Geschirr abräumen, Schreibtisch lüften. Äußere Ordnung stiftet inneren Frieden.', done: false, tag: 'Raum' },
  { id: 'R5', title: '15 Minuten Stille ohne Bildschirme', desc: 'Den Kopf entlasten, tief atmen, das Hier und Jetzt spüren.', done: false, tag: 'Geist' }
];

export const Module16OrganicCare: React.FC<Module16Props> = ({ 
  onBack,
  rituals: propRituals,
  onUpdateRituals,
  petName = 'Begleiter'
}) => {
  const [internalRituals, setInternalRituals] = useState<RitualItem[]>(propRituals || DEFAULT_RITUALS);

  useEffect(() => {
    if (propRituals) {
      setInternalRituals(propRituals);
    }
  }, [propRituals]);

  const rituals = propRituals || internalRituals;

  const updateRituals = (newRituals: RitualItem[]) => {
    setInternalRituals(newRituals);
    if (onUpdateRituals) {
      onUpdateRituals(newRituals);
    }
  };

  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('Alltag');

  const toggleRitual = (id: string) => {
    soundManager.playClick();
    updateRituals(rituals.map(r => r.id === id ? { ...r, done: !r.done } : r));
  };

  const handleAddRitual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    soundManager.playSuccess();
    const newItem: RitualItem = {
      id: `R-${Date.now()}`,
      title: newTitle.trim(),
      desc: 'Eigenes tägliches Erdungs-Ritual.',
      done: false,
      tag: newTag,
    };
    updateRituals([...rituals, newItem]);
    setNewTitle('');
  };

  const handleDeleteRitual = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    updateRituals(rituals.filter(r => r.id !== id));
  };

  const handleBalanceCheck = async () => {
    soundManager.playExecute();
    setLoading(true);
    try {
      const res = await fetch('/api/echse/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'V7_SYMBIOSIS',
          command: 'ECHSE: BALANCE',
          input: `Tägliche Fürsorge-Rituale Status: ${rituals.map(r => `${r.title}: ${r.done ? 'Erfüllt' : 'Offen'}`).join(', ')}`,
          activeModule: 16,
          context: 'Modul 16: Organische Fürsorge. Werte tägliche Pflege von Begleitern, Mahlzeiten oder Pflanzen als essenziell und sinnstiftend.',
        }),
      });
      const data = await res.json();
      setAiAnalysis(data.output);
      soundManager.playSuccess();
    } catch {
      soundManager.playWarning();
    } finally {
      setLoading(false);
    }
  };

  const completedCount = rituals.filter(r => r.done).length;

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
              <Coffee className="w-4 h-4 text-amber-400" />
              MODUL 16: ORGANISCHE FÜRSORGE & GELEBTE ORDNUNG (V7.0)
            </h2>
            <p className="text-[11px] text-zinc-400">
              Pflege von {petName}, Mahlzeiten und Pflanzen als sinnstiftende Seelen-Anker. Ordnung im Raum schafft Ruhe im Geist.
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
          RITUALE: {completedCount}/{rituals.length} VOLLBRACHT
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Daily Rituals List */}
        <div className="lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded p-4 space-y-3">
          <div className="text-xs font-bold text-amber-300 flex items-center justify-between">
            <span>TÄGLICHE ERDUNGS-RITUALE:</span>
            <span className="text-[10px] text-zinc-500 font-normal">Klicke zum Abhaken</span>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {rituals.map((r) => (
              <div
                key={r.id}
                onClick={() => toggleRitual(r.id)}
                className={`p-3 rounded border cursor-pointer transition-all flex items-start gap-3 ${
                  r.done
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-zinc-200'
                    : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                  r.done ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-zinc-700 bg-zinc-900'
                }`}>
                  {r.done && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${r.done ? 'text-emerald-300' : 'text-zinc-200'}`}>
                      {r.title}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                        {r.tag}
                      </span>
                      <button
                        onClick={(e) => handleDeleteRitual(r.id, e)}
                        className="text-zinc-600 hover:text-red-400 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add custom ritual */}
          <form onSubmit={handleAddRitual} className="flex gap-1.5 text-xs pt-1 border-t border-zinc-800">
            <input
              type="text"
              placeholder="Eigenes Ritual (z. B. Spaziergang im Wald)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-xs text-zinc-200"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-bold text-xs"
            >
              Hinzufügen
            </button>
          </form>

          <button
            onClick={handleBalanceCheck}
            disabled={loading}
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>ECHSE: BALANCE // LEBENS-BALANCE ANALYSIEREN</span>
          </button>
        </div>

        {/* Holistic Balance Feedback */}
        <div className="lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-amber-300 border-b border-zinc-800 pb-2 mb-2 flex items-center justify-between">
              <span>ORGANISCHE REFLEXION:</span>
              <span className="text-[10px] text-zinc-500 font-normal">SYMBIOSIS-BALANCE</span>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded p-3 text-xs leading-relaxed font-mono whitespace-pre-wrap text-zinc-200 min-h-[220px]">
              {aiAnalysis || (
                <span className="text-zinc-500 italic">
                  Klicke auf "LEBENS-BALANCE ANALYSIEREN", um zu prüfen, ob dein Alltag zu stark in technische Verkopftheit abdriftet oder ob du im gesunden organischen Rhythmus lebst.
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 p-2 bg-amber-950/20 rounded border border-amber-500/30 text-[10px] text-amber-300">
            DIREKTIVE MODUL 16: Die tägliche Fürsorge nährt die biologische Basis. Sie ist keine Unterbrechung der Arbeit, sondern deren einziger Sinn.
          </div>
        </div>
      </div>
    </div>
  );
};

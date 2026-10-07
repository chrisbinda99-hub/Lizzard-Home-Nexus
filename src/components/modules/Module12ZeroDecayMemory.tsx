import React, { useState, useEffect } from 'react';
import { Database, Plus, Trash2, Search, ArrowLeft, RefreshCw, CheckCircle2, Download } from 'lucide-react';
import { FactItem } from '../../types/echse';
import { soundManager } from '../../utils/audio';

interface Module12Props {
  onBack?: () => void;
  facts?: FactItem[];
  onUpdateFacts?: (facts: FactItem[]) => void;
  profileName?: string;
}

export const Module12ZeroDecayMemory: React.FC<Module12Props> = ({ 
  onBack,
  facts: propFacts,
  onUpdateFacts,
  profileName = 'Benutzer'
}) => {
  const [internalFacts, setInternalFacts] = useState<FactItem[]>(propFacts || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [newFactText, setNewFactText] = useState('');
  const [newFactCat, setNewFactCat] = useState('SYSTEM');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propFacts) {
      setInternalFacts(propFacts);
    }
  }, [propFacts]);

  const facts = propFacts || internalFacts;

  const updateFacts = (newFacts: FactItem[]) => {
    setInternalFacts(newFacts);
    if (onUpdateFacts) {
      onUpdateFacts(newFacts);
    }
  };

  const handleAddFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactText.trim()) return;
    soundManager.playExecute();
    setLoading(true);
    
    const newFact: FactItem = {
      id: `F-${String(facts.length + 1).padStart(3, '0')}`,
      category: newFactCat,
      fact: newFactText.trim(),
      timestamp: new Date().toISOString().split('T')[0],
    };

    updateFacts([newFact, ...facts]);
    setNewFactText('');
    setLoading(false);
    soundManager.playSuccess();
  };

  const handleDeleteFact = (id: string) => {
    soundManager.playClick();
    updateFacts(facts.filter(f => f.id !== id));
  };

  const handleExportFacts = () => {
    soundManager.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(facts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `echse_zero_decay_facts_${profileName.toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredFacts = facts.filter(f => 
    f.fact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 max-w-6xl mx-auto font-mono text-zinc-200">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
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
              <Database className="w-4 h-4 text-indigo-400" />
              MODUL 12: ZERO-DECAY MEMORY ({profileName.toUpperCase()})
            </h2>
            <p className="text-[11px] text-zinc-500">
              Unvergänglicher Wissensspeicher für {profileName}. Verwirft Rauschen, sichert Axiome und System-Wahrheiten.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportFacts}
            className="text-[10px] px-2 py-1 rounded bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 flex items-center gap-1"
            title="Fakten als JSON exportieren"
          >
            <Download className="w-3 h-3" />
            <span>Fakten exportieren</span>
          </button>
          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold">
            {facts.length} AXIOME GESICHERT
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Add Fact Form */}
        <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800 rounded p-4 space-y-3">
          <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            NEUES AXIOM / FAKT FIXIEREN
          </div>

          <form onSubmit={handleAddFact} className="space-y-3">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">KATEGORIE:</label>
              <select
                value={newFactCat}
                onChange={(e) => setNewFactCat(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="SYSTEM">SYSTEM & ISOLATION</option>
                <option value="BOTANIK">BOTANIK & ERDUNG</option>
                <option value="HARDWARE-INTERRUPT">HARDWARE-INTERRUPTS</option>
                <option value="BUDGET">BUDGET & VERTRÄGE</option>
                <option value="PSYCHOLOGIE">PSYCHOLOGIE & REGELN</option>
                <option value="SYMBIOSIS">SYMBIOSIS & SINN</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">VERIFIZIERTE TATSACHE (AXIOM):</label>
              <textarea
                value={newFactText}
                onChange={(e) => setNewFactText(e.target.value)}
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
                placeholder="Exakte Formulierung ohne Konjunktiv oder Meinung..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !newFactText.trim()}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>IM ZERO-DECAY SPEICHER FIXIEREN</span>
            </button>
          </form>
        </div>

        {/* Fact Vault List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Faktenspeicher durchsuchen..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto">
            {filteredFacts.length === 0 ? (
              <div className="p-8 text-center border border-zinc-800 rounded bg-zinc-900/40 text-zinc-500 text-xs space-y-1">
                <div className="font-bold text-zinc-400">Keine Fakten hinterlegt</div>
                <div>Nutze das Formular links, um unvergängliche Regeln, Verträge oder Erkenntnisse festzuhalten.</div>
              </div>
            ) : (
              filteredFacts.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded bg-zinc-900/60 border border-zinc-800/80 hover:border-indigo-500/40 transition-colors flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-[10px]">
                      <span className="font-bold text-indigo-400">{item.id}</span>
                      <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {item.category}
                      </span>
                      <span className="text-zinc-600">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-zinc-200 leading-relaxed font-mono">
                      {item.fact}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteFact(item.id)}
                    className="p-1 text-zinc-600 hover:text-red-400 transition-colors shrink-0"
                    title="Löschen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

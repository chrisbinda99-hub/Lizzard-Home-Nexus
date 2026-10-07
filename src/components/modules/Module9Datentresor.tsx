import React, { useState } from 'react';
import { 
  Database, 
  ArrowLeft, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Search,
  HardDrive
} from 'lucide-react';
import { FactItem, UserProfileData } from '../../types/echse';
import { soundManager } from '../../utils/audio';

interface Module9Props {
  onBack?: () => void;
  currentProfile: UserProfileData;
  onUpdateProfile?: (updated: UserProfileData) => void;
}

export const Module9Datentresor: React.FC<Module9Props> = ({ 
  onBack, 
  currentProfile,
  onUpdateProfile 
}) => {
  const [facts, setFacts] = useState<FactItem[]>(currentProfile.facts || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategory, setNewCategory] = useState('ALLGEMEIN');
  const [newFact, setNewFact] = useState('');
  const [exportNotice, setExportNotice] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  const updateFacts = (newFacts: FactItem[]) => {
    setFacts(newFacts);
    if (onUpdateProfile) {
      onUpdateProfile({ ...currentProfile, facts: newFacts });
    }
  };

  const handleAddFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFact.trim()) return;

    soundManager.playClick();
    const item: FactItem = {
      id: `F-${Date.now()}`,
      category: newCategory.toUpperCase(),
      fact: newFact.trim(),
      timestamp: new Date().toISOString().split('T')[0]
    };
    updateFacts([item, ...facts]);
    setNewFact('');
  };

  const handleRemoveFact = (id: string) => {
    soundManager.playWarning();
    updateFacts(facts.filter(f => f.id !== id));
  };

  const handleExportJSON = () => {
    soundManager.playExecute();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentProfile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `echse_os_backup_${currentProfile.id}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.userName && onUpdateProfile) {
          soundManager.playExecute();
          onUpdateProfile(parsed);
          setFacts(parsed.facts || []);
          setImportNotice('Backup erfolgreich und unbeschädigt importiert!');
          setTimeout(() => setImportNotice(null), 4000);
        }
      } catch (err) {
        setImportNotice('Fehler beim Lesen der JSON-Backup-Datei.');
        setTimeout(() => setImportNotice(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const filteredFacts = facts.filter(f => 
    f.fact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                MODUL 9 // SOUVERÄNITÄT & AUTARKIE
              </span>
              <span className="text-zinc-500 text-xs">ZERO-DECAY VAULT</span>
            </div>
            <h1 className="text-lg font-bold text-amber-300">
              Zero-Decay Datentresor & Autarkie
            </h1>
          </div>
        </div>

        {/* 1-Click Backup / Import Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded text-xs flex items-center gap-1.5 shadow transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>1-KLICK DATEN-BACKUP</span>
          </button>

          <label className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded text-xs flex items-center gap-1.5 border border-zinc-700 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>RESTORE</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded text-xs text-emerald-300 flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Vollständiges Backup aller Systemdaten, Verträge, Notizen und Kaufgatter-Einträge als JSON gesichert!</span>
        </div>
      )}

      {/* Main Grid: Fact Vault & Local Privacy Shield */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Fact Adder & Categories (1 Col) */}
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>UNVERGÄNGLICHES FAKTEN-ARCHIV</span>
            </h3>
            <span className="text-[10px] text-zinc-500">Zero Decay</span>
          </div>

          <form onSubmit={handleAddFact} className="space-y-3">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Kategorie:</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-200 outline-none"
              >
                <option value="SYSTEM">SYSTEM / INFRASTRUKTUR</option>
                <option value="BOTANIK">BOTANIK & KLIMA</option>
                <option value="BUDGET">BUDGET & FINANZEN</option>
                <option value="RECHT">RECHT & VERTRÄGE</option>
                <option value="GESUNDHEIT">GESUNDHEIT & TIERE</option>
                <option value="ALLGEMEIN">ALLGEMEIN</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Fakt / Wichtige Erkenntnis:</label>
              <textarea
                rows={3}
                placeholder="z.B. VPD-Sollwert in Blütephase ist 1.25 kPa; Katzen-Futter Prio 1..."
                value={newFact}
                onChange={(e) => setNewFact(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-zinc-200 outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>FAKT IM TRESOR ARRETIEREN</span>
            </button>
          </form>

          {/* Privacy Guarantee Card */}
          <div className="p-3 bg-zinc-950 rounded border border-emerald-500/30 space-y-2 text-xs">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>100% LOKALE SOUVERÄNITÄT</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Deine Daten verlassen niemals deine lokale Maschine. Kein Tracking, keine Telemetrie, keine monatlichen Cloud-Abo-Gebühren.
            </p>
          </div>
        </div>

        {/* Right Column: Search & Facts List (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-zinc-400" />
              <span>GESPEICHERTE SYSTEM-FAKTEN ({facts.length})</span>
            </h3>

            {/* Search */}
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 w-52">
              <Search className="w-3.5 h-3.5 text-zinc-500 mr-1.5" />
              <input
                type="text"
                placeholder="Fakten durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none w-full text-xs"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {filteredFacts.map((f) => (
              <div key={f.id} className="p-3 bg-zinc-900/60 border border-zinc-800 rounded flex items-start justify-between gap-3 hover:border-zinc-700 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-amber-400 border border-zinc-700 font-bold">
                      {f.category}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">{f.timestamp}</span>
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed">{f.fact}</p>
                </div>
                <button
                  onClick={() => handleRemoveFact(f.id)}
                  className="p-1 text-zinc-600 hover:text-red-400 transition-colors"
                  title="Fakt löschen"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

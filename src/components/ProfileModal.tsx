import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  X, 
  Check, 
  RotateCcw, 
  Download, 
  Upload, 
  ShieldCheck, 
  HeartHandshake,
  Layers,
  Cat,
  Sprout,
  Save
} from 'lucide-react';
import { UserProfileData, ProfileType } from '../types/echse';
import { soundManager } from '../utils/audio';

interface ProfileModalProps {
  currentProfile: UserProfileData;
  activeProfileType: ProfileType;
  onSelectProfileType: (type: ProfileType) => void;
  onUpdateProfile: (updated: UserProfileData) => void;
  onResetProfile: () => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  currentProfile,
  activeProfileType,
  onSelectProfileType,
  onUpdateProfile,
  onResetProfile,
  onClose
}) => {
  const [editName, setEditName] = useState(currentProfile.userName);
  const [editPetName, setEditPetName] = useState(currentProfile.petName);
  const [editBotanyName, setEditBotanyName] = useState(currentProfile.botanyName);
  const [editBudgetLimit, setEditBudgetLimit] = useState(currentProfile.monthlyBudgetLimit);
  const [editNotes, setEditNotes] = useState(currentProfile.systemNotes);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSuccess();
    const updated: UserProfileData = {
      ...currentProfile,
      userName: editName.trim() || 'Benutzer',
      petName: editPetName.trim() || 'Keine Begleiter definiert',
      botanyName: editBotanyName.trim() || 'Allgemeine Botanik',
      monthlyBudgetLimit: Number(editBudgetLimit) || 0,
      systemNotes: editNotes.trim(),
      isConfigured: true,
    };
    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportJson = () => {
    soundManager.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentProfile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `echse_profile_${currentProfile.id}_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.id) {
            soundManager.playSuccess();
            onUpdateProfile(parsed);
            setEditName(parsed.userName || '');
            setEditPetName(parsed.petName || '');
            setEditBotanyName(parsed.botanyName || '');
            setEditBudgetLimit(parsed.monthlyBudgetLimit || 0);
            setEditNotes(parsed.systemNotes || '');
          }
        } catch {
          soundManager.playWarning();
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
      <div className="bg-zinc-950 border border-amber-500/40 rounded-lg max-w-2xl w-full p-5 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-amber-300">
                EBENEN- & PROFIL-STEUERUNG
              </h2>
              <p className="text-[11px] text-zinc-400">
                Wähle die Betriebsebene: Starte mit deinen persönlichen Daten oder jungfräulich ohne Vorabinformationen.
              </p>
            </div>
          </div>
          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="p-1 text-zinc-500 hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 Selectable Levels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Level 1: Chris */}
          <div
            onClick={() => {
              soundManager.playClick();
              onSelectProfileType('master_chris');
            }}
            className={`p-3.5 rounded border cursor-pointer transition-all ${
              activeProfileType === 'master_chris'
                ? 'border-amber-400 bg-amber-950/20 shadow-md shadow-amber-500/10'
                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>EBENE 1: CHRIS (MASTER)</span>
              </div>
              {activeProfileType === 'master_chris' && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500 text-black font-bold">
                  AKTIV
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Startet mit deinen vertrauten Systemdaten: Deine Katzen als Prio-1 Hardware-Interrupt, das Grow-Zelt (VPD 1.18), deine Fixkosten, Verträge und der Zero-Decay Faktenspeicher.
            </p>
          </div>

          {/* Level 2: Clean Slate */}
          <div
            onClick={() => {
              soundManager.playClick();
              onSelectProfileType('clean_slate');
            }}
            className={`p-3.5 rounded border cursor-pointer transition-all ${
              activeProfileType === 'clean_slate'
                ? 'border-cyan-400 bg-cyan-950/20 shadow-md shadow-cyan-500/10'
                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-400">
                <Sparkles className="w-4 h-4" />
                <span>EBENE 2: NEUER BENUTZER</span>
              </div>
              {activeProfileType === 'clean_slate' && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500 text-black font-bold">
                  AKTIV
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Startet 100% jungfräulich ohne Vorabinformationen im System. Keine Vordaten, leere Speicher. Ermöglicht jedem neuen Menschen, ein eigenes maßgeschneidertes System aufzubauen.
            </p>
          </div>
        </div>

        {/* Configuration Form for Active Profile */}
        <form onSubmit={handleSave} className="p-3.5 rounded bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="text-xs font-bold text-zinc-200 border-b border-zinc-800 pb-1.5 flex items-center justify-between">
            <span>PARAMETER DER AKTIVEN EBENE [{currentProfile.id.toUpperCase()}]:</span>
            <span className="text-[10px] text-zinc-400 font-normal">Individuell bearbeitbar</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">BENUTZER-NAME:</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">PRIMÄRE HARDWARE-INTERRUPTS (HAUSTIERE / BEGLEITER):</label>
              <input
                type="text"
                value={editPetName}
                onChange={(e) => setEditPetName(e.target.value)}
                placeholder="z. B. Katzen, Hund, keine..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">GÄRTNEREI & PRECISION AGRO-TECH (PFLANZEN-ANKER):</label>
              <input
                type="text"
                value={editBotanyName}
                onChange={(e) => setEditBotanyName(e.target.value)}
                placeholder="z. B. Smart Gärtnerei, Grow-Zelt, Balkon-Permakultur, Zimmerpflanzen..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">MONATLICHES DISZIPLIN-BUDGETLIMIT (€):</label>
              <input
                type="number"
                value={editBudgetLimit}
                onChange={(e) => setEditBudgetLimit(Number(e.target.value))}
                placeholder="500"
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">SYSTEM-NOTIZ / LEITMOTIV:</label>
            <input
              type="text"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="z. B. Autarkie, Ruhe, saubere IT..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded flex items-center gap-1.5 transition-colors shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savedSuccess ? 'GESPEICHERT!' : 'PROFILPARAMETER AKTUALISIEREN'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Möchtest du diese Ebene wirklich auf die Werkseinstellung zurücksetzen?')) {
                  soundManager.playWarning();
                  onResetProfile();
                }
              }}
              className="px-2.5 py-1.5 text-zinc-500 hover:text-red-400 text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Auf Standard zurücksetzen</span>
            </button>
          </div>
        </form>

        {/* Data Backup & Migration */}
        <div className="flex items-center justify-between border-t border-zinc-800 pt-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 flex items-center gap-1 text-[11px]"
            >
              <Download className="w-3 h-3" />
              <span>Backup herunterladen (JSON)</span>
            </button>

            <label className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 flex items-center gap-1 text-[11px] cursor-pointer">
              <Upload className="w-3 h-3" />
              <span>Backup einspielen</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>

          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-bold text-[11px]"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

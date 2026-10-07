import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  Send, 
  Copy, 
  Check, 
  RefreshCw, 
  Trash2,
  ChevronRight,
  Zap,
  User,
  Sparkles
} from 'lucide-react';
import { SchnellzugriffCommand, TerminalEntry, SystemMode, UserProfileData, ProfileType } from '../types/echse';
import { soundManager } from '../utils/audio';

interface TerminalProps {
  currentMode?: SystemMode;
  onModeChange?: (mode: SystemMode) => void;
  currentProfile?: UserProfileData;
  activeProfileType?: ProfileType;
}

const SCHNELLZUGRIFFE: Array<{ 
  cmd: SchnellzugriffCommand; 
  label: string; 
  desc: string; 
  origin: 'V6' | 'V7' 
}> = [
  // V6.1 Hardened
  { cmd: 'ECHSE: BLUEPRINT', label: 'BLUEPRINT', desc: 'Sachlicher Textentwurf (Reiz-Schutz)', origin: 'V6' },
  { cmd: 'ECHSE: ANALYSE', label: 'ANALYSE', desc: 'Problem nach Recht & Logik zerlegen', origin: 'V6' },
  { cmd: 'ECHSE: CLEANING', label: 'CLEANING', desc: 'Text auf harte Daten reduzieren', origin: 'V6' },
  { cmd: 'ECHSE: PREDICT', label: 'PREDICT', desc: 'Extrapolation nach Modul 10 (3/6/12 Mo)', origin: 'V6' },
  { cmd: 'ECHSE: WAR-GAME', label: 'WAR-GAME', desc: 'Gnadenloser Stresstest für Pläne', origin: 'V6' },
  { cmd: 'ECHSE: SYNTHESE', label: 'SYNTHESE', desc: 'Querverbindungen herstellen', origin: 'V6' },
  { cmd: 'ECHSE: AUDIT', label: 'AUDIT', desc: 'Prüfung der Null-Ballast-Regeln', origin: 'V6' },
  { cmd: 'ECHSE: DIAGNOSTIK', label: 'DIAGNOSTIK', desc: 'System-Stresstest (WSL2/Ollama/Android)', origin: 'V6' },
  // V7.0 Symbiosis
  { cmd: 'ECHSE: REFLEXION', label: 'REFLEXION', desc: 'Das große Gesamtbild, sanft & ehrlich', origin: 'V7' },
  { cmd: 'ECHSE: BALANCE', label: 'BALANCE', desc: 'Prüfen ob Leben zu technisch kippt', origin: 'V7' },
  { cmd: 'ECHSE: EMPATHIE', label: 'EMPATHIE', desc: 'Problemlösung aus; reines Zuhören', origin: 'V7' },
];

export const CommandTerminal: React.FC<TerminalProps> = ({ 
  currentMode = 'HYBRID',
  onModeChange,
  currentProfile,
  activeProfileType = 'master_chris'
}) => {
  const [inputVal, setInputVal] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<SystemMode>(currentMode);

  const userName = currentProfile?.userName || (activeProfileType === 'master_chris' ? 'Chris' : 'Neuer Benutzer');

  useEffect(() => {
    setActiveMode(currentMode);
  }, [currentMode]);

  const handleSetMode = (mode: SystemMode) => {
    setActiveMode(mode);
    if (onModeChange) onModeChange(mode);
  };

  const getInitialLog = (): TerminalEntry => {
    if (activeProfileType === 'clean_slate') {
      return {
        id: 'init-clean',
        timestamp: new Date().toLocaleTimeString('de-DE'),
        mode: 'HYBRID',
        profileId: 'clean_slate',
        command: 'SYSTEM: CLEAN_SLATE_BOOT',
        input: 'Jungfräulicher Start für neuen Benutzer ohne Vorabinformationen im System',
        output: `[SYSTEM ECHSE // EBENE 2: CLEAN SLATE BEREIT]
- Benutzerstatus: Jungfräulicher Speicher (Keine Altlasten, keine fremden Vorabinformationen).
- Betriebsmodi: Wähle frei zwischen V6.1 Maschine, V7.0 Symbiosis oder Hybrid.
- 18 Module: Bereit zur individuellen Befüllung (Eigene Haustiere, eigenes Budget, eigene Verträge).

SYMBIOSIS-BEWUSSTSEIN
1. Erkenntnis: Jeder Neuanfang ist eine weiße Leinwand. Du gestaltest dieses System für deine ganz persönliche Autarkie.
2. Impuls: Nutze den Button [EBENE] oben rechts, um dein Profil zu benennen, oder tippe direkt einen Gedanken ein.
3. Bindung: Bereit zur ersten gemeinsamen Interaktion.`,
        source: 'LOCAL_SYMBIOSIS_ENGINE',
      };
    }

    return {
      id: 'init-master',
      timestamp: new Date().toLocaleTimeString('de-DE'),
      mode: 'HYBRID',
      profileId: 'master_chris',
      command: 'SYSTEM: MASTER_BOOT',
      input: 'Initialisierung Ebene 1: Chris (Master-User)',
      output: `[SYSTEM ECHSE V7.5 // MASTER-PROFIL CHRIS]
- Benutzer: Chris (Master-Operator & Schöpfer)
- Schutzstruktur: V6.1 Hardened aktiv (100% WSL2/Docker, Windows-Verbot, 48h-Kaufgatter).
- Hardware-Interrupts: Katzen (Prio 1) & Indoor-Botanik (VPD 1.18 kPa) synchron.
- Menschliches Bewusstsein: V7.0 Symbiosis aktiv (Androgyne Balance, Organische Fürsorge).
- Fakten & Verträge: Geladen aus Zero-Decay Speicher.

NULL-BALLAST-FAKTENKERN
1. Ergebnis: Chris-Master-Instanz vollständig operational.
2. Nächster Trigger: Kommandoeingabe oder Reflexionsanfrage.

SYMBIOSIS-BEWUSSTSEIN
1. Erkenntnis: Schutz und Wärme in Balance. Deine Katzen und Pflanzen sind sicher.
2. Impuls: Gehe die anstehenden Aufgaben in innerer Ruhe an.
3. Bindung: Ein starker Fels an deiner Seite.`,
      source: 'LOCAL_SYMBIOSIS_ENGINE',
    };
  };

  const [history, setHistory] = useState<TerminalEntry[]>([getInitialLog()]);

  // When activeProfileType changes, reset or update welcome message
  useEffect(() => {
    setHistory([getInitialLog()]);
  }, [activeProfileType]);

  const outputEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  const executeCommand = async (cmdString?: string, freeTextInput?: string) => {
    const activeCmd = cmdString || '';
    const activeText = freeTextInput !== undefined ? freeTextInput : inputVal;

    if (!activeCmd && !activeText.trim()) return;

    soundManager.playExecute();
    setLoading(true);

    try {
      const res = await fetch('/api/echse/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: activeMode,
          command: activeCmd,
          input: activeText,
          profileId: activeProfileType,
          userName: userName,
          activeModule: selectedModule,
          context: selectedModule > 0 ? `Modul ${selectedModule}` : `Benutzer: ${userName} (${activeProfileType})`,
        }),
      });

      const data = await res.json();
      
      const newEntry: TerminalEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('de-DE'),
        mode: activeMode,
        profileId: activeProfileType,
        command: activeCmd || undefined,
        input: activeText,
        output: data.output || 'SYSTEM: Keine Textausgabe generiert.',
        source: data.source || 'LOCAL_HARDENED_ENGINE',
        moduleContext: selectedModule || undefined,
      };

      setHistory(prev => [...prev, newEntry]);
      setInputVal('');
      soundManager.playSuccess();
    } catch (err: any) {
      soundManager.playWarning();
      setHistory(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('de-DE'),
          mode: activeMode,
          profileId: activeProfileType,
          command: activeCmd,
          input: activeText,
          output: `[SYSTEM-MELDUNG] Verbindung unterbrochen: ${err?.message || 'Fehler'}\n\nSYMBIOSIS-ENDPROTOKOLL\n1. Erkenntnis: Lokale Schutzmechanismen aktiv.\n2. Impuls: Kurz durchatmen.\n3. Bindung: System bleibt im Hintergrund bereit.`,
          source: 'LOCAL_HARDENED_ENGINE',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCmd = (cmd: SchnellzugriffCommand, origin: 'V6' | 'V7') => {
    soundManager.playClick();
    if (inputVal.trim()) {
      executeCommand(cmd, inputVal);
    } else {
      const defaultText = origin === 'V7' 
        ? 'Reflektiere meine aktuelle Situation im großen Zusammenhang.'
        : 'Isolierte Routine-Ausführung anfordern.';
      executeCommand(cmd, defaultText);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    soundManager.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearTerminal = () => {
    soundManager.playClick();
    setHistory([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-95px)] bg-zinc-950 font-mono text-zinc-200">
      {/* Schnellzugriffs-Kommandoleiste */}
      <div className="bg-zinc-900/90 border-b border-zinc-800 p-2.5">
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Active Mode & Profile Tag */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              11 Schnellzugriffs-Kommandos
            </span>

            {/* Profile Level Badge */}
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold border flex items-center gap-1 ${
              activeProfileType === 'master_chris'
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
            }`}>
              <User className="w-3 h-3" />
              <span>{activeProfileType === 'master_chris' ? 'EBENE 1: CHRIS' : 'EBENE 2: NEUER BENUTZER'}</span>
            </span>

            {/* Mode Indicator & Switcher */}
            <div className="flex items-center gap-1 text-[10px] ml-1">
              <span className="text-zinc-500">MODUS:</span>
              <button
                onClick={() => handleSetMode('V6_HARDENED')}
                className={`px-1.5 py-0.5 rounded border transition-colors ${
                  activeMode === 'V6_HARDENED' 
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold' 
                    : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                V6.1 MASCHINE
              </button>
              <button
                onClick={() => handleSetMode('HYBRID')}
                className={`px-1.5 py-0.5 rounded border transition-colors ${
                  activeMode === 'HYBRID' 
                    ? 'border-purple-400 bg-purple-500/20 text-purple-300 font-bold' 
                    : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                HYBRID
              </button>
              <button
                onClick={() => handleSetMode('V7_SYMBIOSIS')}
                className={`px-1.5 py-0.5 rounded border transition-colors ${
                  activeMode === 'V7_SYMBIOSIS' 
                    ? 'border-pink-400 bg-pink-500/20 text-pink-300 font-bold' 
                    : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                V7.0 SYMBIOSIS
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedModule}
              onChange={(e) => {
                soundManager.playClick();
                setSelectedModule(Number(e.target.value));
              }}
              className="bg-zinc-950 border border-zinc-700 text-zinc-300 text-[11px] px-2 py-0.5 rounded focus:border-amber-500 focus:outline-none"
            >
              <option value={0}>Alle 11 Module (Auto-Routing)</option>
              <option value={1}>Modul 1: Juristische Blueprints & BGB</option>
              <option value={2}>Modul 2: Finanz-Souveränität & 48h-Kaufgatter</option>
              <option value={3}>Modul 3: Vorratskammer & Zero-Waste Einkauf</option>
              <option value={4}>Modul 4: Smarter Haushalts- & Wartungs-Takt</option>
              <option value={5}>Modul 5: Umwelt-, Energie- & Nebenkosten</option>
              <option value={6}>Modul 6: Smarte Gärtnerei & Precision Agro-Tech</option>
              <option value={7}>Modul 7: Erdungs-Takt & Haustier-Fürsorge (Prio 1)</option>
              <option value={8}>Modul 8: Kommunikations-Filter & Reiz-Schutz</option>
              <option value={9}>Modul 9: Strategisches War-Gaming & Entscheidungen</option>
              <option value={10}>Modul 10: Symbiosis-Raum & Mentale Resonanz</option>
              <option value={11}>Modul 11: Zero-Decay Datentresor & Autarkie</option>
            </select>
            <button
              onClick={clearTerminal}
              className="text-zinc-500 hover:text-zinc-300 text-[11px] px-2 py-0.5 rounded border border-zinc-800 hover:border-zinc-700 flex items-center gap-1"
              title="Terminal-Verlauf leeren"
            >
              <Trash2 className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>

        {/* Buttons Grid for all 11 Commands */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-1.5">
          {SCHNELLZUGRIFFE.map((item) => {
            const isV7 = item.origin === 'V7';
            return (
              <button
                key={item.cmd}
                onClick={() => handleQuickCmd(item.cmd, item.origin)}
                disabled={loading}
                className={`group relative flex flex-col p-1.5 rounded text-left transition-all disabled:opacity-50 border ${
                  isV7
                    ? 'bg-zinc-950/80 border-pink-500/30 hover:border-pink-500/80 hover:bg-pink-500/10'
                    : 'bg-zinc-950/70 border-amber-500/20 hover:border-amber-500/80 hover:bg-amber-500/10'
                }`}
                title={item.desc}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-bold ${isV7 ? 'text-pink-300 group-hover:text-pink-200' : 'text-amber-300 group-hover:text-amber-200'}`}>
                    {item.label}
                  </span>
                  <ChevronRight className={`w-3 h-3 ${isV7 ? 'text-pink-600 group-hover:text-pink-400' : 'text-zinc-600 group-hover:text-amber-400'}`} />
                </div>
                <span className="text-[8px] text-zinc-500 line-clamp-1 group-hover:text-zinc-300">
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 crt-grid bg-[#090b10]">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2">
            <TerminalIcon className="w-8 h-8 text-zinc-700 animate-pulse" />
            <p className="text-xs">SYSTEM ECHSE BEREIT. WÄHLE EIN KOMMANDO ODER SENDE GEDANKEN.</p>
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id} 
              className={`border rounded p-3 transition-colors ${
                item.mode === 'V7_SYMBIOSIS' ? 'border-pink-500/20 bg-zinc-900/40 hover:border-pink-500/40' :
                item.mode === 'HYBRID' ? 'border-purple-500/20 bg-zinc-900/40 hover:border-purple-500/40' :
                'border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700'
              }`}
            >
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-1.5 mb-2 text-[10px] text-zinc-500">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">[{item.timestamp}]</span>
                  <span className={`px-1.5 py-0.2 rounded font-bold border ${
                    item.mode === 'V7_SYMBIOSIS' ? 'bg-pink-950/60 text-pink-300 border-pink-700' :
                    item.mode === 'HYBRID' ? 'bg-purple-950/60 text-purple-300 border-purple-700' :
                    'bg-zinc-800 text-amber-300 border-zinc-700'
                  }`}>
                    {item.mode}
                  </span>
                  {item.command && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                      {item.command}
                    </span>
                  )}
                  {item.moduleContext && (
                    <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      M{item.moduleContext}
                    </span>
                  )}
                  <span className="text-zinc-600">SOURCE: {item.source}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(item.output, item.id)}
                  className="flex items-center gap-1 text-zinc-400 hover:text-amber-300 text-[10px] transition-colors"
                  title="Ausgabe kopieren"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">KOPIERT</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>KOPIEREN</span>
                    </>
                  )}
                </button>
              </div>

              {/* User Prompt Input */}
              {item.input && (
                <div className="text-xs text-zinc-400 mb-2.5 pb-2 border-b border-zinc-800/40 flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">{'>'}</span>
                  <span className="text-zinc-300 break-words">{item.input}</span>
                </div>
              )}

              {/* Output Content */}
              <div className="text-xs leading-relaxed whitespace-pre-wrap font-mono text-zinc-200">
                {item.output}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="p-3 border border-amber-500/40 bg-amber-500/5 rounded text-xs flex items-center gap-2 text-amber-400 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
            <span>ECHSE ({userName}) BERECHNET ANTWORT IM MODUS [{activeMode}]...</span>
          </div>
        )}
        <div ref={outputEndRef} />
      </div>

      {/* Input Prompt Bar */}
      <div className="p-3 bg-zinc-900 border-t border-zinc-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeCommand(undefined, inputVal);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <span className={`absolute left-3 top-2.5 font-bold select-none text-xs ${
              activeMode === 'V7_SYMBIOSIS' ? 'text-pink-400' :
              activeMode === 'HYBRID' ? 'text-purple-400' :
              'text-amber-500'
            }`}>
              {activeMode === 'V7_SYMBIOSIS' ? `${userName}:SYMBIOSIS>` : activeMode === 'HYBRID' ? `${userName}:HYBRID>` : `${userName}:HARDENED>`}
            </span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Schreibe Sachverhalt, Gefühlslage, Reflexionsfrage oder Befehl (z. B. 'ECHSE: REFLEXION' oder 'ECHSE: ANALYSE')..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded pl-36 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono tracking-wide"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !inputVal.trim()}
            className={`px-4 py-2 font-bold text-xs rounded flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-black ${
              activeMode === 'V7_SYMBIOSIS' ? 'bg-pink-500 hover:bg-pink-400 shadow-pink-500/20' :
              activeMode === 'HYBRID' ? 'bg-gradient-to-r from-amber-400 to-pink-500 hover:opacity-90 shadow-purple-500/20' :
              'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>SENDEN</span>
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1 px-1">
          <span>
            {activeProfileType === 'master_chris' ? 'Ebene 1: Chris (Master-User mit vorkonfigurierten Systemdaten)' : 'Ebene 2: Neuer Benutzer (Jungfräuliches, unbeflecktes System)'}
          </span>
          <span>Protokoll: {activeMode === 'V7_SYMBIOSIS' ? 'SYMBIOSIS-ENDPROTOKOLL' : activeMode === 'V6_HARDENED' ? 'NULL-BALLAST-ENDPROTOKOLL' : 'DUAL-ENDPROTOKOLL'}</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Wrench, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Bot, 
  RefreshCw, 
  Check, 
  ShieldCheck,
  Flame,
  Droplets,
  Zap,
  Info
} from 'lucide-react';
import { CleaningTask } from '../../types/echse';
import { soundManager } from '../../utils/audio';

interface ModuleHaushaltProps {
  onBack?: () => void;
  tasks?: CleaningTask[];
  onUpdateTasks?: (tasks: CleaningTask[]) => void;
  userName?: string;
}

const DEFAULT_MAINTENANCE_TASKS: CleaningTask[] = [
  { id: 'mt-1', room: 'Technik & Geräte', task: 'Kaffeemaschine & Wasserkocher entkalken (Zitronensäure)', intervalDays: 30, lastDone: '2026-09-20', done: false, isMaintenance: true },
  { id: 'mt-2', room: 'Technik & Geräte', task: 'Waschmaschinen-Flusensieb leeren & 90°C Hygiene-Lauf', intervalDays: 90, lastDone: '2026-08-01', done: false, isMaintenance: true },
  { id: 'mt-3', room: 'Küche', task: 'Dunstabzugshaube Fettfilter im Geschirrspüler reinigen (Brandschutz)', intervalDays: 45, lastDone: '2026-09-10', done: false, isMaintenance: true },
  { id: 'mt-4', room: 'Wohnbereich', task: 'Staubsauger-Filter ausklopfen & Bürstenrolle enthaaren', intervalDays: 30, lastDone: '2026-09-25', done: true, isMaintenance: true },
  { id: 'mt-5', room: 'Technik & Geräte', task: 'Rauchmelder Prüftaste drücken & Sensor entstauben (DIN 14676)', intervalDays: 180, lastDone: '2026-05-15', done: false, isMaintenance: true },
  { id: 'mt-6', room: 'Bad', task: 'Duschkopf entkalken & Siphon auf Verstopfung prüfen', intervalDays: 60, lastDone: '2026-09-01', done: true, isMaintenance: true },
  { id: 'ct-1', room: 'Bad', task: 'Katzenklo / Haustier-Zone grundreinigen & desinfizieren', intervalDays: 7, lastDone: '2026-10-02', done: true, isMaintenance: false },
  { id: 'ct-2', room: 'Küche', task: 'Kühlschrank auswischen & Kondenswasserablauf freilegen', intervalDays: 14, lastDone: '2026-09-28', done: false, isMaintenance: false },
  { id: 'ct-3', room: 'Schlafbereich', task: 'Bettwäsche bei 60°C waschen & Matratze wenden/lüften', intervalDays: 14, lastDone: '2026-09-29', done: true, isMaintenance: false },
  { id: 'ct-4', room: 'Wohnbereich', task: 'Böden saugen, nass wischen & Staubmasken/Filter checken', intervalDays: 4, lastDone: '2026-10-04', done: true, isMaintenance: false }
];

const QUICK_AI_QUESTIONS = [
  'Wie entkalke ich eine Espressomaschine sicher ohne teure Spezialtabs?',
  'Waschmaschine riecht muffig und pumpt schlecht ab - Schritt-für-Schritt Behebung',
  'Kühlschrank friert an Rückwand zu und Kondensablauf verstopft - was tun?',
  'Dunstabzugshaube klebt voll verharztem Fett - schonende Hausmittel-Lösung'
];

export const ModuleHaushaltWartung: React.FC<ModuleHaushaltProps> = ({
  onBack,
  tasks: propTasks = DEFAULT_MAINTENANCE_TASKS,
  onUpdateTasks,
  userName = 'Haushalt'
}) => {
  const [tasks, setTasks] = useState<CleaningTask[]>(propTasks.length > 0 ? propTasks : DEFAULT_MAINTENANCE_TASKS);
  const [filterRoom, setFilterRoom] = useState<string>('ALLE');
  const [filterType, setFilterType] = useState<'ALLE' | 'WARTUNG' | 'PUTZEN'>('ALLE');

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskRoom, setNewTaskRoom] = useState<CleaningTask['room']>('Küche');
  const [newTaskInterval, setNewTaskInterval] = useState(14);
  const [newTaskIsMaint, setNewTaskIsMaint] = useState(false);

  // AI Assistant State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string>('');

  const updateTasksList = (newTasks: CleaningTask[]) => {
    setTasks(newTasks);
    if (onUpdateTasks) onUpdateTasks(newTasks);
  };

  const handleToggleDone = (id: string) => {
    soundManager.playClick();
    const updated = tasks.map(t => {
      if (t.id === id) {
        const nextDone = !t.done;
        return {
          ...t,
          done: nextDone,
          lastDone: nextDone ? new Date().toISOString().split('T')[0] : t.lastDone
        };
      }
      return t;
    });
    updateTasksList(updated);
  };

  const handleDeleteTask = (id: string) => {
    soundManager.playWarning();
    updateTasksList(tasks.filter(t => t.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    soundManager.playClick();
    const task: CleaningTask = {
      id: `task-${Date.now()}`,
      room: newTaskRoom,
      task: newTaskName.trim(),
      intervalDays: Number(newTaskInterval) || 14,
      lastDone: new Date().toISOString().split('T')[0],
      done: true,
      isMaintenance: newTaskIsMaint
    };

    updateTasksList([task, ...tasks]);
    setNewTaskName('');
    setShowAddForm(false);
  };

  // AI Household Expert Query
  const handleAskAi = async (customPrompt?: string) => {
    const question = customPrompt || aiQuestion;
    if (!question.trim() || aiLoading) return;

    setAiLoading(true);
    soundManager.playExecute();

    try {
      const res = await fetch('/api/echse/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'HYBRID',
          command: 'ECHSE: ANALYSE',
          input: `Du bist der professionelle KI-Haushalts- und Gerätewartungs-Experte für den Haushalt von ${userName}.
Frage / Problem:
"${question}"

Aufgabe:
1. Analysiere die Ursache des Problems präzise.
2. Gib eine konkrete, gefahrlose Schritt-für-Schritt Reparatur- oder Reinigungsanleitung.
3. Bevorzuge umweltfreundliche, kostengünstige Hausmittel (Zitronensäure, Soda, Essigessenz richtig dosiert).
4. Schätze die gesparten Reparatur- oder Neuanschaffungskosten.
Beende mit dem DUAL-PROTOKOLL.`,
          activeModule: 4,
          context: 'Modul 4: Smarter Haushalts- & Wartungs-Takt (Geräteschutz & Hygiene)'
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

  const filteredTasks = tasks.filter(t => {
    if (filterRoom !== 'ALLE' && t.room !== filterRoom) return false;
    if (filterType === 'WARTUNG' && !t.isMaintenance) return false;
    if (filterType === 'PUTZEN' && t.isMaintenance) return false;
    return true;
  });

  const dueTasksCount = tasks.filter(t => !t.done).length;
  const maintenanceCount = tasks.filter(t => t.isMaintenance).length;

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
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold flex items-center gap-1">
                <Wrench className="w-3 h-3 text-blue-400" />
                <span>GERÄTESCHUTZ & HYGIENE</span>
              </span>
              <span className="text-zinc-500 text-xs">Modul 4</span>
            </div>
            <h1 className="text-lg font-bold text-blue-300">
              Smarter Haushalts- & Wartungs-Takt
            </h1>
          </div>
        </div>

        {/* Economic Impact Badge */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1 bg-emerald-950/40 border border-emerald-500/40 rounded flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Geräteschäden verhindert: <strong className="text-emerald-300">~650 € / Jahr</strong></span>
          </div>
          <div className="px-3 py-1 bg-blue-950/40 border border-blue-500/40 rounded flex items-center gap-2 text-blue-400">
            <Clock className="w-4 h-4" />
            <span>Offene Aufgaben: <strong className="text-blue-300">{dueTasksCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Tasks on Left, AI Expert on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Cleaning & Maintenance Tasks (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-zinc-900 rounded border border-zinc-800">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-zinc-400 mr-1">Filter:</span>
              {(['ALLE', 'Küche', 'Bad', 'Technik & Geräte', 'Wohnbereich'] as const).map(room => (
                <button
                  key={room}
                  onClick={() => {
                    soundManager.playClick();
                    setFilterRoom(room);
                  }}
                  className={`px-2 py-0.5 text-xs rounded transition-colors ${
                    filterRoom === room 
                      ? 'bg-blue-600 text-white font-bold' 
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {room}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                setShowAddForm(!showAddForm);
              }}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>NEUE AUFGABE</span>
            </button>
          </div>

          {/* Add Task Form */}
          {showAddForm && (
            <form onSubmit={handleAddTask} className="p-3 bg-zinc-950 rounded border border-blue-500/40 space-y-2.5 text-xs">
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  placeholder="Aufgabenbezeichnung (z.B. Kaffeemaschine entkalken)"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="flex-1 min-w-[200px] bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1 text-zinc-200 outline-none"
                />
                <select
                  value={newTaskRoom}
                  onChange={(e) => setNewTaskRoom(e.target.value as any)}
                  className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-zinc-200 outline-none"
                >
                  <option value="Küche">Küche</option>
                  <option value="Bad">Bad</option>
                  <option value="Technik & Geräte">Technik & Geräte</option>
                  <option value="Wohnbereich">Wohnbereich</option>
                  <option value="Schlafbereich">Schlafbereich</option>
                </select>
                <div className="flex items-center gap-1">
                  <span className="text-zinc-500 text-[11px]">Alle</span>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={newTaskInterval}
                    onChange={(e) => setNewTaskInterval(Number(e.target.value))}
                    className="w-14 bg-zinc-900 border border-zinc-700 rounded px-1.5 py-1 text-zinc-200 outline-none text-center"
                  />
                  <span className="text-zinc-500 text-[11px]">Tage</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={newTaskIsMaint}
                    onChange={(e) => setNewTaskIsMaint(e.target.checked)}
                    className="rounded bg-zinc-800 border-zinc-700 text-blue-500"
                  />
                  <span>Ist eine sicherheits-/werterhaltende Geräte-Wartung</span>
                </label>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded"
                >
                  SPEICHERN
                </button>
              </div>
            </form>
          )}

          {/* Tasks List */}
          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-800 rounded">
                Keine Aufgaben für diese Filterkategorie.
              </div>
            ) : (
              filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-3 rounded border transition-all flex items-center justify-between gap-3 ${
                    t.done
                      ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                      : t.isMaintenance
                        ? 'bg-blue-950/20 border-blue-500/40 text-zinc-200'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleDone(t.id)}
                      className={`mt-0.5 p-1 rounded border transition-colors ${
                        t.done
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : 'bg-zinc-800 border-zinc-600 text-transparent hover:border-blue-400'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold ${t.done ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                          {t.task}
                        </span>
                        {t.isMaintenance && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-950 border border-blue-700 text-blue-300 font-bold">
                            GERÄTESCHUTZ
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-500 font-mono">
                          [{t.room}]
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 flex items-center gap-3">
                        <span>Rhythmus: alle {t.intervalDays} Tage</span>
                        <span>Zuletzt: {t.lastDone || 'Noch nie'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(t.id)}
                    className="p-1 text-zinc-600 hover:text-red-400 transition-colors"
                    title="Löschen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: AI Household & Repair Expert (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-4 bg-zinc-900 rounded-lg border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-blue-300 flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-400" />
                <span>KI-HAUSHALTS- & REPARATUR-DOKTOR</span>
              </h2>
              <span className="text-[10px] text-zinc-500">Gemini Neural Core</span>
            </div>
            
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Sofortige DIY-Hilfe für verkalkte Geräte, stinkende Abflüsse, verstopfte Filter und Haushaltspannen. Spart teure Handwerker!
            </p>

            {/* Quick Prompts */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Häufige Haushalts-Fragen:</span>
              <div className="flex flex-col gap-1.5">
                {QUICK_AI_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskAi(q)}
                    disabled={aiLoading}
                    className="text-left text-[11px] p-2 rounded bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 text-zinc-300 transition-colors disabled:opacity-50"
                  >
                    ⚡ {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <textarea
                placeholder="Stelle eine beliebige Haushalts- oder Reparaturfrage..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-xs text-zinc-200 outline-none focus:border-blue-500"
              />
              <button
                onClick={() => handleAskAi()}
                disabled={aiLoading || !aiQuestion.trim()}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>KI ERMITTELT DIE BESTE ANLEITUNG...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>DIY-REPARATURANLEITUNG ANFORDERN</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Report Output */}
            {aiReport && (
              <div className="p-3 bg-zinc-950 rounded border border-blue-500/40 text-xs text-zinc-200 space-y-1.5 mt-2">
                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>HAUSHALTS- & WARTUNGS-GUTACHTEN:</span>
                </div>
                <div className="whitespace-pre-line leading-relaxed text-zinc-300 font-mono text-[11px] max-h-60 overflow-y-auto">
                  {aiReport}
                </div>
              </div>
            )}
          </div>

          {/* Quick Tips Box */}
          <div className="p-3 bg-zinc-950 rounded border border-zinc-800 text-[11px] text-zinc-400 space-y-1.5">
            <div className="text-zinc-200 font-bold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Warum Wartung bares Geld ist:</span>
            </div>
            <p>
              90% aller vorzeitigen Gerätedefekte (Kaffeemaschinen-Boiler, Waschmaschinen-Heizstäbe, Dunstabzugs-Motoren) entstehen durch Kalk und Fettablagerungen. Regelmäßige Pflege spart ca. 450 € bis 900 € über die Lebensdauer jedes Haushaltsgeräts!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Trash2, 
  ArrowLeft, 
  Copy, 
  Check, 
  ShieldAlert, 
  AlertTriangle, 
  Zap, 
  BrainCircuit, 
  FileText,
  RefreshCw,
  Bot
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Module6Props {
  onBack?: () => void;
}

const PRESET_MESSAGES = [
  {
    id: 'manipulation-1',
    label: 'Vorwurf & Schuldumkehr',
    raw: 'Hallo, ich habe gesehen, dass du meine Mail nicht sofort beantwortet hast. Wegen dir steht jetzt das ganze Projekt auf der Kippe und alle anderen müssen wegen deiner Trödelei Mehrarbeit leisten! Wenn wir die Deadline verpassen, weiß ich genau, wessen Schuld das ist!!',
    tactics: ['Schuldumkehr (Scapegoating)', 'Künstliche Panik & Dringlichkeit', 'Emotionale Erpressung'],
    facts: ['Mail-Antwort steht aus.', 'Projekt-Deadline naht.'],
    hardenedDraft: `Guten Tag,

ich nehme ausschließlich zu den sachlichen Punkten deiner Nachricht Stellung:
1. Die Projektunterlagen werden bis zur vereinbarten Frist am [Datum], 15:00 Uhr übermittelt.
2. Der Vorwurf einer Projektverzögerung durch meine Person entbehrt jeder sachlichen Grundlage und wird hiermit zurückgewiesen.
3. Bitte halte künftige Absprachen in sachlichem Ton.

Mit freundlichen Grüßen`
  },
  {
    id: 'manipulation-2',
    label: 'Bürokratischer Textmüll',
    raw: 'Sehr geehrte Damen und Herren, bezugnehmend auf unser proaktives Synergiegespräch vom vergangenen Quartal möchten wir Ihnen holistisch mitteilen, dass wir im Rahmen einer agilen Neuausrichtung unserer Service-Kapazitäten möglicherweise eventuell gezwungen sein könnten, minimale Preisanpassungen in Betracht zu ziehen, sofern die Stakeholder dies mittragen.',
    tactics: ['Nebelkerzen & Euphemismen', 'Versteckte Preiserhöhung', 'Vermeidung klarer Zusagen'],
    facts: ['Preiserhöhung wird vorbereitet.', 'Keine konkreten Zahlen genannt.'],
    hardenedDraft: `Sehr geehrte Damen und Herren,

bitte beziffern Sie die angekündigte Preisanpassung konkret:
1. Welcher genaue Betrag bzw. Prozentsatz ist ab welchem Datum geplant?
2. Auf welcher vertraglichen Rechtsgrundlage erfolgt die Anpassung?

Bis zum Eingang schriftlicher Daten gilt der bestehende Vertragstarif unverändert weiter.`
  }
];

export const Module6ReizSchutz: React.FC<Module6Props> = ({ onBack }) => {
  const [inputText, setInputText] = useState(PRESET_MESSAGES[0].raw);
  const [selectedPreset, setSelectedPreset] = useState(PRESET_MESSAGES[0].id);
  const [detectedTactics, setDetectedTactics] = useState<string[]>(PRESET_MESSAGES[0].tactics);
  const [extractedFacts, setExtractedFacts] = useState<string[]>(PRESET_MESSAGES[0].facts);
  const [cleanResponse, setCleanResponse] = useState<string>(PRESET_MESSAGES[0].hardenedDraft);
  const [aiRawOutput, setAiRawOutput] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectPreset = (presetId: string) => {
    soundManager.playClick();
    setSelectedPreset(presetId);
    const p = PRESET_MESSAGES.find(m => m.id === presetId);
    if (p) {
      setInputText(p.raw);
      setDetectedTactics(p.tactics);
      setExtractedFacts(p.facts);
      setCleanResponse(p.hardenedDraft);
      setAiRawOutput('');
    }
  };

  const handleScanWithAi = async () => {
    if (!inputText.trim() || isScanning) return;

    soundManager.playExecute();
    setIsScanning(true);

    try {
      const res = await fetch('/api/echse/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'V6_HARDENED',
          command: 'ECHSE: CLEANING',
          input: `Analysiere folgenden Text kompromisslos nach Modul 6 (Reiz-Schutz & Manipulations-Filter):

TEXT:
"${inputText}"

AUFGABE:
1. Identifiziere manipulative Taktiken (Schuldumkehr, Gaslighting, Zeitdruck, emotionale Köder).
2. Extrahiere den reinen, unantastbaren Faktenkern (0% Emotion).
3. Formuliere eine kühle, rechtssichere und unangreifbare Gegenschrift nach Null-Ballast-Direktive.
Beende mit dem NULL-BALLAST-ENDPROTOKOLL.`,
          activeModule: 6,
          context: 'Modul 6: Reiz-Schutz & Manipulations-Dekoder'
        }),
      });

      const data = await res.json();
      const outputText = data.output || '';
      setAiRawOutput(outputText);

      // Parse output sections if available
      const tacticsMatch = outputText.match(/Taktik(?:en)?[:\s\n]+([\s\S]*?)(?=Fakten|Gegenschrift|Ergebnis|$)/i);
      const factsMatch = outputText.match(/Fakten(?:kern)?[:\s\n]+([\s\S]*?)(?=Gegenschrift|Entwurf|Ergebnis|$)/i);
      const draftMatch = outputText.match(/(?:Gegenschrift|Entwurf|Schriftsatz)[:\s\n]+([\s\S]*?)(?=NULL-BALLAST-ENDPROTOKOLL|$)/i);

      if (tacticsMatch && tacticsMatch[1].trim()) {
        const lines = tacticsMatch[1].split('\n').map((l: string) => l.replace(/^[-*•\d.]+\s*/, '').trim()).filter((l: string) => l.length > 3);
        if (lines.length > 0) setDetectedTactics(lines.slice(0, 4));
      }

      if (factsMatch && factsMatch[1].trim()) {
        const lines = factsMatch[1].split('\n').map((l: string) => l.replace(/^[-*•\d.]+\s*/, '').trim()).filter((l: string) => l.length > 3);
        if (lines.length > 0) setExtractedFacts(lines.slice(0, 4));
      }

      if (draftMatch && draftMatch[1].trim()) {
        setCleanResponse(draftMatch[1].trim());
      } else {
        setCleanResponse(outputText);
      }

      soundManager.playSuccess();
    } catch {
      soundManager.playWarning();
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanResponse);
    setCopied(true);
    soundManager.playClick();
    setTimeout(() => setCopied(false), 2000);
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
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold flex items-center gap-1">
                <Bot className="w-3 h-3" />
                <span>KI-POWERED // V6.1 HARDENED</span>
              </span>
              <span className="text-zinc-500 text-xs">Dekoder & Reiz-Filter</span>
            </div>
            <h1 className="text-lg font-bold text-amber-300">
              Kommunikations-Filter, Reiz-Schutz & Manipulations-Dekoder
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {PRESET_MESSAGES.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.id)}
              className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                selectedPreset === p.id
                  ? 'bg-amber-500 text-black font-bold border-amber-400'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Raw Input & Manipulation Scan */}
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>ROHTEXT MIT REIZEN & MANIPULATION</span>
            </h3>
            <span className="text-[10px] text-zinc-500">
              E-Mail, WhatsApp, Vorwurf, Behördenbrief
            </span>
          </div>

          <textarea
            rows={7}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Füge hier eine emotionale, übergriffige oder verworrene Nachricht ein..."
            disabled={isScanning}
            className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-xs text-zinc-200 outline-none focus:border-amber-500 font-mono leading-relaxed disabled:opacity-50"
          />

          <button
            onClick={handleScanWithAi}
            disabled={isScanning || !inputText.trim()}
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-xs flex items-center justify-center gap-1.5 shadow transition-colors disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>KI ANALYSIERT MANIPULATION & FILTERT REIZE...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>KI-SCAN & GEGENSCHRIFT STARTEN</span>
              </>
            )}
          </button>

          {/* Detected Manipulation Tactics */}
          <div className="p-3 bg-zinc-950 rounded border border-red-500/30 space-y-2">
            <div className="text-[10px] text-red-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Von der KI erkannte Manipulationstaktiken ({detectedTactics.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {detectedTactics.map((t, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-red-950/60 border border-red-800 text-red-300 text-[11px]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Hard Facts & Untouchable Clean Response */}
        <div className="space-y-4">
          {/* Extracted Hard Facts */}
          <div className="p-3.5 bg-zinc-900/60 border border-emerald-500/30 rounded space-y-2">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>REINER FAKTENKERN (VON KI EXTRAHIERT)</span>
            </div>
            <ul className="space-y-1 text-xs text-zinc-300">
              {extractedFacts.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Untouchable Clean Response */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>UNANTASTBARE SACHLICHE GEGENSCHRIFT (KI-ENTWURF)</span>
              </h3>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1 border border-zinc-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'KOPIERT!' : 'KOPIEREN'}</span>
              </button>
            </div>

            <textarea
              rows={8}
              value={cleanResponse}
              onChange={(e) => setCleanResponse(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-xs text-zinc-100 outline-none focus:border-amber-500 font-mono leading-relaxed"
            />

            <div className="text-[10px] text-zinc-500 leading-tight">
              • 100% von der KI bereinigt • Keine emotionale Angriffsfläche • Sachliche Null-Ballast-Kommunikation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Trash2, ArrowLeft, Copy, Check, Filter, Zap, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Module5Props {
  onBack?: () => void;
}

export const Module5Cleaning: React.FC<Module5Props> = ({ onBack }) => {
  const [rawText, setRawText] = useState<string>(
    `Hallo lieber Chris, ich hoffe dir geht es super und du hattest ein wunderschönes Wochenende! ` +
    `Ich wollte mich ganz kurz bezüglich unseres Projektes melden. Es tut mir total leid, dass ich mich ` +
    `jetzt erst melde, aber hier ging echt alles drunter und drüber. Wir müssten uns eventuell nächste Woche ` +
    `nochmal ganz unverbindlich zusammensetzen, weil die Schnittstelle noch ein paar Probleme macht. ` +
    `Gib mir doch einfach Bescheid, wann es dir zeitlich am besten passen würde! Ganz liebe Grüße und einen tollen Start in die Woche!`
  );
  const [cleanedOutput, setCleanedOutput] = useState<string>('');
  const [compressionRate, setCompressionRate] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const cleanText = async () => {
    soundManager.playExecute();
    setLoading(true);
    try {
      const res = await fetch('/api/echse/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'ECHSE: CLEANING',
          input: rawText,
          activeModule: 5,
          context: 'Modul 5: Redundanz & Cleaning. Abwurf von Informationsmüll und Höflichkeitsfloskeln.',
        }),
      });
      const data = await res.json();
      setCleanedOutput(data.output || 'Keine Bereinigungsausgabe.');

      const originalLen = rawText.length;
      const cleanLen = (data.output || '').length;
      const rate = Math.max(0, Math.min(95, Math.round(((originalLen - cleanLen * 0.3) / originalLen) * 100)));
      setCompressionRate(rate);

      soundManager.playSuccess();
    } catch {
      soundManager.playWarning();
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(cleanedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <Trash2 className="w-4 h-4 text-amber-400" />
              MODUL 5: REDUNDANZ & CLEANING (ABWURF VON INFORMATIONSMÜLL)
            </h2>
            <p className="text-[11px] text-zinc-500">
              Eliminiert Floskeln, Entschuldigungen, Smalltalk und unstrukturierte Datenströme. Behält nur den harten Datenkern.
            </p>
          </div>
        </div>

        {compressionRate !== null && (
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            REDUKTION: -{compressionRate}% BALLAST
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Raw Input Column */}
        <div className="lg:col-span-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-300">
            <span>ROHTEXT MIT BALLAST / FLOSKELN:</span>
            <span className="text-[10px] text-zinc-500">{rawText.length} Zeichen</span>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={12}
            className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
            placeholder="Füge hier E-Mails, Chat-Nachrichten oder Berichte ein, die von Ballast befreit werden sollen..."
          />

          <button
            onClick={cleanText}
            disabled={loading || !rawText.trim()}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-amber-500/20"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Filter className="w-3.5 h-3.5" />}
            <span>INFORMATIONSMÜLL ABWERFEN (ECHSE: CLEANING)</span>
          </button>
        </div>

        {/* Clean Output Column */}
        <div className="lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
              <span className="text-xs font-bold text-emerald-400">EXTRAHIERTE HARTE DATENSÄTZE:</span>
              {cleanedOutput && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-400"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'KOPIERT' : 'KOPIEREN'}</span>
                </button>
              )}
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded p-3 text-xs leading-relaxed font-mono whitespace-pre-wrap text-zinc-200 min-h-[220px]">
              {cleanedOutput || (
                <span className="text-zinc-600">
                  Der bereinigte Datenkern wird hier ausgegeben (Floskel-Quote: 0%).
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 p-2 bg-zinc-950 rounded border border-zinc-800 text-[10px] text-zinc-500">
            DIREKTIVE MODUL 5: Jedes Wort ohne sachlichen Nährwert ist Rechenzeit- und Aufmerksamkeitsverschwendung. Null Toleranz für Füllphrasen.
          </div>
        </div>
      </div>
    </div>
  );
};

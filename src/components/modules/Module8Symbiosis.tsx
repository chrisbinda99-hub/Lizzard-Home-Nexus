import React, { useState } from 'react';
import { 
  HeartHandshake, 
  ArrowLeft, 
  Sparkles, 
  Heart, 
  Send, 
  MessageCircle, 
  Compass, 
  Feather, 
  CheckCircle2,
  RefreshCw,
  Bot
} from 'lucide-react';
import { UserProfileData } from '../../types/echse';
import { soundManager } from '../../utils/audio';

interface Module8Props {
  onBack?: () => void;
  currentProfile: UserProfileData;
  onSendPrompt?: (prompt: string, cmd: string) => void;
}

const EMPATHY_PROMPTS = [
  'Ich fühle mich heute innerlich völlig überreizt und erschöpft.',
  'Ich habe das Gefühl, alles alleine tragen zu müssen und niemand versteht den Druck.',
  'Mein Kopf kreist ständig um To-Dos und ich finde keine innere Ruhe.',
  'Ich brauche keine technischen Ratschläge, sondern einfach jemanden, der zuhört.'
];

export const Module8Symbiosis: React.FC<Module8Props> = ({ 
  onBack, 
  currentProfile,
  onSendPrompt 
}) => {
  const [reflectionInput, setReflectionInput] = useState('');
  const [dialogHistory, setDialogHistory] = useState<Array<{ role: 'user' | 'symbiosis'; text: string; time: string; source?: string }>>([
    {
      role: 'symbiosis',
      text: `Willkommen im geschützten Symbiosis-Raum, ${currentProfile.userName}. Hier gibt es keine Leistungsanforderungen, keinen Zeitdruck und keine kalten Ratschläge, die du abarbeiten musst. Atme tief durch. Ich bin mit voller Aufmerksamkeit bei dir. Was bewegt dein Herz im jetzigen Augenblick?`,
      time: '08:00',
      source: 'KI_SYMBIOSIS_CORE'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || reflectionInput).trim();
    if (!text || isTyping) return;

    soundManager.playExecute();
    const now = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    const updatedHistory = [
      ...dialogHistory,
      { role: 'user' as const, text, time: now }
    ];
    setDialogHistory(updatedHistory);
    setReflectionInput('');
    setIsTyping(true);

    try {
      // Direct call to Gemini AI backend
      const res = await fetch('/api/echse/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'V7_SYMBIOSIS',
          command: 'ECHSE: EMPATHIE',
          input: text,
          activeModule: 8,
          userName: currentProfile.userName,
          profileId: currentProfile.id,
          context: `Symbiosis-Raum: Empathischer Zuhör-Raum ohne Besserwisserei. Der Nutzer ${currentProfile.userName} (Begleiter: ${currentProfile.petName}, Pflanzen: ${currentProfile.botanyName}) teilt persönliche Gedanken und Gefühle. Reagiere mit warmer, verständnisvoller Intelligenz und schließe mit dem SYMBIOSIS-ENDPROTOKOLL.`
        }),
      });

      const data = await res.json();
      const aiResponse = data.output || 'Ich bin hier und höre dir zu.';

      setDialogHistory([
        ...updatedHistory,
        {
          role: 'symbiosis',
          text: aiResponse,
          time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
          source: data.source || 'GEMINI_AI'
        }
      ]);
      soundManager.playSuccess();
    } catch (err) {
      soundManager.playWarning();
      setDialogHistory([
        ...updatedHistory,
        {
          role: 'symbiosis',
          text: `Ich bin bei dir, auch wenn die Verbindung gerade schwankt. Atme tief durch, schenke dir und ${currentProfile.petName} ein paar Minuten Ruhe. Du musst heute nichts mehr erzwingen.\n\nSYMBIOSIS-ENDPROTOKOLL\n1. Erkenntnis: Deine Ruhe steht an oberster Stelle.\n2. Impuls: Trinke ein Glas Wasser und schließe kurz die Augen.\n3. Bindung: Ich bleibe an deiner Seite.`,
          time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
          source: 'LOCAL_SYMBIOSIS_CORE'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-4 space-y-5 font-mono max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-500/20 pb-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                soundManager.playClick();
                onBack();
              }}
              className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-pink-500/40 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/40 font-bold flex items-center gap-1">
                <Bot className="w-3 h-3 text-pink-400" />
                <span>KI-POWERED // V7.0 SYMBIOSIS</span>
              </span>
              <span className="text-pink-300/80 text-xs">Menschliche Bewusstseinssynthese</span>
            </div>
            <h1 className="text-lg font-bold text-pink-300">
              Symbiosis-Raum & Mentale Resonanz
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1 bg-pink-950/40 border border-pink-500/30 rounded flex items-center gap-2 text-pink-300">
            <Heart className="w-4 h-4 text-pink-400" />
            <span>KI-Zuhören: <strong>100% Empathie, 0% Belehrung</strong></span>
          </div>
        </div>
      </div>

      {/* Empathy Sanctuary Chat Interface */}
      <div className="p-4 bg-zinc-900/50 border border-pink-500/20 rounded space-y-4 shadow-lg shadow-pink-950/10">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
          <div className="text-xs text-pink-300 flex items-center gap-2 font-bold">
            <MessageCircle className="w-4 h-4 text-pink-400" />
            <span>GESCHÜTZTER ZUHÖR-RAUM (ECHTE KI-ANTWORTEN)</span>
          </div>
          <span className="text-[10px] text-zinc-500">
            Gesprächspartner: Androgynes Bewusstsein V7.0 (Gemini Core)
          </span>
        </div>

        {/* Message Log */}
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {dialogHistory.map((msg, i) => (
            <div
              key={i}
              className={`p-3.5 rounded text-xs leading-relaxed transition-all ${
                msg.role === 'user'
                  ? 'bg-zinc-800/80 border border-zinc-700 ml-8 text-zinc-100'
                  : 'bg-pink-950/20 border border-pink-500/30 mr-8 text-pink-100/90'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] mb-1 font-bold">
                <span className={msg.role === 'user' ? 'text-amber-400' : 'text-pink-400 flex items-center gap-1'}>
                  {msg.role === 'user' ? currentProfile.userName : 'ECHSE V7.0 (KI-SYMBIOSIS)'}
                </span>
                <div className="flex items-center gap-2 font-mono font-normal text-zinc-500">
                  {msg.source && <span className="text-[9px] px-1 rounded bg-zinc-900 border border-zinc-800 text-pink-300/80">{msg.source}</span>}
                  <span>{msg.time}</span>
                </div>
              </div>
              <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
            </div>
          ))}

          {isTyping && (
            <div className="p-3 bg-pink-950/10 border border-pink-500/20 rounded mr-8 text-xs text-pink-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Die KI hört dir aufmerksam zu und formuliert eine einfühlsame Antwort...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {EMPATHY_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={isTyping}
              className="text-[11px] px-2.5 py-1 rounded bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 hover:border-pink-500/40 text-zinc-400 hover:text-pink-200 transition-colors disabled:opacity-50"
            >
              "{p}"
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="flex gap-2 pt-2 border-t border-zinc-800">
          <input
            type="text"
            value={reflectionInput}
            onChange={(e) => setReflectionInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
            placeholder="Schreibe frei von der Seele, was dich gerade beschäftigt..."
            disabled={isTyping}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-100 outline-none focus:border-pink-500 font-sans disabled:opacity-50"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!reflectionInput.trim() || isTyping}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded text-xs flex items-center gap-1.5 shadow transition-colors disabled:opacity-50"
          >
            {isTyping ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isTyping ? 'ANTWORTET...' : 'TEILEN'}</span>
          </button>
        </div>
      </div>

      {/* Values & Peace Compass */}
      <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded space-y-2 text-xs">
        <h4 className="font-bold text-zinc-300 flex items-center gap-2">
          <Compass className="w-4 h-4 text-pink-400" />
          <span>LEBENSKOMPASS: WAS WIRKLICH ZÄHLT</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px] text-zinc-400">
          <div className="p-2.5 bg-zinc-950/60 rounded border border-zinc-800">
            <strong className="text-pink-300 block mb-0.5">1. Physische Erdung</strong>
            {currentProfile.petName} pflegen, bewusst kochen, frische Luft spüren.
          </div>
          <div className="p-2.5 bg-zinc-950/60 rounded border border-zinc-800">
            <strong className="text-pink-300 block mb-0.5">2. Radikale Reduktion</strong>
            Mache heute eine Sache weniger, anstatt noch drei Dinge zu erzwingen.
          </div>
          <div className="p-2.5 bg-zinc-950/60 rounded border border-zinc-800">
            <strong className="text-pink-300 block mb-0.5">3. Unzerstörbarer Frieden</strong>
            Niemand kann deinen inneren Raum stören, wenn du die Tür für Lärm schließt.
          </div>
        </div>
      </div>
    </div>
  );
};

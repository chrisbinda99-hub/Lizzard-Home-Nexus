import React, { useState } from 'react';
import { ShieldAlert, Copy, Check, Send, RefreshCw, FileText, ArrowLeft } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Module1Props {
  onBack?: () => void;
}

const BLUEPRINT_TEMPLATES = [
  {
    id: 'vermieter-mangel',
    title: 'Vermieter: Mängelanzeige & Fristsetzung',
    category: 'Mietrecht',
    facts: 'Heizungsausfall seit 48h, Raumtemperatur 14°C, Mietminderungsvorbehalt nach BGB § 536.',
    defaultDraft: `Sehr geehrte Hausverwaltung,

hiermit zeige ich folgenden Mangel in der Mietsache an:
Vollständiger Ausfall der Heizungsanlage seit 48 Stunden. Die Raumtemperatur beträgt 14°C.

Ich setze Ihnen zur Wiederherstellung der vertragsgemäßen Heizleistung eine Frist bis zum [Datum in 3 Tagen], 12:00 Uhr.
Nach fruchtlosem Ablauf werde ich die Miete gemäß § 536 BGB mindern und mir die Einleitung einer Ersatzvornahme auf Ihre Kosten vorbehalten. Die künftigen Mietzahlungen erfolgen ausdrücklich unter dem Vorbehalt der Rückforderung.

Mit verbindlichen Grüßen,
[Mieter]`
  },
  {
    id: 'behoerde-widerspruch',
    title: 'Behörde: Formgerechter Widerspruch & Akteneinsicht',
    category: 'Verwaltungsrecht',
    facts: 'Bescheid vom [Datum], fehlende Sachverhaltsermittlung, Antrag auf Akteneinsicht gem. § 25 SGB X / VwVfG.',
    defaultDraft: `Sehr geehrte Damen und Herren,

gegen Ihren Bescheid vom [Datum], zugegangen am [Datum], lege ich hiermit

WIDERSPRUCH

ein. Zur Begründung beantrage ich vorab vollständige Akteneinsicht gemäß den gesetzlichen Bestimmungen.
Die detaillierte Begründung des Widerspruchs erfolgt binnen zwei Wochen nach Erhalt der Aktenkopien. Bis zum Abschluss des Widerspruchsverfahrens wird das Ruhen etwaiger Vollziehungsmaßnahmen verlangt.

Hochachtungsvoll,
[Absender]`
  },
  {
    id: 'grenzziehung-reizschutz',
    title: 'Toxischer Kontakt: Reiz-Entkopplung & Grenzziehung',
    category: 'Reiz-Schutz',
    facts: 'Emotionale Vorwürfe, Grenzüberschreitung. Sachliche Reduktion auf 0 Emotion.',
    defaultDraft: `Guten Tag,

ich nehme ausschließlich zu den sachlichen Punkten deiner Nachricht Stellung:
1. Der genannte Vorwurf entbehrt einer objektiven Tatsachengrundlage und wird nicht weiter diskutiert.
2. Organisatorische Absprachen erfolgen ab sofort ausschließlich in schriftlicher, knapper Form per Mail.
3. Auf abwertende oder emotionale Äußerungen wird keine Reaktion mehr erfolgen.

Der Sachstand ist damit abschließend festgehalten.`
  },
  {
    id: 'vertragskundigung',
    title: 'Dienstleister: Außerordentliche Kündigung bei Nichterfüllung',
    category: 'Vertragsrecht',
    facts: 'Wiederholter Leistungsausfall, Pflichtverletzung nach BGB § 314, Fristlose Beendigung.',
    defaultDraft: `Sehr geehrte Damen und Herren,

hiermit kündige ich den Vertrag mit der Kundennummer [Nummer] aus wichtigem Grund gemäß § 314 BGB mit sofortiger Wirkung.

Begründung: Die vertraglich geschuldete Hauptleistung wurde trotz erfolgter Abmahnung vom [Datum] wiederholt nicht erbracht. Eine Fortsetzung des Vertragsverhältnisses ist mir unzumutbar.
Ich widerrufe hiermit mit sofortiger Wirkung die erteilte SEPA-Lastschriftermächtigung. Bitte bestätigen Sie den Zugang und die Beendigung binnen 7 Tagen schriftlich.

Mit verbindlichen Grüßen,
[Vertragspartner]`
  }
];

export const Module1Blueprint: React.FC<Module1Props> = ({ onBack }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(BLUEPRINT_TEMPLATES[0]);
  const [customFacts, setCustomFacts] = useState(BLUEPRINT_TEMPLATES[0].facts);
  const [outputDraft, setOutputDraft] = useState(BLUEPRINT_TEMPLATES[0].defaultDraft);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectTemplate = (tmpl: typeof BLUEPRINT_TEMPLATES[0]) => {
    soundManager.playClick();
    setSelectedTemplate(tmpl);
    setCustomFacts(tmpl.facts);
    setOutputDraft(tmpl.defaultDraft);
  };

  const generateWithAi = async () => {
    soundManager.playExecute();
    setLoading(true);
    try {
      const res = await fetch('/api/echse/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'ECHSE: BLUEPRINT',
          input: `Kategorie: ${selectedTemplate.category}. Sachverhalt / Harte Fakten: ${customFacts}`,
          activeModule: 1,
          context: 'Modul 1: Kommunikations-Blueprints (Reiz-Schutz & Rechtssicherheit)',
        }),
      });
      const data = await res.json();
      setOutputDraft(data.output || 'Kein Entwurf generiert.');
      soundManager.playSuccess();
    } catch {
      soundManager.playWarning();
    } finally {
      setLoading(false);
    }
  };

  const copyDraft = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(outputDraft);
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
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              MODUL 1: KOMMUNIKATIONS-BLUEPRINTS (REIZ-SCHUTZ)
            </h2>
            <p className="text-[11px] text-zinc-500">
              Absolut neutrale bis rechtssichere Schriftsätze. Beseitigt Angriffsflächen und emotionale Köder.
            </p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
          STATUS: ARMED
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Template Selector & Input Column */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-zinc-300">VORLAGEN-TYP WÄHLEN:</div>
          <div className="space-y-1.5">
            {BLUEPRINT_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`w-full text-left p-2.5 rounded border text-xs transition-all ${
                  selectedTemplate.id === tmpl.id
                    ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-bold shadow-sm'
                    : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="text-[10px] text-zinc-500 font-normal">[{tmpl.category}]</div>
                <div>{tmpl.title}</div>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              HARTE FAKTEN & PARAMETER ZUR HÄRTUNG:
            </label>
            <textarea
              value={customFacts}
              onChange={(e) => setCustomFacts(e.target.value)}
              rows={4}
              className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
              placeholder="Füge hier Fakten, Fristen, Paragraphen oder den beanstandeten Text ein..."
            />
          </div>

          <button
            onClick={generateWithAi}
            disabled={loading}
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>BLUEPRINT DURCH NEURAL-CORE HÄRTEN</span>
          </button>
        </div>

        {/* Blueprint Output Preview */}
        <div className="lg:col-span-7 flex flex-col bg-zinc-900/70 border border-zinc-800 rounded p-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>GEHÄRTETER SCHRIFTSATZ // NULL-ANGRIFFSFLÄCHE</span>
            </div>
            <button
              onClick={copyDraft}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-400 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">KOPIERT</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>KOPIEREN</span>
                </>
              )}
            </button>
          </div>

          <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded p-3 text-xs leading-relaxed whitespace-pre-wrap font-mono text-zinc-200 overflow-y-auto max-h-[480px]">
            {outputDraft}
          </div>

          <div className="mt-2 text-[10px] text-zinc-500 bg-zinc-950 p-2 rounded border border-zinc-800/80">
            DIREKTIVE M1: Keine Entschuldigungen, keine Konjunktive ("hätte", "könnte"), keine empathischen Übertragungen. Schriftform wahrt den Rechtsanspruch.
          </div>
        </div>
      </div>
    </div>
  );
};

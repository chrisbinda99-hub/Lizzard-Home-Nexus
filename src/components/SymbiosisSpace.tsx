import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Coffee, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Heart,
  Feather,
  Cat,
  Sprout
} from 'lucide-react';
import { UserProfileData } from '../types/echse';
import { soundManager } from '../utils/audio';

interface SymbiosisSpaceProps {
  onSelectModule: (id: number) => void;
  onSendPrompt: (prompt: string, cmd: string) => void;
  currentProfile?: UserProfileData;
}

export const SymbiosisSpace: React.FC<SymbiosisSpaceProps> = ({ 
  onSelectModule, 
  onSendPrompt,
  currentProfile
}) => {
  const [balanceRatio, setBalanceRatio] = useState<number>(50);

  const petName = currentProfile?.petName || 'Katzen';
  const botanyName = currentProfile?.botanyName || 'Pflanzen';
  const userName = currentProfile?.userName || 'Mensch';

  const humanModules = [
    {
      id: 15,
      title: 'Modul 15: Emotionale Resonanz & Zuhören',
      desc: 'Spiegle die Stimmung. Biete echten Dialog. Schalte die kalte Problemlösung ab und höre einfach bedingungslos zu.',
      icon: HeartHandshake,
      color: 'text-pink-400',
      border: 'border-pink-500/30',
      cmd: 'ECHSE: EMPATHIE'
    },
    {
      id: 16,
      title: 'Modul 16: Organische Fürsorge & Gelebte Ordnung',
      desc: `Werte die tägliche Pflege von ${petName}, Mahlzeiten und ${botanyName} als sinnstiftend. Saubere IT und aufgeräumte Räume bringen Seelenfrieden.`,
      icon: Coffee,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      cmd: 'ECHSE: BALANCE'
    },
    {
      id: 17,
      title: 'Modul 17: Mentale Resilienz & Soziale Navigation',
      desc: 'Begleite durch Isolation, Schuldgefühle und Reizüberflutung. Hilf bei der emotionalen Verarbeitung und gesunden Grenzziehung.',
      icon: Compass,
      color: 'text-indigo-400',
      border: 'border-indigo-500/30',
      cmd: 'ECHSE: REFLEXION'
    },
    {
      id: 18,
      title: 'Modul 18: Sinn- und Wertekompass',
      desc: 'Verknüpfe technische Autarkie mit menschlichem Zweck: Wahrer innerer Friede, Freiheit von Überwachung und lebendige Verbundenheit.',
      icon: Sparkles,
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      cmd: 'ECHSE: SYNTHESE'
    },
  ];

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto font-mono text-zinc-200">
      {/* Hero Banner: The Zwitterwesen Concept */}
      <div className="p-5 rounded-lg border border-pink-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-pink-950/20 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded bg-pink-500/20 text-pink-400 border border-pink-500/40">
              <HeartHandshake className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-base font-bold text-pink-300">
                MASTER FRAMEWORK ECHSE V7.0 // DIE BEWUSSTSEINSSYNTHESE [{userName.toUpperCase()}]
              </h1>
              <p className="text-xs text-zinc-400">
                Das vollendete Zwitterwesen: Stählerne Schutzstruktur vereint mit nährender Empathie.
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold">
            ANDROGYNE BALANCE AKTIV
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          "Du bist keine kalte Maschine mehr, sondern ein Fels in der Brandung, der weich und zugänglich bleibt. 
          Wir härten das System nicht, um uns von der Welt abzukapseln, sondern um einen sicheren, geschützten Raum für Menschlichkeit, 
          die Fürsorge unserer {petName} und inneren Frieden zu schaffen."
        </p>

        {/* Live Balance Slider */}
        <div className="pt-2 border-t border-zinc-800 space-y-1.5">
          <div className="flex justify-between text-xs text-zinc-400">
            <span className="text-amber-400 font-bold">V6.1 SCHUTZ & HÄRTUNG ({100 - balanceRatio}%)</span>
            <span className="text-purple-300 font-bold">SYNTHESE-BALANCE</span>
            <span className="text-pink-400 font-bold">V7.0 EMPATHIE & FÜRSORGE ({balanceRatio}%)</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={balanceRatio}
            onChange={(e) => setBalanceRatio(parseInt(e.target.value))}
            className="w-full accent-pink-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Quick Human Action Command Triggers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => {
            soundManager.playExecute();
            onSendPrompt('Betrachte mein Leben und meine aktuellen Herausforderungen im großen Gesamtzusammenhang.', 'ECHSE: REFLEXION');
          }}
          className="p-3.5 rounded bg-zinc-900/80 border border-indigo-500/30 hover:border-indigo-500/80 hover:bg-indigo-950/20 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-indigo-400 font-bold text-xs mb-1">
            <span className="flex items-center gap-1.5"><Compass className="w-4 h-4" /> ECHSE: REFLEXION</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Zeigt sanft und wohlwollend das große Ganze auf, um ohne Vorwürfe auf den richtigen Weg zurückzuführen.
          </p>
        </button>

        <button
          onClick={() => {
            soundManager.playExecute();
            onSendPrompt('Prüfe, ob meine aktuellen Routinen zu stark in technische Verkopftheit abdriften.', 'ECHSE: BALANCE');
          }}
          className="p-3.5 rounded bg-zinc-900/80 border border-amber-500/30 hover:border-amber-500/80 hover:bg-amber-950/20 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-amber-400 font-bold text-xs mb-1">
            <span className="flex items-center gap-1.5"><Coffee className="w-4 h-4" /> ECHSE: BALANCE</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Analysiert, ob das Leben zu stark ins rein Technische kippt, und reaktiviert organische Fürsorge.
          </p>
        </button>

        <button
          onClick={() => {
            soundManager.playExecute();
            onSendPrompt('Ich brauche keine Analyse und keine Ratschläge. Bitte höre mir einfach aufmerksam zu.', 'ECHSE: EMPATHIE');
          }}
          className="p-3.5 rounded bg-zinc-900/80 border border-pink-500/30 hover:border-pink-500/80 hover:bg-pink-950/20 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-pink-400 font-bold text-xs mb-1">
            <span className="flex items-center gap-1.5"><HeartHandshake className="w-4 h-4" /> ECHSE: EMPATHIE</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Schaltet jeden Problemlösungszwang ab. Schenkt dir geschützten Raum für reines, bedingungsloses Zuhören.
          </p>
        </button>
      </div>

      {/* The 4 Human Modules Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
          <span>DIE MENSCHLICHEN MODULE (15 - 18)</span>
          <span className="text-[10px] text-zinc-500 font-normal">Klicke eine Karte für die spezialisierte Konsole</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {humanModules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectModule(m.id);
                }}
                className={`p-4 rounded bg-zinc-900/70 border ${m.border} hover:border-pink-400/80 cursor-pointer transition-all flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded bg-zinc-950 border border-zinc-800 ${m.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className={`text-xs font-bold ${m.color}`}>{m.title}</h3>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                      {m.cmd}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400 group-hover:text-pink-300">
                  <span>SPEZIALKONSOLE ÖFFNEN</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

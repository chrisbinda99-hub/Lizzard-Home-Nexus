import React, { useState } from 'react';
import { MODULES_DATA } from '../../data/modulesData';
import { 
  ShieldAlert, 
  Terminal, 
  Lock, 
  Sprout, 
  Trash2, 
  Scale, 
  Activity, 
  BrainCircuit, 
  TrendingUp, 
  Cpu, 
  Database, 
  Zap,
  Cat,
  HeartHandshake,
  ArrowRight,
  ShoppingBag,
  Wrench
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

const ICON_MAP: Record<string, React.ElementType> = {
  Scale,
  Lock,
  ShoppingBag,
  Wrench,
  Zap,
  Sprout,
  Cat,
  Trash2,
  TrendingUp,
  HeartHandshake,
  Database,
};

interface ModuleGridProps {
  onSelectModule: (moduleId: number) => void;
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({ onSelectModule }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'FINANZEN & RECHT',
    'HAUSHALT & VORRAT',
    'ENERGIE & UMWELT',
    'GÄRTNEREI & AGRO-TECH',
    'FAMILIE & GESUNDHEIT',
    'SCHUTZ & SOUVERÄNITÄT'
  ];

  const filteredModules = filterCategory === 'ALL'
    ? MODULES_DATA
    : MODULES_DATA.filter(m => m.category === filterCategory);

  return (
    <div className="p-4 space-y-4 font-mono max-w-7xl mx-auto">
      {/* Category Filter Pills & Headline */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-amber-400 tracking-wider flex items-center gap-2">
            <span>DIE 11 KERN-SÄULEN DES MASTER-FRAMEWORKS</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              HAUSHALTS- & MARKTFÜHREND
            </span>
          </h2>
          <p className="text-[11px] text-zinc-400">
            Alles, was man als Mensch im Haushalt, Finanzen, Ernährung, Umwelt und Umfeld wirklich braucht. Jedes Modul ist sofort interaktiv nutzbar und API-gesteuert.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundManager.playClick();
                setFilterCategory(cat);
              }}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors border ${
                filterCategory === cat
                  ? 'bg-amber-500 text-black font-bold border-amber-400'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {cat === 'ALL' ? 'ALLE 11 MODULE' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 11 Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredModules.map((mod) => {
          const Icon = ICON_MAP[mod.iconName] || Terminal;
          const isArmed = mod.status === 'ARMED';
          const isOptimal = mod.status === 'OPTIMAL';
          const isWarm = mod.status === 'WARM';

          return (
            <div
              key={mod.id}
              onClick={() => {
                soundManager.playClick();
                onSelectModule(mod.id);
              }}
              className="p-3.5 rounded bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/60 cursor-pointer transition-all hover:bg-zinc-900 group flex flex-col justify-between space-y-3 relative overflow-hidden"
            >
              {/* Header inside card */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-zinc-950 border border-zinc-800 text-amber-400 group-hover:text-amber-300 group-hover:border-amber-500/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono tracking-wider">
                      MODUL {String(mod.id).padStart(2, '0')} // {mod.category}
                    </span>
                  </div>

                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${
                    isArmed
                      ? 'bg-red-500/10 border-red-500/40 text-red-400'
                      : isOptimal
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                        : isWarm
                          ? 'bg-pink-500/10 border-pink-500/40 text-pink-400'
                          : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                  }`}>
                    {mod.status}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-zinc-200 group-hover:text-amber-300 transition-colors">
                  {mod.name}
                </h3>

                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                  {mod.shortDesc}
                </p>
              </div>

              {/* Economic & Market Benefit */}
              <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-500">MESSBARER NUTZEN:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    {mod.economicValue.split(';')[0]}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1">
                  <span className="text-zinc-600">
                    URSPRUNG: <span className="text-zinc-400">{mod.systemOrigin}</span>
                  </span>
                  <span className="text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>ÖFFNEN</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

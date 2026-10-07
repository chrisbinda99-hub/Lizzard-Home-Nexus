import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Cpu, 
  Smartphone, 
  Volume2, 
  VolumeX, 
  Cat,
  Sprout,
  Activity,
  HeartHandshake,
  User,
  Settings,
  Sparkles,
  TrendingUp,
  Zap,
  Layers,
  ShoppingBag,
  Wrench,
  Lock,
  Cloud,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { SystemMode, ProfileType, UserProfileData } from '../types/echse';
import { soundManager } from '../utils/audio';
import { User as FirebaseUser } from 'firebase/auth';

export type MainTabType = 'terminal' | 'economic' | 'modules' | 'gaertnerei' | 'pantry' | 'cleaning' | 'kaufgatter' | 'umwelt' | 'symbiosis';

interface HeaderProps {
  activeTab: MainTabType;
  setActiveTab: (tab: MainTabType) => void;
  telemetryVpd?: number;
  currentMode: SystemMode;
  setCurrentMode: (mode: SystemMode) => void;
  currentProfile: UserProfileData;
  activeProfileType: ProfileType;
  onSelectProfileType: (type: ProfileType) => void;
  onOpenProfileModal: () => void;
  currentUser: FirebaseUser | null;
  isMaster: boolean;
  isCloudSynced: boolean;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  telemetryVpd = 1.18,
  currentMode,
  setCurrentMode,
  currentProfile,
  activeProfileType,
  onSelectProfileType,
  onOpenProfileModal,
  currentUser,
  isMaster,
  isCloudSynced,
  onOpenAuthModal
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    setSoundEnabled(soundManager.isEnabled());
  }, []);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    soundManager.setEnabled(nextState);
    setSoundEnabled(nextState);
    if (nextState) soundManager.playClick();
  };

  const handleTabChange = (tab: MainTabType) => {
    soundManager.playClick();
    setActiveTab(tab);
  };

  const handleModeSwitch = (mode: SystemMode) => {
    soundManager.playModeSwitch();
    setCurrentMode(mode);
  };

  const handleProfileSwitch = (type: ProfileType) => {
    // If user clicks Chris (Master) but is not authenticated as Master via Google:
    if (type === 'master_chris' && !isMaster) {
      soundManager.playWarning();
      onOpenAuthModal();
      return;
    }

    soundManager.playModeSwitch();
    onSelectProfileType(type);
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-950 px-4 py-2.5 select-none font-mono">
      {/* Top Bar: Title, Ebenen (Profiles), Modes, Sound, Google Auth */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* System Title & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full animate-ping absolute ${
              currentMode === 'V6_HARDENED' 
                ? 'bg-amber-500' 
                : currentMode === 'V7_SYMBIOSIS' 
                  ? 'bg-pink-500' 
                  : 'bg-emerald-400'
            }`} />
            <div className={`w-3 h-3 rounded-full relative ${
              currentMode === 'V6_HARDENED' 
                ? 'bg-amber-500' 
                : currentMode === 'V7_SYMBIOSIS' 
                  ? 'bg-pink-500' 
                  : 'bg-emerald-400'
            }`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-zinc-100 uppercase">
                SYSTEM ECHSE
              </span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                currentMode === 'V6_HARDENED'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : currentMode === 'V7_SYMBIOSIS'
                    ? 'bg-pink-500/20 text-pink-400 border border-pink-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {currentMode === 'V6_HARDENED' ? 'V6.1 HARDENED' : currentMode === 'V7_SYMBIOSIS' ? 'V7.0 SYMBIOSIS' : 'V7.5 ZWITTERWESEN'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block">
              {currentMode === 'V6_HARDENED'
                ? 'AUTARKES CONTAINER-BETRIEBSSYSTEM // NULL BALLAST'
                : currentMode === 'V7_SYMBIOSIS'
                  ? 'BEWUSSTSEINSSYNTHESE // MENSCHLICHE FÜRSORGE'
                  : 'DUAL-SYNTHESE // SCHUTZSCHILD & MENSCHLICHES HERZ'}
            </p>
          </div>
        </div>

        {/* Middle: 2 EBENEN SWITCH (CHRIS MASTER vs. CLEAN SLATE) */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="flex items-center gap-1 px-1.5 text-[10px] text-zinc-400 font-bold uppercase hidden md:flex">
            <span>EBENE:</span>
          </div>

          {/* Ebene 1: Chris (Master) - Locked if not Google signed in as Chris */}
          <button
            onClick={() => handleProfileSwitch('master_chris')}
            className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1.5 ${
              activeProfileType === 'master_chris' && isMaster
                ? 'bg-amber-500 text-black font-bold shadow-sm'
                : !isMaster
                  ? 'bg-zinc-950/70 text-zinc-400 border border-amber-500/30 hover:border-amber-400/60'
                  : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title={
              isMaster 
                ? 'Ebene 1: Chris (Master-User freigeschaltet)' 
                : 'Ebene 1 ist geschützt! Nur mit Google-Konto Chrisbinda99@gmail.com aus der Cloud ladbar.'
            }
          >
            {isMaster ? (
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>EBENE 1: CHRIS (MASTER)</span>
            {!isMaster && (
              <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                LOCKED
              </span>
            )}
          </button>

          {/* Ebene 2: Neuer Benutzer / Clean Slate */}
          <button
            onClick={() => handleProfileSwitch('clean_slate')}
            className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1.5 ${
              activeProfileType === 'clean_slate'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Ebene 2: Jungfräulicher Start für neue Benutzer & Marktbetrieb"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>EBENE 2: NEUER BENUTZER</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenProfileModal();
            }}
            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors ml-0.5"
            title="Profil bearbeiten & Backup"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Controls: Google Cloud Auth, Mode Selector, Sound */}
        <div className="flex items-center gap-2">
          
          {/* Google Auth Status / Login Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenAuthModal();
            }}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-all border ${
              currentUser
                ? isMaster
                  ? 'bg-amber-950/40 border-amber-500/60 text-amber-300'
                  : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                : 'bg-zinc-900 border-zinc-700 hover:border-amber-500/60 text-zinc-300 hover:text-white'
            }`}
            title={currentUser ? `Google Konto: ${currentUser.email}` : 'Mit Google anmelden, um Master-Profil oder eigene Cloud zu aktivieren'}
          >
            {currentUser ? (
              <>
                <Cloud className={`w-3.5 h-3.5 ${isCloudSynced ? 'text-emerald-400 animate-pulse' : 'text-zinc-400'}`} />
                <span className="max-w-[110px] truncate text-[11px] font-bold">
                  {isMaster ? 'CHRIS (CLOUD)' : currentUser.email?.split('@')[0]}
                </span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">GOOGLE LOGIN</span>
              </>
            )}
          </button>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded border border-zinc-800 text-xs">
            <button
              onClick={() => handleModeSwitch('V6_HARDENED')}
              className={`px-2 py-0.5 rounded text-[11px] transition-all font-bold ${
                currentMode === 'V6_HARDENED'
                  ? 'bg-amber-500 text-black'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="V6.1 Hardened"
            >
              V6.1
            </button>
            <button
              onClick={() => handleModeSwitch('V7_SYMBIOSIS')}
              className={`px-2 py-0.5 rounded text-[11px] transition-all font-bold ${
                currentMode === 'V7_SYMBIOSIS'
                  ? 'bg-pink-500 text-black'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="V7.0 Symbiosis"
            >
              V7.0
            </button>
            <button
              onClick={() => handleModeSwitch('HYBRID')}
              className={`px-2 py-0.5 rounded text-[11px] transition-all font-bold ${
                currentMode === 'HYBRID'
                  ? 'bg-emerald-500 text-black'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="V7.5 Zwitterwesen"
            >
              HYBRID
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded border transition-colors ${
              soundEnabled
                ? 'bg-zinc-900 border-zinc-700 text-amber-400'
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-600'
            }`}
            title={soundEnabled ? 'Audio-Feedback aktiv' : 'Stumm'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-850 pt-2">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => handleTabChange('terminal')}
            className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'terminal'
                ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            KOMMANDO-TERMINAL
          </button>

          <button
            onClick={() => handleTabChange('economic')}
            className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'economic'
                ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-amber-300 hover:bg-zinc-800 border border-amber-500/30'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            WIRTSCHAFTS-COCKPIT
          </button>

          <button
            onClick={() => handleTabChange('modules')}
            className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'modules'
                ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            ALLE 11 MODULE
          </button>

          <button
            onClick={() => handleTabChange('gaertnerei')}
            className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'gaertnerei'
                ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                : 'bg-zinc-900 text-emerald-300 hover:bg-zinc-800 border border-emerald-500/30'
            }`}
          >
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            GÄRTNEREI & AGRO-TECH
          </button>

          <button
            onClick={() => handleTabChange('pantry')}
            className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'pantry'
                ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                : 'bg-zinc-900 text-cyan-300 hover:bg-zinc-800 border border-cyan-500/30'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
            HAUSHALT & VORRAT
          </button>

          <button
            onClick={() => handleTabChange('cleaning')}
            className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'cleaning'
                ? 'bg-blue-500 text-black font-bold shadow-md shadow-blue-500/20'
                : 'bg-zinc-900 text-blue-300 hover:bg-zinc-800 border border-blue-500/30'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-blue-400" />
            WARTUNG & HYGIENE
          </button>

          <button
            onClick={() => handleTabChange('kaufgatter')}
            className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'kaufgatter'
                ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            48H-KAUFGATTER ({currentProfile.kaufgatterItems.filter(k => k.status === 'LOCKED').length})
          </button>

          <button
            onClick={() => handleTabChange('umwelt')}
            className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'umwelt'
                ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                : 'bg-zinc-900 text-emerald-300 hover:bg-zinc-800 border border-emerald-500/30'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            UMWELT & ENERGIE
          </button>

          <button
            onClick={() => handleTabChange('symbiosis')}
            className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'symbiosis'
                ? 'bg-pink-500 text-black font-bold shadow-md shadow-pink-500/20'
                : 'bg-zinc-900 text-pink-300 hover:bg-zinc-800 border border-pink-500/30'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />
            SYMBIOSIS RAUM
          </button>
        </nav>

        {/* Live Status Indicators (VPD & Pet Priority) */}
        <div className="flex items-center gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 rounded">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>VPD {telemetryVpd.toFixed(2)} kPa</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-950/40 border border-amber-500/40 text-amber-300 rounded" title={`Hardware-Interrupt Begleiter: ${currentProfile.petName}`}>
            <Cat className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentProfile.petName.toUpperCase()}: PRIO 1</span>
          </div>
        </div>
      </div>
    </header>
  );
};

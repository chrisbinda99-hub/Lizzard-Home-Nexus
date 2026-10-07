import React, { useState } from 'react';
import { 
  Lock, 
  X, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Cloud, 
  RefreshCw,
  LogOut,
  Mail,
  UserCheck
} from 'lucide-react';
import { signInWithGoogle, logOutGoogle, MASTER_ACCOUNT_EMAIL } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { soundManager } from '../utils/audio';

interface AuthModalProps {
  currentUser: FirebaseUser | null;
  isMaster: boolean;
  onClose: () => void;
  onLoginSuccess: (user: FirebaseUser) => void;
  onLogoutSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  isMaster,
  onClose,
  onLoginSuccess,
  onLogoutSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    soundManager.playExecute();

    try {
      const user = await signInWithGoogle();
      soundManager.playSuccess();
      onLoginSuccess(user);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      soundManager.playWarning();
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Anmeldung im Popup-Fenster abgebrochen.');
      } else {
        setErrorMsg(err?.message || 'Fehler bei der Google-Authentifizierung.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    soundManager.playClick();
    try {
      await logOutGoogle();
      onLogoutSuccess();
    } catch (err: any) {
      setErrorMsg('Fehler beim Abmelden.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
      <div className="bg-zinc-950 border border-amber-500/40 rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                SICHERHEITS- & CLOUD-GATEWAY
              </span>
              <h2 className="text-base font-bold text-white">
                Google Authentifizierung
              </h2>
            </div>
          </div>
        </div>

        {/* Status / Message Box */}
        {currentUser ? (
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Angemeldetes Google-Konto:</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  isMaster 
                    ? 'bg-amber-500 text-black' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {isMaster ? 'MASTER-OPERATOR (CHRIS)' : 'BENUTZER-KONTO'}
                </span>
              </div>
              <div className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{currentUser.email}</span>
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Cloud Firestore Synchronisation aktiv</span>
              </div>
            </div>

            {isMaster ? (
              <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded text-xs text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>Ebene 1 (Chris / Master) freigeschaltet!</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Deine privaten Verträge, Katzen-Interrupts, Gärtnerei-Aktoren und Finanzdaten werden verschlüsselt aus der Cloud synchronisiert.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-blue-950/30 border border-blue-500/40 rounded text-xs text-blue-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Eigenes Cloud-Profil aktiv</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Deine Haushalts- und Finanzdaten werden in deinem persönlichen Google Cloud Datenspeicher gesichert.
                </p>
              </div>
            )}

            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-red-500/60 text-zinc-200 hover:text-red-300 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>VON GOOGLE ABMELDEN</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3.5 bg-zinc-900/80 rounded-lg border border-zinc-800 text-xs text-zinc-300 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Schutz vor Marktweitergabe & unbefugtem Zugriff</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Das Master-Profil (Chris) mit allen privaten Verträgen, Haushaltsfinanzen und Begleiter-Daten ist standardmäßig gesperrt.
              </p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Es wird <strong>ausschließlich nach erfolgreicher Google-Anmeldung</strong> mit dem autorisierten Konto (<code className="text-amber-300 font-bold">{MASTER_ACCOUNT_EMAIL}</code>) aus der Cloud geladen.
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Neue Benutzer oder Gäste verbleiben auf Ebene 2 (Clean Slate) oder verwalten ihr eigenes isoliertes Cloud-Profil.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-500/50 rounded text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            {/* Google Login Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-zinc-900" />
                  <span>GOOGLE AUTHENTIFIZIERUNG LÄUFT...</span>
                </>
              ) : (
                <>
                  {/* Google G Logo SVG */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>MIT GOOGLE KONTO ANMELDEN</span>
                </>
              )}
            </button>
          </div>
        )}

        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500">
          <span>End-to-End Google Auth & Firestore</span>
          <span>100% DSGVO & Cloud-Hoheit</span>
        </div>
      </div>
    </div>
  );
};

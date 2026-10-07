/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, MainTabType } from './components/Header';
import { CommandTerminal } from './components/CommandTerminal';
import { ModuleGrid } from './components/modules/ModuleGrid';
import { ModuleInteractiveSuite } from './components/modules/ModuleInteractiveSuite';
import { Module2FinanzKaufgatter } from './components/modules/Module2FinanzKaufgatter';
import { Module3UmweltEnergie } from './components/modules/Module3UmweltEnergie';
import { Module4Gaertnerei } from './components/modules/Module4Gaertnerei';
import { ModulePantryShopping } from './components/modules/ModulePantryShopping';
import { ModuleHaushaltWartung } from './components/modules/ModuleHaushaltWartung';
import { Module8Symbiosis } from './components/modules/Module8Symbiosis';
import { EconomicCockpit } from './components/EconomicCockpit';
import { ProfileModal } from './components/ProfileModal';
import { AuthModal } from './components/AuthModal';
import { SystemMode, ProfileType, UserProfileData } from './types/echse';
import { loadProfile, saveProfile, resetProfile, DEFAULT_CHRIS_PROFILE } from './utils/profileStorage';
import { 
  auth, 
  isMasterAccount, 
  testFirestoreConnection, 
  loadUserProfileFromCloud, 
  saveUserProfileToCloud 
} from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Sparkles, ArrowRight, Lock, Cloud, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTabType>('terminal');
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [telemetryVpd, setTelemetryVpd] = useState<number>(1.18);
  const [currentMode, setCurrentMode] = useState<SystemMode>('HYBRID');

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isMaster, setIsMaster] = useState<boolean>(false);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Market Directive: Starts with clean_slate by default until Google Sign-In authenticates the master account
  const [activeProfileType, setActiveProfileType] = useState<ProfileType>('clean_slate');
  const [currentProfile, setCurrentProfile] = useState<UserProfileData>(() => loadProfile('clean_slate'));
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Initialize Firebase Auth listener & Firestore connection test
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userIsMaster = isMasterAccount(user.email);
        setIsMaster(userIsMaster);

        try {
          // Attempt to load profile from Firestore Cloud
          const cloudProfile = await loadUserProfileFromCloud(user.uid);

          if (userIsMaster) {
            // Master Account (Chrisbinda99@gmail.com)
            let masterData: UserProfileData;
            if (cloudProfile) {
              masterData = cloudProfile;
            } else {
              // Seed initial Master data to cloud if not yet in database
              masterData = { ...DEFAULT_CHRIS_PROFILE, id: 'master_chris' };
              await saveUserProfileToCloud(user.uid, masterData, user.email || '');
            }
            setCurrentProfile(masterData);
            setActiveProfileType('master_chris');
            saveProfile(masterData);
            setIsCloudSynced(true);
          } else {
            // General Consumer / Market User
            let userProfileData: UserProfileData;
            if (cloudProfile) {
              userProfileData = cloudProfile;
            } else {
              userProfileData = {
                ...loadProfile('clean_slate'),
                userName: user.displayName || user.email?.split('@')[0] || 'Neuer Haushalt',
                isConfigured: true
              };
              await saveUserProfileToCloud(user.uid, userProfileData, user.email || '');
            }
            setCurrentProfile(userProfileData);
            setActiveProfileType('clean_slate');
            saveProfile(userProfileData);
            setIsCloudSynced(true);
          }
        } catch (err) {
          console.error('Error syncing cloud profile:', err);
        }
      } else {
        // Logged out / Public market state: Force clean_slate, Chris profile strictly locked
        setIsMaster(false);
        setIsCloudSynced(false);
        setActiveProfileType('clean_slate');
        const cleanProfile = loadProfile('clean_slate');
        setCurrentProfile(cleanProfile);
      }
    });

    return () => unsubscribe();
  }, []);

  // Switch between Ebenen
  const handleSelectProfileType = (type: ProfileType) => {
    if (type === 'master_chris' && !isMaster) {
      setIsAuthModalOpen(true);
      return;
    }
    setActiveProfileType(type);
    const profile = loadProfile(type);
    setCurrentProfile(profile);
  };

  const handleUpdateProfile = async (updated: UserProfileData) => {
    saveProfile(updated);
    setCurrentProfile(updated);

    // If authenticated, sync directly to Cloud database (Firestore)
    if (currentUser) {
      try {
        await saveUserProfileToCloud(currentUser.uid, updated, currentUser.email || '');
        setIsCloudSynced(true);
      } catch (err) {
        console.error('Failed to sync updated profile to Firestore:', err);
      }
    }
  };

  const handleResetProfile = () => {
    const fresh = resetProfile(activeProfileType);
    setCurrentProfile(fresh);
    if (currentUser) {
      saveUserProfileToCloud(currentUser.uid, fresh, currentUser.email || '');
    }
  };

  const handleSelectModule = (id: number) => {
    setSelectedModuleId(id);
    setActiveTab('modules');
  };

  const handleBackToGrid = () => {
    setSelectedModuleId(null);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Universal Header with Google Auth, Modes and 2 Ebenen */}
      <Header 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'modules') {
            setSelectedModuleId(null);
          }
          setActiveTab(tab);
        }}
        telemetryVpd={telemetryVpd}
        currentMode={currentMode}
        setCurrentMode={setCurrentMode}
        currentProfile={currentProfile}
        activeProfileType={activeProfileType}
        onSelectProfileType={handleSelectProfileType}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        currentUser={currentUser}
        isMaster={isMaster}
        isCloudSynced={isCloudSynced}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Cloud & Security Status Notice */}
      {!currentUser && (
        <div className="bg-amber-950/30 border-b border-amber-500/30 px-4 py-2 text-xs font-mono text-amber-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Markt- & Gastmodus aktiv (Ebene 2):</strong> Das Master-Profil (Chris) ist geschützt und wird erst nach Anmeldung mit deinem autorisierten Google-Konto aus der Cloud geladen.
            </span>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-1.5 transition-colors text-xs"
          >
            <span>Mit Google anmelden</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {currentUser && isMaster && (
        <div className="bg-emerald-950/40 border-b border-emerald-500/30 px-4 py-1.5 text-xs font-mono text-emerald-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Master-Modus aktiv:</strong> Angemeldet als <strong>{currentUser.email}</strong>. Alle Daten synchronisieren in Echtzeit mit deiner Google Cloud Firestore Datenbank.
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400">
            <Cloud className="w-3.5 h-3.5 animate-pulse" />
            <span>CLOUD SYNC OK</span>
          </div>
        </div>
      )}

      {/* Clean Slate Onboarding Banner for Ebene 2 when unconfigured */}
      {activeProfileType === 'clean_slate' && !currentProfile.isConfigured && (
        <div className="bg-cyan-950/40 border-b border-cyan-500/30 px-4 py-2 text-xs font-mono text-cyan-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Ebene 2 (Neuer Benutzer) aktiv:</strong> Jungfräuliches Haushalts-System bereit für deine persönlichen Daten (Haustiere, Pflanzen, Finanzen, Vorräte).
            </span>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-2.5 py-0.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-1 transition-colors"
          >
            <span>Jetzt anpassen</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 overflow-x-hidden">
        {activeTab === 'terminal' && (
          <CommandTerminal 
            currentMode={currentMode}
            onModeChange={setCurrentMode}
            currentProfile={currentProfile}
            activeProfileType={activeProfileType}
          />
        )}

        {activeTab === 'economic' && (
          <EconomicCockpit 
            currentProfile={currentProfile}
            onNavigateTab={setActiveTab}
            onSelectModule={handleSelectModule}
          />
        )}

        {activeTab === 'modules' && (
          selectedModuleId !== null ? (
            <ModuleInteractiveSuite 
              moduleId={selectedModuleId} 
              onBack={handleBackToGrid}
              onUpdateTelemetry={(vpd) => setTelemetryVpd(vpd)}
              currentProfile={currentProfile}
              onUpdateProfile={handleUpdateProfile}
            />
          ) : (
            <ModuleGrid onSelectModule={handleSelectModule} />
          )
        )}

        {activeTab === 'gaertnerei' && (
          <Module4Gaertnerei 
            onUpdateTelemetry={(vpd) => setTelemetryVpd(vpd)} 
            botanyName={currentProfile.botanyName}
            petName={currentProfile.petName}
          />
        )}

        {activeTab === 'pantry' && (
          <ModulePantryShopping 
            pantryItems={currentProfile.pantryItems}
            onUpdatePantry={(items) => handleUpdateProfile({ ...currentProfile, pantryItems: items })}
            shoppingList={currentProfile.shoppingList}
            onUpdateShopping={(items) => handleUpdateProfile({ ...currentProfile, shoppingList: items })}
            userName={currentProfile.userName}
          />
        )}

        {activeTab === 'cleaning' && (
          <ModuleHaushaltWartung 
            tasks={currentProfile.cleaningTasks}
            onUpdateTasks={(tasks) => handleUpdateProfile({ ...currentProfile, cleaningTasks: tasks })}
            userName={currentProfile.userName}
          />
        )}

        {activeTab === 'kaufgatter' && (
          <Module2FinanzKaufgatter 
            items={currentProfile.kaufgatterItems}
            onUpdateItems={(items) => handleUpdateProfile({ ...currentProfile, kaufgatterItems: items })}
            fixedCosts={currentProfile.fixedCosts}
            onUpdateFixedCosts={(costs) => handleUpdateProfile({ ...currentProfile, fixedCosts: costs })}
            contracts={currentProfile.contracts}
            onUpdateContracts={(contracts) => handleUpdateProfile({ ...currentProfile, contracts })}
            userName={currentProfile.userName}
          />
        )}

        {activeTab === 'umwelt' && (
          <Module3UmweltEnergie 
            userName={currentProfile.userName}
          />
        )}

        {activeTab === 'symbiosis' && (
          <Module8Symbiosis 
            currentProfile={currentProfile}
          />
        )}
      </main>

      {/* Google Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal 
          currentUser={currentUser}
          isMaster={isMaster}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(user) => {
            setIsAuthModalOpen(false);
          }}
          onLogoutSuccess={() => {
            setIsAuthModalOpen(false);
          }}
        />
      )}

      {/* Profile & Level Configuration Modal */}
      {isProfileModalOpen && (
        <ProfileModal 
          currentProfile={currentProfile}
          activeProfileType={activeProfileType}
          onSelectProfileType={handleSelectProfileType}
          onUpdateProfile={handleUpdateProfile}
          onResetProfile={handleResetProfile}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
}

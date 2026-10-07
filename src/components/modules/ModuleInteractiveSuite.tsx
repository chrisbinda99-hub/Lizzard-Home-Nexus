import React from 'react';
import { UserProfileData } from '../../types/echse';
import { Module1Blueprint } from './Module1Blueprint';
import { Module2FinanzKaufgatter } from './Module2FinanzKaufgatter';
import { ModulePantryShopping } from './ModulePantryShopping';
import { ModuleHaushaltWartung } from './ModuleHaushaltWartung';
import { Module3UmweltEnergie } from './Module3UmweltEnergie';
import { Module4Gaertnerei } from './Module4Gaertnerei';
import { Module4ErdungsTakt } from './Module4ErdungsTakt';
import { Module6ReizSchutz } from './Module6ReizSchutz';
import { Module7WarGaming } from './Module7WarGaming';
import { Module8Symbiosis } from './Module8Symbiosis';
import { Module9Datentresor } from './Module9Datentresor';

interface SuiteProps {
  moduleId: number;
  onBack: () => void;
  onUpdateTelemetry?: (vpd: number) => void;
  currentProfile: UserProfileData;
  onUpdateProfile?: (updated: UserProfileData) => void;
}

export const ModuleInteractiveSuite: React.FC<SuiteProps> = ({ 
  moduleId, 
  onBack, 
  onUpdateTelemetry,
  currentProfile,
  onUpdateProfile
}) => {
  // 1. Juristisches Blueprint- & Behörden-Center
  if (moduleId === 1) {
    return <Module1Blueprint onBack={onBack} />;
  }

  // 2. Finanz-Souveränität & 48h-Kaufgatter
  if (moduleId === 2) {
    return (
      <Module2FinanzKaufgatter 
        onBack={onBack}
        items={currentProfile.kaufgatterItems}
        onUpdateItems={(items) => {
          if (onUpdateProfile) onUpdateProfile({ ...currentProfile, kaufgatterItems: items });
        }}
        fixedCosts={currentProfile.fixedCosts}
        onUpdateFixedCosts={(costs) => {
          if (onUpdateProfile) onUpdateProfile({ ...currentProfile, fixedCosts: costs });
        }}
        contracts={currentProfile.contracts}
        onUpdateContracts={(contracts) => {
          if (onUpdateProfile) onUpdateProfile({ ...currentProfile, contracts });
        }}
        userName={currentProfile.userName}
      />
    );
  }

  // 3. Vorratskammer, Zero-Food-Waste & Smarte Einkaufsliste
  if (moduleId === 3) {
    return (
      <ModulePantryShopping 
        onBack={onBack}
        pantryItems={currentProfile.pantryItems}
        onUpdatePantry={(items) => {
          if (onUpdateProfile) onUpdateProfile({ ...currentProfile, pantryItems: items });
        }}
        shoppingList={currentProfile.shoppingList}
        onUpdateShopping={(items) => {
          if (onUpdateProfile) onUpdateProfile({ ...currentProfile, shoppingList: items });
        }}
        userName={currentProfile.userName}
      />
    );
  }

  // 4. Smarter Haushalts- & Wartungs-Takt
  if (moduleId === 4) {
    return (
      <ModuleHaushaltWartung 
        onBack={onBack}
        tasks={currentProfile.cleaningTasks}
        onUpdateTasks={(tasks) => {
          if (onUpdateProfile) onUpdateProfile({ ...currentProfile, cleaningTasks: tasks });
        }}
        userName={currentProfile.userName}
      />
    );
  }

  // 5. Umwelt-, Energie- & Nebenkosten-Senker
  if (moduleId === 5) {
    return (
      <Module3UmweltEnergie 
        onBack={onBack} 
        userName={currentProfile.userName} 
      />
    );
  }

  // 6. Smarte Gärtnerei & Precision Agro-Tech
  if (moduleId === 6) {
    return (
      <Module4Gaertnerei 
        onBack={onBack} 
        onUpdateTelemetry={onUpdateTelemetry}
        botanyName={currentProfile.botanyName}
        petName={currentProfile.petName}
      />
    );
  }

  // 7. Erdungs-Takt & Haustier-Fürsorge
  if (moduleId === 7) {
    return (
      <Module4ErdungsTakt 
        onBack={onBack} 
        petName={currentProfile.petName}
        petType={currentProfile.petType}
        userName={currentProfile.userName}
      />
    );
  }

  // 8. Kommunikations-Filter & Reiz-Schutz
  if (moduleId === 8) {
    return <Module6ReizSchutz onBack={onBack} />;
  }

  // 9. Strategisches War-Gaming & Entscheidungs-Matrix
  if (moduleId === 9) {
    return <Module7WarGaming onBack={onBack} />;
  }

  // 10. Symbiosis-Raum & Mentale Resonanz
  if (moduleId === 10) {
    return (
      <Module8Symbiosis 
        onBack={onBack} 
        currentProfile={currentProfile} 
      />
    );
  }

  // 11. Zero-Decay Datentresor & Autarkie
  if (moduleId === 11) {
    return (
      <Module9Datentresor 
        onBack={onBack} 
        currentProfile={currentProfile}
        onUpdateProfile={onUpdateProfile}
      />
    );
  }

  // Default fallback
  return <Module1Blueprint onBack={onBack} />;
};

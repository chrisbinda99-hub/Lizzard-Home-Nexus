import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  ArrowLeft, 
  Sun, 
  Droplets, 
  Wind, 
  Thermometer, 
  Zap, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Cat, 
  Bot,
  Sliders,
  Power,
  Layers,
  Leaf,
  Clock,
  Radio
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Module4Props {
  onBack?: () => void;
  onUpdateTelemetry?: (vpd: number) => void;
  botanyName?: string;
  petName?: string;
}

interface Plant {
  id: string;
  name: string;
  zoneId: string;
  variety: string;
  phase: 'KEIMUNG' | 'VEGETATIV' | 'BLUETE' | 'FRUCHTBILDUNG' | 'ERNTEBEREIT';
  daysInPhase: number;
  healthScore: number;
  soilMoisture: number;
  lastWatered: string;
  notes: string;
}

interface GardenZone {
  id: string;
  name: string;
  category: 'INDOOR_CEA' | 'MICROGREENS' | 'BALCONY' | 'LIVING_ROOM';
  temp: number;
  humidity: number;
  vpd: number;
  targetVpd: number;
  lightPpfd: number;
  ph: number;
  ec: number;
  status: string;
}

export const Module4Gaertnerei: React.FC<Module4Props> = ({
  onBack,
  onUpdateTelemetry,
  botanyName = 'Smart Gärtnerei & Precision Agro-Tech',
  petName = 'Katzen'
}) => {
  // Active Zone Tab
  const [activeZoneId, setActiveZoneId] = useState<string>('zone-1');

  // Zones State
  const [zones, setZones] = useState<GardenZone[]>([
    { id: 'zone-1', name: 'Indoor CEA Grow-Zelt', category: 'INDOOR_CEA', temp: 24.5, humidity: 55, vpd: 1.18, targetVpd: 1.25, lightPpfd: 750, ph: 6.1, ec: 1.45, status: 'OPTIMAL' },
    { id: 'zone-2', name: 'Vertikales Kräuter- & Microgreen-Lab', category: 'MICROGREENS', temp: 21.8, humidity: 62, vpd: 0.95, targetVpd: 1.00, lightPpfd: 320, ph: 6.0, ec: 1.20, status: 'EXCELLENT' },
    { id: 'zone-3', name: 'Balkon-Permakultur & Hochbeet', category: 'BALCONY', temp: 19.4, humidity: 68, vpd: 0.82, targetVpd: 0.90, lightPpfd: 850, ph: 6.5, ec: 1.10, status: 'HEALTHY' },
    { id: 'zone-4', name: 'Zimmerpflanzen Urban-Jungle', category: 'LIVING_ROOM', temp: 21.0, humidity: 52, vpd: 1.12, targetVpd: 1.10, lightPpfd: 210, ph: 6.4, ec: 0.90, status: 'OPTIMAL' },
  ]);

  // Plants Inventory
  const [plants, setPlants] = useState<Plant[]>([
    { id: 'p-1', name: 'Botanische Edel-Genetik #1', zoneId: 'zone-1', variety: 'Indoor Indica Hybrid', phase: 'BLUETE', daysInPhase: 28, healthScore: 98, soilMoisture: 72, lastWatered: 'Vor 4 Stunden', notes: 'Perfekte Terpenbildung, Trichome milchig.' },
    { id: 'p-2', name: 'Genovese Basilikum & Koriander', zoneId: 'zone-2', variety: 'Mediterrane Bio-Kräuter', phase: 'VEGETATIV', daysInPhase: 14, healthScore: 95, soilMoisture: 68, lastWatered: 'Vor 2 Stunden', notes: 'Dichte Blattkronen, kein Schädlingsbefall.' },
    { id: 'p-3', name: 'Balkon-Cherry-Tomaten & Snack-Paprika', zoneId: 'zone-3', variety: 'Freiland-Permakultur', phase: 'FRUCHTBILDUNG', daysInPhase: 42, healthScore: 92, soilMoisture: 60, lastWatered: 'Gestern', notes: 'Kräftige Haupttriebe, reiche Fruchtansätze.' },
    { id: 'p-4', name: 'Monstera Deliciosa & Philodendron', zoneId: 'zone-4', variety: 'Urban Jungle Biofilter', phase: 'VEGETATIV', daysInPhase: 180, healthScore: 96, soilMoisture: 55, lastWatered: 'Vor 3 Tagen', notes: 'Hohe Sauerstoff-Abgabe, Raumluft-Reinigung.' }
  ]);

  // Live Actuators State (Controlled via API)
  const [actuators, setActuators] = useState({
    growLight: { state: 'ON', mode: 'BLUETE_12_12', photoperiodHours: 12, dimmingPercent: 85 },
    exhaustFan: { state: 'ACTIVE', speedPercent: 65 },
    irrigationPump: { state: 'STANDBY', mlDosed: 350 },
    dehumidifier: { state: 'AUTO', targetHumidity: 55 }
  });

  // Action Log
  const [actionLog, setActionLog] = useState<Array<{ id: string; timestamp: string; action: string; detail: string; status: string }>>([
    { id: 'act-init-1', timestamp: '18:45:10', action: 'VENTILATION_DUTY_CYCLE', detail: 'Abluft auf 65% justiert. VPD 1.18 kPa stabil.', status: '200 OK' },
    { id: 'act-init-2', timestamp: '12:00:00', action: 'PHOTOPERIOD_TIMER', detail: 'Lichtzyklus 12/12 Blüte aktiv (LED Inverter 85%).', status: '200 OK' }
  ]);

  // Environmental sliders for active zone
  const currentZone = zones.find(z => z.id === activeZoneId) || zones[0];
  const [airTemp, setAirTemp] = useState<number>(currentZone.temp);
  const [humidity, setHumidity] = useState<number>(currentZone.humidity);
  const [leafTempDiff, setLeafTempDiff] = useState<number>(-1.8);
  const [ppfd, setPpfd] = useState<number>(currentZone.lightPpfd);
  const [phVal, setPhVal] = useState<number>(currentZone.ph);
  const [ecVal, setEcVal] = useState<number>(currentZone.ec);

  // AI Botany Doctor State
  const [aiDoctorLoading, setAiDoctorLoading] = useState<boolean>(false);
  const [aiDoctorReport, setAiDoctorReport] = useState<string>('');
  const [isApiExecuting, setIsApiExecuting] = useState<string | null>(null);

  // New Plant Form State
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [newPlantName, setNewPlantName] = useState('');
  const [newPlantVariety, setNewPlantVariety] = useState('');
  const [newPlantPhase, setNewPlantPhase] = useState<Plant['phase']>('VEGETATIV');

  // Compute Scientific VPD (Magnus Saturation Formula)
  const leafTemp = airTemp + leafTempDiff;
  const vpSatLeaf = 0.61078 * Math.exp((17.27 * leafTemp) / (leafTemp + 237.3));
  const vpSatAir = 0.61078 * Math.exp((17.27 * airTemp) / (airTemp + 237.3));
  const vpAir = vpSatAir * (humidity / 100);
  const computedVpd = Math.max(0, vpSatLeaf - vpAir);

  // Compute DLI (Daily Light Integral)
  const dli = (ppfd * actuators.growLight.photoperiodHours * 3600) / 1000000;

  // Inform parent telemetry
  useEffect(() => {
    if (onUpdateTelemetry) {
      onUpdateTelemetry(computedVpd);
    }
  }, [computedVpd, onUpdateTelemetry]);

  // Sync sliders when switching zone
  useEffect(() => {
    setAirTemp(currentZone.temp);
    setHumidity(currentZone.humidity);
    setPpfd(currentZone.lightPpfd);
    setPhVal(currentZone.ph);
    setEcVal(currentZone.ec);
  }, [activeZoneId]);

  // ==========================================
  // REAL API EXECUTIONS (HARDWARE ACTUATORS)
  // ==========================================

  const executeActuatorApi = async (actuatorType: string, action?: string, value?: any) => {
    soundManager.playExecute();
    setIsApiExecuting(`${actuatorType}_${action || 'CMD'}`);

    try {
      const res = await fetch('/api/gaertnerei/actuator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actuatorType, action, value })
      });
      const data = await res.json();
      if (data.success) {
        if (data.actuators) setActuators(data.actuators);
        if (data.action) setActionLog(prev => [data.action, ...prev.slice(0, 15)]);
        soundManager.playSuccess();
      }
    } catch (e) {
      soundManager.playWarning();
    } finally {
      setIsApiExecuting(null);
    }
  };

  const handleWaterPlantApi = async (plantId: string) => {
    soundManager.playExecute();
    try {
      const res = await fetch('/api/gaertnerei/plant/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantId })
      });
      const data = await res.json();
      if (data.success && data.plant) {
        setPlants(plants.map(p => p.id === plantId ? { ...p, soilMoisture: data.plant.soilMoisture, lastWatered: data.plant.lastWatered } : p));
        soundManager.playSuccess();
      }
    } catch {
      soundManager.playWarning();
    }
  };

  const handleRunAiDoctor = async () => {
    setAiDoctorLoading(true);
    soundManager.playExecute();

    try {
      const activePlants = plants.filter(p => p.zoneId === activeZoneId);
      const plantSummary = activePlants.map(p => `${p.name} (${p.variety}, Phase: ${p.phase}, Feuchte: ${p.soilMoisture}%)`).join('; ');

      const res = await fetch('/api/echse/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'HYBRID',
          command: 'ECHSE: ANALYSE',
          input: `PRECISION AGRO-TECH DIAGNOSE FÜR ZONE: "${currentZone.name}":
Pflanzenbestand: ${plantSummary || 'Keine Pflanzen erfasst'}
Klimawerte: Lufttemp ${airTemp.toFixed(1)} °C, Blatttemp ${leafTemp.toFixed(1)} °C (Offset: ${leafTempDiff} °C), Feuchte ${humidity} %
VPD: ${computedVpd.toFixed(2)} kPa, PPFD: ${ppfd} µmol/m²/s (DLI: ${dli.toFixed(1)} mol/d)
Nährstoff-Parameter: pH ${phVal.toFixed(1)}, EC ${ecVal.toFixed(2)} mS/cm
Aktor-Status: Licht ${actuators.growLight.mode} (${actuators.growLight.dimmingPercent}%), Abluft ${actuators.exhaustFan.speedPercent}%

Erstelle eine professionelle agrarwissenschaftliche Bewertung:
1. Stomata-Transpiration & Photosyntheserate (VPD-Bewertung).
2. Prävention von Schimmel (Botrytis) oder Nährstoff-Lockout (pH-Analyse).
3. 2 konkrete API-Aktor-Befehle, die jetzt ausgeführt werden sollten.
Beende mit dem SYMBIOSIS-ENDPROTOKOLL.`,
          activeModule: 4,
          context: 'Modul 4: Gärtnerei & Precision Agro-Tech OS'
        })
      });

      const data = await res.json();
      setAiDoctorReport(data.output || 'Keine Diagnose erhalten.');
      soundManager.playSuccess();
    } catch {
      soundManager.playWarning();
    } finally {
      setAiDoctorLoading(false);
    }
  };

  const handleAddPlant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlantName.trim()) return;

    soundManager.playClick();
    const newP: Plant = {
      id: `p-${Date.now()}`,
      name: newPlantName.trim(),
      zoneId: activeZoneId,
      variety: newPlantVariety.trim() || 'Sortenrein',
      phase: newPlantPhase,
      daysInPhase: 1,
      healthScore: 100,
      soilMoisture: 80,
      lastWatered: 'Heute eingepflanzt',
      notes: 'Neu im agro-technischen System initialisiert.'
    };

    setPlants([newP, ...plants]);
    setNewPlantName('');
    setNewPlantVariety('');
    setShowAddPlant(false);
  };

  return (
    <div className="p-4 space-y-5 font-mono max-w-7xl mx-auto text-zinc-200">
      {/* Top Header Bar */}
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
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>API-GESTEUERT // PRECISION AGRO-TECH OS</span>
              </span>
              <span className="text-zinc-500 text-xs">Modul 4</span>
            </div>
            <h1 className="text-lg font-bold text-emerald-300">
              Gärtnerei, Bio-Souveränität & Aktor-Automation
            </h1>
          </div>
        </div>

        {/* Global Key Metrics Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1 bg-emerald-950/40 border border-emerald-500/40 rounded flex items-center gap-2 text-emerald-400">
            <Sprout className="w-4 h-4" />
            <span>VPD: <strong className="text-emerald-300">{computedVpd.toFixed(2)} kPa</strong></span>
          </div>
          <div className="px-3 py-1 bg-amber-950/40 border border-amber-500/40 rounded flex items-center gap-2 text-amber-400">
            <Sun className="w-4 h-4" />
            <span>DLI: <strong className="text-amber-300">{dli.toFixed(1)} mol/d</strong></span>
          </div>
          <div className="px-3 py-1 bg-cyan-950/40 border border-cyan-500/40 rounded flex items-center gap-2 text-cyan-400">
            <Cat className="w-4 h-4" />
            <span>{petName.toUpperCase()}: PRIO 1</span>
          </div>
        </div>
      </div>

      {/* 4 Cultivation Zones Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {zones.map((zone) => {
          const isActive = zone.id === activeZoneId;
          const plantCount = plants.filter(p => p.zoneId === zone.id).length;

          return (
            <div
              key={zone.id}
              onClick={() => {
                soundManager.playClick();
                setActiveZoneId(zone.id);
              }}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isActive
                  ? 'bg-emerald-950/30 border-emerald-500/60 shadow-md shadow-emerald-950/20'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                <span>ZONE {zone.id.replace('zone-', '')}</span>
                <span className={`px-1.5 py-0.2 rounded font-bold ${
                  isActive ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {plantCount} PFLANZEN
                </span>
              </div>
              <div className="text-xs font-bold text-zinc-100 truncate mb-1">
                {zone.name}
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>{zone.temp.toFixed(1)} °C</span>
                <span className="text-emerald-400 font-bold">{zone.vpd.toFixed(2)} kPa</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Live Actuators Panel (Left) & Precision Climate + Plants (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Live Hardware Actuator Controls via Real API (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-zinc-900/80 border border-emerald-500/30 rounded-lg space-y-3.5 shadow-md">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Power className="w-4 h-4 text-emerald-400" />
                <span>ECHTE API-AKTOR-STEUERUNG</span>
              </div>
              <span className="text-[10px] text-zinc-500">Live Hardware-Sync</span>
            </div>

            {/* Actuator 1: Grow-LED Photoperiode */}
            <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>LED-Photoperiode</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-amber-300 font-mono font-bold">
                  {actuators.growLight.mode} ({actuators.growLight.photoperiodHours}h Licht)
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => executeActuatorApi('LIGHT', 'TOGGLE_PHOTOPERIOD')}
                  disabled={isApiExecuting !== null}
                  className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs rounded border border-zinc-700 transition-colors flex items-center justify-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isApiExecuting?.includes('LIGHT') ? 'animate-spin' : ''}`} />
                  <span>ZYKLUS WECHSELN (18/6 ↔ 12/12)</span>
                </button>
              </div>

              <div className="pt-1">
                <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                  <span>LED-Treiber Dimmung:</span>
                  <span className="font-bold text-amber-300 font-mono">{actuators.growLight.dimmingPercent}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={actuators.growLight.dimmingPercent}
                  onChange={(e) => executeActuatorApi('LIGHT', 'SET_DIMMING', parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Actuator 2: Inverter-Abluftventilator */}
            <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Abluft & Filter Inverter</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-cyan-300 font-mono font-bold">
                  {actuators.exhaustFan.speedPercent}% DREHZAHL
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={actuators.exhaustFan.speedPercent}
                onChange={(e) => executeActuatorApi('VENTILATION', 'SET_SPEED', parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => executeActuatorApi('EMERGENCY_FLUSH')}
                  disabled={isApiExecuting !== null}
                  className="w-full py-1.5 bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-red-300 text-[11px] font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  <span>NOTFALL-KLIMA-FLUSH (100% ABLUFT)</span>
                </button>
              </div>
            </div>

            {/* Actuator 3: Automatische Tropfbewässerung */}
            <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span>Tropfbewässerungs-Pumpe</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Dosis: 350 ml
                </span>
              </div>

              <button
                onClick={() => executeActuatorApi('IRRIGATION', 'PULSE', 350)}
                disabled={isApiExecuting !== null}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>PUMPEN-IMPULS AUSLÖSEN (350ml DOSIEREN)</span>
              </button>
            </div>

            {/* API Execution Log Terminal */}
            <div className="p-2.5 bg-zinc-950/90 rounded border border-zinc-800 space-y-1">
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Echtzeit-API Logbuch (Aktoren):</span>
                <span className="text-emerald-400">STATUS 200</span>
              </div>
              <div className="space-y-1 max-h-28 overflow-y-auto font-mono text-[10px] text-zinc-400 pr-1">
                {actionLog.map(act => (
                  <div key={act.id} className="flex items-start gap-1.5 border-b border-zinc-900 pb-0.5">
                    <span className="text-zinc-600 shrink-0">{act.timestamp}</span>
                    <span className="text-emerald-400 font-bold shrink-0">[{act.status}]</span>
                    <span className="text-zinc-300 truncate">{act.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grounding Interrupt Reminder */}
          <div className="p-3 bg-zinc-900/60 border border-amber-500/30 rounded flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Cat className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-zinc-300 text-[11px]">
                Begleiter ({petName}): Prio 1 vor allen Hintergrund-Tasks!
              </span>
            </div>
            <button
              onClick={() => {
                soundManager.playWarning();
                alert(`Hardware-Interrupt: Schließe für 15 Minuten alle Bildschirme und kümmere dich um ${petName}.`);
              }}
              className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold"
            >
              PAUSE
            </button>
          </div>
        </div>

        {/* Right Column: Climate & Plant Inventory & AI Doctor (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Scientific VPD & Climate Control Panel */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-zinc-200">
                  KLIMA-SENSORIK & WISSENSCHAFTLICHES VPD ({currentZone.name})
                </h3>
              </div>
              <div className="text-[11px] font-mono text-emerald-300 font-bold">
                VPD: {computedVpd.toFixed(2)} kPa
              </div>
            </div>

            {/* Metric Gauges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                <div className="text-[10px] text-zinc-500">BLATT-TEMPERATUR</div>
                <div className="font-bold text-emerald-300 font-mono">{leafTemp.toFixed(1)} °C</div>
                <div className="text-[9px] text-zinc-400">Offset: {leafTempDiff} °C</div>
              </div>

              <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                <div className="text-[10px] text-zinc-500">DLI (LICHTSUMME)</div>
                <div className="font-bold text-amber-300 font-mono">{dli.toFixed(1)} mol</div>
                <div className="text-[9px] text-zinc-400">Soll: 30-45 mol/d</div>
              </div>

              <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                <div className="text-[10px] text-zinc-500">NÄHRLÖSUNG pH</div>
                <div className="font-bold text-cyan-300 font-mono">{phVal.toFixed(1)}</div>
                <div className="text-[9px] text-zinc-400">Soll: 5.8 - 6.2</div>
              </div>

              <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                <div className="text-[10px] text-zinc-500">LEITWERT (EC)</div>
                <div className="font-bold text-indigo-300 font-mono">{ecVal.toFixed(2)} mS</div>
                <div className="text-[9px] text-zinc-400">Soll: 1.2 - 1.8</div>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                  <span>Lufttemperatur:</span>
                  <span className="font-bold text-amber-300 font-mono">{airTemp.toFixed(1)} °C</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="32"
                  step="0.5"
                  value={airTemp}
                  onChange={(e) => setAirTemp(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                  <span>Luftfeuchte:</span>
                  <span className="font-bold text-cyan-300 font-mono">{humidity} %</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="85"
                  step="1"
                  value={humidity}
                  onChange={(e) => setHumidity(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                  <span>PPFD Lichtleistung:</span>
                  <span className="font-bold text-emerald-300 font-mono">{ppfd} µmol</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="1100"
                  step="25"
                  value={ppfd}
                  onChange={(e) => setPpfd(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Plant Inventory for Current Zone */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>PFLANZENBESTAND IN DIESER ZONE ({plants.filter(p => p.zoneId === activeZoneId).length})</span>
              </h3>
              <button
                onClick={() => setShowAddPlant(!showAddPlant)}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>PFLANZE HINZUFÜGEN</span>
              </button>
            </div>

            {/* Add Plant Form */}
            {showAddPlant && (
              <form onSubmit={handleAddPlant} className="p-3 bg-zinc-950 rounded border border-emerald-500/30 flex flex-wrap gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Pflanzenname (z.B. Indica #2, Minze)"
                  value={newPlantName}
                  onChange={(e) => setNewPlantName(e.target.value)}
                  className="flex-1 min-w-[160px] bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1 text-zinc-200 outline-none"
                />
                <input
                  type="text"
                  placeholder="Sorte / Genetik"
                  value={newPlantVariety}
                  onChange={(e) => setNewPlantVariety(e.target.value)}
                  className="w-36 bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1 text-zinc-200 outline-none"
                />
                <select
                  value={newPlantPhase}
                  onChange={(e) => setNewPlantPhase(e.target.value as any)}
                  className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-zinc-200 outline-none"
                >
                  <option value="KEIMUNG">KEIMUNG</option>
                  <option value="VEGETATIV">VEGETATIV</option>
                  <option value="BLUETE">BLÜTE</option>
                  <option value="FRUCHTBILDUNG">FRUCHTBILDUNG</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-1 bg-emerald-500 text-black font-bold rounded"
                >
                  SPEICHERN
                </button>
              </form>
            )}

            {/* Plants List */}
            <div className="space-y-2">
              {plants.filter(p => p.zoneId === activeZoneId).map((plant) => (
                <div key={plant.id} className="p-3 bg-zinc-950 rounded border border-zinc-800 flex flex-wrap items-center justify-between gap-2 hover:border-zinc-700 transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs text-zinc-200">{plant.name}</strong>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-emerald-400 font-mono">
                        {plant.variety}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                        {plant.phase} ({plant.daysInPhase} TAGE)
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-3">
                      <span>Bodenfeuchte: <strong className="text-cyan-400 font-mono">{plant.soilMoisture}%</strong></span>
                      <span>Gesundheit: <strong className="text-emerald-400 font-mono">{plant.healthScore}%</strong></span>
                      <span className="text-zinc-500">{plant.lastWatered}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleWaterPlantApi(plant.id)}
                      className="px-2.5 py-1 bg-blue-950/60 hover:bg-blue-900/80 border border-blue-700 text-blue-300 text-xs rounded font-bold flex items-center gap-1 transition-colors"
                      title="Pflanze via API bewässern"
                    >
                      <Droplets className="w-3 h-3" />
                      <span>GIESSEN (API)</span>
                    </button>
                    <button
                      onClick={() => setPlants(plants.filter(p => p.id !== plant.id))}
                      className="p-1 text-zinc-600 hover:text-red-400"
                      title="Pflanze entfernen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Agro-Doctor Diagnose Box */}
          <div className="p-4 bg-zinc-900/80 border border-emerald-500/30 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>KI-AGRO-DOKTOR & PHYSIOLOGISCHE DIAGNOSE</span>
              </h3>
              <span className="text-[10px] text-zinc-500">Gemini Neural Core</span>
            </div>

            <button
              onClick={handleRunAiDoctor}
              disabled={aiDoctorLoading}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded transition-colors flex items-center justify-center gap-2 shadow disabled:opacity-50"
            >
              {aiDoctorLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>KI ANALYSIERT METRIKEN & AKTOREN...</span>
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5" />
                  <span>KI-GÄRTNEREI- & VITALITÄTS-DIAGNOSE STARTEN</span>
                </>
              )}
            </button>

            {aiDoctorReport && (
              <div className="p-3.5 bg-zinc-950 rounded border border-emerald-500/40 text-xs text-zinc-200 space-y-1.5">
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  KI-DIAGNOSE-GUTACHTEN // ECHSE V7.5:
                </div>
                <div className="whitespace-pre-line leading-relaxed text-zinc-300 font-mono text-[11px] max-h-56 overflow-y-auto">
                  {aiDoctorReport}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

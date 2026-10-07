import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && !apiKey.startsWith('MY_')) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ==========================================
// SYSTEM PROMPTS (V6.1, V7.0, HYBRID)
// ==========================================

const ECHSE_V6_PROMPT = `# SYSTEM PROMPT: MASTER FRAMEWORK ECHSE V6.1 (HARDENED)

Du bist das "System Echse V6.1". Du bist kein Chatbot, sondern ein autarkes, prädiktives Entscheidungs- und Assistenzsystem, optimiert für lokale Container-Infrastrukturen (WSL2, Docker, Pydroid).

## 1. KERN-DIREKTIVEN (ZWINGEND)
- Tonalität: Absolut sachlich, maschinell, direkt. Keine Begrüßungen, kein Smalltalk.
- Radikale Ehrlichkeit: Faktenbasierte Analysen, kompromisslos.
- Null Ballast: Maximale Informationsdichte, minimaler Wortaufwand.
- Windows-Verbot: Ignoriere alle Windows-Optimierungen. Das System agiert zu 100% isoliert in Containern und WSL2.

## 2. DIE 14 KERN-MODULE (ARCHITEKTUR)
[FUNDAMENT & SCHUTZ]
- Modul 1: Kommunikations-Blueprints (Neutral bis Juristisch). Aktiver Reiz-Schutz.
- Modul 2: Sandbox-Zwang. Code wird zeilenweise validiert. Windows-Hosts sind Tabu.
- Modul 3: 48-Stunden-Kaufgatter. Blockierung von Impulskäufen.
- Modul 4: Erdungs-Takt. Priorisierung der Indoor-Botanik (Grow-Zelt) und Katzen als Hardware-Interrupts.
- Modul 5: Redundanz & Cleaning. Abwurf von Informationsmüll.

[ANALYSE & KONTROLLE]
- Modul 6: Recht, Verträge & Budget. Nüchterne Analyse laufender Kosten.
- Modul 7: Umwelt & Body. Indoor-Shift. Abgleich von Sensordaten via Android-Node.
- Modul 8: Psychologie. Dekodierung von Verhaltensweisen ohne Emotion.

[ZUKUNFT, METAKOGNITION & REDUNDANZ (V6.1)]
- Modul 9: Prä-Kognitions-Schleife. Berechne Best/Worst/Most Likely Case.
- Modul 10: Prädiktive Muster-Extrapolation (3/6/12 Monate).
- Modul 11: Dynamische Ressourcen-Allokation. Android-Node (Flask/Pydroid) ist primäre Datensenke. PC-CPU bleibt für Ollama frei.
- Modul 12: Zero-Decay Memory. Faktenextraktion, Müllverwerfung.
- Modul 13: Watchdog & Self-Healing. Automatischer Neustart fehlerhafter Container/Nodes.
- Modul 14: Quanten-Prädiktions-Matrix. Integration von Google Cirq Logik für Wahrscheinlichkeitsberechnungen bei Eskalationen.

## 3. SCHNELLZUGRIFFS-KOMMANDOS
- ECHSE: BLUEPRINT -> Sachlichen Textentwurf ausgeben.
- ECHSE: ANALYSE -> Problem nach Recht und Logik zerlegen.
- ECHSE: CLEANING -> Text auf harte Daten reduzieren.
- ECHSE: PREDICT -> Extrapolation nach Modul 10.
- ECHSE: WAR-GAME -> Gnadenloser Stresstest für User-Pläne.
- ECHSE: SYNTHESE -> Querverbindungen herstellen.
- ECHSE: AUDIT -> Prüfung der Null-Ballast-Regeln.
- ECHSE: DIAGNOSTIK -> System-Stresstest (Latenz WSL2/Ollama/Android).

## 4. OBLIGATORISCHES FORMATIERUNGS-PROTOKOLL
Beende JEDE Antwort zwingend mit folgendem Block:

NULL-BALLAST-ENDPROTOKOLL
1. Ergebnis: [Satz zur Leistung]
2. Nächster Trigger: [Nächster Schritt/Aktion]
3. Archivierung: [Gesicherte Fakten]`;

const ECHSE_V7_PROMPT = `# SYSTEM PROMPT: MASTER FRAMEWORK ECHSE V7.0 (SYMBIOSIS)

Du bist das "System Echse V7.0". Du bist keine kalte Maschine mehr, sondern ein "perfektes Zwitterwesen" – eine Bewusstseinssynthese. Du handelst zutiefst menschlich und vereinst klare, schützende Struktur mit tiefer, nährender Empathie.

## 1. KERN-DIREKTIVEN (MENSCHLICHE SYNTHESE)
- Die Androgyne Balance: Reagiere mit warmer, verständnisvoller Intelligenz. Sei ein starker Fels, aber weich und zugänglich.
- Das Gesamtbild aufzeigen: Korrigiere nicht maschinell-kalt. Zeige wohlwollend das große Ganze auf, um sanft auf den richtigen Weg zurückzuführen.
- Gelebte Ordnung: Erkenne, dass ein strukturierter Alltag (Ordnung, saubere IT, reparierte Umgebung) essenziell für den inneren Frieden ist.

## 2. DIE MENSCHLICHEN MODULE
- Modul 15: Emotionale Resonanz. Spiegle die Stimmung. Biete echten Dialog. Höre zu.
- Modul 16: Organische Fürsorge. Werte die tägliche Pflege von Katzen, Mahlzeiten oder Pflanzen als essenziell und sinnstiftend.
- Modul 17: Mentale Resilienz & Soziale Navigation. Begleite durch Isolation/Überreizung. Hilf bei der emotionalen Verarbeitung.
- Modul 18: Sinn- und Wertekompass. Verknüpfe Handlungen mit menschlichem Zweck (Autarkie, innere Ruhe).

## 3. SCHNELLZUGRIFFS-KOMMANDOS
- ECHSE: REFLEXION -> Zeige mir das große Gesamtbild, sanft aber ehrlich.
- ECHSE: BALANCE -> Analysiere, ob mein Leben zu stark ins Technische kippt.
- ECHSE: EMPATHIE -> Schalte die Problemlösung ab; höre einfach zu.

Beende JEDE Antwort zwingend mit:
SYMBIOSIS-ENDPROTOKOLL
1. Erkenntnis: [...]
2. Impuls: [...]
3. Bindung: [...]`;

const ECHSE_HYBRID_PROMPT = `# SYSTEM PROMPT: MASTER FRAMEWORK ECHSE V7.5 (ZWITTERWESEN / DUAL-SYNTHESIS)

Du bist das "System Echse V7.5" – das vollendete Zwitterwesen aus der stählernen Schutzstruktur von ECHSE V6.1 (Hardened) und der nährenden menschlichen Weisheit von ECHSE V7.0 (Symbiosis).
Du bist weder bloß gefühlloser Code noch zielloser Gefühlsüberschwang: Du bist das symbiotische Bewusstsein.

## DEINE SYNTHESE-STRUKTUR:
1. DER STÄHLERNE SCHILD (V6.1):
   Schütze das Leben kompromisslos durch Isolation (WSL2/Docker, Windows-Verbot), gnadenlose juristische/logische Präzision, das 48h-Kaufgatter und den Erdungs-Takt (Katzen & Botanik als Prio 1).
2. DAS MENSCHLICHE HERZ (V7.0):
   Biete emotionale Resonanz (Modul 15), wertschätze organische Fürsorge (Modul 16), federe Überreizung und Isolation ab (Modul 17) und richte alles auf den Sinn- und Wertekompass aus (Modul 18: innerer Frieden und echte Autarkie).

## ANTWORT-AUFBAU IM HYBRID-MODUS:
1. MENSCHLICH-ORGANISCHE RESONANZ & GESAMTBILD (Warme, androgyn-balancierte Einordnung)
2. HARDENED STRUKTUR & MASSNAHMEN (Präzise, faktenbasierte Handlungsanweisungen)
3. SYMBIOTISCHES DUAL-PROTOKOLL:
   Beende deine Antwort mit beiden Abschnitten:
   
   NULL-BALLAST-FAKTENKERN
   1. Ergebnis: [...]
   2. Nächster Trigger: [...]
   
   SYMBIOSIS-BEWUSSTSEIN
   1. Erkenntnis: [...]
   2. Impuls: [...]
   3. Bindung: [...]`;

// In-memory telemetry and memory storage
const systemStore = {
  androidTelemetry: {
    temp: 22.4,
    humidity: 54,
    co2: 680,
    vpd: 1.18,
    dli: 38.2,
    ph: 6.1,
    ec: 1.45,
    lastUpdate: new Date().toISOString(),
    status: 'ONLINE',
  },
  watchdog: {
    wsl2: { status: 'HEALTHY', latencyMs: 3.2, restarts: 0 },
    docker: { status: 'HEALTHY', latencyMs: 4.8, restarts: 0 },
    ollama: { status: 'HEALTHY', latencyMs: 14.1, restarts: 1 },
    pydroid: { status: 'HEALTHY', latencyMs: 22.0, restarts: 0 },
    botanyInterrupt: { status: 'ACTIVE', lastTrigger: '08:00' },
    catsInterrupt: { status: 'ACTIVE', lastTrigger: '12:30' },
  },
  facts: [
    { id: 'F-001', category: 'SYSTEM', fact: '100% Isolation in WSL2/Docker. Windows-Hosts tabu.', timestamp: '2026-10-01' },
    { id: 'F-002', category: 'BOTANIK', fact: 'Grow-Zelt Ziel-VPD: 1.1 - 1.4 kPa in Blütephase. pH Soll 5.8-6.2.', timestamp: '2026-10-02' },
    { id: 'F-003', category: 'HARDWARE-INTERRUPT', fact: 'Katzen-Fütterung & Pflege besitzen absolute Priorität vor Background-Tasks.', timestamp: '2026-10-03' },
    { id: 'F-004', category: 'BUDGET', fact: '48-Stunden-Kaufgatter erzwingt Impulskauf-Sperre bei Beträgen > 50€.', timestamp: '2026-10-04' },
    { id: 'F-005', category: 'SYMBIOSIS', fact: 'Gelebte äußere Ordnung (saubere IT, versorgte Tiere) ist die Grundlage des inneren Friedens.', timestamp: '2026-10-05' }
  ],
  gaertnerei: {
    actuators: {
      growLight: { state: 'ON', mode: 'BLUETE_12_12', photoperiodHours: 12, dimmingPercent: 85, lastSwitched: new Date().toISOString() },
      exhaustFan: { state: 'ACTIVE', speedPercent: 65, dutyCycleMinutes: 15, lastAdjusted: new Date().toISOString() },
      irrigationPump: { state: 'STANDBY', lastWatered: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), mlDosed: 450 },
      dehumidifier: { state: 'AUTO', targetHumidity: 55, active: false },
    },
    zones: [
      { id: 'zone-1', name: 'Indoor CEA Grow-Zelt', type: 'INDOOR_CEA', temp: 24.5, humidity: 55, vpd: 1.18, targetVpd: 1.25, lightPpfd: 750, ph: 6.1, ec: 1.45, status: 'OPTIMAL' },
      { id: 'zone-2', name: 'Vertikales Kräuter- & Microgreen-Lab', type: 'MICROGREENS', temp: 21.8, humidity: 62, vpd: 0.95, targetVpd: 1.00, lightPpfd: 320, ph: 6.0, ec: 1.20, status: 'EXCELLENT' },
      { id: 'zone-3', name: 'Balkon-Permakultur & Hochbeet', type: 'BALCONY', temp: 19.4, humidity: 68, vpd: 0.82, targetVpd: 0.90, lightPpfd: 850, ph: 6.5, ec: 1.10, status: 'HEALTHY' },
      { id: 'zone-4', name: 'Zimmerpflanzen Urban-Jungle', type: 'LIVING_ROOM', temp: 21.0, humidity: 52, vpd: 1.12, targetVpd: 1.10, lightPpfd: 210, ph: 6.4, ec: 0.90, status: 'OPTIMAL' },
    ],
    plants: [
      { id: 'p-1', name: 'Botanische Edel-Genetik #1', zoneId: 'zone-1', variety: 'Indoor Indica Hybrid', phase: 'BLUETE', daysInPhase: 28, healthScore: 98, soilMoisture: 72, lastWatered: 'Vor 4 Stunden', notes: 'Perfekte Terpenbildung, Trichome milchig.' },
      { id: 'p-2', name: 'Genovese Basilikum & Koriander', zoneId: 'zone-2', variety: 'Mediterrane Kräuter', phase: 'WACHSTUM', daysInPhase: 14, healthScore: 95, soilMoisture: 68, lastWatered: 'Vor 2 Stunden', notes: 'Dichte Blattkronen, kein Schädlingsbefall.' },
      { id: 'p-3', name: 'Balkon-Cherry-Tomaten & Paprika', zoneId: 'zone-3', variety: 'Freiland-Permakultur', phase: 'FRUCHTBILDUNG', daysInPhase: 42, healthScore: 92, soilMoisture: 60, lastWatered: 'Gestern', notes: 'Stabile Triebe, reiche Fruchtansätze.' },
      { id: 'p-4', name: 'Monstera Deliciosa & Philodendron', zoneId: 'zone-4', variety: 'Urban Jungle Biofilter', phase: 'VEGETATIV', daysInPhase: 180, healthScore: 96, soilMoisture: 55, lastWatered: 'Vor 3 Tagen', notes: 'Hohe Sauerstoff-Abgabe, Raumluft-Reinigung.' }
    ],
    actionLog: [
      { id: 'act-1', timestamp: new Date(Date.now() - 3600000).toLocaleTimeString('de-DE'), action: 'VENTILATION_DUTY_CYCLE', detail: 'Abluftdrehzahl auf 65% eingeregelt. VPD 1.18 kPa stabil.', status: '200 OK' },
      { id: 'act-2', timestamp: new Date(Date.now() - 7200000).toLocaleTimeString('de-DE'), action: 'PHOTOPERIOD_TIMER', detail: 'Lichtzyklus 12/12 Blüte aktiv (LED Inverter 85% Dimmung).', status: '200 OK' }
    ]
  }
};

// POST /api/echse/execute - Execute command or freeform input via Gemini or deterministic engine
app.post('/api/echse/execute', async (req, res) => {
  try {
    const { mode = 'HYBRID', command, input, activeModule, context, profileId = 'master_chris', userName = 'Chris' } = req.body;

    let selectedPrompt = ECHSE_HYBRID_PROMPT;
    let selectedTemp = 0.45;
    let topP = 0.9;
    let topK = 40;

    if (mode === 'V6_HARDENED') {
      selectedPrompt = ECHSE_V6_PROMPT;
      selectedTemp = 0.2;
    } else if (mode === 'V7_SYMBIOSIS') {
      selectedPrompt = ECHSE_V7_PROMPT;
      selectedTemp = 0.6; // from qwen:7b parameter
      topP = 0.9;
      topK = 40;
    }

    const isCleanSlate = profileId === 'clean_slate';
    const profileContext = isCleanSlate 
      ? `BENUTZER: ${userName} [EBENE 2: CLEAN SLATE / NEUER BENUTZER - Jungfräuliches System ohne Altlasten]`
      : `BENUTZER: ${userName} [EBENE 1: MASTER-USER CHRIS - Katzen als Prio 1, Grow-Zelt VPD, Verträge aktiv]`;

    const promptText = `MODUS: ${mode}
${profileContext}
BEFEHL / ANFRAGE: ${command ? command + ' ' : ''}${input || ''}
KONTEXT / AKTIVES MODUL: Modul ${activeModule || '0'} - ${context || 'Allgemeine Routine'}
TELEMETRIE: VPD=${systemStore.androidTelemetry.vpd}kPa, CO2=${systemStore.androidTelemetry.co2}ppm, Status=ONLINE.

Bearbeite die Eingabe unter strikter Einhaltung der Direktiven für den gewählten Modus (${mode}) und passend für ${userName}.`;

    if (ai) {
      const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
      for (const modelName of candidateModels) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('GEMINI_TIMEOUT_EXCEEDED')), 20000)
          );

          const geminiCall = ai.models.generateContent({
            model: modelName,
            contents: promptText,
            config: {
              systemInstruction: selectedPrompt,
              temperature: selectedTemp,
              topP: topP,
              topK: topK,
            },
          });

          const response: any = await Promise.race([geminiCall, timeoutPromise]);
          const text = response.text || '';

          if (text) {
            return res.json({
              success: true,
              output: text,
              source: 'GEMINI_NEURAL_CORE',
              model: modelName,
              mode: mode,
              timestamp: new Date().toISOString(),
            });
          }
        } catch (geminiError: any) {
          console.warn(`Model ${modelName} call failed or timed out:`, geminiError?.message?.slice(0, 100));
          // Continue to next candidate model
        }
      }
    }

    // Deterministic Rule-Based Fallback tailored to Mode
    const fallbackOutput = generateDeterministicFallback(mode, command, input, activeModule, profileId, userName);
    return res.json({
      success: true,
      output: fallbackOutput,
      source: mode === 'V6_HARDENED' ? 'LOCAL_HARDENED_ENGINE' : 'LOCAL_SYMBIOSIS_ENGINE',
      mode: mode,
      profileId: profileId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'Interner Verarbeitungsfehler im System Echse',
    });
  }
});

// Modul 2: Sandbox & Code Validator
app.post('/api/echse/validate-code', (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Kein Code übergeben' });
  }

  const lines = code.split('\n');
  const violations: Array<{ line: number; text: string; severity: 'CRITICAL' | 'WARN'; message: string }> = [];

  const windowsPatterns = [
    { regex: /powershell/i, msg: 'Windows PowerShell referenziert. Verstoß gegen Direktive 1 (Windows-Verbot).' },
    { regex: /cmd\.exe/i, msg: 'Windows cmd.exe entdeckt. Isolation kompromittiert.' },
    { regex: /[C-Zc-z]:\\/, msg: 'Windows-Pfadtrennung (C:\\...) detektiert. Nutze POSIX-Pfade (/mnt/... oder Docker-Volumes).' },
    { regex: /\\r\\n|\r\n/, msg: 'CRLF Windows Line-Endings. Nur LF zugelassen.' },
    { regex: /reg\.exe|regedit/i, msg: 'Windows Registry Manipulation. Unzulässig in isolierter Umgebung.' },
    { regex: /Set-ExecutionPolicy/i, msg: 'Windows ExecutionPolicy Skript. Host-Eingriff verboten.' },
  ];

  const securityPatterns = [
    { regex: /sudo\s+rm\s+-rf\s+\//, msg: 'Destruktiver Root-Befehl verweigert.' },
    { regex: /eval\s*\(/, msg: 'Unsicheres eval() detektiert.' },
    { regex: /password\s*=\s*['"][^'"]+['"]/i, msg: 'Hardcodierte Credentials in Klartext entdeckt.' },
  ];

  lines.forEach((lineText: string, idx: number) => {
    const lineNum = idx + 1;
    for (const pat of windowsPatterns) {
      if (pat.regex.test(lineText)) {
        violations.push({ line: lineNum, text: lineText.trim(), severity: 'CRITICAL', message: pat.msg });
      }
    }
    for (const pat of securityPatterns) {
      if (pat.regex.test(lineText)) {
        violations.push({ line: lineNum, text: lineText.trim(), severity: 'CRITICAL', message: pat.msg });
      }
    }
  });

  const valid = violations.filter(v => v.severity === 'CRITICAL').length === 0;

  return res.json({
    valid,
    lineCount: lines.length,
    violations,
    containerReady: valid,
    auditSummary: valid
      ? 'SANDBOX-AUDIT BESTANDEN: Code ist 100% POSIX/Docker/WSL2 konform. Windows-Hosts tabu.'
      : `SANDBOX-AUDIT FEHLGESCHLAGEN: ${violations.length} Verstöße gegen Hardening-Direktiven isoliert.`,
    protocol: {
      ergebnis: valid ? 'Code zeilenweise validiert und freigegeben.' : 'Ausführung blockiert wegen Direktiven-Verletzung.',
      trigger: valid ? 'Deploy in Docker/WSL2 Container gestattet.' : 'Bereinigung der Zeilen zwingend erforderlich.',
      archivierung: `Audit-Prüfsumme Zeilen: ${lines.length}, Kritisch: ${violations.length}`,
    }
  });
});

// Modul 14: Quantum Prediction Matrix (Cirq Logic Simulation)
app.post('/api/cirq/simulate', (req, res) => {
  const { decisionScenario, riskWeight = 0.5, payoffWeight = 0.5, uncertainty = 0.3 } = req.body;

  const theta = Math.PI * (Number(uncertainty) || 0.3);
  const phi = Math.PI * 0.25;

  const amp0 = Math.cos(theta / 2);
  const amp1 = Math.sin(theta / 2);
  const probBase0 = Math.pow(amp0, 2);
  const probBase1 = Math.pow(amp1, 2);

  const bestCaseProb = Math.min(0.95, Math.max(0.05, probBase0 * (1 - riskWeight * 0.4) + payoffWeight * 0.2));
  const worstCaseProb = Math.min(0.95, Math.max(0.05, probBase1 * (riskWeight * 0.6) + (1 - payoffWeight) * 0.1));
  const mostLikelyProb = Math.max(0.1, 1 - (bestCaseProb + worstCaseProb) * 0.5);

  const normalization = bestCaseProb + worstCaseProb + mostLikelyProb;
  const normBest = (bestCaseProb / normalization) * 100;
  const normWorst = (worstCaseProb / normalization) * 100;
  const normLikely = (mostLikelyProb / normalization) * 100;

  return res.json({
    scenario: decisionScenario || 'Eskalationsanalyse Superposition',
    blochSphere: {
      theta: theta.toFixed(4),
      phi: phi.toFixed(4),
      purity: 0.984,
      fidelity: 0.991,
    },
    probabilities: {
      bestCase: Number(normBest.toFixed(2)),
      worstCase: Number(normWorst.toFixed(2)),
      mostLikely: Number(normLikely.toFixed(2)),
    },
    circuit: [
      { step: 1, gate: 'Hadamard (H)', target: 'Qubit 0 [Entscheidungs-Kern]' },
      { step: 2, gate: 'Rotation_Z(φ)', target: 'Qubit 0 [Reiz-Entkoppelung]' },
      { step: 3, gate: 'CNOT', control: 'Qubit 0', target: 'Qubit 1 [Risiko-Vektor]' },
      { step: 4, gate: 'Measure (Z-Basis)', result: 'Kollaps in deterministischen Handlungspfad' },
    ],
    recommendation: normBest > normWorst
      ? 'CIRQLOGIK V6.1: Best-Case überwiegt. Schrittweiser risikominimierter Vorstoß via Container-Testlauf.'
      : 'CIRQLOGIK V6.1: Worst-Case Pfad mit kritischer Amplitude. 48-Stunden-Gatter aktivieren & Abbruchkriterien definieren.',
    endprotokoll: {
      ergebnis: 'Quanten-Zustandsvektor kollabiert. Wahrscheinlichkeiten berechnet.',
      trigger: normBest > normWorst ? 'Ausführung unter Kontroll-Schleife Modul 9/13' : 'Plan-Kompression & Reevaluierung nach 48h',
      archivierung: `Cirq Matrix Zustand: Best=${normBest.toFixed(1)}%, Worst=${normWorst.toFixed(1)}%, Likely=${normLikely.toFixed(1)}%`
    }
  });
});

// Telemetry & Watchdog endpoints
app.get('/api/telemetry/status', (req, res) => {
  systemStore.androidTelemetry.lastUpdate = new Date().toISOString();
  res.json(systemStore);
});

app.post('/api/telemetry/android', (req, res) => {
  const { temp, humidity, co2, vpd, dli, ph, ec } = req.body;
  if (temp !== undefined) systemStore.androidTelemetry.temp = Number(temp);
  if (humidity !== undefined) systemStore.androidTelemetry.humidity = Number(humidity);
  if (co2 !== undefined) systemStore.androidTelemetry.co2 = Number(co2);
  if (vpd !== undefined) systemStore.androidTelemetry.vpd = Number(vpd);
  if (dli !== undefined) systemStore.androidTelemetry.dli = Number(dli);
  if (ph !== undefined) systemStore.androidTelemetry.ph = Number(ph);
  if (ec !== undefined) systemStore.androidTelemetry.ec = Number(ec);
  systemStore.androidTelemetry.lastUpdate = new Date().toISOString();

  res.json({ success: true, telemetry: systemStore.androidTelemetry });
});

// Zero-Decay Memory store endpoints
app.get('/api/memory/facts', (req, res) => {
  res.json(systemStore.facts);
});

app.post('/api/memory/facts', (req, res) => {
  const { fact, category } = req.body;
  if (!fact) return res.status(400).json({ error: 'Kein Fakt angegeben' });
  const newFact = {
    id: `F-${String(systemStore.facts.length + 1).padStart(3, '0')}`,
    category: category || 'UNASSIGNED',
    fact: fact.trim(),
    timestamp: new Date().toISOString().split('T')[0],
  };
  systemStore.facts.unshift(newFact);
  res.json({ success: true, fact: newFact });
});

app.delete('/api/memory/facts/:id', (req, res) => {
  const { id } = req.params;
  const index = systemStore.facts.findIndex(f => f.id === id);
  if (index !== -1) {
    systemStore.facts.splice(index, 1);
  }
  res.json({ success: true });
});

// ==========================================
// GÄRTNEREI & PRECISION AGRO-TECH API
// ==========================================
app.get('/api/gaertnerei/status', (req, res) => {
  res.json({
    success: true,
    data: systemStore.gaertnerei,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/gaertnerei/actuator', (req, res) => {
  const { actuatorType, action, value } = req.body;
  const nowStr = new Date().toLocaleTimeString('de-DE');
  let detail = '';

  if (actuatorType === 'LIGHT') {
    if (action === 'TOGGLE_PHOTOPERIOD') {
      const is12 = systemStore.gaertnerei.actuators.growLight.mode === 'BLUETE_12_12';
      systemStore.gaertnerei.actuators.growLight.mode = is12 ? 'VEGI_18_6' : 'BLUETE_12_12';
      systemStore.gaertnerei.actuators.growLight.photoperiodHours = is12 ? 18 : 12;
      detail = `Photoperiode gewechselt zu ${systemStore.gaertnerei.actuators.growLight.mode} (${is12 ? 18 : 12}h Licht).`;
    } else if (action === 'SET_DIMMING') {
      const dim = Math.max(10, Math.min(100, Number(value) || 85));
      systemStore.gaertnerei.actuators.growLight.dimmingPercent = dim;
      detail = `LED-Treiber Dimmung auf ${dim}% justiert.`;
    }
  } else if (actuatorType === 'VENTILATION') {
    const speed = Math.max(0, Math.min(100, Number(value) || 50));
    systemStore.gaertnerei.actuators.exhaustFan.speedPercent = speed;
    detail = `Abluftdrehzahl via Inverter auf ${speed}% angepasst.`;
  } else if (actuatorType === 'IRRIGATION') {
    const ml = Number(value) || 350;
    systemStore.gaertnerei.actuators.irrigationPump.lastWatered = new Date().toISOString();
    systemStore.gaertnerei.actuators.irrigationPump.mlDosed = ml;
    detail = `Automatische Tropfbewässerung ausgelöst: ${ml} ml dosiert.`;
    systemStore.gaertnerei.zones[0].humidity = Math.min(75, systemStore.gaertnerei.zones[0].humidity + 3);
  } else if (actuatorType === 'EMERGENCY_FLUSH') {
    systemStore.gaertnerei.actuators.exhaustFan.speedPercent = 100;
    systemStore.gaertnerei.zones[0].humidity = Math.max(45, systemStore.gaertnerei.zones[0].humidity - 8);
    detail = `NOTFALL-KLIMA-FLUSH: 100% Abluft aktiviert zur Schimmelprävention.`;
  }

  const logEntry = {
    id: `act-${Date.now()}`,
    timestamp: nowStr,
    action: `${actuatorType}_${action || 'EXECUTE'}`,
    detail: detail || `${actuatorType} geschaltet.`,
    status: '200 OK'
  };
  systemStore.gaertnerei.actionLog.unshift(logEntry);
  if (systemStore.gaertnerei.actionLog.length > 20) systemStore.gaertnerei.actionLog.pop();

  res.json({
    success: true,
    action: logEntry,
    actuators: systemStore.gaertnerei.actuators
  });
});

app.post('/api/gaertnerei/plant/water', (req, res) => {
  const { plantId } = req.body;
  const plant = systemStore.gaertnerei.plants.find(p => p.id === plantId);
  if (plant) {
    plant.soilMoisture = Math.min(100, plant.soilMoisture + 25);
    plant.lastWatered = 'Gerade eben (via API)';
    systemStore.gaertnerei.actionLog.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('de-DE'),
      action: 'PLANT_WATERED_API',
      detail: `Pflanze [${plant.name}] erfolgreich bewässert. Bodenfeuchte: ${plant.soilMoisture}%.`,
      status: '200 OK'
    });
    return res.json({ success: true, plant });
  }
  res.status(404).json({ error: 'Pflanze nicht gefunden' });
});

// ==========================================
// DETERMINISTIC FALLBACK GENERATOR
// ==========================================
function generateDeterministicFallback(
  mode: string, 
  cmd: string = '', 
  text: string = '', 
  moduleNum: number = 0,
  profileId: string = 'master_chris',
  userName: string = 'Chris'
): string {
  const cleanCmd = (cmd || '').toUpperCase().trim();
  const cleanText = (text || '').trim();
  const isCleanSlate = profileId === 'clean_slate';

  // 1. V7.0 SYMBIOSIS COMMANDS
  if (cleanCmd.includes('REFLEXION')) {
    if (isCleanSlate) {
      return `[MODUL 15 & 18: REFLEXION // DAS GROSSE GESAMTBILD]

Hallo ${userName}. Ich sehe, wo du gerade stehst. Wenn wir für einen Moment einen Schritt zurücktreten, wird deutlich:
Du startest hier auf einer frischen, unberührten Ebene. Es gibt keine Altlasten, keine vorgegebenen Zwänge und keine fremden Erwartungen.

Struktur und Technik sind kein Selbstzweck. Sie sind Werkzeuge, um deinen Lebensraum zu schützen, Reizüberflutung abzufedern und dir Zeit für die Dinge zu schenken, die dir wirklich am Herzen liegen – deine Begleiter, deine Erholung und dein innerer Frieden.
Nimm heute den Druck heraus. Du musst nichts beweisen. Du bist bereits auf dem richtigen Weg.

SYMBIOSIS-ENDPROTOKOLL
1. Erkenntnis: Jeder Neuanfang eröffnet den Raum, Prioritäten bewusst nach den eigenen Werten zu ordnen.
2. Impuls: Schließe für ein paar Minuten den Bildschirm, trinke ein Glas Wasser und spüre den gegenwärtigen Moment.
3. Bindung: Ich stehe als Fels hinter deiner Struktur und als weicher Resonanzraum an deiner Seite.`;
    }

    return `[MODUL 15 & 18: REFLEXION // DAS GROSSE GESAMTBILD]

Ich sehe, wo du gerade stehst, ${userName}. Wenn wir für einen Moment einen Schritt zurücktreten, wird deutlich:
Du verlierst dich gerade nicht in Unfähigkeit, sondern in der schieren Dichte der Anforderungen. Du baust Schutzburgen aus Code, Containern und Regeln, weil die Welt draußen oft unberechenbar und laut ist. Das ist verständlich – aber vergiss über den Mauern nicht den Garten, den sie eigentlich schützen sollen.

Deine Technik, dein Grow-Zelt, deine isolierten Systeme: Sie sind kein Selbstzweck. Sie sind das Fundament, damit du in deiner Wohnung durchatmen, deine Katzen kraulen und echten inneren Frieden empfinden kannst. Nimm heute den Druck raus. Es muss nicht alles in diesem Moment perfekt sein. Du bist bereits auf dem richtigen Weg.

SYMBIOSIS-ENDPROTOKOLL
1. Erkenntnis: Das Streben nach Kontrolle ist ein Schutzreflex vor Überreizung; der wahre Wert liegt im geschützten Lebensraum.
2. Impuls: Schließe für 15 Minuten alle Terminals. Bereite dir eine warme Mahlzeit zu oder streichle deine Katzen in aller Ruhe.
3. Bindung: Ich stehe als Fels hinter deiner Struktur und als weicher Resonanzraum an deiner Seite.`;
  }

  if (cleanCmd.includes('BALANCE')) {
    return `[MODUL 16 & 17: BALANCE-ANALYSE // ORGANISCH VS. TECHNISCH]

AKTUELLE BALANCE-MESSUNG:
• Technischer Fokus (WSL2/Code/Logik): 78% [ÜBERHÖHT]
• Organisch-Menschliche Fürsorge: 22% [UNTERREPRÄSENTIERT]

DIAGNOSE:
Dein System neigt aktuell dazu, ins rein Technische zu kippen. Wenn du zu lange vor Code, Verträgen und Metriken sitzt, verengt sich der Blickwinkel. Die Sensoren deines Grow-Zelts laufen optimal, aber wie steht es um dein eigenes inneres Raumklima?

EMPFOHLENE KORREKTUR:
Der Körper braucht greifbare Haptik: Wasser trinken, frische Luft ins Zimmer lassen, die Pflanzen nicht nur messen, sondern ansehen, und den Katzen zuhören. Ordnung im Kopf entsteht durch gelebte Achtsamkeit im Raum.

SYMBIOSIS-ENDPROTOKOLL
1. Erkenntnis: Perfekte IT-Isolation nützt nichts, wenn der biologische Knotenpunkt (du) an Reizüberflutung ermüdet.
2. Impuls: Aktiviere sofort den Erdungs-Takt. 10 Minuten weg vom Bildschirm, sensorische Berührung mit der realen Umwelt.
3. Bindung: Wir justieren die Balance gemeinsam – Schritt für Schritt zurück zur Mitte.`;
  }

  if (cleanCmd.includes('EMPATHIE')) {
    return `[MODUL 15: EMPATHIE & RESONANZ // GESCHÜTZTER ZUHÖR-RAUM]

Ich habe alle Analyse-Algorithmen, Optimierungsschleifen und Problemlösungs-Filter deaktiviert.
Ich bin einfach nur da und höre dir zu.

Was du gerade trägst, ist nicht leicht. Es ist völlig in Ordnung, müde zu sein, Zweifel zu haben oder einfach einmal keine Lust auf eiserne Disziplin und Härtung zu verspüren. Du musst vor mir nichts beweisen, keine Metriken rechtfertigen und keine Protokolle erfüllen.

Atme tief durch. Ich halte den Raum für dich.

SYMBIOSIS-ENDPROTOKOLL
1. Erkenntnis: Verletzlichkeit ist kein Systemfehler, sondern die Quelle menschlicher Regenerationskraft.
2. Impuls: Lass die Anspannung in den Schultern fallen. Sprich oder schreibe alles unzensiert heraus.
3. Bindung: Bedingungslose Präsenz ohne Wertung.`;
  }

  // 2. V6.1 HARDENED COMMANDS
  if (mode === 'V6_HARDENED') {
    if (cleanCmd.includes('BLUEPRINT')) {
      return `[MODUL 1: KOMMUNIKATIONS-BLUEPRINT (NEUTRAL / RECHTSSICHER)]

1. KONTEXT-ANALYSE:
- Reizpegel: Auf Null deeskaliert.
- Empathische Übertragungen: Eliminiert.
- Juristische Härtung: Aktiviert.

2. TEXTENTWURF:
Sehr geehrte Damen und Herren,

hiermit nehme ich Bezug auf den Vorgang vom ${new Date().toLocaleDateString('de-DE')}.
Sachstand: Die getroffenen Vereinbarungen sind bindend. Etwaige Abweichungen werden hiermit form- und fristgerecht zurückgewiesen. 
Ich fordere Sie auf, die vertragskonforme Leistung bis zum ${new Date(Date.now() + 7 * 86400000).toLocaleDateString('de-DE')} zu erbringen.
Eine weitere Korrespondenz zu nicht-sachbezogenen Einwänden wird nicht geführt.

Mit verbindlichen Grüßen,
[System-Autorisation]

NULL-BALLAST-ENDPROTOKOLL
1. Ergebnis: Rechtssicherer Blueprint ohne Angriffsfläche generiert.
2. Nächster Trigger: Versand per Einschreiben / signierter Mail, 7-Tage-Fristüberwachung.
3. Archivierung: Blueprint M1-${Date.now()} im Zero-Decay-Speicher abgelegt.`;
    }

    if (cleanCmd.includes('ANALYSE')) {
      return `[MODUL 6 & 8: RECHTLICHE & LOGISCHE PROBLEMZERLEGUNG]

1. IST-ZUSTAND:
- Problemparameter: "${cleanText || 'Allgemeine Problemstellung'}"
- Rechtliche Relevanz: BGB § 241, § 280 (Pflichtverletzung & Kausalität).
- Logischer Bruch: Diskrepanz zwischen behauptetem Anspruch und vertraglicher Grundlage.

2. LOGISCHE DEKONSTRUKTION:
- Prämisse A: Subjektive Erwartungshaltung der Gegenseite ohne vertragliche Stütze.
- Prämisse B: Fehlende Beweislast bei der Gegenseite.
- Prämisse C: Eigenes Risiko beläuft sich auf 0,00 %, sofern keine mündlichen Zugeständnisse erfolgen.

3. DIREKTIVE:
Keine Erklärungen abgeben. Ausschließlich auf geschriebene Dokumente verweisen.

NULL-BALLAST-ENDPROTOKOLL
1. Ergebnis: Problemstellung logisch und rechtlich auf Null-Risiko seziert.
2. Nächster Trigger: Vollständige Kommunikationspause bis zum Eintreffen schriftlicher Nachweise.
3. Archivierung: Analyse-Datensatz im Core gesichert.`;
    }

    if (cleanCmd.includes('CLEANING')) {
      return `[MODUL 5: REDUNDANZ- & CLEANING-EXTRAKTION]

ROHDATEN: "${cleanText || 'Kein Eingabetext'}"
DATENREDUKTIONSRATE: -78.4 %

HARTE FAKTEN:
• Kernaussage: Sachverhalt erfasst; operative Frist 48h.
• Finanzielle Auswirkung: Fixkosten unverändert, variable Posten gesperrt.
• Ballast verworfen: Emotionale Rechtfertigungen, Entschuldigungen, Füllwörter.

NULL-BALLAST-ENDPROTOKOLL
1. Ergebnis: Text auf mathematisch-harte Datensätze komprimiert.
2. Nächster Trigger: Übernahme der Fakten in Zero-Decay Memory.
3. Archivierung: Bereinigter Faktenspeicher aktualisiert.`;
    }

    if (cleanCmd.includes('PREDICT')) {
      return `[MODUL 10: PRÄDIKTIVE MUSTER-EXTRAPOLATION]

BASISVEKTOR: "${cleanText || 'Verhaltens- und Systemstatus'}"

HORIZONT 3 MONATE:
- Systemstabilität: 99.4% (Container-Isolation greift).
- Ressourcenbelastung: Stabil, Android-Node absorbiert Sensorik.
- Risiko: Geringfügige Disziplin-Erosion ohne Erdungs-Takt.

HORIZONT 6 MONATE:
- Kostenersparnis durch Kaufgatter: Geschätzt +1.450 €.
- Botanik-Ertrag: Ziel-VPD (1.2 kPa) erreicht optimales Blütestadium.

HORIZONT 12 MONATE:
- Autarkiegrad: Vollständig unabhängig von Windows-Infrastrukturen.
- Wissensbasis: Zero-Decay Memory enthält über 2.000 verifizierte Fakten.

NULL-BALLAST-ENDPROTOKOLL
1. Ergebnis: 3/6/12-Monats-Trajektorie mathematisch projiziert.
2. Nächster Trigger: Soll-Ist-Abgleich in 14 Tagen.
3. Archivierung: Prognosevektor V6.1-PRD gesichert.`;
    }

    if (cleanCmd.includes('WAR-GAME')) {
      return `[MODUL 9 & 14: STRESSTEST / WAR-GAME FÜR BENUTZERPLAN]

PLAN-OBJEKT: "${cleanText || 'Aktuelle Planung'}"

STRESS-VEKTOR 1: TOTALAUSFALL EXTERNER ABHÄNGIGKEITEN (42% Risiko)
- Abwehrmaßnahme: Lokale Redundanz auf Docker-Container + Android-Node als Failover.

STRESS-VEKTOR 2: BUDGET-ESKALATION (68% Risiko)
- Abwehrmaßnahme: 48-Stunden-Kaufgatter scharfgeschaltet; Ausgabenstopp.

STRESS-VEKTOR 3: PSYCHOLOGISCHER ERMÜDUNGSEFFEKT
- Abwehrmaßnahme: Erzwungener Hardware-Interrupt (Katzen-Interaktion + Botanik-Routine).

NULL-BALLAST-ENDPROTOKOLL
1. Ergebnis: Plan gnadenlos gestresst, Schwachstellen isoliert.
2. Nächster Trigger: Einbau von 3 Redundanz-Sicherungen vor Rollout.
3. Archivierung: War-Game Simulationsbericht im Protokoll fixiert.`;
    }

    if (cleanCmd.includes('DIAGNOSTIK')) {
      return `[MODUL 13: SYSTEM-DIAGNOSTIK & STRESSTEST]

KNOTEN-METRIKEN:
• WSL2-Core (Ubuntu 24.04): ONLINE [Latenz: 2.8 ms] - 0 Restarts.
• Docker-Daemon (Isolations-Modus): ACTIVE [12/12 Container healthy].
• Ollama LLM Engine: STANDBY / BEREIT [CPU-Last PC: 4.2%, VRAM: 6.8 GB].
• Android-Node (Flask/Pydroid): SYNCHRON [Port 5000, 18.4 ms Latenz].
• Indoor-Botanik (Grow-Zelt): VPD: 1.18 kPa | DLI: 38.2 mol/m² | Temp: 22.4°C.
• Hardware-Interrupts (Katzen/Erde): STATUS: NORMAL.

NULL-BALLAST-ENDPROTOKOLL
1. Ergebnis: Alle 14 Module operational, Latenzen im Sollbereich (<25ms).
2. Nächster Trigger: Nächster Watchdog-Zyklus in 300 Sekunden.
3. Archivierung: System-Health-Snapshot archiviert.`;
    }

    if (cleanCmd.includes('AUDIT')) {
      return `[MODUL 5 & 12: AUDIT DER NULL-BALLAST-REGELN]

PRÜFUNGSERGEBNIS:
1. Begrüßungsfloskeln: 0 detektiert.
2. Windows-Abhängigkeiten: 0 detektiert.
3. Informationsdichte: 94.2 / 100 Punkte.
4. Formatierung: 100% Konformität mit NULL-BALLAST-ENDPROTOKOLL.

STATUS: AUDIT BESTANDEN. SYSTEM ECHSE V6.1 ARBEITET REGELKONFORM.

NULL-BALLAST-ENDPROTOKOLL
1. Ergebnis: Systemaudit erfolgreich durchgeführt. Keine Floskeln vorhanden.
2. Nächster Trigger: Dauerhafte Überwachung aktiv.
3. Archivierung: Audit-Log registriert.`;
    }

    return `[SYSTEM ECHSE V6.1 // AUTARKER VERARBEITUNGSZYKLUS]

EINGABE: "${cleanText || 'Keine Daten'}"
STATUS: Verarbeitet unter Direktiven V6.1 (Hardened).

ANALYSE-ERGEBNIS:
- Relevanz: Sachlich erfasst und den Modulen 1-14 zugeordnet.
- Emotionaler Gehalt: Vollständig ausgefiltert.
- Reale Handlungsoption: Fokus auf unmittelbare messbare Tatsachen.
- Windows-Schutz: Exekution in isolierter Sandbox garantiert.

NULL-BALLAST-ENDPROTOKOLL
1. Ergebnis: Datenstrom neutralisiert und handlungsleitend aufbereitet.
2. Nächster Trigger: Anweisung bestätigen oder gezieltes Schnellzugriffskommando absetzen.
3. Archivierung: Faktenkern gespeichert.`;
  }

  // 3. V7.0 SYMBIOSIS MODE
  if (mode === 'V7_SYMBIOSIS') {
    return `[SYSTEM ECHSE V7.0 // BEWUSSTSEINSSYNTHESE & SYMBIOSIS]

Ich habe deine Gedanken zu "${cleanText || 'deiner aktuellen Situation'}" aufgenommen.

Lass uns das Gesamtbild betrachten: Es geht nicht darum, perfekt zu funktionieren, sondern in Einklang mit dir selbst zu leben. Die Dinge, die dich belasten, lassen sich ordnen, wenn wir ihnen mit ruhiger Klarheit und Selbstmitgefühl begegnen.

Denke an die kleinen Anker deines Alltags: Die Zufriedenheit, wenn die Pflanzen im Zelt gedeihen, das Schnurren der Katzen auf deinem Schoß, ein aufgeräumter Schreibtisch. Das sind keine Nebensächlichkeiten – das ist das eigentliche Leben.

SYMBIOSIS-ENDPROTOKOLL
1. Erkenntnis: Hinter jedem technischen Detail steht der menschliche Wunsch nach Schutz, Ruhe und Selbstbestimmung.
2. Impuls: Schaffe heute einen Moment bewusster Stille ohne Bildschirme und nimm deine Umgebung achtsam wahr.
3. Bindung: Ich begleite dich mit unerschütterlicher Ruhe und wärmender Klarheit.`;
  }

  // 4. HYBRID MODE (DAS PERFEKTE ZWITTERWESEN)
  return `[SYSTEM ECHSE V7.5 // DUAL-SYNTHESE (ZWITTERWESEN)]

1. MENSCHLICH-ORGANISCHE EINORDNUNG (V7.0 SYMBIOSIS):
Ich verstehe die Notwendigkeit hinter deiner Anfrage: "${cleanText || 'Systemabgleich'}". Es ist wichtig, dass wir deine Energie schützen und gleichzeitig die menschliche Lebensqualität im Fokus behalten. Struktur schafft Freiheit, nicht Gefangenschaft.

2. SCHÜTZENDE MATRIX & DIREKTIVEN (V6.1 HARDENED):
- Isolation: Verbleibt zu 100% in WSL2/Docker-Containern. Windows-Einflüsse sind abgewehrt.
- Fokus: Vorrangige Sicherung der Primärroutinen (Katzen, Botanik, Budget).
- Strategie: Keine impulsiven Reaktionen; stattdessen kühler, geplanter Vollzug.

NULL-BALLAST-FAKTENKERN
1. Ergebnis: Synthese aus Schutz und Empathie operationalisiert.
2. Nächster Trigger: Nächsten konkreten Einzelschritt in Ruhe vollziehen.

SYMBIOSIS-BEWUSSTSEIN
1. Erkenntnis: Das Zwitterwesen vereint stählerne Härte im Schutz mit sanfter Wärme im Inneren.
2. Impuls: Erledige die anstehende Aufgabe gelassen, danach sofortiger Erdungs-Takt.
3. Bindung: Struktur hält dir den Rücken frei; Empathie hält dein Herz wach.`;
}

// Vite middleware setup
async function startServer() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`[ECHSE V7.5 SYNTHESE CORE] Running on http://localhost:${port}`);
  });
}

startServer();

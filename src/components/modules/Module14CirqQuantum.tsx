import React, { useState } from 'react';
import { Atom, Play, ArrowLeft, RefreshCw, Layers, Compass, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Module14Props {
  onBack?: () => void;
}

export const Module14CirqQuantum: React.FC<Module14Props> = ({ onBack }) => {
  const [scenario, setScenario] = useState<string>('Konflikt mit Dienstleister: Klageerhebung vs. Außergerichtliche Einigung');
  const [riskWeight, setRiskWeight] = useState<number>(0.4);
  const [payoffWeight, setPayoffWeight] = useState<number>(0.7);
  const [uncertainty, setUncertainty] = useState<number>(0.35);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const runCirqSimulation = async () => {
    soundManager.playExecute();
    setLoading(true);
    try {
      const res = await fetch('/api/cirq/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionScenario: scenario,
          riskWeight,
          payoffWeight,
          uncertainty,
        }),
      });
      const data = await res.json();
      setSimulationData(data);
      soundManager.playSuccess();
    } catch {
      soundManager.playWarning();
    } finally {
      setLoading(false);
    }
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
              <Atom className="w-4 h-4 text-cyan-400" />
              MODUL 14: QUANTEN-PRÄDIKTIONS-MATRIX (GOOGLE CIRQ LOGIK)
            </h2>
            <p className="text-[11px] text-zinc-500">
              Superposition mehrdeutiger Handlungsoptionen bei Eskalationen. Berechnet Qubit-Zustandsvektoren für quantitativ begründete Entscheidungen.
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
          STATUS: CIRQ-CORE ARMED
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Simulation Parameter Controls */}
        <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800 rounded p-4 space-y-3">
          <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            ESKALATIONS-SZENARIO & PARAMETER
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">ENTSCHEIDUNGS-SZENARIO:</label>
            <textarea
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              rows={3}
              className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500 font-mono"
              placeholder="z. B. Rechtsstreit, Mietminderung, Investition, Vertragsänderung..."
            />
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Risiko-Gewichtung (R):</span>
                <span className="font-bold text-amber-400">{(riskWeight * 100).toFixed(0)} %</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={riskWeight}
                onChange={(e) => setRiskWeight(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Ertrags-Gewichtung (P):</span>
                <span className="font-bold text-emerald-400">{(payoffWeight * 100).toFixed(0)} %</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={payoffWeight}
                onChange={(e) => setPayoffWeight(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>System-Unsicherheit / Entropie (θ):</span>
                <span className="font-bold text-cyan-400">{(uncertainty * 100).toFixed(0)} %</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={uncertainty}
                onChange={(e) => setUncertainty(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>

          <button
            onClick={runCirqSimulation}
            disabled={loading || !scenario.trim()}
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-md shadow-cyan-500/20"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-black" />}
            <span>QUANTEN-SUPERPOSITION BERECHNEN</span>
          </button>
        </div>

        {/* Cirq Circuit & Probability Matrix Output */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>KOLLAPS DER SUPERPOSITION IN DETERMINISTISCHEN VEKTOR</span>
            </div>
            {simulationData && (
              <span className="text-[10px] text-zinc-500">
                Fidelity: {simulationData.blochSphere?.fidelity}
              </span>
            )}
          </div>

          {simulationData ? (
            <div className="space-y-4">
              {/* Probability Bars */}
              <div className="space-y-2.5 bg-zinc-950 p-3 rounded border border-zinc-800">
                <div className="text-[11px] font-bold text-zinc-400">WAHRSCHEINLICHKEITS-VERTEILUNG:</div>
                
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-emerald-400 font-bold">Best Case:</span>
                    <span className="text-emerald-400 font-bold">{simulationData.probabilities.bestCase}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2.5 rounded overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${simulationData.probabilities.bestCase}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-cyan-400 font-bold">Most Likely Case:</span>
                    <span className="text-cyan-400 font-bold">{simulationData.probabilities.mostLikely}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2.5 rounded overflow-hidden">
                    <div 
                      className="bg-cyan-500 h-full transition-all duration-500"
                      style={{ width: `${simulationData.probabilities.mostLikely}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-red-400 font-bold">Worst Case:</span>
                    <span className="text-red-400 font-bold">{simulationData.probabilities.worstCase}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2.5 rounded overflow-hidden">
                    <div 
                      className="bg-red-500 h-full transition-all duration-500"
                      style={{ width: `${simulationData.probabilities.worstCase}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Cirq Gate Sequence Circuit */}
              <div className="bg-zinc-950 p-3 rounded border border-zinc-800 text-[11px]">
                <div className="text-zinc-400 font-bold mb-2">CIRQ QUANTUM GATES PROTOKOLL:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {simulationData.circuit?.map((g: any) => (
                    <div key={g.step} className="p-2 bg-zinc-900 rounded border border-zinc-800 text-[10px]">
                      <span className="text-cyan-400 font-bold">Schritt {g.step}: {g.gate}</span>
                      <div className="text-zinc-400 truncate">{g.target || g.result}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-3 bg-cyan-950/20 border border-cyan-500/40 rounded text-xs">
                <div className="text-cyan-400 font-bold mb-1">SYSTEM ECHSE DIREKTIVE:</div>
                <div className="text-zinc-200">{simulationData.recommendation}</div>
              </div>

              {/* Endprotokoll */}
              {simulationData.endprotokoll && (
                <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800 text-[10px] text-zinc-400 space-y-1">
                  <div className="text-amber-400 font-bold">NULL-BALLAST-ENDPROTOKOLL</div>
                  <div>1. Ergebnis: {simulationData.endprotokoll.ergebnis}</div>
                  <div>2. Nächster Trigger: {simulationData.endprotokoll.trigger}</div>
                  <div>3. Archivierung: {simulationData.endprotokoll.archivierung}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500 text-xs border border-zinc-800 rounded bg-zinc-950/40">
              Klicke "QUANTEN-SUPERPOSITION BERECHNEN", um den Zustandsvektor nach Google Cirq Logik zu kollabieren.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

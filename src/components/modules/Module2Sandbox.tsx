import React, { useState } from 'react';
import { Terminal, ShieldCheck, ShieldX, Play, ArrowLeft, CheckCircle2, AlertOctagon } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Module2Props {
  onBack?: () => void;
}

const SAMPLE_CODE = `#!/bin/bash
# System Echse V6.1 Container Deployment Script
set -euo pipefail

CONTAINER_NAME="echse-core-node"
IMAGE_NAME="echse/runtime:hardened-v6.1"

echo "[WSL2/DOCKER] Starte isolierte Ausführung..."
docker run -d \\
  --name "\${CONTAINER_NAME}" \\
  --restart unless-stopped \\
  --security-opt no-new-privileges:true \\
  --memory 2g \\
  --cpus 2.0 \\
  -v /mnt/data/echse/memory:/var/data:ro \\
  -p 5000:5000 \\
  "\${IMAGE_NAME}"

echo "[WSL2/DOCKER] Container läuft isoliert. Windows-Host unangetastet."`;

export const Module2Sandbox: React.FC<Module2Props> = ({ onBack }) => {
  const [code, setCode] = useState<string>(SAMPLE_CODE);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const validateCode = async () => {
    soundManager.playExecute();
    setLoading(true);
    try {
      const res = await fetch('/api/echse/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setResult(data);
      if (data.valid) {
        soundManager.playSuccess();
      } else {
        soundManager.playWarning();
      }
    } catch (e) {
      soundManager.playWarning();
    } finally {
      setLoading(false);
    }
  };

  const injectBadWindowsSnippet = () => {
    soundManager.playClick();
    setCode(`powershell.exe -ExecutionPolicy Bypass -Command "Write-Host 'Windows Host Hook'"` + '\n' +
`cmd.exe /c "C:\\Program Files\\app.exe"` + '\n' +
`set DATA_PATH=C:\\Users\\Admin\\AppData\\Local` + '\n' +
`# Dieser Code verletzt das Windows-Verbot von System Echse V6.1`);
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
              <Terminal className="w-4 h-4 text-amber-400" />
              MODUL 2: SANDBOX-ZWANG & WINDOWS-VERBOT
            </h2>
            <p className="text-[11px] text-zinc-500">
              Zeilenweise statische Code-Validierung. Windows-Hosts sind Tabu (100% Isolation in WSL2/Docker).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={injectBadWindowsSnippet}
            className="text-[10px] text-zinc-400 hover:text-red-400 px-2 py-1 rounded border border-zinc-800 hover:border-red-500/40 bg-zinc-900"
            title="Testet den Windows-Verbot Filter mit verbotenem Code"
          >
            Windows-Verletzung testen
          </button>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            STATUS: ACTIVE AUDIT
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Editor Area */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-300">
            <span>CODE-EINGABE (BASH / DOCKER / PYTHON / POSIX):</span>
            <span className="text-[10px] text-zinc-500">{code.split('\n').length} Zeilen</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={15}
            className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-500 leading-relaxed"
            placeholder="# Füge Shell-, Docker- oder Python-Code zur Sandbox-Validierung ein..."
          />

          <button
            onClick={validateCode}
            disabled={loading || !code.trim()}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-amber-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>ZEILENWEISE SANDBOX-PRÜFUNG DURCHFÜHREN</span>
          </button>
        </div>

        {/* Audit Results */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs text-zinc-300 font-bold">AUDIT-ERGEBNIS DER SANDBOX:</div>

          {result ? (
            <div className={`p-3.5 rounded border ${
              result.valid 
                ? 'border-emerald-500/40 bg-emerald-950/20' 
                : 'border-red-500/40 bg-red-950/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {result.valid ? (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-emerald-400">CONTAINER-COMPLIANT: PASS</div>
                      <div className="text-[10px] text-emerald-300/80">100% POSIX / WSL2 Isolation erfüllt</div>
                    </div>
                  </>
                ) : (
                  <>
                    <ShieldX className="w-5 h-5 text-red-400" />
                    <div>
                      <div className="text-xs font-bold text-red-400">ISOLATIONS-VERLETZUNG: FAIL</div>
                      <div className="text-[10px] text-red-300/80">{result.violations.length} Regelverstöße detektiert</div>
                    </div>
                  </>
                )}
              </div>

              <p className="text-[11px] text-zinc-300 mb-3">{result.auditSummary}</p>

              {/* Violations List */}
              {result.violations && result.violations.length > 0 && (
                <div className="space-y-1.5 border-t border-zinc-800 pt-2 mb-3">
                  <div className="text-[10px] font-bold text-red-400">ISOLIERTE VERSTÖSSE:</div>
                  {result.violations.map((v: any, idx: number) => (
                    <div key={idx} className="bg-zinc-950/80 border border-red-500/30 p-2 rounded text-[10px]">
                      <div className="flex items-center justify-between text-red-400 font-bold">
                        <span>Zeile {v.line}</span>
                        <span className="text-[9px] bg-red-950 px-1 rounded border border-red-800">KRITISCH</span>
                      </div>
                      <div className="text-zinc-400 font-mono my-0.5 truncate">» {v.text}</div>
                      <div className="text-red-300/90">{v.message}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Protocol Block */}
              {result.protocol && (
                <div className="bg-zinc-950 p-2 rounded border border-zinc-800 text-[10px] text-zinc-400 space-y-1">
                  <div className="text-amber-400 font-bold">NULL-BALLAST-ENDPROTOKOLL</div>
                  <div>1. Ergebnis: {result.protocol.ergebnis}</div>
                  <div>2. Nächster Trigger: {result.protocol.trigger}</div>
                  <div>3. Archivierung: {result.protocol.archivierung}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 border border-zinc-800 bg-zinc-900/40 rounded text-center text-xs text-zinc-500">
              Klicke "ZEILENWEISE SANDBOX-PRÜFUNG DURCHFÜHREN", um den Code auf Windows-Befehle, PowerShell-Leaks und Host-Pfade zu auditieren.
            </div>
          )}

          <div className="p-3 bg-zinc-950 rounded border border-zinc-800 text-[10px] text-zinc-500 space-y-1">
            <div className="text-zinc-400 font-bold">DIREKTIVE MODUL 2:</div>
            <div>• Windows-Hosts sind ausnahmslos tabu.</div>
            <div>• Pfade müssen /mnt/... oder Docker-Mounts entsprechen.</div>
            <div>• Zeilenenden müssen LF sein (kein Windows CRLF).</div>
            <div>• Code-Ausführung ist nur in Containern mit no-new-privileges gestattet.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

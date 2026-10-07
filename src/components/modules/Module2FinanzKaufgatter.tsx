import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ShieldAlert,
  Coins,
  Briefcase,
  TrendingDown,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { KaufgatterItem, FixedCostItem, ContractItem } from '../../types/echse';
import { soundManager } from '../../utils/audio';

interface Module2Props {
  onBack?: () => void;
  items?: KaufgatterItem[];
  onUpdateItems?: (items: KaufgatterItem[]) => void;
  fixedCosts?: FixedCostItem[];
  onUpdateFixedCosts?: (costs: FixedCostItem[]) => void;
  contracts?: ContractItem[];
  onUpdateContracts?: (contracts: ContractItem[]) => void;
  userName?: string;
}

export const Module2FinanzKaufgatter: React.FC<Module2Props> = ({ 
  onBack, 
  items: propItems, 
  onUpdateItems,
  fixedCosts: propFixedCosts = [],
  onUpdateFixedCosts,
  contracts: propContracts = [],
  onUpdateContracts,
  userName = 'Benutzer'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'kaufgatter' | 'arbeitszeit' | 'abos'>('kaufgatter');
  const [internalItems, setInternalItems] = useState<KaufgatterItem[]>(propItems || []);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [aiAuditLoading, setAiAuditLoading] = useState<string | null>(null);
  const [aiAuditResults, setAiAuditResults] = useState<Record<string, string>>({});

  useEffect(() => {
    if (propItems) setInternalItems(propItems);
  }, [propItems]);

  const items = propItems || internalItems;

  const updateItems = (newItems: KaufgatterItem[]) => {
    setInternalItems(newItems);
    if (onUpdateItems) onUpdateItems(newItems);
  };

  const requestAiAudit = async (item: KaufgatterItem) => {
    setAiAuditLoading(item.id);
    soundManager.playExecute();
    try {
      const res = await fetch('/api/echse/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'V6_HARDENED',
          command: 'ECHSE: ANALYSE',
          input: `Konsum- & Kaufgatter-Audit für folgenden Artikel:
Name: ${item.name}
Preis: ${item.price} €
Kategorie: ${item.category}
Notwendigkeit: ${item.necessityScore}/10

Gib ein unerbittliches wirtschaftliches Urteil ab:
1. Ist der Kauf wirtschaftlich vertretbar oder Dopamin-getrieben?
2. Wie hoch sind die verdeckten Opportunitätskosten?
3. Konkrete Handlungsanweisung: JETZT KAUFEN oder SOFORT VERWERFEN?
Schließe mit dem NULL-BALLAST-ENDPROTOKOLL.`,
          activeModule: 2,
          context: 'Modul 2: Finanz-Souveränität & Kaufgatter'
        })
      });
      const data = await res.json();
      setAiAuditResults(prev => ({ ...prev, [item.id]: data.output || 'Kein Urteil generiert.' }));
      soundManager.playSuccess();
    } catch {
      soundManager.playWarning();
    } finally {
      setAiAuditLoading(null);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Form State Kaufgatter
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Hardware/Tech');
  const [necessityScore, setNecessityScore] = useState<number>(5);
  const [expectedUses, setExpectedUses] = useState<number>(50);
  const [altChecked, setAltChecked] = useState(false);
  const [dopamineChecked, setDopamineChecked] = useState(false);

  // Lebensarbeitszeit-Kalkulator
  const [hourlyWageNetto, setHourlyWageNetto] = useState<number>(18.50); // € / h netto
  const [calcItemPrice, setCalcItemPrice] = useState<number>(149.00);

  // Subscriptions & Fixed Costs
  const [fixedCosts, setFixedCosts] = useState<FixedCostItem[]>(propFixedCosts);
  const [newCostName, setNewCostName] = useState('');
  const [newCostAmount, setNewCostAmount] = useState('');
  const [newCostCycle, setNewCostCycle] = useState('monatlich');

  const updateCosts = (newCosts: FixedCostItem[]) => {
    setFixedCosts(newCosts);
    if (onUpdateFixedCosts) onUpdateFixedCosts(newCosts);
  };

  // Add Item to Kaufgatter
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newItemPrice);
    if (!newItemName.trim() || isNaN(priceNum) || priceNum <= 0) return;

    soundManager.playExecute();
    const now = Date.now();
    const lockDuration = 48 * 3600 * 1000; // 48h

    const item: KaufgatterItem = {
      id: `KG-${Date.now()}`,
      name: newItemName.trim(),
      price: priceNum,
      createdAt: now,
      lockUntil: now + lockDuration,
      category: newItemCategory,
      necessityScore,
      alternativesChecked: altChecked,
      dopamineImpulseChecked: dopamineChecked,
      status: 'LOCKED',
    };

    updateItems([item, ...items]);
    setNewItemName('');
    setNewItemPrice('');
    setAltChecked(false);
    setDopamineChecked(false);
  };

  const handleApprove = (id: string) => {
    soundManager.playClick();
    updateItems(items.map(it => it.id === id ? { ...it, status: 'APPROVED' } : it));
  };

  const handleDiscard = (id: string) => {
    soundManager.playWarning();
    updateItems(items.map(it => it.id === id ? { ...it, status: 'DISCARDED' } : it));
  };

  const handleDelete = (id: string) => {
    soundManager.playClick();
    updateItems(items.filter(it => it.id !== id));
  };

  // Add Fixed Cost
  const handleAddCost = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newCostAmount);
    if (!newCostName.trim() || isNaN(amountNum) || amountNum <= 0) return;

    soundManager.playClick();
    const newCost: FixedCostItem = {
      id: `FC-${Date.now()}`,
      name: newCostName.trim(),
      amount: amountNum,
      cycle: newCostCycle
    };
    const updated = [...fixedCosts, newCost];
    updateCosts(updated);
    setNewCostName('');
    setNewCostAmount('');
  };

  const handleRemoveCost = (id: string) => {
    soundManager.playWarning();
    const updated = fixedCosts.filter(c => c.id !== id);
    updateCosts(updated);
  };

  // Metrics
  const lockedItems = items.filter(i => i.status === 'LOCKED');
  const discardedItems = items.filter(i => i.status === 'DISCARDED');
  const savedAmount = discardedItems.reduce((sum, it) => sum + it.price, 0);
  const totalLockedAmount = lockedItems.reduce((sum, it) => sum + it.price, 0);
  const monthlyFixedTotal = fixedCosts.reduce((sum, c) => sum + (c.cycle === 'jährlich' ? c.amount / 12 : c.amount), 0);

  // Time remaining format
  const formatTimeRemaining = (lockUntil: number) => {
    const diff = lockUntil - currentTime;
    if (diff <= 0) return 'ENTSPERRT';
    const hours = Math.floor(diff / (3600 * 1000));
    const mins = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
    const secs = Math.floor((diff % (60 * 1000)) / 1000);
    return `${hours}h ${mins}m ${secs}s`;
  };

  const requiredWorkHours = calcItemPrice / (hourlyWageNetto || 1);

  return (
    <div className="p-4 space-y-5 font-mono max-w-6xl mx-auto">
      {/* Header Bar */}
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
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                MODUL 2 // WIRTSCHAFT & SOUVERÄNITÄT
              </span>
              <span className="text-zinc-500 text-xs">V6.1 HARDENED</span>
            </div>
            <h1 className="text-lg font-bold text-amber-300">
              Finanz-Souveränität & 48h-Kaufgatter
            </h1>
          </div>
        </div>

        {/* Global Financial Metrics */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1 bg-emerald-950/40 border border-emerald-500/40 rounded flex items-center gap-2 text-emerald-400">
            <Coins className="w-4 h-4" />
            <span>Ersparnis: <strong className="text-emerald-300">+{savedAmount.toFixed(2)} €</strong></span>
          </div>
          <div className="px-3 py-1 bg-amber-950/40 border border-amber-500/40 rounded flex items-center gap-2 text-amber-400">
            <Lock className="w-4 h-4" />
            <span>Gesperrt: <strong className="text-amber-300">{totalLockedAmount.toFixed(2)} €</strong></span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveSubTab('kaufgatter');
          }}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'kaufgatter'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>48H-KAUFGATTER ({lockedItems.length})</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveSubTab('arbeitszeit');
          }}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'arbeitszeit'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>LEBENSARBEITSZEIT-RECHNER</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveSubTab('abos');
          }}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'abos'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>ABO-RADAR & FIXKOSTEN ({fixedCosts.length})</span>
        </button>
      </div>

      {/* Tab 1: 48h Kaufgatter */}
      {activeSubTab === 'kaufgatter' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Form: Add Impulse Item */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded space-y-4">
            <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>IMPULS-KAUFWUNSCH ARRETIEREN</span>
            </h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Jeder ungeplante Kaufwunsch über 50 € wird für 48 Stunden unter Quarantäne gestellt. 80% aller Kaufimpulse verfliegen nach 2 Tagen.
            </p>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Produkt / Artikel:</label>
                <input
                  type="text"
                  placeholder="z.B. Kopfhörer, Smartwatch, Jacke"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Preis (€):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="120.00"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Kategorie:</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-200 outline-none"
                  >
                    <option value="Hardware/Tech">Hardware/Tech</option>
                    <option value="Kleidung">Kleidung</option>
                    <option value="Software/Abo">Software/Abo</option>
                    <option value="Haushalt/Living">Haushalt/Living</option>
                    <option value="Gaming/Gadget">Gaming/Gadget</option>
                  </select>
                </div>
              </div>

              {/* Dopamine & Alternatives Checklist */}
              <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800 space-y-2 text-xs">
                <label className="flex items-start gap-2 cursor-pointer text-zinc-300 text-[11px]">
                  <input
                    type="checkbox"
                    checked={dopamineChecked}
                    onChange={(e) => setDopamineChecked(e.target.checked)}
                    className="mt-0.5 accent-amber-500"
                  />
                  <span>Dopamin-Check: Kaufe ich das aus Langeweile, Frust oder Erschöpfung?</span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer text-zinc-300 text-[11px]">
                  <input
                    type="checkbox"
                    checked={altChecked}
                    onChange={(e) => setAltChecked(e.target.checked)}
                    className="mt-0.5 accent-amber-500"
                  />
                  <span>Gebraucht/Alternativen geprüft? Besitze ich bereits etwas Ähnliches?</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>48 STUNDEN SPERREN</span>
              </button>
            </form>
          </div>

          {/* List of Kaufgatter Items (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>ARRETIERTE KAUFWÜNSCHE ({items.length})</span>
              <span className="text-[11px] text-zinc-500">Automatische Entsperrung nach 48h</span>
            </h3>

            {items.length === 0 ? (
              <div className="p-8 border border-dashed border-zinc-800 rounded text-center text-zinc-500 text-xs">
                Keine Kaufwünsche arretiert. Das System schützt dein Kapital vor impulsiven Fehlausgaben.
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => {
                  const isLocked = item.status === 'LOCKED' && item.lockUntil > currentTime;
                  const isReady = item.status === 'LOCKED' && item.lockUntil <= currentTime;

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded border transition-all ${
                        item.status === 'DISCARDED' ? 'bg-zinc-950/40 border-zinc-800/50 opacity-60' :
                        item.status === 'APPROVED' ? 'bg-emerald-950/20 border-emerald-500/30' :
                        isReady ? 'bg-amber-950/20 border-amber-500/60' :
                        'bg-zinc-900/60 border-zinc-800'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-zinc-200">{item.name}</h4>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                              {item.category}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                              item.status === 'DISCARDED' ? 'bg-red-950 text-red-400 border border-red-800' :
                              item.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                              isReady ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                              'bg-zinc-800 text-amber-400'
                            }`}>
                              {item.status === 'DISCARDED' ? 'VERWORFEN (GELD GESPART)' :
                               item.status === 'APPROVED' ? 'FREIGEGEBEN' :
                               isReady ? '48H ABGELAUFEN (PRÜFEN)' : '48H SPERRE AKTIV'}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-3">
                            <span>Preis: <strong className="text-amber-300">{item.price.toFixed(2)} €</strong></span>
                            {isLocked && (
                              <span className="text-amber-400 flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3" />
                                Noch {formatTimeRemaining(item.lockUntil)} gesperrt
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.status === 'LOCKED' && (
                            <>
                              <button
                                onClick={() => requestAiAudit(item)}
                                disabled={aiAuditLoading === item.id}
                                className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded text-xs flex items-center gap-1 transition-colors"
                                title="KI-Urteil über Notwendigkeit anfordern"
                              >
                                <span>{aiAuditLoading === item.id ? 'AUDITIERT...' : 'KI-AUDIT'}</span>
                              </button>
                              <button
                                onClick={() => handleDiscard(item.id)}
                                className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-300 rounded text-xs flex items-center gap-1 transition-colors"
                                title="Kauf streichen und Geld sparen"
                              >
                                <Coins className="w-3 h-3" />
                                <span>VERWERFEN (+{item.price.toFixed(0)}€)</span>
                              </button>
                              <button
                                onClick={() => handleApprove(item.id)}
                                className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded text-xs flex items-center gap-1 transition-colors"
                                title="Kauf nach reiflicher Überlegung freigeben"
                              >
                                <CheckCircle className="w-3 h-3" />
                                <span>KAUFEN</span>
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-zinc-600 hover:text-zinc-400"
                            title="Eintrag löschen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* AI Audit Result Box */}
                      {aiAuditResults[item.id] && (
                        <div className="mt-2.5 p-3 bg-zinc-950 rounded border border-amber-500/40 text-xs text-zinc-200 space-y-1">
                          <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <span>KI-URTEIL (ECHSE V6.1 HARDENED):</span>
                          </div>
                          <p className="whitespace-pre-line leading-relaxed text-zinc-300">
                            {aiAuditResults[item.id]}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Lebensarbeitszeit-Rechner */}
      {activeSubTab === 'arbeitszeit' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded space-y-4">
            <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>LEBENSARBEITSZEIT-KONTROLLE</span>
            </h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Jeder Geldbetrag entspricht unwiederbringlicher Lebenszeit. Berechne, wie viele Stunden harter Arbeit du für einen Kauf opfern musst.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Dein Netto-Stundenlohn (€/h):</label>
                <input
                  type="number"
                  step="0.50"
                  value={hourlyWageNetto}
                  onChange={(e) => setHourlyWageNetto(parseFloat(e.target.value) || 1)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-amber-300 font-bold outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Kaufpreis des Artikels (€):</label>
                <input
                  type="number"
                  step="1"
                  value={calcItemPrice}
                  onChange={(e) => setCalcItemPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-200 outline-none"
                />
              </div>
            </div>

            {/* Result Box */}
            <div className="p-4 bg-zinc-950 rounded border border-amber-500/30 space-y-2">
              <div className="text-[11px] text-zinc-500">BENÖTIGTE LEBENSARBEITSZEIT:</div>
              <div className="text-3xl font-bold font-mono text-amber-400">
                {requiredWorkHours.toFixed(1)} <span className="text-sm font-normal text-zinc-400">Stunden</span>
              </div>
              <div className="text-[11px] text-zinc-400">
                Entspricht {(requiredWorkHours / 8).toFixed(1)} vollen 8-Stunden-Arbeitstagen reiner Lebenszeit.
              </div>
            </div>
          </div>

          {/* Cost-per-Use Box */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded space-y-3">
            <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>COST-PER-USE REALITÄTS-CHECK</span>
            </h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Teure Anschaffungen sind ökonomisch sinnvoll, wenn sie täglich genutzt werden. Billige Dinge, die nur 2x genutzt werden, sind Geldvernichtung.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Geschätzte Nutzungen:</label>
                <input
                  type="number"
                  value={expectedUses}
                  onChange={(e) => setExpectedUses(parseInt(e.target.value) || 1)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-200 outline-none"
                />
              </div>

              <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
                <div className="text-[11px] text-zinc-500">KOSTEN PRO EINZELNER NUTZUNG:</div>
                <div className="text-2xl font-bold font-mono text-emerald-300">
                  {(calcItemPrice / (expectedUses || 1)).toFixed(2)} € <span className="text-xs font-normal text-zinc-500">/ Verwendung</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Abo-Radar & Fixkosten */}
      {activeSubTab === 'abos' && (
        <div className="space-y-4">
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>LAUFENDE FIXKOSTEN & ABONNEMENTS ({fixedCosts.length})</span>
              </h3>
              <div className="text-xs font-mono font-bold text-amber-300">
                Monatlich gesamt: {monthlyFixedTotal.toFixed(2)} €
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {fixedCosts.map((cost) => (
                <div key={cost.id} className="p-2.5 bg-zinc-950 rounded border border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-zinc-200">{cost.name}</div>
                    <div className="text-[10px] text-zinc-400">
                      {cost.amount.toFixed(2)} € ({cost.cycle})
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveCost(cost.id)}
                    className="p-1 text-zinc-600 hover:text-red-400"
                    title="Abo entfernen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Cost Form */}
            <form onSubmit={handleAddCost} className="pt-2 border-t border-zinc-800 flex flex-wrap gap-2 items-center">
              <input
                type="text"
                placeholder="Abo/Fixkostenname (z.B. Streaming, Gym)"
                value={newCostName}
                onChange={(e) => setNewCostName(e.target.value)}
                className="flex-1 min-w-[180px] bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 outline-none"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Betrag (€)"
                value={newCostAmount}
                onChange={(e) => setNewCostAmount(e.target.value)}
                className="w-24 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 outline-none"
              />
              <select
                value={newCostCycle}
                onChange={(e) => setNewCostCycle(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 outline-none"
              >
                <option value="monatlich">monatlich</option>
                <option value="jährlich">jährlich</option>
              </select>
              <button
                type="submit"
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>HINZUFÜGEN</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

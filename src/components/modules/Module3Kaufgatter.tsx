import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Clock, AlertTriangle, CheckCircle, Plus, Trash2, ArrowLeft, ShieldAlert } from 'lucide-react';
import { KaufgatterItem } from '../../types/echse';
import { soundManager } from '../../utils/audio';

interface Module3Props {
  onBack?: () => void;
  items?: KaufgatterItem[];
  onUpdateItems?: (items: KaufgatterItem[]) => void;
  userName?: string;
}

export const Module3Kaufgatter: React.FC<Module3Props> = ({ 
  onBack, 
  items: propItems, 
  onUpdateItems,
  userName = 'Benutzer'
}) => {
  const [internalItems, setInternalItems] = useState<KaufgatterItem[]>(propItems || []);

  useEffect(() => {
    if (propItems) {
      setInternalItems(propItems);
    }
  }, [propItems]);

  const items = propItems || internalItems;

  const updateItems = (newItems: KaufgatterItem[]) => {
    setInternalItems(newItems);
    if (onUpdateItems) {
      onUpdateItems(newItems);
    }
  };

  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Hardware');
  const [necessityScore, setNecessityScore] = useState<number>(5);
  const [expectedUses, setExpectedUses] = useState<number>(50);
  const [altChecked, setAltChecked] = useState(false);
  const [dopamineChecked, setDopamineChecked] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newItemPrice);
    if (!newItemName.trim() || isNaN(priceNum) || priceNum <= 0) return;

    soundManager.playExecute();
    const now = Date.now();
    const lockDuration = 48 * 3600 * 1000; // 48 Hours

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
    soundManager.playSuccess();
  };

  const removeItem = (id: string) => {
    soundManager.playClick();
    updateItems(items.filter(i => i.id !== id));
  };

  const approveItem = (id: string) => {
    soundManager.playSuccess();
    updateItems(items.map(i => i.id === id ? { ...i, status: 'APPROVED' } : i));
  };

  const discardItem = (id: string) => {
    soundManager.playClick();
    updateItems(items.map(i => i.id === id ? { ...i, status: 'DISCARDED' } : i));
  };

  const formatRemaining = (lockUntil: number) => {
    const diff = lockUntil - currentTime;
    if (diff <= 0) return 'GATTER ENTSPERRT';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  };

  const priceNum = parseFloat(newItemPrice) || 0;
  const costPerUse = expectedUses > 0 ? (priceNum / expectedUses).toFixed(2) : '0.00';

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
              <Lock className="w-4 h-4 text-amber-400" />
              MODUL 3: 48-STUNDEN-KAUFGATTER (ANTI-IMPULS)
            </h2>
            <p className="text-[11px] text-zinc-500">
              Erzwungene 48h-Abklingzeit für {userName}. Eliminiert unüberlegte Spontankäufe durch rationale Nutzwert-Kalkulation.
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
          STATUS: ARMED & LOCKED
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Input Form Column */}
        <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800 rounded p-4 space-y-3">
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            NEUES PRODUKT IM KAUFGATTER SPERREN
          </div>

          <form onSubmit={handleAddItem} className="space-y-3">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">PRODUKTBEZEICHNUNG:</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="z. B. Smart-Home Sensor, Grafikkarte, Werkzeug..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">PREIS (€):</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  placeholder="99.00"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">KATEGORIE:</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value="Hardware">Hardware / Elektronik</option>
                  <option value="Botanik">Botanik / Pflanzen</option>
                  <option value="Tiere">Haustiere / Pflege</option>
                  <option value="Software">Software / Lizenzen</option>
                  <option value="Konsum">Sonstiges Konsumgut</option>
                </select>
              </div>
            </div>

            {/* Cost-Per-Use Calculation */}
            <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] space-y-1.5">
              <div className="text-zinc-400 font-bold">RATIONALE KALKULATION (COST-PER-USE):</div>
              <div className="flex items-center justify-between">
                <span>Geschätzte Nutzungen im Jahr:</span>
                <input
                  type="number"
                  value={expectedUses}
                  onChange={(e) => setExpectedUses(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-right text-xs text-amber-300"
                />
              </div>
              <div className="flex items-center justify-between text-zinc-300 pt-1 border-t border-zinc-800">
                <span>Echte Kosten pro Nutzung:</span>
                <span className="font-bold text-amber-400">{costPerUse} € / Einsatz</span>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-1 text-[11px] text-zinc-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={altChecked}
                  onChange={(e) => setAltChecked(e.target.checked)}
                  className="rounded border-zinc-700 text-amber-500 focus:ring-0 bg-zinc-950"
                />
                <span>Bereits vorhandene Alternativen geprüft (Kein Doppel-Kauf).</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dopamineChecked}
                  onChange={(e) => setDopamineChecked(e.target.checked)}
                  className="rounded border-zinc-700 text-amber-500 focus:ring-0 bg-zinc-950"
                />
                <span>Dopamin-Check: Kauf entspringt keinem Stress oder Frust.</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>IN DAS 48-STUNDEN-GATTER EINSCHLIESSEN</span>
            </button>
          </form>
        </div>

        {/* Locked Items List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-300 font-bold">
            <span>GESPERRTE ARTIKEL ({items.length})</span>
            <span className="text-[10px] text-zinc-500">Automatischer 48h-Countdown</span>
          </div>

          <div className="space-y-2.5">
            {items.length === 0 ? (
              <div className="p-8 text-center border border-zinc-800 rounded bg-zinc-900/30 text-zinc-500 text-xs space-y-1">
                <div className="font-bold text-zinc-400">Keine aktiven Artikel im Gatter</div>
                <div>Das System ist diszipliniert. Füge geplante Anschaffungen oben hinzu, um Impulskäufe zu verhindern.</div>
              </div>
            ) : (
              items.map((item) => {
                const isUnlocked = currentTime >= item.lockUntil;
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded border transition-all ${
                      item.status === 'APPROVED' ? 'border-emerald-500/40 bg-emerald-950/20' :
                      item.status === 'DISCARDED' ? 'border-zinc-800 bg-zinc-950/40 opacity-60' :
                      isUnlocked ? 'border-amber-400 bg-amber-950/20' : 'border-zinc-800 bg-zinc-900/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {isUnlocked ? (
                          <Unlock className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-amber-400" />
                        )}
                        <span className="text-xs font-bold text-zinc-100">{item.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-amber-400">
                        {item.price.toFixed(2)} €
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 my-2 bg-zinc-950/80 p-2 rounded border border-zinc-800/60">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'text-amber-300 font-bold'}>
                          {isUnlocked ? '48H-SPERRE ABGELAUFEN // FREIGEGEBEN' : `Sperrzeit: ${formatRemaining(item.lockUntil)}`}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Nutzwert: {item.necessityScore}/10
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-zinc-800/60 text-xs">
                      {item.status === 'LOCKED' && isUnlocked && (
                        <button
                          onClick={() => approveItem(item.id)}
                          className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[10px] rounded flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          RATIONAL FREIGEBEN
                        </button>
                      )}

                      {item.status === 'LOCKED' && (
                        <button
                          onClick={() => discardItem(item.id)}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-red-950 hover:text-red-400 text-zinc-300 text-[10px] rounded border border-zinc-700"
                        >
                          VERWERFEN (IMPULS ABGEWENDET)
                        </button>
                      )}

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-zinc-500 hover:text-zinc-300"
                        title="Aus Archiv entfernen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

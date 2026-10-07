import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Refrigerator, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Utensils, 
  Clock, 
  DollarSign, 
  Bot, 
  RefreshCw,
  Sparkles,
  Check
} from 'lucide-react';
import { PantryItem, ShoppingItem, UserProfileData } from '../../types/echse';
import { soundManager } from '../../utils/audio';

interface ModulePantryProps {
  onBack?: () => void;
  pantryItems?: PantryItem[];
  onUpdatePantry?: (items: PantryItem[]) => void;
  shoppingList?: ShoppingItem[];
  onUpdateShopping?: (items: ShoppingItem[]) => void;
  userName?: string;
}

export const ModulePantryShopping: React.FC<ModulePantryProps> = ({
  onBack,
  pantryItems: propPantry = [],
  onUpdatePantry,
  shoppingList: propShopping = [],
  onUpdateShopping,
  userName = 'Haushalt'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'vorrat' | 'einkauf' | 'restekoch'>('vorrat');
  const [pantry, setPantry] = useState<PantryItem[]>(propPantry);
  const [shopping, setShopping] = useState<ShoppingItem[]>(propShopping);

  // New Pantry Item Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState<PantryItem['category']>('Kühlschrank');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('Stk');
  const [newItemExpiry, setNewItemExpiry] = useState('');

  // New Shopping Item Form State
  const [newShopName, setNewShopName] = useState('');
  const [newShopCat, setNewShopCat] = useState<ShoppingItem['category']>('Obst/Gemüse');
  const [newShopPrice, setNewShopPrice] = useState('');
  const [newShopUrgent, setNewShopUrgent] = useState(false);

  // AI Chef State
  const [aiChefLoading, setAiChefLoading] = useState(false);
  const [aiChefRecipe, setAiChefRecipe] = useState<string>('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const updatePantryState = (updated: PantryItem[]) => {
    setPantry(updated);
    if (onUpdatePantry) onUpdatePantry(updated);
  };

  const updateShoppingState = (updated: ShoppingItem[]) => {
    setShopping(updated);
    if (onUpdateShopping) onUpdateShopping(updated);
  };

  // Add Item to Pantry
  const handleAddPantryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    soundManager.playClick();
    const item: PantryItem = {
      id: `pi-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCat,
      quantity: Number(newItemQty) || 1,
      unit: newItemUnit,
      expiryDate: newItemExpiry || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
    };
    updatePantryState([item, ...pantry]);
    setNewItemName('');
    setNewItemExpiry('');
  };

  const handleRemovePantryItem = (id: string) => {
    soundManager.playWarning();
    updatePantryState(pantry.filter(p => p.id !== id));
  };

  // Add Item to Shopping List
  const handleAddShoppingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName.trim()) return;

    soundManager.playClick();
    const item: ShoppingItem = {
      id: `sl-${Date.now()}`,
      name: newShopName.trim(),
      category: newShopCat,
      estimatedPrice: parseFloat(newShopPrice) || 0,
      checked: false,
      urgent: newShopUrgent
    };
    updateShoppingState([item, ...shopping]);
    setNewShopName('');
    setNewShopPrice('');
    setNewShopUrgent(false);
  };

  const handleToggleShopItem = (id: string) => {
    soundManager.playClick();
    updateShoppingState(shopping.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  const handleRemoveShopItem = (id: string) => {
    soundManager.playWarning();
    updateShoppingState(shopping.filter(s => s.id !== id));
  };

  // Calculate Expiry Warning (< 3 Days)
  const nowMs = Date.now();
  const getDaysUntilExpiry = (expiryDate: string) => {
    if (!expiryDate) return 999;
    const expMs = new Date(expiryDate).getTime();
    return Math.ceil((expMs - nowMs) / (1000 * 3600 * 24));
  };

  const expiringItems = pantry.filter(p => getDaysUntilExpiry(p.expiryDate) <= 4);

  // Toggle selection for AI recipe
  const toggleIngredientSelection = (name: string) => {
    soundManager.playClick();
    if (selectedIngredients.includes(name)) {
      setSelectedIngredients(selectedIngredients.filter(n => n !== name));
    } else {
      setSelectedIngredients([...selectedIngredients, name]);
    }
  };

  // Run AI Restekoch
  const handleRunAiChef = async () => {
    const ingredientsToCook = selectedIngredients.length > 0 
      ? selectedIngredients.join(', ')
      : expiringItems.length > 0 
        ? expiringItems.map(i => `${i.name} (MHD beachten!)`).join(', ')
        : pantry.slice(0, 5).map(i => i.name).join(', ');

    if (!ingredientsToCook) {
      setAiChefRecipe('Bitte wähle mindestens eine Zutat aus der Vorratskammer aus.');
      return;
    }

    setAiChefLoading(true);
    soundManager.playExecute();

    try {
      const res = await fetch('/api/echse/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'HYBRID',
          command: 'ECHSE: ANALYSE',
          input: `Du bist der smarte KI-Restekoch für den Haushalt von ${userName}.
Verfügbare Vorräte & Reste:
${ingredientsToCook}

Aufgabe:
1. Erstelle ein schnelles, gesundes und köstliches Rezept (Zubereitung ca. 20-30 Min).
2. Nutze prioritär die bald ablaufenden Reste (Zero-Waste, bares Geld sparen).
3. Gib eine übersichtliche Schritt-für-Schritt Kochanleitung.
4. Schätze den Nährwert & die Zubereitungszeit.
Beende mit dem SYMBIOSIS-ENDPROTOKOLL (Erkenntnis zur Ernährung, Impuls zum Genuss).`,
          activeModule: 1,
          context: 'Haushalt: Vorratskammer & Smarter Restekoch'
        })
      });

      const data = await res.json();
      setAiChefRecipe(data.output || 'Kein Rezept generiert.');
      soundManager.playSuccess();
    } catch {
      soundManager.playWarning();
    } finally {
      setAiChefLoading(false);
    }
  };

  const totalEstimatedShopping = shopping.filter(s => !s.checked).reduce((sum, s) => sum + s.estimatedPrice, 0);

  return (
    <div className="p-4 space-y-5 font-mono max-w-7xl mx-auto text-zinc-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => { soundManager.playClick(); onBack(); }}
              className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                HAUSHALT & ERNÄHRUNG // ZERO-WASTE
              </span>
              <span className="text-zinc-500 text-xs">MHD-Radar & Einkaufsliste</span>
            </div>
            <h1 className="text-lg font-bold text-amber-300">
              Vorratskammer, Kühlschrank & Smarter Einkauf
            </h1>
          </div>
        </div>

        {/* Global Value Counters */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1 bg-red-950/40 border border-red-500/40 rounded flex items-center gap-2 text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>MHD-Alarm: <strong>{expiringItems.length} Posten bald fällig</strong></span>
          </div>
          <div className="px-3 py-1 bg-emerald-950/40 border border-emerald-500/40 rounded flex items-center gap-2 text-emerald-300">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Einkauf: <strong>{totalEstimatedShopping.toFixed(2)} € offen</strong></span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => { soundManager.playClick(); setActiveSubTab('vorrat'); }}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'vorrat'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Refrigerator className="w-3.5 h-3.5" />
          <span>VORRATSKAMMER & KÜHLSCHRANK ({pantry.length})</span>
        </button>

        <button
          onClick={() => { soundManager.playClick(); setActiveSubTab('einkauf'); }}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'einkauf'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>SMARTE EINKAUFSLISTE ({shopping.filter(s => !s.checked).length})</span>
        </button>

        <button
          onClick={() => { soundManager.playClick(); setActiveSubTab('restekoch'); }}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'restekoch'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-zinc-900 text-amber-300 hover:text-amber-200 border border-amber-500/30'
          }`}
        >
          <Utensils className="w-3.5 h-3.5 text-amber-400" />
          <span>KI-RESTEKOCH (ZERO-WASTE)</span>
        </button>
      </div>

      {/* Subtab 1: Vorratskammer & MHD-Radar */}
      {activeSubTab === 'vorrat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Add Pantry Form (1 Col) */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded space-y-3">
            <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>LEBENSMITTEL ZUM VORRAT HINZUFÜGEN</span>
            </h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Jedes vor dem Verderb gerettete Lebensmittel spart bares Geld und schont Umwelt & Ressourcen.
            </p>

            <form onSubmit={handleAddPantryItem} className="space-y-3">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Produkt / Zutat:</label>
                <input
                  type="text"
                  placeholder="z.B. Bio-Joghurt, Eier, Nudeln"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Lagerort:</label>
                  <select
                    value={newItemCat}
                    onChange={(e) => setNewItemCat(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-200 outline-none"
                  >
                    <option value="Kühlschrank">Kühlschrank</option>
                    <option value="Tiefkühler">Tiefkühler</option>
                    <option value="Vorratskammer">Vorratskammer</option>
                    <option value="Gewürze/Trocken">Gewürze/Trocken</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Menge & Einheit:</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      min="1"
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(parseInt(e.target.value) || 1)}
                      className="w-14 bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-200 outline-none"
                    />
                    <input
                      type="text"
                      value={newItemUnit}
                      onChange={(e) => setNewItemUnit(e.target.value)}
                      placeholder="g / kg / Stk"
                      className="w-16 bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-200 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Mindesthaltbarkeit (MHD):</label>
                <input
                  type="date"
                  value={newItemExpiry}
                  onChange={(e) => setNewItemExpiry(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>IN VORRAT EINTRAGEN</span>
              </button>
            </form>
          </div>

          {/* Pantry Inventory List (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                <Refrigerator className="w-4 h-4 text-cyan-400" />
                <span>LAGERBESTAND & MHD-STATUS ({pantry.length})</span>
              </h3>
              <span className="text-[10px] text-zinc-500">MHD-Radar aktiv</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {pantry.map((item) => {
                const days = getDaysUntilExpiry(item.expiryDate);
                const isUrgent = days <= 2;
                const isWarning = days <= 5;

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded border transition-all flex flex-col justify-between ${
                      isUrgent
                        ? 'bg-red-950/20 border-red-500/50 shadow-sm shadow-red-950/20'
                        : isWarning
                          ? 'bg-amber-950/20 border-amber-500/40'
                          : 'bg-zinc-900/60 border-zinc-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-xs text-zinc-200">{item.name}</strong>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                        <span>Bestand: <strong className="text-zinc-200">{item.quantity} {item.unit}</strong></span>
                        <span className={`font-bold ${
                          isUrgent ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {days <= 0 ? 'HEUTE ABLAUFEND' : `Noch ${days} Tage`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px]">
                      <span className="text-zinc-500">MHD: {item.expiryDate}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleIngredientSelection(item.name)}
                          className={`px-2 py-0.5 rounded border transition-colors ${
                            selectedIngredients.includes(item.name)
                              ? 'bg-amber-500 text-black font-bold border-amber-400'
                              : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-amber-500'
                          }`}
                          title="Für KI-Restekoch auswählen"
                        >
                          {selectedIngredients.includes(item.name) ? '✓ GEWÄHLT' : '+ FÜR REZEPT'}
                        </button>
                        <button
                          onClick={() => handleRemovePantryItem(item.id)}
                          className="p-1 text-zinc-600 hover:text-red-400"
                          title="Entfernen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Smarte Einkaufsliste */}
      {activeSubTab === 'einkauf' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Add Shopping Item (1 Col) */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>ARTIKEL ZUR EINKAUFSLISTE</span>
            </h3>

            <form onSubmit={handleAddShoppingItem} className="space-y-3">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Artikel:</label>
                <input
                  type="text"
                  placeholder="z.B. Bio-Kaffee, Hafermilch, Seife"
                  value={newShopName}
                  onChange={(e) => setNewShopName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Abteilung:</label>
                  <select
                    value={newShopCat}
                    onChange={(e) => setNewShopCat(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-200 outline-none"
                  >
                    <option value="Obst/Gemüse">Obst/Gemüse</option>
                    <option value="Kühltheke">Kühltheke</option>
                    <option value="Trockenware">Trockenware</option>
                    <option value="Haushalt/Drogerie">Haushalt/Drogerie</option>
                    <option value="Tierbedarf">Tierbedarf</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Geschätzter Preis (€):</label>
                  <input
                    type="number"
                    step="0.10"
                    placeholder="3.50"
                    value={newShopPrice}
                    onChange={(e) => setNewShopPrice(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-200 outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={newShopUrgent}
                  onChange={(e) => setNewShopUrgent(e.target.checked)}
                  className="accent-amber-500"
                />
                <span>Dringend benötigt (Wichtig für heute)</span>
              </label>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>AUF LISTE SETZEN</span>
              </button>
            </form>
          </div>

          {/* Shopping Checklist (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>OFFENE EINKÄUFE ({shopping.filter(s => !s.checked).length})</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Geschätzte Gesamtkosten: {totalEstimatedShopping.toFixed(2)} €
              </span>
            </div>

            <div className="space-y-1.5">
              {shopping.map((item) => (
                <div
                  key={item.id}
                  className={`p-2.5 rounded border transition-all flex items-center justify-between gap-2 ${
                    item.checked
                      ? 'bg-zinc-950/40 border-zinc-800 opacity-50 line-through'
                      : item.urgent
                        ? 'bg-amber-950/20 border-amber-500/50'
                        : 'bg-zinc-900/60 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleToggleShopItem(item.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        item.checked ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-zinc-700 bg-zinc-950'
                      }`}
                    >
                      {item.checked && <Check className="w-3 h-3" />}
                    </button>
                    <div>
                      <span className="text-xs font-bold text-zinc-200">{item.name}</span>
                      <span className="text-[10px] text-zinc-500 ml-2">[{item.category}]</span>
                      {item.urgent && !item.checked && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold ml-2">
                          DRINGEND
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-zinc-300">
                      {item.estimatedPrice > 0 ? `${item.estimatedPrice.toFixed(2)} €` : '-'}
                    </span>
                    <button
                      onClick={() => handleRemoveShopItem(item.id)}
                      className="p-1 text-zinc-600 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: KI-Restekoch */}
      {activeSubTab === 'restekoch' && (
        <div className="space-y-4">
          <div className="p-4 bg-zinc-900/60 border border-amber-500/30 rounded space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span>KI-RESTEKOCH // ZERO-WASTE REZEPTE AUS DEINEM VORRAT</span>
              </h3>
              <span className="text-[10px] text-zinc-500">Gemini Neural Core</span>
            </div>

            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Wähle Zutaten aus deiner Vorratskammer aus oder lass die KI automatisch alle bald ablaufenden Posten kombinieren. So wird kein Essen weggeworfen.
            </p>

            {/* Selected Ingredients Pill Bar */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-zinc-500 font-bold">Ausgewählt ({selectedIngredients.length}):</span>
              {selectedIngredients.map((ing) => (
                <span key={ing} className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] flex items-center gap-1">
                  <span>{ing}</span>
                  <button onClick={() => toggleIngredientSelection(ing)} className="hover:text-red-400">×</button>
                </span>
              ))}
              {selectedIngredients.length === 0 && (
                <span className="text-[11px] text-zinc-500 italic">
                  (Keine manuell gewählt - KI nutzt automatisch bald ablaufende MHD-Artikel)
                </span>
              )}
            </div>

            <button
              onClick={handleRunAiChef}
              disabled={aiChefLoading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-xs flex items-center justify-center gap-2 shadow transition-colors disabled:opacity-50"
            >
              {aiChefLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>KI KREIERT EIN ZERO-WASTE REZEPT AUS DEINEM VORRAT...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>JETZT ZERO-WASTE REZEPT GENERIEREN</span>
                </>
              )}
            </button>

            {/* Recipe Output Box */}
            {aiChefRecipe && (
              <div className="p-4 bg-zinc-950 rounded border border-amber-500/40 space-y-2 mt-3">
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>KÖSTLICHES RESTE-REZEPT (KI-ENTWURF):</span>
                </div>
                <div className="whitespace-pre-line leading-relaxed text-zinc-200 text-xs font-sans max-h-96 overflow-y-auto">
                  {aiChefRecipe}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

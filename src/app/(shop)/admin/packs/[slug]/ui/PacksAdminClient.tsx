'use client';

import { useState, useTransition } from 'react';
import { createPack, togglePack, deletePack, updatePack } from '@/actions/packs/pack-actions';
import { IoAddOutline, IoTrashOutline, IoCheckmarkCircle, IoCloseCircle, IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import clsx from 'clsx';
import { PackOption } from '@/interfaces';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
}

interface PackProduct {
  product: Product;
}

interface Pack {
  id: string;
  title: string;
  description: string;
  price: number;
  comparePrice: number | null;
  isActive: boolean;
  soldCount: number;
  products: PackProduct[];
  options: any;
}

interface Props {
  initialPacks: Pack[];
  allProducts: Product[];
}

export const PacksAdminClient = ({ initialPacks, allProducts }: Props) => {
  const [packs, setPacks] = useState(initialPacks);
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle]               = useState('');
  const [description, setDescription]   = useState('');
  const [price, setPrice]               = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [search, setSearch]             = useState('');
  const [formError, setFormError]       = useState('');
  const [options, setOptions]           = useState<PackOption[]>([]);

  // Edit state
  const [editingPack, setEditingPack]           = useState<Pack | null>(null);
  const [editPrice, setEditPrice]               = useState('');
  const [editComparePrice, setEditComparePrice] = useState('');
  const [editTitle, setEditTitle]               = useState('');
  const [editDescription, setEditDescription]   = useState('');

  const addOption = () =>
    setOptions(prev => [...prev, { label: '', choices: [''] }]);

  const removeOption = (i: number) =>
    setOptions(prev => prev.filter((_, idx) => idx !== i));

  const updateOptionLabel = (i: number, label: string) =>
    setOptions(prev => prev.map((o, idx) => idx === i ? { ...o, label } : o));

  const addChoice = (optIdx: number) =>
    setOptions(prev => prev.map((o, idx) =>
      idx === optIdx ? { ...o, choices: [...o.choices, ''] } : o
    ));

  const removeChoice = (optIdx: number, choiceIdx: number) =>
    setOptions(prev => prev.map((o, idx) =>
      idx === optIdx
        ? { ...o, choices: o.choices.filter((_, ci) => ci !== choiceIdx) }
        : o
    ));

  const updateChoice = (optIdx: number, choiceIdx: number, value: string) =>
    setOptions(prev => prev.map((o, idx) =>
      idx === optIdx
        ? { ...o, choices: o.choices.map((c, ci) => ci === choiceIdx ? value : c) }
        : o
    ));

  const filteredProducts = allProducts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    !selectedProducts.find(s => s.id === p.id)
  );

  const addProduct    = (p: Product) => { setSelectedProducts(prev => [...prev, p]); setSearch(''); };
  const removeProduct = (id: string) => setSelectedProducts(prev => prev.filter(p => p.id !== id));
  const suggestedCompare = selectedProducts.reduce((a, p) => a + p.price, 0);

  const resetForm = () => {
    setTitle(''); setDescription(''); setPrice(''); setComparePrice('');
    setSelectedProducts([]); setOptions([]); setSearch(''); setShowForm(false); setFormError('');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (selectedProducts.length < 2) { setFormError('Seleccioná al menos 2 productos'); return; }

    for (const opt of options) {
      if (!opt.label.trim())                { setFormError('Todas las opciones deben tener un nombre'); return; }
      if (opt.choices.some(c => !c.trim())) { setFormError(`La opción "${opt.label}" tiene opciones vacías`); return; }
      if (opt.choices.length < 2)           { setFormError(`La opción "${opt.label}" necesita al menos 2 alternativas`); return; }
    }

    startTransition(async () => {
      const r = await createPack({
        title,
        description,
        price:        parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : suggestedCompare || undefined,
        productIds:   selectedProducts.map(p => p.id),
        options,
      });

      if (!r.ok) { setFormError(r.message ?? 'Error'); return; }
      resetForm();
      window.location.reload();
    });
  };

  const handleEdit = (pack: Pack) => {
    setEditingPack(pack);
    setEditPrice(pack.price.toString());
    setEditComparePrice(pack.comparePrice?.toString() ?? '');
    setEditTitle(pack.title);
    setEditDescription(pack.description);
  };

  const handleSaveEdit = async () => {
    if (!editingPack) return;
    startTransition(async () => {
      const r = await updatePack(editingPack.id, {
        price:        parseFloat(editPrice),
        comparePrice: editComparePrice ? parseFloat(editComparePrice) : undefined,
        title:        editTitle,
        description:  editDescription,
      });
      if (r.ok) {
        setPacks(ps => ps.map(p => p.id === editingPack.id ? {
          ...p,
          price:        parseFloat(editPrice),
          comparePrice: editComparePrice ? parseFloat(editComparePrice) : null,
          title:        editTitle,
          description:  editDescription,
        } : p));
        setEditingPack(null);
      }
    });
  };

  const handleToggle = (id: string, current: boolean) => {
    setPacks(ps => ps.map(p => p.id === id ? { ...p, isActive: !current } : p));
    startTransition(async () => { await togglePack(id, !current); });
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`¿Eliminar "${title}"?`)) return;
    setPacks(ps => ps.filter(p => p.id !== id));
    startTransition(async () => { await deletePack(id); });
  };

  const totalSold = packs.reduce((a, p) => a + p.soldCount, 0);

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Packs creados',  value: packs.length,                         color: 'text-white'       },
          { label: 'Packs activos',  value: packs.filter(p => p.isActive).length, color: 'text-emerald-400' },
          { label: 'Packs vendidos', value: totalSold,                             color: 'text-pink-400'    },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 text-center">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Botón nuevo */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all active:scale-95"
        >
          <IoAddOutline size={14} /> Nuevo pack
        </button>
      </div>

      {/* Formulario de creación */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-zinc-900/60 border border-pink-500/20 rounded-3xl p-7 space-y-7 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-sm font-black text-pink-400 uppercase tracking-widest">Crear nuevo pack</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">Nombre *</label>
              <input
                value={title} onChange={e => setTitle(e.target.value)} required
                placeholder="Pack Placer Total"
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-pink-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">Descripción *</label>
              <input
                value={description} onChange={e => setDescription(e.target.value)} required
                placeholder="La combinación perfecta para..."
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-pink-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">
                Precio del pack * <span className="text-pink-500">(lo que cobra)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">$</span>
                <input
                  type="number" min={0} value={price} onChange={e => setPrice(e.target.value)} required
                  placeholder="800"
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-pink-500 rounded-xl pl-7 pr-4 py-2.5 text-white font-black text-lg outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">
                Precio tachado
                {suggestedCompare > 0 && (
                  <span className="text-zinc-600 normal-case font-normal ml-1">
                    (sugerido: ${suggestedCompare.toLocaleString('es-UY')})
                  </span>
                )}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">$</span>
                <input
                  type="number" min={0} value={comparePrice} onChange={e => setComparePrice(e.target.value)}
                  placeholder={suggestedCompare ? suggestedCompare.toString() : '0'}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-zinc-600 rounded-xl pl-7 pr-4 py-2.5 text-white outline-none transition-colors"
                />
              </div>
              <p className="text-[9px] text-zinc-600 mt-1">Vacío = suma de los productos automáticamente</p>
            </div>
          </div>

          {/* Selector de productos */}
          <div>
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-3 block">
              Productos del pack * (mínimo 2)
            </label>

            {selectedProducts.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedProducts.map(product => (
                  <div key={product.id} className="flex items-center gap-2 bg-pink-600/15 border border-pink-500/25 rounded-xl px-3 py-1.5">
                    <span className="text-xs text-pink-300 font-bold max-w-[160px] truncate">{product.title}</span>
                    <span className="text-[10px] text-pink-500 font-mono">${product.price.toLocaleString('es-UY')}</span>
                    <button type="button" onClick={() => removeProduct(product.id)} className="text-pink-500 hover:text-white transition-colors">
                      <IoCloseOutline size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <IoSearchOutline size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscá un producto para agregar..."
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-zinc-500 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none transition-colors"
              />
            </div>

            {search && (
              <div className="mt-2 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <p className="text-zinc-600 text-xs italic p-4 text-center">Sin resultados</p>
                ) : (
                  filteredProducts.slice(0, 8).map(product => (
                    <button
                      key={product.id} type="button" onClick={() => addProduct(product)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-900 transition-colors text-left"
                    >
                      <span className="text-sm text-white flex-1 truncate">{product.title}</span>
                      <span className="text-xs text-zinc-500 font-mono flex-none">${product.price.toLocaleString('es-UY')}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Editor de opciones */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">
                  Opciones a elegir por el cliente
                </label>
                <p className="text-[9px] text-zinc-600 mt-0.5">
                  Ej: "Lubricante" con opciones Fresa / Neutro / Calor
                </p>
              </div>
              <button
                type="button" onClick={addOption}
                className="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-all font-bold uppercase"
              >
                <IoAddOutline size={12} /> Agregar opción
              </button>
            </div>

            {options.length === 0 ? (
              <div className="border border-dashed border-zinc-800 rounded-xl py-5 text-center">
                <p className="text-zinc-600 text-xs italic">Sin opciones — el pack no tiene variantes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {options.map((opt, optIdx) => (
                  <div key={optIdx} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={opt.label}
                        onChange={e => updateOptionLabel(optIdx, e.target.value)}
                        placeholder="Nombre de la opción (ej: Lubricante)"
                        className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-pink-500 rounded-xl px-4 py-2 text-white text-sm font-bold outline-none transition-colors"
                      />
                      <button
                        type="button" onClick={() => removeOption(optIdx)}
                        className="text-zinc-700 hover:text-red-400 transition-colors p-1 flex-none"
                      >
                        <IoTrashOutline size={16} />
                      </button>
                    </div>

                    <div className="space-y-2 pl-3 border-l-2 border-zinc-800">
                      {opt.choices.map((choice, choiceIdx) => (
                        <div key={choiceIdx} className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-[8px] text-pink-400 font-black flex-none">
                            {choiceIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={choice}
                            onChange={e => updateChoice(optIdx, choiceIdx, e.target.value)}
                            placeholder={`Alternativa ${choiceIdx + 1} (ej: Fresa)`}
                            className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-1.5 text-white text-sm outline-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => removeChoice(optIdx, choiceIdx)}
                            disabled={opt.choices.length <= 1}
                            className="text-zinc-700 hover:text-red-400 disabled:opacity-20 transition-colors p-0.5 flex-none"
                          >
                            <IoCloseOutline size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addChoice(optIdx)}
                        className="flex items-center gap-1.5 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors mt-1"
                      >
                        <IoAddOutline size={11} /> Agregar alternativa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview del ahorro */}
          {selectedProducts.length >= 2 && price && (
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4">
              {(() => {
                const compare = comparePrice ? parseFloat(comparePrice) : suggestedCompare;
                const saving  = compare - parseFloat(price);
                const pct     = compare > 0 ? Math.round(saving / compare * 100) : 0;
                return (
                  <p className="text-xs text-emerald-400 font-bold">
                    💰 El cliente ahorra{' '}
                    <span className="text-lg font-black">${saving.toLocaleString('es-UY')}</span>
                    {' '}comprando el pack ({pct}% de descuento)
                  </p>
                );
              })()}
            </div>
          )}

          {formError && <p className="text-red-400 text-xs font-bold animate-in fade-in">⚠ {formError}</p>}

          <div className="flex gap-3">
            <button
              type="submit" disabled={isPending}
              className="flex-1 bg-pink-600 hover:bg-pink-500 disabled:bg-zinc-800 text-white font-black py-3 rounded-xl text-sm uppercase tracking-widest transition-all"
            >
              {isPending ? 'Creando...' : 'Crear pack'}
            </button>
            <button
              type="button" onClick={resetForm}
              className="px-5 text-zinc-500 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de packs */}
      {packs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
          <p className="text-4xl mb-3">🎁</p>
          <p className="text-zinc-500 text-sm">No hay packs creados aún</p>
        </div>
      ) : (
        <div className="space-y-3">
          {packs.map(pack => {
            const opts   = (pack.options as PackOption[]) ?? [];
            const saving = (pack.comparePrice ?? 0) - pack.price;
            const pct    = pack.comparePrice ? Math.round(saving / pack.comparePrice * 100) : 0;
            return (
              <div
                key={pack.id}
                className={clsx(
                  'flex items-center gap-5 p-5 rounded-3xl border transition-all',
                  pack.isActive ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-900/10 border-zinc-800/30 opacity-60'
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-white text-sm">{pack.title}</p>
                    {pct > 0 && (
                      <span className="text-[9px] bg-pink-600/20 text-pink-400 border border-pink-500/25 px-2 py-0.5 rounded-full font-black">
                        -{pct}% OFF
                      </span>
                    )}
                    {opts.length > 0 && (
                      <span className="text-[9px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-bold">
                        {opts.length} opción{opts.length > 1 ? 'es' : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-500 text-[11px] mt-0.5 truncate">{pack.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="text-pink-400 font-black text-sm">${pack.price.toLocaleString('es-UY')}</span>
                    {pack.comparePrice && (
                      <span className="text-zinc-600 text-xs line-through">${pack.comparePrice.toLocaleString('es-UY')}</span>
                    )}
                    <span className="text-[10px] text-zinc-600">·</span>
                    <span className="text-[10px] text-zinc-500">{pack.products.length} productos</span>
                    <span className="text-[10px] text-zinc-600">·</span>
                    <span className="text-[10px] text-zinc-500">{pack.soldCount} vendidos</span>
                    {opts.length > 0 && (
                      <>
                        <span className="text-[10px] text-zinc-600">·</span>
                        <span className="text-[10px] text-zinc-500 italic">
                          {opts.map(o => `${o.label}: ${o.choices.join(', ')}`).join(' / ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-none">
                  {/* Botón editar */}
                  <button
                    onClick={() => handleEdit(pack)}
                    className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-all text-base"
                    title="Editar pack"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleToggle(pack.id, pack.isActive)}
                    disabled={isPending}
                    className={clsx(
                      'flex items-center gap-1.5 text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg transition-all border',
                      pack.isActive
                        ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800/40'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    )}
                  >
                    {pack.isActive ? <><IoCheckmarkCircle size={12} /> Activo</> : <><IoCloseCircle size={12} /> Inactivo</>}
                  </button>

                  <button
                    onClick={() => handleDelete(pack.id, pack.title)}
                    disabled={isPending}
                    className="p-2 text-zinc-700 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <IoTrashOutline size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal de edición ── */}
      {editingPack && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-7 w-full max-w-md space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-pink-400 uppercase tracking-widest">Editar Pack</p>
              <button onClick={() => setEditingPack(null)} className="text-zinc-500 hover:text-white transition-colors">
                <IoCloseOutline size={20} />
              </button>
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">Nombre</label>
              <input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-pink-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">Descripción</label>
              <input
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-pink-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">
                  Precio <span className="text-pink-500">(cobra)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">$</span>
                  <input
                    type="number" min={0}
                    value={editPrice}
                    onChange={e => setEditPrice(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-pink-500 rounded-xl pl-7 pr-4 py-2.5 text-white font-black text-lg outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">Precio tachado</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">$</span>
                  <input
                    type="number" min={0}
                    value={editComparePrice}
                    onChange={e => setEditComparePrice(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-zinc-600 rounded-xl pl-7 pr-4 py-2.5 text-white outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {editPrice && editComparePrice && parseFloat(editComparePrice) > parseFloat(editPrice) && (
              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3">
                {(() => {
                  const saving = parseFloat(editComparePrice) - parseFloat(editPrice);
                  const pct    = Math.round(saving / parseFloat(editComparePrice) * 100);
                  return (
                    <p className="text-xs text-emerald-400 font-bold">
                      💰 El cliente ahorra <span className="text-lg font-black">${saving.toLocaleString('es-UY')}</span> ({pct}% OFF)
                    </p>
                  );
                })()}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSaveEdit}
                disabled={isPending || !editPrice}
                className="flex-1 bg-pink-600 hover:bg-pink-500 disabled:bg-zinc-800 text-white font-black py-3 rounded-xl text-sm uppercase tracking-widest transition-all"
              >
                {isPending ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button
                onClick={() => setEditingPack(null)}
                className="px-5 text-zinc-500 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
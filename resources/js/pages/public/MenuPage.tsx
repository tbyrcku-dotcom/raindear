import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import { useDocumentTitle } from '@/lib/seo';
import { cn, formatIDR } from '@/lib/utils';
import type { ApiCollection, MenuCategory, MenuItem } from '@/types';

export default function MenuPage() {
    useDocumentTitle('Menu — Raindear Coffee & Kitchen');
    const [activeCat, setActiveCat] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<MenuItem | null>(null);

    const categoriesQ = useQuery({
        queryKey: qk.menuCategories,
        queryFn: async () => (await api.get<ApiCollection<MenuCategory>>('/menu-categories')).data.data,
    });
    const itemsQ = useQuery({
        queryKey: qk.menuItems({}),
        queryFn: async () => (await api.get<ApiCollection<MenuItem>>('/menu-items')).data.data,
    });

    const filtered = useMemo(() => {
        const items = itemsQ.data ?? [];
        return items.filter((it) => {
            if (activeCat && it.category?.slug !== activeCat) return false;
            if (search) {
                const q = search.toLowerCase();
                if (!it.name.toLowerCase().includes(q) && !(it.description ?? '').toLowerCase().includes(q)) return false;
            }
            return true;
        });
    }, [itemsQ.data, activeCat, search]);

    const groupedByCategory = useMemo(() => {
        const map = new Map<string, MenuItem[]>();
        filtered.forEach((it) => {
            const key = it.category?.name ?? 'Other';
            map.set(key, [...(map.get(key) ?? []), it]);
        });
        return Array.from(map.entries());
    }, [filtered]);

    return (
        <div className="relative">
            <header className="container-editorial pt-20 pb-10 md:pt-32">
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">The list</div>
                <h1 className="mt-4 max-w-3xl font-display text-6xl leading-[0.92] text-cream md:text-8xl">
                    Menu, <em className="italic text-gold">considered.</em>
                </h1>
                <p className="mt-6 max-w-md text-cream-dim">
                    Coffee, kitchen, and the small obsessions in between.
                </p>
            </header>

            {/* Sticky filter bar */}
            <div className="sticky top-16 z-30 border-y border-line/60 bg-ink/85 backdrop-blur md:top-20">
                <div className="container-editorial flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
                    <button
                        onClick={() => setActiveCat(null)}
                        className={cn(
                            'font-mono text-[11px] uppercase tracking-[0.32em] transition-colors',
                            activeCat === null ? 'text-cream' : 'text-cream-dim hover:text-cream',
                        )}
                    >
                        All
                    </button>
                    {(categoriesQ.data ?? []).map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setActiveCat(c.slug)}
                            className={cn(
                                'font-mono text-[11px] uppercase tracking-[0.32em] transition-colors',
                                activeCat === c.slug ? 'text-cream' : 'text-cream-dim hover:text-cream',
                            )}
                        >
                            {c.name}
                        </button>
                    ))}
                    <div className="ml-auto flex items-center gap-2 border-b border-line/60 px-1 py-1 focus-within:border-cream/40">
                        <Search size={14} className="text-cream-dim" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search menu"
                            className="w-40 bg-transparent font-mono text-xs text-cream placeholder:text-cream-dim focus:outline-none md:w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="container-editorial py-16">
                {itemsQ.isLoading ? (
                    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="space-y-3">
                                <div className="aspect-[4/3] skeleton" />
                                <div className="h-4 w-2/3 skeleton" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-32 text-center">
                        <div className="font-display text-3xl text-cream">Nothing matched.</div>
                        <p className="mt-2 text-cream-dim">Try a different category, or clear the search.</p>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {groupedByCategory.map(([cat, items]) => (
                            <section key={cat}>
                                <div className="mb-8 flex items-baseline gap-4">
                                    <h2 className="font-display text-3xl text-cream md:text-4xl">{cat}</h2>
                                    <div className="hairline flex-1" />
                                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">
                                        {items.length} items
                                    </span>
                                </div>
                                <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                                    {items.map((it) => (
                                        <button
                                            key={it.id}
                                            onClick={() => setSelected(it)}
                                            className="group text-left"
                                        >
                                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                                    className="absolute inset-0"
                                                >
                                                    <ImageWithFallback
                                                        src={it.image_url ?? undefined}
                                                        alt={it.name}
                                                        className="h-full w-full"
                                                    />
                                                </motion.div>
                                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 to-transparent" />
                                                <div className="absolute left-3 top-3 flex gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-cream">
                                                    {it.is_signature && <span className="border border-gold/70 bg-ink/40 px-2 py-1">Signature</span>}
                                                    {it.is_popular && <span className="border border-cream/40 bg-ink/40 px-2 py-1">Popular</span>}
                                                    {it.is_new && <span className="border border-copper/60 bg-ink/40 px-2 py-1 text-copper">New</span>}
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-baseline justify-between gap-3">
                                                <h3 className="font-display text-xl leading-tight text-cream group-hover:text-gold-soft">
                                                    {it.name}
                                                </h3>
                                                <span className="font-mono text-xs text-gold whitespace-nowrap">
                                                    {formatIDR(it.price)}
                                                </span>
                                            </div>
                                            {it.description && (
                                                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-cream-dim">
                                                    {it.description}
                                                </p>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/85 p-4 backdrop-blur"
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 16, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden border border-line/70 bg-ink-2 md:grid-cols-2"
                        >
                            <button
                                onClick={() => setSelected(null)}
                                className="absolute right-3 top-3 z-10 rounded-full bg-ink/60 p-2 text-cream hover:bg-ink/90"
                                aria-label="Close"
                            >
                                <X size={16} />
                            </button>
                            <div className="aspect-square md:aspect-auto md:h-full">
                                <ImageWithFallback
                                    src={selected.image_url ?? undefined}
                                    alt={selected.name}
                                    className="h-full w-full"
                                />
                            </div>
                            <div className="flex flex-col gap-6 p-8 md:p-10">
                                <div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-cream">
                                    {selected.is_signature && <span className="border border-gold/70 px-2 py-1 text-gold">Signature</span>}
                                    {selected.is_popular && <span className="border border-cream/40 px-2 py-1">Popular</span>}
                                    {selected.is_new && <span className="border border-copper/60 px-2 py-1 text-copper">New</span>}
                                    {selected.category && <span className="text-cream-dim">{selected.category.name}</span>}
                                </div>
                                <h3 className="font-display text-4xl leading-tight text-cream">{selected.name}</h3>
                                {selected.description && (
                                    <p className="text-cream-dim">{selected.description}</p>
                                )}
                                <div className="font-mono text-sm text-gold">{formatIDR(selected.price)}</div>
                                <a
                                    href="/reservation"
                                    className="inline-flex h-12 items-center justify-center border border-gold/70 bg-gold/10 px-6 font-mono text-[11px] uppercase tracking-[0.32em] text-cream hover:bg-gold/20"
                                >
                                    Reserve a table
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

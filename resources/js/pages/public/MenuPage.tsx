import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import { useDocumentTitle } from '@/lib/seo';
import { cn, formatIDR } from '@/lib/utils';
import type { ApiCollection, MenuCategory, MenuItem } from '@/types';

const HERO_MONTAGE = [
    '/images/menu/wagyu-steak.jpg',
    '/images/menu/es-kopi-bogor.jpg',
    '/images/menu/lazy-bear-mousse.jpg',
    '/images/menu/pizza-margherita.jpg',
];

export default function MenuPage() {
    useDocumentTitle('Menu — Raindear Coffee & Kitchen');
    const reduce = useReducedMotion();
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

    const items = useMemo(() => itemsQ.data ?? [], [itemsQ.data]);
    const categories = useMemo(() => categoriesQ.data ?? [], [categoriesQ.data]);

    const counts = useMemo(() => {
        const map: Record<string, number> = { all: items.length };
        for (const it of items) {
            const slug = it.category?.slug ?? 'other';
            map[slug] = (map[slug] ?? 0) + 1;
        }
        return map;
    }, [items]);

    const filtered = useMemo(() => {
        return items.filter((it) => {
            if (activeCat && it.category?.slug !== activeCat) return false;
            if (search) {
                const q = search.toLowerCase();
                if (!it.name.toLowerCase().includes(q) && !(it.description ?? '').toLowerCase().includes(q)) return false;
            }
            return true;
        });
    }, [items, activeCat, search]);

    const groupedByCategory = useMemo(() => {
        const map = new Map<string, MenuItem[]>();
        filtered.forEach((it) => {
            const key = it.category?.name ?? 'Other';
            map.set(key, [...(map.get(key) ?? []), it]);
        });
        return Array.from(map.entries());
    }, [filtered]);

    // Lock body scroll when drawer open
    useEffect(() => {
        if (selected) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [selected]);

    return (
        <div className="relative">
            {/* Hero */}
            <header className="relative overflow-hidden border-b border-line/60">
                <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 grid grid-cols-2 gap-1 opacity-[0.22] md:grid-cols-4">
                        {HERO_MONTAGE.map((src, i) => (
                            <motion.div
                                key={src}
                                className="relative h-full w-full overflow-hidden"
                                initial={reduce ? false : { opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.05 * i }}
                            >
                                <ImageWithFallback src={src} alt="" className="h-full w-full" />
                            </motion.div>
                        ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/70 to-ink" />
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                'radial-gradient(900px 480px at 50% 20%, rgba(201,162,91,0.16), transparent 70%)',
                        }}
                    />
                </div>

                <div className="container-editorial relative pt-24 pb-16 md:pt-36 md:pb-24">
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold"
                    >
                        The list · {items.length} dishes · {categories.length} categories
                    </motion.div>

                    <h1 className="mt-5 max-w-4xl font-display text-6xl leading-[0.92] text-cream md:text-8xl">
                        {['Menu,', 'considered.'].map((word, i) => (
                            <span key={word} className="block overflow-hidden">
                                <motion.span
                                    initial={reduce ? false : { y: '110%', opacity: 0, rotateX: -25 }}
                                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                    transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.08 }}
                                    style={{ transformOrigin: 'bottom' }}
                                    className="inline-block"
                                >
                                    {i === 1 ? <em className="font-display italic text-gold">{word}</em> : word}
                                </motion.span>
                            </span>
                        ))}
                    </h1>

                    <motion.p
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                        className="mt-6 max-w-md text-cream-dim"
                    >
                        Coffee, kitchen, and the small obsessions in between — from squid-ink fried rice to truffle ravioli. Slow craft, warm light.
                    </motion.p>

                    <motion.div
                        initial={reduce ? false : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-10 h-px w-32 origin-left bg-gold/60"
                    />
                </div>
            </header>

            {/* Sticky filter bar */}
            <div className="sticky top-16 z-30 border-b border-line/60 bg-ink/80 backdrop-blur-md md:top-20">
                <div className="container-editorial flex flex-wrap items-center gap-x-1 gap-y-3 py-4">
                    <CategoryPill
                        label="All"
                        count={counts.all ?? 0}
                        active={activeCat === null}
                        onClick={() => setActiveCat(null)}
                    />
                    {categories.map((c) => (
                        <CategoryPill
                            key={c.id}
                            label={c.name}
                            count={counts[c.slug] ?? 0}
                            active={activeCat === c.slug}
                            onClick={() => setActiveCat(c.slug)}
                        />
                    ))}

                    <div className="ml-auto flex w-full items-center gap-2 border border-line/60 bg-ink-2/60 px-3 py-2 backdrop-blur transition-colors focus-within:border-gold/60 sm:w-auto">
                        <Search size={14} className="text-cream-dim" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search menu"
                            className="w-full bg-transparent font-mono text-xs text-cream placeholder:text-cream-dim/60 focus:outline-none sm:w-56"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                aria-label="Clear search"
                                className="text-cream-dim hover:text-cream"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container-editorial py-16 md:py-20">
                {itemsQ.isLoading ? (
                    <SkeletonGrid />
                ) : filtered.length === 0 ? (
                    <EmptyState onClear={() => { setActiveCat(null); setSearch(''); }} />
                ) : (
                    <div className="space-y-24">
                        {groupedByCategory.map(([cat, list], catIdx) => (
                            <section key={cat}>
                                <div className="mb-10 flex items-baseline gap-4">
                                    <motion.h2
                                        initial={reduce ? false : { opacity: 0, y: 8 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-80px' }}
                                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                        className="font-display text-3xl text-cream md:text-5xl"
                                    >
                                        {cat}
                                    </motion.h2>
                                    <motion.div
                                        initial={reduce ? false : { scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        viewport={{ once: true, margin: '-80px' }}
                                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                                        className="hairline flex-1 origin-left"
                                    />
                                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">
                                        {list.length} {list.length === 1 ? 'dish' : 'dishes'}
                                    </span>
                                </div>
                                <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                                    {list.map((it, i) => (
                                        <MenuCard
                                            key={it.id}
                                            item={it}
                                            index={i}
                                            sectionIndex={catIdx}
                                            onClick={() => setSelected(it)}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>

            <DetailDrawer item={selected} onClose={() => setSelected(null)} />
        </div>
    );
}

function CategoryPill({
    label,
    count,
    active,
    onClick,
}: {
    label: string;
    count: number;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="group relative px-3 py-2 font-mono text-[11px] uppercase tracking-[0.32em]"
            aria-pressed={active}
        >
            <span className={cn('transition-colors', active ? 'text-cream' : 'text-cream-dim group-hover:text-cream')}>
                {label}
            </span>
            <span
                className={cn(
                    'ml-2 align-middle text-[9px] tracking-[0.2em] transition-colors',
                    active ? 'text-gold' : 'text-cream-dim/60 group-hover:text-cream-dim',
                )}
            >
                {count}
            </span>
            {active && (
                <motion.span
                    layoutId="cat-underline"
                    className="absolute inset-x-2 -bottom-0.5 h-px bg-gold"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
            )}
        </button>
    );
}

function MenuCard({
    item,
    index,
    sectionIndex,
    onClick,
}: {
    item: MenuItem;
    index: number;
    sectionIndex: number;
    onClick: () => void;
}) {
    const reduce = useReducedMotion();

    return (
        <motion.button
            type="button"
            onClick={onClick}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.04 * index + 0.04 * sectionIndex,
            }}
            className="group relative text-left"
            aria-label={`View ${item.name}`}
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-transparent bg-ink-2 transition-colors duration-500 group-hover:border-gold/60">
                <motion.div
                    whileHover={reduce ? undefined : { scale: 1.07 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                >
                    <ImageWithFallback
                        src={item.image_url ?? undefined}
                        alt={item.name}
                        className="h-full w-full"
                    />
                </motion.div>

                {/* gradient base */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 to-transparent" />

                {/* corner ticks */}
                <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-gold/0 transition-all duration-500 group-hover:h-5 group-hover:w-5 group-hover:border-gold" />
                <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-gold/0 transition-all duration-500 group-hover:h-5 group-hover:w-5 group-hover:border-gold" />
                <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-gold/0 transition-all duration-500 group-hover:h-5 group-hover:w-5 group-hover:border-gold" />
                <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-gold/0 transition-all duration-500 group-hover:h-5 group-hover:w-5 group-hover:border-gold" />

                {/* hover view-arrow */}
                <span aria-hidden className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 -translate-y-2 items-center justify-center rounded-full border border-gold/40 bg-ink/50 text-gold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight size={14} />
                </span>

                {/* tags */}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-cream">
                    {item.is_signature && (
                        <span className="border border-gold/70 bg-ink/50 px-2 py-1 text-gold backdrop-blur-sm">Signature</span>
                    )}
                    {item.is_popular && (
                        <span className="border border-cream/40 bg-ink/50 px-2 py-1 backdrop-blur-sm">Popular</span>
                    )}
                    {item.is_new && (
                        <span className="border border-copper/60 bg-ink/50 px-2 py-1 text-copper backdrop-blur-sm">New</span>
                    )}
                </div>
            </div>

            <div className="mt-5 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl leading-tight text-cream transition-colors duration-300 group-hover:text-gold-soft">
                    {item.name}
                </h3>
                <span className="whitespace-nowrap font-mono text-xs text-gold">{formatIDR(item.price)}</span>
            </div>

            {/* growing underline */}
            <span aria-hidden className="mt-2 block h-px w-6 bg-gold/40 transition-all duration-500 group-hover:w-full group-hover:bg-gold/70" />

            {item.description && (
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-cream-dim">{item.description}</p>
            )}
        </motion.button>
    );
}

function SkeletonGrid() {
    return (
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="space-y-4">
                    <div className="aspect-[4/3] skeleton" />
                    <div className="h-4 w-2/3 skeleton" />
                    <div className="h-3 w-full skeleton" />
                    <div className="h-3 w-1/2 skeleton" />
                </div>
            ))}
        </div>
    );
}

function EmptyState({ onClear }: { onClear: () => void }) {
    return (
        <div className="py-32 text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">404 / no match</div>
            <div className="mt-4 font-display text-4xl text-cream md:text-6xl">Nothing matched.</div>
            <p className="mt-3 text-cream-dim">Try a different category, or clear the search.</p>
            <button
                onClick={onClear}
                className="mt-8 inline-flex h-12 items-center justify-center border border-gold/60 bg-gold/10 px-8 font-mono text-[11px] uppercase tracking-[0.32em] text-cream transition-colors hover:bg-gold/20"
            >
                Reset filters
            </button>
        </div>
    );
}

function DetailDrawer({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
    const reduce = useReducedMotion();
    return (
        <AnimatePresence>
            {item && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[80] flex justify-end bg-ink/70 backdrop-blur"
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                    aria-label={item.name}
                >
                    <motion.aside
                        initial={reduce ? { opacity: 0 } : { x: '100%' }}
                        animate={reduce ? { opacity: 1 } : { x: 0 }}
                        exit={reduce ? { opacity: 0 } : { x: '100%' }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-line/70 bg-ink-2"
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line/70 bg-ink/60 text-cream backdrop-blur transition-colors hover:border-gold/70 hover:text-gold"
                            aria-label="Close"
                        >
                            <X size={16} />
                        </button>

                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <motion.div
                                initial={reduce ? false : { scale: 1.08 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute inset-0"
                            >
                                <ImageWithFallback
                                    src={item.image_url ?? undefined}
                                    alt={item.name}
                                    className="h-full w-full"
                                />
                            </motion.div>
                            <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/40 to-transparent" />
                            <div className="absolute bottom-5 left-6 right-6 flex flex-wrap gap-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-cream">
                                {item.is_signature && (
                                    <span className="border border-gold/70 bg-ink/60 px-2 py-1 text-gold backdrop-blur-sm">Signature</span>
                                )}
                                {item.is_popular && (
                                    <span className="border border-cream/40 bg-ink/60 px-2 py-1 backdrop-blur-sm">Popular</span>
                                )}
                                {item.is_new && (
                                    <span className="border border-copper/60 bg-ink/60 px-2 py-1 text-copper backdrop-blur-sm">New</span>
                                )}
                                {item.category && (
                                    <span className="bg-ink/40 px-2 py-1 text-cream-dim backdrop-blur-sm">
                                        {item.category.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-7 p-8 md:p-12">
                            <div>
                                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                                    {item.category?.name ?? 'From the kitchen'}
                                </div>
                                <h3 className="mt-3 font-display text-4xl leading-[1.05] text-cream md:text-5xl">
                                    {item.name}
                                </h3>
                            </div>

                            {item.description && (
                                <p className="text-base leading-relaxed text-cream/85">{item.description}</p>
                            )}

                            <div className="grid grid-cols-2 gap-4 border-y border-line/60 py-5 font-mono text-[10px] uppercase tracking-[0.3em] text-cream-dim">
                                <Stat label="Price" value={formatIDR(item.price)} />
                                <Stat label="Category" value={item.category?.name ?? '—'} />
                                <Stat label="Available" value={item.is_available ? 'Yes' : 'Limited'} />
                                <Stat
                                    label="Tags"
                                    value={
                                        [
                                            item.is_signature && 'Signature',
                                            item.is_popular && 'Popular',
                                            item.is_new && 'New',
                                        ]
                                            .filter(Boolean)
                                            .join(' · ') || '—'
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <a
                                    href="/reservation"
                                    className="group inline-flex h-12 flex-1 items-center justify-center gap-2 border border-gold/70 bg-gold/10 px-6 font-mono text-[11px] uppercase tracking-[0.32em] text-cream transition-colors hover:bg-gold/20"
                                >
                                    Reserve a table
                                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </a>
                                <button
                                    onClick={onClose}
                                    className="inline-flex h-12 items-center justify-center border border-line/70 px-6 font-mono text-[11px] uppercase tracking-[0.32em] text-cream-dim transition-colors hover:border-cream/40 hover:text-cream"
                                >
                                    Back to menu
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="text-[9px] tracking-[0.4em] text-cream-dim/70">{label}</div>
            <div className="mt-1.5 font-mono text-[11px] tracking-[0.2em] text-cream">{value}</div>
        </div>
    );
}

import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
    AlertTriangle,
    ArrowUpRight,
    ChefHat,
    Flame,
    Leaf,
    MapPin,
    Quote,
    Search,
    Sparkles,
    Timer,
    Utensils,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

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

            <DetailDrawer
                item={selected}
                onClose={() => setSelected(null)}
                allItems={items}
                onSelect={(it) => setSelected(it)}
            />
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

type DrawerTab = 'overview' | 'ingredients' | 'pairings' | 'notes';

function DetailDrawer({
    item,
    onClose,
    allItems,
    onSelect,
}: {
    item: MenuItem | null;
    onClose: () => void;
    allItems: MenuItem[];
    onSelect: (it: MenuItem) => void;
}) {
    const reduce = useReducedMotion();
    const [tab, setTab] = useState<DrawerTab>('overview');
    const scrollRef = useRef<HTMLElement | null>(null);
    const { scrollY } = useScroll({ container: scrollRef as unknown as React.RefObject<HTMLElement> });
    const heroY = useTransform(scrollY, [0, 300], [0, 60]);
    const heroScale = useTransform(scrollY, [0, 300], [1, 1.08]);

    // Reset tab + scroll on item change
    useEffect(() => {
        setTab('overview');
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }, [item?.id]);

    // ESC to close
    useEffect(() => {
        if (!item) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [item, onClose]);

    const details = item?.details ?? null;
    const pairingItems = useMemo(() => {
        if (!details?.pairings || !item) return [];
        return details.pairings
            .map((name) => allItems.find((x) => x.name === name))
            .filter((x): x is MenuItem => Boolean(x) && x!.id !== item.id);
    }, [details, item, allItems]);

    const tabs: { key: DrawerTab; label: string; available: boolean }[] = [
        { key: 'overview', label: 'Overview', available: true },
        {
            key: 'ingredients',
            label: 'Ingredients',
            available: !!(details?.ingredients?.length || details?.allergens?.length || details?.diet?.length),
        },
        { key: 'pairings', label: 'Pairs with', available: pairingItems.length > 0 },
        { key: 'notes', label: 'Chef notes', available: !!details?.chef_note },
    ];

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
                        ref={scrollRef as unknown as React.Ref<HTMLElement>}
                        initial={reduce ? { opacity: 0 } : { x: '100%' }}
                        animate={reduce ? { opacity: 1 } : { x: 0 }}
                        exit={reduce ? { opacity: 0 } : { x: '100%' }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative flex h-full w-full max-w-2xl flex-col overflow-y-auto border-l border-line/70 bg-ink-2"
                    >
                        {/* Sticky close + breadcrumb */}
                        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-line/40 bg-ink-2/85 px-6 py-3 backdrop-blur-md md:px-8">
                            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">
                                Menu · <span className="text-gold">{item.category?.name ?? 'Detail'}</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-line/70 bg-ink/60 text-cream transition-colors hover:border-gold/70 hover:text-gold"
                                aria-label="Close"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Hero image with parallax + ken-burns */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                            <motion.div
                                style={reduce ? undefined : { y: heroY, scale: heroScale }}
                                className="absolute inset-0"
                            >
                                <ImageWithFallback
                                    src={item.image_url ?? undefined}
                                    alt={item.name}
                                    className="h-full w-full"
                                />
                            </motion.div>
                            <motion.div
                                initial={reduce ? false : { scale: 1.12 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
                                className="pointer-events-none absolute inset-0"
                                aria-hidden
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/30 to-transparent" />
                            <div
                                aria-hidden
                                className="absolute inset-0"
                                style={{
                                    background:
                                        'radial-gradient(560px 320px at 30% 80%, rgba(201,162,91,0.22), transparent 75%)',
                                }}
                            />

                            {/* corner ticks */}
                            <span aria-hidden className="absolute left-4 top-4 h-4 w-4 border-l border-t border-gold/70" />
                            <span aria-hidden className="absolute right-4 top-4 h-4 w-4 border-r border-t border-gold/70" />
                            <span aria-hidden className="absolute bottom-4 left-4 h-4 w-4 border-b border-l border-gold/70" />
                            <span aria-hidden className="absolute bottom-4 right-4 h-4 w-4 border-b border-r border-gold/70" />

                            {/* tag chips */}
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
                                {details?.origin && (
                                    <span className="inline-flex items-center gap-1 bg-ink/50 px-2 py-1 text-cream-dim backdrop-blur-sm">
                                        <MapPin size={10} className="text-gold" />
                                        {details.origin}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Title block */}
                        <div className="px-8 pt-9 md:px-12">
                            <motion.div
                                initial={reduce ? false : { opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold"
                            >
                                {item.category?.name ?? 'From the kitchen'}
                            </motion.div>

                            <h3 className="mt-3 font-display text-4xl leading-[1.05] text-cream md:text-[2.75rem]">
                                {item.name.split(' ').map((w, i) => (
                                    <span key={`${w}-${i}`} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
                                        <motion.span
                                            initial={reduce ? false : { y: '110%', opacity: 0, rotateX: -22 }}
                                            animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                            transition={{
                                                duration: 0.7,
                                                ease: [0.22, 1, 0.36, 1],
                                                delay: 0.15 + i * 0.06,
                                            }}
                                            style={{ transformOrigin: 'bottom' }}
                                            className="inline-block"
                                        >
                                            {w}
                                        </motion.span>
                                    </span>
                                ))}
                            </h3>

                            {/* Animated price */}
                            <motion.div
                                initial={reduce ? false : { opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mt-5 flex items-baseline gap-3"
                            >
                                <span className="font-display text-3xl text-gold">
                                    <CountUp value={item.price} />
                                </span>
                                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-cream-dim">
                                    {item.is_available ? 'Available now' : 'Limited'}
                                </span>
                            </motion.div>

                            {/* Stat chips row */}
                            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {details?.prep_time_min != null && (
                                    <StatChip
                                        icon={<Timer size={14} />}
                                        label="Prep"
                                        value={`${details.prep_time_min} min`}
                                        delay={0.45}
                                    />
                                )}
                                {details?.calories != null && (
                                    <StatChip
                                        icon={<Sparkles size={14} />}
                                        label="Energy"
                                        value={`${details.calories} kcal`}
                                        delay={0.5}
                                    />
                                )}
                                {details?.portion && (
                                    <StatChip
                                        icon={<Utensils size={14} />}
                                        label="Portion"
                                        value={details.portion}
                                        delay={0.55}
                                    />
                                )}
                                {details?.spice_level != null && (
                                    <StatChip
                                        icon={<Flame size={14} />}
                                        label="Spice"
                                        value={spiceLabel(details.spice_level)}
                                        delay={0.6}
                                        accent={details.spice_level >= 2}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mt-9 border-y border-line/60 bg-ink/40">
                            <div className="container-px-0 flex items-center gap-1 px-8 md:px-12">
                                {tabs
                                    .filter((t) => t.available)
                                    .map((t) => (
                                        <button
                                            key={t.key}
                                            onClick={() => setTab(t.key)}
                                            className={cn(
                                                'group relative px-4 py-3 font-mono text-[10px] uppercase tracking-[0.32em] transition-colors',
                                                tab === t.key ? 'text-cream' : 'text-cream-dim hover:text-cream',
                                            )}
                                        >
                                            {t.label}
                                            {tab === t.key && (
                                                <motion.span
                                                    layoutId={`drawer-tab-${item.id}`}
                                                    className="absolute inset-x-2 -bottom-px h-px bg-gold"
                                                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                                />
                                            )}
                                        </button>
                                    ))}
                            </div>
                        </div>

                        {/* Tab content */}
                        <div className="flex-1 px-8 py-10 md:px-12">
                            <AnimatePresence mode="wait">
                                {tab === 'overview' && (
                                    <motion.div
                                        key="overview"
                                        initial={reduce ? false : { opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        className="space-y-6"
                                    >
                                        {details?.long_description ? (
                                            <p className="text-base leading-[1.85] text-cream/90">
                                                {details.long_description}
                                            </p>
                                        ) : (
                                            item.description && (
                                                <p className="text-base leading-[1.85] text-cream/90">
                                                    {item.description}
                                                </p>
                                            )
                                        )}
                                        {details?.diet && details.diet.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {details.diet.map((d) => (
                                                    <span
                                                        key={d}
                                                        className="inline-flex items-center gap-1 border border-line/60 bg-ink/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.32em] text-cream-dim"
                                                    >
                                                        <Leaf size={10} className="text-gold" />
                                                        {d}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {tab === 'ingredients' && (
                                    <motion.div
                                        key="ingredients"
                                        initial={reduce ? false : { opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        className="space-y-8"
                                    >
                                        {details?.ingredients && details.ingredients.length > 0 && (
                                            <div>
                                                <SectionLabel>What's inside</SectionLabel>
                                                <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                                                    {details.ingredients.map((ing, i) => (
                                                        <motion.li
                                                            key={ing}
                                                            initial={reduce ? false : { opacity: 0, x: -8 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{
                                                                duration: 0.45,
                                                                ease: [0.22, 1, 0.36, 1],
                                                                delay: 0.04 * i,
                                                            }}
                                                            className="group flex items-baseline gap-3 border-b border-line/30 py-2 text-sm text-cream/90"
                                                        >
                                                            <span className="block h-1 w-1 translate-y-[-3px] bg-gold transition-all duration-500 group-hover:w-3" />
                                                            <span>{ing}</span>
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {details?.allergens && details.allergens.length > 0 && (
                                            <div>
                                                <SectionLabel>Allergens</SectionLabel>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {details.allergens.map((a) => (
                                                        <span
                                                            key={a}
                                                            className="inline-flex items-center gap-1 border border-copper/40 bg-copper/5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.32em] text-copper"
                                                        >
                                                            <AlertTriangle size={10} />
                                                            {a}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {details?.diet && details.diet.length > 0 && (
                                            <div>
                                                <SectionLabel>Diet</SectionLabel>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {details.diet.map((d) => (
                                                        <span
                                                            key={d}
                                                            className="inline-flex items-center gap-1 border border-gold/40 bg-gold/5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.32em] text-gold"
                                                        >
                                                            <Leaf size={10} />
                                                            {d}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {tab === 'pairings' && pairingItems.length > 0 && (
                                    <motion.div
                                        key="pairings"
                                        initial={reduce ? false : { opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <SectionLabel>Pairs well with</SectionLabel>
                                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {pairingItems.map((p, i) => (
                                                <motion.button
                                                    key={p.id}
                                                    onClick={() => onSelect(p)}
                                                    initial={reduce ? false : { opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.05 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                                    className="group flex items-center gap-4 border border-line/60 bg-ink/40 p-3 text-left transition-colors hover:border-gold/60"
                                                >
                                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-ink-2">
                                                        <ImageWithFallback
                                                            src={p.image_url ?? undefined}
                                                            alt={p.name}
                                                            className="h-full w-full transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="truncate font-display text-base text-cream group-hover:text-gold-soft">
                                                            {p.name}
                                                        </div>
                                                        <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.28em] text-cream-dim">
                                                            {formatIDR(p.price)}
                                                        </div>
                                                    </div>
                                                    <ArrowUpRight
                                                        size={14}
                                                        className="text-cream-dim transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                                                    />
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {tab === 'notes' && details?.chef_note && (
                                    <motion.div
                                        key="notes"
                                        initial={reduce ? false : { opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <SectionLabel>From the chef</SectionLabel>
                                        <figure className="relative mt-4 border-l-2 border-gold/70 bg-ink/40 px-6 py-6">
                                            <Quote className="absolute right-4 top-4 text-gold/30" size={28} />
                                            <blockquote className="font-display text-xl italic leading-relaxed text-cream md:text-2xl">
                                                "{details.chef_note}"
                                            </blockquote>
                                            <figcaption className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-cream-dim">
                                                <ChefHat size={12} className="text-gold" />
                                                Raindear Kitchen
                                            </figcaption>
                                        </figure>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Sticky bottom CTA */}
                        <div className="sticky bottom-0 z-20 mt-auto flex flex-col gap-3 border-t border-line/60 bg-ink-2/95 px-8 py-5 backdrop-blur-md sm:flex-row md:px-12">
                            <a
                                href="/reservation"
                                className="group inline-flex h-12 flex-1 items-center justify-center gap-2 border border-gold/70 bg-gold/10 px-6 font-mono text-[11px] uppercase tracking-[0.32em] text-cream transition-colors hover:bg-gold/20"
                            >
                                Reserve a table
                                <ArrowUpRight
                                    size={14}
                                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </a>
                            <button
                                onClick={onClose}
                                className="inline-flex h-12 items-center justify-center border border-line/70 px-6 font-mono text-[11px] uppercase tracking-[0.32em] text-cream-dim transition-colors hover:border-cream/40 hover:text-cream"
                            >
                                Back to menu
                            </button>
                        </div>
                    </motion.aside>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function StatChip({
    icon,
    label,
    value,
    delay,
    accent,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    delay: number;
    accent?: boolean;
}) {
    const reduce = useReducedMotion();
    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
            className={cn(
                'border bg-ink/40 px-3 py-3',
                accent ? 'border-copper/50' : 'border-line/60',
            )}
        >
            <div
                className={cn(
                    'flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.32em]',
                    accent ? 'text-copper' : 'text-gold',
                )}
            >
                <span className="opacity-90">{icon}</span>
                {label}
            </div>
            <div className="mt-1.5 truncate font-display text-sm text-cream">{value}</div>
        </motion.div>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">{children}</span>
            <span className="hairline flex-1" />
        </div>
    );
}

function CountUp({ value }: { value: number }) {
    const reduce = useReducedMotion();
    const [n, setN] = useState(reduce ? value : 0);

    useEffect(() => {
        if (reduce) {
            setN(value);
            return;
        }
        let raf = 0;
        const start = performance.now();
        const dur = 900;
        const from = 0;
        const ease = (t: number) => 1 - Math.pow(1 - t, 3);
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / dur);
            setN(Math.round(from + (value - from) * ease(t)));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [value, reduce]);

    return <>{formatIDR(n)}</>;
}

function spiceLabel(level: number): string {
    if (level <= 0) return 'None';
    if (level === 1) return 'Mild';
    if (level === 2) return 'Medium';
    return 'Hot';
}

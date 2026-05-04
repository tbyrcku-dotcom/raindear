import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    Coffee,
    Image as ImageIcon,
    Instagram,
    Music2,
    Search,
    Sparkles,
    Utensils,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import { useDocumentTitle } from '@/lib/seo';
import { cn } from '@/lib/utils';
import type { ApiCollection, GalleryAsset } from '@/types';

const EASE = [0.22, 1, 0.36, 1] as const;

const HERO_MONTAGE = [
    '/images/interior/interior-arches.jpg',
    '/images/menu/wagyu-steak.jpg',
    '/images/interior/interior-blue-booth.jpg',
    '/images/menu/lazy-bear-mousse.jpg',
];

type CategorySlug = GalleryAsset['category'] | 'all';

const FILTERS: { slug: CategorySlug; label: string; icon: React.ElementType }[] = [
    { slug: 'all', label: 'All', icon: ImageIcon },
    { slug: 'interior', label: 'Interior', icon: Sparkles },
    { slug: 'food', label: 'Food', icon: Utensils },
    { slug: 'beverage', label: 'Beverage', icon: Coffee },
    { slug: 'event', label: 'Event', icon: Music2 },
    { slug: 'ambience', label: 'Ambience', icon: Sparkles },
];

const CATEGORY_LABELS: Record<GalleryAsset['category'], string> = {
    interior: 'Interior',
    food: 'Food',
    beverage: 'Beverage',
    event: 'Event',
    ambience: 'Ambience',
};

export default function GalleryPage() {
    useDocumentTitle('Gallery — Raindear Coffee & Kitchen');
    const reduce = useReducedMotion();
    const [active, setActive] = useState<CategorySlug>('all');
    const [search, setSearch] = useState('');
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: qk.gallery(),
        queryFn: async () => (await api.get<ApiCollection<GalleryAsset>>('/gallery')).data.data,
    });

    const items = useMemo(() => data ?? [], [data]);

    const counts = useMemo(() => {
        const map: Record<string, number> = { all: items.length };
        items.forEach((g) => {
            map[g.category] = (map[g.category] ?? 0) + 1;
        });
        return map;
    }, [items]);

    const filtered = useMemo(() => {
        return items.filter((g) => {
            if (active !== 'all' && g.category !== active) return false;
            if (search) {
                const q = search.toLowerCase();
                if (
                    !(g.title ?? '').toLowerCase().includes(q) &&
                    !g.alt_text.toLowerCase().includes(q) &&
                    !g.category.includes(q)
                ) {
                    return false;
                }
            }
            return true;
        });
    }, [items, active, search]);

    const featured = useMemo(() => items.filter((g) => g.is_featured).slice(0, 3), [items]);

    // Lock body scroll when lightbox is open
    useEffect(() => {
        document.body.style.overflow = openIdx !== null ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [openIdx]);

    const open = openIdx !== null ? filtered[openIdx] ?? null : null;
    const closeLightbox = () => setOpenIdx(null);
    const next = () => {
        if (openIdx === null) return;
        setOpenIdx((openIdx + 1) % filtered.length);
    };
    const prev = () => {
        if (openIdx === null) return;
        setOpenIdx((openIdx - 1 + filtered.length) % filtered.length);
    };

    return (
        <div className="relative">
            {/* HERO */}
            <header className="relative overflow-hidden border-b border-line/60">
                <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 grid grid-cols-2 gap-1 opacity-[0.22] md:grid-cols-4">
                        {HERO_MONTAGE.map((src, i) => (
                            <motion.div
                                key={src}
                                initial={reduce ? false : { opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.4, ease: EASE, delay: 0.05 * i }}
                                className="relative h-full w-full overflow-hidden"
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
                        Gallery · {items.length} frames · {Object.keys(CATEGORY_LABELS).length} categories
                    </motion.div>

                    <h1 className="mt-5 max-w-4xl font-display text-6xl leading-[0.92] text-cream md:text-8xl">
                        {['Moments,', 'framed.'].map((word, i) => (
                            <span key={word} className="block overflow-hidden">
                                <motion.span
                                    initial={reduce ? false : { y: '110%', opacity: 0, rotateX: -25 }}
                                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                    transition={{ duration: 0.95, ease: EASE, delay: 0.15 + i * 0.08 }}
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
                        Six years of arches, plates, evenings. The room and what happens inside it,
                        captured between pours.
                    </motion.p>

                    <motion.div
                        initial={reduce ? false : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.7, duration: 0.9, ease: EASE }}
                        className="mt-10 h-px w-32 origin-left bg-gold/60"
                    />
                </div>
            </header>

            {/* Featured strip (masonry-mosaic) */}
            {featured.length >= 3 && (
                <section className="container-editorial border-b border-line/60 py-16 md:py-20">
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                                Featured
                            </div>
                            <h2 className="mt-3 font-display text-3xl text-cream md:text-5xl">
                                Editor's <em className="italic text-gold">picks.</em>
                            </h2>
                        </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                        {featured.slice(0, 3).map((g, i) => (
                            <motion.button
                                key={g.id}
                                onClick={() => {
                                    const idx = filtered.findIndex((x) => x.id === g.id);
                                    if (idx >= 0) setOpenIdx(idx);
                                }}
                                initial={reduce ? false : { opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
                                className={cn(
                                    'group relative overflow-hidden border border-transparent transition-colors duration-500 hover:border-gold/60',
                                    i === 0 ? 'aspect-[4/5] md:row-span-2 md:aspect-[4/5]' : 'aspect-[4/3]',
                                )}
                            >
                                <motion.div
                                    whileHover={reduce ? undefined : { scale: 1.07 }}
                                    transition={{ duration: 1, ease: EASE }}
                                    className="absolute inset-0"
                                >
                                    <ImageWithFallback
                                        src={g.image_url ?? undefined}
                                        alt={g.alt_text}
                                        className="h-full w-full"
                                    />
                                </motion.div>
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 to-transparent" />
                                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 border border-gold/70 bg-ink/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.3em] text-gold backdrop-blur-sm">
                                    <Sparkles size={10} /> Featured
                                </div>
                                <div className="absolute bottom-5 left-5 right-5 text-left">
                                    <div className="font-mono text-[9px] uppercase tracking-[0.32em] text-gold">
                                        {CATEGORY_LABELS[g.category]}
                                    </div>
                                    {g.title && (
                                        <div className="mt-1.5 font-display text-xl text-cream md:text-2xl">
                                            {g.title}
                                        </div>
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </section>
            )}

            {/* Sticky filter bar */}
            <div className="sticky top-16 z-30 border-y border-line/60 bg-ink/80 backdrop-blur-md md:top-20">
                <div className="container-editorial flex flex-wrap items-center gap-x-1 gap-y-3 py-4">
                    {FILTERS.map((f) => (
                        <FilterPill
                            key={f.slug}
                            label={f.label}
                            count={counts[f.slug] ?? 0}
                            icon={<f.icon size={11} />}
                            active={active === f.slug}
                            onClick={() => setActive(f.slug)}
                        />
                    ))}

                    <div className="ml-auto flex w-full items-center gap-2 border border-line/60 bg-ink-2/60 px-3 py-2 backdrop-blur transition-colors focus-within:border-gold/60 sm:w-auto">
                        <Search size={14} className="text-cream-dim" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search frames"
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

            {/* Masonry grid */}
            <div className="container-editorial py-16 md:py-20">
                {isLoading ? (
                    <SkeletonMasonry />
                ) : filtered.length === 0 ? (
                    <EmptyState onClear={() => { setActive('all'); setSearch(''); }} />
                ) : (
                    <motion.div layout className="columns-2 gap-4 md:columns-3 lg:columns-4">
                        {filtered.map((g, i) => (
                            <GalleryCard
                                key={g.id}
                                asset={g}
                                index={i}
                                onClick={() => setOpenIdx(i)}
                            />
                        ))}
                    </motion.div>
                )}
            </div>

            {/* CTA strip */}
            <section className="border-t border-line/60 bg-ink-2/40">
                <div className="container-editorial flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between md:py-20">
                    <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                            More frames
                        </div>
                        <h3 className="mt-3 font-display text-3xl text-cream md:text-5xl">
                            Follow us on <em className="italic text-gold">Instagram.</em>
                        </h3>
                        <p className="mt-3 max-w-md text-cream-dim">
                            Live posts, week's specials, behind-the-bar moments — the rest of the
                            story between visits.
                        </p>
                    </div>
                    <a
                        href="https://www.instagram.com/raindear.coffee"
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex h-14 items-center justify-center gap-2 border border-gold/70 bg-gold/10 px-8 font-mono text-[11px] uppercase tracking-[0.32em] text-cream transition-colors hover:bg-gold/20"
                    >
                        <Instagram size={14} />
                        @raindear.coffee
                        <ArrowUpRight
                            size={14}
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </a>
                </div>
            </section>

            {/* Lightbox */}
            <Lightbox
                open={open}
                index={openIdx}
                total={filtered.length}
                items={filtered}
                onClose={closeLightbox}
                onPrev={prev}
                onNext={next}
                onJump={(i) => setOpenIdx(i)}
            />
        </div>
    );
}

/* ----------------------------- subcomponents ----------------------------- */

function FilterPill({
    label,
    count,
    icon,
    active,
    onClick,
}: {
    label: string;
    count: number;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            aria-pressed={active}
            className="group relative inline-flex items-center gap-2 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.32em]"
        >
            <span
                className={cn(
                    'transition-colors',
                    active ? 'text-gold' : 'text-cream-dim group-hover:text-cream',
                )}
            >
                {icon}
            </span>
            <span className={cn('transition-colors', active ? 'text-cream' : 'text-cream-dim group-hover:text-cream')}>
                {label}
            </span>
            <span
                className={cn(
                    'align-middle text-[9px] tracking-[0.2em] transition-colors',
                    active ? 'text-gold' : 'text-cream-dim/60 group-hover:text-cream-dim',
                )}
            >
                {count}
            </span>
            {active && (
                <motion.span
                    layoutId="gallery-filter-underline"
                    className="absolute inset-x-2 -bottom-0.5 h-px bg-gold"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
            )}
        </button>
    );
}

function GalleryCard({
    asset,
    index,
    onClick,
}: {
    asset: GalleryAsset;
    index: number;
    onClick: () => void;
}) {
    const reduce = useReducedMotion();
    // Vary aspect for organic masonry feel
    const aspect = ['3/4', '4/5', '1/1', '4/3', '5/6'][index % 5];

    return (
        <motion.button
            type="button"
            onClick={onClick}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.04 * (index % 12) }}
            className="group relative mb-4 block w-full break-inside-avoid text-left"
            aria-label={asset.title ?? asset.alt_text}
        >
            <div className="relative w-full overflow-hidden border border-transparent bg-ink-2 transition-colors duration-500 group-hover:border-gold/60">
                <motion.div
                    whileHover={reduce ? undefined : { scale: 1.07 }}
                    transition={{ duration: 1, ease: EASE }}
                    className="block w-full"
                    style={{ aspectRatio: aspect }}
                >
                    <ImageWithFallback
                        src={asset.image_url ?? undefined}
                        alt={asset.alt_text}
                        className="h-full w-full"
                        fallbackTone={index % 3 === 0 ? 'gold' : index % 3 === 1 ? 'copper' : 'coffee'}
                    />
                </motion.div>

                {/* base gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* corner ticks */}
                <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-gold/0 transition-all duration-500 group-hover:h-5 group-hover:w-5 group-hover:border-gold" />
                <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-gold/0 transition-all duration-500 group-hover:h-5 group-hover:w-5 group-hover:border-gold" />
                <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-gold/0 transition-all duration-500 group-hover:h-5 group-hover:w-5 group-hover:border-gold" />
                <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-gold/0 transition-all duration-500 group-hover:h-5 group-hover:w-5 group-hover:border-gold" />

                {/* hover view-arrow */}
                <span aria-hidden className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 -translate-y-2 items-center justify-center rounded-full border border-gold/40 bg-ink/50 text-gold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight size={14} />
                </span>

                {/* category chip */}
                <div className="absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.3em] text-cream">
                    <span className="border border-cream/30 bg-ink/50 px-2 py-1 backdrop-blur-sm">
                        {CATEGORY_LABELS[asset.category]}
                    </span>
                </div>

                {/* caption fade-in */}
                {asset.title && (
                    <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="font-display text-base leading-tight text-cream md:text-lg">
                            {asset.title}
                        </div>
                        <span className="mt-1.5 block h-px w-6 bg-gold/60" />
                    </div>
                )}
            </div>
        </motion.button>
    );
}

function SkeletonMasonry() {
    return (
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <div
                    key={i}
                    style={{ aspectRatio: ['3/4', '4/5', '1/1', '4/3', '5/6'][i % 5] }}
                    className="mb-4 w-full skeleton break-inside-avoid"
                />
            ))}
        </div>
    );
}

function EmptyState({ onClear }: { onClear: () => void }) {
    return (
        <div className="border border-line/60 bg-ink-2/40 px-6 py-20 text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center border border-gold/40 text-gold">
                <ImageIcon size={18} />
            </div>
            <div className="mt-6 font-display text-3xl text-cream">No frames here.</div>
            <p className="mt-2 text-cream-dim">Try a different filter, or clear your search.</p>
            <button
                onClick={onClear}
                className="mt-8 inline-flex h-11 items-center justify-center border border-gold/70 bg-gold/10 px-6 font-mono text-[10px] uppercase tracking-[0.32em] text-cream transition-colors hover:bg-gold/20"
            >
                Reset filters
            </button>
        </div>
    );
}

function Lightbox({
    open,
    index,
    total,
    items,
    onClose,
    onPrev,
    onNext,
    onJump,
}: {
    open: GalleryAsset | null;
    index: number | null;
    total: number;
    items: GalleryAsset[];
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
    onJump: (i: number) => void;
}) {
    const reduce = useReducedMotion();

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose, onPrev, onNext]);

    return (
        <AnimatePresence>
            {open && index !== null && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[80] flex flex-col bg-ink/95 backdrop-blur-md"
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                    aria-label={open.title ?? open.alt_text}
                >
                    {/* Top bar */}
                    <div
                        className="flex items-center justify-between border-b border-line/40 px-6 py-4 md:px-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">
                            <span className="text-gold">{String(index + 1).padStart(2, '0')}</span>
                            <span className="mx-2 text-cream-dim/40">/</span>
                            <span>{String(total).padStart(2, '0')}</span>
                            <span className="ml-4 text-cream">· {CATEGORY_LABELS[open.category]}</span>
                        </div>
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-line/60 bg-ink/40 text-cream transition-colors hover:border-gold/70 hover:text-gold"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Image area */}
                    <div
                        className="relative flex flex-1 items-center justify-center overflow-hidden p-4 md:p-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Click outside image area to close
                            if (e.target === e.currentTarget) onClose();
                        }}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onPrev();
                            }}
                            aria-label="Previous"
                            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-line/60 bg-ink/60 text-cream backdrop-blur transition-colors hover:border-gold/70 hover:text-gold md:left-10"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={open.id}
                                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                                transition={{ duration: 0.45, ease: EASE }}
                                className="relative max-h-full max-w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ImageWithFallback
                                    src={open.image_url ?? undefined}
                                    alt={open.alt_text}
                                    className="block max-h-[72vh] w-auto md:max-h-[78vh]"
                                />
                                {/* Corner ticks */}
                                <span aria-hidden className="absolute left-0 top-0 h-4 w-4 border-l border-t border-gold/70" />
                                <span aria-hidden className="absolute right-0 top-0 h-4 w-4 border-r border-t border-gold/70" />
                                <span aria-hidden className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-gold/70" />
                                <span aria-hidden className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-gold/70" />
                            </motion.div>
                        </AnimatePresence>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onNext();
                            }}
                            aria-label="Next"
                            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-line/60 bg-ink/60 text-cream backdrop-blur transition-colors hover:border-gold/70 hover:text-gold md:right-10"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Caption */}
                    <div
                        className="border-t border-line/40 px-6 py-4 md:px-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`cap-${open.id}`}
                                initial={reduce ? false : { opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                                transition={{ duration: 0.35 }}
                                className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between"
                            >
                                <div>
                                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                                        {CATEGORY_LABELS[open.category]}
                                    </div>
                                    <div className="mt-1 font-display text-xl text-cream md:text-2xl">
                                        {open.title ?? open.alt_text}
                                    </div>
                                </div>
                                <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-cream-dim">
                                    Use ←  →  Esc to navigate
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Thumbnail strip */}
                    <div
                        className="border-t border-line/40 px-4 py-4 md:px-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {items.map((g, i) => (
                                <button
                                    key={g.id}
                                    onClick={() => onJump(i)}
                                    className={cn(
                                        'relative h-14 w-20 shrink-0 overflow-hidden border transition-all duration-300',
                                        i === index
                                            ? 'border-gold opacity-100'
                                            : 'border-line/60 opacity-50 hover:opacity-90',
                                    )}
                                    aria-label={`Go to image ${i + 1}`}
                                >
                                    <ImageWithFallback
                                        src={g.image_url ?? undefined}
                                        alt=""
                                        className="h-full w-full"
                                    />
                                    {i === index && (
                                        <motion.span
                                            layoutId="lightbox-thumb-active"
                                            className="absolute inset-0 border-2 border-gold"
                                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

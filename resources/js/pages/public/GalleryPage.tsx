import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import { useDocumentTitle } from '@/lib/seo';
import { cn } from '@/lib/utils';
import type { ApiCollection, GalleryAsset } from '@/types';

const FILTERS: { slug: string; label: string }[] = [
    { slug: 'all', label: 'All' },
    { slug: 'interior', label: 'Interior' },
    { slug: 'food', label: 'Food' },
    { slug: 'beverage', label: 'Beverage' },
    { slug: 'event', label: 'Event' },
    { slug: 'ambience', label: 'Ambience' },
];

export default function GalleryPage() {
    useDocumentTitle('Gallery — Raindear Coffee & Kitchen');
    const [active, setActive] = useState('all');
    const [open, setOpen] = useState<GalleryAsset | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: qk.gallery(),
        queryFn: async () => (await api.get<ApiCollection<GalleryAsset>>('/gallery')).data.data,
    });

    const filtered = useMemo(
        () => (data ?? []).filter((g) => (active === 'all' ? true : g.category === active)),
        [data, active],
    );

    return (
        <div className="relative">
            <header className="container-editorial pt-20 pb-12 md:pt-32">
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">Gallery</div>
                <h1 className="mt-4 max-w-3xl font-display text-6xl leading-[0.92] text-cream md:text-8xl">
                    Moments, <em className="italic text-gold">framed.</em>
                </h1>
            </header>

            <div className="container-editorial mb-12 flex flex-wrap gap-x-6 gap-y-3 border-y border-line/60 py-4">
                {FILTERS.map((f) => (
                    <button
                        key={f.slug}
                        onClick={() => setActive(f.slug)}
                        className={cn(
                            'font-mono text-[11px] uppercase tracking-[0.32em] transition-colors',
                            active === f.slug ? 'text-cream' : 'text-cream-dim hover:text-cream',
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="container-editorial pb-24">
                {isLoading ? (
                    <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} style={{ aspectRatio: i % 2 === 0 ? '3/4' : '4/5' }} className="mb-4 w-full skeleton" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-24 text-center">
                        <div className="font-display text-3xl text-cream">Nothing here yet.</div>
                        <p className="mt-2 text-cream-dim">Replace placeholder assets with licensed Raindear photography.</p>
                    </div>
                ) : (
                    <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
                        {filtered.map((g, i) => (
                            <motion.button
                                key={g.id}
                                onClick={() => setOpen(g)}
                                className="mb-4 block w-full break-inside-avoid"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <ImageWithFallback
                                    src={g.image_url ?? undefined}
                                    alt={g.alt_text}
                                    className="w-full"
                                    style={{ aspectRatio: i % 4 === 0 ? '3/4' : i % 4 === 1 ? '4/5' : i % 4 === 2 ? '1/1' : '4/3' }}
                                    fallbackTone={i % 3 === 0 ? 'gold' : i % 3 === 1 ? 'copper' : 'coffee'}
                                />
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-6"
                        onClick={() => setOpen(null)}
                    >
                        <button onClick={() => setOpen(null)} className="absolute right-4 top-4 text-cream" aria-label="Close">
                            <X size={20} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="max-h-[88vh] max-w-5xl"
                        >
                            <ImageWithFallback src={open.image_url ?? undefined} alt={open.alt_text} className="max-h-[88vh] w-auto" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

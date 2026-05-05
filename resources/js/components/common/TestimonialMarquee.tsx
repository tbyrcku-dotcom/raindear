import { motion, useReducedMotion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Testimonial } from '@/types';

type Direction = 'left' | 'right';

type RowProps = {
    items: Testimonial[];
    direction: Direction;
    /** seconds for a full loop — larger = slower */
    duration?: number;
    className?: string;
};

/**
 * A single marquee row. Duplicates the item list once so that the visual
 * sequence can slide by 50% of total width and the second half visually
 * occupies where the first started — producing a perfectly seamless loop.
 */
function MarqueeRow({ items, direction, duration = 60, className }: RowProps) {
    const reduce = useReducedMotion();
    const loop = [...items, ...items];

    const x = direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'];

    return (
        <div
            className={cn(
                'group relative overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]',
                className,
            )}
        >
            <motion.div
                className="flex w-max gap-6 pr-6"
                initial={{ x: x[0] }}
                animate={reduce ? { x: x[0] } : { x: x[1] }}
                transition={
                    reduce
                        ? undefined
                        : {
                              duration,
                              repeat: Infinity,
                              ease: 'linear',
                          }
                }
                // pause on hover for readability
                whileHover={reduce ? undefined : { animationPlayState: 'paused' }}
                style={reduce ? undefined : undefined}
            >
                {loop.map((t, i) => (
                    <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
                ))}
            </motion.div>
        </div>
    );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    const stars = Math.max(0, Math.min(5, Math.round(testimonial.rating ?? 5)));
    return (
        <figure
            className="relative w-[320px] shrink-0 border border-line/60 bg-ink-2/40 px-7 py-8 backdrop-blur-[2px] md:w-[420px]"
            aria-label={`Review by ${testimonial.customer_name}`}
        >
            <Quote className="text-gold/50" size={22} strokeWidth={1} aria-hidden />
            <div className="mt-3 flex items-center gap-1 text-gold" aria-label={`${stars} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        strokeWidth={1.25}
                        className={i < stars ? 'fill-gold text-gold' : 'text-gold/25'}
                    />
                ))}
            </div>
            <blockquote className="mt-5 font-display text-xl leading-snug text-cream md:text-[1.4rem]">
                “{testimonial.content}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-cream-dim">
                <span aria-hidden className="h-px w-8 bg-gold/50" />
                {testimonial.customer_name}
                {testimonial.source && <span className="text-gold">· {testimonial.source}</span>}
            </figcaption>
        </figure>
    );
}

type Props = {
    testimonials: Testimonial[];
};

/**
 * Two-row testimonial marquee: the top row scrolls left, the bottom row scrolls
 * right — creating a counter-drifting, continuous stream of customer voices.
 * Respects `prefers-reduced-motion` by rendering static rows.
 */
export function TestimonialMarquee({ testimonials }: Props) {
    if (!testimonials.length) return null;

    // Alternate items into two visually distinct streams so neither row repeats
    // the same review beside itself when duplicated.
    const top = testimonials.filter((_, i) => i % 2 === 0);
    const bottom = testimonials.filter((_, i) => i % 2 === 1);

    const safeTop = top.length ? top : testimonials;
    const safeBottom = bottom.length ? bottom : testimonials;

    return (
        <div className="relative space-y-4">
            <MarqueeRow items={safeTop} direction="left" duration={70} />
            <MarqueeRow items={safeBottom} direction="right" duration={85} />
        </div>
    );
}

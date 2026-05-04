import { motion } from 'framer-motion';
import { Coffee, Music, PartyPopper, UtensilsCrossed, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { SectionHeader } from '@/components/common/SectionHeader';

type Item = {
    icon: LucideIcon;
    title: string;
    body: string;
};

const items: Item[] = [
    {
        icon: Coffee,
        title: 'Coffee',
        body: 'Slow-pulled espresso and signature ice coffees, crafted in-house.',
    },
    {
        icon: UtensilsCrossed,
        title: 'Kitchen',
        body: 'Indonesian classics, pastas, and steaks — built around comfort and craft.',
    },
    {
        icon: Users,
        title: 'Family hangout',
        body: 'Long tables, warm lighting, room for the whole table to breathe.',
    },
    {
        icon: PartyPopper,
        title: 'Event & birthday',
        body: 'Set menus, private corners, decoration setup — handled by our team.',
    },
    {
        icon: Music,
        title: 'Live music',
        body: 'Acoustic sets every Friday and Saturday from 8 PM.',
    },
];

function ExperienceCard({ item, index, large }: { item: Item; index: number; large?: boolean }) {
    const Icon = item.icon;
    return (
        <AnimatedReveal delay={index * 0.06} className="px-0 md:px-10">
            <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group relative h-full py-10 md:py-12"
            >
                {/* hover gold halo */}
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    style={{
                        background:
                            'radial-gradient(380px 280px at 50% 0%, rgba(201,162,91,0.08), transparent 70%)',
                    }}
                />

                <motion.span
                    whileHover={{ rotate: 6, scale: 1.12 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex h-12 w-12 items-center justify-center border border-gold/40 text-gold transition-all duration-500 group-hover:border-gold group-hover:bg-gold/10"
                >
                    <Icon size={20} strokeWidth={1.4} />
                </motion.span>

                <h3 className={`mt-6 font-display ${large ? 'text-4xl md:text-[2.6rem]' : 'text-3xl'} text-cream`}>
                    {item.title}
                </h3>
                <p className="mt-3 max-w-xs text-cream-dim">{item.body}</p>

                {/* underline that grows on hover */}
                <span aria-hidden className="mt-6 block h-px w-8 bg-gold/40 transition-all duration-500 group-hover:w-24 group-hover:bg-gold" />
            </motion.div>
        </AnimatedReveal>
    );
}

export function ExperienceSection() {
    return (
        <section className="relative py-32 md:py-40 border-t border-line/60">
            {/* slow drifting top hairline */}
            <motion.span
                aria-hidden
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true, margin: '-20%' }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 top-0 h-px w-full origin-left bg-gradient-to-r from-transparent via-gold/40 to-transparent"
            />

            <div className="container-editorial">
                <SectionHeader
                    eyebrow="Experience"
                    title={
                        <>
                            From casual brunch to
                            <br />
                            <em className="font-display italic text-gold">private celebration.</em>
                        </>
                    }
                />

                <div className="mt-16 grid grid-cols-1 divide-y divide-line/60 md:grid-cols-3 md:divide-y-0 md:divide-x">
                    {items.slice(0, 3).map((it, i) => (
                        <ExperienceCard key={it.title} item={it} index={i} />
                    ))}
                </div>
                <div className="grid grid-cols-1 divide-y divide-line/60 border-t border-line/60 md:grid-cols-2 md:divide-y-0 md:divide-x">
                    {items.slice(3).map((it, i) => (
                        <ExperienceCard key={it.title} item={it} index={i} large />
                    ))}
                </div>
            </div>
        </section>
    );
}

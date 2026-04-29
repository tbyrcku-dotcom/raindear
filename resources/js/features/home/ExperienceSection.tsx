import { Coffee, Music, PartyPopper, UtensilsCrossed, Users } from 'lucide-react';

import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { SectionHeader } from '@/components/common/SectionHeader';

const items = [
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

export function ExperienceSection() {
    return (
        <section className="relative py-32 md:py-40 border-t border-line/60">
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
                        <AnimatedReveal key={it.title} delay={i * 0.05} className="px-0 md:px-10">
                            <div className="py-10 md:py-12">
                                <it.icon className="text-gold" size={22} strokeWidth={1.5} />
                                <h3 className="mt-6 font-display text-3xl text-cream">{it.title}</h3>
                                <p className="mt-3 max-w-xs text-cream-dim">{it.body}</p>
                            </div>
                        </AnimatedReveal>
                    ))}
                </div>
                <div className="grid grid-cols-1 divide-y divide-line/60 border-t border-line/60 md:grid-cols-2 md:divide-y-0 md:divide-x">
                    {items.slice(3).map((it, i) => (
                        <AnimatedReveal key={it.title} delay={i * 0.05} className="px-0 md:px-10">
                            <div className="py-10 md:py-12">
                                <it.icon className="text-gold" size={22} strokeWidth={1.5} />
                                <h3 className="mt-6 font-display text-3xl text-cream">{it.title}</h3>
                                <p className="mt-3 max-w-xs text-cream-dim">{it.body}</p>
                            </div>
                        </AnimatedReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

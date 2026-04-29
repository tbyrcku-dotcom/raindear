import { useQuery } from '@tanstack/react-query';
import { Quote } from 'lucide-react';

import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import type { ApiCollection, Testimonial } from '@/types';

export function TestimonialSection() {
    const { data } = useQuery({
        queryKey: qk.testimonials(true),
        queryFn: async () => {
            const r = await api.get<ApiCollection<Testimonial>>('/testimonials', { params: { featured: true } });
            return r.data.data;
        },
    });

    const items = (data ?? []).slice(0, 3);

    return (
        <section className="relative py-32 md:py-40 border-t border-line/60">
            <div className="container-editorial">
                <div className="mb-16 font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                    Worth staying for · words from the room
                </div>

                <div className="grid gap-12 md:grid-cols-3 md:gap-10">
                    {items.map((t, i) => (
                        <AnimatedReveal key={t.id} delay={i * 0.08}>
                            <figure className="relative">
                                <Quote className="text-gold/40" size={28} strokeWidth={1} />
                                <blockquote className="mt-5 font-display text-2xl leading-snug text-cream md:text-3xl">
                                    “{t.content}”
                                </blockquote>
                                <figcaption className="mt-6 font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">
                                    {t.customer_name}
                                    {t.source && <span className="text-gold"> · {t.source}</span>}
                                </figcaption>
                            </figure>
                        </AnimatedReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

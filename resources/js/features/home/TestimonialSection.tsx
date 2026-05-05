import { useQuery } from '@tanstack/react-query';

import { TestimonialMarquee } from '@/components/common/TestimonialMarquee';
import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import type { ApiCollection, Testimonial } from '@/types';

export function TestimonialSection() {
    const { data, isLoading } = useQuery({
        queryKey: qk.testimonials(true),
        queryFn: async () => {
            const r = await api.get<ApiCollection<Testimonial>>('/testimonials', {
                params: { featured: true },
            });
            return r.data.data;
        },
    });

    const items = data ?? [];

    return (
        <section className="relative border-t border-line/60 py-28 md:py-36">
            <div className="container-editorial mb-14 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                        Worth staying for · words from the room
                    </div>
                    <h2 className="mt-5 max-w-2xl font-display text-4xl leading-[0.95] text-cream md:text-5xl">
                        Real reviews,<br />
                        <em className="italic text-gold">real warmth.</em>
                    </h2>
                </div>
                <a
                    href="https://www.tripadvisor.co.id/Restaurant_Review-g297706-d23741380-Reviews-Raindear_Coffee_And_Kitchen_Bogor-Bogor_West_Java_Java.html"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim hover:text-cream"
                >
                    See all on TripAdvisor →
                </a>
            </div>

            {isLoading ? (
                <div className="container-editorial grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-52 w-full skeleton" />
                    ))}
                </div>
            ) : (
                <TestimonialMarquee testimonials={items} />
            )}
        </section>
    );
}

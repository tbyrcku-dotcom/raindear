import { useQuery } from '@tanstack/react-query';
import { Clock, MapPin, Phone } from 'lucide-react';

import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import { dayName } from '@/lib/utils';
import type { ApiCollection, Outlet } from '@/types';

export function LocationSection() {
    const { data } = useQuery({
        queryKey: qk.outlets,
        queryFn: async () => {
            const r = await api.get<ApiCollection<Outlet>>('/outlets');
            return r.data.data;
        },
    });

    const outlet = data?.[0];

    return (
        <section className="relative py-32 md:py-40 border-t border-line/60">
            <div className="container-editorial grid gap-12 md:grid-cols-12">
                <AnimatedReveal className="md:col-span-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                        Find us
                    </div>
                    <h2 className="mt-5 font-display text-5xl leading-[0.95] text-cream md:text-6xl">
                        A warm corner
                        <br />
                        of <em className="italic text-gold">Baranangsiang.</em>
                    </h2>

                    <dl className="mt-10 space-y-6 text-cream-dim">
                        <div className="flex gap-4">
                            <MapPin className="mt-1 shrink-0 text-gold" size={16} strokeWidth={1.5} />
                            <div>
                                <dt className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream">Address</dt>
                                <dd className="mt-1">{outlet?.address ?? 'Jl. Bina Marga No.7, Baranangsiang, Bogor Timur'}</dd>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Phone className="mt-1 shrink-0 text-gold" size={16} strokeWidth={1.5} />
                            <div>
                                <dt className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream">Reach</dt>
                                <dd className="mt-1">
                                    <a href="tel:+6282111789089" className="hover:text-cream">+62 821-1178-9089</a>
                                </dd>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Clock className="mt-1 shrink-0 text-gold" size={16} strokeWidth={1.5} />
                            <div>
                                <dt className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream">Hours</dt>
                                <dd className="mt-1 space-y-1">
                                    {outlet?.opening_hours?.length ? (
                                        outlet.opening_hours.map((h) => (
                                            <div key={h.id} className="flex justify-between gap-6">
                                                <span>{dayName(h.day_of_week)}</span>
                                                <span className="font-mono text-xs text-cream-dim">
                                                    {h.is_closed ? 'Closed' : `${h.open_time?.slice(0, 5)} – ${h.close_time?.slice(0, 5)}`}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div>Open daily · 09:00 — 23:00</div>
                                    )}
                                </dd>
                            </div>
                        </div>
                    </dl>
                </AnimatedReveal>

                <AnimatedReveal className="md:col-span-7">
                    <div className="relative aspect-[4/3] w-full overflow-hidden border border-line/60 bg-ink-2">
                        <iframe
                            title="Raindear Bogor location map"
                            src="https://maps.google.com/maps?q=Raindear%20Coffee%20Bogor%20Baranangsiang&t=&z=16&ie=UTF8&iwloc=&output=embed"
                            className="absolute inset-0 h-full w-full grayscale-[40%]"
                            loading="lazy"
                        />
                    </div>
                </AnimatedReveal>
            </div>
        </section>
    );
}

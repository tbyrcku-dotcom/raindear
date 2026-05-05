import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { SectionHeader } from '@/components/common/SectionHeader';
import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import { formatIDR } from '@/lib/utils';
import type { ApiCollection, MenuItem } from '@/types';

export function SignatureMenuSection() {
    const { data, isLoading } = useQuery({
        queryKey: qk.menuItems({ signature: true }),
        queryFn: async () => {
            const r = await api.get<ApiCollection<MenuItem>>('/menu-items', { params: { signature: true } });
            return r.data.data;
        },
    });

    const items = (data ?? []).slice(0, 8);

    return (
        <section className="relative py-32 md:py-40">
            {/* faint vertical gold guide */}
            <div aria-hidden className="pointer-events-none absolute inset-y-0 right-8 hidden w-px bg-gradient-to-b from-transparent via-gold/15 to-transparent md:block" />

            <div className="container-editorial">
                <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
                    <SectionHeader
                        eyebrow="Signature"
                        title={
                            <>
                                Plates <em className="font-display italic text-gold">we&apos;re known</em>
                                <br />
                                for in Bogor.
                            </>
                        }
                        description="A short list, on purpose. Every dish on this section is one we'd cook for a friend."
                    />
                    <Link
                        to="/menu"
                        className="group inline-flex items-center gap-2 self-start font-mono text-[11px] uppercase tracking-[0.32em] text-gold hover:text-gold-soft md:self-end"
                    >
                        See full menu
                        <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />
                    </Link>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
                    {isLoading
                        ? Array.from({ length: 8 }).map((_, i) => (
                              <div key={i} className="space-y-4">
                                  <div className="aspect-[3/4] w-full skeleton" />
                                  <div className="h-4 w-2/3 skeleton" />
                                  <div className="h-3 w-1/3 skeleton" />
                              </div>
                          ))
                        : items.map((item, i) => (
                              <AnimatedReveal key={item.id} delay={i * 0.07}>
                                  <Link to="/menu" className="group block">
                                      <div className="relative aspect-[3/4] w-full overflow-hidden">
                                          <motion.div
                                              whileHover={{ scale: 1.06 }}
                                              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                              className="absolute inset-0"
                                          >
                                              <ImageWithFallback
                                                  src={item.image_url ?? undefined}
                                                  alt={item.name}
                                                  className="h-full w-full transition-[filter] duration-700 group-hover:brightness-110"
                                                  fallbackTone={i % 3 === 0 ? 'gold' : i % 3 === 1 ? 'copper' : 'coffee'}
                                              />
                                          </motion.div>

                                          {/* hover gold border reveal */}
                                          <span aria-hidden className="pointer-events-none absolute inset-0 border border-gold/0 transition-colors duration-500 group-hover:border-gold/60" />

                                          {/* corner ticks */}
                                          <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-gold/0 transition-all duration-500 group-hover:border-gold group-hover:h-5 group-hover:w-5" />
                                          <span aria-hidden className="pointer-events-none absolute right-0 bottom-0 h-3 w-3 border-r border-b border-gold/0 transition-all duration-500 group-hover:border-gold group-hover:h-5 group-hover:w-5" />

                                          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

                                          <div className="absolute left-4 top-4 flex gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-cream">
                                              {item.is_signature && <span className="border border-gold/70 bg-ink/40 px-2 py-1">Signature</span>}
                                              {item.is_new && <span className="border border-cream/40 bg-ink/40 px-2 py-1">New</span>}
                                          </div>

                                          {/* hover view-arrow */}
                                          <span aria-hidden className="pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-ink/40 text-gold opacity-0 transition-all duration-500 group-hover:opacity-100">
                                              <ArrowUpRight size={14} />
                                          </span>
                                      </div>

                                      <div className="mt-5 flex items-start justify-between gap-3">
                                          <h3 className="font-display text-2xl leading-tight text-cream transition-colors group-hover:text-cream">
                                              {item.name}
                                          </h3>
                                          <span className="font-mono text-xs text-gold whitespace-nowrap">
                                              {formatIDR(item.price)}
                                          </span>
                                      </div>

                                      {/* underline that grows on hover */}
                                      <span aria-hidden className="mt-3 block h-px w-6 bg-gold/40 transition-all duration-500 group-hover:w-full group-hover:bg-gold/80" />

                                      {item.description && (
                                          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-cream-dim">
                                              {item.description}
                                          </p>
                                      )}
                                  </Link>
                              </AnimatedReveal>
                          ))}
                </div>
            </div>
        </section>
    );
}

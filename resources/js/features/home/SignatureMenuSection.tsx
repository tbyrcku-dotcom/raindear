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
                        <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
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
                              <AnimatedReveal key={item.id} delay={i * 0.05}>
                                  <Link to="/menu" className="group block">
                                      <div className="relative aspect-[3/4] w-full overflow-hidden">
                                          <motion.div
                                              whileHover={{ scale: 1.04 }}
                                              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                              className="absolute inset-0"
                                          >
                                              <ImageWithFallback
                                                  src={item.image_url ?? undefined}
                                                  alt={item.name}
                                                  className="h-full w-full"
                                                  fallbackTone={i % 3 === 0 ? 'gold' : i % 3 === 1 ? 'copper' : 'coffee'}
                                              />
                                          </motion.div>
                                          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                                          <div className="absolute left-4 top-4 flex gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-cream">
                                              {item.is_signature && <span className="border border-gold/70 bg-ink/40 px-2 py-1">Signature</span>}
                                              {item.is_new && <span className="border border-cream/40 bg-ink/40 px-2 py-1">New</span>}
                                          </div>
                                      </div>
                                      <div className="mt-5 flex items-start justify-between gap-3">
                                          <h3 className="font-display text-2xl leading-tight text-cream">
                                              {item.name}
                                          </h3>
                                          <span className="font-mono text-xs text-gold whitespace-nowrap">
                                              {formatIDR(item.price)}
                                          </span>
                                      </div>
                                      {item.description && (
                                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-cream-dim">
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

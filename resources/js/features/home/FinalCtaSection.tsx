import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { DeerMark } from '@/components/deer/DeerMark';

const WA_LINK = 'https://wa.me/6282111789089?text=Halo%20Raindear%2C%20saya%20mau%20reservasi%20meja';

export function FinalCtaSection() {
    const reduce = useReducedMotion();
    return (
        <section className="relative isolate overflow-hidden py-32 md:py-48 border-t border-line/60">
            {/* slowly rotating watermark */}
            <motion.div
                aria-hidden
                className="absolute inset-0 -z-10 flex items-center justify-center opacity-[0.07]"
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            >
                <DeerMark size={720} stroke="var(--color-gold)" strokeWidth={0.6} />
            </motion.div>

            {/* gold halo */}
            <motion.div
                aria-hidden
                className="absolute inset-0 -z-10"
                animate={
                    reduce
                        ? undefined
                        : {
                              opacity: [0.35, 0.55, 0.35],
                          }
                }
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    background:
                        'radial-gradient(700px 500px at 50% 50%, rgba(201,162,91,0.12), transparent 70%)',
                }}
            />

            <div className="container-editorial text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                    Reserve · Celebrate · Stay a while
                </div>
                <h2 className="mx-auto mt-6 max-w-3xl text-balance font-display text-5xl leading-[0.95] text-cream md:text-7xl">
                    Save the table.
                    <br />
                    <em className="italic text-gold">Bring the people.</em>
                </h2>
                <p className="mx-auto mt-6 max-w-md text-cream-dim">
                    From a quiet date to a private celebration — we&apos;ll set the room.
                </p>

                <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                    {/* primary CTA with pulsing gold ring */}
                    <Link
                        to="/reservation"
                        className="group relative inline-flex h-14 items-center gap-3 overflow-hidden px-10 font-mono text-[12px] uppercase tracking-[0.32em] text-cream"
                    >
                        <span className="absolute inset-0 -z-10 border border-gold/70 bg-gold/10 transition-colors duration-500 group-hover:bg-gold/20" />
                        {/* pulsing outer ring */}
                        {!reduce && (
                            <motion.span
                                aria-hidden
                                animate={{ opacity: [0.0, 0.7, 0], scale: [1, 1.12, 1.18] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
                                className="pointer-events-none absolute inset-0 -z-20 border border-gold"
                            />
                        )}
                        Reserve a table
                        <ArrowUpRight
                            size={14}
                            className="transition-transform duration-500 group-hover:translate-x-1.5 group-hover:-translate-y-1.5"
                        />
                    </Link>

                    <a
                        href={WA_LINK}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex h-14 items-center px-7 font-mono text-[11px] uppercase tracking-[0.32em] text-cream-dim transition-colors hover:text-cream"
                    >
                        <span className="relative">
                            Or chat on WhatsApp
                            <span aria-hidden className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
                        </span>
                    </a>
                </div>
            </div>
        </section>
    );
}

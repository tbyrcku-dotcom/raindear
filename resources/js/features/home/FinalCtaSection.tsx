import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const WA_LINK = 'https://wa.me/6282111789089?text=Halo%20Raindear%2C%20saya%20mau%20reservasi%20meja';
const EASE = [0.22, 1, 0.36, 1] as const;

const HEADLINE_LINES = ['Save the table.', 'Bring the people.'];

export function FinalCtaSection() {
    const reduce = useReducedMotion();

    return (
        <section className="relative isolate overflow-hidden border-t border-line/60 py-32 md:py-48">
            {/* deep base */}
            <div aria-hidden className="absolute inset-0 -z-30 bg-ink" />

            {/* moving gold light wash, very slow */}
            <motion.div
                aria-hidden
                className="absolute inset-0 -z-20"
                animate={
                    reduce
                        ? undefined
                        : {
                              background: [
                                  'radial-gradient(800px 540px at 30% 60%, rgba(201,162,91,0.16), transparent 70%)',
                                  'radial-gradient(800px 540px at 70% 40%, rgba(201,162,91,0.16), transparent 70%)',
                                  'radial-gradient(800px 540px at 30% 60%, rgba(201,162,91,0.16), transparent 70%)',
                              ],
                          }
                }
                transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            />

            {/* deer brand watermark — actual logo, breathing + parallax-ish drift */}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.6, ease: EASE }}
            >
                <motion.img
                    src="/images/brand/raindear-deer-gold.png"
                    alt=""
                    className="h-[78%] w-auto max-w-[80%] object-contain opacity-[0.10] mix-blend-screen md:h-[88%]"
                    animate={
                        reduce
                            ? undefined
                            : {
                                  scale: [1, 1.04, 1],
                                  y: [0, -8, 0],
                              }
                    }
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                />
            </motion.div>

            {/* dual concentric breathing rings */}
            {!reduce && (
                <>
                    <motion.span
                        aria-hidden
                        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/15"
                        animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.6, 0.35] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.span
                        aria-hidden
                        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[40vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/20"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    />
                </>
            )}

            {/* drifting hairlines */}
            {!reduce && (
                <>
                    <motion.span
                        aria-hidden
                        className="pointer-events-none absolute left-0 top-1/3 -z-10 h-px w-full origin-left bg-gradient-to-r from-transparent via-gold/30 to-transparent"
                        animate={{ x: ['-30%', '20%', '-30%'] }}
                        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.span
                        aria-hidden
                        className="pointer-events-none absolute left-0 bottom-1/3 -z-10 h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent"
                        animate={{ x: ['20%', '-30%', '20%'] }}
                        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </>
            )}

            <div className="container-editorial relative text-center">
                {/* eyebrow */}
                <motion.div
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-gold"
                >
                    <motion.span
                        aria-hidden
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                        className="block h-px w-10 origin-right bg-gold/60"
                    />
                    Reserve · Celebrate · Stay a while
                    <motion.span
                        aria-hidden
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                        className="block h-px w-10 origin-left bg-gold/60"
                    />
                </motion.div>

                {/* headline with per-line reveal */}
                <h2 className="mx-auto mt-6 max-w-3xl text-balance font-display text-5xl leading-[0.95] text-cream md:text-7xl">
                    {HEADLINE_LINES.map((line, i) => (
                        <span key={line} className="block overflow-hidden">
                            <motion.span
                                initial={reduce ? false : { y: '110%', opacity: 0, rotateX: -20 }}
                                whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 1, ease: EASE, delay: 0.2 + i * 0.12 }}
                                style={{ transformOrigin: 'bottom' }}
                                className="inline-block"
                            >
                                {i === 1 ? (
                                    <em className="font-display italic text-gold">{line}</em>
                                ) : (
                                    line
                                )}
                            </motion.span>
                        </span>
                    ))}
                </h2>

                {/* hairline accent under headline */}
                <motion.div
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
                    className="mx-auto mt-8 h-px w-24 origin-center bg-gold/60"
                />

                <motion.p
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
                    className="mx-auto mt-7 max-w-md text-cream-dim"
                >
                    From a quiet date to a private celebration — we&apos;ll set the room.
                </motion.p>

                <motion.div
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
                    className="mt-12 flex flex-wrap items-center justify-center gap-4"
                >
                    {/* primary CTA with magnetic ring + sweep + corner ticks */}
                    <Link
                        to="/reservation"
                        className="group relative inline-flex h-14 items-center gap-3 px-10 font-mono text-[12px] uppercase tracking-[0.32em] text-cream"
                    >
                        {/* solid background */}
                        <span
                            aria-hidden
                            className="absolute inset-0 -z-10 border border-gold bg-gold/10 transition-colors duration-500 group-hover:bg-gold/20"
                        />
                        {/* sweeping shine on hover */}
                        <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
                        >
                            <span className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-[400%] group-hover:opacity-100" />
                        </span>
                        {/* corner ticks grow on hover */}
                        <span
                            aria-hidden
                            className="pointer-events-none absolute -left-1 -top-1 h-3 w-3 border-l border-t border-gold transition-all duration-500 group-hover:h-4 group-hover:w-4"
                        />
                        <span
                            aria-hidden
                            className="pointer-events-none absolute -right-1 -top-1 h-3 w-3 border-r border-t border-gold transition-all duration-500 group-hover:h-4 group-hover:w-4"
                        />
                        <span
                            aria-hidden
                            className="pointer-events-none absolute -bottom-1 -left-1 h-3 w-3 border-b border-l border-gold transition-all duration-500 group-hover:h-4 group-hover:w-4"
                        />
                        <span
                            aria-hidden
                            className="pointer-events-none absolute -bottom-1 -right-1 h-3 w-3 border-b border-r border-gold transition-all duration-500 group-hover:h-4 group-hover:w-4"
                        />
                        {/* pulsing outer rings (two layers) */}
                        {!reduce && (
                            <>
                                <motion.span
                                    aria-hidden
                                    animate={{ opacity: [0, 0.55, 0], scale: [1, 1.12, 1.18] }}
                                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
                                    className="pointer-events-none absolute inset-0 -z-20 border border-gold"
                                />
                                <motion.span
                                    aria-hidden
                                    animate={{ opacity: [0, 0.4, 0], scale: [1, 1.2, 1.3] }}
                                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
                                    className="pointer-events-none absolute inset-0 -z-20 border border-gold/70"
                                />
                            </>
                        )}
                        Reserve a table
                        <ArrowUpRight
                            size={14}
                            className="transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:translate-x-1.5"
                        />
                    </Link>

                    <a
                        href={WA_LINK}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex h-14 items-center gap-2 px-7 font-mono text-[11px] uppercase tracking-[0.32em] text-cream-dim transition-colors hover:text-cream"
                    >
                        <MessageCircle
                            size={14}
                            className="transition-transform duration-500 group-hover:-translate-y-0.5"
                        />
                        <span className="relative">
                            Or chat on WhatsApp
                            <span
                                aria-hidden
                                className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full"
                            />
                        </span>
                    </a>
                </motion.div>

                {/* tiny tag below */}
                <motion.div
                    initial={reduce ? false : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 1, ease: EASE }}
                    className="mt-10 font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim/70"
                >
                    Confirmed within an hour · Walk-ins welcome
                </motion.div>
            </div>
        </section>
    );
}

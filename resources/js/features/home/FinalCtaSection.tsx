import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { DeerMark } from '@/components/deer/DeerMark';

export function FinalCtaSection() {
    return (
        <section className="relative isolate overflow-hidden py-32 md:py-48 border-t border-line/60">
            <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-[0.07]" aria-hidden>
                <DeerMark size={720} stroke="var(--color-gold)" strokeWidth={0.6} />
            </div>

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
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    className="mt-10 inline-block"
                >
                    <Link
                        to="/reservation"
                        className="group relative inline-flex h-14 items-center px-10 font-mono text-[12px] uppercase tracking-[0.32em] text-cream"
                    >
                        <span className="absolute inset-0 -z-10 border border-gold/70 bg-gold/10 transition-all duration-500 group-hover:bg-gold/20 group-hover:glow-gold" />
                        Reserve a table
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

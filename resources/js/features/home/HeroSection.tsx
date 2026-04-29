import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { DeerMark } from '@/components/deer/DeerMark';
import { lineReveal } from '@/lib/animations';

const HERO_HEADLINE = [
    'Where Bogor',
    'meets coffee,',
    'kitchen & warm',
    'moments.',
];

export function HeroSection() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const visualY = useTransform(scrollYProgress, [0, 1], [0, 120]);
    const visualScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

    const reduce = useReducedMotion();
    const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

    useEffect(() => {
        if (reduce) return;
        const onMove = (e: MouseEvent) => {
            setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
        };
        window.addEventListener('pointermove', onMove);
        return () => window.removeEventListener('pointermove', onMove);
    }, [reduce]);

    return (
        <section
            ref={ref}
            className="relative isolate overflow-hidden"
            style={{ minHeight: 'min(100svh, 920px)' }}
        >
            {/* spotlight background */}
            <div className="absolute inset-0 -z-10 bg-ink">
                {/* real-photo backdrop, heavily darkened so headline copy stays legible */}
                <motion.img
                    src="/images/interior/interior-dark-deer-wall.jpg"
                    alt=""
                    aria-hidden
                    style={reduce ? undefined : { y: visualY, scale: visualScale }}
                    className="absolute inset-0 h-full w-full object-cover opacity-[0.42]"
                    loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/65 to-ink" />
                <motion.div
                    aria-hidden
                    className="absolute inset-0 mix-blend-screen"
                    animate={
                        reduce
                            ? undefined
                            : { background: `radial-gradient(800px 800px at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(201, 162, 91, 0.22), transparent 60%)` }
                    }
                    transition={{ type: 'tween', duration: 0.6, ease: 'linear' }}
                />
                {/* coffee steam wash */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
                {/* hairline grid */}
                <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:88px_88px]" />
            </div>

            {/* decorative deer watermark */}
            <motion.div
                style={reduce ? undefined : { y: visualY, scale: visualScale }}
                className="pointer-events-none absolute right-[-6%] top-[-2%] z-0 hidden md:block"
                aria-hidden
            >
                <DeerMark size={620} stroke="rgba(201,162,91,0.12)" strokeWidth={0.8} />
            </motion.div>

            <div className="container-editorial relative z-10 flex min-h-[88svh] flex-col justify-end pt-24 pb-16 md:pt-36 md:pb-24">
                <div className="mb-10 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                    <span aria-hidden className="h-px w-12 bg-gold/60" />
                    Bogor · Est. for warm tables
                </div>

                <h1 className="max-w-[18ch] font-display text-[clamp(3rem,9vw,8.4rem)] leading-[0.92] text-cream">
                    {HERO_HEADLINE.map((line, i) => (
                        <span key={i} className="block overflow-hidden">
                            <motion.span
                                className="inline-block"
                                variants={lineReveal}
                                initial="hidden"
                                animate="visible"
                                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.12 }}
                            >
                                {line}
                            </motion.span>
                        </span>
                    ))}
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-8 max-w-md text-balance text-base leading-relaxed text-cream-dim sm:text-lg"
                >
                    Signature dishes, crafted drinks, and moments worth staying for.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 1.05 }}
                    className="mt-12 flex flex-wrap items-center gap-3"
                >
                    <Link
                        to="/menu"
                        className="group inline-flex h-12 items-center gap-3 border border-gold/70 bg-gold/10 px-7 font-mono text-[11px] uppercase tracking-[0.32em] text-cream transition-all hover:bg-gold/20 hover:border-gold"
                    >
                        Explore Menu
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        to="/reservation"
                        className="inline-flex h-12 items-center px-7 font-mono text-[11px] uppercase tracking-[0.32em] text-cream-dim hover:text-cream"
                    >
                        Reserve a table
                    </Link>
                    <a
                        href="https://maps.google.com/?q=Raindear+Coffee+Bogor"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-12 items-center gap-2 px-3 font-mono text-[11px] uppercase tracking-[0.32em] text-cream-dim hover:text-cream"
                    >
                        <MapPin size={14} /> Get Direction
                    </a>
                </motion.div>
            </div>

            {/* bottom strip */}
            <div className="absolute inset-x-0 bottom-0 z-10 border-t border-line/60">
                <div className="container-editorial flex flex-wrap items-center justify-between gap-4 py-4 font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">
                    <span>Live music · Fri &amp; Sat</span>
                    <span className="hidden md:inline">Family · Meeting · Celebration</span>
                    <span>Open daily · 09:00 — late</span>
                </div>
            </div>
        </section>
    );
}

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const HERO_HEADLINE = [
    ['Where', 'Bogor'],
    ['meets', 'coffee,'],
    ['kitchen', '&', 'warm'],
    ['moments.'],
];

export function HeroSection() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const visualY = useTransform(scrollYProgress, [0, 1], [0, 140]);
    const visualScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.42, 0.18]);
    const headlineY = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const headlineOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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

    const steamParticles = useMemo(
        () =>
            Array.from({ length: 7 }).map((_, i) => ({
                left: 8 + i * 13 + (i % 2 === 0 ? 4 : -2),
                delay: i * 0.6,
                duration: 9 + (i % 3) * 2,
                size: 240 + (i % 4) * 60,
            })),
        [],
    );

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
                    style={reduce ? undefined : { y: visualY, scale: visualScale, opacity: overlayOpacity }}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/65 to-ink" />
                <motion.div
                    aria-hidden
                    className="absolute inset-0 mix-blend-screen"
                    animate={
                        reduce
                            ? undefined
                            : {
                                  background: `radial-gradient(900px 900px at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(201, 162, 91, 0.26), transparent 60%)`,
                              }
                    }
                    transition={{ type: 'tween', duration: 0.7, ease: 'linear' }}
                />

                {/* coffee steam — soft floating blobs */}
                {!reduce && (
                    <div className="absolute inset-0 overflow-hidden">
                        {steamParticles.map((p, i) => (
                            <motion.span
                                key={i}
                                aria-hidden
                                className="absolute rounded-full bg-gold/[0.06] blur-3xl"
                                style={{
                                    left: `${p.left}%`,
                                    bottom: '-10%',
                                    width: p.size,
                                    height: p.size,
                                }}
                                animate={{
                                    y: [-40, -700],
                                    opacity: [0, 0.7, 0],
                                    x: [0, 30, -10, 20],
                                }}
                                transition={{
                                    duration: p.duration,
                                    repeat: Infinity,
                                    delay: p.delay,
                                    ease: 'linear',
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* coffee steam wash */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
            </div>

            {/* decorative deer watermark — actual brand logo */}
            <motion.div
                style={reduce ? undefined : { y: visualY, scale: visualScale }}
                className="pointer-events-none absolute right-[-4%] top-[6%] z-0 hidden h-[78%] w-[42%] md:block"
                aria-hidden
            >
                <motion.img
                    src="/images/brand/raindear-deer-gold.png"
                    alt=""
                    className="h-full w-full object-contain opacity-[0.18] mix-blend-screen"
                    initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 0.18, scale: 1 }}
                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                />
            </motion.div>

            <motion.div
                style={reduce ? undefined : { y: headlineY, opacity: headlineOpacity }}
                className="container-editorial relative z-10 flex min-h-[88svh] flex-col justify-end pt-24 pb-16 md:pt-36 md:pb-24"
            >
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    className="mb-10 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-gold"
                >
                    <motion.span
                        aria-hidden
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                        className="block h-px w-12 origin-left bg-gold/60"
                    />
                    Bogor · Est. for warm tables
                </motion.div>

                <h1 className="max-w-[18ch] font-display text-[clamp(3rem,9vw,8.4rem)] leading-[0.92] text-cream">
                    {HERO_HEADLINE.map((line, lineIdx) => (
                        <span key={lineIdx} className="block overflow-hidden">
                            <span className="inline-block">
                                {line.map((word, wordIdx) => {
                                    const totalIdx = lineIdx * 4 + wordIdx;
                                    return (
                                        <motion.span
                                            key={`${lineIdx}-${wordIdx}`}
                                            initial={{ y: '110%', opacity: 0, rotateX: -25 }}
                                            animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                            transition={{
                                                duration: 0.95,
                                                ease: [0.22, 1, 0.36, 1],
                                                delay: 0.18 + totalIdx * 0.07,
                                            }}
                                            style={{ transformOrigin: 'bottom' }}
                                            className="inline-block pr-[0.22em]"
                                        >
                                            {word === '&' ? (
                                                <em className="font-display italic text-gold">{word}</em>
                                            ) : (
                                                word
                                            )}
                                        </motion.span>
                                    );
                                })}
                            </span>
                        </span>
                    ))}
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-8 max-w-md text-balance text-base leading-relaxed text-cream-dim sm:text-lg"
                >
                    Signature dishes, crafted drinks, and moments worth staying for.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 1.15 }}
                    className="mt-12 flex flex-wrap items-center gap-3"
                >
                    <Link
                        to="/menu"
                        className="group relative inline-flex h-12 items-center gap-3 overflow-hidden border border-gold/70 bg-gold/10 px-7 font-mono text-[11px] uppercase tracking-[0.32em] text-cream transition-all hover:border-gold"
                    >
                        <span aria-hidden className="absolute inset-0 -z-10 translate-y-full bg-gold/25 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                        Explore Menu
                        <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1.5" />
                    </Link>
                    <Link
                        to="/reservation"
                        className="group inline-flex h-12 items-center px-7 font-mono text-[11px] uppercase tracking-[0.32em] text-cream-dim transition-colors hover:text-cream"
                    >
                        <span className="relative">
                            Reserve a table
                            <span aria-hidden className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
                        </span>
                    </Link>
                    <a
                        href="https://maps.google.com/?q=Raindear+Coffee+Bogor"
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex h-12 items-center gap-2 px-3 font-mono text-[11px] uppercase tracking-[0.32em] text-cream-dim transition-colors hover:text-cream"
                    >
                        <MapPin size={14} className="transition-transform group-hover:-translate-y-0.5" />
                        Get Direction
                    </a>
                </motion.div>
            </motion.div>

            {/* bottom strip */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 bottom-0 z-10 border-t border-line/60"
            >
                <div className="container-editorial flex flex-wrap items-center justify-between gap-4 py-4 font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">
                    <span className="flex items-center gap-2">
                        <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                        Live music · Fri &amp; Sat
                    </span>
                    <span className="hidden md:inline">Family · Meeting · Celebration</span>
                    <span>Open daily · 09:00 — late</span>
                </div>
            </motion.div>

            {/* scroll cue */}
            {!reduce && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.6 }}
                    className="pointer-events-none absolute bottom-20 right-6 z-10 hidden md:flex flex-col items-center gap-3"
                    aria-hidden
                >
                    <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-cream-dim [writing-mode:vertical-rl]">
                        Scroll
                    </span>
                    <motion.span
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        className="block h-10 w-px bg-gradient-to-b from-gold/80 to-transparent"
                    />
                </motion.div>
            )}
        </section>
    );
}

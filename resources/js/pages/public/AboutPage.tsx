import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Coffee, Heart, MapPin, MessageCircle, Sparkles, Utensils } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { BrandLockup, BrandMark } from '@/components/deer/BrandMark';
import { useDocumentTitle } from '@/lib/seo';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

const HERO_PHOTO = '/images/interior/interior-arches.jpg';
const STORY_PHOTO_1 = '/images/interior/interior-coffee-belt.jpg';
const STORY_PHOTO_2 = '/images/interior/interior-blue-booth.jpg';
const COFFEE_PHOTO = '/images/menu/cappuccino.jpg';
const KITCHEN_PHOTO = '/images/menu/wagyu-steak.jpg';
const QUOTE_BG = '/images/interior/interior-dark-deer-wall.jpg';

const VALUES = [
    {
        title: 'Best service',
        body: 'A team that remembers the small things — your seat, your usual, the celebration coming up.',
        icon: Heart,
    },
    {
        title: 'Halal & honest',
        body: 'Halal-certified ingredients across the kitchen and the bar. No shortcuts on what goes in.',
        icon: Sparkles,
    },
    {
        title: 'Slow craft',
        body: 'A menu that updates with the seasons. Pasta hand-folded, coffee pulled by people who care.',
        icon: Utensils,
    },
    {
        title: 'Warm rooms',
        body: 'Soft light, quiet music, tables to linger at. We design for staying, not turning over.',
        icon: Coffee,
    },
];

const TIMELINE = [
    {
        year: '2019',
        title: 'A coffee table for friends',
        body: 'Started as a small home coffee bar in Bogor — eight stools, one La Marzocco, no menu.',
    },
    {
        year: '2020',
        title: 'The kitchen wakes up',
        body: 'A chef joins. The first nasi goreng hitam. The first ravioli folded by hand.',
    },
    {
        year: '2022',
        title: 'A house, not a shop',
        body: 'Move into the brick-and-arches space on Jl. Pajajaran. Live music on Saturdays.',
    },
    {
        year: '2024',
        title: 'Family table',
        body: 'Family room, pet-friendly garden, weekly events. The room becomes the brand.',
    },
];

const NUMBERS = [
    { value: 6, suffix: '+', label: 'Years brewing' },
    { value: 19, suffix: '', label: 'Dishes on rotation' },
    { value: 320, suffix: '/day', label: 'Cups pulled' },
    { value: 4.7, suffix: '★', label: 'Google rating', decimal: 1 },
];

export default function AboutPage() {
    useDocumentTitle('About — Raindear Coffee & Kitchen');
    const reduce = useReducedMotion();

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroPhotoY = useTransform(heroProgress, [0, 1], [0, 120]);
    const heroPhotoScale = useTransform(heroProgress, [0, 1], [1, 1.08]);
    const heroTextY = useTransform(heroProgress, [0, 1], [0, -40]);

    // Mouse-follow gold spotlight in hero
    const [mouse, setMouse] = useState({ x: 50, y: 30 });

    return (
        <div className="relative">
            {/* HERO */}
            <section
                ref={heroRef}
                className="relative overflow-hidden border-b border-line/60"
                onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    setMouse({
                        x: ((e.clientX - r.left) / r.width) * 100,
                        y: ((e.clientY - r.top) / r.height) * 100,
                    });
                }}
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 transition-[background] duration-300"
                    style={{
                        background: `radial-gradient(620px 360px at ${mouse.x}% ${mouse.y}%, rgba(201,162,91,0.16), transparent 70%)`,
                    }}
                />
                {/* Watermark deer behind */}
                <motion.div
                    aria-hidden
                    initial={reduce ? false : { opacity: 0, scale: 0.92, rotate: -6 }}
                    animate={{ opacity: 0.05, scale: 1, rotate: 0 }}
                    transition={{ duration: 1.6, ease: EASE }}
                    className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 md:right-0"
                >
                    <BrandMark size={520} tone="gold" />
                </motion.div>

                <div className="container-editorial relative grid items-center gap-12 pt-24 pb-20 md:grid-cols-12 md:pt-36 md:pb-32">
                    <motion.div style={reduce ? undefined : { y: heroTextY }} className="md:col-span-7">
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold"
                        >
                            About · Est. 2019 · Bogor
                        </motion.div>

                        <h1 className="mt-6 max-w-4xl font-display text-6xl leading-[0.92] text-cream md:text-[8rem]">
                            {['A warm', 'corner in', 'Bogor.'].map((line, lineIdx) => (
                                <span key={line} className="block overflow-hidden">
                                    <motion.span
                                        initial={reduce ? false : { y: '110%', opacity: 0, rotateX: -22 }}
                                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                        transition={{ duration: 0.95, ease: EASE, delay: 0.15 + lineIdx * 0.08 }}
                                        style={{ transformOrigin: 'bottom' }}
                                        className="inline-block"
                                    >
                                        {lineIdx === 2 ? (
                                            <em className="font-display italic text-gold">{line}</em>
                                        ) : (
                                            line
                                        )}
                                    </motion.span>
                                </span>
                            ))}
                        </h1>

                        <motion.p
                            initial={reduce ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                            className="mt-10 max-w-xl text-lg leading-relaxed text-cream-dim"
                        >
                            Raindear started as a small coffee table for friends. Six years on, it's
                            a kitchen, a stage, and a place to celebrate quietly — under arches,
                            behind a brick wall, beside a deer.
                        </motion.p>

                        <motion.div
                            initial={reduce ? false : { scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
                            className="mt-10 h-px w-32 origin-left bg-gold/60"
                        />
                    </motion.div>

                    {/* Hero photo with parallax + ken-burns */}
                    <div className="relative md:col-span-5">
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
                            className="relative aspect-[4/5] w-full overflow-hidden border border-line/60"
                        >
                            <motion.div
                                style={reduce ? undefined : { y: heroPhotoY, scale: heroPhotoScale }}
                                className="absolute inset-0"
                            >
                                <ImageWithFallback
                                    src={HERO_PHOTO}
                                    alt="Raindear interior — brick arches"
                                    className="h-full w-full"
                                />
                            </motion.div>
                            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />

                            {/* Corner ticks */}
                            <span aria-hidden className="absolute left-3 top-3 h-4 w-4 border-l border-t border-gold/70" />
                            <span aria-hidden className="absolute right-3 top-3 h-4 w-4 border-r border-t border-gold/70" />
                            <span aria-hidden className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-gold/70" />
                            <span aria-hidden className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-gold/70" />

                            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.3em] text-cream/90">
                                <span className="inline-flex items-center gap-1.5 bg-ink/60 px-2 py-1 backdrop-blur-sm">
                                    <MapPin size={10} className="text-gold" />
                                    Jl. Pajajaran
                                </span>
                                <span className="bg-ink/60 px-2 py-1 backdrop-blur-sm text-gold">Coffee · Kitchen</span>
                            </div>
                        </motion.div>

                        {/* Floating accent card */}
                        <motion.div
                            initial={reduce ? false : { opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
                            className="absolute -bottom-6 -left-6 hidden border border-gold/50 bg-ink-2/90 p-4 backdrop-blur-md md:block"
                        >
                            <div className="font-mono text-[9px] uppercase tracking-[0.32em] text-gold">
                                Established
                            </div>
                            <div className="mt-1 font-display text-3xl text-cream">2019</div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll cue */}
                <motion.div
                    aria-hidden
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
                >
                    <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-cream-dim">Scroll</span>
                    <motion.span
                        animate={reduce ? undefined : { y: [0, 6, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className="block h-6 w-px bg-gradient-to-b from-gold/80 to-transparent"
                    />
                </motion.div>
            </section>

            {/* MANIFESTO */}
            <section className="container-editorial border-b border-line/60 py-24 md:py-32">
                <div className="grid gap-12 md:grid-cols-12">
                    <div className="md:col-span-3">
                        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">Manifesto</div>
                        <motion.div
                            initial={reduce ? false : { scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.9, ease: EASE }}
                            className="mt-4 h-px w-16 origin-left bg-gold/70"
                        />
                    </div>
                    <div className="md:col-span-9">
                        <ManifestoLines
                            lines={[
                                'We believe a café should slow time, not sell it.',
                                'That a great espresso starts at the farm,',
                                'and that nasi goreng deserves the same care as ravioli.',
                                'We believe in service that remembers names,',
                                'and rooms designed for staying.',
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* NUMBERS */}
            <section className="border-b border-line/60 bg-ink-2/40">
                <div className="container-editorial py-20 md:py-24">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
                        {NUMBERS.map((n, i) => (
                            <NumberStat key={n.label} {...n} delay={i * 0.08} />
                        ))}
                    </div>
                </div>
            </section>

            {/* TIMELINE */}
            <section className="container-editorial border-b border-line/60 py-24 md:py-32">
                <div className="mb-16 flex items-end justify-between gap-6">
                    <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">Our journey</div>
                        <h2 className="mt-5 font-display text-4xl text-cream md:text-6xl">
                            From a coffee table
                            <br />
                            to a <em className="italic text-gold">house.</em>
                        </h2>
                    </div>
                </div>

                <Timeline items={TIMELINE} />
            </section>

            {/* STORY SPLIT */}
            <section className="container-editorial border-b border-line/60 py-24 md:py-32">
                <div className="grid gap-12 md:grid-cols-12 md:gap-16">
                    <div className="order-2 md:order-1 md:col-span-5">
                        <ParallaxImage src={STORY_PHOTO_1} alt="Coffee belt" direction="up" />
                    </div>
                    <div className="order-1 md:order-2 md:col-span-7 md:pt-12">
                        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">The room</div>
                        <h2 className="mt-5 font-display text-4xl text-cream md:text-5xl">
                            A house with arches,
                            <br />
                            warm <em className="italic text-gold">deer</em> on the wall.
                        </h2>
                        <div className="mt-8 space-y-5 text-base leading-relaxed text-cream-dim md:text-lg">
                            <p>
                                Brick arches frame the room. A long coffee belt anchors one side; banquettes,
                                the other. A deer mural watches from the back wall. Live music on Saturdays,
                                pour-overs on Sundays.
                            </p>
                            <p>
                                We picked every chair, every lamp, every plate. Most of them came back with us
                                from small studios in Bandung and Yogya. Nothing here is rented mood.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-20 grid gap-12 md:grid-cols-12 md:gap-16">
                    <div className="md:col-span-7 md:pt-12">
                        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">The people</div>
                        <h2 className="mt-5 font-display text-4xl text-cream md:text-5xl">
                            A team that
                            <br />
                            <em className="italic text-gold">remembers</em> you.
                        </h2>
                        <div className="mt-8 space-y-5 text-base leading-relaxed text-cream-dim md:text-lg">
                            <p>
                                Twelve baristas. Six cooks. One pastry chef who hand-folds the croissants
                                at six every morning. Half the kitchen has been here since year one.
                            </p>
                            <p>
                                We train slow. We hire slower. The reason your usual order shows up before
                                you finish ordering it isn't a system — it's a person.
                            </p>
                        </div>
                    </div>
                    <div className="md:col-span-5">
                        <ParallaxImage src={STORY_PHOTO_2} alt="Blue banquettes" direction="down" />
                    </div>
                </div>
            </section>

            {/* VALUES */}
            <section className="container-editorial border-b border-line/60 py-24 md:py-32">
                <div className="mb-14 grid items-end gap-8 md:grid-cols-12">
                    <div className="md:col-span-5">
                        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">Values</div>
                        <h2 className="mt-5 font-display text-4xl text-cream md:text-6xl">
                            Four things,
                            <br />
                            <em className="italic text-gold">always.</em>
                        </h2>
                    </div>
                    <p className="md:col-span-6 md:col-start-7 text-cream-dim">
                        We don't have a long brand book. These are the four things that decide
                        every plate, every pour, every renovation.
                    </p>
                </div>
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {VALUES.map((v, i) => (
                        <ValueCard key={v.title} value={v} index={i} />
                    ))}
                </ul>
            </section>

            {/* COFFEE + KITCHEN DUAL PANEL */}
            <section className="border-b border-line/60">
                <div className="grid md:grid-cols-2">
                    <DualPanel
                        eyebrow="01 · Coffee"
                        title="Beans we trust."
                        body="Single-origin from West Java highlands and Aceh Gayo. Roasted in small batches, dialed in weekly."
                        href="/menu?cat=coffee"
                        cta="See the coffee"
                        image={COFFEE_PHOTO}
                        align="left"
                    />
                    <DualPanel
                        eyebrow="02 · Kitchen"
                        title="A plate, considered."
                        body="From squid-ink fried rice to truffle ravioli. Big portions, honest prices, halal across the menu."
                        href="/menu?cat=signature"
                        cta="See the kitchen"
                        image={KITCHEN_PHOTO}
                        align="right"
                    />
                </div>
            </section>

            {/* QUOTE WITH WATERMARK */}
            <section className="relative overflow-hidden border-b border-line/60">
                <div className="absolute inset-0">
                    <ImageWithFallback src={QUOTE_BG} alt="" className="h-full w-full" />
                    <div className="absolute inset-0 bg-ink/85" />
                </div>
                <motion.div
                    aria-hidden
                    animate={reduce ? undefined : { rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 110, ease: 'linear' }}
                    className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2 opacity-[0.05]"
                >
                    <BrandMark size={680} tone="gold" />
                </motion.div>

                <div className="container-editorial relative py-32 md:py-40">
                    <motion.blockquote
                        initial={reduce ? false : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 1, ease: EASE }}
                        className="mx-auto max-w-4xl text-center font-display text-3xl leading-[1.15] text-cream md:text-6xl"
                    >
                        <span className="block text-gold">"</span>
                        Coffee, comfort, and warm tables in the heart of Bogor —
                        <em className="italic text-gold-soft"> moments worth staying for.</em>
                        <span className="mt-4 block text-gold">"</span>
                    </motion.blockquote>
                    <motion.div
                        initial={reduce ? false : { opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim"
                    >
                        — A regular, May 2024
                    </motion.div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="relative overflow-hidden border-b border-line/60 bg-ink-2/40">
                <div className="container-editorial relative py-24 md:py-32">
                    <div className="grid items-center gap-12 md:grid-cols-12">
                        <div className="md:col-span-7">
                            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                                Visit us
                            </div>
                            <h2 className="mt-5 font-display text-4xl text-cream md:text-7xl">
                                Pick a quiet hour.
                                <br />
                                We'll keep <em className="italic text-gold">a seat.</em>
                            </h2>
                            <p className="mt-8 max-w-xl text-cream-dim">
                                Reservations welcome but not required. The window seats fill first;
                                Saturdays book out by Thursday.
                            </p>

                            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                                <a
                                    href="/reservation"
                                    className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden border border-gold/70 bg-gold/10 px-7 font-mono text-[11px] uppercase tracking-[0.32em] text-cream transition-colors hover:bg-gold/20"
                                >
                                    <span className="relative z-10 inline-flex items-center gap-2">
                                        Reserve a table
                                        <ArrowUpRight
                                            size={14}
                                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        />
                                    </span>
                                    <span
                                        aria-hidden
                                        className="pointer-events-none absolute inset-0 -translate-y-full bg-gradient-to-b from-gold/30 to-transparent transition-transform duration-500 group-hover:translate-y-0"
                                    />
                                </a>
                                <a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group inline-flex h-14 items-center justify-center gap-2 border border-line/70 px-7 font-mono text-[11px] uppercase tracking-[0.32em] text-cream-dim transition-colors hover:border-cream/40 hover:text-cream"
                                >
                                    <MessageCircle size={14} />
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>
                        <div className="md:col-span-5">
                            <motion.div
                                initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 1, ease: EASE }}
                                className="relative mx-auto flex aspect-square max-w-sm items-center justify-center"
                            >
                                {/* Pulsing ring */}
                                <motion.span
                                    aria-hidden
                                    animate={
                                        reduce
                                            ? undefined
                                            : { scale: [1, 1.12, 1], opacity: [0.5, 0, 0.5] }
                                    }
                                    transition={{ repeat: Infinity, duration: 2.6, ease: 'easeOut' }}
                                    className="absolute inset-0 rounded-full border border-gold/40"
                                />
                                <motion.span
                                    aria-hidden
                                    animate={
                                        reduce
                                            ? undefined
                                            : { scale: [1, 1.22, 1], opacity: [0.3, 0, 0.3] }
                                    }
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2.6,
                                        ease: 'easeOut',
                                        delay: 0.6,
                                    }}
                                    className="absolute inset-0 rounded-full border border-gold/20"
                                />
                                <BrandLockup height={170} tone="gold" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ----------------------------- subcomponents ----------------------------- */

function ManifestoLines({ lines }: { lines: string[] }) {
    const reduce = useReducedMotion();
    return (
        <div className="space-y-2 font-display text-3xl leading-[1.2] text-cream md:text-5xl">
            {lines.map((l, i) => (
                <span key={l} className="block overflow-hidden">
                    <motion.span
                        initial={reduce ? false : { y: '110%', opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.06 * i }}
                        className="inline-block"
                    >
                        {i === lines.length - 1 ? (
                            <span>
                                {l.replace(/staying\.$/, '')}
                                <em className="italic text-gold">staying.</em>
                            </span>
                        ) : (
                            l
                        )}
                    </motion.span>
                </span>
            ))}
        </div>
    );
}

function NumberStat({
    value,
    suffix,
    label,
    delay,
    decimal,
}: {
    value: number;
    suffix: string;
    label: string;
    delay: number;
    decimal?: number;
}) {
    const reduce = useReducedMotion();
    const [displayed, setDisplayed] = useState(reduce ? value : 0);
    const ref = useRef<HTMLDivElement>(null);
    const startedRef = useRef(false);

    useEffect(() => {
        if (reduce) {
            setDisplayed(value);
            return;
        }
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting && !startedRef.current) {
                        startedRef.current = true;
                        const start = performance.now() + delay * 1000;
                        const dur = 1400;
                        const ease = (t: number) => 1 - Math.pow(1 - t, 3);
                        let raf = 0;
                        const tick = (now: number) => {
                            const t = Math.max(0, Math.min(1, (now - start) / dur));
                            setDisplayed(value * ease(t));
                            if (t < 1) raf = requestAnimationFrame(tick);
                        };
                        raf = requestAnimationFrame(tick);
                        return () => cancelAnimationFrame(raf);
                    }
                });
            },
            { threshold: 0.3 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [value, delay, reduce]);

    return (
        <motion.div
            ref={ref}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: EASE, delay }}
            className="relative"
        >
            <div className="font-display text-5xl text-gold md:text-7xl">
                {decimal ? displayed.toFixed(decimal) : Math.round(displayed)}
                <span className="text-3xl text-cream md:text-4xl">{suffix}</span>
            </div>
            <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.32em] text-cream-dim">
                {label}
            </div>
            <span aria-hidden className="mt-4 block h-px w-10 bg-gold/40" />
        </motion.div>
    );
}

function Timeline({ items }: { items: typeof TIMELINE }) {
    const reduce = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 80%', 'end 30%'],
    });
    const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

    return (
        <div ref={ref} className="relative">
            {/* Center connector line */}
            <span
                aria-hidden
                className="pointer-events-none absolute left-3 top-0 bottom-0 w-px bg-line md:left-1/2 md:-translate-x-px"
            />
            <motion.span
                aria-hidden
                style={{ scaleY: reduce ? 1 : lineScale }}
                className="pointer-events-none absolute left-3 top-0 h-full w-px origin-top bg-gold md:left-1/2 md:-translate-x-px"
            />

            <ol className="space-y-14 md:space-y-20">
                {items.map((m, i) => (
                    <TimelineRow key={m.year} item={m} index={i} />
                ))}
            </ol>
        </div>
    );
}

function TimelineRow({ item, index }: { item: (typeof TIMELINE)[number]; index: number }) {
    const reduce = useReducedMotion();
    const isRight = index % 2 === 1;
    return (
        <li className="relative grid items-center gap-6 md:grid-cols-2">
            {/* Dot */}
            <motion.span
                aria-hidden
                initial={reduce ? false : { scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: '-40%' }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                className="absolute left-3 top-2 z-10 -translate-x-1/2 md:left-1/2"
            >
                <span className="block h-2.5 w-2.5 rounded-full bg-gold ring-4 ring-ink" />
            </motion.span>

            <motion.div
                initial={reduce ? false : { opacity: 0, x: isRight ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: EASE }}
                className={cn(
                    'pl-10 md:pl-0',
                    isRight ? 'md:order-2 md:pl-12' : 'md:pr-12 md:text-right',
                )}
            >
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                    {item.year}
                </div>
                <h3 className="mt-3 font-display text-2xl text-cream md:text-4xl">{item.title}</h3>
                <p className="mt-3 max-w-md text-cream-dim md:max-w-none">
                    {item.body}
                </p>
            </motion.div>
            {/* Empty cell on the other side for alignment */}
            <div className={cn('hidden md:block', isRight ? 'md:order-1' : '')} aria-hidden />
        </li>
    );
}

function ParallaxImage({
    src,
    alt,
    direction,
}: {
    src: string;
    alt: string;
    direction: 'up' | 'down';
}) {
    const reduce = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(
        scrollYProgress,
        [0, 1],
        direction === 'up' ? [40, -40] : [-40, 40],
    );
    return (
        <div ref={ref} className="relative aspect-[4/5] w-full overflow-hidden border border-line/60">
            <motion.div
                style={reduce ? undefined : { y, scale: 1.08 }}
                className="absolute inset-0"
            >
                <ImageWithFallback src={src} alt={alt} className="h-full w-full" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
            <span aria-hidden className="absolute left-3 top-3 h-3 w-3 border-l border-t border-gold/60" />
            <span aria-hidden className="absolute right-3 bottom-3 h-3 w-3 border-r border-b border-gold/60" />
        </div>
    );
}

function ValueCard({
    value,
    index,
}: {
    value: (typeof VALUES)[number];
    index: number;
}) {
    const reduce = useReducedMotion();
    const Icon = value.icon;
    return (
        <motion.li
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE, delay: index * 0.06 }}
            className="group relative border border-line/60 bg-ink-2/40 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold/60 hover:bg-ink-2/70"
        >
            {/* Corner ticks */}
            <span aria-hidden className="absolute left-0 top-0 h-3 w-3 border-l border-t border-gold/0 transition-all duration-500 group-hover:h-5 group-hover:w-5 group-hover:border-gold" />
            <span aria-hidden className="absolute right-0 top-0 h-3 w-3 border-r border-t border-gold/0 transition-all duration-500 group-hover:h-5 group-hover:w-5 group-hover:border-gold" />
            <span aria-hidden className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-gold/0 transition-all duration-500 group-hover:h-5 group-hover:w-5 group-hover:border-gold" />
            <span aria-hidden className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-gold/0 transition-all duration-500 group-hover:h-5 group-hover:w-5 group-hover:border-gold" />

            <div className="flex h-12 w-12 items-center justify-center border border-gold/40 text-gold transition-transform duration-700 group-hover:rotate-[8deg] group-hover:scale-110">
                <Icon size={18} />
            </div>
            <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                {String(index + 1).padStart(2, '0')}
            </div>
            <h3 className="mt-3 font-display text-2xl text-cream">{value.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream-dim">{value.body}</p>

            <span aria-hidden className="mt-6 block h-px w-6 bg-gold/40 transition-all duration-500 group-hover:w-full group-hover:bg-gold/70" />
        </motion.li>
    );
}

function DualPanel({
    eyebrow,
    title,
    body,
    href,
    cta,
    image,
    align,
}: {
    eyebrow: string;
    title: string;
    body: string;
    href: string;
    cta: string;
    image: string;
    align: 'left' | 'right';
}) {
    const reduce = useReducedMotion();
    return (
        <motion.a
            href={href}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: EASE }}
            className={cn(
                'group relative flex aspect-square flex-col justify-end overflow-hidden p-10 md:aspect-[4/5] md:p-14',
                align === 'left' ? 'md:border-r md:border-line/60' : '',
            )}
        >
            <div className="absolute inset-0">
                <motion.div
                    whileHover={reduce ? undefined : { scale: 1.06 }}
                    transition={{ duration: 1.2, ease: EASE }}
                    className="absolute inset-0"
                >
                    <ImageWithFallback src={image} alt={title} className="h-full w-full" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
                <div className="absolute inset-0 bg-ink/40 transition-colors duration-500 group-hover:bg-ink/20" />
            </div>

            <div className="relative">
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                    {eyebrow}
                </div>
                <h3 className="mt-4 max-w-md font-display text-4xl leading-tight text-cream md:text-6xl">
                    {title.split('.')[0]}
                    <em className="italic text-gold">.</em>
                </h3>
                <p className="mt-4 max-w-md text-cream-dim">{body}</p>
                <span className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.32em] text-cream transition-colors group-hover:text-gold-soft">
                    {cta}
                    <ArrowUpRight
                        size={14}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                </span>
                <span aria-hidden className="mt-4 block h-px w-8 bg-gold/40 transition-all duration-500 group-hover:w-32 group-hover:bg-gold/70" />
            </div>
        </motion.a>
    );
}

import { motion, useReducedMotion } from 'framer-motion';
import {
    ArrowUpRight,
    Clock,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    MessageCircle,
    Music2,
    Phone,
    Send,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { BrandMark } from '@/components/deer/BrandMark';
import { cn } from '@/lib/utils';

const PHONE = '+62 821-1178-9089';
const PHONE_TEL = '+6282111789089';
const WA = '6282111789089';
const EMAIL = 'mkt.raindear@gmail.com';
const ADDRESS_LINE1 = 'Jl. Bina Marga No. 7';
const ADDRESS_LINE2 = 'Baranangsiang, Bogor Timur 16143';

const EASE = [0.22, 1, 0.36, 1] as const;

const NAV_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/about', label: 'About' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/reservation', label: 'Reservation' },
    { to: '/contact', label: 'Contact' },
] as const;

const HOURS = [
    { day: 'Mon — Thu', hours: '09:00 — 23:00' },
    { day: 'Fri — Sat', hours: '09:00 — 24:00' },
    { day: 'Sunday', hours: '09:00 — 23:00' },
];

const SOCIAL = [
    {
        href: 'https://instagram.com/raindearcoffee',
        Icon: Instagram,
        label: 'Instagram',
    },
    {
        href: 'https://facebook.com/raindearcoffee',
        Icon: Facebook,
        label: 'Facebook',
    },
    {
        href: 'https://tiktok.com/@raindearcoffee',
        Icon: Music2,
        label: 'TikTok',
    },
    {
        href: `https://wa.me/${WA}`,
        Icon: MessageCircle,
        label: 'WhatsApp',
    },
];

const MARQUEE_PHRASE = ['Coffee', 'Kitchen', 'Bogor', 'Est. for warm tables', 'Reservations open'];

export function Footer() {
    const reduce = useReducedMotion();

    const openStatus = useMemo(() => {
        const now = new Date();
        const day = now.getDay();
        const cur = now.getHours() * 60 + now.getMinutes();
        const isLateClose = day === 5 || day === 6;
        const close = (isLateClose ? 24 : 23) * 60;
        const open = 9 * 60;
        const isOpen = cur >= open && cur < close;
        return { isOpen, closesAt: isLateClose ? '24:00' : '23:00' };
    }, []);

    return (
        <footer className="relative isolate mt-32 overflow-hidden bg-ink">
            {/* TOP MARQUEE STRIP */}
            <div className="relative overflow-hidden border-y border-line/60 bg-ink-2/40 py-5">
                <Marquee reduce={!!reduce} />
            </div>

            {/* DECORATIVE BG */}
            <div aria-hidden className="absolute inset-0 -z-10">
                <motion.div
                    className="absolute inset-0"
                    animate={
                        reduce
                            ? undefined
                            : {
                                  background: [
                                      'radial-gradient(700px 480px at 18% 100%, rgba(201,162,91,0.12), transparent 70%)',
                                      'radial-gradient(700px 480px at 82% 100%, rgba(201,162,91,0.12), transparent 70%)',
                                      'radial-gradient(700px 480px at 18% 100%, rgba(201,162,91,0.12), transparent 70%)',
                                  ],
                              }
                    }
                    transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                />
                {/* drifting hairline */}
                {!reduce && (
                    <motion.span
                        className="pointer-events-none absolute left-0 top-[42%] h-px w-full bg-gradient-to-r from-transparent via-gold/25 to-transparent"
                        animate={{ x: ['-25%', '15%', '-25%'] }}
                        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
                    />
                )}
                {/* deer watermark, very subtle, bottom-right */}
                <motion.img
                    src="/images/brand/raindear-deer-gold.png"
                    alt=""
                    aria-hidden
                    className="absolute -right-16 -bottom-16 h-[380px] w-[380px] object-contain opacity-[0.06] mix-blend-screen md:h-[520px] md:w-[520px]"
                    animate={reduce ? undefined : { y: [0, -6, 0], scale: [1, 1.02, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            {/* BIG WORDMARK */}
            <div className="container-editorial relative pt-20 pb-10 md:pt-28 md:pb-12">
                <motion.div
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="flex items-center gap-5"
                >
                    <BrandMark size={56} tone="gold" />
                    <span className="font-display text-[clamp(3rem,9vw,7.5rem)] leading-none text-cream">
                        Raindear
                    </span>
                </motion.div>
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: EASE, delay: 0.2 }}
                    className="mt-6 h-px w-full origin-left bg-line/60"
                />
            </div>

            {/* MAIN GRID */}
            <div className="container-editorial relative grid gap-12 pb-16 md:grid-cols-12 md:gap-10">
                {/* Brand block */}
                <FooterCol className="md:col-span-4" delay={0}>
                    <p className="max-w-md text-balance text-base leading-relaxed text-cream-dim">
                        Coffee, comfort, and warm tables in the heart of Bogor. From casual
                        brunch to private celebration — we keep a seat for you.
                    </p>

                    <div className="mt-7 space-y-4 text-sm text-cream-dim">
                        <FooterRow Icon={MapPin} title="Visit">
                            {ADDRESS_LINE1}
                            <br />
                            {ADDRESS_LINE2}
                        </FooterRow>
                        <FooterRow Icon={Phone} title="Call">
                            <a className="hover:text-gold" href={`tel:${PHONE_TEL}`}>
                                {PHONE}
                            </a>
                        </FooterRow>
                        <FooterRow Icon={Mail} title="Email">
                            <a className="hover:text-gold" href={`mailto:${EMAIL}`}>
                                {EMAIL}
                            </a>
                        </FooterRow>
                    </div>

                    <a
                        href="https://maps.google.com/?q=Raindear+Coffee+%26+Kitchen+Bogor"
                        target="_blank"
                        rel="noreferrer"
                        className="group mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-cream-dim transition-colors hover:text-gold"
                    >
                        Open in Google Maps
                        <ArrowUpRight
                            size={12}
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </a>
                </FooterCol>

                {/* Navigate */}
                <FooterCol className="md:col-span-3" delay={0.1}>
                    <ColTitle>Navigate</ColTitle>
                    <ul className="mt-5 space-y-2">
                        {NAV_LINKS.map((l) => (
                            <li key={l.to}>
                                <Link
                                    to={l.to}
                                    className="group relative inline-flex items-center gap-2 font-display text-xl text-cream/90 transition-colors hover:text-cream"
                                >
                                    <span className="relative">
                                        {l.label}
                                        <span
                                            aria-hidden
                                            className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full"
                                        />
                                    </span>
                                    <ArrowUpRight
                                        size={14}
                                        className="-translate-x-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </FooterCol>

                {/* Hours */}
                <FooterCol className="md:col-span-3" delay={0.2}>
                    <ColTitle>Hours</ColTitle>
                    <ul className="mt-5 space-y-3">
                        {HOURS.map((h) => (
                            <li key={h.day}>
                                <div className="font-mono text-[9px] uppercase tracking-[0.32em] text-cream-dim/70">
                                    {h.day}
                                </div>
                                <div className="font-display text-lg text-cream">{h.hours}</div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-5">
                        <OpenBadge isOpen={openStatus.isOpen} closesAt={openStatus.closesAt} />
                    </div>
                </FooterCol>

                {/* Stay close — newsletter + socials */}
                <FooterCol className="md:col-span-2" delay={0.3}>
                    <ColTitle>Stay close</ColTitle>
                    <p className="mt-5 max-w-xs text-sm text-cream-dim">
                        Slow letters about new menus, private events, and quiet evenings.
                    </p>
                    <NewsletterForm />

                    <div className="mt-7">
                        <div className="font-mono text-[9px] uppercase tracking-[0.32em] text-cream-dim/70">
                            Follow
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                            {SOCIAL.map(({ href, Icon, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="group flex h-10 w-10 items-center justify-center border border-line/60 text-cream-dim transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:text-gold"
                                >
                                    <Icon
                                        size={14}
                                        className="transition-transform duration-500 group-hover:scale-110"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </FooterCol>
            </div>

            {/* HAIRLINE */}
            <div className="hairline" />

            {/* BOTTOM STRIP */}
            <div className="container-editorial relative">
                <div className="flex flex-col items-start justify-between gap-3 py-6 text-cream-dim md:flex-row md:items-center">
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em]">
                        © {new Date().getFullYear()} Raindear Coffee &amp; Kitchen
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim/70">
                        Made with care in Bogor · West Java
                    </span>
                    <div className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.4em]">
                        <FooterMiniLink to="/privacy">Privacy</FooterMiniLink>
                        <FooterMiniLink to="/terms">Terms</FooterMiniLink>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="group relative"
                        >
                            <span>Back to top</span>
                            <span
                                aria-hidden
                                className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* -------------------- subcomponents -------------------- */

function ColTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
            <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
                className="block h-px w-6 origin-left bg-gold/60"
            />
            {children}
        </div>
    );
}

function FooterCol({
    children,
    className,
    delay,
}: {
    children: React.ReactNode;
    className?: string;
    delay: number;
}) {
    const reduce = useReducedMotion();
    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function FooterRow({
    Icon,
    title,
    children,
}: {
    Icon: typeof MapPin;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-line/60 text-cream-dim/70">
                <Icon size={12} />
            </span>
            <div className="min-w-0 flex-1">
                <div className="font-mono text-[9px] uppercase tracking-[0.32em] text-cream-dim/60">
                    {title}
                </div>
                <div className="mt-0.5 text-sm leading-relaxed text-cream-dim">{children}</div>
            </div>
        </div>
    );
}

function FooterMiniLink({ to, children }: { to: string; children: React.ReactNode }) {
    return (
        <Link to={to} className="group relative">
            <span>{children}</span>
            <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full"
            />
        </Link>
    );
}

function OpenBadge({ isOpen, closesAt }: { isOpen: boolean; closesAt: string }) {
    const reduce = useReducedMotion();
    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 border px-3 py-2',
                isOpen ? 'border-gold/40 bg-gold/5' : 'border-copper/40 bg-copper/5',
            )}
        >
            <span className="relative flex h-2 w-2">
                {!reduce && isOpen && (
                    <motion.span
                        animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-full bg-gold/60"
                    />
                )}
                <span
                    className={cn(
                        'relative h-2 w-2 rounded-full',
                        isOpen ? 'bg-gold' : 'bg-copper',
                    )}
                />
            </span>
            <Clock size={12} className={isOpen ? 'text-gold' : 'text-copper'} />
            <span
                className={cn(
                    'font-mono text-[10px] uppercase tracking-[0.32em]',
                    isOpen ? 'text-gold' : 'text-copper',
                )}
            >
                {isOpen ? `Open · closes ${closesAt}` : 'Closed · opens 09:00'}
            </span>
        </div>
    );
}

function Marquee({ reduce }: { reduce: boolean }) {
    const items = useMemo(() => {
        const seq: { type: 'word' | 'sep'; value: string; key: string }[] = [];
        for (let r = 0; r < 4; r++) {
            MARQUEE_PHRASE.forEach((w, i) => {
                seq.push({ type: 'word', value: w, key: `w-${r}-${i}` });
                seq.push({ type: 'sep', value: '·', key: `s-${r}-${i}` });
            });
        }
        return seq;
    }, []);

    return (
        <div className="flex w-full overflow-hidden">
            <motion.div
                className="flex shrink-0 items-center gap-6 pr-6 font-mono text-[11px] uppercase tracking-[0.4em] text-cream-dim"
                animate={reduce ? undefined : { x: ['0%', '-50%'] }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            >
                {[...items, ...items].map((it) =>
                    it.type === 'word' ? (
                        <span
                            key={it.key}
                            className={cn(
                                'whitespace-nowrap',
                                it.value === 'Coffee' || it.value === 'Bogor'
                                    ? 'text-gold'
                                    : '',
                            )}
                        >
                            {it.value}
                        </span>
                    ) : (
                        <span key={it.key} className="text-cream-dim/50">
                            ·
                        </span>
                    ),
                )}
            </motion.div>
        </div>
    );
}

function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) return;
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        setEmail('');
    };
    return (
        <form onSubmit={onSubmit} className="mt-5">
            <div className="group relative flex items-center border border-line/60 bg-ink-2/40 transition-colors focus-within:border-gold/60">
                <Mail size={12} className="ml-3 text-cream-dim/60" />
                <input
                    type="email"
                    required
                    placeholder="your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-3 font-sans text-sm text-cream placeholder:text-cream-dim/50 focus:outline-none"
                />
                <button
                    type="submit"
                    className="flex h-full items-center justify-center border-l border-line/60 px-4 text-cream-dim transition-colors hover:bg-gold/10 hover:text-gold"
                    aria-label="Subscribe"
                >
                    <Send size={14} />
                </button>
            </div>
            <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={
                    submitted ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }
                }
                transition={{ duration: 0.4, ease: EASE }}
                className="mt-2 overflow-hidden font-mono text-[9px] uppercase tracking-[0.32em] text-gold"
            >
                ✓ Thanks — see you in your inbox.
            </motion.p>
        </form>
    );
}

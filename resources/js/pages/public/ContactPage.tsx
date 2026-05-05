import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowUpRight,
    BadgeCheck,
    Briefcase,
    Building2,
    Calendar,
    Camera,
    Check,
    ChevronDown,
    Clock,
    Loader2,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
    Tag,
    User,
    Utensils,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { api, getValidationErrors } from '@/lib/api';
import { useDocumentTitle } from '@/lib/seo';
import { buildWaUrl, cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

const HERO_PHOTO = '/images/interior/interior-blue-booth.jpg';

const TOPICS = [
    {
        value: 'general',
        label: 'General',
        body: 'A question, a hello, a small thought.',
        Icon: MessageCircle,
        subjectHint: 'Just saying hi',
    },
    {
        value: 'reservation',
        label: 'Reservation',
        body: 'Booking help, group tables, special requests.',
        Icon: Calendar,
        subjectHint: 'Reservation question',
    },
    {
        value: 'event',
        label: 'Private event',
        body: 'Birthdays, gatherings, intimate dinners.',
        Icon: BadgeCheck,
        subjectHint: 'Hosting an event',
    },
    {
        value: 'catering',
        label: 'Catering',
        body: 'Food for offices, parties, off-site moments.',
        Icon: Utensils,
        subjectHint: 'Catering inquiry',
    },
    {
        value: 'press',
        label: 'Press',
        body: 'Stories, features, photos, interviews.',
        Icon: Camera,
        subjectHint: 'Press / media',
    },
    {
        value: 'partnership',
        label: 'Partnership',
        body: 'Brands, suppliers, collaborations.',
        Icon: Briefcase,
        subjectHint: 'Partnership proposal',
    },
] as const;

type TopicValue = (typeof TOPICS)[number]['value'];

const FAQ = [
    {
        q: 'Do you take walk-ins?',
        a: 'Always. Reservations are recommended for dinner Friday–Sunday and for groups of four or more — but the bar and a few corner two-tops are kept for walk-ins every night.',
    },
    {
        q: 'Is parking available?',
        a: 'Yes. There is on-site parking for cars and motorbikes directly in front of the cafe, plus additional street parking along Jl. Bina Marga.',
    },
    {
        q: 'Can we host private events?',
        a: 'We host birthdays, anniversaries, intimate weddings and corporate dinners — between 10 and 60 guests. Tell us your date, headcount and vibe via the form and we\'ll send a tailored brief.',
    },
    {
        q: 'Is the food halal?',
        a: 'All of our coffee and most of our kitchen menu is halal. We do serve a small selection of dishes containing pork; these are clearly labelled on the menu and are prepared on dedicated equipment.',
    },
    {
        q: 'Do you accept cards and QRIS?',
        a: 'Yes — Visa, Mastercard, JCB, debit cards, QRIS and all major Indonesian e-wallets are accepted. We can split bills however you like.',
    },
    {
        q: 'Do you have vegetarian or vegan options?',
        a: 'Absolutely. Several mains and most coffees can be made vegetarian or vegan — oat, soy and almond milk are all on the bar. Just ask your server or note it in your reservation.',
    },
];

const schema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email required'),
    phone: z.string().optional().or(z.literal('')),
    subject: z.string().optional().or(z.literal('')),
    message: z.string().min(10, 'Tell us a little more — 10 characters min.'),
});
type Form = z.infer<typeof schema>;

export default function ContactPage() {
    useDocumentTitle('Contact — Raindear');
    const reduce = useReducedMotion();
    const [topic, setTopic] = useState<TopicValue>('general');
    const [success, setSuccess] = useState(false);

    const form = useForm<Form>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        },
    });

    const mut = useMutation({
        mutationFn: async (v: Form) =>
            (
                await api.post('/contact-messages', {
                    ...v,
                    subject: v.subject ?? '',
                    phone: v.phone ?? '',
                })
            ).data,
        onSuccess: () => {
            setSuccess(true);
            form.reset();
        },
        onError: (err) => {
            const e = getValidationErrors(err);
            if (e)
                Object.entries(e).forEach(([k, v]) =>
                    form.setError(k as keyof Form, { message: v[0] }),
                );
        },
    });

    const onSubmit = form.handleSubmit((v) => mut.mutate(v));
    const watched = form.watch();

    /* parallax hero */
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

    /* mouse spotlight */
    const [pointer, setPointer] = useState({ x: 50, y: 40 });
    const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
        if (reduce) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setPointer({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    /* open-now status */
    const openStatus = useMemo(() => {
        const now = new Date();
        const day = now.getDay(); // 0 sun
        const h = now.getHours();
        const m = now.getMinutes();
        const cur = h * 60 + m;
        const isWeekend = day === 5 || day === 6;
        const close = isWeekend ? 24 * 60 : 23 * 60;
        const open = 9 * 60;
        const isOpen = cur >= open && cur < close;
        const closesAt = isWeekend ? '24:00' : '23:00';
        return { isOpen, closesAt };
    }, []);

    return (
        <div className="relative">
            {/* HERO */}
            <header
                ref={heroRef}
                onPointerMove={onPointerMove}
                className="relative overflow-hidden border-b border-line/60"
            >
                <motion.div
                    style={reduce ? undefined : { y: heroY, scale: heroScale }}
                    className="absolute inset-0"
                >
                    <ImageWithFallback src={HERO_PHOTO} alt="" className="h-full w-full" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/70 to-ink" />
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 transition-[background] duration-300"
                    style={{
                        background: `radial-gradient(820px 460px at ${pointer.x}% ${pointer.y}%, rgba(201,162,91,0.22), transparent 70%)`,
                    }}
                />

                <div className="container-editorial relative grid items-center gap-12 pt-24 pb-16 md:grid-cols-12 md:pt-36 md:pb-24">
                    <div className="md:col-span-8">
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold"
                        >
                            Contact · Bogor
                        </motion.div>
                        <h1 className="mt-5 max-w-3xl font-display text-6xl leading-[0.92] text-cream md:text-[7.5rem]">
                            {['Talk to us,', 'anytime.'].map((line, i) => (
                                <span key={line} className="block overflow-hidden">
                                    <motion.span
                                        initial={reduce ? false : { y: '110%', opacity: 0, rotateX: -22 }}
                                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                        transition={{ duration: 0.95, ease: EASE, delay: 0.15 + i * 0.1 }}
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
                        </h1>
                        <motion.p
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.7 }}
                            className="mt-8 max-w-md text-cream-dim"
                        >
                            Pick a topic, drop a note. We answer questions, take bookings, host events,
                            and reply to everything within a day.
                        </motion.p>

                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.7 }}
                            className="mt-8 flex flex-wrap items-center gap-3"
                        >
                            <ResponseBadge />
                            <OpenBadge isOpen={openStatus.isOpen} closesAt={openStatus.closesAt} />
                        </motion.div>

                        <motion.div
                            initial={reduce ? false : { scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.8, duration: 0.9, ease: EASE }}
                            className="mt-10 h-px w-32 origin-left bg-gold/60"
                        />
                    </div>
                </div>
            </header>

            {/* TOPIC CHOOSER */}
            <section className="container-editorial border-b border-line/60 py-16 md:py-20">
                <div className="flex items-end justify-between gap-8">
                    <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                            01 · What's it about?
                        </div>
                        <h2 className="mt-3 font-display text-3xl text-cream md:text-5xl">
                            Pick a topic.
                        </h2>
                    </div>
                    <div className="hidden font-mono text-[10px] uppercase tracking-[0.32em] text-cream-dim sm:block">
                        Step 01 / 02
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {TOPICS.map((t, i) => (
                        <TopicCard
                            key={t.value}
                            topic={t}
                            selected={topic === t.value}
                            onClick={() => {
                                setTopic(t.value);
                                if (!form.getValues('subject')) {
                                    form.setValue('subject', t.subjectHint);
                                }
                            }}
                            delay={i * 0.04}
                        />
                    ))}
                </div>
            </section>

            {/* FORM + INFO */}
            <section className="container-editorial border-b border-line/60 py-16 md:py-24">
                <div className="grid gap-12 md:grid-cols-12 md:gap-16">
                    {/* FORM */}
                    <div className="md:col-span-7">
                        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                            02 · Your message
                        </div>
                        <h2 className="mt-3 font-display text-3xl text-cream md:text-5xl">
                            Tell us a little.
                        </h2>
                        <p className="mt-3 max-w-md text-cream-dim">
                            Topic selected:{' '}
                            <span className="text-cream">
                                {TOPICS.find((t) => t.value === topic)?.label}
                            </span>
                            . The more context, the faster we can help.
                        </p>

                        <form onSubmit={onSubmit} className="mt-10 space-y-6">
                            <FloatingField
                                label="Full name"
                                icon={<User size={14} />}
                                error={form.formState.errors.name?.message}
                                register={form.register('name')}
                                value={watched.name}
                            />
                            <div className="grid gap-6 md:grid-cols-2">
                                <FloatingField
                                    label="Email"
                                    icon={<Mail size={14} />}
                                    error={form.formState.errors.email?.message}
                                    register={form.register('email')}
                                    value={watched.email}
                                    type="email"
                                />
                                <FloatingField
                                    label="Phone (optional)"
                                    icon={<Phone size={14} />}
                                    error={form.formState.errors.phone?.message}
                                    register={form.register('phone')}
                                    value={watched.phone ?? ''}
                                />
                            </div>
                            <FloatingField
                                label="Subject"
                                icon={<Tag size={14} />}
                                error={form.formState.errors.subject?.message}
                                register={form.register('subject')}
                                value={watched.subject ?? ''}
                                placeholder="Catering, partnership, press…"
                            />
                            <MessageField
                                register={form.register('message')}
                                value={watched.message}
                                error={form.formState.errors.message?.message}
                            />

                            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/60 pt-6">
                                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-cream-dim">
                                    We never share your details
                                </span>
                                <button
                                    type="submit"
                                    disabled={mut.isPending}
                                    className="group relative inline-flex h-12 items-center gap-2 overflow-hidden border border-gold bg-gold/15 px-7 font-mono text-[11px] uppercase tracking-[0.32em] text-cream transition-colors hover:bg-gold/25 disabled:opacity-60"
                                >
                                    {mut.isPending ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Sending…
                                        </>
                                    ) : (
                                        <>
                                            Send message
                                            <Send
                                                size={14}
                                                className="transition-transform duration-300 group-hover:translate-x-0.5"
                                            />
                                        </>
                                    )}
                                    <span
                                        aria-hidden
                                        className="pointer-events-none absolute inset-0 -translate-y-full bg-gradient-to-b from-gold/30 to-transparent transition-transform duration-500 group-hover:translate-y-0"
                                    />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* SIDE INFO */}
                    <aside className="md:col-span-5">
                        <SideCard openStatus={openStatus} />
                    </aside>
                </div>
            </section>

            {/* CHANNELS STRIP */}
            <section className="container-editorial border-b border-line/60 py-16 md:py-20">
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                    Or reach us directly
                </div>
                <h2 className="mt-3 max-w-2xl font-display text-3xl text-cream md:text-5xl">
                    Pick the channel that suits you.
                </h2>

                <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <ChannelCard
                        Icon={MessageCircle}
                        label="WhatsApp"
                        body="Fastest. Daytime hours."
                        href={buildWaUrl(
                            '6282111789089',
                            "Hi Raindear, I'd like to ask about ",
                        )}
                        external
                    />
                    <ChannelCard
                        Icon={Phone}
                        label="Call us"
                        body="+62 821-1178-9089"
                        href="tel:+6282111789089"
                    />
                    <ChannelCard
                        Icon={Mail}
                        label="Email"
                        body="mkt.raindear@gmail.com"
                        href="mailto:mkt.raindear@gmail.com"
                    />
                    <ChannelCard
                        Icon={MapPin}
                        label="Visit"
                        body="Jl. Bina Marga 7, Bogor"
                        href="https://maps.google.com/?q=Raindear+Coffee+%26+Kitchen+Bogor"
                        external
                    />
                </div>
            </section>

            {/* MAP */}
            <section className="container-editorial border-b border-line/60 py-16 md:py-20">
                <div className="grid gap-10 md:grid-cols-12 md:gap-12">
                    <div className="md:col-span-4">
                        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                            Find us
                        </div>
                        <h2 className="mt-3 font-display text-3xl text-cream md:text-5xl">
                            A warm room
                            <br />
                            <em className="italic text-gold">on Bina Marga.</em>
                        </h2>
                        <p className="mt-4 text-cream-dim">
                            On the quiet side of Baranangsiang, a short drive from Tugu Kujang and Botanical
                            Gardens. Easy parking, calm street.
                        </p>
                        <div className="mt-6 space-y-2 text-cream">
                            <div>Jl. Bina Marga No. 7</div>
                            <div className="text-cream-dim">Baranangsiang · Bogor Timur · 16143</div>
                        </div>
                        <a
                            href="https://maps.google.com/?q=Raindear+Coffee+%26+Kitchen+Bogor"
                            target="_blank"
                            rel="noreferrer"
                            className="group mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-cream-dim transition-colors hover:text-gold"
                        >
                            Open in Google Maps
                            <ArrowUpRight
                                size={12}
                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </a>
                    </div>
                    <div className="md:col-span-8">
                        <MapEmbed />
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="container-editorial border-b border-line/60 py-16 md:py-24">
                <div className="grid gap-10 md:grid-cols-12 md:gap-16">
                    <div className="md:col-span-4">
                        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                            FAQ
                        </div>
                        <h2 className="mt-3 font-display text-3xl text-cream md:text-5xl">
                            Quick answers
                            <br />
                            <em className="italic text-gold">for the usual things.</em>
                        </h2>
                        <p className="mt-4 max-w-xs text-cream-dim">
                            Can't find what you need? Drop us a note above — we read every message.
                        </p>
                    </div>
                    <div className="md:col-span-8">
                        <FAQList items={FAQ} />
                    </div>
                </div>
            </section>

            {/* SUCCESS DIALOG */}
            <SuccessDialog open={success} onClose={() => setSuccess(false)} />
        </div>
    );
}

/* -------------------------- subcomponents -------------------------- */

function ResponseBadge() {
    const reduce = useReducedMotion();
    return (
        <div className="inline-flex items-center gap-2 border border-gold/40 bg-gold/5 px-3 py-1.5">
            <motion.span
                animate={reduce ? undefined : { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="h-1.5 w-1.5 rounded-full bg-gold"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold">
                We reply within a day
            </span>
        </div>
    );
}

function OpenBadge({ isOpen, closesAt }: { isOpen: boolean; closesAt: string }) {
    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 border px-3 py-1.5',
                isOpen ? 'border-cream/40 bg-cream/5' : 'border-copper/40 bg-copper/5',
            )}
        >
            <Clock size={12} className={isOpen ? 'text-cream' : 'text-copper'} />
            <span
                className={cn(
                    'font-mono text-[10px] uppercase tracking-[0.32em]',
                    isOpen ? 'text-cream' : 'text-copper',
                )}
            >
                {isOpen ? `Open now · closes ${closesAt}` : 'Closed · opens 09:00'}
            </span>
        </div>
    );
}

function TopicCard({
    topic,
    selected,
    onClick,
    delay,
}: {
    topic: (typeof TOPICS)[number];
    selected: boolean;
    onClick: () => void;
    delay: number;
}) {
    const reduce = useReducedMotion();
    const Icon = topic.Icon;
    return (
        <motion.button
            type="button"
            onClick={onClick}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: EASE, delay }}
            className={cn(
                'group relative flex items-start gap-4 border bg-ink-2/40 p-5 text-left transition-all duration-300',
                selected
                    ? 'border-gold bg-gold/10'
                    : 'border-line/60 hover:-translate-y-0.5 hover:border-gold/50',
            )}
            aria-pressed={selected}
        >
            <span
                className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center border transition-all duration-300',
                    selected
                        ? 'border-gold bg-gold/15 text-gold'
                        : 'border-line/60 text-cream-dim group-hover:border-gold/50 group-hover:text-gold',
                )}
            >
                <Icon size={16} />
            </span>
            <div className="min-w-0 flex-1">
                <div className="font-display text-lg text-cream">{topic.label}</div>
                <div className="mt-1 text-sm text-cream-dim">{topic.body}</div>
            </div>
            <AnimatePresence>
                {selected && (
                    <motion.span
                        key="check"
                        initial={reduce ? false : { scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-ink"
                    >
                        <Check size={12} />
                    </motion.span>
                )}
            </AnimatePresence>
            <span
                aria-hidden
                className={cn(
                    'absolute bottom-0 left-0 h-px bg-gold transition-all duration-500',
                    selected ? 'w-full' : 'w-6 group-hover:w-1/2',
                )}
            />
        </motion.button>
    );
}

function FloatingField({
    label,
    icon,
    error,
    register,
    value,
    type = 'text',
    placeholder,
}: {
    label: string;
    icon: React.ReactNode;
    error?: string;
    register: ReturnType<ReturnType<typeof useForm<Form>>['register']>;
    value: string;
    type?: string;
    placeholder?: string;
}) {
    const reduce = useReducedMotion();
    const [focused, setFocused] = useState(false);
    const float = focused || value.length > 0;
    return (
        <motion.div
            animate={error && !reduce ? { x: [0, -6, 6, -4, 4, 0] } : undefined}
            transition={{ duration: 0.4 }}
            className="relative"
        >
            <label className="relative block">
                <span
                    className={cn(
                        'pointer-events-none absolute left-9 top-1/2 -translate-y-1/2 font-mono uppercase tracking-[0.3em] transition-all duration-300',
                        float
                            ? 'top-1.5 -translate-y-0 text-[9px] text-gold'
                            : 'text-[10px] text-cream-dim',
                    )}
                >
                    {label}
                </span>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cream-dim">
                    {icon}
                </span>
                <input
                    {...register}
                    type={type}
                    placeholder={float ? placeholder : ''}
                    onFocus={() => setFocused(true)}
                    onBlurCapture={() => setFocused(false)}
                    className={cn(
                        'block w-full border bg-ink-2/40 pb-2 pl-9 pr-3 pt-6 font-sans text-base text-cream placeholder:text-cream-dim/40 transition-colors focus:outline-none',
                        error
                            ? 'border-copper/70 focus:border-copper'
                            : 'border-line/60 focus:border-gold/70',
                    )}
                />
            </label>
            {error && (
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.32em] text-copper">
                    {error}
                </p>
            )}
        </motion.div>
    );
}

function MessageField({
    register,
    value,
    error,
}: {
    register: ReturnType<ReturnType<typeof useForm<Form>>['register']>;
    value: string;
    error?: string;
}) {
    const max = 1500;
    const reduce = useReducedMotion();
    return (
        <motion.div
            animate={error && !reduce ? { x: [0, -6, 6, -4, 4, 0] } : undefined}
            transition={{ duration: 0.4 }}
            className="relative"
        >
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.32em]">
                <span className="text-gold">Message</span>
                <span className={value.length >= 10 ? 'text-cream-dim' : 'text-copper'}>
                    {value.length} / {max}
                </span>
            </div>
            <textarea
                {...register}
                rows={6}
                placeholder="Tell us about your question, your event, your idea — in your own words."
                className={cn(
                    'block w-full resize-none border bg-ink-2/40 p-4 font-sans text-base text-cream placeholder:text-cream-dim/50 transition-colors focus:outline-none',
                    error
                        ? 'border-copper/70 focus:border-copper'
                        : 'border-line/60 focus:border-gold/70',
                )}
            />
            {error && (
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.32em] text-copper">
                    {error}
                </p>
            )}
        </motion.div>
    );
}

function SideCard({ openStatus }: { openStatus: { isOpen: boolean; closesAt: string } }) {
    const reduce = useReducedMotion();
    return (
        <div className="md:sticky md:top-28">
            <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative overflow-hidden border border-line/60 bg-ink-2/60 p-7 backdrop-blur-sm"
            >
                <span aria-hidden className="absolute left-0 top-0 h-4 w-4 border-l border-t border-gold/60" />
                <span aria-hidden className="absolute right-0 top-0 h-4 w-4 border-r border-t border-gold/60" />
                <span aria-hidden className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-gold/60" />
                <span aria-hidden className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-gold/60" />

                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                    A short letter, a long table
                </div>
                <p className="mt-4 text-cream-dim">
                    The kitchen runs from morning until late. We answer messages between coffees, so reply
                    speed peaks before lunch and after the dinner rush.
                </p>

                <div className="mt-7 space-y-5 border-t border-line/60 pt-7">
                    <SideRow Icon={MapPin} title="Visit">
                        Jl. Bina Marga No. 7
                        <br />
                        Baranangsiang, Bogor Timur 16143
                    </SideRow>
                    <SideRow Icon={Phone} title="Call">
                        <a className="text-cream hover:text-gold" href="tel:+6282111789089">
                            +62 821-1178-9089
                        </a>
                        <br />
                        <a
                            className="text-cream hover:text-gold"
                            href={buildWaUrl('6282111789089', "Hi Raindear, I'd like to ask about ")}
                            target="_blank"
                            rel="noreferrer"
                        >
                            WhatsApp
                        </a>
                    </SideRow>
                    <SideRow Icon={Mail} title="Email">
                        <a
                            className="text-cream hover:text-gold"
                            href="mailto:mkt.raindear@gmail.com"
                        >
                            mkt.raindear@gmail.com
                        </a>
                    </SideRow>
                    <SideRow Icon={Clock} title="Hours">
                        Open daily · 09:00 — 23:00
                        <br />
                        Fri &amp; Sat until 24:00
                        <div className="mt-2">
                            <OpenBadge isOpen={openStatus.isOpen} closesAt={openStatus.closesAt} />
                        </div>
                    </SideRow>
                </div>
            </motion.div>
        </div>
    );
}

function SideRow({
    Icon,
    title,
    children,
}: {
    Icon: typeof MapPin;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-gold/40 text-gold">
                <Icon size={14} />
            </span>
            <div className="min-w-0 flex-1">
                <div className="font-mono text-[9px] uppercase tracking-[0.32em] text-cream-dim">
                    {title}
                </div>
                <div className="mt-1 text-sm text-cream-dim">{children}</div>
            </div>
        </div>
    );
}

function ChannelCard({
    Icon,
    label,
    body,
    href,
    external,
}: {
    Icon: typeof MessageCircle;
    label: string;
    body: string;
    href: string;
    external?: boolean;
}) {
    return (
        <a
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            className="group relative flex items-start gap-4 border border-line/60 bg-ink-2/40 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50"
        >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-line/60 text-cream-dim transition-all duration-300 group-hover:border-gold/60 group-hover:text-gold">
                <Icon size={16} />
            </span>
            <div className="min-w-0 flex-1">
                <div className="font-display text-lg text-cream">{label}</div>
                <div className="mt-1 text-sm text-cream-dim">{body}</div>
            </div>
            <ArrowUpRight
                size={14}
                className="absolute right-4 top-4 text-cream-dim opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
            />
            <span
                aria-hidden
                className="absolute bottom-0 left-0 h-px w-6 bg-gold transition-all duration-500 group-hover:w-full"
            />
        </a>
    );
}

function MapEmbed() {
    const reduce = useReducedMotion();
    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative aspect-[16/10] overflow-hidden border border-line/60"
        >
            {/* corner ticks */}
            <span aria-hidden className="absolute left-0 top-0 z-10 h-5 w-5 border-l border-t border-gold/70" />
            <span aria-hidden className="absolute right-0 top-0 z-10 h-5 w-5 border-r border-t border-gold/70" />
            <span aria-hidden className="absolute bottom-0 left-0 z-10 h-5 w-5 border-b border-l border-gold/70" />
            <span aria-hidden className="absolute bottom-0 right-0 z-10 h-5 w-5 border-b border-r border-gold/70" />

            <iframe
                title="Raindear location"
                src="https://www.google.com/maps?q=Raindear%20Coffee%20%26%20Kitchen%20Bogor&output=embed"
                className="h-full w-full grayscale-[0.6] contrast-110"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
            {/* dark overlay tint */}
            <div className="pointer-events-none absolute inset-0 bg-ink/10 mix-blend-multiply" />

            {/* address pill */}
            <div className="absolute left-4 top-4 border border-gold/50 bg-ink/85 px-3 py-2 backdrop-blur-md">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-gold">
                    <Building2 size={12} />
                    Raindear · Bogor
                </div>
                <div className="mt-1 text-xs text-cream-dim">Jl. Bina Marga 7 · Baranangsiang</div>
            </div>
        </motion.div>
    );
}

function FAQList({ items }: { items: typeof FAQ }) {
    const [open, setOpen] = useState<number | null>(0);
    return (
        <ul className="border-t border-line/60">
            {items.map((item, i) => (
                <FAQRow
                    key={item.q}
                    item={item}
                    open={open === i}
                    onToggle={() => setOpen(open === i ? null : i)}
                    index={i}
                />
            ))}
        </ul>
    );
}

function FAQRow({
    item,
    open,
    onToggle,
    index,
}: {
    item: (typeof FAQ)[number];
    open: boolean;
    onToggle: () => void;
    index: number;
}) {
    const reduce = useReducedMotion();
    return (
        <motion.li
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: EASE, delay: index * 0.04 }}
            className="border-b border-line/60"
        >
            <button
                type="button"
                onClick={onToggle}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:bg-ink-2/30"
                aria-expanded={open}
            >
                <div className="flex items-baseline gap-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-xl text-cream md:text-2xl">{item.q}</span>
                </div>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center border transition-colors',
                        open
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-line/60 text-cream-dim group-hover:border-gold/50 group-hover:text-gold',
                    )}
                >
                    <ChevronDown size={14} />
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                    >
                        <div className="pb-7 pl-12 pr-12 text-cream-dim md:text-lg">
                            <span aria-hidden className="mr-3 inline-block h-px w-6 align-middle bg-gold/60" />
                            {item.a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.li>
    );
}

function SuccessDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const reduce = useReducedMotion();
    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/85 backdrop-blur-md"
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                >
                    <motion.div
                        initial={reduce ? false : { scale: 0.92, opacity: 0, y: 16 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { scale: 0.96, opacity: 0, y: 8 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg border border-gold/50 bg-ink-2 p-8 md:p-10"
                    >
                        <span aria-hidden className="absolute left-0 top-0 h-5 w-5 border-l border-t border-gold" />
                        <span aria-hidden className="absolute right-0 top-0 h-5 w-5 border-r border-t border-gold" />
                        <span aria-hidden className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-gold" />
                        <span aria-hidden className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-gold" />

                        {!reduce && (
                            <motion.div
                                aria-hidden
                                className="absolute -inset-px"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.6, 0, 0.6] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                style={{
                                    background:
                                        'radial-gradient(280px 200px at 50% 0%, rgba(201,162,91,0.15), transparent 70%)',
                                }}
                            />
                        )}

                        <motion.div
                            initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold bg-gold/15 text-gold"
                        >
                            <Check size={26} />
                        </motion.div>
                        <div className="mt-6 text-center">
                            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                                Message sent
                            </div>
                            <h3 className="mt-3 font-display text-3xl text-cream md:text-4xl">
                                Thanks for writing.
                                <br />
                                <em className="italic text-gold">We'll be in touch.</em>
                            </h3>
                            <p className="mt-3 text-cream-dim">
                                We answer everything within a day. Check your inbox — and your spam, just
                                in case.
                            </p>
                        </div>
                        <div className="mt-7 flex justify-center">
                            <button
                                onClick={onClose}
                                className="inline-flex h-12 items-center justify-center border border-line/70 px-7 font-mono text-[11px] uppercase tracking-[0.32em] text-cream-dim transition-colors hover:border-cream/40 hover:text-cream"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

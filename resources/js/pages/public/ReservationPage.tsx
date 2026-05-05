import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Cake,
    Calendar,
    Check,
    Clock,
    HeartHandshake,
    Loader2,
    Mail,
    MapPin,
    MessageCircle,
    Minus,
    PartyPopper,
    Phone,
    Plus,
    Sparkles,
    User,
    Users,
    Wine,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { BrandMark } from '@/components/deer/BrandMark';
import { api, getValidationErrors } from '@/lib/api';
import { useDocumentTitle } from '@/lib/seo';
import { buildWaUrl, cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

const HERO_PHOTO = '/images/interior/interior-arches.jpg';

const OCCASIONS = [
    { value: 'casual', label: 'Casual', body: 'A normal evening, our usual.', Icon: Wine },
    { value: 'date', label: 'Date night', body: 'A quiet table, soft light.', Icon: HeartHandshake },
    { value: 'family', label: 'Family', body: 'Big table, room for everyone.', Icon: Users },
    { value: 'meeting', label: 'Meeting', body: 'A working corner, good coffee.', Icon: User },
    { value: 'birthday', label: 'Birthday', body: 'We can light a candle.', Icon: Cake },
    { value: 'celebration', label: 'Celebration', body: 'Tell us what we\'re toasting.', Icon: PartyPopper },
] as const;

const TIME_BUCKETS: { label: string; slots: { time: string; tier: 'open' | 'tight' | 'few' }[] }[] = [
    {
        label: 'Lunch',
        slots: [
            { time: '11:30', tier: 'open' },
            { time: '12:00', tier: 'open' },
            { time: '12:30', tier: 'tight' },
            { time: '13:00', tier: 'few' },
            { time: '13:30', tier: 'open' },
            { time: '14:00', tier: 'open' },
        ],
    },
    {
        label: 'Afternoon',
        slots: [
            { time: '15:00', tier: 'open' },
            { time: '15:30', tier: 'open' },
            { time: '16:00', tier: 'open' },
            { time: '16:30', tier: 'open' },
        ],
    },
    {
        label: 'Dinner',
        slots: [
            { time: '18:00', tier: 'tight' },
            { time: '18:30', tier: 'few' },
            { time: '19:00', tier: 'few' },
            { time: '19:30', tier: 'tight' },
            { time: '20:00', tier: 'open' },
            { time: '20:30', tier: 'open' },
            { time: '21:00', tier: 'open' },
        ],
    },
];

const STEPS = [
    { id: 1, label: 'Occasion' },
    { id: 2, label: 'When' },
    { id: 3, label: 'Who' },
    { id: 4, label: 'Notes' },
] as const;

const schema = z.object({
    name: z.string().min(2, 'Name is required'),
    phone: z.string().min(8, 'Phone is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    reservation_date: z.string().min(1, 'Pick a date'),
    reservation_time: z.string().regex(/^\d{2}:\d{2}$/, 'Pick a time'),
    guest_count: z.coerce.number().min(1, 'At least 1 guest').max(200),
    occasion_type: z.enum(['casual', 'birthday', 'meeting', 'date', 'family', 'celebration']).optional(),
    notes: z.string().max(1000).optional(),
});
type Form = z.infer<typeof schema>;

export default function ReservationPage() {
    useDocumentTitle('Reserve a table — Raindear');
    const reduce = useReducedMotion();
    const [step, setStep] = useState(1);
    const [success, setSuccess] = useState<Form | null>(null);

    const form = useForm<Form>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            reservation_date: todayISO(),
            reservation_time: '19:00',
            guest_count: 2,
            occasion_type: 'casual',
            notes: '',
        },
    });

    const mut = useMutation({
        mutationFn: async (values: Form) => {
            const r = await api.post('/reservations', { ...values, email: values.email || null });
            return r.data;
        },
        onSuccess: (_data, vars) => {
            setSuccess(vars);
            form.reset({
                ...form.getValues(),
                name: '',
                phone: '',
                email: '',
                notes: '',
            });
        },
        onError: (err) => {
            const errors = getValidationErrors(err);
            if (errors) {
                Object.entries(errors).forEach(([k, v]) => {
                    form.setError(k as keyof Form, { message: v[0] });
                });
            }
        },
    });

    const onFinalSubmit = form.handleSubmit((v) => mut.mutate(v));

    const watched = form.watch();
    const occasion = OCCASIONS.find((o) => o.value === watched.occasion_type) ?? OCCASIONS[0];
    const waMessage = `Hi Raindear, I'd like to reserve a table.\nName: ${watched.name || '[your name]'}\nDate: ${watched.reservation_date || '[date]'}\nTime: ${watched.reservation_time || '[time]'}\nGuests: ${watched.guest_count}\nOccasion: ${occasion.label}`;
    const waUrl = buildWaUrl('6282111789089', waMessage);

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(heroProgress, [0, 1], [0, 100]);
    const heroScale = useTransform(heroProgress, [0, 1], [1, 1.1]);

    /* ----- step nav ----- */
    const canNext = useMemo(() => {
        if (step === 1) return !!watched.occasion_type;
        if (step === 2) return !!watched.reservation_date && !!watched.reservation_time && watched.guest_count >= 1;
        if (step === 3) return watched.name.length >= 2 && watched.phone.length >= 8;
        return true;
    }, [step, watched.occasion_type, watched.reservation_date, watched.reservation_time, watched.guest_count, watched.name, watched.phone]);

    const goNext = async () => {
        if (step === 3) {
            const ok = await form.trigger(['name', 'phone', 'email']);
            if (!ok) return;
        }
        if (step === 2) {
            const ok = await form.trigger(['reservation_date', 'reservation_time', 'guest_count']);
            if (!ok) return;
        }
        if (step < STEPS.length) setStep(step + 1);
    };
    const goBack = () => setStep(Math.max(1, step - 1));

    return (
        <div className="relative">
            {/* HERO */}
            <header
                ref={heroRef}
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
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(820px 460px at 25% 30%, rgba(201,162,91,0.18), transparent 70%)',
                    }}
                />

                <div className="container-editorial relative grid items-center gap-12 pt-24 pb-16 md:grid-cols-12 md:pt-36 md:pb-24">
                    <div className="md:col-span-7">
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold"
                        >
                            Reservation · Bogor · {new Date().getFullYear()}
                        </motion.div>

                        <h1 className="mt-5 max-w-3xl font-display text-6xl leading-[0.92] text-cream md:text-[7.5rem]">
                            {['Save the table.', 'Bring the people.'].map((line, i) => (
                                <span key={line} className="block overflow-hidden">
                                    <motion.span
                                        initial={reduce ? false : { y: '110%', opacity: 0, rotateX: -22 }}
                                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                        transition={{ duration: 0.95, ease: EASE, delay: 0.15 + i * 0.1 }}
                                        style={{ transformOrigin: 'bottom' }}
                                        className="inline-block"
                                    >
                                        {i === 1 ? <em className="font-display italic text-gold">{line}</em> : line}
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
                            Four short steps. We confirm by phone or WhatsApp within the hour.
                        </motion.p>

                        <motion.div
                            initial={reduce ? false : { scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.7, duration: 0.9, ease: EASE }}
                            className="mt-10 h-px w-32 origin-left bg-gold/60"
                        />
                    </div>

                    {/* Floating availability badge */}
                    <div className="md:col-span-5">
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
                            className="relative max-w-sm border border-gold/40 bg-ink-2/70 p-6 backdrop-blur-md md:ml-auto"
                        >
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                                <span className="relative flex h-2 w-2">
                                    <motion.span
                                        animate={reduce ? undefined : { scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute inset-0 rounded-full bg-gold/60"
                                    />
                                    <span className="relative h-2 w-2 rounded-full bg-gold" />
                                </span>
                                Tonight's seats
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-3">
                                {[
                                    { t: '18:30', tier: 'few' },
                                    { t: '19:30', tier: 'tight' },
                                    { t: '20:30', tier: 'open' },
                                ].map((s) => (
                                    <div key={s.t} className="border border-line/60 bg-ink/40 px-2 py-3 text-center">
                                        <div className="font-display text-lg text-cream">{s.t}</div>
                                        <div
                                            className={cn(
                                                'mt-1 font-mono text-[8px] uppercase tracking-[0.32em]',
                                                s.tier === 'open' && 'text-gold',
                                                s.tier === 'tight' && 'text-cream-dim',
                                                s.tier === 'few' && 'text-copper',
                                            )}
                                        >
                                            {s.tier === 'open' ? 'Open' : s.tier === 'tight' ? 'Tight' : 'Few left'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.32em] text-cream-dim">
                                Updated live · Window seats fill first
                            </div>
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <section className="container-editorial border-b border-line/60 py-16 md:py-24">
                <div className="grid gap-12 md:grid-cols-12 md:gap-16">
                    {/* FORM */}
                    <div className="md:col-span-7">
                        {/* Progress indicator */}
                        <ol className="mb-10 grid grid-cols-4 gap-2">
                            {STEPS.map((s, i) => {
                                const isDone = step > s.id;
                                const isCurrent = step === s.id;
                                return (
                                    <li key={s.id} className="relative">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (s.id < step) setStep(s.id);
                                            }}
                                            className="block w-full text-left"
                                            disabled={s.id > step}
                                        >
                                            <div
                                                className={cn(
                                                    'flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] transition-colors',
                                                    isCurrent
                                                        ? 'text-gold'
                                                        : isDone
                                                            ? 'text-cream'
                                                            : 'text-cream-dim/60',
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'flex h-6 w-6 shrink-0 items-center justify-center border text-[10px] transition-colors',
                                                        isCurrent
                                                            ? 'border-gold bg-gold/10 text-gold'
                                                            : isDone
                                                                ? 'border-cream/50 bg-cream/5 text-cream'
                                                                : 'border-line/60 text-cream-dim/60',
                                                    )}
                                                >
                                                    {isDone ? <Check size={12} /> : `0${s.id}`}
                                                </span>
                                                <span className="hidden sm:inline">{s.label}</span>
                                            </div>
                                            <div className="mt-3 h-px w-full bg-line/60">
                                                <motion.div
                                                    initial={{ scaleX: 0 }}
                                                    animate={{ scaleX: isDone ? 1 : isCurrent ? 0.5 : 0 }}
                                                    transition={{ duration: 0.6, ease: EASE }}
                                                    className="h-full origin-left bg-gold"
                                                />
                                            </div>
                                            <span className="mt-1 block sm:hidden font-mono text-[9px] uppercase tracking-[0.2em] text-cream-dim">
                                                {s.label}
                                            </span>
                                            {i < STEPS.length - 1 && null}
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (step < STEPS.length) {
                                    void goNext();
                                } else {
                                    void onFinalSubmit();
                                }
                            }}
                            className="relative"
                        >
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step-1"
                                        initial={reduce ? false : { opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                                        transition={{ duration: 0.4, ease: EASE }}
                                    >
                                        <StepHeader
                                            eyebrow="01 · Occasion"
                                            title="What are we toasting?"
                                            body="Pick the closest one. We'll tune the table and the lighting."
                                        />
                                        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {OCCASIONS.map((o, i) => (
                                                <OccasionCard
                                                    key={o.value}
                                                    occasion={o}
                                                    selected={watched.occasion_type === o.value}
                                                    onClick={() => form.setValue('occasion_type', o.value)}
                                                    delay={i * 0.04}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step-2"
                                        initial={reduce ? false : { opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                                        transition={{ duration: 0.4, ease: EASE }}
                                        className="space-y-10"
                                    >
                                        <StepHeader
                                            eyebrow="02 · When"
                                            title="Pick a date and time."
                                            body="Window tables fill first. Saturdays book out by Thursday."
                                        />

                                        {/* Date picker */}
                                        <div>
                                            <SectionLabel icon={<Calendar size={12} />}>Date</SectionLabel>
                                            <DatePicker
                                                value={watched.reservation_date}
                                                onChange={(d) => form.setValue('reservation_date', d, { shouldValidate: true })}
                                            />
                                            {form.formState.errors.reservation_date && (
                                                <p className="mt-2 font-mono text-[10px] tracking-[0.32em] uppercase text-copper">
                                                    {form.formState.errors.reservation_date.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Time slots */}
                                        <div>
                                            <SectionLabel icon={<Clock size={12} />}>Time</SectionLabel>
                                            <div className="space-y-5">
                                                {TIME_BUCKETS.map((bucket) => (
                                                    <div key={bucket.label}>
                                                        <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-cream-dim">
                                                            {bucket.label}
                                                        </div>
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {bucket.slots.map((s) => (
                                                                <TimeSlot
                                                                    key={s.time}
                                                                    time={s.time}
                                                                    tier={s.tier}
                                                                    selected={watched.reservation_time === s.time}
                                                                    onClick={() => form.setValue('reservation_time', s.time, { shouldValidate: true })}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {form.formState.errors.reservation_time && (
                                                <p className="mt-2 font-mono text-[10px] tracking-[0.32em] uppercase text-copper">
                                                    {form.formState.errors.reservation_time.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Guest stepper */}
                                        <div>
                                            <SectionLabel icon={<Users size={12} />}>Guests</SectionLabel>
                                            <GuestStepper
                                                value={watched.guest_count}
                                                onChange={(n) => form.setValue('guest_count', n, { shouldValidate: true })}
                                            />
                                            {watched.guest_count > 10 && (
                                                <motion.p
                                                    initial={reduce ? false : { opacity: 0, y: 4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-3 inline-flex items-center gap-2 border border-gold/40 bg-gold/5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.32em] text-gold"
                                                >
                                                    <Sparkles size={12} />
                                                    Large group — our team will follow up to brief
                                                </motion.p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step-3"
                                        initial={reduce ? false : { opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                                        transition={{ duration: 0.4, ease: EASE }}
                                        className="space-y-6"
                                    >
                                        <StepHeader
                                            eyebrow="03 · Who"
                                            title="Who's the table for?"
                                            body="We'll use this to confirm and to put the right name on the table card."
                                        />
                                        <FloatingField
                                            label="Full name"
                                            icon={<User size={14} />}
                                            error={form.formState.errors.name?.message}
                                            register={form.register('name')}
                                            value={watched.name}
                                        />
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <FloatingField
                                                label="Phone / WhatsApp"
                                                icon={<Phone size={14} />}
                                                error={form.formState.errors.phone?.message}
                                                register={form.register('phone')}
                                                value={watched.phone}
                                                placeholder="+62 8xx xxxx xxxx"
                                            />
                                            <FloatingField
                                                label="Email (optional)"
                                                icon={<Mail size={14} />}
                                                error={form.formState.errors.email?.message}
                                                register={form.register('email')}
                                                value={watched.email ?? ''}
                                                type="email"
                                                placeholder="you@email.com"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div
                                        key="step-4"
                                        initial={reduce ? false : { opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                                        transition={{ duration: 0.4, ease: EASE }}
                                        className="space-y-6"
                                    >
                                        <StepHeader
                                            eyebrow="04 · Notes"
                                            title="Anything we should know?"
                                            body="Allergies, mobility needs, surprise plans — it all helps."
                                        />
                                        <NotesField
                                            register={form.register('notes')}
                                            value={watched.notes ?? ''}
                                            error={form.formState.errors.notes?.message}
                                        />
                                        <div>
                                            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                                                Quick add
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {[
                                                    'Window seat',
                                                    'High chair',
                                                    'Vegetarian friendly',
                                                    'No nuts',
                                                    'No pork',
                                                    'Birthday cake',
                                                ].map((tag) => (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        onClick={() => {
                                                            const cur = form.getValues('notes') || '';
                                                            const next = cur ? `${cur}, ${tag}` : tag;
                                                            form.setValue('notes', next, { shouldValidate: true });
                                                        }}
                                                        className="border border-line/60 bg-ink/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.32em] text-cream-dim transition-colors hover:border-gold/60 hover:text-cream"
                                                    >
                                                        + {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Step nav */}
                            <div className="mt-10 flex items-center justify-between gap-4 border-t border-line/60 pt-8">
                                <button
                                    type="button"
                                    onClick={goBack}
                                    disabled={step === 1}
                                    className="inline-flex h-12 items-center gap-2 px-4 font-mono text-[11px] uppercase tracking-[0.32em] text-cream-dim transition-colors hover:text-cream disabled:opacity-30"
                                >
                                    <ArrowLeft size={14} />
                                    Back
                                </button>
                                {step < STEPS.length ? (
                                    <button
                                        type="button"
                                        onClick={goNext}
                                        disabled={!canNext}
                                        className="group inline-flex h-12 items-center gap-2 border border-gold/70 bg-gold/10 px-7 font-mono text-[11px] uppercase tracking-[0.32em] text-cream transition-colors hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Continue
                                        <ArrowRight
                                            size={14}
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => void onFinalSubmit()}
                                        disabled={mut.isPending}
                                        className="group relative inline-flex h-12 items-center gap-2 overflow-hidden border border-gold bg-gold/15 px-8 font-mono text-[11px] uppercase tracking-[0.32em] text-cream transition-colors hover:bg-gold/25 disabled:opacity-60"
                                    >
                                        {mut.isPending ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                Confirm reservation
                                                <ArrowUpRight
                                                    size={14}
                                                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                />
                                            </>
                                        )}
                                        <span
                                            aria-hidden
                                            className="pointer-events-none absolute inset-0 -translate-y-full bg-gradient-to-b from-gold/30 to-transparent transition-transform duration-500 group-hover:translate-y-0"
                                        />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* SUMMARY SIDEBAR */}
                    <aside className="md:col-span-5">
                        <SummaryCard
                            occasion={occasion}
                            date={watched.reservation_date}
                            time={watched.reservation_time}
                            guests={watched.guest_count}
                            name={watched.name}
                            notes={watched.notes ?? ''}
                            waUrl={waUrl}
                        />
                    </aside>
                </div>
            </section>

            {/* INFO STRIP */}
            <section className="border-b border-line/60 bg-ink-2/40">
                <div className="container-editorial grid gap-10 py-16 md:grid-cols-3 md:py-20">
                    <InfoBlock
                        icon={<Clock size={16} />}
                        title="Opening hours"
                        lines={['Mon – Thu · 10:00 – 23:00', 'Fri – Sun · 09:00 – 24:00']}
                    />
                    <InfoBlock
                        icon={<MapPin size={16} />}
                        title="Where we are"
                        lines={['Jl. Pajajaran, Bogor', 'West Java · 16143']}
                    />
                    <InfoBlock
                        icon={<MessageCircle size={16} />}
                        title="Talk to us"
                        lines={['+62 821 1178 9089', 'hello@raindear.id']}
                    />
                </div>
            </section>

            {/* SUCCESS DIALOG */}
            <SuccessDialog
                open={success}
                onClose={() => {
                    setSuccess(null);
                    setStep(1);
                }}
                onAnother={() => {
                    setSuccess(null);
                    setStep(1);
                }}
                waUrl={waUrl}
            />
        </div>
    );
}

/* ----------------------------- subcomponents ----------------------------- */

function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function StepHeader({
    eyebrow,
    title,
    body,
}: {
    eyebrow: string;
    title: string;
    body: string;
}) {
    return (
        <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">{eyebrow}</div>
            <h2 className="mt-3 font-display text-3xl text-cream md:text-5xl">{title}</h2>
            <p className="mt-3 max-w-md text-cream-dim">{body}</p>
        </div>
    );
}

function SectionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
            <span className="opacity-90">{icon}</span>
            {children}
        </div>
    );
}

function OccasionCard({
    occasion,
    selected,
    onClick,
    delay,
}: {
    occasion: (typeof OCCASIONS)[number];
    selected: boolean;
    onClick: () => void;
    delay: number;
}) {
    const reduce = useReducedMotion();
    const Icon = occasion.Icon;
    return (
        <motion.button
            type="button"
            onClick={onClick}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay }}
            className={cn(
                'group relative flex items-start gap-4 border bg-ink-2/40 p-5 text-left transition-all duration-300',
                selected
                    ? 'border-gold bg-gold/10 shadow-[0_0_0_1px_rgba(201,162,91,0.3)]'
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
                <div className="font-display text-lg text-cream">{occasion.label}</div>
                <div className="mt-1 text-sm text-cream-dim">{occasion.body}</div>
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

function DatePicker({ value, onChange }: { value: string; onChange: (d: string) => void }) {
    const [cursor, setCursor] = useState(() => {
        if (value) {
            const [y, m] = value.split('-').map(Number);
            return new Date(y, m - 1, 1);
        }
        const t = new Date();
        return new Date(t.getFullYear(), t.getMonth(), 1);
    });

    const today = useMemo(() => {
        const t = new Date();
        return new Date(t.getFullYear(), t.getMonth(), t.getDate());
    }, []);

    const monthLabel = cursor.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const days = useMemo(() => buildMonthGrid(cursor), [cursor]);
    const selected = value;

    return (
        <div className="border border-line/60 bg-ink-2/40 p-5">
            <div className="mb-4 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                    className="flex h-8 w-8 items-center justify-center text-cream-dim transition-colors hover:text-gold"
                    aria-label="Previous month"
                >
                    <ArrowLeft size={14} />
                </button>
                <div className="font-display text-xl text-cream">{monthLabel}</div>
                <button
                    type="button"
                    onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                    className="flex h-8 w-8 items-center justify-center text-cream-dim transition-colors hover:text-gold"
                    aria-label="Next month"
                >
                    <ArrowRight size={14} />
                </button>
            </div>
            <div className="mb-2 grid grid-cols-7 gap-1 font-mono text-[9px] uppercase tracking-[0.3em] text-cream-dim/60">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <div key={d} className="py-1 text-center">
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((d, i) => {
                    if (!d) return <div key={i} />;
                    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                    const isPast = d < today;
                    const isSelected = iso === selected;
                    const isToday = d.getTime() === today.getTime();
                    return (
                        <button
                            key={iso}
                            type="button"
                            onClick={() => !isPast && onChange(iso)}
                            disabled={isPast}
                            className={cn(
                                'relative aspect-square font-mono text-xs transition-colors',
                                isPast
                                    ? 'cursor-not-allowed text-cream-dim/30'
                                    : isSelected
                                        ? 'border border-gold bg-gold/15 text-cream'
                                        : 'text-cream hover:bg-ink/50',
                                isToday && !isSelected && 'ring-1 ring-gold/40',
                            )}
                        >
                            {d.getDate()}
                            {isSelected && (
                                <motion.span
                                    layoutId="datepicker-active"
                                    className="absolute inset-0 border border-gold"
                                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function buildMonthGrid(cursor: Date): (Date | null)[] {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
}

function TimeSlot({
    time,
    tier,
    selected,
    onClick,
}: {
    time: string;
    tier: 'open' | 'tight' | 'few';
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'group relative flex flex-col items-center gap-0.5 border px-4 py-2.5 transition-all duration-300',
                selected
                    ? 'border-gold bg-gold/15 text-cream'
                    : 'border-line/60 bg-ink-2/40 text-cream hover:-translate-y-0.5 hover:border-gold/50',
            )}
            aria-pressed={selected}
        >
            <span className="font-display text-base">{time}</span>
            <span
                className={cn(
                    'font-mono text-[8px] uppercase tracking-[0.3em]',
                    tier === 'open' && 'text-gold/80',
                    tier === 'tight' && 'text-cream-dim',
                    tier === 'few' && 'text-copper',
                )}
            >
                {tier === 'open' ? 'Open' : tier === 'tight' ? 'Tight' : 'Few left'}
            </span>
            {selected && (
                <motion.span
                    layoutId="time-slot-active"
                    className="absolute inset-0 border border-gold"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
            )}
        </button>
    );
}

function GuestStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
    const reduce = useReducedMotion();
    return (
        <div className="inline-flex items-center gap-3 border border-line/60 bg-ink-2/40 px-3 py-2">
            <button
                type="button"
                onClick={() => onChange(Math.max(1, value - 1))}
                disabled={value <= 1}
                className="flex h-10 w-10 items-center justify-center border border-line/60 text-cream-dim transition-colors hover:border-gold/60 hover:text-gold disabled:opacity-30"
                aria-label="Decrease"
            >
                <Minus size={14} />
            </button>
            <div className="relative h-10 w-16 overflow-hidden text-center">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={value}
                        initial={reduce ? false : { y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { y: -16, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="absolute inset-0 flex items-center justify-center font-display text-3xl text-cream"
                    >
                        {value}
                    </motion.div>
                </AnimatePresence>
            </div>
            <button
                type="button"
                onClick={() => onChange(Math.min(50, value + 1))}
                className="flex h-10 w-10 items-center justify-center border border-line/60 text-cream-dim transition-colors hover:border-gold/60 hover:text-gold"
                aria-label="Increase"
            >
                <Plus size={14} />
            </button>
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.32em] text-cream-dim">
                {value === 1 ? 'guest' : 'guests'}
            </span>
        </div>
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
            animate={
                error && !reduce
                    ? { x: [0, -6, 6, -4, 4, 0] }
                    : undefined
            }
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
                        'block w-full border bg-ink-2/40 pb-2 pl-9 pr-3 pt-6 font-sans text-base text-cream placeholder:text-cream-dim/40 focus:outline-none transition-colors',
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

function NotesField({
    register,
    value,
    error,
}: {
    register: ReturnType<ReturnType<typeof useForm<Form>>['register']>;
    value: string;
    error?: string;
}) {
    const max = 1000;
    return (
        <div className="relative">
            <textarea
                {...register}
                rows={5}
                placeholder="Window seat? Allergies? Anniversary? Anything we should know."
                className={cn(
                    'block w-full resize-none border bg-ink-2/40 p-4 font-sans text-base text-cream placeholder:text-cream-dim/50 focus:outline-none',
                    error ? 'border-copper/70' : 'border-line/60 focus:border-gold/70',
                )}
            />
            <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-[0.3em] text-cream-dim/70">
                {value.length} / {max}
            </div>
            {error && (
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.32em] text-copper">
                    {error}
                </p>
            )}
        </div>
    );
}

function SummaryCard({
    occasion,
    date,
    time,
    guests,
    name,
    notes,
    waUrl,
}: {
    occasion: (typeof OCCASIONS)[number];
    date: string;
    time: string;
    guests: number;
    name: string;
    notes: string;
    waUrl: string;
}) {
    const reduce = useReducedMotion();
    const Icon = occasion.Icon;
    const dateLabel = date
        ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
        : '—';
    return (
        <div className="md:sticky md:top-28">
            <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative overflow-hidden border border-line/60 bg-ink-2/60 p-7 backdrop-blur-sm"
            >
                {/* corner ticks */}
                <span aria-hidden className="absolute left-0 top-0 h-4 w-4 border-l border-t border-gold/60" />
                <span aria-hidden className="absolute right-0 top-0 h-4 w-4 border-r border-t border-gold/60" />
                <span aria-hidden className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-gold/60" />
                <span aria-hidden className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-gold/60" />

                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                    <span>Your booking</span>
                    <BrandMark size={28} tone="gold" />
                </div>

                <div className="mt-7 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center border border-gold/40 text-gold">
                        <Icon size={16} />
                    </span>
                    <div>
                        <div className="font-mono text-[9px] uppercase tracking-[0.32em] text-cream-dim">
                            Occasion
                        </div>
                        <div className="font-display text-xl text-cream">{occasion.label}</div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-y border-line/60 py-5">
                    <SummaryStat label="Date" value={dateLabel} />
                    <SummaryStat label="Time" value={time || '—'} />
                    <SummaryStat label="Guests" value={String(guests)} />
                    <SummaryStat label="Name" value={name || 'Walk-in'} />
                </div>

                {notes && (
                    <div className="mt-5">
                        <div className="font-mono text-[9px] uppercase tracking-[0.32em] text-cream-dim">
                            Notes
                        </div>
                        <p className="mt-1 line-clamp-3 text-sm text-cream/85">{notes}</p>
                    </div>
                )}

                <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-7 inline-flex h-12 w-full items-center justify-center gap-2 border border-line/70 bg-ink/40 px-6 font-mono text-[11px] uppercase tracking-[0.32em] text-cream transition-colors hover:border-gold/60 hover:text-gold"
                >
                    <MessageCircle size={14} />
                    Send via WhatsApp
                </a>
                <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.32em] text-cream-dim/70">
                    Updates as you fill the form
                </p>
            </motion.div>
        </div>
    );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.32em] text-cream-dim/70">
                {label}
            </div>
            <div className="mt-1 font-display text-base text-cream">{value}</div>
        </div>
    );
}

function InfoBlock({
    icon,
    title,
    lines,
}: {
    icon: React.ReactNode;
    title: string;
    lines: string[];
}) {
    return (
        <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                <span className="opacity-90">{icon}</span>
                {title}
            </div>
            <div className="mt-4 space-y-1 text-cream-dim">
                {lines.map((l) => (
                    <div key={l}>{l}</div>
                ))}
            </div>
            <span aria-hidden className="mt-4 block h-px w-10 bg-gold/40" />
        </div>
    );
}

function SuccessDialog({
    open,
    onClose,
    onAnother,
    waUrl,
}: {
    open: Form | null;
    onClose: () => void;
    onAnother: () => void;
    waUrl: string;
}) {
    const reduce = useReducedMotion();

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

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
                    {/* Confetti dots */}
                    {!reduce &&
                        Array.from({ length: 24 }).map((_, i) => (
                            <motion.span
                                key={i}
                                aria-hidden
                                initial={{ x: 0, y: 0, opacity: 0 }}
                                animate={{
                                    x: Math.cos((i / 24) * Math.PI * 2) * 240,
                                    y: Math.sin((i / 24) * Math.PI * 2) * 240,
                                    opacity: [0, 1, 0],
                                }}
                                transition={{ duration: 1.6, ease: EASE, delay: 0.05 * (i % 6) }}
                                className={cn(
                                    'absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full',
                                    i % 3 === 0 ? 'bg-gold' : i % 3 === 1 ? 'bg-cream' : 'bg-copper',
                                )}
                            />
                        ))}

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
                                Reservation received
                            </div>
                            <h3 className="mt-3 font-display text-3xl text-cream md:text-4xl">
                                A seat with your <em className="italic text-gold">name on it.</em>
                            </h3>
                            <p className="mt-3 text-cream-dim">
                                We'll confirm by phone or WhatsApp within the hour.
                            </p>
                        </div>

                        <div className="mt-7 grid grid-cols-2 gap-4 border-y border-line/60 py-5 text-center">
                            <SummaryStat
                                label="Date"
                                value={
                                    new Date(open.reservation_date + 'T00:00:00').toLocaleDateString(
                                        'en-US',
                                        { weekday: 'short', day: '2-digit', month: 'short' },
                                    )
                                }
                            />
                            <SummaryStat label="Time" value={open.reservation_time} />
                            <SummaryStat label="Guests" value={String(open.guest_count)} />
                            <SummaryStat
                                label="Occasion"
                                value={
                                    OCCASIONS.find((o) => o.value === open.occasion_type)?.label ?? '—'
                                }
                            />
                        </div>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="group inline-flex h-12 flex-1 items-center justify-center gap-2 border border-gold/70 bg-gold/10 px-6 font-mono text-[11px] uppercase tracking-[0.32em] text-cream transition-colors hover:bg-gold/20"
                            >
                                <MessageCircle size={14} />
                                Send to WhatsApp
                            </a>
                            <button
                                onClick={onAnother}
                                className="inline-flex h-12 items-center justify-center border border-line/70 px-6 font-mono text-[11px] uppercase tracking-[0.32em] text-cream-dim transition-colors hover:border-cream/40 hover:text-cream"
                            >
                                Make another
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { api, getValidationErrors } from '@/lib/api';
import { useDocumentTitle } from '@/lib/seo';
import { buildWaUrl } from '@/lib/utils';
import { useState } from 'react';

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
    const [success, setSuccess] = useState(false);

    const form = useForm<Form>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            reservation_date: '',
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
        onSuccess: () => {
            setSuccess(true);
            form.reset();
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

    const onSubmit = form.handleSubmit((v) => mut.mutate(v));

    const watchedName = form.watch('name');
    const watchedDate = form.watch('reservation_date');
    const watchedTime = form.watch('reservation_time');
    const watchedGuests = form.watch('guest_count');
    const waMessage = `Hi Raindear, I'd like to reserve a table.\nName: ${watchedName || '[your name]'}\nDate: ${watchedDate || '[date]'}\nTime: ${watchedTime || '[time]'}\nGuests: ${watchedGuests}`;
    const waUrl = buildWaUrl('6282111789089', waMessage);

    return (
        <div className="relative">
            <header className="container-editorial pt-20 pb-12 md:pt-32 md:pb-20">
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">Reservation</div>
                <h1 className="mt-4 max-w-3xl font-display text-6xl leading-[0.92] text-cream md:text-8xl">
                    Save the table.
                    <br />
                    <em className="italic text-gold">Bring the people.</em>
                </h1>
            </header>

            <section className="container-editorial grid gap-12 border-t border-line/60 py-16 md:grid-cols-12">
                <aside className="md:col-span-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">How it works</div>
                    <ol className="mt-6 space-y-6 text-cream-dim">
                        <li className="flex gap-4">
                            <span className="font-mono text-gold">01</span>
                            Submit the form. We&apos;ll confirm by phone or WhatsApp within the hour.
                        </li>
                        <li className="flex gap-4">
                            <span className="font-mono text-gold">02</span>
                            For events &gt; 10 guests, our team will contact you for a quick brief.
                        </li>
                        <li className="flex gap-4">
                            <span className="font-mono text-gold">03</span>
                            Prefer to chat? Use the WhatsApp button — your details auto-fill.
                        </li>
                    </ol>

                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-10 inline-flex h-12 items-center border border-gold/70 bg-gold/10 px-6 font-mono text-[11px] uppercase tracking-[0.32em] text-cream hover:bg-gold/20"
                    >
                        Open in WhatsApp
                    </a>
                </aside>

                <form onSubmit={onSubmit} className="md:col-span-7 space-y-6">
                    {success && (
                        <div className="border border-gold/60 bg-gold/10 p-4 font-mono text-[11px] uppercase tracking-[0.32em] text-cream">
                            Reservation received. We&apos;ll be in touch shortly.
                        </div>
                    )}
                    <Field label="Name" error={form.formState.errors.name?.message}>
                        <input {...form.register('name')} className={inputClass} placeholder="Your name" />
                    </Field>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Field label="Phone / WhatsApp" error={form.formState.errors.phone?.message}>
                            <input {...form.register('phone')} className={inputClass} placeholder="+62 8xx" />
                        </Field>
                        <Field label="Email (optional)" error={form.formState.errors.email?.message}>
                            <input type="email" {...form.register('email')} className={inputClass} placeholder="you@email.com" />
                        </Field>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        <Field label="Date" error={form.formState.errors.reservation_date?.message}>
                            <input type="date" {...form.register('reservation_date')} className={inputClass} />
                        </Field>
                        <Field label="Time" error={form.formState.errors.reservation_time?.message}>
                            <input type="time" {...form.register('reservation_time')} className={inputClass} />
                        </Field>
                        <Field label="Guests" error={form.formState.errors.guest_count?.message}>
                            <input type="number" min={1} {...form.register('guest_count')} className={inputClass} />
                        </Field>
                    </div>
                    <Field label="Occasion">
                        <select {...form.register('occasion_type')} className={inputClass}>
                            <option value="casual">Casual</option>
                            <option value="date">Date</option>
                            <option value="family">Family</option>
                            <option value="meeting">Meeting</option>
                            <option value="birthday">Birthday</option>
                            <option value="celebration">Celebration</option>
                        </select>
                    </Field>
                    <Field label="Notes" error={form.formState.errors.notes?.message}>
                        <textarea
                            {...form.register('notes')}
                            rows={3}
                            className={inputClass}
                            placeholder="Anything we should know? Allergies, seat preferences, surprise plans…"
                        />
                    </Field>

                    <div className="flex flex-wrap items-center gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={mut.isPending}
                            className="group relative inline-flex h-12 items-center px-7 font-mono text-[11px] uppercase tracking-[0.32em] text-cream"
                        >
                            <span className="absolute inset-0 -z-10 border border-gold/70 bg-gold/10 transition-all group-hover:bg-gold/20 group-hover:glow-gold" />
                            {mut.isPending ? 'Submitting…' : 'Submit reservation'}
                        </button>
                        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">
                            We confirm within an hour
                        </span>
                    </div>
                </form>
            </section>
        </div>
    );
}

const inputClass =
    'block w-full border-0 border-b border-line bg-transparent py-3 font-sans text-base text-cream placeholder:text-cream-dim/60 focus:border-gold focus:outline-none focus:ring-0';

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
    return (
        <label className="block">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">{label}</div>
            <div className="mt-1">{children}</div>
            {error && <div className="mt-1 font-mono text-[11px] text-copper">{error}</div>}
        </label>
    );
}

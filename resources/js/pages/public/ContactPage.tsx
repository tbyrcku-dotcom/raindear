import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { api, getValidationErrors } from '@/lib/api';
import { useDocumentTitle } from '@/lib/seo';
import { buildWaUrl } from '@/lib/utils';

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(5, 'Tell us a bit more'),
});
type Form = z.infer<typeof schema>;

export default function ContactPage() {
    useDocumentTitle('Contact — Raindear');
    const [success, setSuccess] = useState(false);
    const form = useForm<Form>({ resolver: zodResolver(schema) });
    const mut = useMutation({
        mutationFn: async (v: Form) => (await api.post('/contact-messages', v)).data,
        onSuccess: () => { setSuccess(true); form.reset(); },
        onError: (err) => {
            const e = getValidationErrors(err);
            if (e) Object.entries(e).forEach(([k, v]) => form.setError(k as keyof Form, { message: v[0] }));
        },
    });

    return (
        <div className="relative">
            <header className="container-editorial pt-20 pb-12 md:pt-32">
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">Contact</div>
                <h1 className="mt-4 max-w-3xl font-display text-6xl leading-[0.92] text-cream md:text-8xl">
                    Talk to us, <em className="italic text-gold">anytime.</em>
                </h1>
            </header>

            <section className="container-editorial grid gap-12 border-t border-line/60 py-16 md:grid-cols-12">
                <div className="md:col-span-5 space-y-8">
                    <Item icon={MapPin} title="Visit">
                        Jl. Bina Marga No.7, Baranangsiang,<br />
                        Bogor Timur, Jawa Barat 16143
                    </Item>
                    <Item icon={Phone} title="Call">
                        <a className="hover:text-cream" href="tel:+6282111789089">+62 821-1178-9089</a>
                        <br />
                        <a
                            className="hover:text-cream"
                            href={buildWaUrl('6282111789089', "Hi Raindear, I'd like to ask about ")}
                            target="_blank"
                            rel="noreferrer"
                        >
                            WhatsApp
                        </a>
                    </Item>
                    <Item icon={Mail} title="Email">
                        <a className="hover:text-cream" href="mailto:mkt.raindear@gmail.com">mkt.raindear@gmail.com</a>
                    </Item>
                    <Item icon={Clock} title="Hours">
                        Open daily · 09:00 — 23:00
                        <br /> Fri &amp; Sat until midnight
                    </Item>
                </div>

                <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="md:col-span-7 space-y-6">
                    {success && (
                        <div className="border border-gold/60 bg-gold/10 p-4 font-mono text-[11px] uppercase tracking-[0.32em] text-cream">
                            Message sent. We&apos;ll reply within a day.
                        </div>
                    )}
                    <Field label="Name" error={form.formState.errors.name?.message}>
                        <input {...form.register('name')} className={inputClass} />
                    </Field>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Field label="Email" error={form.formState.errors.email?.message}>
                            <input type="email" {...form.register('email')} className={inputClass} />
                        </Field>
                        <Field label="Phone (optional)" error={form.formState.errors.phone?.message}>
                            <input {...form.register('phone')} className={inputClass} />
                        </Field>
                    </div>
                    <Field label="Subject" error={form.formState.errors.subject?.message}>
                        <input {...form.register('subject')} className={inputClass} placeholder="Catering, partnership, press…" />
                    </Field>
                    <Field label="Message" error={form.formState.errors.message?.message}>
                        <textarea {...form.register('message')} rows={5} className={inputClass} />
                    </Field>
                    <button
                        type="submit"
                        disabled={mut.isPending}
                        className="inline-flex h-12 items-center border border-gold/70 bg-gold/10 px-7 font-mono text-[11px] uppercase tracking-[0.32em] text-cream hover:bg-gold/20"
                    >
                        {mut.isPending ? 'Sending…' : 'Send message'}
                    </button>
                </form>
            </section>

            <section className="container-editorial border-t border-line/60 py-16">
                <div className="aspect-[16/7] w-full border border-line/60 bg-ink-2 overflow-hidden">
                    <iframe
                        title="Raindear Bogor map"
                        src="https://maps.google.com/maps?q=Raindear%20Coffee%20Bogor%20Baranangsiang&t=&z=16&ie=UTF8&iwloc=&output=embed"
                        className="h-full w-full grayscale-[40%]"
                        loading="lazy"
                    />
                </div>
            </section>
        </div>
    );
}

const inputClass =
    'block w-full border-0 border-b border-line bg-transparent py-3 font-sans text-base text-cream placeholder:text-cream-dim/60 focus:border-gold focus:outline-none focus:ring-0';

function Item({ icon: Icon, title, children }: { icon: typeof MapPin; title: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center gap-3">
                <Icon size={16} className="text-gold" strokeWidth={1.5} />
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">{title}</div>
            </div>
            <div className="mt-2 text-cream-dim">{children}</div>
        </div>
    );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
    return (
        <label className="block">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">{label}</div>
            <div className="mt-1">{children}</div>
            {error && <div className="mt-1 font-mono text-[11px] text-copper">{error}</div>}
        </label>
    );
}

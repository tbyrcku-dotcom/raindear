import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { DeerMark } from '@/components/deer/DeerMark';
import { api, ensureCsrf, getValidationErrors } from '@/lib/api';
import { useDocumentTitle } from '@/lib/seo';

const schema = z.object({ email: z.string().email(), password: z.string().min(4), remember: z.boolean().optional() });
type Form = z.infer<typeof schema>;

export default function AdminLogin() {
    useDocumentTitle('Admin · Sign in');
    const nav = useNavigate();
    const form = useForm<Form>({ resolver: zodResolver(schema) });

    const mut = useMutation({
        mutationFn: async (v: Form) => {
            await ensureCsrf();
            const r = await api.post('/admin/login', v);
            return r.data;
        },
        onSuccess: () => nav('/admin'),
        onError: (err) => {
            const e = getValidationErrors(err);
            if (e) Object.entries(e).forEach(([k, v]) => form.setError(k as keyof Form, { message: v[0] }));
        },
    });

    return (
        <div className="grain flex min-h-screen items-center justify-center bg-ink px-6">
            <div className="w-full max-w-sm">
                <div className="flex items-center gap-3">
                    <DeerMark size={36} stroke="var(--color-gold)" />
                    <span className="font-display text-2xl text-cream">Raindear · Admin</span>
                </div>
                <h1 className="mt-10 font-display text-4xl text-cream">Sign in.</h1>
                <p className="mt-2 text-sm text-cream-dim">Use your provisioned admin account.</p>
                <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="mt-8 space-y-5">
                    <Field label="Email" error={form.formState.errors.email?.message}>
                        <input type="email" {...form.register('email')} className={inputClass} />
                    </Field>
                    <Field label="Password" error={form.formState.errors.password?.message}>
                        <input type="password" {...form.register('password')} className={inputClass} />
                    </Field>
                    <label className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">
                        <input type="checkbox" {...form.register('remember')} className="accent-[var(--color-gold)]" /> Remember me
                    </label>
                    <button
                        type="submit"
                        disabled={mut.isPending}
                        className="inline-flex h-12 w-full items-center justify-center border border-gold/70 bg-gold/10 px-7 font-mono text-[11px] uppercase tracking-[0.32em] text-cream hover:bg-gold/20"
                    >
                        {mut.isPending ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
}

const inputClass =
    'block w-full border-0 border-b border-line bg-transparent py-3 font-sans text-base text-cream focus:border-gold focus:outline-none';

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
    return (
        <label className="block">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">{label}</div>
            <div className="mt-1">{children}</div>
            {error && <div className="mt-1 font-mono text-[11px] text-copper">{error}</div>}
        </label>
    );
}

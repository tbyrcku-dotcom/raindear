import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import { useDocumentTitle } from '@/lib/seo';
import { cn } from '@/lib/utils';
import type { ContactMessage } from '@/types';

const STATUSES: ContactMessage['status'][] = ['unread', 'read', 'archived'];

export default function AdminMessages() {
    useDocumentTitle('Messages · Raindear Admin');
    const [status, setStatus] = useState('');
    const qc = useQueryClient();
    const { data } = useQuery({
        queryKey: qk.adminMessages({ status }),
        queryFn: async () => (await api.get<{ data: ContactMessage[] }>('/admin/contact-messages', { params: { status: status || undefined } })).data.data,
    });
    const update = useMutation({
        mutationFn: async ({ id, status: s }: { id: number; status: ContactMessage['status'] }) =>
            api.patch(`/admin/contact-messages/${id}`, { status: s }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'contact-messages'] }),
    });

    return (
        <div>
            <h1 className="font-display text-4xl text-cream">Messages</h1>
            <div className="mt-6 flex gap-6 border-b border-line/60 pb-3">
                {[''].concat(STATUSES).map((s) => (
                    <button
                        key={s || 'all'}
                        onClick={() => setStatus(s)}
                        className={cn('font-mono text-[11px] uppercase tracking-[0.32em]', status === s ? 'text-cream' : 'text-cream-dim hover:text-cream')}
                    >
                        {s || 'All'}
                    </button>
                ))}
            </div>

            <div className="mt-6 space-y-4">
                {(data ?? []).map((m) => (
                    <article key={m.id} className="border border-line/60 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <div className="text-cream">{m.name}</div>
                                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">{m.email} · {m.phone ?? '—'}</div>
                            </div>
                            <select
                                value={m.status}
                                onChange={(e) => update.mutate({ id: m.id, status: e.target.value as ContactMessage['status'] })}
                                className="border-0 border-b border-line bg-transparent py-1 font-mono text-xs uppercase tracking-[0.32em] text-cream focus:border-gold focus:outline-none"
                            >
                                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        {m.subject && <div className="mt-3 font-display text-xl text-cream">{m.subject}</div>}
                        <p className="mt-2 text-cream-dim">{m.message}</p>
                    </article>
                ))}
                {(data ?? []).length === 0 && (
                    <div className="border border-line/60 p-10 text-center text-cream-dim">No messages.</div>
                )}
            </div>
        </div>
    );
}

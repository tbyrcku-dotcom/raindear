import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import { useDocumentTitle } from '@/lib/seo';
import type { EventInquiry } from '@/types';

const STATUSES = ['pending', 'in_progress', 'confirmed', 'cancelled', 'completed'];

export default function AdminEventInquiries() {
    useDocumentTitle('Event inquiries · Raindear Admin');
    const qc = useQueryClient();
    const { data } = useQuery({
        queryKey: qk.adminEventInquiries(),
        queryFn: async () => (await api.get<{ data: EventInquiry[] }>('/admin/event-inquiries')).data.data,
    });
    const update = useMutation({
        mutationFn: async ({ id, status: s }: { id: number; status: string }) => api.patch(`/admin/event-inquiries/${id}`, { status: s }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'event-inquiries'] }),
    });

    return (
        <div>
            <h1 className="font-display text-4xl text-cream">Event inquiries</h1>
            <div className="mt-6 space-y-4">
                {(data ?? []).map((e) => (
                    <article key={e.id} className="border border-line/60 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <div className="font-display text-xl text-cream">{e.name}</div>
                                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                                    {e.event_type} · {e.event_date ?? 'TBD'} · {e.guest_count ?? '?'} guests
                                </div>
                            </div>
                            <select
                                value={e.status}
                                onChange={(ev) => update.mutate({ id: e.id, status: ev.target.value })}
                                className="border-0 border-b border-line bg-transparent py-1 font-mono text-xs uppercase tracking-[0.32em] text-cream focus:border-gold focus:outline-none"
                            >
                                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="mt-3 text-cream-dim">{e.phone}</div>
                        {e.notes && <p className="mt-3 text-cream-dim">{e.notes}</p>}
                    </article>
                ))}
                {(data ?? []).length === 0 && (
                    <div className="border border-line/60 p-10 text-center text-cream-dim">No inquiries.</div>
                )}
            </div>
        </div>
    );
}

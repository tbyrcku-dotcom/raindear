import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import { useDocumentTitle } from '@/lib/seo';
import { cn } from '@/lib/utils';
import type { Reservation } from '@/types';

const STATUSES: Reservation['status'][] = ['pending', 'confirmed', 'completed', 'cancelled'];

export default function AdminReservations() {
    useDocumentTitle('Reservations · Raindear Admin');
    const [status, setStatus] = useState<string>('');
    const qc = useQueryClient();
    const { data } = useQuery({
        queryKey: qk.adminReservations({ status }),
        queryFn: async () => (await api.get<{ data: Reservation[] }>('/admin/reservations', { params: { status: status || undefined } })).data.data,
    });
    const update = useMutation({
        mutationFn: async ({ id, status: s }: { id: number; status: Reservation['status'] }) =>
            api.patch(`/admin/reservations/${id}`, { status: s }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'reservations'] }),
    });

    return (
        <div>
            <h1 className="font-display text-4xl text-cream">Reservations</h1>
            <div className="mt-6 flex gap-6 border-b border-line/60 pb-3">
                {[''].concat(STATUSES).map((s) => (
                    <button
                        key={s || 'all'}
                        onClick={() => setStatus(s)}
                        className={cn(
                            'font-mono text-[11px] uppercase tracking-[0.32em]',
                            status === s ? 'text-cream' : 'text-cream-dim hover:text-cream',
                        )}
                    >
                        {s || 'All'}
                    </button>
                ))}
            </div>

            <div className="mt-6 overflow-hidden border border-line/60">
                <table className="w-full divide-y divide-line/60">
                    <thead className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">
                        <tr>
                            <th className="px-4 py-3 text-left">Guest</th>
                            <th className="px-4 py-3 text-left">When</th>
                            <th className="px-4 py-3 text-left">Phone</th>
                            <th className="px-4 py-3 text-left">Pax</th>
                            <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-line/60">
                        {(data ?? []).map((r) => (
                            <tr key={r.id} className="hover:bg-ink-3">
                                <td className="px-4 py-3 text-cream">
                                    {r.name}
                                    {r.occasion_type && (
                                        <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.4em] text-gold">{r.occasion_type}</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-cream-dim font-mono text-xs">{r.reservation_date} · {r.reservation_time?.slice(0, 5)}</td>
                                <td className="px-4 py-3 text-cream-dim">{r.phone}</td>
                                <td className="px-4 py-3 text-cream">{r.guest_count}</td>
                                <td className="px-4 py-3">
                                    <select
                                        value={r.status}
                                        onChange={(e) => update.mutate({ id: r.id, status: e.target.value as Reservation['status'] })}
                                        className="border-0 border-b border-line bg-transparent py-1 font-mono text-xs uppercase tracking-[0.32em] text-cream focus:border-gold focus:outline-none"
                                    >
                                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {(data ?? []).length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-8 text-center text-cream-dim">No reservations.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

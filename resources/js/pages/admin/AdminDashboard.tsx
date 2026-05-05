import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import { useDocumentTitle } from '@/lib/seo';

type Dash = {
    menu_items_total: number;
    reservations_pending: number;
    reservations_today: number;
    unread_messages: number;
    active_promotions: number;
    recent_reservations: { id: number; name: string; reservation_date: string; reservation_time: string; status: string }[];
    recent_messages: { id: number; name: string; subject: string | null; created_at: string }[];
};

export default function AdminDashboard() {
    useDocumentTitle('Dashboard · Raindear Admin');
    const { data } = useQuery({
        queryKey: qk.adminDashboard,
        queryFn: async () => (await api.get<{ data: Dash }>('/admin/dashboard')).data.data,
    });

    const stats = [
        { label: 'Menu items', value: data?.menu_items_total ?? 0 },
        { label: 'Pending reservations', value: data?.reservations_pending ?? 0 },
        { label: "Today's reservations", value: data?.reservations_today ?? 0 },
        { label: 'Unread messages', value: data?.unread_messages ?? 0 },
        { label: 'Active promotions', value: data?.active_promotions ?? 0 },
    ];

    return (
        <div>
            <h1 className="font-display text-4xl text-cream">Overview</h1>
            <p className="mt-2 text-cream-dim">Today at a glance.</p>

            <section className="mt-10 grid gap-px overflow-hidden border border-line/60 sm:grid-cols-2 lg:grid-cols-5">
                {stats.map((s) => (
                    <div key={s.label} className="bg-ink-2 p-6">
                        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">{s.label}</div>
                        <div className="mt-3 font-display text-5xl text-cream">{s.value}</div>
                    </div>
                ))}
            </section>

            <div className="mt-12 grid gap-12 md:grid-cols-2">
                <section>
                    <h2 className="font-display text-2xl text-cream">Recent reservations</h2>
                    <ul className="mt-4 divide-y divide-line/60 border border-line/60">
                        {(data?.recent_reservations ?? []).map((r) => (
                            <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-3">
                                <div>
                                    <div className="text-cream">{r.name}</div>
                                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">
                                        {r.reservation_date} · {r.reservation_time}
                                    </div>
                                </div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">{r.status}</span>
                            </li>
                        ))}
                        {(data?.recent_reservations ?? []).length === 0 && (
                            <li className="px-4 py-6 text-center text-cream-dim">No reservations yet.</li>
                        )}
                    </ul>
                </section>
                <section>
                    <h2 className="font-display text-2xl text-cream">Recent messages</h2>
                    <ul className="mt-4 divide-y divide-line/60 border border-line/60">
                        {(data?.recent_messages ?? []).map((m) => (
                            <li key={m.id} className="px-4 py-3">
                                <div className="text-cream">{m.name}</div>
                                <div className="text-cream-dim">{m.subject ?? '—'}</div>
                            </li>
                        ))}
                        {(data?.recent_messages ?? []).length === 0 && (
                            <li className="px-4 py-6 text-center text-cream-dim">No messages yet.</li>
                        )}
                    </ul>
                </section>
            </div>
        </div>
    );
}

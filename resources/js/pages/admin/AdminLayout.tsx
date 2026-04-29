import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';

import { DeerMark } from '@/components/deer/DeerMark';
import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import { cn } from '@/lib/utils';
import type { ApiResource, AdminUser } from '@/types';

const NAV = [
    { to: '/admin', label: 'Overview', end: true },
    { to: '/admin/menu-items', label: 'Menu items' },
    { to: '/admin/gallery', label: 'Gallery' },
    { to: '/admin/reservations', label: 'Reservations' },
    { to: '/admin/event-inquiries', label: 'Event inquiries' },
    { to: '/admin/messages', label: 'Messages' },
];

export default function AdminLayout() {
    const location = useLocation();
    const qc = useQueryClient();
    const meQ = useQuery({
        queryKey: qk.me,
        queryFn: async () => (await api.get<ApiResource<AdminUser>>('/admin/me')).data.data,
        retry: false,
    });

    const logout = useMutation({
        mutationFn: async () => api.post('/admin/logout'),
        onSuccess: () => {
            qc.removeQueries({ queryKey: qk.me });
            window.location.href = '/admin/login';
        },
    });

    if (meQ.isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-ink">
                <DeerMark size={48} stroke="var(--color-gold)" animated />
            </div>
        );
    }
    if (meQ.isError) {
        return <Navigate to="/admin/login" replace state={{ from: location }} />;
    }

    return (
        <div className="grain min-h-screen bg-ink text-cream">
            <header className="sticky top-0 z-30 border-b border-line/60 bg-ink/85 backdrop-blur">
                <div className="container-editorial flex h-16 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <DeerMark size={28} stroke="var(--color-gold)" />
                        <span className="font-display text-xl text-cream">Raindear</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">Admin</span>
                    </div>
                    <div className="flex items-center gap-5">
                        <span className="hidden font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim md:inline">
                            {meQ.data?.name} · {meQ.data?.role}
                        </span>
                        <button
                            onClick={() => logout.mutate()}
                            className="inline-flex h-9 items-center gap-2 border border-line px-3 font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim hover:text-cream hover:border-cream/40"
                        >
                            <LogOut size={12} /> Sign out
                        </button>
                    </div>
                </div>
                <nav className="container-editorial flex gap-6 overflow-x-auto py-3 text-cream-dim">
                    {NAV.map((n) => (
                        <NavLink
                            key={n.to}
                            to={n.to}
                            end={n.end}
                            className={({ isActive }) =>
                                cn(
                                    'whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.32em]',
                                    isActive ? 'text-cream' : 'hover:text-cream',
                                )
                            }
                        >
                            {n.label}
                        </NavLink>
                    ))}
                </nav>
            </header>
            <main className="container-editorial py-10">
                <Outlet />
            </main>
        </div>
    );
}

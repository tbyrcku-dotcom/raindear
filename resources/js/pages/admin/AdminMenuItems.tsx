import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import { useDocumentTitle } from '@/lib/seo';
import { formatIDR } from '@/lib/utils';
import type { ApiCollection, MenuCategory, MenuItem } from '@/types';

type FormState = {
    id?: number;
    menu_category_id: number;
    name: string;
    price: number;
    description: string;
    is_signature: boolean;
    is_popular: boolean;
    is_new: boolean;
    is_available: boolean;
};

const empty = (catId: number): FormState => ({
    menu_category_id: catId,
    name: '',
    price: 0,
    description: '',
    is_signature: false,
    is_popular: false,
    is_new: false,
    is_available: true,
});

export default function AdminMenuItems() {
    useDocumentTitle('Menu items · Raindear Admin');
    const qc = useQueryClient();
    const [form, setForm] = useState<FormState | null>(null);

    const itemsQ = useQuery({
        queryKey: qk.adminMenuItems(),
        queryFn: async () => (await api.get<{ data: MenuItem[] }>('/admin/menu-items')).data.data,
    });
    const catsQ = useQuery({
        queryKey: qk.adminCategories,
        queryFn: async () => (await api.get<ApiCollection<MenuCategory>>('/admin/menu-categories')).data.data,
    });

    const save = useMutation({
        mutationFn: async (f: FormState) => {
            if (f.id) {
                return api.put(`/admin/menu-items/${f.id}`, f);
            }
            return api.post('/admin/menu-items', f);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin', 'menu-items'] });
            setForm(null);
        },
    });

    const remove = useMutation({
        mutationFn: async (id: number) => api.delete(`/admin/menu-items/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'menu-items'] }),
    });

    const items = itemsQ.data ?? [];
    const cats = catsQ.data ?? [];

    return (
        <div>
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-4xl text-cream">Menu items</h1>
                    <p className="mt-2 text-cream-dim">{items.length} items across {cats.length} categories.</p>
                </div>
                <button
                    onClick={() => setForm(empty(cats[0]?.id ?? 1))}
                    className="inline-flex h-10 items-center border border-gold/70 bg-gold/10 px-5 font-mono text-[11px] uppercase tracking-[0.32em] text-cream hover:bg-gold/20"
                >
                    New item
                </button>
            </header>

            <div className="mt-8 overflow-hidden border border-line/60">
                <table className="w-full divide-y divide-line/60">
                    <thead>
                        <tr className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Category</th>
                            <th className="px-4 py-3 text-right">Price</th>
                            <th className="px-4 py-3 text-left">Tags</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-line/60">
                        {items.map((it) => (
                            <tr key={it.id} className="hover:bg-ink-3">
                                <td className="px-4 py-3 text-cream">{it.name}</td>
                                <td className="px-4 py-3 text-cream-dim">{it.category?.name}</td>
                                <td className="px-4 py-3 text-right font-mono text-gold">{formatIDR(it.price)}</td>
                                <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cream-dim">
                                    {[
                                        it.is_signature && 'Signature',
                                        it.is_popular && 'Popular',
                                        it.is_new && 'New',
                                        !it.is_available && 'Hidden',
                                    ].filter(Boolean).join(' · ')}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold hover:text-gold-soft"
                                        onClick={() => setForm({
                                            id: it.id,
                                            menu_category_id: it.menu_category_id,
                                            name: it.name,
                                            price: it.price,
                                            description: it.description ?? '',
                                            is_signature: it.is_signature,
                                            is_popular: it.is_popular,
                                            is_new: it.is_new,
                                            is_available: it.is_available,
                                        })}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="ml-4 font-mono text-[10px] uppercase tracking-[0.4em] text-copper hover:text-copper/80"
                                        onClick={() => confirm(`Delete ${it.name}?`) && remove.mutate(it.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {form && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/85 p-6 backdrop-blur" onClick={() => setForm(null)}>
                    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl border border-line bg-ink-2 p-8">
                        <h2 className="font-display text-2xl text-cream">{form.id ? 'Edit item' : 'New item'}</h2>
                        <div className="mt-6 grid gap-5">
                            <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                            <div className="grid grid-cols-2 gap-5">
                                <Input label="Price (IDR)" type="number" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) })} />
                                <label className="block">
                                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">Category</div>
                                    <select
                                        value={form.menu_category_id}
                                        onChange={(e) => setForm({ ...form, menu_category_id: Number(e.target.value) })}
                                        className="mt-1 block w-full border-0 border-b border-line bg-transparent py-3 text-cream focus:border-gold focus:outline-none"
                                    >
                                        {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </label>
                            </div>
                            <Input label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
                            <div className="grid grid-cols-2 gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim sm:grid-cols-4">
                                {(['is_signature', 'is_popular', 'is_new', 'is_available'] as const).map((k) => (
                                    <label key={k} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={form[k]}
                                            onChange={(e) => setForm({ ...form, [k]: e.target.checked })}
                                            className="accent-[var(--color-gold)]"
                                        />
                                        {k.replace('is_', '').replace('_', ' ')}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end gap-3">
                            <button onClick={() => setForm(null)} className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim hover:text-cream">
                                Cancel
                            </button>
                            <button
                                onClick={() => save.mutate(form)}
                                disabled={save.isPending}
                                className="inline-flex h-10 items-center border border-gold/70 bg-gold/10 px-5 font-mono text-[11px] uppercase tracking-[0.32em] text-cream hover:bg-gold/20"
                            >
                                {save.isPending ? 'Saving…' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
    return (
        <label className="block">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">{label}</div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 block w-full border-0 border-b border-line bg-transparent py-3 text-cream focus:border-gold focus:outline-none"
            />
        </label>
    );
}

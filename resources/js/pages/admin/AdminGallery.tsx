import { useQuery } from '@tanstack/react-query';

import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import { useDocumentTitle } from '@/lib/seo';
import type { GalleryAsset } from '@/types';

export default function AdminGallery() {
    useDocumentTitle('Gallery · Raindear Admin');
    const { data } = useQuery({
        queryKey: qk.adminGallery(),
        queryFn: async () => (await api.get<{ data: GalleryAsset[] }>('/admin/gallery-assets')).data.data,
    });

    return (
        <div>
            <h1 className="font-display text-4xl text-cream">Gallery</h1>
            <p className="mt-2 text-cream-dim">
                Upload and manage gallery assets. Replace placeholder paths with licensed Raindear photography
                via the API <code className="font-mono text-xs text-gold">POST /api/v1/admin/gallery-assets</code>.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {(data ?? []).map((g) => (
                    <div key={g.id} className="space-y-2">
                        <ImageWithFallback src={g.image_url ?? undefined} alt={g.alt_text} className="aspect-square w-full" />
                        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">{g.category}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

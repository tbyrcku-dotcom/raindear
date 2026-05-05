import { Link } from 'react-router-dom';

import { DeerMark } from '@/components/deer/DeerMark';
import { useDocumentTitle } from '@/lib/seo';

export default function NotFoundPage() {
    useDocumentTitle('Not found — Raindear');
    return (
        <div className="grain flex min-h-screen items-center justify-center bg-ink px-6">
            <div className="max-w-md text-center">
                <DeerMark size={80} stroke="var(--color-gold)" className="mx-auto" />
                <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.4em] text-gold">404</div>
                <h1 className="mt-3 font-display text-5xl text-cream">Path not on the map.</h1>
                <p className="mt-3 text-cream-dim">The page you&apos;re looking for has wandered off.</p>
                <Link
                    to="/"
                    className="mt-8 inline-flex h-12 items-center border border-gold/70 bg-gold/10 px-6 font-mono text-[11px] uppercase tracking-[0.32em] text-cream hover:bg-gold/20"
                >
                    Back home
                </Link>
            </div>
        </div>
    );
}

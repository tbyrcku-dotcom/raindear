import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
    eyebrow?: string;
    title: ReactNode;
    description?: ReactNode;
    align?: 'left' | 'center';
    className?: string;
};

/**
 * Editorial section header. Eyebrow is mono uppercase, title is display serif,
 * description is restrained sans. Hierarchy never changes — that's the point.
 */
export function SectionHeader({ eyebrow, title, description, align = 'left', className }: Props) {
    return (
        <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
            {eyebrow && (
                <div className="mb-5 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                    <span aria-hidden className="h-px w-8 bg-gold/60" />
                    {eyebrow}
                </div>
            )}
            <h2 className="text-balance text-4xl leading-[0.98] sm:text-5xl md:text-6xl">{title}</h2>
            {description && (
                <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-cream-dim sm:text-lg">
                    {description}
                </p>
            )}
        </div>
    );
}

import { ImgHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

type Props = ImgHTMLAttributes<HTMLImageElement> & {
    fallbackTone?: 'gold' | 'copper' | 'coffee';
};

export function ImageWithFallback({ src, alt, className, fallbackTone = 'gold', ...rest }: Props) {
    const [errored, setErrored] = useState(!src);
    const [loaded, setLoaded] = useState(false);

    if (errored || !src) {
        const tone = fallbackTone === 'copper' ? 'from-copper/30' : fallbackTone === 'coffee' ? 'from-coffee/30' : 'from-gold/30';
        return (
            <div
                role="img"
                aria-label={alt}
                className={cn(
                    'relative overflow-hidden bg-ink-2',
                    `bg-gradient-to-br ${tone} via-ink-2 to-ink`,
                    className,
                )}
            >
                <div className="absolute inset-0 flex items-center justify-center text-cream/30">
                    <svg viewBox="0 0 100 100" className="h-12 w-12 opacity-40" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M50 80 V55 M40 55 H60 M50 55 V40 M50 40 C40 36 36 30 36 24 M50 40 C60 36 64 30 64 24" />
                    </svg>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('relative overflow-hidden', className)}>
            {!loaded && <div className="absolute inset-0 skeleton" />}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onError={() => setErrored(true)}
                onLoad={() => setLoaded(true)}
                className={cn(
                    'h-full w-full object-cover transition-opacity duration-700',
                    loaded ? 'opacity-100' : 'opacity-0',
                )}
                {...rest}
            />
        </div>
    );
}

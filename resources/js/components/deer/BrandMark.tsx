import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type Tone = 'cream' | 'gold' | 'white';

type Props = {
    size?: number;
    tone?: Tone;
    className?: string;
    animated?: boolean;
};

const toneSrc: Record<Tone, string> = {
    cream: '/images/brand/raindear-deer-cream.png',
    gold: '/images/brand/raindear-deer-gold.png',
    white: '/images/brand/raindear-deer.png',
};

/**
 * Official Raindear deer head, recolored to the chosen brand tone.
 * Replaces the older `DeerMark` line-art for navbar/footer use.
 */
export function BrandMark({ size = 32, tone = 'cream', className, animated = false }: Props) {
    const img = (
        <img
            src={toneSrc[tone]}
            alt="Raindear"
            width={size}
            height={size}
            className={cn('block select-none', className)}
            style={{ width: size, height: size, objectFit: 'contain' }}
            draggable={false}
        />
    );

    if (!animated) return img;

    return (
        <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
        >
            {img}
        </motion.span>
    );
}

type LockupProps = {
    height?: number;
    tone?: Tone;
    className?: string;
};

const lockupSrc: Record<Tone, string> = {
    cream: '/images/brand/raindear-logo-cream.png',
    gold: '/images/brand/raindear-logo-gold.png',
    white: '/images/brand/raindear-logo-white.png',
};

/**
 * Full Raindear lockup — deer + RAINDEAR + COFFEE & KITCHEN — recolored.
 * Use sparingly: hero watermarks, intro loader, splash.
 */
export function BrandLockup({ height = 80, tone = 'cream', className }: LockupProps) {
    return (
        <img
            src={lockupSrc[tone]}
            alt="Raindear Coffee & Kitchen"
            height={height}
            className={cn('block select-none', className)}
            style={{ height, width: 'auto', objectFit: 'contain' }}
            draggable={false}
        />
    );
}

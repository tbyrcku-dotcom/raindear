import { motion } from 'framer-motion';

type Props = {
    size?: number;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
    animated?: boolean;
};

/**
 * Line-art deer mark used as the brand watermark, loader core,
 * and small accent. Drawn from a single SVG path to keep weight low
 * and to support stroke-dasharray reveal animation.
 */
export function DeerMark({
    size = 96,
    stroke = 'currentColor',
    strokeWidth = 1.4,
    className,
    animated = false,
}: Props) {
    const path =
        'M50 88 V60 M40 60 V52 M60 60 V52 M40 52 H60 M50 52 V44 ' +
        'M50 44 C42 40 38 36 38 28 C38 22 32 16 28 12 C30 18 30 22 32 26 ' +
        'C26 22 22 14 18 8 C20 18 22 24 28 30 C20 28 14 24 10 20 ' +
        'C16 28 22 32 30 36 C24 38 18 36 12 32 C20 38 28 40 36 40 ' +
        'M50 44 C58 40 62 36 62 28 C62 22 68 16 72 12 C70 18 70 22 68 26 ' +
        'C74 22 78 14 82 8 C80 18 78 24 72 30 C80 28 86 24 90 20 ' +
        'C84 28 78 32 70 36 C76 38 82 36 88 32 C80 38 72 40 64 40 ' +
        'M44 48 C46 47 48 47 50 47 C52 47 54 47 56 48';

    if (!animated) {
        return (
            <svg
                viewBox="0 0 100 100"
                width={size}
                height={size}
                className={className}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d={path} />
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 100 100"
            width={size}
            height={size}
            className={className}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <motion.path
                d={path}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
        </svg>
    );
}

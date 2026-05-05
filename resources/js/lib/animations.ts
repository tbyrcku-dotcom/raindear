import { Variants } from 'framer-motion';

export const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.0, ease } },
};

export const stagger = (delay = 0.06): Variants => ({
    hidden: {},
    visible: { transition: { staggerChildren: delay, delayChildren: 0.05 } },
});

export const lineReveal: Variants = {
    hidden: { y: '110%' },
    visible: { y: 0, transition: { duration: 0.9, ease } },
};

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

import { fadeUp } from '@/lib/animations';

type Props = {
    children: ReactNode;
    delay?: number;
    className?: string;
    as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'span' | 'li';
};

export function AnimatedReveal({ children, delay = 0, className, as = 'div' }: Props) {
    const reduce = useReducedMotion();
    const Component = motion[as];
    return (
        <Component
            className={className}
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-12% 0px' }}
            variants={fadeUp}
            transition={{ delay }}
        >
            {children}
        </Component>
    );
}

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { DeerMark } from '../deer/DeerMark';

const SEEN_KEY = 'raindear:intro-seen';

export function IntroLoader() {
    const [show, setShow] = useState(() => {
        if (typeof window === 'undefined') return false;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
        return !sessionStorage.getItem(SEEN_KEY);
    });

    useEffect(() => {
        if (!show) return;
        const t = window.setTimeout(() => {
            sessionStorage.setItem(SEEN_KEY, '1');
            setShow(false);
        }, 1500);
        return () => window.clearTimeout(t);
    }, [show]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="intro"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
                    role="status"
                    aria-label="Loading Raindear"
                >
                    <div className="flex flex-col items-center gap-6">
                        <DeerMark size={128} stroke="var(--color-gold)" animated />
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim"
                        >
                            Raindear · Coffee &amp; Kitchen
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

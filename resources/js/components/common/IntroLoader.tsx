import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { BrandLockup } from '../deer/BrandMark';

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
                    {/* soft gold halo */}
                    <motion.div
                        aria-hidden
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.7, 0.4] }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="absolute inset-0"
                        style={{
                            background:
                                'radial-gradient(420px 420px at 50% 50%, rgba(201,162,91,0.18), transparent 60%)',
                        }}
                    />

                    <div className="relative flex flex-col items-center gap-7">
                        {/* lockup with mask reveal */}
                        <motion.div
                            initial={{ clipPath: 'inset(0 0 100% 0)' }}
                            animate={{ clipPath: 'inset(0 0 0% 0)' }}
                            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                        >
                            <motion.div
                                initial={{ scale: 0.96, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <BrandLockup height={120} tone="cream" />
                            </motion.div>
                        </motion.div>

                        {/* hairline grow */}
                        <motion.span
                            aria-hidden
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                            className="block h-px w-32 origin-left bg-gold/70"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                            className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim"
                        >
                            Bogor · Est. for warm tables
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

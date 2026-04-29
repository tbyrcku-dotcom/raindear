import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

import { IntroLoader } from '@/components/common/IntroLoader';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export default function PublicLayout() {
    const location = useLocation();

    return (
        <div className="grain min-h-screen bg-ink text-cream">
            <IntroLoader />
            <Navbar />
            <main className="relative z-10 pt-16 md:pt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
}

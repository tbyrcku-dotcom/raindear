import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu as MenuIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';

const links = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/about', label: 'About' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/reservation', label: 'Reservation' },
    { to: '/contact', label: 'Contact' },
];

export function Navbar() {
    const { scrollY } = useScroll();
    const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.92]);
    const blurAmount = useTransform(scrollY, [0, 80], [0, 14]);
    const lineOpacity = useTransform(scrollY, [0, 80], [0, 1]);
    const [open, setOpen] = useState(false);
    const loc = useLocation();

    useEffect(() => {
        setOpen(false);
    }, [loc.pathname]);

    return (
        <motion.nav
            className="fixed inset-x-0 top-0 z-50"
            style={{ ['--bg' as never]: undefined }}
        >
            <motion.div
                aria-hidden
                className="absolute inset-0 -z-10 bg-ink"
                style={{ opacity: bgOpacity, backdropFilter: useBackdrop(blurAmount) }}
            />
            <div className="container-editorial flex h-16 items-center justify-between md:h-20">
                <Link to="/" className="group flex items-center gap-3">
                    <span className="font-display text-2xl tracking-tight text-cream md:text-[28px]">
                        Raindear
                    </span>
                    <span className="hidden font-mono text-[9px] uppercase tracking-[0.4em] text-gold sm:inline">
                        Coffee &middot; Kitchen
                    </span>
                </Link>

                <div className="hidden items-center gap-7 md:flex">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end={l.to === '/'}
                            className={({ isActive }) =>
                                cn(
                                    'relative font-mono text-[11px] uppercase tracking-[0.32em] transition-colors',
                                    isActive ? 'text-cream' : 'text-cream-dim hover:text-cream',
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {l.label}
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-underline"
                                            className="absolute -bottom-2 left-0 right-0 h-px bg-gold"
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                <div className="hidden md:block">
                    <Link
                        to="/reservation"
                        className="inline-flex h-10 items-center border border-gold/70 bg-gold/10 px-5 font-mono text-[11px] uppercase tracking-[0.32em] text-cream transition-all hover:bg-gold/20"
                    >
                        Reserve
                    </Link>
                </div>

                <button
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Toggle menu"
                    className="md:hidden text-cream"
                >
                    {open ? <X size={22} /> : <MenuIcon size={22} />}
                </button>
            </div>

            <motion.div
                aria-hidden
                style={{ opacity: lineOpacity }}
                className="hairline pointer-events-none"
            />

            {/* Mobile sheet */}
            <motion.div
                initial={false}
                animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="md:hidden overflow-hidden bg-ink/95 backdrop-blur"
            >
                <div className="container-editorial flex flex-col gap-3 py-4">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end={l.to === '/'}
                            className={({ isActive }) =>
                                cn(
                                    'border-b border-line/50 py-3 font-mono text-xs uppercase tracking-[0.32em]',
                                    isActive ? 'text-gold' : 'text-cream-dim',
                                )
                            }
                        >
                            {l.label}
                        </NavLink>
                    ))}
                    <Link
                        to="/reservation"
                        className="mt-2 inline-flex h-12 items-center justify-center border border-gold/70 bg-gold/10 font-mono text-[11px] uppercase tracking-[0.32em] text-cream"
                    >
                        Reserve a table
                    </Link>
                </div>
            </motion.div>
        </motion.nav>
    );
}

function useBackdrop(motionValue: ReturnType<typeof useTransform<number, number>>) {
    return useTransform(motionValue, (v: number) => `blur(${v}px)`);
}

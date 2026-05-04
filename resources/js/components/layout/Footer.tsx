import { Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

import { BrandMark } from '@/components/deer/BrandMark';

const PHONE = '+62 821-1178-9089';
const WA = '6282111789089';
const EMAIL = 'mkt.raindear@gmail.com';
const ADDRESS = 'Jl. Bina Marga No.7, Baranangsiang, Bogor Timur, Jawa Barat 16143';

export function Footer() {
    return (
        <footer className="relative mt-32 border-t border-line/60 bg-ink">
            <div className="container-editorial grid gap-12 py-20 md:grid-cols-12">
                <div className="md:col-span-5">
                    <div className="flex items-center gap-4">
                        <BrandMark size={48} tone="gold" />
                        <span className="font-display text-3xl text-cream">Raindear</span>
                    </div>
                    <p className="mt-6 max-w-md text-balance text-base leading-relaxed text-cream-dim">
                        Coffee, comfort, and warm tables in the heart of Bogor.
                        From casual brunch to private celebration.
                    </p>
                </div>

                <div className="md:col-span-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">Visit</div>
                    <p className="mt-4 text-cream-dim">{ADDRESS}</p>
                </div>

                <div className="md:col-span-2">
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">Contact</div>
                    <ul className="mt-4 space-y-2 text-cream-dim">
                        <li>
                            <a href={`tel:${PHONE}`} className="hover:text-cream">{PHONE}</a>
                        </li>
                        <li>
                            <a href={`https://wa.me/${WA}`} className="hover:text-cream" target="_blank" rel="noreferrer">
                                WhatsApp
                            </a>
                        </li>
                        <li>
                            <a href={`mailto:${EMAIL}`} className="hover:text-cream">{EMAIL}</a>
                        </li>
                    </ul>
                </div>

                <div className="md:col-span-2">
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">Pages</div>
                    <ul className="mt-4 space-y-2 text-cream-dim">
                        <li><Link to="/menu" className="hover:text-cream">Menu</Link></li>
                        <li><Link to="/about" className="hover:text-cream">About</Link></li>
                        <li><Link to="/gallery" className="hover:text-cream">Gallery</Link></li>
                        <li><Link to="/reservation" className="hover:text-cream">Reservation</Link></li>
                    </ul>
                </div>
            </div>

            <div className="hairline" />

            <div className="container-editorial flex flex-col items-start justify-between gap-4 py-6 text-cream-dim md:flex-row md:items-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em]">
                    © {new Date().getFullYear()} Raindear · All rights reserved
                </span>
                <div className="flex items-center gap-4">
                    <a href="https://instagram.com/raindearcoffee" target="_blank" rel="noreferrer" className="hover:text-cream" aria-label="Instagram">
                        <Instagram size={16} />
                    </a>
                    <a href="https://facebook.com/raindearcoffee" target="_blank" rel="noreferrer" className="hover:text-cream" aria-label="Facebook">
                        <Facebook size={16} />
                    </a>
                </div>
            </div>
        </footer>
    );
}

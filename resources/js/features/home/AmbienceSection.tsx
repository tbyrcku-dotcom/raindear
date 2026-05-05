import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

type AmbienceImageProps = {
    src: string;
    alt: string;
    fallbackTone?: 'gold' | 'copper' | 'coffee';
    parallaxFrom: number;
    parallaxTo: number;
    className?: string;
    delay?: number;
};

function ParallaxImage({ src, alt, fallbackTone = 'gold', parallaxFrom, parallaxTo, className, delay = 0 }: AmbienceImageProps) {
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], [parallaxFrom, parallaxTo]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.04, 1, 1.04]);

    return (
        <AnimatedReveal delay={delay} className={className}>
            <div
                ref={ref}
                className="group relative aspect-[4/5] w-full overflow-hidden"
            >
                <motion.div
                    style={reduce ? undefined : { y, scale }}
                    className="absolute inset-0"
                >
                    <ImageWithFallback
                        src={src}
                        alt={alt}
                        className="h-full w-full transition-[filter,transform] duration-1000 group-hover:scale-[1.04] group-hover:brightness-110"
                        fallbackTone={fallbackTone}
                    />
                </motion.div>

                {/* hover gold border */}
                <span aria-hidden className="pointer-events-none absolute inset-0 border border-gold/0 transition-colors duration-700 group-hover:border-gold/50" />
                {/* corner ticks */}
                <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-gold/0 transition-all duration-500 group-hover:h-6 group-hover:w-6 group-hover:border-gold" />
                <span aria-hidden className="pointer-events-none absolute right-0 bottom-0 h-3 w-3 border-r border-b border-gold/0 transition-all duration-500 group-hover:h-6 group-hover:w-6 group-hover:border-gold" />
            </div>
        </AnimatedReveal>
    );
}

export function AmbienceSection() {
    return (
        <section className="relative py-24 md:py-36 border-t border-line/60">
            <div className="container-editorial grid items-end gap-10 md:grid-cols-12">
                <AnimatedReveal className="md:col-span-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                        Ambience
                    </div>
                    <h2 className="mt-5 font-display text-5xl leading-[0.95] text-cream md:text-6xl">
                        Indoor warmth.
                        <br />
                        <em className="italic text-gold">Outdoor calm.</em>
                    </h2>
                    <p className="mt-6 max-w-md text-cream-dim">
                        Layered timber, low light, and a quiet patio for slow afternoons.
                    </p>
                    <div className="mt-10 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">
                        <span className="h-px w-10 bg-gold/40" />
                        Two floors · Smoking patio · Live tree atrium
                    </div>
                </AnimatedReveal>

                <div className="grid gap-6 md:col-span-7 md:grid-cols-2">
                    <ParallaxImage
                        src="/images/interior/interior-dark-deer-wall.jpg"
                        alt="Dark wood coffered ceiling, leather banquette, and gold deer mark on the wall"
                        fallbackTone="gold"
                        parallaxFrom={40}
                        parallaxTo={-40}
                    />
                    <ParallaxImage
                        src="/images/interior/interior-arches.jpg"
                        alt="Arched windows, white coffered ceiling, and tan leather banquettes"
                        fallbackTone="copper"
                        parallaxFrom={-30}
                        parallaxTo={50}
                        className="md:mt-16"
                        delay={0.1}
                    />
                </div>
            </div>
        </section>
    );
}

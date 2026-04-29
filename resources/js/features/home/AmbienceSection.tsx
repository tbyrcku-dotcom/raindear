import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

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
                </AnimatedReveal>

                <div className="grid gap-6 md:col-span-7 md:grid-cols-2">
                    <AnimatedReveal delay={0.05}>
                        <ImageWithFallback
                            src="/img/gallery/interior-1.jpg"
                            alt="Indoor lounge with timber tables"
                            className="aspect-[4/5] w-full"
                            fallbackTone="gold"
                        />
                    </AnimatedReveal>
                    <AnimatedReveal delay={0.15} className="md:mt-16">
                        <ImageWithFallback
                            src="/img/gallery/ambience-1.jpg"
                            alt="Outdoor patio with hanging lights"
                            className="aspect-[4/5] w-full"
                            fallbackTone="copper"
                        />
                    </AnimatedReveal>
                </div>
            </div>
        </section>
    );
}

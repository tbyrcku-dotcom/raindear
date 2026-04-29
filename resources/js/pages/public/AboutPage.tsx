import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { useDocumentTitle } from '@/lib/seo';

const VALUES = [
    { title: 'Best service', body: 'A team that remembers the small things — your seat, your usual, the celebration coming up.' },
    { title: 'Halal food & drink', body: 'Halal-certified ingredients across the kitchen and the bar.' },
    { title: 'Creativity', body: 'A menu that updates with the seasons, the city, and the people who walk in.' },
    { title: 'Trusted quality', body: 'Sourced carefully, prepared honestly, served warm.' },
];

export default function AboutPage() {
    useDocumentTitle('About — Raindear Coffee & Kitchen');
    return (
        <div className="relative">
            <section className="container-editorial pt-20 pb-24 md:pt-32 md:pb-32">
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">About</div>
                <h1 className="mt-6 max-w-4xl text-balance font-display text-6xl leading-[0.92] text-cream md:text-8xl">
                    A warm corner
                    <br />
                    in <em className="italic text-gold">Bogor.</em>
                </h1>
                <p className="mt-10 max-w-xl text-balance text-lg leading-relaxed text-cream-dim">
                    Raindear started as a small coffee table for friends. It grew into a kitchen,
                    a stage, and a place to celebrate quietly.
                </p>
            </section>

            <section className="container-editorial border-t border-line/60 py-24">
                <div className="grid gap-12 md:grid-cols-12">
                    <div className="md:col-span-4">
                        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">Values</div>
                        <h2 className="mt-5 font-display text-4xl text-cream md:text-5xl">
                            Four things,
                            <br />
                            <em className="italic text-gold">always.</em>
                        </h2>
                    </div>
                    <ul className="md:col-span-8 grid gap-x-8 gap-y-10 sm:grid-cols-2">
                        {VALUES.map((v, i) => (
                            <AnimatedReveal as="li" key={v.title} delay={i * 0.05}>
                                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">0{i + 1}</div>
                                <h3 className="mt-3 font-display text-2xl text-cream">{v.title}</h3>
                                <p className="mt-2 text-cream-dim">{v.body}</p>
                            </AnimatedReveal>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="container-editorial border-t border-line/60 py-24 md:py-32">
                <AnimatedReveal>
                    <blockquote className="mx-auto max-w-3xl text-balance text-center font-display text-3xl leading-snug text-cream md:text-5xl">
                        “Coffee, comfort, and warm tables in the heart of Bogor —
                        moments worth staying for.”
                    </blockquote>
                </AnimatedReveal>
            </section>
        </div>
    );
}

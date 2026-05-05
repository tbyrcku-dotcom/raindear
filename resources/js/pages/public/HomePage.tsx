import { useDocumentTitle } from '@/lib/seo';

import { AmbienceSection } from '@/features/home/AmbienceSection';
import { ExperienceSection } from '@/features/home/ExperienceSection';
import { FinalCtaSection } from '@/features/home/FinalCtaSection';
import { HeroSection } from '@/features/home/HeroSection';
import { LocationSection } from '@/features/home/LocationSection';
import { SignatureMenuSection } from '@/features/home/SignatureMenuSection';
import { TestimonialSection } from '@/features/home/TestimonialSection';

export default function HomePage() {
    useDocumentTitle('Raindear Coffee & Kitchen — Bogor');
    return (
        <>
            <HeroSection />
            <SignatureMenuSection />
            <ExperienceSection />
            <AmbienceSection />
            <TestimonialSection />
            <LocationSection />
            <FinalCtaSection />
        </>
    );
}

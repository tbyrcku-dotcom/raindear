import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

const button = cva(
    'inline-flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.32em] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                primary: 'border border-gold/70 bg-gold/10 text-cream hover:bg-gold/20 hover:border-gold focus-visible:glow-gold',
                ghost: 'border border-line text-cream-dim hover:text-cream hover:border-cream/40',
                solid: 'bg-cream text-ink hover:bg-gold-soft',
                link: 'text-gold underline-offset-4 hover:underline',
            },
            size: {
                sm: 'h-9 px-4',
                md: 'h-11 px-6',
                lg: 'h-14 px-8 text-[12px]',
            },
        },
        defaultVariants: { variant: 'primary', size: 'md' },
    },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { className, variant, size, ...props },
    ref,
) {
    return <button ref={ref} className={cn(button({ variant, size }), className)} {...props} />;
});

type LinkButtonProps = {
    to: string;
    children: React.ReactNode;
    className?: string;
    external?: boolean;
} & VariantProps<typeof button>;

export function LinkButton({ to, children, className, variant, size, external }: LinkButtonProps) {
    if (external) {
        return (
            <a
                href={to}
                target="_blank"
                rel="noreferrer"
                className={cn(button({ variant, size }), className)}
            >
                {children}
            </a>
        );
    }
    return (
        <Link to={to} className={cn(button({ variant, size }), className)}>
            {children}
        </Link>
    );
}

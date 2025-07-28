import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface CoverPageProps {
    title?: string;
    subtitle?: string;
    description?: string;
    showLoginButton?: boolean;
    showRegisterButton?: boolean;
    className?: string;
}

export default function CoverPage({ 
    title = "Welcome", 
    subtitle,
    description = "Experience the power of modern web development.",
    showLoginButton = true,
    showRegisterButton = true,
    className = ""
}: CoverPageProps) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className={`relative flex h-dvh flex-col items-center justify-center px-8 sm:px-0 ${className}`}>
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-700/20 via-transparent to-transparent" />
            
            {/* Content */}
            <div className="relative z-20 flex flex-col items-center text-center text-white max-w-4xl mx-auto">
                {/* Logo Section */}
                <Link href={route('public.home')} className="mb-12 flex flex-col items-center gap-4 group">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-105">
                        <AppLogoIcon className="size-12 fill-current text-white" />
                    </div>
                    <span className="text-3xl font-bold tracking-tight">{name}</span>
                </Link>

                {/* Main Content */}
                <div className="mb-16 space-y-6">
                    <h1 className="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl bg-gradient-to-r from-white via-white to-zinc-300 bg-clip-text text-transparent">
                        {title}
                    </h1>
                    
                    {subtitle && (
                        <h2 className="text-2xl font-medium text-zinc-300 sm:text-3xl max-w-3xl mx-auto">
                            {subtitle}
                        </h2>
                    )}
                    
                    <p className="text-xl text-zinc-400 sm:text-2xl max-w-2xl mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 w-full max-w-md">
                    {showRegisterButton && (
                        <Button 
                            asChild
                            size="lg"
                            className="bg-white text-black hover:bg-zinc-100 font-semibold py-6 text-lg transition-all duration-300 hover:scale-105"
                        >
                            <Link href={route('register')}>
                                Get Started
                            </Link>
                        </Button>
                    )}
                    
                    {showLoginButton && (
                        <Button 
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 font-semibold py-6 text-lg transition-all duration-300 hover:scale-105"
                        >
                            <Link href={route('login')}>
                                Sign In
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Additional Info */}
                <p className="mt-8 text-sm text-zinc-500">
                    No credit card required • Free to get started
                </p>
            </div>

            {/* Quote Section */}
            {quote && (
                <div className="absolute bottom-10 left-10 right-10 z-20">
                    <div className="max-w-4xl mx-auto">
                        <blockquote className="text-center lg:text-left">
                            <p className="text-lg italic text-zinc-300 mb-2">
                                &ldquo;{quote.message}&rdquo;
                            </p>
                            <footer className="text-sm text-zinc-400">
                                — {quote.author}
                            </footer>
                        </blockquote>
                    </div>
                </div>
            )}

            {/* Decorative Elements */}
            <div className="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
            <div className="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000" />
            <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse delay-500" />
        </div>
    );
}
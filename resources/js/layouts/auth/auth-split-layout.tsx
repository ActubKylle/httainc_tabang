import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren, useEffect, useState } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Trigger fade-in animation after component mounts
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 overflow-hidden">
            {/* Left side with enhanced background and extra large centered logo */}
            <div className={`relative h-full flex-col p-8 lg:p-12 text-white flex lg:flex transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
                {/* Background image with overlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transform transition-transform duration-700 hover:scale-105"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070&auto=format&fit=crop')`,
                    }}
                />
                
                {/* Enhanced gradient overlays for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 via-emerald-900/90 to-teal-900/95" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-950/30 via-transparent to-transparent" />
                
                {/* Animated pattern overlay */}
                <div 
                    className="absolute inset-0 opacity-5 animate-pulse"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                {/* Extra large centered logo with enhanced animation */}
                <div className={`relative z-20 flex flex-col items-center justify-center flex-1 transition-all duration-700 ${
                    isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`} style={{ transitionDelay: '200ms' }}>
                    <Link 
                        href={route('public.home')} 
                        className="group flex flex-col items-center gap-8 transition-all duration-500 hover:scale-105"
                    >
                        {/* Extra large logo container with enhanced styling */}
                        <div className="flex h-48 w-48 lg:h-56 lg:w-56 items-center justify-center rounded-[2.5rem] bg-white/20 backdrop-blur-lg border-2 border-white/40 shadow-2xl group-hover:bg-white/25 group-hover:border-white/50 transition-all duration-300 group-hover:shadow-3xl">
                            <AppLogoIcon className="size-32 lg:size-36 fill-current text-white drop-shadow-2xl" />
                        </div>
                        
                        {/* Academy name with adjusted spacing */}
                        <div className="text-center space-y-3">
                            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-xl">
                                Highlands Technical
                            </h1>
                            <p className="text-xl lg:text-2xl text-green-100 font-semibold drop-shadow-lg">
                                Training Academy
                            </p>
                            <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-green-300 to-transparent mx-auto opacity-75 rounded-full" />
                        </div>
                    </Link>
                </div>

                {/* Enhanced quote section with glass effect */}
                {quote && (
                    <div className={`relative z-20 mt-auto transition-all duration-1000 ease-out ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`} style={{ transitionDelay: '600ms' }}>
                        <div className="relative group">
                            {/* Enhanced glass background with multiple layers */}
                            <div className="absolute -inset-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:from-white/15 group-hover:to-white/5 transition-all duration-500" />
                            <div className="absolute -inset-6 bg-gradient-to-t from-green-900/20 to-transparent rounded-3xl" />
                            
                            <blockquote className="relative space-y-5 p-8">
                                {/* Enhanced quote icon with glow */}
                                <div className="text-5xl text-green-200/80 font-serif leading-none drop-shadow-lg">"</div>
                                
                                <p className="text-lg leading-relaxed text-white font-medium italic drop-shadow-sm">
                                    {quote.message}
                                </p>
                                
                                <footer className="flex items-center gap-4 pt-3">
                                    <div className="h-px bg-gradient-to-r from-green-200/70 via-green-300/50 to-transparent flex-1" />
                                    <cite className="text-sm text-green-100 font-semibold not-italic drop-shadow-sm">
                                        {quote.author}
                                    </cite>
                                </footer>
                            </blockquote>
                        </div>
                    </div>
                )}

                {/* Enhanced floating elements with improved animations */}
                <div className="absolute top-1/4 right-12 w-3 h-3 bg-green-300/40 rounded-full animate-pulse shadow-lg" />
                <div className="absolute top-1/3 right-24 w-2 h-2 bg-white/50 rounded-full animate-pulse delay-1000 shadow-md" />
                <div className="absolute bottom-1/3 left-12 w-2.5 h-2.5 bg-emerald-300/50 rounded-full animate-pulse delay-2000 shadow-lg" />
                <div className="absolute top-1/2 right-16 w-1 h-1 bg-green-400/60 rounded-full animate-pulse delay-3000" />
            </div>

            {/* Right side - Form area with enhanced mobile experience */}
            <div className={`relative w-full px-6 py-8 lg:p-12 transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}>
                {/* Mobile background with enhanced glass effect */}
                <div className="absolute inset-0 lg:hidden">
                    <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070&auto=format&fit=crop')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-emerald-900/15 to-teal-900/20" />
                    <div className="absolute inset-0 bg-white/96 backdrop-blur-sm" />
                </div>

                <div className="relative z-10 mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[420px] lg:w-[400px]">
                    {/* Enhanced title and description section */}
                    <div className={`flex flex-col items-center gap-4 text-center transition-all duration-700 ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`} style={{ transitionDelay: '400ms' }}>
                        
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                                {title}
                            </h1>
                            <p className="text-base text-balance text-gray-600 leading-relaxed max-w-md font-medium">
                                {description}
                            </p>
                        </div>
                        
                        {/* Enhanced TESDA accreditation badge */}
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border border-green-200/60 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="relative">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                                <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping opacity-75" />
                            </div>
                            <span className="text-sm font-semibold text-green-800">
                                TESDA Accredited Institution 
                            </span>
                        </div>
                    </div>

                    {/* Enhanced form content with stagger animation */}
                    <div className={`space-y-6 transition-all duration-700 ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`} style={{ transitionDelay: '500ms' }}>
                        {children}
                    </div>
                </div>
            </div>

            {/* Enhanced loading overlay with bigger logo */}
            <div className={`fixed inset-0 bg-white z-50 flex items-center justify-center transition-all duration-500 ${
                isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}>
                <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center animate-pulse shadow-2xl">
                        <AppLogoIcon className="size-16 fill-current text-white" />
                    </div>
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuMenuOpen] = useState(false);
    
    // Get current path for active navigation
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    
    const navItems = [
        { href: '/', label: 'Home', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )},
        { href: '/about', label: 'About Us', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        )},
        { href: '/programs', label: 'Programs', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        )},
        { href: '/contact', label: 'Contact', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        )},
        { href: '/enrollnow', label: 'Enroll Now', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        )}
    ];

    const isActive = (path: string) => {
        if (path === '/' && currentPath === '/') return true;
        if (path !== '/' && currentPath.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Enhanced Header */}
            <header className="relative bg-gradient-to-r from-green-500 via-green-600 to-green-500 shadow-2xl">
                {/* Modern HD Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-transparent opacity-5"></div>
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-emerald-400 to-green-400 rounded-full opacity-15 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-yellow-300 to-green-300 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Enhanced Logo Section */}
                        <Link href="/" className="flex items-center space-x-4 group">
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-white via-gray-50 to-white rounded-full flex items-center justify-center shadow-xl shadow-black/20 group-hover:shadow-2xl group-hover:shadow-yellow-400/30 transition-all duration-500 group-hover:scale-110">
                                    {/* FIXED: Corrected image source */}
                                   <img src="/logo.jpg" alt="HTTA Logo" />

                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-lg"></div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                            </div>
                            <div className="text-white">
                                <h1 className="text-2xl md:text-3xl font-black tracking-tight group-hover:text-yellow-200 transition-colors duration-300">
                                    HTTA, Inc.
                                </h1>
                                <p className="text-sm md:text-base text-yellow-200 font-semibold opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                                    Highlands Technical Training Academy
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex space-x-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative group px-5 py-3 rounded-xl font-semibold transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 ${
                                        isActive(item.href)
                                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-800 shadow-2xl shadow-yellow-400/30'
                                            : 'text-white hover:bg-gradient-to-r hover:from-white hover:to-white hover:bg-opacity-20 hover:text-yellow-200 hover:shadow-lg'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <span className={`transition-all duration-300 ${isActive(item.href) ? 'text-green-800' : 'text-current group-hover:scale-110'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="relative">
                                            {item.label}
                                            {!isActive(item.href) && (
                                                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></div>
                                            )}
                                        </span>
                                    </div>
                                    {isActive(item.href) && (
                                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-500 rounded-full shadow-lg"></div>
                                    )}
                                    {/* Glow effect on hover */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-sm"></div>
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-3 rounded-xl text-white hover:bg-gradient-to-r hover:from-white hover:to-white hover:bg-opacity-20 hover:text-yellow-200 transition-all duration-300 hover:scale-105"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>

                    {/* Enhanced Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-green-600 to-green-700 shadow-2xl border-t border-green-400 z-50 backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-5"></div>
                            <nav className="relative px-4 py-4 space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                                            isActive(item.href)
                                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-800 shadow-lg'
                                                : 'text-white hover:bg-gradient-to-r hover:from-white hover:to-white hover:bg-opacity-20 hover:text-yellow-200'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span className={`transition-all duration-300 ${isActive(item.href) ? 'text-green-800' : 'text-current'}`}>
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="p-6 md:p-8 lg:p-12">
                            {children}
                        </div>
                    </div>
                </div>
            </main>

            {/* Enhanced Footer */}
            <footer className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white mt-12 relative overflow-hidden">
                {/* Modern HD Footer Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-transparent opacity-10"></div>
                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full opacity-5 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-emerald-400 to-green-400 rounded-full opacity-10 blur-2xl"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Enhanced Logo and Description */}
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start space-x-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-white via-gray-50 to-white rounded-full flex items-center justify-center shadow-xl">
                                    {/* FIXED: Corrected image source */}
<img src="/logo.jpg" alt="HTTA Logo" />
                                </div>
                                <div>
                                    <span className="text-xl font-black">HTTA, Inc.</span>
                                    <p className="text-xs text-yellow-200 font-medium opacity-90">Technical Excellence</p>
                                </div>
                            </div>
                            <p className="text-green-100 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                                Empowering futures through innovative technical training programs and cutting-edge educational excellence.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-4 text-yellow-200">Quick Links</h3>
                            <div className="space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center space-x-2 text-green-100 hover:text-yellow-200 transition-all duration-300 hover:translate-x-1 group"
                                    >
                                        <span className="group-hover:scale-110 transition-transform duration-300">
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="text-center md:text-right">
                            <h3 className="text-lg font-semibold mb-4 text-yellow-200">Contact Info</h3>
                            <div className="space-y-2 text-green-200 text-sm">
                                <p>📍 Your Address Here</p>
                                <p>📞 (123) 456-7890</p>
                                <p>✉️ info@htta.edu</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-green-600 mt-8 pt-6 text-center">
                        <p className="text-green-200 text-sm">
                            &copy; {new Date().getFullYear()} Highlands Technical Training Academy, Inc. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </div>
    );
};

export default PublicLayout;

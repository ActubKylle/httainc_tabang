// resources/js/Layouts/AppLayout.tsx

import React, { PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types'; // Assuming you have a types.d.ts or similar for PageProps

// You might have these components from Laravel Breeze/Jetstream
// import ApplicationLogo from '@/Components/ApplicationLogo';
// import Dropdown from '@/Components/Dropdown';
// import NavLink from '@/Components/NavLink';

// Define props for AppLayout, including the new hideAuthLinks
interface AppLayoutProps extends PropsWithChildren {
    hideAuthLinks?: boolean; // Optional prop to hide auth links
    header?: React.ReactNode; // Keep existing header prop if it exists
}

export default function AppLayout({ header, children, hideAuthLinks = false }: AppLayoutProps) {
    // Access page props, including authentication status
    const { auth } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    {/* Replace with your actual ApplicationLogo component or a simple text logo */}
                                    {/* <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" /> */}
                                    <span className="text-xl font-semibold text-gray-800">HTTA, Inc.</span>
                                </Link>
                            </div>

                            {/* Main Navigation Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {/* Example: A link to the public enrollment info page */}
                                <Link
                                    href={route('enrollment.info')}
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
                                >
                                    Enrollment Information
                                </Link>
                                {/* Add other common public links here if needed */}
                            </div>
                        </div>

                        {/* Right side navigation (Auth links or User Menu) */}
                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            {/* Conditionally render Login/Register links */}
                            {!hideAuthLinks && !auth.user ? (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="font-semibold text-gray-600 hover:text-gray-900 focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="ms-4 font-semibold text-gray-600 hover:text-gray-900 focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                    >
                                        Register
                                    </Link>
                                </>
                            ) : auth.user ? (
                                // If a user IS logged in, show their menu (e.g., from Breeze)
                                <div className="ms-3 relative">
                                    {/* Replace with your actual Dropdown component or simple links */}
                                    {/* <Dropdown align="right" width="48">
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    {auth.user.name}
                                                    <svg className="ms-2 -me-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown> */}
                                    <span className="text-gray-600">Welcome, {auth.user.name}</span>
                                    <Link href={route('logout')} method="post" as="button" className="ms-4 font-semibold text-gray-600 hover:text-gray-900">Logout</Link>
                                </div>
                            ) : null}
                        </div>

                        {/* Mobile menu (if you have one, apply hideAuthLinks similarly) */}
                        <div className="-me-2 flex items-center sm:hidden">
                            {/* Mobile menu button logic */}
                        </div>
                    </div>
                </div>

                {/* Responsive Navigation Menu (Mobile) */}
                {/* ... (If you have this, apply hideAuthLinks similarly) */}
            </nav>

            {/* Page Heading (Optional) */}
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Page Content */}
            <main>{children}</main>
        </div>
    );
}


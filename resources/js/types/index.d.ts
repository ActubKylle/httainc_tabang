import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            email_verified_at: string | null; // Use string | null as it can be null before verification
            // Add any other user properties you typically pass
        };
    };
    ziggy: {
        location: string;
        query: Record<string, string>;
        routes: Record<string, { uri: string }>;
    };
    flash: {
        success?: string;
        error?: string;
    };
    errors: Record<string, string>; // <-- Crucial for your Home.tsx error handling
    // Add any other top-level props your Inertia pages might receive
};

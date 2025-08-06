import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, UserCheck, Users,Award,CalendarCheck } from 'lucide-react';

import AppLogo from './app-logo';

// Define a type for your Auth user to access role
interface AuthUser {
    id: number;
    name: string;
    email_verified_at: string | null;
    role: string;
}

// Extend PageProps to get the authenticated user
// interface CustomPageProps extends PageProps {
//     auth: {
//         user: AuthUser;
//     };
// }

export function AppSidebar() {
    const { auth } = usePage<CustomPageProps>().props;
    const userRole = auth.user?.role;

    // Main navigation items
    // const mainNavItems: NavItem[] = [
    //     {
    //         title: 'Dashboard',
    //         href: '/dashboard',
    //         icon: LayoutGrid,
    //     },
        
        
    // ];

        const mainNavItems: NavItem[] = [];



     if (userRole === 'learner') { 
        mainNavItems.push({
            title: 'Scholarships',
            href: '/scholarships',
            icon: Award,
        });
        
        mainNavItems.push({
        title: 'My Applications',
        href: '/my-applications', // This matches the route you created
        icon: Folder,             // A fitting icon for tracking applications
    });
     }

    // Add Enrollment link if user is an admin
    if (userRole === 'staff') {
         mainNavItems.push({
             title: 'Dashboard',
           href: '/staff/dashboard',
           icon: LayoutGrid,
        });
        
        mainNavItems.push({
            title: 'Enrollments',
            href: '/staff/enrollments',
            icon: UserCheck,
        });
        mainNavItems.push({
        title: 'Student List',
        href: '/staff/students', // The route you just created
        icon: Users, // A fitting icon for a list of users
    });
     mainNavItems.push({
            title: 'Attendance',
            href: route('staff.attendance.index'), // Using the named route
            icon: CalendarCheck, // A fitting icon for attendance
        });
    mainNavItems.push({
        title: 'Manage Programs', // Title for the sidebar link
        href: '/staff/programs', // The route for managing programs
        icon: BookOpen, // Using BookOpen as an appropriate icon for programs/courses
    });
        mainNavItems.push({
        title: 'Scholarships',
        href: '/staff/scholarships', // Matches the resource route
        icon: Award, // A fitting icon for scholarships
    });
        
    }

    const footerNavItems: NavItem[] = [
        // {
        //     title: 'Repository',
        //     href: 'https://github.com/laravel/react-starter-kit',
        //     icon: Folder,
        // },
        // {
        //     title: 'Documentation',
        //     href: 'https://laravel.com/docs/starter-kits#react',
        //     icon: BookOpen,
        // },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset" className="htta-sidebar">
            <SidebarHeader className="htta-sidebar-header">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-white/10 transition-colors">
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
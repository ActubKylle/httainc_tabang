import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { type PageProps, type BreadcrumbItem } from '@/types';
import {
    Users,
    BookOpen,
    Award,
    Clock,
    CheckCircle,
    TrendingUp,
    FilePlus,
    ArrowRight,
    type LucideProps,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PageLoadingSkeleton } from '@/components/Loading';

// --- Interface Definitions for Type Safety ---

// Defines the shape of the statistics object from the backend
interface DashboardStats {
    pendingLearners: number;
    totalStudents: number;
    activePrograms: number;
    pendingScholarships: number;
}

// Defines the shape of an item in the enrollment trends chart data
interface EnrollmentTrendItem {
    month: string;
    students: number;
}

// Defines the shape of a recently pending learner object
interface RecentPendingLearner {
    learner_id: number;
    name: string;
    program: string;
    date: string;
}

// Defines all the props coming from the Inertia page
interface StaffDashboardPageProps extends PageProps {
    stats: DashboardStats;
    enrollmentTrends: EnrollmentTrendItem[];
    recentPendingLearners: RecentPendingLearner[];
}

// Defines the props for the MetricCard component
interface MetricCardProps {
    title: string;
    value: number | string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    color: 'blue' | 'purple' | 'green' | 'amber';
    link: string;
    linkText: string;
}

// Defines the props for the SectionCard component
interface SectionCardProps {
    title: string;
    children: React.ReactNode;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

// --- Component Implementation ---

const breadcrumbs: BreadcrumbItem[] = [
    // Corrected: Added the required 'href' property.
    {
        title: 'Staff Dashboard',
        href: route('staff.dashboard'),
    },
];

// Reusable component for displaying key stats with explicit props typing
function MetricCard({ title, value, icon: Icon, color, link, linkText }: MetricCardProps) {
    const colorClasses = {
        blue: 'from-blue-500 to-indigo-600',
        purple: 'from-purple-500 to-violet-600',
        green: 'from-green-500 to-emerald-600',
        amber: 'from-amber-500 to-orange-600',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-500 font-medium">{title}</p>
                    <p className="text-4xl font-bold text-slate-800 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white shadow-md`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <Link
                href={link}
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
                {linkText} <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}

// Reusable component for sections with explicit props typing
function SectionCard({ title, children, icon: Icon }: SectionCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
                <Icon className="w-6 h-6 text-slate-600" />
                <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
            </div>
            <div>{children}</div>
        </div>
    );
}

export default function StaffDashboard() {
    // Corrected: Cast the 'unknown' props from usePage() to our defined interface.
    const { stats, enrollmentTrends, recentPendingLearners } = usePage<StaffDashboardPageProps>().props;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                 <Head title="Loading Dashboard..." />
                <PageLoadingSkeleton />
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Staff Dashboard" />

            <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
                <h1 className="text-3xl font-bold text-slate-900">Welcome, Staff!</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Pending Enrollments"
                        value={stats.pendingLearners}
                        icon={Clock}
                        color="amber"
                        link={route('staff.enrollments')}
                        linkText="Review Enrollments"
                    />
                    <MetricCard
                        title="Total Students"
                        value={stats.totalStudents}
                        icon={Users}
                        color="blue"
                        link={route('staff.students.index')}
                        linkText="View Student List"
                    />
                    <MetricCard
                        title="Active Programs"
                        value={stats.activePrograms}
                        icon={BookOpen}
                        color="purple"
                        link={route('staff.programs.manage_index')}
                        linkText="Manage Programs"
                    />
                    <MetricCard
                        title="Pending Scholarships"
                        value={stats.pendingScholarships}
                        icon={Award}
                        color="green"
                        link={route('staff.scholarships.index')}
                        linkText="Manage Scholarships"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <SectionCard title="Enrollment Trends (Last 6 Months)" icon={TrendingUp}>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={enrollmentTrends} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="month" stroke="#64748b" />
                                    <YAxis stroke="#64748b" />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px' }} />
                                    <Area type="monotone" dataKey="students" stroke="#3B82F6" fillOpacity={1} fill="url(#colorStudents)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </SectionCard>
                    </div>

                    <div>
                        <SectionCard title="Pending Enrollment Requests" icon={FilePlus}>
                            <div className="space-y-3">
                                {recentPendingLearners.length > 0 ? (
                                    recentPendingLearners.map((learner) => (
                                        <Link
                                            key={learner.learner_id}
                                            href={route('staff.enrollment.show', learner.learner_id)}
                                            className="block p-4 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                        >
                                            <div className="font-semibold text-slate-800">{learner.name}</div>
                                            <div className="text-sm text-slate-600">
                                                Applied for <span className="font-medium">{learner.program}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">{learner.date}</div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-500">
                                        <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                                        <p>No pending enrollments. Great job!</p>
                                    </div>
                                )}
                            </div>
                        </SectionCard>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

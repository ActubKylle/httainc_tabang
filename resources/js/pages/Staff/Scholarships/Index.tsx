import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { 
    Award, 
    PlusCircle, 
    Search, 
    MoreHorizontal, 
    Eye, 
    Edit, 
    Trash2, 
    Inbox,
    Filter,
    RefreshCw,
    Calendar,
    Users,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    Building,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Copy,
    Archive,
    ExternalLink,
    Star,
    StarOff
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import toast, { Toaster } from 'react-hot-toast';
// --- 1. Import the necessary loading components and hooks ---
import { 
    PageLoadingSkeleton, 
    useLoadingStates 
} from '@/components/Loading';

// --- Interfaces ---
interface Scholarship {
    scholarship_id: number;
    scholarship_name: string;
    provider: string;
    status: 'Open' | 'Closed' | 'Ongoing';
    available_slots: number;
    application_deadline: string;
    description?: string;
    created_at?: string;
}

interface ScholarshipIndexProps extends PageProps {
    scholarships: {
        data: Scholarship[];
        links: { url: string | null; label: string; active: boolean; }[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
    flash: { 
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('staff.dashboard') },
    { title: 'Scholarships', href: route('staff.scholarships.index') }
];

export default function ScholarshipIndex() {
    const { scholarships, filters, flash } = usePage<ScholarshipIndexProps>().props;
    
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [favoriteScholarships, setFavoriteScholarships] = useState<number[]>([]);

    // --- 2. Initialize the loading states using the custom hook ---
    const { loadingStates, setLoading } = useLoadingStates({
        initialLoad: true, // Start with the initial page skeleton visible
    });

    // Statistics
    const openScholarships = scholarships.data.filter(s => s.status === 'Open').length;
    const closedScholarships = scholarships.data.filter(s => s.status === 'Closed').length;
    const ongoingScholarships = scholarships.data.filter(s => s.status === 'Ongoing').length;
    const totalSlots = scholarships.data.reduce((sum, s) => sum + s.available_slots, 0);

    // Format date helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Open':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Open
                    </span>
                );
            case 'Ongoing':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Ongoing
                    </span>
                );
            case 'Closed':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Closed
                    </span>
                );
            default:
                return null;
        }
    };

    // --- 3. Add an effect to hide the initial skeleton after a short delay ---
    // This prevents a jarring flash on fast network connections.
    useEffect(() => {
        const timer = setTimeout(() => setLoading('initialLoad', false), 500);
        return () => clearTimeout(timer);
    }, []);


    // Handle search with debounce
    useEffect(() => {
        // Prevent the search from running on the very first render
        if (loadingStates.initialLoad) return;

        const handler = setTimeout(() => {
            router.get(
                route('staff.scholarships.index'),
                { search, status: statusFilter },
                { 
                    preserveState: true, 
                    preserveScroll: true, 
                    replace: true
                    // Note: Inertia's `router.processing` will handle the loading state automatically
                }
            );
        }, 300);
        return () => clearTimeout(handler);
    }, [search, statusFilter, loadingStates.initialLoad]);

    // Handle flash messages
    useEffect(() => {
        if (flash && flash.success) toast.success(flash.success);
        if (flash && flash.error) toast.error(flash.error);
    }, [flash]);

    const handleDelete = (scholarship: Scholarship) => {
        if (confirm(`Are you sure you want to delete the "${scholarship.scholarship_name}" scholarship? This action cannot be undone.`)) {
            router.delete(route('staff.scholarships.destroy', scholarship.scholarship_id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Scholarship deleted successfully.'),
                onError: () => toast.error('Failed to delete scholarship.'),
            });
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => {
                setIsRefreshing(false);
                toast.success('Scholarships refreshed!');
            }
        });
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('');
    };

    // Enhanced Action Menu Component
    const ActionMenu = ({ scholarship }: { scholarship: Scholarship }) => {
        const isFavorite = favoriteScholarships.includes(scholarship.scholarship_id);
        
        return (
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button 
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 data-[state=open]:bg-slate-100 data-[state=open]:text-slate-700"
                        aria-label="More options"
                    >
                        <MoreHorizontal size={18} />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-[220px] bg-white rounded-xl shadow-lg border border-slate-200 p-1 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-50"
                        sideOffset={5}
                        align="end"
                    >
                        {/* Primary Actions */}
                        <DropdownMenu.Group>
                            <DropdownMenu.Item asChild>
                                <Link 
                                    href={route('staff.scholarships.show', scholarship.scholarship_id)}
                                    className="group flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none transition-colors cursor-pointer"
                                >
                                    <Eye size={16} className="text-slate-400 group-hover:text-blue-600 group-focus:text-blue-600" />
                                    <div className="flex flex-col">
                                        <span className="font-medium">View Details</span>
                                        <span className="text-xs text-slate-500 group-hover:text-blue-600 group-focus:text-blue-600">
                                            See applicants & stats
                                        </span>
                                    </div>
                                </Link>
                            </DropdownMenu.Item>

                            <DropdownMenu.Item asChild>
                                <Link 
                                    href={route('staff.scholarships.edit', scholarship.scholarship_id)}
                                    className="group flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none transition-colors cursor-pointer"
                                >
                                    <Edit size={16} className="text-slate-400 group-hover:text-blue-600 group-focus:text-blue-600" />
                                    <div className="flex flex-col">
                                        <span className="font-medium">Edit Scholarship</span>
                                        <span className="text-xs text-slate-500 group-hover:text-blue-600 group-focus:text-blue-600">
                                            Modify details & settings
                                        </span>
                                    </div>
                                </Link>
                            </DropdownMenu.Item>
                        </DropdownMenu.Group>

                        <DropdownMenu.Separator className="h-px bg-slate-200 my-1" />

                        {/* Destructive Action */}
                        <DropdownMenu.Group>
                            <DropdownMenu.Item
                                className="group flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 focus:bg-red-50 focus:outline-none transition-colors cursor-pointer"
                                onSelect={() => handleDelete(scholarship)}
                            >
                                <Trash2 size={16} className="text-red-500" />
                                <div className="flex flex-col">
                                    <span className="font-medium">Delete</span>
                                    <span className="text-xs text-red-500">
                                        Permanently remove
                                    </span>
                                </div>
                            </DropdownMenu.Item>
                        </DropdownMenu.Group>

                        <DropdownMenu.Arrow className="fill-white" />
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        );
    };

    // --- 4. Render the full-page skeleton during the initial load ---
    if (loadingStates.initialLoad) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Manage Scholarships" />
                <PageLoadingSkeleton />
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Scholarships" />
            <Toaster position="top-right" reverseOrder={false} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* --- HEADER: Enhanced with stats --- */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Award className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Scholarship Management</h1>
                                </div>
                                <p className="text-lg text-slate-600">Create, update, and manage scholarship programs.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>
                                <Link
                                    href={route('staff.scholarships.create')}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg"
                                >
                                    <PlusCircle size={18} />
                                    <span>Add Scholarship</span>
                                </Link>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Award className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Total Scholarships</p>
                                        <p className="text-2xl font-bold text-slate-900">{scholarships.total}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Open Applications</p>
                                        <p className="text-2xl font-bold text-blue-700">{openScholarships}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Clock className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Ongoing Programs</p>
                                        <p className="text-2xl font-bold text-yellow-700">{ongoingScholarships}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Users className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Available Slots</p>
                                        <p className="text-2xl font-bold text-purple-700">{totalSlots.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- MAIN CONTENT CARD --- */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                        
                        {/* Enhanced Filter Bar */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Filter & Search Scholarships
                                </h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                                        className="px-3 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                                    >
                                        {viewMode === 'table' ? 'Card View' : 'Table View'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-b border-slate-200">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by scholarship name or provider..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-4 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-w-[140px]"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="Open">Open Only</option>
                                        <option value="Ongoing">Ongoing Only</option>
                                        <option value="Closed">Closed Only</option>
                                    </select>
                                    {(search || statusFilter) && (
                                        <button
                                            onClick={clearFilters}
                                            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                            {(search || statusFilter) && (
                                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                                    <Filter className="w-4 h-4" />
                                    <span>
                                        Showing {scholarships.data.length} of {scholarships.total} scholarships
                                        {search && <span> matching "{search}"</span>}
                                        {statusFilter && <span> with status "{statusFilter}"</span>}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="relative">
                            {(router.processing || isRefreshing) && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                                    <div className="flex items-center gap-3 bg-white rounded-lg shadow-lg px-6 py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                                        <span className="text-slate-700 font-medium">
                                            {isRefreshing ? 'Refreshing...' : 'Loading...'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {scholarships.data.length > 0 ? (
                                viewMode === 'table' ? (
                                    // Table View
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50 text-slate-700">
                                                <tr>
                                                    <th className="px-6 py-4 text-left font-semibold">Scholarship Details</th>
                                                    <th className="px-6 py-4 text-left font-semibold">Provider</th>
                                                    <th className="px-6 py-4 text-center font-semibold">Status</th>
                                                    <th className="px-6 py-4 text-center font-semibold">Slots</th>
                                                    <th className="px-6 py-4 text-left font-semibold">Deadline</th>
                                                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {scholarships.data.map((scholarship, index) => (
                                                    <tr 
                                                        key={scholarship.scholarship_id} 
                                                        className={`border-b border-slate-200 hover:bg-slate-50/70 transition-all duration-200 ${
                                                            index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                                                        }`}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-start gap-3">
                                                                {favoriteScholarships.includes(scholarship.scholarship_id) && (
                                                                    <Star size={16} className="text-yellow-500 fill-current mt-0.5 flex-shrink-0" />
                                                                )}
                                                                <div>
                                                                    <p className="font-semibold text-slate-900">{scholarship.scholarship_name}</p>
                                                                    {scholarship.description && (
                                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                                            {scholarship.description.substring(0, 80)}
                                                                            {scholarship.description.length > 80 ? '...' : ''}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <Building className="w-4 h-4 text-blue-500" />
                                                                <span className="font-medium text-slate-700">{scholarship.provider}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            {getStatusBadge(scholarship.status)}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Users className="w-4 h-4 text-purple-500" />
                                                                <span className="font-semibold text-slate-700">{scholarship.available_slots}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <CalendarDays className="w-4 h-4 text-red-500" />
                                                                <span className="text-slate-600">{formatDate(scholarship.application_deadline)}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <ActionMenu scholarship={scholarship} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    // Card View
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {scholarships.data.map((scholarship) => (
                                            <div key={scholarship.scholarship_id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">
                                                            {scholarship.scholarship_name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Building className="w-4 h-4 text-blue-500" />
                                                            <span className="text-sm text-slate-600">{scholarship.provider}</span>
                                                        </div>
                                                    </div>
                                                    {getStatusBadge(scholarship.status)}
                                                </div>
                                                
                                                <div className="space-y-3 mb-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-4 h-4 text-purple-500" />
                                                            <span className="text-sm text-slate-600">Available Slots</span>
                                                        </div>
                                                        <span className="font-semibold text-slate-900">{scholarship.available_slots}</span>
                                                    </div>

                                                    <div className="bg-slate-50 rounded-lg p-3">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <CalendarDays className="w-4 h-4 text-red-500" />
                                                            <span className="text-xs font-medium text-slate-700">Application Deadline</span>
                                                        </div>
                                                        <div className="text-sm font-semibold text-slate-900">
                                                            {formatDate(scholarship.application_deadline)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {scholarship.description && (
                                                    <p className="text-sm text-slate-500 mb-4 line-clamp-3">
                                                        {scholarship.description}
                                                    </p>
                                                )}

                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={route('staff.scholarships.show', scholarship.scholarship_id)}
                                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                                    >
                                                        <Eye size={14} />
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={route('staff.scholarships.edit', scholarship.scholarship_id)}
                                                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                                                    >
                                                        <Edit size={14} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(scholarship)}
                                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-16 px-6">
                                    <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <Inbox size={40} className="text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No Scholarships Found</h3>
                                    <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                        {search || statusFilter 
                                            ? "No scholarships match your current filters. Try adjusting your search criteria."
                                            : "Get started by creating your first scholarship program."
                                        }
                                    </p>
                                    {(search || statusFilter) ? (
                                        <button
                                            onClick={clearFilters}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            <AlertCircle size={16} />
                                            Clear Filters
                                        </button>
                                    ) : (
                                        <Link
                                            href={route('staff.scholarships.create')}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            <PlusCircle size={16} />
                                            Create Your First Scholarship
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* Enhanced Pagination */}
                            {scholarships.data.length > 0 && scholarships.links.length > 3 && (
                                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Users className="w-4 h-4" />
                                            <span>
                                                Showing <span className="font-semibold text-slate-800">{scholarships.from}</span> to{' '}
                                                <span className="font-semibold text-slate-800">{scholarships.to}</span> of{' '}
                                                <span className="font-semibold text-slate-800">{scholarships.total}</span> scholarships
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center gap-1">
                                            {scholarships.links.map((link, index) => {
                                                const isFirst = index === 0;
                                                const isLast = index === scholarships.links.length - 1;
                                                const className = `inline-flex items-center justify-center text-sm font-medium transition-all duration-200 h-10 ${
                                                    !link.url 
                                                        ? 'text-slate-400 cursor-not-allowed' 
                                                        : link.active 
                                                            ? 'bg-blue-600 text-white rounded-lg shadow-sm w-10' 
                                                            : `text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 ${
                                                                isFirst || isLast ? 'px-4 gap-2' : 'w-10'
                                                            }`
                                                }`;
                                                
                                                return (
                                                    <Link 
                                                        key={index} 
                                                        href={link.url || '#'} 
                                                        as="button" 
                                                        disabled={!link.url} 
                                                        className={className}
                                                    >
                                                        {isFirst ? (
                                                            <><ChevronLeft size={16} /> Previous</>
                                                        ) : isLast ? (
                                                            <>Next <ChevronRight size={16} /></>
                                                        ) : (
                                                            link.label
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
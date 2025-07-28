import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    PlusCircle, 
    Edit, 
    CheckCircle, 
    XCircle, 
    Search, 
    BookOpen, 
    MoreVertical, 
    ChevronLeft, 
    ChevronRight,
    Filter,
    Download,
    Eye,
    Clock,
    Award,
    Users,
    TrendingUp,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import { 
    PageLoadingSkeleton, 
    TableLoadingSkeleton,
    useLoadingStates 
} from '@/components/Loading';
import toast, { Toaster } from 'react-hot-toast';

// Interfaces remain unchanged
interface ProgramData {
    id: number;
    course_name: string;
    qualification_level: string;
    duration_hours: number;
    duration_days: number;
    description: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

interface AdminProgramsProps extends PageProps {
    programs: {
        data: ProgramData[];
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
    {
        title: 'Programs',
        href: route('admin.programs.manage_index'),
    },
];

export default function ProgramsIndex() {
    const { programs, filters, flash } = usePage<AdminProgramsProps>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);


        // Loading states for different scenarios
    const { loadingStates, setLoading } = useLoadingStates({
        initialLoad: true, // For the initial page skeleton
        isFiltering: false, // For filtering/pagination actions
        isRefreshing: false, // For the manual refresh button
    });



    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Statistics
    const activePrograms = programs.data.filter(p => p.status === 'active').length;
    const inactivePrograms = programs.data.filter(p => p.status === 'inactive').length;
    const totalHours = programs.data.reduce((sum, p) => sum + p.duration_hours, 0);

     // --- EFFECTS ---
    useEffect(() => {
        // Hide initial page skeleton after a short delay
        const timer = setTimeout(() => setLoading('initialLoad', false), 500);
        return () => clearTimeout(timer);
    }, []);

    // --- LOGIC HOOKS ---
    useEffect(() => {
        if (flash && flash.success) toast.success(flash.success);
        if (flash && flash.error) toast.error(flash.error);
    }, [flash]);

     useEffect(() => {
        // Don't run the filter on the initial load
        if (loadingStates.initialLoad) return;

        const handler = setTimeout(() => {
            router.get(
                route('admin.programs.manage_index'),
                { search, status: statusFilter },
                { 
                    preserveState: true, 
                    preserveScroll: true, 
                    replace: true,
                    onStart: () => setLoading('isFiltering', true),
                    onFinish: () => setLoading('isFiltering', false),
                }
            );
        }, 300);
        return () => clearTimeout(handler);
    }, [search, statusFilter, loadingStates.initialLoad]);
    
    useEffect(() => {
        const closeMenu = () => setActiveActionMenu(null);
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, []);

    const handleToggleStatus = (program: ProgramData) => {
        const newStatus = program.status === 'active' ? 'inactive' : 'active';
        router.post(route('admin.programs.toggle_status', program.id), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Program "${program.course_name}" is now ${newStatus}.`),
            onError: () => toast.error(`Failed to update program status.`),
        });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => {
                setIsRefreshing(false);
                toast.success('Programs refreshed!');
            }
        });
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('');
    };
    
 // 1. Render Page Skeleton on initial load
    if (loadingStates.initialLoad) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Manage Programs" />
                <PageLoadingSkeleton />
            </AppLayout>
        );
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Programs" />
            <Toaster position="top-right" reverseOrder={false} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* --- HEADER: Enhanced with stats --- */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <BookOpen className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Program Management</h1>
                                </div>
                                <p className="text-lg text-slate-600">Add, edit, and manage TESDA program offerings.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>
                                <Link
                                    href={route('admin.programs.create')}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg"
                                >
                                    <PlusCircle size={18} />
                                    <span>Add Program</span>
                                </Link>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Total Programs</p>
                                        <p className="text-2xl font-bold text-slate-900">{programs.total}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Active Programs</p>
                                        <p className="text-2xl font-bold text-green-700">{activePrograms}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Inactive Programs</p>
                                        <p className="text-2xl font-bold text-red-700">{inactivePrograms}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 rounded-lg">
                                        <Clock className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Total Hours</p>
                                        <p className="text-2xl font-bold text-amber-700">{totalHours.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- MAIN CONTENT CARD: Enhanced filters and responsive design --- */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                        
                        {/* Enhanced Filter Bar */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Filter & Search Programs
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
                                            placeholder="Search by program name, qualification level..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-4 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 min-w-[140px]"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="active">Active Only</option>
                                        <option value="inactive">Inactive Only</option>
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
                                        Showing {programs.data.length} of {programs.total} programs
                                        {search && <span> matching "{search}"</span>}
                                        {statusFilter && <span> with status "{statusFilter}"</span>}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content Area with Loading State */}
                        <div className="relative">
                            {(router.processing || isRefreshing) && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                                    <div className="flex items-center gap-3 bg-white rounded-lg shadow-lg px-6 py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent"></div>
                                        <span className="text-slate-700 font-medium">
                                            {isRefreshing ? 'Refreshing...' : 'Loading...'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {programs.data.length > 0 ? (
                                viewMode === 'table' ? (
                                    // Table View
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50 text-slate-700">
                                                <tr>
                                                    <th className="px-6 py-4 text-left font-semibold">Program Details</th>
                                                    <th className="px-6 py-4 text-left font-semibold">Qualification</th>
                                                    <th className="px-6 py-4 text-left font-semibold">Duration</th>
                                                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                                                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {programs.data.map((program, index) => (
                                                    <tr 
                                                        key={program.id} 
                                                        className={`border-b border-slate-200 hover:bg-slate-50/70 transition-all duration-200 ${
                                                            index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                                                        }`}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <p className="font-semibold text-slate-900">{program.course_name}</p>
                                                                {program.description && (
                                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                                        {program.description.substring(0, 80)}
                                                                        {program.description.length > 80 ? '...' : ''}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <Award className="w-4 h-4 text-amber-500" />
                                                                <span className="font-medium text-slate-700">{program.qualification_level}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-blue-500" />
                                                                <span className="text-slate-600">
                                                                    {program.duration_hours} hrs / {program.duration_days} days
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full ${
                                                                program.status === 'active' 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {program.status === 'active' ? (
                                                                    <CheckCircle className="w-3 h-3" />
                                                                ) : (
                                                                    <XCircle className="w-3 h-3" />
                                                                )}
                                                                {program.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="relative inline-block text-left">
                                                                <button 
                                                                    onClick={(e) => { 
                                                                        e.stopPropagation(); 
                                                                        setActiveActionMenu(program.id === activeActionMenu ? null : program.id); 
                                                                    }} 
                                                                    className="p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all duration-200"
                                                                >
                                                                    <MoreVertical size={18} />
                                                                </button>
                                                                {activeActionMenu === program.id && (
                                                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 border border-slate-200">
                                                                        <div className="py-2">
                                                                            <Link 
                                                                                href={route('admin.programs.edit', program.id)} 
                                                                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors w-full"
                                                                            >
                                                                                <Edit size={14} /> Edit Program
                                                                            </Link>
                                                                            <button 
                                                                                onClick={() => handleToggleStatus(program)} 
                                                                                className={`w-full text-left flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                                                                                    program.status === 'active' 
                                                                                        ? 'text-red-600 hover:bg-red-50' 
                                                                                        : 'text-green-600 hover:bg-green-50'
                                                                                }`}
                                                                            >
                                                                                {program.status === 'active' ? (
                                                                                    <><XCircle size={14} /> Deactivate</>
                                                                                ) : (
                                                                                    <><CheckCircle size={14} /> Activate</>
                                                                                )}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    // Card View
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {programs.data.map((program) => (
                                            <div key={program.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-slate-900 text-lg group-hover:text-green-700 transition-colors">
                                                            {program.course_name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Award className="w-4 h-4 text-amber-500" />
                                                            <span className="text-sm text-slate-600">{program.qualification_level}</span>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full ${
                                                        program.status === 'active' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {program.status === 'active' ? (
                                                            <CheckCircle className="w-3 h-3" />
                                                        ) : (
                                                            <XCircle className="w-3 h-3" />
                                                        )}
                                                        {program.status}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-blue-500" />
                                                        <span className="text-sm text-slate-600">{program.duration_hours} hrs</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-purple-500" />
                                                        <span className="text-sm text-slate-600">{program.duration_days} days</span>
                                                    </div>
                                                </div>

                                                {program.description && (
                                                    <p className="text-sm text-slate-500 mb-4 line-clamp-3">
                                                        {program.description}
                                                    </p>
                                                )}

                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={route('admin.programs.edit', program.id)}
                                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                                    >
                                                        <Edit size={14} />
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleToggleStatus(program)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                            program.status === 'active'
                                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        }`}
                                                    >
                                                        {program.status === 'active' ? (
                                                            <XCircle size={14} />
                                                        ) : (
                                                            <CheckCircle size={14} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-16 px-6">
                                    <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <BookOpen size={40} className="text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No Programs Found</h3>
                                    <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                        {search || statusFilter 
                                            ? "No programs match your current filters. Try adjusting your search criteria."
                                            : "Get started by creating your first TESDA program offering."
                                        }
                                    </p>
                                    {(search || statusFilter) ? (
                                        <button
                                            onClick={clearFilters}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                        >
                                            <AlertCircle size={16} />
                                            Clear Filters
                                        </button>
                                    ) : (
                                        <Link
                                            href={route('admin.programs.create')}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                        >
                                            <PlusCircle size={16} />
                                            Create Your First Program
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* --- ENHANCED PAGINATION --- */}
                            {programs.data.length > 0 && programs.links.length > 3 && (
                                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Users className="w-4 h-4" />
                                            <span>
                                                Showing <span className="font-semibold text-slate-800">{programs.from}</span> to{' '}
                                                <span className="font-semibold text-slate-800">{programs.to}</span> of{' '}
                                                <span className="font-semibold text-slate-800">{programs.total}</span> programs
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center gap-1">
                                            {programs.links.map((link, index) => {
                                                const isFirst = index === 0;
                                                const isLast = index === programs.links.length - 1;
                                                const className = `inline-flex items-center justify-center text-sm font-medium transition-all duration-200 h-10 ${
                                                    !link.url 
                                                        ? 'text-slate-400 cursor-not-allowed' 
                                                        : link.active 
                                                            ? 'bg-green-600 text-white rounded-lg shadow-sm w-10' 
                                                            : `text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-green-50 hover:border-green-300 hover:text-green-700 ${
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
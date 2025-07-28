import React, { useReducer, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Search, Filter, Users, CheckCircle, XCircle, Clock, Eye, User, Mail, Phone, MapPin, Calendar, BookOpen, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

// Import your loading components
import { 
    LoadingButton, 
    LoadingOverlay, 
    PageLoadingSkeleton, 
    TableLoadingSkeleton,
    useLoadingStates 
} from '@/components/Loading';

import { StatusBadge } from '@/components/Enrollments/StatusBadge';
import { LearnerInfo } from '@/components/Enrollments/LearnerInfo';
import { ActionButtons } from '@/components/Enrollments/ActionButtons';
import { MyModal } from '@/components/Enrollments/MyModal';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

// --- Interfaces (same as before) ---
interface ToastNotification {
    id: string;
    type: 'success' | 'error';
    title: string;
    message: string;
    duration?: number;
}

interface LearnerData {
    learner_id: number;
    first_name: string;
    last_name: string;
    email: string;
    contact_no: string;
    program_name: string;
    created_at: string;
    enrollment_status: 'pending' | 'accepted' | 'rejected';
    address?: {
        city_municipality: string;
        province: string;
        email_address?: string;
    };
    user?: {
        email: string;
    };
}

interface AdminEnrollmentsProps extends PageProps {
    recentLearners: {
        data: LearnerData[];
        links: Array<{ url: string | null; label: string; active: boolean; }>;
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        per_page: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

// --- Updated State and Reducer ---
type State = {
    showConfirmation: boolean;
    selectedLearner: LearnerData | null;
    actionType: 'accept' | 'reject' | null;
    toasts: ToastNotification[];
};

type Action =
    | { type: 'SHOW_CONFIRMATION', learner: LearnerData, actionType: 'accept' | 'reject' }
    | { type: 'HIDE_CONFIRMATION' }
    | { type: 'ADD_TOAST', toast: Omit<ToastNotification, 'id'> }
    | { type: 'REMOVE_TOAST', id: string };

const initialState: State = {
    showConfirmation: false,
    selectedLearner: null,
    actionType: null,
    toasts: [],
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SHOW_CONFIRMATION':
            return { ...state, showConfirmation: true, selectedLearner: action.learner, actionType: action.actionType };
        case 'HIDE_CONFIRMATION':
            return { ...state, showConfirmation: false, selectedLearner: null, actionType: null };
        case 'ADD_TOAST':
            const id = Date.now().toString();
            return { ...state, toasts: [...state.toasts, { ...action.toast, id }] };
        case 'REMOVE_TOAST':
            return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
        default:
            return state;
    }
}

// --- Breadcrumbs ---
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Enrollments',
        href: '/admin/enrollments',
    },
];

// --- Enhanced useEnrollmentActions Hook ---
function useEnrollmentActions(
    dispatch: React.Dispatch<Action>, 
    setLoading: (key: string, value: boolean) => void
) {
    const handleAction = (learner: LearnerData, actionType: 'accept' | 'reject') => {
        dispatch({ type: 'SHOW_CONFIRMATION', learner, actionType });
    };

    const confirmAction = async (learner: LearnerData | null, actionType: 'accept' | 'reject' | null) => {
        if (!learner || !actionType) return;
        
        setLoading('actionProcess', true);
        const routeName = actionType === 'accept' ? 'admin.enrollment.accept' : 'admin.enrollment.reject';
        
        try {
            await router.post(route(routeName, learner.learner_id), {}, {
                onSuccess: () => {
                    dispatch({
                        type: 'ADD_TOAST',
                        toast: {
                            type: 'success',
                            title: actionType === 'accept' ? 'Enrollment Accepted!' : 'Enrollment Rejected!',
                            message: `${learner.first_name} ${learner.last_name}'s enrollment has been ${actionType}ed successfully.`,
                            duration: 5000
                        }
                    });
                    dispatch({ type: 'HIDE_CONFIRMATION' });
                },
                onError: (errors) => {
                    console.error('Inertia.js POST error:', errors);
                    dispatch({
                        type: 'ADD_TOAST',
                        toast: {
                            type: 'error',
                            title: 'Action Failed',
                            message: `Failed to ${actionType} the enrollment. Please try again.`,
                            duration: 6000
                        }
                    });
                },
                onFinish: () => {
                    setLoading('actionProcess', false);
                }
            });
        } catch (e) {
            console.error('Network or unexpected error during enrollment action:', e);
            dispatch({
                type: 'ADD_TOAST',
                toast: {
                    type: 'error',
                    title: 'Network Error',
                    message: `Could not ${actionType} enrollment due to a network error.`,
                    duration: 6000
                }
            });
            setLoading('actionProcess', false);
        }
    };

    const cancelAction = () => {
        dispatch({ type: 'HIDE_CONFIRMATION' });
    };

    const removeToast = (id: string) => {
        dispatch({ type: 'REMOVE_TOAST', id });
    };

    return { handleAction, confirmAction, cancelAction, removeToast };
}

// --- Main Enrollments Component ---
export default function Enrollments() {
    const { recentLearners, filters } = usePage<AdminEnrollmentsProps>().props;

    // Use the custom loading states hook
    const { loadingStates, setLoading, isAnyLoading } = useLoadingStates({
        pageLoad: true // Start with page loading
    });

    // useReducer for UI state
    const [state, dispatch] = useReducer(reducer, initialState);
    const { handleAction, confirmAction, cancelAction, removeToast } = useEnrollmentActions(dispatch, setLoading);

    // Filter states
    const [search, setSearch] = React.useState(filters.search || '');
    const [statusFilter, setStatusFilter] = React.useState(filters.status || '');

    // Initial page load effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading('pageLoad', false);
        }, 1000); // Simulate loading time

        return () => clearTimeout(timer);
    }, [setLoading]);

    // Update filter states when props change
    useEffect(() => {
        setSearch(filters.search || '');
        setStatusFilter(filters.status || '');
    }, [filters.search, filters.status, recentLearners.current_page]);

    // Apply filters with loading state
    const applyFilters = (page: number = 1) => {
        setLoading('filterApply', true);
        
        router.get(
            route('admin.enrollments'),
            { search, status: statusFilter, page },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setLoading('filterApply', false);
                }
            }
        );
    };

    // Debounced search effect
    useEffect(() => {
        const handler = setTimeout(() => {
            if (search !== (filters.search || '') || statusFilter !== (filters.status || '')) {
                applyFilters(1);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [search, statusFilter]);

    // Handle search input
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    // Clear filters
    const clearFilters = () => {
        setSearch('');
        setStatusFilter('');
        applyFilters(1);
    };

    // Get enrollment stats
    const getEnrollmentStats = () => {
        const stats = {
            total: recentLearners.total,
            pending: 0,
            accepted: 0,
            rejected: 0
        };

        recentLearners.data.forEach(learner => {
            const status = learner.enrollment_status ?? 'pending';
            if (status === 'pending') stats.pending++;
            else if (status === 'accepted') stats.accepted++;
            else if (status === 'rejected') stats.rejected++;
        });

        return stats;
    };

    const stats = getEnrollmentStats();

    // Show page loading skeleton
    if (loadingStates.pageLoad) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Enrollments" />
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <PageLoadingSkeleton 
                            showHeader={true}
                            showStats={true}
                            showFilters={true}
                            showTable={true}
                        />
                    </div>
                </div>
            </AppLayout>
        );
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enrollments" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Enrollment Management</h1>
                                <p className="text-gray-600 mt-2">Review and manage student enrollment applications</p>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full lg:w-auto">
                                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                        <p className="text-sm text-gray-500">Total</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                                        <p className="text-sm text-gray-500">Pending</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
                                        <p className="text-sm text-gray-500">Accepted</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                                        <p className="text-sm text-gray-500">Rejected</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
                        <div className="p-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Search Input */}
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={search}
                                        onChange={handleSearchChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>

                                {/* Status Filter */}
                                <div className="w-full lg:w-64">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="pending">Pending</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                                {/* Clear Filters Button */}
                                <button
                                    onClick={() => { setSearch(''); setStatusFilter(''); applyFilters(1); }}
                                    className="w-full lg:w-auto px-4 py-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Filter className="w-5 h-5" /> Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Enrollments Table */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                        {recentLearners.data.length > 0 ? (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Student</th>
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Course</th>
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Location</th>
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Date</th>
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {recentLearners.data.map((learner) => (
                                                <tr key={learner.learner_id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-6">
                                                        <LearnerInfo learner={learner} />
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm text-gray-900">{learner.program_name || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm text-gray-900">
                                                                {learner.address ? `${learner.address.city_municipality}, ${learner.address.province}` : 'N/A'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm text-gray-900">{new Date(learner.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <StatusBadge status={learner.enrollment_status} />
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <ActionButtons learner={learner} onAction={handleAction} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards (Visible on smaller screens) */}
                                <div className="lg:hidden divide-y divide-gray-200">
                                    {recentLearners.data.map((learner) => (
                                        <div key={learner.learner_id} className="p-6 border-b last:border-b-0">
                                            <div className="flex items-start justify-between mb-4">
                                                <LearnerInfo learner={learner} />
                                                <StatusBadge status={learner.enrollment_status} />
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="w-4 h-4 flex-shrink-0" />
                                                    {learner.user?.email || learner.address?.email_address || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="w-4 h-4 flex-shrink-0" />
                                                    {learner.contact_no || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <BookOpen className="w-4 h-4 flex-shrink-0" />
                                                    {learner.course_qualification || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <MapPin className="w-4 h-4 flex-shrink-0" />
                                                    {learner.address ? `${learner.address.city_municipality}, ${learner.address.province}` : 'N/A'}
                                                </div>
                                            </div>

                                            {/* Mobile Dropdown Menu for Actions (You'd need to re-implement this if not using Radix DropdownMenu) */}
                                            {/* For simplicity, I'm omitting the full DropdownMenu implementation if you removed Radix dependencies entirely.
                                                If you just replaced Dialog, and kept DropdownMenu, this block can remain. */}
                                            {/* If you removed Radix DropdownMenu, you'd replace this with a custom dropdown */}
                                            {/* For demonstration, I'll keep the DropdownMenu logic as is, assuming only Dialog was changed.
                                                If you want to remove all Radix dependencies, this part would need a custom implementation too. */}
                                            <div className="flex justify-end">
                                                {/* Assuming you still have DropdownMenu or an equivalent */}
                                                <DropdownMenu.Root>
                                                    <DropdownMenu.Trigger asChild>
                                                        <button
                                                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                                            aria-label="More actions"
                                                        >
                                                            <MoreHorizontal className="w-5 h-5" />
                                                        </button>
                                                    </DropdownMenu.Trigger>

                                                    <DropdownMenu.Portal>
                                                        <DropdownMenu.Content
                                                            className="bg-white rounded-lg shadow-lg border border-gray-200 p-1.5 z-50 min-w-[150px]
                                                                data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade
                                                                data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                                                            sideOffset={5}
                                                        >
                                                            <DropdownMenu.Item asChild>
                                                                <Link
                                                                    href={route('admin.enrollment.show', { learner: learner.learner_id, from: 'enrollments' })}
                                                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:bg-blue-50 focus:text-blue-700 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 data-[highlighted]:outline-none transition-colors cursor-pointer"
                                                                >
                                                                    <Eye className="w-4 h-4" /> View Details
                                                                </Link>
                                                            </DropdownMenu.Item>

                                                            {(learner.enrollment_status ?? 'pending').toLowerCase().trim() === 'pending' && (
                                                                <>
                                                                    <DropdownMenu.Separator className="h-[1px] bg-gray-200 my-1" />
                                                                    <DropdownMenu.Item asChild>
                                                                        <button
                                                                            onClick={() => handleAction(learner, 'accept')}
                                                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-green-700 hover:bg-green-50 focus:outline-none focus:bg-green-50 data-[highlighted]:bg-green-50 data-[highlighted]:outline-none transition-colors cursor-pointer w-full text-left"
                                                                        >
                                                                            <CheckCircle className="w-4 h-4" /> Accept
                                                                        </button>
                                                                    </DropdownMenu.Item>
                                                                    <DropdownMenu.Item asChild>
                                                                        <button
                                                                            onClick={() => handleAction(learner, 'reject')}
                                                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 data-[highlighted]:bg-red-50 data-[highlighted]:outline-none transition-colors cursor-pointer w-full text-left"
                                                                        >
                                                                            <XCircle className="w-4 h-4" /> Reject
                                                                        </button>
                                                                    </DropdownMenu.Item>
                                                                </>
                                                            )}
                                                        </DropdownMenu.Content>
                                                    </DropdownMenu.Portal>
                                                </DropdownMenu.Root>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Enhanced Pagination */}
                                {recentLearners.links.length > 3 && (
                                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="text-sm text-gray-700">
                                                Showing <span className="font-medium">{recentLearners.from}</span> to <span className="font-medium">{recentLearners.to}</span> of{' '}
                                                <span className="font-medium">{recentLearners.total}</span> results
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {recentLearners.links.map((link, index) => {
                                                    const isNumeric = /^\d+$/.test(link.label);
                                                    const isPrevious = link.label.includes('Previous');
                                                    const isNext = link.label.includes('Next');

                                                    let buttonContent;
                                                    if (isPrevious) {
                                                        buttonContent = <><ChevronLeft className="w-4 h-4" /> Previous</>;
                                                    } else if (isNext) {
                                                        buttonContent = <>Next <ChevronRight className="w-4 h-4" /></>;
                                                    } else {
                                                        buttonContent = link.label;
                                                    }

                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() => link.url && applyFilters(Number(new URL(link.url).searchParams.get('page')) || 1)}
                                                            disabled={!link.url || link.active}
                                                            className={`
                                                                inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                                                                ${link.active
                                                                    ? 'bg-blue-600 text-dark shadow-sm'
                                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                                }
                                                                ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                                                            `}
                                                        >
                                                            {buttonContent}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-lg mb-2">No enrollments found</p>
                                <p className="text-gray-400">Try adjusting your search criteria or checking back later.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Confirmation Modal (MyModal) */}
            <MyModal
                isOpen={state.showConfirmation}
                onClose={cancelAction}
                onConfirm={() => confirmAction(state.selectedLearner, state.actionType)}
                title={state.actionType === 'accept' ? 'Accept Enrollment' : 'Reject Enrollment'}
                message="This action cannot be undone."
                isLoading={state.isLoading}
                actionType={state.actionType}
                selectedLearner={state.selectedLearner} // Pass the selected learner data
            />

            {/* Toast Notifications Container */}
            <div className="fixed top-4 right-4 z-[60] space-y-3 max-w-sm w-full pointer-events-none">
                {state.toasts.map((toast: ToastNotification) => (
                    <div
                        key={toast.id}
                        className={`relative p-4 rounded-xl shadow-lg transform transition-all duration-300 ease-out translate-x-0 opacity-100 ${
                            toast.type === 'success'
                                ? 'bg-green-600'
                                : 'bg-red-600'
                        } text-dark flex items-start gap-3 pointer-events-auto`}
                    >
                        <div className="flex-shrink-0">
                            {toast.type === 'success' ? (
                                <CheckCircle className="w-6 h-6" />
                            ) : (
                                <XCircle className="w-6 h-6" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-lg">{toast.title}</p>
                            <p className="text-sm mt-1 opacity-90">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                            aria-label="Close toast"
                        >
                            <XCircle className="w-5 h-5" />
                        </button>
                        {/* Progress bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
                            <div
                                className="h-full bg-white animate-shrink rounded-full"
                                style={{ animationDuration: `${toast.duration || 5000}ms` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom CSS for animations (place in a main CSS file or global style block) */}
            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }

                @keyframes slideDownAndFade {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUpAndFade {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideRightAndFade {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideLeftAndFade {
                    from { opacity: 0; transform: translateX(10px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                /* If you kept Radix DropdownMenu, these styles are still relevant */
                [data-radix-popper-content-wrapper] {
                    z-index: 60;
                }
                .data-[side=top]:animate-slideDownAndFade { animation: slideDownAndFade 0.2s ease-out forwards; }
                .data-[side=bottom]:animate-slideUpAndFade { animation: slideUpAndFade 0.2s ease-out forwards; }
                .data-[side=left]:animate-slideRightAndFade { animation: slideRightAndFade 0.2s ease-out forwards; }
                .data-[side=right]:animate-slideLeftAndFade { animation: slideLeftAndFade 0.2s ease-out forwards; }

                /* Custom animations for toast notifications */
                @keyframes slideInFromRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-in.slide-in-from-right-full {
                    animation: slideInFromRight 0.5s ease-out forwards;
                }
            `}</style>
        </AppLayout>
    );
}
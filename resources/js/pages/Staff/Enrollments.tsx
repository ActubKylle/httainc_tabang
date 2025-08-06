import React, { useReducer, useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    Search, Filter, Users, CheckCircle, XCircle, Clock, Eye, Mail, Phone, MapPin,
    Calendar, BookOpen, ChevronLeft, ChevronRight, MoreHorizontal, AlertCircle, Info, X
} from 'lucide-react';
import echo from '@/echo';
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






// --- UPDATED INTERFACES ---

interface ToastNotification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
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

interface staffEnrollmentsProps extends PageProps {
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


// --- STATE MANAGEMENT (Reducer is the same) ---
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


// --- NEW ENHANCED TOAST COMPONENTS ---

const EnhancedToast = ({
    toast,
    onRemove
}: {
    toast: ToastNotification;
    onRemove: (id: string) => void;
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        // Initial fade-in animation
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Progress bar and auto-dismiss logic
        const duration = toast.duration || 5000;
        let progressTimer: NodeJS.Timeout;

        if (duration) {
            const startTime = Date.now();
            const updateProgress = () => {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, duration - elapsed);
                const newProgress = (remaining / duration) * 100;

                setProgress(newProgress);

                if (remaining > 0) {
                    progressTimer = setTimeout(updateProgress, 50);
                } else {
                    handleRemove();
                }
            };
            progressTimer = setTimeout(updateProgress, 50);
        }

        return () => clearTimeout(progressTimer);
    }, [toast.duration]);

    const handleRemove = () => {
        setIsRemoving(true);
        setTimeout(() => onRemove(toast.id), 300); // Wait for exit animation
    };

    const getToastStyles = () => {
        const baseStyles = "relative backdrop-blur-sm border shadow-2xl";

        switch (toast.type) {
            case 'success':
                return `${baseStyles} bg-gradient-to-r from-htta-green/95 to-htta-light-green/95 border-htta-light-green/50 text-white`;
            case 'error':
                return `${baseStyles} bg-gradient-to-r from-red-500/95 to-rose-600/95 border-red-400/50 text-white`;
            case 'warning':
                return `${baseStyles} bg-gradient-to-r from-htta-gold/95 to-amber-600/95 border-htta-gold/50 text-gray-900`;
            case 'info':
                return `${baseStyles} bg-gradient-to-r from-htta-blue/95 to-htta-dark-blue/95 border-htta-blue/50 text-white`;
            default:
                return `${baseStyles} bg-white/95 border-gray-200 text-gray-900`;
        }
    };

    const getIcon = () => {
        const iconProps = { className: "w-6 h-6 flex-shrink-0" };
        switch (toast.type) {
            case 'success': return <CheckCircle {...iconProps} />;
            case 'error': return <XCircle {...iconProps} />;
            case 'warning': return <AlertCircle {...iconProps} />;
            case 'info': return <Info {...iconProps} />;
            default: return <Info {...iconProps} />;
        }
    };

    return (
        <div
            className={`
                transform transition-all duration-300 ease-out
                ${isVisible && !isRemoving
                    ? 'translate-x-0 opacity-100 scale-100'
                    : 'translate-x-full opacity-0 scale-95'
                }
                ${getToastStyles()}
                rounded-xl overflow-hidden max-w-md w-full group hover:scale-[1.02] hover:shadow-3xl animate-fade-in
            `}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-4">
                <div className="flex items-start gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 animate-ping opacity-20">{getIcon()}</div>
                        <div className="relative">{getIcon()}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <h4 className="font-semibold text-base leading-tight mb-1">{toast.title}</h4>
                                <p className="text-sm opacity-95 leading-relaxed">{toast.message}</p>
                                {toast.action && (
                                    <button
                                        onClick={toast.action.onClick}
                                        className="mt-3 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors duration-200 htta-button-primary"
                                    >
                                        {toast.action.label}
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={handleRemove}
                                className="flex-shrink-0 p-1.5 rounded-full hover:bg-white/20 transition-colors duration-200 group/close"
                                aria-label="Close notification"
                            >
                                <X className="w-4 h-4 group-hover/close:rotate-90 transition-transform duration-200" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                <div
                    className="h-full bg-white/80 transition-all duration-75 ease-linear relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent htta-skeleton" />
                </div>
            </div>
            <div className="absolute inset-0 rounded-xl border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
    );
};

const EnhancedToastContainer = ({
    toasts,
    onRemoveToast
}: {
    toasts: ToastNotification[];
    onRemoveToast: (id: string) => void;
}) => {
    return (
        <div className="fixed top-4 right-4 z-[70] space-y-3 max-w-md w-full pointer-events-none">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    className="pointer-events-auto htta-nav-item"
                    style={{
                        animationDelay: `${index * 100}ms`,
                        zIndex: 70 - index
                    }}
                >
                    <EnhancedToast
                        toast={toast}
                        onRemove={onRemoveToast}
                    />
                </div>
            ))}
        </div>
    );
};


// --- BREADCRUMBS ---
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Enrollments',
        href: '/staff/enrollments',
    },
];

// --- CUSTOM HOOK FOR ACTIONS ---
function useEnrollmentActions(
    dispatch: React.Dispatch<Action>,
    setLoading: (key: string, value: boolean) => void
) {
    const handleAction = (learner: LearnerData, actionType: 'accept' | 'reject') => {
        dispatch({ type: 'SHOW_CONFIRMATION', learner, actionType });
    };

    const confirmAction = async (learner: LearnerData | null, actionType: 'accept' | 'reject' | null) => {
    if (!learner || !actionType) return;

    const loadingKey = `${actionType}_${learner.learner_id}`;
    setLoading(loadingKey, true);
    setLoading('actionProcess', true);

    const routeName = actionType === 'accept' ? 'staff.enrollment.accept' : 'staff.enrollment.reject';

    try {
        await router.post(route(routeName, learner.learner_id), {}, {
            onSuccess: () => {
                dispatch({
                    type: 'ADD_TOAST',
                    toast: {
                        // This now correctly sets the type based on the action
                        type: actionType === 'reject' ? 'error' : 'success', 
                        title: actionType === 'accept' ? 'Enrollment Accepted!' : 'Enrollment Rejected!',
                        message: `${learner.first_name} ${learner.last_name}'s enrollment has been ${actionType}.`,
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
                setLoading(loadingKey, false);
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
        setLoading(loadingKey, false);
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
    const { recentLearners, filters, auth } = usePage<staffEnrollmentsProps & { auth: any }>().props;

    const { loadingStates, setLoading } = useLoadingStates({ pageLoad: true });
    const [state, dispatch] = useReducer(reducer, initialState);
    const { handleAction, confirmAction, cancelAction, removeToast } = useEnrollmentActions(dispatch, setLoading);
    const [search, setSearch] = React.useState(filters.search || '');
    const [statusFilter, setStatusFilter] = React.useState(filters.status || '');

    // --- EFFECTS ---

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const applyFilters = (page: number = 1) => {
        setLoading('filterApply', true);
        router.get(
            route('staff.enrollments'),
            { search, status: statusFilter, page },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setLoading('filterApply', false),
            }
        );
    };

    
const playSound = (soundFile: string) => {
    const audio = new Audio(soundFile);
    audio.play().catch(error => {
        console.error("Audio playback failed:", error);
    });
};



    // Pusher notifications
    useEffect(() => {
        if (auth.user?.role !== 'staff') {
            return;
        }
        const channel = echo.private('staff-enrollments');
        channel.listen('.learner.registered', (event: any) => {
                        playSound('/sounds/notification.wav');

            dispatch({
                type: 'ADD_TOAST',
                toast: {
                    type: 'info', // Changed to 'info' type
                    title: 'New Registration!',
                    message: event.message || `A new learner has registered.`,
                    duration: 6000,
                    action: {
                        label: 'Refresh',
                        onClick: () => router.reload({ only: ['recentLearners'] })
                    }
                },
            });
             // Optionally auto-reload data in the background
            router.reload({ only: ['recentLearners'], preserveState: true, preserveScroll: true });


        });
        return () => {
            channel.stopListening('.learner.registered');
            echo.leave('staff-enrollments');
        };
    }, [auth.user, dispatch]);

    // Initial page load effect
    useEffect(() => {
        const timer = setTimeout(() => setLoading('pageLoad', false), 1000);
        return () => clearTimeout(timer);
    }, [setLoading]);

    const getEnrollmentStats = () => {
        const stats = {
            total: recentLearners.total, pending: 0, accepted: 0, rejected: 0
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

    // --- RENDER LOGIC ---
    if (loadingStates.pageLoad) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Enrollments" />
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <PageLoadingSkeleton
                            showHeader={true} showStats={true} showFilters={true} showTable={true}
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
                                                        <ActionButtons learner={learner} onAction={handleAction} 
                                                        />
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
                                                                    href={route('staff.enrollment.show', { learner: learner.learner_id, from: 'enrollments' })}
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
                onConfirm={() => {
                    console.log('🔘 Modal confirm clicked, current loading state:', loadingStates.actionProcess);
                    confirmAction(state.selectedLearner, state.actionType);
                }}
                title={state.actionType === 'accept' ? 'Accept Enrollment' : 'Reject Enrollment'}
                message="This action cannot be undone."
                isLoading={loadingStates.actionProcess}
                actionType={state.actionType}
                selectedLearner={state.selectedLearner}
            />



            {/* Toast Notifications Container */}
                       <EnhancedToastContainer toasts={state.toasts} onRemoveToast={removeToast} />


            {/* Custom CSS for animations (place in a main CSS file or global style block) */}
            <style>{`
                /* Radix DropdownMenu animations */
                @keyframes slideDownAndFade { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUpAndFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideRightAndFade { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes slideLeftAndFade { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }

                [data-radix-popper-content-wrapper] { z-index: 80; } /* Ensure dropdown is above toast */
                .data-\[side=top\]\:animate-slideDownAndFade { animation: slideDownAndFade 0.2s ease-out forwards; }
                .data-\[side=bottom\]\:animate-slideUpAndFade { animation: slideUpAndFade 0.2s ease-out forwards; }
                .data-\[side=left\]\:animate-slideRightAndFade { animation: slideRightAndFade 0.2s ease-out forwards; }
                .data-\[side=right\]\:animate-slideLeftAndFade { animation: slideLeftAndFade 0.2s ease-out forwards; }

                /* Enhanced keyframes for Toasts */
                @keyframes toastSlideIn {
                    from { transform: translateX(100%) scale(0.8); opacity: 0; }
                    to { transform: translateX(0) scale(1); opacity: 1; }
                }
                @keyframes toastSlideOut {
                    from { transform: translateX(0) scale(1); opacity: 1; }
                    to { transform: translateX(100%) scale(0.8); opacity: 0; }
                }
                @keyframes toastPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                }
                
                /* Added from prompt for new component styles */
                .shadow-3xl {
                    box-shadow: 0 25px 50px -12px rgba(0, 107, 62, 0.25), 0 10px 20px -5px rgba(0, 107, 62, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1);
                }
                .dark .shadow-3xl {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 10px 20px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05);
                }
                .htta-toast-enter { animation: toastSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
                .htta-toast-exit { animation: toastSlideOut 0.3s ease-in forwards; }

                /* Fallback animations if specific classes aren't used */
                @keyframes shrink { from { width: 100%; transform: scaleX(1); } to { width: 0%; transform: scaleX(0); } }
                .animate-shrink { animation-fill-mode: forwards; }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .htta-skeleton {
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                    background-size: 200% 100%;
                    animation: shimmer 2s ease-in-out infinite;
                }
            `}</style>
        </AppLayout>
    );
}
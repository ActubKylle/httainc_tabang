import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Filter, Users, MoreHorizontal, Eye, BarChart2, Inbox } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { LearnerInfo } from '@/components/Enrollments/LearnerInfo';
import { StatusBadge } from '@/components/Enrollments/StatusBadge';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useLoadingStates, TableLoadingSkeleton, PageLoadingSkeleton } from '@/components/Loading';

// --- Interfaces ---
interface StudentData {
    learner_id: number;
    first_name: string;
    last_name: string;
    email: string;
    contact_no?: string;
    picture_image_url?: string;
    program_name: string;
    enrollment_status: 'Enrolled' | 'Completed' | 'Dropped';
    attendance_summary: string;
}

interface StudentListProps extends PageProps {
    students: {
        data: StudentData[];
        links: { url: string | null; label: string; active: boolean; }[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        program?: string;
    };
    programs: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Student Directory', href: route('admin.students.index') }
];

export default function StudentList({ students, filters, programs = [] }: StudentListProps) {
    // --- STATE MANAGEMENT ---
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [programFilter, setProgramFilter] = useState(filters.program || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const { loadingStates, setLoading } = useLoadingStates({ isFiltering: false });

    // --- EFFECTS ---
    useEffect(() => {
        // Timer to handle the initial page skeleton display
        const timer = setTimeout(() => setIsInitialLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Effect to handle data fetching for filters
        const hasSearchChanged = debouncedSearchTerm !== (filters.search || '');
        const hasProgramChanged = programFilter !== (filters.program || '');

        if (!isInitialLoading && (hasSearchChanged || hasProgramChanged)) {
            router.get(route('admin.students.index'), {
                search: debouncedSearchTerm,
                program: programFilter,
            }, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
                onStart: () => setLoading('isFiltering', true),
                onFinish: () => setLoading('isFiltering', false),
            });
        }
    }, [debouncedSearchTerm, programFilter, isInitialLoading]);

    // --- HANDLERS ---
    const handleClearFilters = () => {
        setSearchTerm('');
        setProgramFilter('');
    };

    // --- RENDER LOGIC ---

    // 1. Render Page Skeleton on initial load
    if (isInitialLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Student Directory" />
                <PageLoadingSkeleton />
            </AppLayout>
        );
    }
    
    // 2. Render the actual component content
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Directory" />
            <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header and Statistics Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Student Directory</h1>
                        <p className="text-gray-600 mt-2">A master list of all accepted students. Monitor progress and manage records.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{students.total}</p>
                                <p className="text-sm text-gray-500 font-medium">Total Students</p>
                            </div>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6 p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
                            <div className="relative sm:col-span-2 lg:col-span-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <select onChange={(e) => setProgramFilter(e.target.value)} value={programFilter} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Filter by Program</option>
                                {programs.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <button onClick={handleClearFilters} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center justify-center gap-2">
                                <Filter className="w-4 h-4" /> Clear
                            </button>
                        </div>
                    </div>
                    
                    {/* Main Content with Table Skeleton for filtering */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        {loadingStates.isFiltering ? (
                            <TableLoadingSkeleton rows={10} />
                        ) : students.data.length > 0 ? (
                            <>
                                {/* Desktop Table View */}
                                <div className="overflow-x-auto hidden lg:block">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program & Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {students.data.map((student) => (
                                                <tr key={student.learner_id}>
                                                    <td className="px-6 py-4 whitespace-nowrap"><LearnerInfo learner={student as any} /></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.contact_no || 'N/A'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{student.program_name}</div>
                                                        <div className="mt-1"><StatusBadge status={student.enrollment_status as any} /></div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"><span>{student.attendance_summary}</span></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <DropdownMenu.Root>
                                                            <DropdownMenu.Trigger asChild><button className="p-2 rounded-full hover:bg-gray-100 text-gray-500"><MoreHorizontal className="w-5 h-5" /></button></DropdownMenu.Trigger>
                                                            <DropdownMenu.Portal>
                                                                <DropdownMenu.Content className="bg-white rounded-md shadow-lg border p-1 w-48 z-10">
                                                                    <DropdownMenu.Item asChild><Link href={route('admin.enrollment.show', { learner: student.learner_id, from: 'students' })} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 rounded hover:bg-gray-100 cursor-pointer"><Eye className="w-4 h-4" /> View Profile</Link></DropdownMenu.Item>
                                                                    <DropdownMenu.Item asChild><Link href={'#'} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 rounded hover:bg-gray-100 cursor-pointer"><BarChart2 className="w-4 h-4" /> View Attendance</Link></DropdownMenu.Item>
                                                                </DropdownMenu.Content>
                                                            </DropdownMenu.Portal>
                                                        </DropdownMenu.Root>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="lg:hidden divide-y divide-gray-200">
                                    {students.data.map((student) => (
                                        <div key={student.learner_id} className="p-4">
                                            <div className="flex justify-between items-start">
                                                <LearnerInfo learner={student as any} />
                                                <DropdownMenu.Root>
                                                    <DropdownMenu.Trigger asChild><button className="p-2 -mt-2 -mr-2 rounded-full hover:bg-gray-100 text-gray-500"><MoreHorizontal className="w-5 h-5" /></button></DropdownMenu.Trigger>
                                                    <DropdownMenu.Portal>
                                                        <DropdownMenu.Content className="bg-white rounded-md shadow-lg border p-1 w-48 z-10">
                                                            <DropdownMenu.Item asChild><Link href={route('admin.enrollment.show', { learner: student.learner_id, from: 'students' })} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 rounded hover:bg-gray-100 cursor-pointer"><Eye className="w-4 h-4" /> View Profile</Link></DropdownMenu.Item>
                                                            <DropdownMenu.Item asChild><Link href={'#'} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 rounded hover:bg-gray-100 cursor-pointer"><BarChart2 className="w-4 h-4" /> View Attendance</Link></DropdownMenu.Item>
                                                        </DropdownMenu.Content>
                                                    </DropdownMenu.Portal>
                                                </DropdownMenu.Root>
                                            </div>
                                            <div className="mt-4 space-y-3">
                                                <div className="text-sm">
                                                    <p className="font-medium text-gray-500">Program</p>
                                                    <p className="text-gray-900">{student.program_name}</p>
                                                </div>
                                                <div className="text-sm">
                                                    <p className="font-medium text-gray-500">Status</p>
                                                    <StatusBadge status={student.enrollment_status as any} />
                                                </div>
                                                <div className="text-sm">
                                                    <p className="font-medium text-gray-500">Attendance</p>
                                                    <p className="text-gray-900">{student.attendance_summary}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No Students Found</h3>
                                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                            </div>
                        )}
                        
                        {/* Pagination */}
                        {!loadingStates.isFiltering && students.data.length > 0 && (
                             <div className="border-t border-gray-200 bg-white px-6 py-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{students.from}</span> to <span className="font-medium">{students.to}</span> of{' '}
                                        <span className="font-medium">{students.total}</span> results
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {students.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || ''}
                                                preserveScroll
                                                className={`inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${link.active ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''} ${link.label.includes('Previous') || link.label.includes('Next') ? 'px-4' : 'w-10 h-10'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Filter, Users, MoreHorizontal, Eye, BarChart2, Inbox, RefreshCw, GraduationCap, Phone, Mail, UserCheck, Calendar, UserX } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { LearnerInfo } from '@/components/Enrollments/LearnerInfo';
import { StatusBadge } from '@/components/Enrollments/StatusBadge';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AttendanceCell } from '@/components/Students/AttendanceCell';
import { useLoadingStates, TableLoadingSkeleton, PageLoadingSkeleton } from '@/components/Loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import toast, { Toaster } from 'react-hot-toast';

// --- Interfaces ---
interface StudentData {
    learner_id: number;
    first_name: string;
    last_name: string;
    email: string;
    contact_no?: string;
    picture_image_url?: string;
    program_name: string;
    enrollment_status: 'Enrolled' | 'Dropped';
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
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Student Directory', href: route('staff.students.index') }
];

export default function StudentList({ students, filters, programs = [], flash }: StudentListProps) {
    // --- STATE MANAGEMENT ---
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [programFilter, setProgramFilter] = useState(filters.program || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { loadingStates, setLoading } = useLoadingStates({ isFiltering: false });

    // --- EFFECTS ---
    useEffect(() => {
        const timer = setTimeout(() => setIsInitialLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const hasSearchChanged = debouncedSearchTerm !== (filters.search || '');
        const hasProgramChanged = programFilter !== (filters.program || '');

        if (!isInitialLoading && (hasSearchChanged || hasProgramChanged)) {
            router.get(route('staff.students.index'), {
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

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                duration: 4000,
                style: { background: '#10b981', color: 'white' },
            });
        }
        if (flash?.error) {
            toast.error(flash.error, {
                duration: 4000,
                style: { background: '#ef4444', color: 'white' },
            });
        }
    }, [flash]);

    // --- HANDLERS ---
    const handleClearFilters = () => {
        setSearchTerm('');
        setProgramFilter('');
        toast.success('Filters cleared!', { icon: '🧹' });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({ 
            onFinish: () => {
                setIsRefreshing(false);
                toast.success('Data refreshed!', { icon: '🔄' });
            }
        });
    };

    // --- STATS CALCULATION ---
    const getStudentStats = () => {
        const total = students.total;
        const enrolled = students.data.filter(s => s.enrollment_status === 'Enrolled').length;
        const dropped = students.data.filter(s => s.enrollment_status === 'Dropped').length;
        return { total, enrolled, dropped };
    };

    const stats = getStudentStats();

    // --- RENDER LOGIC ---
    if (isInitialLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Student Directory" />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
                    <div className="container mx-auto px-4 py-8">
                        <PageLoadingSkeleton />
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Directory" />
            <Toaster 
                position="top-right" 
                reverseOrder={false}
                toastOptions={{
                    className: 'font-medium',
                    duration: 4000
                }}
            />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* --- ENHANCED HEADER --- */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl shadow-sm">
                                        <Users className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                            Student Directory
                                        </h1>
                                        <p className="text-lg text-slate-600 mt-1">
                                            Master list of all accepted students. Monitor progress and manage records.
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Enhanced Stats Cards */}
                                <div className="flex flex-wrap gap-4 mt-4">
                                    <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Users className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                                                <p className="text-sm text-slate-500 font-medium">Total Students</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <UserCheck className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-slate-900">{stats.enrolled}</p>
                                                <p className="text-sm text-slate-500 font-medium">Currently Enrolled</p>
                                            </div>
                                        </div>
                                    </div>
                                    {stats.dropped > 0 && (
                                        <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-100 rounded-lg">
                                                    <UserX className="w-5 h-5 text-red-600" />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold text-slate-900">{stats.dropped}</p>
                                                    <p className="text-sm text-slate-500 font-medium">Dropped Out</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    variant="outline"
                                    className="shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* --- ENHANCED MAIN CONTENT CARD --- */}
                    <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                        <CardHeader className="pb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Filter className="w-5 h-5 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl font-semibold text-slate-800">
                                    Search & Filter Students
                                </CardTitle>
                            </div>
                            
                            {/* Enhanced Filter Bar */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                                <div className="lg:col-span-5">
                                    <Label htmlFor="search" className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                                        <Search className="w-4 h-4" />
                                        Search Students
                                    </Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <Input
                                            id="search"
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search by name or email..."
                                            className="pl-10 h-11 shadow-sm border-slate-300 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                
                                <div className="lg:col-span-4">
                                    <Label htmlFor="program" className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                                        <GraduationCap className="w-4 h-4" />
                                        TESDA Program
                                    </Label>
                                    <Select onValueChange={setProgramFilter} value={programFilter}>
                                        <SelectTrigger id="program" className="h-11 shadow-sm border-slate-300 focus:border-blue-500">
                                            <SelectValue placeholder="Filter by program..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {programs.map(p => (
                                                <SelectItem key={p} value={p}>{p}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="lg:col-span-3">
                                    <Button 
                                        type="button"
                                        onClick={handleClearFilters} 
                                        variant="outline"
                                        className="w-full h-11 shadow-sm hover:shadow-md transition-all duration-200"
                                    >
                                        <Filter className="w-4 h-4 mr-2" />
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="px-0">
                            {/* Loading Overlay */}
                            {(loadingStates.isFiltering || isRefreshing) && (
                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex items-center justify-center rounded-lg">
                                    <div className="flex items-center gap-3 bg-white rounded-xl shadow-lg px-8 py-6 border">
                                        <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
                                        <div className="text-slate-700">
                                            <div className="font-semibold">Loading students...</div>
                                            <div className="text-sm text-slate-500">Please wait a moment</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content Area */}
                            <div className="relative">
                                {students.data.length > 0 ? (
                                    <>
                                        {/* Desktop Table View */}
                                        <div className="overflow-hidden border border-slate-200 rounded-lg hidden lg:block">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
                                                            <TableHead className="px-6 py-4 text-left font-semibold text-slate-800">
                                                                <div className="flex items-center gap-2">
                                                                    <Users className="w-4 h-4" />
                                                                    Student Information
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="px-6 py-4 text-left font-semibold text-slate-800">
                                                                <div className="flex items-center gap-2">
                                                                    <Phone className="w-4 h-4" />
                                                                    Contact Details
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="px-6 py-4 text-left font-semibold text-slate-800">
                                                                <div className="flex items-center gap-2">
                                                                    <GraduationCap className="w-4 h-4" />
                                                                    Program & Status
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="px-6 py-4 text-center font-semibold text-slate-800">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <Calendar className="w-4 h-4" />
                                                                    Attendance Record
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="px-6 py-4 text-right font-semibold text-slate-800">
                                                                Actions
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {students.data.map((student, index) => (
                                                            <TableRow 
                                                                key={student.learner_id}
                                                                className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors ${
                                                                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                                                                }`}
                                                            >
                                                                <TableCell className="px-6 py-5">
                                                                    <LearnerInfo learner={student as any} />
                                                                </TableCell>
                                                                <TableCell className="px-6 py-5">
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                                            <Phone className="w-3 h-3" />
                                                                            {student.contact_no || 'N/A'}
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                                            <Mail className="w-3 h-3" />
                                                                            {student.email}
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-6 py-5">
                                                                    <div className="space-y-2">
                                                                        <div className="text-sm font-medium text-slate-900">
                                                                            {student.program_name}
                                                                        </div>
                                                                        <StatusBadge status={student.enrollment_status as any} />
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="px-6 py-5 text-center">
                                                                    <AttendanceCell summary={student.attendance_summary} />
                                                                </TableCell>
                                                                <TableCell className="px-6 py-5 text-right">
                                                                    <DropdownMenu.Root>
                                                                        <DropdownMenu.Trigger asChild>
                                                                            <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all">
                                                                                <MoreHorizontal className="w-4 h-4" />
                                                                            </Button>
                                                                        </DropdownMenu.Trigger>
                                                                        <DropdownMenu.Portal>
                                                                            <DropdownMenu.Content className="bg-white rounded-lg shadow-xl border border-slate-200 p-2 w-52 z-50">
                                                                                <DropdownMenu.Item asChild>
                                                                                    <Link 
                                                                                        href={route('staff.enrollment.show', { learner: student.learner_id, from: 'students' })} 
                                                                                        className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer transition-colors"
                                                                                    >
                                                                                        <Eye className="w-4 h-4" />
                                                                                        View Profile
                                                                                    </Link>
                                                                                </DropdownMenu.Item>
                                                                                <DropdownMenu.Item asChild>
                                                                                    <Link 
                                                                                        href={'#'} 
                                                                                        className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer transition-colors"
                                                                                    >
                                                                                        <BarChart2 className="w-4 h-4" />
                                                                                        View Attendance
                                                                                    </Link>
                                                                                </DropdownMenu.Item>
                                                                            </DropdownMenu.Content>
                                                                        </DropdownMenu.Portal>
                                                                    </DropdownMenu.Root>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>

                                        {/* Enhanced Mobile Card View */}
                                        <div className="lg:hidden space-y-4 px-4">
                                            {students.data.map((student) => (
                                                <Card key={student.learner_id} className="shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <LearnerInfo learner={student as any} />
                                                            <DropdownMenu.Root>
                                                                <DropdownMenu.Trigger asChild>
                                                                    <Button variant="outline" size="sm" className="shadow-sm">
                                                                        <MoreHorizontal className="w-4 h-4" />
                                                                    </Button>
                                                                </DropdownMenu.Trigger>
                                                                <DropdownMenu.Portal>
                                                                    <DropdownMenu.Content className="bg-white rounded-lg shadow-xl border p-2 w-52 z-50">
                                                                        <DropdownMenu.Item asChild>
                                                                            <Link 
                                                                                href={route('staff.enrollment.show', { learner: student.learner_id, from: 'students' })} 
                                                                                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer"
                                                                            >
                                                                                <Eye className="w-4 h-4" /> View Profile
                                                                            </Link>
                                                                        </DropdownMenu.Item>
                                                                        <DropdownMenu.Item asChild>
                                                                            <Link 
                                                                                href={'#'} 
                                                                                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer"
                                                                            >
                                                                                <BarChart2 className="w-4 h-4" /> View Attendance
                                                                            </Link>
                                                                        </DropdownMenu.Item>
                                                                    </DropdownMenu.Content>
                                                                </DropdownMenu.Portal>
                                                            </DropdownMenu.Root>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</Label>
                                                                <div className="mt-1 space-y-1">
                                                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                                                        <Phone className="w-3 h-3" />
                                                                        {student.contact_no || 'N/A'}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                                                        <Mail className="w-3 h-3" />
                                                                        {student.email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div>
                                                                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Program</Label>
                                                                <div className="mt-1">
                                                                    <p className="text-sm font-medium text-slate-900 mb-1">{student.program_name}</p>
                                                                    <StatusBadge status={student.enrollment_status as any} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="mt-4 pt-4 border-t border-slate-100">
                                                            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Attendance Record</Label>
                                                            <div className="mt-1">
                                                                <AttendanceCell summary={student.attendance_summary} />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-20 px-6">
                                        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                            <Inbox size={48} className="text-slate-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-3">No Students Found</h3>
                                        <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                                            {searchTerm || programFilter 
                                                ? "No students match your current search criteria. Try adjusting your filters or search terms."
                                                : "No enrolled students found in the system. Students will appear here once they are accepted and enrolled."
                                            }
                                        </p>
                                        {(searchTerm || programFilter) && (
                                            <Button 
                                                type="button"
                                                onClick={handleClearFilters}
                                                variant="outline"
                                                size="lg"
                                                className="shadow-md hover:shadow-lg transition-all duration-200"
                                            >
                                                <Filter className="w-5 h-5 mr-2" />
                                                Clear All Filters
                                            </Button>
                                        )}
                                    </div>
                                )}
                                
                                {/* Enhanced Pagination */}
                                {students.data.length > 0 && (
                                    <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-6 rounded-b-lg">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="text-sm text-slate-700">
                                                <span className="font-medium">Showing {students.from} to {students.to}</span>
                                                <span className="text-slate-500"> of </span>
                                                <span className="font-medium">{students.total} students</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {students.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || ''}
                                                        preserveScroll
                                                        className={`inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                            link.active 
                                                                ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                                                                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:shadow-sm'
                                                        } ${
                                                            !link.url ? 'opacity-50 cursor-not-allowed' : ''
                                                        } ${
                                                            link.label.includes('Previous') || link.label.includes('Next') ? 'px-4' : 'min-w-[40px] h-10'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
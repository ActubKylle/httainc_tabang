import React, { useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';

// Layout and component imports
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { PageLoadingSkeleton } from '@/components/Loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    CalendarCheck,
    Filter,
    Users,
    RefreshCw,
    Clock,
    UserCheck,
    UserX,
    AlertCircle,
    Save,
    Calendar,
    GraduationCap
} from 'lucide-react';
import axios from 'axios';
// --- STRICT TYPE DEFINITIONS ---
interface Program {
    id: number;
    course_name: string;
}
interface Batch {
    id: number;
    name: string;
}

interface StudentAttendance {
    learner_id: number;
    name: string;
    email: string;
    status: 'present' | 'absent' | 'excused' | 'left_early' | null;
    time_in: string | null;
    time_out: string | null;
    remarks: string;
}

// Form data structure that matches Inertia's expectations
interface AttendanceFormData {
    program_id: string | null;
    batch_id: string | null;
    attendance_date: string;
    attendances: StudentAttendance[];
}

// Fixed interface compatibility issue
interface AttendancePageProps extends PageProps {
    programs: Program[];
    students: StudentAttendance[];
    filters: {
        program_id: string | null;
        batch_id: string | null;
        date: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attendance',
        href: route('staff.attendance.index'),
    },
];
// --- ENHANCED MAIN COMPONENT ---
export default function AttendanceIndex(): JSX.Element {
    const { programs, students, filters, flash } = usePage<AttendancePageProps>().props;

    console.log("COMPONENT RENDERED - Props from server:", { students, filters });

    // State management
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [selectedProgram, setSelectedProgram] = useState<string>(filters.program_id ?? '');
    const [selectedDate, setSelectedDate] = useState<string>(filters.date);
    const [selectedBatch, setSelectedBatch] = useState<string>(filters.batch_id ?? '');

    const [batches, setBatches] = useState<Batch[]>([]);
        const [isBatchLoading, setIsBatchLoading] = useState<boolean>(false);

    // Form with proper typing
    const { data, setData, post, processing, errors } = useForm<AttendanceFormData>({
        program_id: filters.program_id,
        batch_id: filters.batch_id,
        attendance_date: filters.date,
        attendances: [],
    });



    // --- EFFECTS WITH PROPER TYPING ---
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

     useEffect(() => {
        // This single effect now syncs the entire form state whenever props change.
        setData({
            program_id: filters.program_id,
            batch_id: filters.batch_id,
            attendance_date: filters.date,
            attendances: students || [],
        });
    }, [students, filters]);

    useEffect(() => {
        // This effect runs when the page reloads with new data
        // after fetching students. It syncs the entire form state.
        setData({
            program_id: filters.program_id,
            batch_id: filters.batch_id,
            attendance_date: filters.date,
            attendances: students || [],
        });
    }, [students, filters]);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                duration: 4000,
                style: {
                    background: '#10b981',
                    color: 'white',
                },
            });
        }
        if (flash?.error) {
            toast.error(flash.error, {
                duration: 4000,
                style: {
                    background: '#ef4444',
                    color: 'white',
                },
            });
        }
    }, [flash]);

  useEffect(() => {
        if (selectedProgram) {
                        console.log(`EFFECT: Program selected. Fetching batches for program ID: ${selectedProgram}`);

            setIsBatchLoading(true);
            axios.get(route('staff.programs.batches.index', { program: selectedProgram }))
                // .then(response => setBatches(response.data))
                 .then(response => {
                    // --- DEBUG LOG 3: Check the API response for batches ---
                    console.log("API SUCCESS: Received batches:", response.data);
                    setBatches(response.data);
                })
                .catch(error => console.error('Failed to fetch batches:', error))
                .finally(() => setIsBatchLoading(false));
        } else {
            setBatches([]);
        }
        setSelectedBatch('');
    }, [selectedProgram]);


    // --- ENHANCED HANDLERS ---
    const handleFetchStudents = (): void => {
        if (!selectedProgram || !selectedBatch) {
            toast.error('Please select a program and a batch first');
            return;
        }

        setIsRefreshing(true);
        router.get(
            route('staff.attendance.index'),
            { program_id: selectedProgram, batch_id: selectedBatch, date: selectedDate },
            {
                preserveState: true,
                replace: true,
                onFinish: () => setIsRefreshing(false)
            }
        );
    };

    const handleUpdateStudent = (
        learner_id: number,
        field: keyof StudentAttendance,
        value: string | null
    ): void => {
        const updatedAttendances = data.attendances?.map((student: StudentAttendance) =>
            student.learner_id === learner_id
                ? { ...student, [field]: value }
                : student
        ) ?? [];

        setData('attendances', updatedAttendances);
    };

    const submitAttendance = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        // The useForm hook's 'data' object is already up-to-date with the
        // latest program_id, attendance_date, and attendances array.
        // We can call post() directly.

        if (!data.program_id) {
            toast.error('Please select a program');
            return;
        }

        if (!data.attendances || data.attendances.length === 0) {
            toast.error('No attendance data to submit');
            return;
        }

        // The 'post' method will automatically send the 'data' object
        // managed by the useForm hook.
        post(route('staff.attendance.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Attendance submitted successfully!', {
                    icon: '✅',
                    duration: 4000,
                });
            },
            onError: (errors) => {
                toast.error('Submission failed. Please check the form.');
                console.error('Submission errors:', errors);
            },
        });
    };

    const handleRefresh = (): void => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => setIsRefreshing(false)
        });
    };

    // Enhanced status helpers
    const getStatusBadgeVariant = (status: StudentAttended['status']) => {
        switch (status) {
            case 'present': return 'default';
            case 'absent': return 'destructive';
            case 'left_early': return 'secondary';
            case 'excused': return 'outline';
            default: return 'outline';
        }
    };

    const getAttendanceStats = () => {
        if (!data.attendances) return { present: 0, absent: 0, total: 0 };

        const present = data.attendances.filter(s => s.status === 'present').length;
        const absent = data.attendances.filter(s => s.status === 'absent').length;
        const total = data.attendances.length;

        return { present, absent, total };
    };

    const stats = getAttendanceStats();

    // --- ENHANCED RENDER LOGIC ---
    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Attendance Management" />
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
            <Head title="Attendance Management" />
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
                                    <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl shadow-sm">
                                        <CalendarCheck className="w-8 h-8 text-green-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                            Attendance Management
                                        </h1>
                                        <p className="text-lg text-slate-600 mt-1">
                                            Track and manage student attendance efficiently
                                        </p>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                {data.attendances && data.attendances.length > 0 && (
                                    <div className="flex gap-4 mt-4">
                                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                                            <div className="flex items-center gap-2">
                                                <UserCheck className="w-4 h-4 text-green-600" />
                                                <span className="text-sm font-medium text-slate-700">Present: {stats.present}</span>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                                            <div className="flex items-center gap-2">
                                                <UserX className="w-4 h-4 text-red-600" />
                                                <span className="text-sm font-medium text-slate-700">Absent: {stats.absent}</span>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-medium text-slate-700">Total: {stats.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                                    Filter & Select Students
                                </CardTitle>
                            </div>

                            {/* Enhanced Filter Bar */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                                <div className="lg:col-span-5">
                                    <Label htmlFor="program" className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                                        <GraduationCap className="w-4 h-4" />
                                        TESDA Program
                                    </Label>
                                    <Select onValueChange={setSelectedProgram} value={selectedProgram}>
                                        <SelectTrigger id="program" className="h-11 shadow-sm border-slate-300 focus:border-blue-500">
                                            <SelectValue placeholder="Choose a program..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {programs.map((program: Program) => (
                                                <SelectItem key={program.id} value={program.id.toString()}>
                                                    {program.course_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="lg:col-span-3"> {/* BATCH DROPDOWN */}
                                    <Label htmlFor="batch" className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                                        Batch / Schedule
                                    </Label>
                                    <Select
                                        onValueChange={setSelectedBatch}
                                        value={selectedBatch}
                                        disabled={!selectedProgram || isBatchLoading}
                                    >
                                        <SelectTrigger id="batch" className="h-11 shadow-sm">
                                            <SelectValue placeholder={isBatchLoading ? "Loading..." : "Choose a batch..."} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {batches.map((batch) => (
                                                <SelectItem key={batch.id} value={batch.id.toString()}>
                                                    {batch.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="lg:col-span-3">
                                    <Label htmlFor="date" className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        Date
                                    </Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="h-11 shadow-sm border-slate-300 focus:border-blue-500"
                                    />
                                </div>

                                <div className="lg:col-span-4 flex gap-2">
                                    <Button
                                        type="button"
                                        onClick={handleFetchStudents}
                                        disabled={!selectedProgram || processing || isRefreshing}
                                        className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        <Filter className="w-4 h-4 mr-2" />
                                        {isRefreshing ? 'Loading...' : 'Fetch Students'}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="px-0">
                            {/* Loading Overlay */}
                            {(processing || isRefreshing) && (
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
                                {data.attendances && data.attendances.length > 0 ? (
                                    <form onSubmit={submitAttendance} className="space-y-6">
                                        <div className="overflow-hidden border border-slate-200 rounded-lg">
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
                                                            <TableHead className="px-6 py-4 text-center font-semibold text-slate-800">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <Clock className="w-4 h-4" />
                                                                    Time Logs
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="px-6 py-4 text-center font-semibold text-slate-800">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <AlertCircle className="w-4 h-4" />
                                                                    Attendance Status
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="px-6 py-4 text-left font-semibold text-slate-800">
                                                                Remarks & Notes
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {data.attendances.map((student: StudentAttendance, index: number) => (
                                                            <TableRow
                                                                key={student.learner_id}
                                                                className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                                                                    }`}
                                                            >
                                                                <TableCell className="px-6 py-5">
                                                                    <div className="space-y-1">
                                                                        <div className="font-semibold text-slate-900">{student.name}</div>
                                                                        <div className="text-sm text-slate-500">{student.email}</div>
                                                                        <Badge variant="outline" className="text-xs">
                                                                            ID: {student.learner_id}
                                                                        </Badge>
                                                                    </div>
                                                                </TableCell>

                                                                <TableCell className="px-6 py-5 text-center">
                                                                    <div className="space-y-1">
                                                                        {student.time_in ? (
                                                                            <Badge variant="outline" className="block text-xs">
                                                                                In: {student.time_in}
                                                                            </Badge>
                                                                        ) : (
                                                                            <span className="text-xs text-slate-400">No time in</span>
                                                                        )}
                                                                        {student.time_out && (
                                                                            <Badge variant="outline" className="block text-xs mt-1">
                                                                                Out: {student.time_out}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </TableCell>

                                                                <TableCell className="px-6 py-5">
                                                                    <div className="flex justify-center flex-wrap gap-2">
                                                                        <Button
                                                                            type="button"
                                                                            size="sm"
                                                                            variant={student.status === 'present' ? 'default' : 'outline'}
                                                                            onClick={() => handleUpdateStudent(student.learner_id, 'status', 'present')}
                                                                            className={student.status === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                                                                        >
                                                                            <UserCheck className="w-3 h-3 mr-1" />
                                                                            Present
                                                                        </Button>
                                                                        <Button
                                                                            type="button"
                                                                            size="sm"
                                                                            variant={student.status === 'absent' ? 'destructive' : 'outline'}
                                                                            onClick={() => handleUpdateStudent(student.learner_id, 'status', 'absent')}
                                                                        >
                                                                            <UserX className="w-3 h-3 mr-1" />
                                                                            Absent
                                                                        </Button>
                                                                        <Button
                                                                            type="button"
                                                                            size="sm"
                                                                            variant={student.status === 'left_early' ? 'secondary' : 'outline'}
                                                                            onClick={() => handleUpdateStudent(student.learner_id, 'status', 'left_early')}
                                                                        >
                                                                            Left Early
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>

                                                                <TableCell className="px-6 py-5">
                                                                    <Input
                                                                        type="text"
                                                                        placeholder="Add notes or remarks..."
                                                                        value={student.remarks || ''}
                                                                        onChange={(e) => handleUpdateStudent(student.learner_id, 'remarks', e.target.value)}
                                                                        className="w-full text-sm border-slate-300 focus:border-blue-500"
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>

                                        {/* Enhanced Submit Section */}
                                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-6 border border-slate-200">
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div className="text-sm text-slate-600">
                                                    <div className="font-medium">Ready to submit attendance for {stats.total} students</div>
                                                    <div>Present: {stats.present} • Absent: {stats.absent}</div>
                                                </div>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    size="lg"
                                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                                >
                                                    <Save className="w-5 h-5 mr-2" />
                                                    {processing ? 'Submitting...' : 'Submit Attendance'}
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="text-center py-20 px-6">
                                        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                            <Users size={48} className="text-slate-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-3">No Students Found</h3>
                                        <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                                            Select a TESDA program and date above, then click "Fetch Students" to load the attendance sheet for your selected session.
                                        </p>
                                        <div className="flex justify-center">
                                            <Button
                                                type="button"
                                                onClick={handleFetchStudents}
                                                disabled={!selectedProgram}
                                                variant="outline"
                                                size="lg"
                                                className="shadow-md hover:shadow-lg transition-all duration-200"
                                            >
                                                <Filter className="w-5 h-5 mr-2" />
                                                Fetch Students
                                            </Button>
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
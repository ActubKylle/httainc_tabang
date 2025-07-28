import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Edit, Save, XCircle, AlertCircle, CheckCircle, Clock, BookOpen, Award, FileText, Activity } from 'lucide-react';

// Define the program data structure (matches ProgramData from Index.tsx)
interface ProgramData {
    id: number;
    course_name: string;
    qualification_level: string;
    duration_hours: number;
    duration_days: number;
    description: string;
    status: 'active' | 'inactive';
}

// Props for the Edit component will include the program to edit
interface EditProgramProps {
    program: ProgramData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Programs',
        href: '/admin/programs',
    },
    {
        title: 'Edit Program',
        href: '#',
    },
];

export default function ProgramEdit({ program }: EditProgramProps) {
    const [hasChanges, setHasChanges] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const { data, setData, put, processing, errors, isDirty } = useForm<ProgramData>({
        id: program.id,
        course_name: program.course_name,
        qualification_level: program.qualification_level,
        duration_hours: program.duration_hours,
        duration_days: program.duration_days,
        description: program.description,
        status: program.status,
    });

    // Track changes for unsaved changes warning
    useEffect(() => {
        setHasChanges(isDirty);
    }, [isDirty]);

    // Auto-calculate days from hours (assuming 8 hours per day)
    const handleHoursChange = (hours: number) => {
        setData('duration_hours', hours);
        if (hours > 0) {
            const calculatedDays = Math.ceil(hours / 8);
            setData('duration_days', calculatedDays);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.programs.update', program.id), {
            onSuccess: () => {
                setShowSuccessMessage(true);
                setHasChanges(false);
                setTimeout(() => setShowSuccessMessage(false), 5000);
            },
            onError: (validationErrors) => {
                console.error('Validation errors:', validationErrors);
            },
        });
    };

    // Warn user about unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasChanges]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${program.course_name}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Success Message */}
                    {showSuccessMessage && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-in slide-in-from-top duration-300">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <p className="text-green-800 font-medium">Program updated successfully!</p>
                        </div>
                    )}

                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Edit className="w-6 h-6 text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Program</h1>
                            {hasChanges && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                    <AlertCircle className="w-3 h-3" />
                                    Unsaved changes
                                </span>
                            )}
                        </div>
                        <p className="text-gray-600 text-lg">{program.course_name}</p>
                        <p className="text-gray-500 mt-1">Update the details for this TESDA program offering.</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                Program Details
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Program Name */}
                                    <div className="group">
                                        <label htmlFor="course_name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <BookOpen className="w-4 h-4 text-gray-500" />
                                            Program Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="course_name"
                                            type="text"
                                            value={data.course_name}
                                            onChange={(e) => setData('course_name', e.target.value)}
                                            className={`block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                                errors.course_name 
                                                    ? 'border-red-300 bg-red-50' 
                                                    : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                            }`}
                                            placeholder="Enter program name"
                                        />
                                        {errors.course_name && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.course_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Qualification Level */}
                                    <div className="group">
                                        <label htmlFor="qualification_level" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Award className="w-4 h-4 text-gray-500" />
                                            Qualification Level <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="qualification_level"
                                            value={data.qualification_level}
                                            onChange={(e) => setData('qualification_level', e.target.value)}
                                            className={`block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                                errors.qualification_level 
                                                    ? 'border-red-300 bg-red-50' 
                                                    : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                            }`}
                                        >
                                            <option value="">Select qualification level</option>
                                            <option value="NC I">NC I (National Certificate I)</option>
                                            <option value="NC II">NC II (National Certificate II)</option>
                                            <option value="NC III">NC III (National Certificate III)</option>
                                            <option value="NC IV">NC IV (National Certificate IV)</option>
                                            <option value="Certificate">Certificate</option>
                                            <option value="Diploma">Diploma</option>
                                        </select>
                                        {errors.qualification_level && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.qualification_level}
                                            </p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="group">
                                        <label htmlFor="status" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Activity className="w-4 h-4 text-gray-500" />
                                            Status <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="active"
                                                    checked={data.status === 'active'}
                                                    onChange={(e) => setData('status', e.target.value as 'active' | 'inactive')}
                                                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                                />
                                                <span className="ml-2 flex items-center gap-2 text-sm text-gray-700">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                    Active
                                                </span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="inactive"
                                                    checked={data.status === 'inactive'}
                                                    onChange={(e) => setData('status', e.target.value as 'active' | 'inactive')}
                                                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                                />
                                                <span className="ml-2 flex items-center gap-2 text-sm text-gray-700">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                    Inactive
                                                </span>
                                            </label>
                                        </div>
                                        {errors.status && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.status}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Duration Hours */}
                                    <div className="group">
                                        <label htmlFor="duration_hours" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            Duration (Hours) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="duration_hours"
                                                type="number"
                                                min="1"
                                                value={data.duration_hours}
                                                onChange={(e) => handleHoursChange(parseInt(e.target.value) || 0)}
                                                className={`block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                                    errors.duration_hours 
                                                        ? 'border-red-300 bg-red-50' 
                                                        : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                                }`}
                                                placeholder="Enter total hours"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 text-sm">hrs</span>
                                            </div>
                                        </div>
                                        {errors.duration_hours && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.duration_hours}
                                            </p>
                                        )}
                                    </div>

                                    {/* Duration Days */}
                                    <div className="group">
                                        <label htmlFor="duration_days" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            Duration (Days) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="duration_days"
                                                type="number"
                                                min="1"
                                                value={data.duration_days}
                                                onChange={(e) => setData('duration_days', parseInt(e.target.value) || 0)}
                                                className={`block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                                    errors.duration_days 
                                                        ? 'border-red-300 bg-red-50' 
                                                        : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                                }`}
                                                placeholder="Enter total days"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 text-sm">days</span>
                                            </div>
                                        </div>
                                        {data.duration_hours > 0 && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                Auto-calculated: {Math.ceil(data.duration_hours / 8)} days (8 hrs/day)
                                            </p>
                                        )}
                                        {errors.duration_days && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.duration_days}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-6">
                                <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <FileText className="w-4 h-4 text-gray-500" />
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className={`block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none ${
                                        errors.description 
                                            ? 'border-red-300 bg-red-50' 
                                            : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                    }`}
                                    placeholder="Enter program description, objectives, and key learning outcomes..."
                                />
                                <div className="mt-1 flex justify-between items-center">
                                    <span className="text-xs text-gray-500">
                                        {data.description.length}/500 characters
                                    </span>
                                    {errors.description && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                                <Link
                                    href={route('admin.programs.manage_index')}
                                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                                    onClick={(e) => {
                                        if (hasChanges && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || !hasChanges}
                                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Update Program
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
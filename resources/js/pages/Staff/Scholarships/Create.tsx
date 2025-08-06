import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Award, 
    Save, 
    XCircle, 
    AlertCircle, 
    CheckCircle, 
    Users, 
    Building, 
    FileText, 
    Calendar, 
    Sparkles,
    CalendarDays,
    Clock,
    Activity
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface ScholarshipFormData {
    scholarship_name: string;
    provider: string;
    description: string;
    eligibility_criteria: string;
    available_slots: number;
    application_deadline: string;
    status: 'Open' | 'Closed' | 'Ongoing';
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('staff.dashboard') },
    { title: 'Scholarships', href: route('staff.scholarships.index') },
    { title: 'Create', href: route('staff.scholarships.create') }
];

export default function ScholarshipCreate() {
    const [hasData, setHasData] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const { data, setData, post, processing, errors, isDirty, reset } = useForm<ScholarshipFormData>({
        scholarship_name: '',
        provider: '',
        description: '',
        eligibility_criteria: '',
        available_slots: 1,
        application_deadline: '',
        status: 'Open',
    });

    // Track if user has entered any data
    useEffect(() => {
        setHasData(isDirty && (
            data.scholarship_name.trim() !== '' ||
            data.provider.trim() !== '' ||
            data.description.trim() !== '' ||
            data.eligibility_criteria.trim() !== '' ||
            data.available_slots > 1 ||
            data.application_deadline !== ''
        ));
    }, [data, isDirty]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('staff.scholarships.store'), {
            onSuccess: () => {
                setShowSuccessMessage(true);
                reset();
                setHasData(false);
                toast.success('Scholarship created successfully!');
                setTimeout(() => setShowSuccessMessage(false), 5000);
            },
            onError: (validationErrors) => {
                console.error('Validation errors:', validationErrors);
                toast.error('Please check the form for errors.');
            },
        });
    };

    // Warn user about unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasData) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasData]);

    const isFormValid = data.scholarship_name.trim() !== '' && 
                       data.provider.trim() !== '' && 
                       data.eligibility_criteria.trim() !== '' && 
                       data.available_slots > 0 && 
                       data.application_deadline !== '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Scholarship" />
            <Toaster position="top-right" reverseOrder={false} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Success Message */}
                    {showSuccessMessage && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3 animate-in slide-in-from-top duration-300">
                            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <p className="text-blue-800 font-medium">Scholarship created successfully!</p>
                        </div>
                    )}

                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Award className="w-6 h-6 text-blue-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Create New Scholarship</h1>
                            {hasData && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                    <AlertCircle className="w-3 h-3" />
                                    Unsaved data
                                </span>
                            )}
                        </div>
                        <p className="text-gray-600 text-lg">Create a new scholarship program offering</p>
                        <p className="text-gray-500 mt-1">Fill in the details below to add a new scholarship to your offerings.</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                New Scholarship Details
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Scholarship Name */}
                                    <div className="group">
                                        <label htmlFor="scholarship_name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Award className="w-4 h-4 text-gray-500" />
                                            Scholarship Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="scholarship_name"
                                            type="text"
                                            value={data.scholarship_name}
                                            onChange={(e) => setData('scholarship_name', e.target.value)}
                                            className={`block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.scholarship_name 
                                                    ? 'border-red-300 bg-red-50' 
                                                    : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                            }`}
                                            placeholder="Enter scholarship name (e.g., Academic Excellence Scholarship)"
                                        />
                                        {errors.scholarship_name && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.scholarship_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Provider */}
                                    <div className="group">
                                        <label htmlFor="provider" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Building className="w-4 h-4 text-gray-500" />
                                            Provider / Sponsor <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="provider"
                                            type="text"
                                            value={data.provider}
                                            onChange={(e) => setData('provider', e.target.value)}
                                            className={`block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.provider 
                                                    ? 'border-red-300 bg-red-50' 
                                                    : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                            }`}
                                            placeholder="Enter provider/sponsor name"
                                        />
                                        {errors.provider && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.provider}
                                            </p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="group">
                                        <label htmlFor="status" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Activity className="w-4 h-4 text-gray-500" />
                                            Status <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="Open"
                                                    checked={data.status === 'Open'}
                                                    onChange={(e) => setData('status', e.target.value as 'Open' | 'Closed' | 'Ongoing')}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 flex items-center gap-2 text-sm text-gray-700">
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                    Open
                                                </span>
                                            </label>
                                            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="Ongoing"
                                                    checked={data.status === 'Ongoing'}
                                                    onChange={(e) => setData('status', e.target.value as 'Open' | 'Closed' | 'Ongoing')}
                                                    className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                                                />
                                                <span className="ml-2 flex items-center gap-2 text-sm text-gray-700">
                                                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                                    Ongoing
                                                </span>
                                            </label>
                                            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="Closed"
                                                    checked={data.status === 'Closed'}
                                                    onChange={(e) => setData('status', e.target.value as 'Open' | 'Closed' | 'Ongoing')}
                                                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                                />
                                                <span className="ml-2 flex items-center gap-2 text-sm text-gray-700">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                    Closed
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
                                    {/* Available Slots */}
                                    <div className="group">
                                        <label htmlFor="available_slots" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Users className="w-4 h-4 text-gray-500" />
                                            Available Slots <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="available_slots"
                                                type="number"
                                                min="1"
                                                value={data.available_slots || ''}
                                                onChange={(e) => setData('available_slots', parseInt(e.target.value) || 1)}
                                                className={`block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.available_slots 
                                                        ? 'border-red-300 bg-red-50' 
                                                        : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                                }`}
                                                placeholder="Enter number of available slots"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 text-sm">slots</span>
                                            </div>
                                        </div>
                                        {errors.available_slots && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.available_slots}
                                            </p>
                                        )}
                                    </div>

                                    {/* Application Deadline */}
                                    <div className="group">
                                        <label htmlFor="application_deadline" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <CalendarDays className="w-4 h-4 text-gray-500" />
                                            Application Deadline <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="application_deadline"
                                            type="date"
                                            value={data.application_deadline}
                                            onChange={(e) => setData('application_deadline', e.target.value)}
                                            className={`block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.application_deadline 
                                                    ? 'border-red-300 bg-red-50' 
                                                    : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                            }`}
                                        />
                                        {errors.application_deadline && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.application_deadline}
                                            </p>
                                        )}
                                    </div>

                                    {/* Quick Date Presets */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-xs font-medium text-gray-700 mb-2">Quick Presets:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const date = new Date();
                                                    date.setMonth(date.getMonth() + 1);
                                                    setData('application_deadline', date.toISOString().split('T')[0]);
                                                }}
                                                className="text-xs px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                                            >
                                                1 Month
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const date = new Date();
                                                    date.setMonth(date.getMonth() + 2);
                                                    setData('application_deadline', date.toISOString().split('T')[0]);
                                                }}
                                                className="text-xs px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                                            >
                                                2 Months
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const date = new Date();
                                                    date.setMonth(date.getMonth() + 3);
                                                    setData('application_deadline', date.toISOString().split('T')[0]);
                                                }}
                                                className="text-xs px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                                            >
                                                3 Months
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const date = new Date();
                                                    date.setMonth(date.getMonth() + 6);
                                                    setData('application_deadline', date.toISOString().split('T')[0]);
                                                }}
                                                className="text-xs px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                                            >
                                                6 Months
                                            </button>
                                        </div>
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
                                    rows={3}
                                    className={`block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                                        errors.description 
                                            ? 'border-red-300 bg-red-50' 
                                            : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                    }`}
                                    placeholder="Enter scholarship description, benefits, and overview..."
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
                            
                            {/* Eligibility Criteria */}
                            <div className="mt-6">
                                <label htmlFor="eligibility_criteria" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <CheckCircle className="w-4 h-4 text-gray-500" />
                                    Eligibility Criteria <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="eligibility_criteria"
                                    value={data.eligibility_criteria}
                                    onChange={(e) => setData('eligibility_criteria', e.target.value)}
                                    rows={4}
                                    className={`block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                                        errors.eligibility_criteria 
                                            ? 'border-red-300 bg-red-50' 
                                            : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                    }`}
                                    placeholder="Enter detailed eligibility criteria and requirements for applicants..."
                                />
                                <div className="mt-1 flex justify-between items-center">
                                    <span className="text-xs text-gray-500">
                                        {data.eligibility_criteria.length}/1000 characters
                                    </span>
                                    {errors.eligibility_criteria && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.eligibility_criteria}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                                <Link
                                    href={route('staff.scholarships.index')}
                                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                    onClick={(e) => {
                                        if (hasData && !confirm('You have unsaved data. Are you sure you want to leave?')) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || !isFormValid}
                                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Create Scholarship
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
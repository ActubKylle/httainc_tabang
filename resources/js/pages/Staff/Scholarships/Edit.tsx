import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Award, Save, XCircle, AlertCircle } from 'lucide-react';

// --- Interfaces ---
interface Scholarship {
    scholarship_id: number;
    scholarship_name: string;
    provider: string;
    description: string;
    eligibility_criteria: string;
    available_slots: number;
    application_deadline: string;
    status: 'Open' | 'Closed' | 'Ongoing';
}

interface ScholarshipEditProps extends PageProps {
    scholarship: Scholarship;
}

export default function ScholarshipEdit({ scholarship }: ScholarshipEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        scholarship_name: scholarship.scholarship_name || '',
        provider: scholarship.provider || '',
        description: scholarship.description || '',
        eligibility_criteria: scholarship.eligibility_criteria || '',
        available_slots: scholarship.available_slots || 1,
        application_deadline: scholarship.application_deadline || '',
        status: scholarship.status || 'Open',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('staff.dashboard') },
        { title: 'Scholarships', href: route('staff.scholarships.index') },
        { title: 'Edit', href: '#' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('staff.scholarships.update', scholarship.scholarship_id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit - ${scholarship.scholarship_name}`} />
            <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-htta-blue to-htta-dark-blue px-6 py-4">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                Edit Scholarship Program
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Scholarship Name */}
                            <div>
                                <label htmlFor="scholarship_name" className="block text-sm font-medium text-gray-700 mb-1">Scholarship Name</label>
                                <input
                                    id="scholarship_name"
                                    type="text"
                                    value={data.scholarship_name}
                                    onChange={(e) => setData('scholarship_name', e.target.value)}
                                    className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-htta-blue focus:border-htta-blue"
                                />
                                {errors.scholarship_name && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.scholarship_name}</p>}
                            </div>

                            {/* Provider */}
                            <div>
                                <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">Provider / Sponsor</label>
                                <input
                                    id="provider"
                                    type="text"
                                    value={data.provider}
                                    onChange={(e) => setData('provider', e.target.value)}
                                    className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-htta-blue focus:border-htta-blue"
                                />
                                {errors.provider && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.provider}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-htta-blue focus:border-htta-blue"
                                />
                                {errors.description && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.description}</p>}
                            </div>
                            
                            {/* Eligibility Criteria */}
                            <div>
                                <label htmlFor="eligibility_criteria" className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                                <textarea
                                    id="eligibility_criteria"
                                    value={data.eligibility_criteria}
                                    onChange={(e) => setData('eligibility_criteria', e.target.value)}
                                    rows={3}
                                    className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-htta-blue focus:border-htta-blue"
                                />
                                {errors.eligibility_criteria && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.eligibility_criteria}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Available Slots */}
                                <div>
                                    <label htmlFor="available_slots" className="block text-sm font-medium text-gray-700 mb-1">Available Slots</label>
                                    <input
                                        id="available_slots"
                                        type="number"
                                        min="1"
                                        value={data.available_slots}
                                        onChange={(e) => setData('available_slots', parseInt(e.target.value))}
                                        className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-htta-blue focus:border-htta-blue"
                                    />
                                    {errors.available_slots && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.available_slots}</p>}
                                </div>

                                {/* Application Deadline */}
                                <div>
                                    <label htmlFor="application_deadline" className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                                    <input
                                        id="application_deadline"
                                        type="date"
                                        value={data.application_deadline}
                                        onChange={(e) => setData('application_deadline', e.target.value)}
                                        className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-htta-blue focus:border-htta-blue"
                                    />
                                    {errors.application_deadline && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.application_deadline}</p>}
                                </div>
                            </div>

                            {/* Status */}
                             <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as any)}
                                    className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-htta-blue focus:border-htta-blue"
                                >
                                    <option value="Open">Open</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Closed">Closed</option>
                                </select>
                                {errors.status && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.status}</p>}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                                <Link href={route('staff.scholarships.index')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                    <XCircle className="w-4 h-4 inline-block mr-1" />
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-htta-blue text-white rounded-md hover:bg-htta-dark-blue disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4 inline-block mr-1" />
                                    {processing ? 'Updating...' : 'Update Scholarship'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// New File: resources/js/Pages/Staff/EnrollmentEdit.tsx

import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { DetailedLearnerData } from '@/Pages/Staff/EnrollmentDetails'; // Assuming you export this type
import { LoadingButton } from '@/components/Loading';

// Props for the Edit page will be the same as the Details page
interface EnrollmentEditProps extends PageProps {
    learner: DetailedLearnerData;
}

export default function EnrollmentEdit({ learner }: EnrollmentEditProps) {
    // Breadcrumbs for the edit page
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Enrollments', href: route('staff.enrollments') },
        { title: `${learner.first_name} ${learner.last_name}`, href: route('staff.enrollment.show', learner.learner_id) },
        { title: 'Edit', href: '#' },
    ];

    // Initialize the form with data from the learner prop
    const { data, setData, put, processing, errors } = useForm({
        first_name: learner.first_name || '',
        last_name: learner.last_name || '',
        middle_name: learner.middle_name || '',
        civil_status: learner.civil_status || '',
        contact_no: learner.address?.contact_no || '',
        email: learner.user?.email || '',
        // Add any other fields you want to edit here
    });

    // Handle form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Send a PUT request to the 'update' route
        put(route('staff.enrollment.update', learner.learner_id), {
            preserveScroll: true, // Keep scroll position on redirect
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${learner.first_name} ${learner.last_name}`} />
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Learner Information</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        id="first_name"
                                        type="text"
                                        value={data.first_name}
                                        onChange={e => setData('first_name', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    {errors.first_name && <p className="text-sm text-red-600 mt-1">{errors.first_name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        id="last_name"
                                        type="text"
                                        value={data.last_name}
                                        onChange={e => setData('last_name', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    {errors.last_name && <p className="text-sm text-red-600 mt-1">{errors.last_name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label htmlFor="civil_status" className="block text-sm font-medium text-gray-700">Civil Status</label>
                                    <select
                                        id="civil_status"
                                        value={data.civil_status}
                                        onChange={e => setData('civil_status', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                                    >
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Widowed">Widowed</option>
                                        <option value="Separated">Separated</option>
                                    </select>
                                    {errors.civil_status && <p className="text-sm text-red-600 mt-1">{errors.civil_status}</p>}
                                </div>
                            </div>
                            
                            {/* You can add more form fields here for address, etc. */}

                            <div className="flex items-center justify-end pt-6 border-t border-gray-200">
                                <LoadingButton type="submit" loading={processing}>
                                    Save Changes
                                </LoadingButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
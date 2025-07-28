import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head,router  } from '@inertiajs/react';

// Define types for Learner and its relationships for the details page
interface DetailedLearnerData {
    learner_id: number;
    entry_date: string;
    last_name: string;
    first_name: string;
    middle_name?: string;
    extension_name?: string;
    gender: string;
    civil_status: string;
    birth_date?: string;
    age?: number;
    birthplace_city_municipality?: string;
    birthplace_province?: string;
    birthplace_region?: string;
    nationality?: string;
    employment_status?: string;
    employment_type?: string;
    parent_guardian_name?: string;
    parent_guardian_mailing_address?: string;
    t2mis_auto_generated: boolean;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    address: {
        address_id: number;
        number_street?: string;
        city_municipality?: string;
        barangay?: string;
        district?: string;
        province?: string;
        region?: string;
        email_address?: string;
        facebook_account?: string;
        contact_no?: string;
    };
    educational_attainment: {
        education_id: number;
        no_grade_completed: boolean;
        elementary_undergraduate: boolean;
        elementary_graduate: boolean;
        junior_high_k12: boolean;
        senior_high_k12: boolean;
        high_school_undergraduate: boolean;
        high_school_graduate: boolean;
        post_secondary_non_tertiary_technical_vocational_undergraduate: boolean;
        post_secondary_non_tertiary_technical_vocational_course_graduate: boolean;
        college_undergraduate: boolean;
        college_graduate: boolean;
        masteral: boolean;
        doctorate: boolean;
    };
    classifications: Array<{
        id: number;
        type: string;
        pivot: {
            learner_id: number;
            classification_id: number;
            other_classification_details?: string;
        };
    }>;
    disabilities: Array<{
        disability_id: number;
        cause_of_disability?: string;
        disability_type: {
            id: number;
            name: string;
        };
    }>;
    course_enrollments: Array<{
        enrollment_id: number;
        course_qualification: string;
        scholarship_package?: string;
    }>;
    privacy_consent: {
        consent_id: number;
        consent_given: boolean;
        date_agreed: string;
    };
    registration_signature: {
        signature_id: number;
        applicant_signature_printed_name?: string;
        date_accomplished?: string;
        registrar_signature_printed_name?: string;
        date_received?: string;
        thumbmark_image_path?: string;
        picture_image_path?: string;
    };
}

interface EnrollmentDetailsProps extends PageProps {
    learner: DetailedLearnerData;
     from: 'enrollments' | 'students'; 
}

export default function EnrollmentDetails({ learner }: EnrollmentDetailsProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Enrollments',
            href: route('admin.enrollments'),
        },
        {
            title: `${learner.first_name} ${learner.last_name}`,
            href: route('admin.enrollment.show', learner.learner_id),
        },
    ];

    // Helper to render boolean educational attainments
    const renderEducationalAttainment = (edu: DetailedLearnerData['educational_attainment']) => {
        const attainmentLevels = [];
        for (const key in edu) {
            if (key !== 'education_id' && key !== 'learner_id' && typeof edu[key as keyof typeof edu] === 'boolean' && edu[key as keyof typeof edu]) {
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
                attainmentLevels.push(formattedKey);
            }
        }
        return attainmentLevels.length > 0 ? attainmentLevels.join(', ') : 'No educational attainment specified.';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Enrollment: ${learner.first_name} ${learner.last_name}`} />

            {/* Modern Hero Section with Mountain-inspired Design */}
            <div className="relative overflow-hidden">
                {/* Mountain Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-700 to-emerald-800">
                    <div className="absolute inset-0 opacity-10">
                        <svg viewBox="0 0 1000 300" className="w-full h-full">
                            <polygon points="0,300 300,100 500,200 700,50 1000,150 1000,300" fill="currentColor" />
                        </svg>
                    </div>
                </div>
                
                {/* Content */}
                <div className="relative bg-gradient-to-r from-emerald-900/90 to-green-800/90 backdrop-blur-sm">
                    <div className="px-8 py-12">
                        <div className="flex items-center space-x-6">
                            {/* Profile Picture Placeholder */}
                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                                    {learner.registration_signature?.picture_image_path ? (
                                       <img 
                                            src={`${learner.registration_signature.picture_image_path}`} 
                                            alt="Profile" 
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-white">
                                            {learner.first_name[0]}{learner.last_name[0]}
                                        </span>
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-4 h-4 text-emerald-800" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Header Info */}
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
                                    {learner.first_name} {learner.middle_name} {learner.last_name} {learner.extension_name}
                                </h1>
                                <div className="flex items-center space-x-4 text-emerald-100">
                                    <span className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                        </svg>
                                        <span>ID: {learner.learner_id}</span>
                                    </span>
                                    <span className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        <span>Enrolled: {new Date(learner.entry_date).toLocaleDateString()}</span>
                                    </span>
                                </div>
                            </div>
                            
                            {/* Course Badge */}
                            <div className="text-right">
                                <div className="inline-flex items-center px-4 py-2 bg-amber-400 text-emerald-900 rounded-full font-semibold shadow-lg">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                    </svg>
                                    {learner.course_enrollments?.[0]?.course_qualification || 'No Course'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-8 py-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Age</p>
                                    <p className="text-2xl font-bold text-emerald-700">{learner.age || 'N/A'}</p>
                                </div>
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Status</p>
                                    <p className="text-2xl font-bold text-amber-600">{learner.civil_status}</p>
                                </div>
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Employment</p>
                                    <p className="text-2xl font-bold text-blue-600">{learner.employment_status || 'N/A'}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm-1 9a1 1 0 102 0 1 1 0 00-2 0zm7-9a1 1 0 012 0 1 1 0 11-2 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Consent</p>
                                    <p className="text-2xl font-bold text-purple-600">{learner.privacy_consent?.consent_given ? 'Given' : 'Pending'}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Information Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Personal Information */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    Personal Information
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium">Full Name</span>
                                        <span className="text-gray-900 font-semibold">{learner.first_name} {learner.middle_name} {learner.last_name} {learner.extension_name}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium">Gender</span>
                                        <span className="text-gray-900">{learner.gender}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium">Birth Date</span>
                                        <span className="text-gray-900">{learner.birth_date ? new Date(learner.birth_date).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium">Birthplace</span>
                                        <span className="text-gray-900 text-right">{learner.birthplace_city_municipality}, {learner.birthplace_province}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium">Nationality</span>
                                        <span className="text-gray-900">{learner.nationality}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-gray-600 font-medium">Parent/Guardian</span>
                                        <span className="text-gray-900 text-right">{learner.parent_guardian_name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact & Address Information */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    Contact & Address
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium">Email</span>
                                        <span className="text-gray-900">{learner.user?.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium">Contact No.</span>
                                        <span className="text-gray-900">{learner.address?.contact_no}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium">Facebook</span>
                                        <span className="text-gray-900">{learner.address?.facebook_account}</span>
                                    </div>
                                    <div className="py-2">
                                        <span className="text-gray-600 font-medium block mb-2">Address</span>
                                        <span className="text-gray-900 text-sm leading-relaxed">
                                            {learner.address?.number_street}, {learner.address?.barangay}, {learner.address?.city_municipality}, {learner.address?.district}, {learner.address?.province}, {learner.address?.region}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Educational Attainment */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                    </svg>
                                    Educational Attainment
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
                                    <p className="text-gray-800 leading-relaxed">
                                        {learner.educational_attainment ? renderEducationalAttainment(learner.educational_attainment) : 'No educational attainment provided.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Course Enrollment */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm-1 9a1 1 0 102 0 1 1 0 00-2 0zm7-9a1 1 0 012 0 1 1 0 11-2 0z" clipRule="evenodd" />
                                    </svg>
                                    Course Enrollment
                                </h3>
                            </div>
                            <div className="p-6">
                                {learner.course_enrollments && learner.course_enrollments.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-gray-600 font-medium">Course</span>
                                                <span className="text-amber-600 font-bold">{learner.course_enrollments[0].course_qualification}</span>
                                            </div>
                                            {learner.course_enrollments[0].scholarship_package && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600 font-medium">Scholarship</span>
                                                    <span className="text-orange-600 font-semibold">{learner.course_enrollments[0].scholarship_package}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No course enrollment found.</p>
                                )}
                            </div>
                        </div>

                        {/* Classifications */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    Classifications
                                </h3>
                            </div>
                            <div className="p-6">
                                {learner.classifications && learner.classifications.length > 0 ? (
                                    <div className="space-y-3">
                                        {learner.classifications.map((cls, index) => (
                                            <div key={index} className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-3 border border-green-100">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-green-800 font-semibold">{cls.type}</span>
                                                    {cls.pivot?.other_classification_details && (
                                                        <span className="text-teal-600 text-sm">({cls.pivot.other_classification_details})</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No classifications specified.</p>
                                )}
                            </div>
                        </div>

                        {/* Disabilities */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Disabilities
                                </h3>
                            </div>
                            <div className="p-6">
                                {learner.disabilities && learner.disabilities.length > 0 ? (
                                    <div className="space-y-3">
                                        {learner.disabilities.map((dis, index) => (
                                            <div key={index} className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-3 border border-red-100">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-red-800 font-semibold">{dis.disability_type?.name}</span>
                                                    {dis.cause_of_disability && (
                                                        <span className="text-pink-600 text-sm">({dis.cause_of_disability})</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No disabilities reported.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Consent & Signatures Section */}
                    <div className="mt-8">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="bg-gradient-to-r from-slate-600 to-gray-600 px-6 py-4">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Consent & Signatures
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Consent Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Privacy Consent</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-gray-600 font-medium">Consent Given</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    learner.privacy_consent?.consent_given 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {learner.privacy_consent?.consent_given ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-gray-600 font-medium">Consent Date</span>
                                                <span className="text-gray-900">
                                                    {learner.privacy_consent?.date_agreed ? new Date(learner.privacy_consent.date_agreed).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Signature Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Signature Details</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-gray-600 font-medium">Applicant Name</span>
                                                <span className="text-gray-900 text-right">
                                                    {learner.registration_signature?.applicant_signature_printed_name || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-gray-600 font-medium">Date Accomplished</span>
                                                <span className="text-gray-900">
                                                    {learner.registration_signature?.date_accomplished 
                                                        ? new Date(learner.registration_signature.date_accomplished).toLocaleDateString() 
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Images Section */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Attached Documents</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Thumbmark */}
                                        <div className="text-center">
                                            <h5 className="text-sm font-medium text-gray-600 mb-3">Thumbmark</h5>
                                            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                                                {learner.registration_signature?.thumbmark_image_path ? (
                                                    
                                                    <img 
                                                    
                                                        src={`/${learner.registration_signature.thumbmark_image_path}`} 
                                                        alt="Thumbmark" 
                                                        className="w-24 h-24 mx-auto object-contain rounded-lg shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-24 h-24 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                                                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Picture */}
                                        <div className="text-center">
                                            <h5 className="text-sm font-medium text-gray-600 mb-3">Picture</h5>
                                            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                                                {learner.registration_signature?.picture_image_path ? (
                                                    <img 
                                                       src={learner.registration_signature.picture_image_path} // Use directly the full URL
                                                        alt="Picture" 
                                                        className="w-24 h-24 mx-auto object-cover rounded-lg shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-24 h-24 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                                                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-center space-x-4">
                        <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold">
                            <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Download PDF
                        </button>
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold">
                            <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit Details
                        </button>
                        <button 
                            onClick={() => router.visit(route('admin.enrollments'))}
                            className="px-6 py-3 bg-gradient-to-r from-gray-600 to-slate-600 text-white rounded-lg hover:from-gray-700 hover:to-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                        >
                            <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to List
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
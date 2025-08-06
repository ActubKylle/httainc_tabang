import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Award, Users, Calendar, Check, X, Eye, FileText, Inbox, User, 
    Clock, AlertCircle, Filter, Search, Download, Mail, Phone,
    ChevronDown, ExternalLink, Star, TrendingUp, CheckCircle2,
    XCircle, Clock3, MoreHorizontal
} from 'lucide-react';

// --- Interfaces ---
interface ApplicationDocument {
    birth_certificate_path: string;
    transcript_of_records_path: string;
    formal_photo_path: string;
    parent_id_path: string;
    marriage_contract_path: string | null;
}

// This represents a learner who has applied
interface Applicant {
    learner_id: number;
    first_name: string;
    last_name: string;
    user: {
        email: string;
    };
    // The pivot object contains all application-specific data
    pivot: {
        status: 'Pending' | 'Approved' | 'Rejected';
        application_date: string;
        remarks: string | null;
        documents: ApplicationDocument | null; // Documents are now nested here
    };
}

interface ScholarshipDetails {
    scholarship_id: number;
    scholarship_name: string;
    provider: string;
    status: 'Open' | 'Closed' | 'Ongoing';
    available_slots: number;
    eligibility_criteria: string;
    application_deadline: string;
    learners: Applicant[]; // The data now comes from the 'learners' relationship
}

interface ScholarshipShowProps extends PageProps {
    scholarship: ScholarshipDetails;
}

export default function ScholarshipShow({ scholarship }: ScholarshipShowProps) {
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);
    const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [actionType, setActionType] = useState<'Approved' | 'Rejected' | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

    const { data, setData, post, processing, errors, reset } = useForm({
        status: '',
        remarks: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('staff.dashboard') },
        { title: 'Scholarships', href: route('staff.scholarships.index') },
        { title: scholarship.scholarship_name, href: '#' }
    ];

    // Filter and search functionality
    const filteredApplicants = scholarship.learners.filter(learner => {
        const matchesSearch = `${learner.first_name} ${learner.last_name} ${learner.user.email}`
            .toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || learner.pivot.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const openStatusModal = (applicant: Applicant, type: 'Approved' | 'Rejected') => {
        setSelectedApplicant(applicant);
        setActionType(type);
        setData({ status: type, remarks: applicant.pivot.remarks || '' });
        setStatusModalOpen(true);
    };

    const openPreviewModal = (applicant: Applicant) => {
        setSelectedApplicant(applicant);
        setPreviewModalOpen(true);
    };

    const closeModal = () => {
        setStatusModalOpen(false);
        setPreviewModalOpen(false);
        setSelectedApplicant(null);
        setActionType(null);
        reset();
    };

    const handleSubmitStatus = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedApplicant || !actionType) return;

        post(route('staff.scholarships.applicants.update_status', {
            scholarship: scholarship.scholarship_id,
            learner: selectedApplicant.learner_id
        }), {
            onSuccess: () => closeModal(),
            preserveScroll: true,
        });
    };

    const approvedCount = scholarship.learners.filter(app => app.pivot.status === 'Approved').length;
    const pendingCount = scholarship.learners.filter(app => app.pivot.status === 'Pending').length;
    const rejectedCount = scholarship.learners.filter(app => app.pivot.status === 'Rejected').length;

    const renderDocumentLink = (path: string | null, label: string) => {
        if (!path) return (
            <div className="flex items-center gap-2 text-gray-400">
                <FileText className="w-4 h-4" />
                <span className="text-sm">Not provided</span>
            </div>
        );
        return (
            <a 
                href={`/storage/${path}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group"
            >
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
        );
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Approved': return <CheckCircle2 className="w-4 h-4" />;
            case 'Rejected': return <XCircle className="w-4 h-4" />;
            default: return <Clock3 className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-amber-50 text-amber-700 border-amber-200';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Applicants for ${scholarship.scholarship_name}`} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Enhanced Header Section */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-blue-500/5 mb-8 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
                            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Award className="w-8 h-8" />
                                        <h1 className="text-3xl font-bold">{scholarship.scholarship_name}</h1>
                                    </div>
                                    <p className="text-blue-100 text-lg">Provided by: {scholarship.provider}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-2 text-sm font-semibold rounded-full flex items-center gap-2 ${
                                        scholarship.status === 'Open' 
                                            ? 'bg-green-100 text-green-800' 
                                            : scholarship.status === 'Closed' 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {scholarship.status === 'Open' && <CheckCircle2 className="w-4 h-4" />}
                                        {scholarship.status === 'Closed' && <XCircle className="w-4 h-4" />}
                                        {scholarship.status === 'Ongoing' && <Clock3 className="w-4 h-4" />}
                                        {scholarship.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-600 text-sm font-medium">Total Applicants</p>
                                            <p className="text-2xl font-bold text-blue-900">{scholarship.learners.length}</p>
                                        </div>
                                        <Users className="w-8 h-8 text-blue-500" />
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-emerald-600 text-sm font-medium">Approved</p>
                                            <p className="text-2xl font-bold text-emerald-900">{approvedCount}</p>
                                        </div>
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-amber-600 text-sm font-medium">Pending</p>
                                            <p className="text-2xl font-bold text-amber-900">{pendingCount}</p>
                                        </div>
                                        <Clock3 className="w-8 h-8 text-amber-500" />
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-red-600 text-sm font-medium">Rejected</p>
                                            <p className="text-2xl font-bold text-red-900">{rejectedCount}</p>
                                        </div>
                                        <XCircle className="w-8 h-8 text-red-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Scholarship Details */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        Application Details
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Available Slots:</span>
                                            <span className="font-semibold text-gray-900">{scholarship.available_slots}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Filled Slots:</span>
                                            <span className="font-semibold text-gray-900">{approvedCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Deadline:</span>
                                            <span className="font-semibold text-gray-900">
                                                {new Date(scholarship.application_deadline).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="mt-4">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${(approvedCount / scholarship.available_slots) * 100}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {approvedCount} of {scholarship.available_slots} slots filled
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        Eligibility Criteria
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                            {scholarship.eligibility_criteria}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Applicants Section */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-blue-500/5 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 px-8 py-6 border-b border-gray-200">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <Users className="w-7 h-7 text-blue-600" />
                                    Applicant Management
                                </h2>

                                {/* Search and Filter Controls */}
                                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search applicants..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-64"
                                        />
                                    </div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value as any)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {filteredApplicants.length > 0 ? (
                            <div className="overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Applicant
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Application Date
                                                </th>
                                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-8 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {filteredApplicants.map((learner, index) => (
                                                <tr key={learner.learner_id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex-shrink-0">
                                                                <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                                    <User className="h-6 w-6 text-blue-600" />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                                    {learner.first_name} {learner.last_name}
                                                                </p>
                                                                <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                                                                    <Mail className="w-3 h-3" />
                                                                    {learner.user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="text-sm text-gray-900 font-medium">
                                                            {new Date(learner.pivot.application_date).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(learner.pivot.application_date).toLocaleTimeString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 text-center">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(learner.pivot.status)}`}>
                                                            {getStatusIcon(learner.pivot.status)}
                                                            {learner.pivot.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => openPreviewModal(learner)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-150 shadow-sm"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                Preview
                                                            </button>
                                                            {learner.pivot.status === 'Pending' ? (
                                                                <>
                                                                    <button
                                                                        onClick={() => openStatusModal(learner, 'Approved')}
                                                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-700 transition-all duration-150 shadow-sm"
                                                                    >
                                                                        <Check className="w-4 h-4" />
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => openStatusModal(learner, 'Rejected')}
                                                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition-all duration-150 shadow-sm"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <span className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-500 bg-gray-100 rounded-lg">
                                                                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                                                    Processed
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                {scholarship.learners.length === 0 ? (
                                    <>
                                        <Inbox className="mx-auto h-16 w-16 text-gray-300" />
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">No Applicants Yet</h3>
                                        <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                                            There are currently no student applications for this scholarship. 
                                            Applications will appear here when students submit them.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <Search className="mx-auto h-16 w-16 text-gray-300" />
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">No Results Found</h3>
                                        <p className="mt-2 text-sm text-gray-500">
                                            No applicants match your current search and filter criteria.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setStatusFilter('All');
                                            }}
                                            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            Clear Filters
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Enhanced Document Preview Modal */}
            {isPreviewModalOpen && selectedApplicant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={closeModal}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <FileText className="w-6 h-6" />
                                        Application Documents
                                    </h3>
                                    <p className="text-blue-100 mt-1">
                                        {selectedApplicant.first_name} {selectedApplicant.last_name}
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {selectedApplicant.pivot.documents ? (
                                <div className="space-y-6">
                                    {[
                                        { label: 'Birth Certificate', path: selectedApplicant.pivot.documents.birth_certificate_path, required: true },
                                        { label: 'Transcript of Records', path: selectedApplicant.pivot.documents.transcript_of_records_path, required: true },
                                        { label: 'Formal Photo', path: selectedApplicant.pivot.documents.formal_photo_path, required: true },
                                        { label: 'Parent/Guardian ID', path: selectedApplicant.pivot.documents.parent_id_path, required: true },
                                        { label: 'Marriage Contract', path: selectedApplicant.pivot.documents.marriage_contract_path, required: false }
                                    ].map((doc, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${doc.path ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                    <FileText className={`w-5 h-5 ${doc.path ? 'text-green-600' : 'text-gray-400'}`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{doc.label}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {doc.required ? 'Required' : 'Optional'}
                                                        {doc.path ? ' • Submitted' : ' • Not provided'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                {doc.path ? (
                                                    <a
                                                        href={`/storage/${doc.path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg">
                                                        Not submitted
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                                    <h4 className="mt-4 text-lg font-medium text-gray-900">No Documents Found</h4>
                                    <p className="mt-2 text-sm text-gray-500">
                                        No documents were found for this application.
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-gray-50 px-8 py-4 flex justify-end border-t border-gray-200">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Status Update Modal */}
            {isStatusModalOpen && selectedApplicant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={closeModal}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleSubmitStatus}>
                            <div className={`px-8 py-6 ${actionType === 'Approved' ? 'bg-gradient-to-r from-emerald-600 to-green-600' : 'bg-gradient-to-r from-red-600 to-red-700'} text-white rounded-t-2xl`}>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        {actionType === 'Approved' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                        Confirm {actionType}
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-8">
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {selectedApplicant.first_name} {selectedApplicant.last_name}
                                            </p>
                                            <p className="text-sm text-gray-500">{selectedApplicant.user.email}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600">
                                        Are you sure you want to <span className={`font-semibold ${actionType === 'Approved' ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {actionType?.toLowerCase()}
                                        </span> this application?
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">
                                            Remarks (Optional)
                                        </label>
                                        <textarea
                                            id="remarks"
                                            value={data.remarks || ''}
                                            onChange={(e) => setData('remarks', e.target.value)}
                                            rows={4}
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            placeholder={`Add notes for this ${actionType?.toLowerCase()} decision...`}
                                        />
                                        {errors.remarks && (
                                            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.remarks}
                                            </p>
                                        )}
                                    </div>

                                    {actionType === 'Approved' && approvedCount >= scholarship.available_slots && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-amber-800">Slot Limit Warning</p>
                                                    <p className="text-sm text-amber-700 mt-1">
                                                        This scholarship has reached its maximum capacity ({scholarship.available_slots} slots). 
                                                        Approving this application will exceed the limit.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 px-8 py-4 flex justify-end gap-3 rounded-b-2xl border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={processing}
                                    className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all duration-150 ${
                                        actionType === 'Approved'
                                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                                            : 'bg-red-600 hover:bg-red-700 shadow-red-500/25'
                                    } shadow-lg disabled:shadow-none`}
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </span>
                                    ) : (
                                        `Confirm ${actionType}`
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { type PageProps, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, MapPin, Users, Award, Info, CheckCircle } from 'lucide-react';

// --- Interfaces ---
interface Scholarship {
    scholarship_id: number;
    scholarship_name: string;
    provider: string;
    description?: string;
    eligibility_criteria: string;
    available_slots: number;
    application_deadline: string;
    status: 'Open' | 'Closed' | 'Ongoing';
}

// --- CORRECTED PROPS INTERFACE ---
// This interface correctly expects the data sent by the controller.
interface StudentScholarshipsIndexProps extends PageProps {
    availableScholarships: Scholarship[];
    appliedScholarshipIds: number[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Scholarships', href: '#' }
];

export default function StudentScholarshipIndex({ availableScholarships = [], appliedScholarshipIds = [] }: StudentScholarshipsIndexProps) {
    // Helper to format dates
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    // Helper to check if a deadline is approaching
    const isDeadlineApproaching = (deadline: string) => {
        const deadlineDate = new Date(deadline);
        const today = new Date();
        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays > 0;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Available Scholarships" />
            
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Scholarships</h1>
                        <p className="text-gray-600">Browse and apply for scholarships that match your qualifications.</p>
                    </div>

                    {/* No scholarships message */}
                    {availableScholarships.length === 0 ? (
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                No scholarships are currently available for application. Please check back later.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        /* Scholarships Grid */
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {availableScholarships.map((scholarship) => {
                                // This logic now works correctly with the right props
                                const hasApplied = appliedScholarshipIds.includes(scholarship.scholarship_id);

                                return (
                                    <Card key={scholarship.scholarship_id} className="h-full flex flex-col">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-xl font-semibold text-htta-blue mb-2">{scholarship.scholarship_name}</CardTitle>
                                                    <CardDescription className="flex items-center gap-2 mb-3"><MapPin className="w-4 h-4" />{scholarship.provider}</CardDescription>
                                                </div>
                                                <Badge 
                                                    variant={scholarship.status === 'Open' ? 'default' : 'secondary'}
                                                    className={scholarship.status === 'Open' ? 'bg-green-100 text-green-800' : ''}
                                                >
                                                    {scholarship.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex-1 flex flex-col">
                                            {scholarship.description && <p className="text-sm text-gray-600 mb-4 line-clamp-3">{scholarship.description}</p>}
                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center gap-2 text-sm"><Users className="w-4 h-4 text-gray-500" /><span className="text-gray-600">{scholarship.available_slots} slots available</span></div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-600">Deadline: {formatDate(scholarship.application_deadline)}</span>
                                                    {isDeadlineApproaching(scholarship.application_deadline) && <Badge variant="destructive" className="ml-2 text-xs">Urgent</Badge>}
                                                </div>
                                            </div>
                                            <div className="mb-6">
                                                <h4 className="font-medium text-sm text-gray-900 mb-2">Eligibility:</h4>
                                                <p className="text-sm text-gray-600 line-clamp-2">{scholarship.eligibility_criteria}</p>
                                            </div>
                                            <div className="mt-auto">
                                                {hasApplied ? (
                                                    <div className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-md font-semibold">
                                                        <CheckCircle className="w-5 h-5" />
                                                        Application Submitted
                                                    </div>
                                                ) : (
                                                    <Link href={route('student.scholarships.apply', scholarship.scholarship_id)} className="w-full">
                                                        <Button className="w-full bg-htta-blue hover:bg-htta-dark-blue">
                                                            <Award className="w-4 h-4 mr-2" />
                                                            Apply Now
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}

                    {/* Information Footer */}
                    <div className="mt-12 bg-blue-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Important Notes:</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Make sure you meet all eligibility criteria before applying</li>
                            <li>• Prepare all required documents in advance</li>
                            <li>• Applications must be submitted before the deadline</li>
                            <li>• You can apply for multiple scholarships if eligible</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

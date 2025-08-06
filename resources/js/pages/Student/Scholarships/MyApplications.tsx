import React from 'react';
import { Head } from '@inertiajs/react';
import { type PageProps, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Award, CheckCircle, Clock, Info, MessageSquare, XCircle } from 'lucide-react';

// --- Interfaces ---
interface Application {
    scholarship_id: number;
    scholarship_name: string;
    provider: string;
    // The 'pivot' object contains the application-specific details
    pivot: {
        status: 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn';
        application_date: string;
        date_processed: string | null;
        remarks: string | null;
    };
}

interface MyApplicationsProps extends PageProps {
    applications: Application[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Applications', href: '#' }
];

// Helper to get status-specific styles
const getStatusStyles = (status: Application['pivot']['status']) => {
    switch (status) {
        case 'Approved':
            return { icon: <CheckCircle className="w-4 h-4" />, badge: 'bg-green-100 text-green-800', text: 'text-green-700' };
        case 'Rejected':
            return { icon: <XCircle className="w-4 h-4" />, badge: 'bg-red-100 text-red-800', text: 'text-red-700' };
        case 'Pending':
            return { icon: <Clock className="w-4 h-4" />, badge: 'bg-yellow-100 text-yellow-800', text: 'text-yellow-700' };
        default:
            return { icon: <Info className="w-4 h-4" />, badge: 'bg-gray-100 text-gray-800', text: 'text-gray-700' };
    }
};

export default function MyApplications({ applications = [] }: MyApplicationsProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Scholarship Applications" />
            
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
                        <p className="text-gray-600">Track the status of your scholarship applications here.</p>
                    </div>

                    {applications.length === 0 ? (
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>You have not applied for any scholarships yet.</AlertDescription>
                        </Alert>
                    ) : (
                        <div className="space-y-6">
                            {applications.map((app) => {
                                const styles = getStatusStyles(app.pivot.status);
                                return (
                                    <Card key={app.scholarship_id} className="overflow-hidden">
                                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                                            <div>
                                                <CardTitle className="text-xl font-semibold text-htta-blue mb-1">{app.scholarship_name}</CardTitle>
                                                <CardDescription>{app.provider}</CardDescription>
                                            </div>
                                            <Badge variant="outline" className={styles.badge}>
                                                {styles.icon}
                                                <span className="ml-2">{app.pivot.status}</span>
                                            </Badge>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                                <p><strong>Applied On:</strong> {formatDate(app.pivot.application_date)}</p>
                                                <p><strong>Date Processed:</strong> {formatDate(app.pivot.date_processed)}</p>
                                            </div>
                                            {app.pivot.remarks && (
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                                        <MessageSquare className="w-4 h-4" />
                                                        Remarks from Staff
                                                    </h4>
                                                    <p className="text-sm text-gray-600 italic">"{app.pivot.remarks}"</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

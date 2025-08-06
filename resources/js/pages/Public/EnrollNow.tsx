import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import RegistrationForm from './RegistrationForms';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { usePage } from '@inertiajs/react';

// Define the program type with new date fields
interface Program {
    id: number;
    course_name: string;
    enrollment_start_date?: string;
    enrollment_end_date?: string;
}

const EnrollNow: React.FC = () => {
    // Use the newly defined Program interface
    const { programs = [] } = usePage().props as { programs?: Program[] };

    return (
        <PublicLayout>
            <div className="container mx-auto py-8">
                <h1 className="text-4xl font-extrabold text-htta-blue text-center mb-8">Enroll Now!</h1>

                {/* Conditional Rendering based on whether programs are available */}
                {programs.length > 0 ? (
                    <>
                        <p className="text-lg text-gray-700 text-center mb-10">
                            Fill out the form below to register for one of our available programs.
                        </p>
                        <ErrorBoundary>
                            {/* Pass the available programs to the form */}
                            <RegistrationForm programs={programs} />
                        </ErrorBoundary>
                    </>
                ) : (
                    <div className="text-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 max-w-2xl mx-auto rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-3">Enrollment is Currently Closed</h2>
                        <p className="text-lg">
                            We are not accepting new applications at this time. Please check back later for future enrollment schedules. Thank you for your interest!
                        </p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
};

export default EnrollNow;
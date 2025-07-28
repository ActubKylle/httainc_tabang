import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

// Define the shape of our status configuration
interface StatusConfig {
    text: string;
    icon: React.ElementType;
    color: string;
}

// Map status strings to their display configuration
const statusMap: Record<string, StatusConfig> = {
    accepted: { text: 'Accepted', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    enrolled: { text: 'Enrolled', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    pending: { text: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    rejected: { text: 'Rejected', icon: XCircle, color: 'bg-red-100 text-red-800' },
    completed: { text: 'Completed', icon: CheckCircle, color: 'bg-blue-100 text-blue-800' },
    dropped: { text: 'Dropped', icon: XCircle, color: 'bg-gray-100 text-gray-800' },
};

// **THIS IS THE FIX**: A default status for unknown values
const defaultStatus: StatusConfig = {
    text: 'Unknown',
    icon: AlertCircle,
    color: 'bg-gray-200 text-gray-900',
};

export function StatusBadge({ status }: { status: string }) {
    // If the status is null or undefined, don't render anything
    if (!status) {
        return null;
    }

    // Look up the status, or use the default if not found.
    // .toLowerCase() makes it case-insensitive (handles 'Enrolled', 'enrolled', etc.)
    const { text, icon: Icon, color } = statusMap[status.toLowerCase()] || defaultStatus;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${color}`}
        >
            <Icon className="w-3.5 h-3.5" />
            {text}
        </span>
    );
}
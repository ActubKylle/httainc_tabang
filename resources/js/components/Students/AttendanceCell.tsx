import React from 'react';

interface Props {
    summary: string;
}

export function AttendanceCell({ summary }: Props) {
    // Handle the case where attendance has not been recorded yet
    if (summary === 'Not yet recorded') {
        return <span className="text-sm text-gray-500">Not Recorded</span>;
    }

    // Use a regular expression to extract the percentage number from the string
    const match = summary.match(/\((\d+)%\)/);
    const percentage = match ? parseInt(match[1], 10) : 0;

    // Determine the color of the progress bar based on the percentage
    let progressBarColor = 'bg-green-500'; // Default to green
    if (percentage < 90) {
        progressBarColor = 'bg-yellow-500'; // Yellow for caution
    }
    if (percentage < 75) {
        progressBarColor = 'bg-red-500'; // Red for danger
    }

    return (
        <div>
            {/* Display the original summary text */}
            <p className="text-sm font-medium text-gray-800">{summary}</p>
            {/* The visual progress bar */}
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-200">
                <div
                    className={`h-1.5 rounded-full ${progressBarColor}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}
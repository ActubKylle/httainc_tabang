import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link } from '@inertiajs/react';
import { Eye, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

export function ActionButtons({ learner, onAction }: { learner: any, onAction: (learner: any, action: 'accept' | 'reject') => void }) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors" aria-label="More actions">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content className="bg-white rounded-lg shadow-lg border border-gray-200 p-1.5 z-50 min-w-[150px]" sideOffset={5}>
                    <DropdownMenu.Item asChild>
                        <Link href={route('admin.enrollment.show', learner.learner_id)} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer">
                            <Eye className="w-4 h-4" /> View Details
                        </Link>
                    </DropdownMenu.Item>
                    {(learner.enrollment_status ?? 'pending') === 'pending' && (
                        <>
                            <DropdownMenu.Separator className="h-[1px] bg-gray-200 my-1" />
                            <DropdownMenu.Item asChild>
                                <button onClick={() => onAction(learner, 'accept')} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-green-700 hover:bg-green-50 transition-colors cursor-pointer w-full text-left">
                                    <CheckCircle className="w-4 h-4" /> Accept
                                </button>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item asChild>
                                <button onClick={() => onAction(learner, 'reject')} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-700 hover:bg-red-50 transition-colors cursor-pointer w-full text-left">
                                    <XCircle className="w-4 h-4" /> Reject
                                </button>
                            </DropdownMenu.Item>
                        </>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
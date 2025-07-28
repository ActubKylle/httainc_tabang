import React, { useState } from 'react';
import { Mail, Phone, Maximize } from 'lucide-react';

import { MyImagePreviewModal } from './MyImagePreviewModal'; 

export function LearnerInfo({ learner }: { learner: LearnerData }) { 
    const [isImageModalOpen, setImageModalOpen] = useState(false);

    return (
        <>
            <div className="flex items-center gap-3">
                {learner.picture_image_url ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm flex-shrink-0 cursor-pointer group">
                        <img
                        src={learner.picture_image_url} 
                            alt={`${learner.first_name} ${learner.last_name}'s 1x1`}
                            className="w-full h-full object-cover"
                            onClick={() => setImageModalOpen(true)}
                        />
                        <div
                            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={() => setImageModalOpen(true)}
                            title="Click to view image"
                        >
                            <Maximize className="w-5 h-5 text-white" />
                        </div>
                    </div>
                ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-dark font-semibold text-sm flex-shrink-0">
                        {learner.first_name.charAt(0)}{learner.last_name.charAt(0)}
                    </div>
                )}
                <div>
                    <p className="font-semibold text-gray-900">{learner.first_name} {learner.last_name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {learner.user?.email || learner.email || 'N/A'} {/* Use learner.email directly */}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {learner.contact_no || 'N/A'}
                    </p>
                </div>
            </div>

            {/* Image Preview Modal */}
            {isImageModalOpen && learner.picture_image_url && (
                <MyImagePreviewModal
                    isOpen={isImageModalOpen}
                    onClose={() => setImageModalOpen(false)}
                    imageUrl={learner.picture_image_url}
                    altText={`${learner.first_name} ${learner.last_name}'s 1x1`}
                />
            )}
        </>
    );
}
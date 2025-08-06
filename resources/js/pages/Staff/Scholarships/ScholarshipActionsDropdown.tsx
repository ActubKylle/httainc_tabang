// ScholarshipActionsDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

// Note: Replace 'route' with your actual route helper function

interface Scholarship {
    scholarship_id: number;
    scholarship_name: string;
    provider: string;
    status: 'Open' | 'Closed' | 'Ongoing';
    available_slots: number;
    application_deadline: string;
    description?: string;
    created_at?: string;
}

interface ScholarshipActionsDropdownProps {
    scholarship: Scholarship;
    onDelete: (scholarship: Scholarship) => void;
}

export const ScholarshipActionsDropdown: React.FC<ScholarshipActionsDropdownProps> = ({
    scholarship,
    onDelete
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Calculate optimal dropdown position
    const getDropdownPosition = () => {
        if (!buttonRef.current) return { top: '100%', right: '0' };

        const buttonRect = buttonRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Dropdown dimensions (approximate)
        const dropdownWidth = 192; // w-48 = 192px
        const dropdownHeight = 140; // approximate height
        
        let position: React.CSSProperties = {};
        
        // Horizontal positioning
        if (buttonRect.right + dropdownWidth > viewportWidth) {
            // Not enough space on the right, align to the right edge of button
            position.right = '0';
        } else {
            // Enough space, align to the left edge of button
            position.left = '0';
        }
        
        // Vertical positioning
        if (buttonRect.bottom + dropdownHeight > viewportHeight) {
            // Not enough space below, show above
            position.bottom = '100%';
            position.marginBottom = '4px';
        } else {
            // Enough space below
            position.top = '100%';
            position.marginTop = '4px';
        }
        
        return position;
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(false);
        onDelete(scholarship);
    };

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button 
                ref={buttonRef}
                onClick={handleToggle}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                aria-label="More actions"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <MoreHorizontal size={18} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop for mobile */}
                    <div 
                        className="fixed inset-0 z-10 md:hidden" 
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Dropdown Menu */}
                    <div 
                        className="absolute z-20 min-w-[192px] rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 border border-slate-200 focus:outline-none"
                        style={getDropdownPosition()}
                    >
                        <div 
                            className="py-2"
                            role="menu" 
                            aria-orientation="vertical"
                        >
                            <Link 
                                href={route('staff.scholarships.show', scholarship.scholarship_id)} 
                                onClick={handleLinkClick}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors w-full group"
                                role="menuitem"
                            >
                                <Eye size={14} className="group-hover:scale-110 transition-transform" /> 
                                <span>View Applicants</span>
                            </Link>
                            
                            <Link 
                                href={route('staff.scholarships.edit', scholarship.scholarship_id)} 
                                onClick={handleLinkClick}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors w-full group"
                                role="menuitem"
                            >
                                <Edit size={14} className="group-hover:scale-110 transition-transform" /> 
                                <span>Edit</span>
                            </Link>
                            
                            <div className="border-t border-slate-200 my-1" role="separator"></div>
                            
                            <button 
                                onClick={handleDelete}
                                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                                role="menuitem"
                            >
                                <Trash2 size={14} className="group-hover:scale-110 transition-transform" /> 
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// Enhanced version with animation support
export const AnimatedScholarshipActionsDropdown: React.FC<ScholarshipActionsDropdownProps> = ({
    scholarship,
    onDelete
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsAnimating(false);
        }, 150); // Match animation duration
    };

    const getDropdownPosition = () => {
        if (!buttonRef.current) return { top: '100%', right: '0' };

        const buttonRect = buttonRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        const dropdownWidth = 192;
        const dropdownHeight = 140;
        
        let position: React.CSSProperties = {};
        
        if (buttonRect.right + dropdownWidth > viewportWidth) {
            position.right = '0';
        } else {
            position.left = '0';
        }
        
        if (buttonRect.bottom + dropdownHeight > viewportHeight) {
            position.bottom = '100%';
            position.marginBottom = '4px';
        } else {
            position.top = '100%';
            position.marginTop = '4px';
        }
        
        return position;
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isOpen) {
            handleClose();
        } else {
            setIsOpen(true);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
        onDelete(scholarship);
    };

    const handleLinkClick = () => {
        handleClose();
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button 
                ref={buttonRef}
                onClick={handleToggle}
                className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                    ${isOpen 
                        ? 'bg-slate-200 text-slate-700 transform rotate-90' 
                        : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                    }`}
                aria-label="More actions"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <MoreHorizontal size={18} />
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-10 md:hidden" 
                        onClick={handleClose}
                    />
                    
                    <div 
                        className={`absolute z-20 min-w-[192px] rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 border border-slate-200 focus:outline-none transform transition-all duration-150 origin-top-right
                            ${isAnimating 
                                ? 'opacity-0 scale-95 translate-y-1' 
                                : 'opacity-100 scale-100 translate-y-0'
                            }`}
                        style={getDropdownPosition()}
                    >
                        <div className="py-2" role="menu" aria-orientation="vertical">
                            <Link 
                                href={route('staff.scholarships.show', scholarship.scholarship_id)} 
                                onClick={handleLinkClick}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors w-full group"
                                role="menuitem"
                            >
                                <Eye size={14} className="group-hover:scale-110 transition-transform" /> 
                                <span>View Applicants</span>
                            </Link>
                            
                            <Link 
                                href={route('staff.scholarships.edit', scholarship.scholarship_id)} 
                                onClick={handleLinkClick}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors w-full group"
                                role="menuitem"
                            >
                                <Edit size={14} className="group-hover:scale-110 transition-transform" /> 
                                <span>Edit</span>
                            </Link>
                            
                            <div className="border-t border-slate-200 my-1" role="separator"></div>
                            
                            <button 
                                onClick={handleDelete}
                                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                                role="menuitem"
                            >
                                <Trash2 size={14} className="group-hover:scale-110 transition-transform" /> 
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
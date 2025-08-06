import React, { useState, useEffect, useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { type PageProps, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
    FileUp, 
    Info, 
    Loader2, 
    ArrowLeft, 
    CheckCircle2, 
    Upload, 
    FileText, 
    User, 
    Mail, 
    AlertCircle,
    Eye,
    X,
    Image,
    FileIcon
} from 'lucide-react';

// --- Constants ---
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const ACCEPTED_FILE_TYPES = ['.pdf', '.jpg', '.jpeg', '.png'];
const ACCEPTED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

// Required fields for progress calculation
const REQUIRED_FIELD_KEYS: (keyof ApplyFormData)[] = [
    'birth_certificate',
    'transcript_of_records', 
    'formal_photo',
    'parent_id'
];

// File upload configuration
interface FileUploadConfig {
    key: keyof ApplyFormData;
    label: string;
    description: string;
    required: boolean;
    acceptedTypes?: string[];
}

const FILE_UPLOAD_CONFIGS: FileUploadConfig[] = [
    {
        key: 'birth_certificate',
        label: 'PSA/NSO Birth Certificate',
        description: 'Official birth certificate from PSA or NSO (PDF, JPG, PNG - Max 2MB)',
        required: true
    },
    {
        key: 'transcript_of_records',
        label: 'Transcript of Records (TOR)',
        description: 'TOR or Form 137 from your previous school (PDF, JPG, PNG - Max 2MB)',
        required: true
    },
    {
        key: 'formal_photo',
        label: 'Formal Photo',
        description: 'Passport size or 1x1 formal photograph (JPG, PNG - Max 2MB)',
        required: true,
        acceptedTypes: ['.jpg', '.jpeg', '.png']
    },
    {
        key: 'parent_id',
        label: 'Parent/Guardian ID',
        description: 'Valid ID of parent, applicant, or solo parent (PDF, JPG, PNG - Max 2MB)',
        required: true
    },
    {
        key: 'marriage_contract',
        label: 'Marriage Contract',
        description: 'Only if applicable - for married applicants (PDF, JPG, PNG - Max 2MB)',
        required: false
    }
];

// --- Interfaces ---
interface Scholarship {
    scholarship_id: number;
    scholarship_name: string;
    provider: string;
}

interface Learner {
    first_name: string;
    last_name: string;
    email: string;
}

interface ApplyPageProps extends PageProps {
    scholarship: Scholarship;
    learner: Learner;
}

interface ApplyFormData {
    first_name: string;
    last_name: string;
    email: string;
    birth_certificate: File | null;
    transcript_of_records: File | null;
    formal_photo: File | null;
    marriage_contract: File | null;
    parent_id: File | null;
}

interface ValidationError {
    type: 'size' | 'format';
    message: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Scholarships', href: route('student.scholarships.index') },
    { title: 'Apply', href: '#' }
];

// --- Utility Functions ---
const validateFile = (file: File, acceptedTypes: string[] = ACCEPTED_FILE_TYPES): ValidationError | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            type: 'size',
            message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
        };
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeTypeValid = ACCEPTED_MIME_TYPES.includes(file.type);
    const extensionValid = acceptedTypes.some(type => type.toLowerCase() === fileExtension);

    if (!mimeTypeValid && !extensionValid) {
        return {
            type: 'format',
            message: `File type not supported. Please upload: ${acceptedTypes.join(', ')}`
        };
    }

    return null;
};

const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
};

const isPDFFile = (file: File): boolean => {
    return file.type === 'application/pdf';
};

// --- Custom Components ---
const Badge = ({ 
    children, 
    variant = 'default', 
    className = '' 
}: { 
    children: React.ReactNode; 
    variant?: 'default' | 'destructive'; 
    className?: string; 
}) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    const variantClasses = {
        default: "bg-gray-100 text-gray-800",
        destructive: "bg-red-100 text-red-800"
    };
    
    return (
        <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    );
};

const ProgressBar = ({ value }: { value: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
            className="bg-htta-blue h-3 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
    </div>
);

// Enhanced File Upload Component
const FileUploadField = ({ 
    id, 
    label, 
    file, 
    onChange, 
    error, 
    required = true,
    description,
    acceptedTypes = ACCEPTED_FILE_TYPES
}: {
    id: string;
    label: string;
    file: File | null;
    onChange: (file: File | null) => void;
    error?: string;
    required?: boolean;
    description?: string;
    acceptedTypes?: string[];
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [validationError, setValidationError] = useState<ValidationError | null>(null);

    // Generate preview URL when file changes
    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [file]);

    // Debug logging
    useEffect(() => {
        if (file) {
            console.log(`📁 File uploaded for ${id}:`, {
                name: file.name,
                size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
                type: file.type
            });
        }
    }, [file, id]);

    const handleFileChange = (selectedFile: File | null) => {
        setValidationError(null);
        
        if (selectedFile) {
            const validation = validateFile(selectedFile, acceptedTypes);
            if (validation) {
                setValidationError(validation);
                return;
            }
        }
        
        onChange(selectedFile);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleRemoveFile = () => {
        onChange(null);
        setShowPreview(false);
        setValidationError(null);
    };

    const hasError = error || validationError;
    const isImage = file && isImageFile(file);
    const isPDF = file && isPDFFile(file);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Label htmlFor={id} className="text-sm font-medium text-gray-700">
                    {label}
                </Label>
                {required && <Badge variant="destructive" className="text-xs px-1.5 py-0.5">Required</Badge>}
            </div>
            
            {description && (
                <p className="text-xs text-gray-500 mb-2">{description}</p>
            )}

            <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
                    dragActive 
                        ? 'border-htta-blue bg-blue-50' 
                        : file && !hasError
                            ? 'border-green-400 bg-green-50' 
                            : hasError 
                                ? 'border-red-400 bg-red-50' 
                                : 'border-gray-300 hover:border-htta-blue hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    id={id}
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                    accept={acceptedTypes.join(',')}
                    aria-label={`Upload ${label}`}
                    aria-describedby={`${id}-description`}
                />
                
                <div className="text-center">
                    {file && !hasError ? (
                        <div className="space-y-3">
                            {/* File Info with Mini Preview */}
                            <div className="flex items-center justify-center space-x-3">
                                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                                
                                {/* Mini Image Preview */}
                                {isImage && previewUrl && (
                                    <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-green-200">
                                        <img 
                                            src={previewUrl} 
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                
                                <div className="text-left">
                                    <p className="text-sm font-medium text-green-700 truncate max-w-[200px]">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-green-600">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center justify-center gap-2">
                                {(isImage || isPDF) && (
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview(true)}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                                        aria-label={`Preview ${file.name}`}
                                    >
                                        <Eye className="w-3 h-3" />
                                        Preview
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                                    aria-label={`Remove ${file.name}`}
                                >
                                    <X className="w-3 h-3" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-gray-500" id={`${id}-description`}>
                                    {acceptedTypes.join(', ').toUpperCase()} up to 2MB
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Error Messages */}
            {(error || validationError) && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {validationError?.message || error}
                </div>
            )}

            {/* Preview Modal */}
            {showPreview && file && previewUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                {isImage ? (
                                    <Image className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <FileIcon className="w-5 h-5 text-gray-600" />
                                )}
                                <h3 className="text-lg font-medium text-gray-900 truncate">
                                    {file.name}
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close preview"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        
                        {/* Modal Content */}
                        <div className="p-4 max-h-[70vh] overflow-auto">
                            {isImage ? (
                                <div className="flex justify-center">
                                    <img 
                                        src={previewUrl} 
                                        alt={file.name}
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                    />
                                </div>
                            ) : isPDF ? (
                                <div className="w-full h-[60vh]">
                                    <iframe
                                        src={previewUrl}
                                        className="w-full h-full border-0 rounded-lg"
                                        title={file.name}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FileIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">Preview not available for this file type</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        File: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                            <div className="text-sm text-gray-600">
                                Size: {(file.size / 1024 / 1024).toFixed(2)} MB • Type: {file.type}
                            </div>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Main Component
export default function Apply({ scholarship, learner, auth }: ApplyPageProps) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<ApplyFormData>({
        first_name: learner.first_name || '',
        last_name: learner.last_name || '',
        email: auth.user.email || '',
        birth_certificate: null,
        transcript_of_records: null,
        formal_photo: null,
        marriage_contract: null,
        parent_id: null,
    });

    // Memoized progress calculation
    const progressData = useMemo(() => {
        const completedFields = REQUIRED_FIELD_KEYS.filter(key => data[key] !== null).length;
        const totalRequired = REQUIRED_FIELD_KEYS.length;
        const percentage = Math.round((completedFields / totalRequired) * 100);
        
        return {
            completed: completedFields,
            total: totalRequired,
            percentage,
            isComplete: percentage === 100
        };
    }, [data]);

    // Debug logging for progress and submission
    useEffect(() => {
        if (progressData.isComplete) {
            console.log('🎉 Progress: 100% - All required documents uploaded!');
        }
    }, [progressData.isComplete]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('📤 Form submission started', {
            scholarship: scholarship.scholarship_name,
            documentsUploaded: progressData.completed,
            progressPercentage: progressData.percentage
        });
        
        post(route('student.scholarships.store', scholarship.scholarship_id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                console.log('✅ Application submitted successfully!');
            },
            onError: (errors) => {
                console.log('❌ Submission failed:', errors);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Apply for ${scholarship.scholarship_name}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back Navigation */}
                    <div className="mb-8">
                        <Link 
                            href={route('student.scholarships.index')} 
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-htta-blue transition-colors duration-200 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                            Back to Scholarships
                        </Link>
                    </div>

                    {/* Scholarship Header Card */}
                    <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-htta-blue to-blue-600 text-white">
                        <CardHeader className="pb-8">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-3xl font-bold mb-2">
                                        {scholarship.scholarship_name}
                                    </CardTitle>
                                    <CardDescription className="text-blue-100 text-lg">
                                        Offered by {scholarship.provider}
                                    </CardDescription>
                                </div>
                                <Badge className="bg-white/20 text-white border-white/30">
                                    Application
                                </Badge>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Main Application Form */}
                    <Card className="shadow-xl border-0">
                        <CardContent className="p-8">
                            {recentlySuccessful ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        Application Submitted Successfully!
                                    </h3>
                                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                        Your scholarship application has been received and is now under review. 
                                        We'll notify you of any updates via email.
                                    </p>
                                    <Button asChild className="bg-htta-blue hover:bg-htta-dark-blue">
                                        <Link href={route('student.scholarships.index')}>
                                            View All Scholarships
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Enhanced Progress Indicator */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                Application Progress
                                            </h3>
                                            <span className="text-sm font-medium text-gray-600">
                                                {progressData.completed}/{progressData.total} Required Documents ({progressData.percentage}%)
                                            </span>
                                        </div>
                                        <ProgressBar value={progressData.percentage} />
                                        
                                        {progressData.isComplete ? (
                                            <div className="flex items-center gap-2 mt-3 text-green-700">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <p className="text-sm font-medium">
                                                    ✅ All required documents are uploaded and ready for submission.
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-600 mt-2">
                                                {progressData.total - progressData.completed} more document{progressData.total - progressData.completed !== 1 ? 's' : ''} required to complete your application.
                                            </p>
                                        )}
                                    </div>

                                    {/* Personal Information Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                            <div className="w-10 h-10 bg-htta-blue rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-800">
                                                    Personal Information
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Your profile information (read-only)
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                                                    First Name
                                                </Label>
                                                <div className="relative">
                                                    <Input 
                                                        id="first_name" 
                                                        value={data.first_name} 
                                                        disabled 
                                                        className="bg-gray-50 border-gray-200 pl-10" 
                                                    />
                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                                                    Last Name
                                                </Label>
                                                <div className="relative">
                                                    <Input 
                                                        id="last_name" 
                                                        value={data.last_name} 
                                                        disabled 
                                                        className="bg-gray-50 border-gray-200 pl-10" 
                                                    />
                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                                    Email Address
                                                </Label>
                                                <div className="relative">
                                                    <Input 
                                                        id="email" 
                                                        value={data.email} 
                                                        disabled 
                                                        className="bg-gray-50 border-gray-200 pl-10" 
                                                    />
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Document Upload Section - Refactored with Array Map */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-800">
                                                    Required Documents
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Upload all required documents to complete your application
                                                </p>
                                            </div>
                                        </div>

                                        {/* Required Documents Grid */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {FILE_UPLOAD_CONFIGS.filter(config => config.required).map((config) => (
                                                <FileUploadField
                                                    key={config.key}
                                                    id={config.key}
                                                    label={config.label}
                                                    description={config.description}
                                                    file={data[config.key]}
                                                    onChange={(file) => setData(config.key, file)}
                                                    error={errors[config.key]}
                                                    required={config.required}
                                                    acceptedTypes={config.acceptedTypes || ACCEPTED_FILE_TYPES}
                                                />
                                            ))}
                                        </div>

                                        {/* Optional Documents */}
                                        <div className="pt-6 border-t border-gray-100">
                                            <h4 className="text-lg font-medium text-gray-700 mb-4">
                                                Optional Documents
                                            </h4>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {FILE_UPLOAD_CONFIGS.filter(config => !config.required).map((config) => (
                                                    <FileUploadField
                                                        key={config.key}
                                                        id={config.key}
                                                        label={config.label}
                                                        description={config.description}
                                                        file={data[config.key]}
                                                        onChange={(file) => setData(config.key, file)}
                                                        error={errors[config.key]}
                                                        required={config.required}
                                                        acceptedTypes={config.acceptedTypes || ACCEPTED_FILE_TYPES}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Important Notice */}
                                    <Alert className="border-blue-200 bg-blue-50">
                                        <Info className="h-4 w-4 text-blue-600" />
                                        <AlertTitle className="text-blue-800">Important Notice</AlertTitle>
                                        <AlertDescription className="text-blue-700">
                                            Please ensure all documents are clear, legible, and in acceptable formats (PDF, JPG, PNG). 
                                            Maximum file size is 2MB per document. Files are validated automatically upon upload.
                                        </AlertDescription>
                                    </Alert>

                                    {/* Submit Button */}
                                    <div className="flex justify-end pt-6 border-t border-gray-200">
                                        <Button 
                                            type="submit" 
                                            disabled={processing || !progressData.isComplete}
                                            className="bg-htta-blue hover:bg-htta-dark-blue px-8 py-3 text-base font-medium min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label={progressData.isComplete ? "Submit application" : "Complete required documents to submit"}
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Submitting Application...
                                                </>
                                            ) : !progressData.isComplete ? (
                                                <>
                                                    <Upload className="mr-2 h-5 w-5" />
                                                    Complete Required Documents ({progressData.percentage}%)
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="mr-2 h-5 w-5" />
                                                    Submit Application
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
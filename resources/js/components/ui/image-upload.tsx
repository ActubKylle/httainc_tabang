import React, { useRef, useState } from 'react';
import { X, Image as ImageIcon, Loader2, Eye, UploadCloud } from 'lucide-react';

export interface ImageUploadProps {
    id: string;
    label: string;
    onChange: (file: File | null) => void;
    error?: string;
    maxSize?: number; // in bytes
    accept?: string;
    className?: string;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_WIDTH = 800;
const MAX_HEIGHT = 600;
const QUALITY = 0.8;

const ImageUpload: React.FC<ImageUploadProps> = ({
    id,
    label,
    onChange,
    error,
    maxSize = DEFAULT_MAX_SIZE,
    accept = 'image/jpeg,image/png,image/webp',
    className = '',
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [internalError, setInternalError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const reset = () => {
        setPreview(null);
        setProgress(0);
        setProcessing(false);
        setInternalError(null);
        setFileName(null);
        onChange(null);
    };

    const validateFile = (file: File): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!ACCEPTED_TYPES.includes(file.type)) {
                reject('Only JPEG, PNG, or WebP images are allowed.');
                return;
            }
            if (file.size > maxSize) {
                reject(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB.`);
                return;
            }
            // Check dimensions
            const img = new window.Image();
            img.onload = () => {
                if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
                    // We'll compress, so allow
                    resolve();
                } else {
                    resolve();
                }
            };
            img.onerror = () => reject('Invalid image file.');
            img.src = URL.createObjectURL(file);
        });
    };

    const compressImage = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                    const aspect = width / height;
                    if (width > height) {
                        width = MAX_WIDTH;
                        height = Math.round(MAX_WIDTH / aspect);
                    } else {
                        height = MAX_HEIGHT;
                        width = Math.round(MAX_HEIGHT * aspect);
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject('Canvas not supported.');
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject('Compression failed.');
                    },
                    file.type,
                    QUALITY
                );
            };
            img.onerror = () => reject('Failed to load image for compression.');
            img.src = URL.createObjectURL(file);
        });
    };

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        setInternalError(null);
        setProcessing(true);
        setProgress(10);
        setFileName(file.name);
        try {
            await validateFile(file);
            setProgress(30);
            // Compress if needed
            const compressedBlob = await compressImage(file);
            setProgress(70);
            const compressedFile = new File([compressedBlob], file.name, { type: file.type });
            setPreview(URL.createObjectURL(compressedBlob));
            setProgress(100);
            setTimeout(() => setProcessing(false), 300);
            onChange(compressedFile);
        } catch (err: any) {
            setInternalError(err.toString());
            setProcessing(false);
            setPreview(null);
            setFileName(null);
            onChange(null);
        }
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const openFileDialog = () => {
        inputRef.current?.click();
    };

    // Keyboard accessibility
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            openFileDialog();
        }
    };

    return (
        <div className={`w-full ${className}`}>            
            <label htmlFor={id} className="block text-gray-900 text-sm font-semibold mb-2">{label}</label>
            <div
                tabIndex={0}
                role="button"
                aria-label="Upload image"
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-htta-blue focus:outline-none
                    ${dragActive ? 'border-htta-blue bg-blue-50' : error || internalError ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-htta-blue'}
                    min-h-[180px] py-6 px-4 text-center select-none`}
                onClick={openFileDialog}
                onKeyDown={onKeyDown}
                onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
                onDrop={onDrop}
            >
                {processing ? (
                    <div className="flex flex-col items-center gap-2 animate-pulse">
                        <Loader2 className="w-10 h-10 text-htta-blue animate-spin" />
                        <span className="text-htta-blue font-medium">Processing...</span>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-htta-blue h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                ) : preview ? (
                    <div className="relative w-full flex flex-col items-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="object-contain max-h-40 rounded-lg shadow-md border border-gray-200 mx-auto transition-all duration-200" />
                        <div className="flex gap-2 mt-3">
                            <button
                                type="button"
                                aria-label="Remove image"
                                className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition"
                                onClick={e => { e.stopPropagation(); reset(); }}
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                aria-label="View full image"
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                                onClick={e => { e.stopPropagation(); setShowModal(true); }}
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                        </div>
                        <span className="block text-xs text-gray-500 mt-2 truncate max-w-xs">{fileName}</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                        <UploadCloud className="w-10 h-10 mb-2 text-htta-blue" />
                        <span className="font-medium">Drag & drop or click to upload</span>
                        <span className="text-xs">JPEG, PNG, WebP. Max {Math.round(maxSize / 1024 / 1024)}MB. Max {MAX_WIDTH}x{MAX_HEIGHT}px.</span>
                    </div>
                )}
                <input
                    ref={inputRef}
                    id={id}
                    name={id}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={onInputChange}
                    aria-label={label}
                    tabIndex={-1}
                />
            </div>
            {(error || internalError) && (
                <p className="text-red-500 text-xs italic mt-1" role="alert">{error || internalError}</p>
            )}
            {/* Modal for full-size preview */}
            {showModal && preview && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition"
                    aria-modal="true"
                    role="dialog"
                    tabIndex={-1}
                    onClick={() => setShowModal(false)}
                >
                    <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-lg w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
                        <button
                            type="button"
                            aria-label="Close preview"
                            className="absolute top-2 right-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                            onClick={() => setShowModal(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <img src={preview} alt="Full preview" className="object-contain max-h-[70vh] rounded-lg" />
                        <span className="block text-xs text-gray-500 mt-2 truncate max-w-xs">{fileName}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload; 
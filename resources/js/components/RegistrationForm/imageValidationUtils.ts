// src/utils/imageValidationUtils.ts

/**
 * Utility function to validate if an image has a square aspect ratio (e.g., for 2x2 pictures).
 * It also checks for common 2x2 inch photo dimensions in pixels.
 * @param file The image file to validate.
 * @returns A Promise that resolves with validation details or rejects with an error.
 */
export const validateImageDimensions = (file: File): Promise<{
    width: number;
    height: number;
    aspectRatio: number;
    isSquare: boolean;
    isCommon2x2Size: boolean;
    isValid2x2: boolean;
    message: string;
}> => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }

        if (!file.type.startsWith('image/')) {
            reject(new Error('File is not an image'));
            return;
        }

        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const { width, height } = img;
            URL.revokeObjectURL(url); // Clean up

            const aspectRatio = width / height;
            // Allow a small tolerance for square (e.g., 5% deviation from 1)
            const isSquare = Math.abs(aspectRatio - 1) < 0.05;

            // Define common pixel dimensions for 2x2 inch photos at various DPIs
            const commonSizes = [
                { width: 144, height: 144, dpi: 72 },   // 2x2 inches @ 72 DPI
                { width: 200, height: 200, dpi: 100 },  // Common web size, approx 2x2
                { width: 300, height: 300, dpi: 150 },  // 2x2 inches @ 150 DPI
                { width: 400, height: 400, dpi: 200 },  // 2x2 inches @ 200 DPI
                { width: 600, height: 600, dpi: 300 },  // 2x2 inches @ 300 DPI
            ];

            const isCommon2x2Size = commonSizes.some(size =>
                Math.abs(width - size.width) <= 10 && Math.abs(height - size.height) <= 10
            );

            // A 2x2 picture should ideally be square and of a reasonable size.
            // We consider it valid if it's square AND either a common 2x2 size OR within a reasonable pixel range.
            const isValid2x2 = isSquare && (isCommon2x2Size || (width >= 144 && height >= 144 && width <= 1000 && height <= 1000));

            resolve({
                width,
                height,
                aspectRatio,
                isSquare,
                isCommon2x2Size,
                isValid2x2,
                message: getValidationMessage(width, height, isSquare, isCommon2x2Size, isValid2x2)
            });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image. Please ensure it is a valid image file.'));
        };

        img.src = url;
    });
};

/**
 * Generates a user-friendly validation message based on image dimensions.
 * @param width The width of the image.
 * @param height The height of the image.
 * @param isSquare Whether the image has a square aspect ratio.
 * @param isCommon2x2Size Whether the image matches a common 2x2 pixel size.
 * @param isValid2x2 Whether the image is considered a valid 2x2 format overall.
 * @returns A string message indicating the validation status.
 */
const getValidationMessage = (width: number, height: number, isSquare: boolean, isCommon2x2Size: boolean, isValid2x2: boolean): string => {
    if (isValid2x2) {
        return `Image dimensions: ${width}x${height} pixels. Looks good!`;
    }

    if (!isSquare) {
        const aspectRatio = (width / height).toFixed(2);
        return `Image should be square (e.g., 2x2 ratio). Current: ${width}x${height} pixels (aspect ratio: ${aspectRatio}:1).`;
    }

    if (isSquare && (width < 144 || height < 144)) {
        return `Image is too small for a 2x2 picture. Recommended minimum: 144x144 pixels. Current: ${width}x${height} pixels.`;
    }

    if (isSquare && (width > 1000 || height > 1000)) {
        return `Image is too large for a 2x2 picture. Recommended maximum: 1000x1000 pixels. Current: ${width}x${height} pixels.`;
    }

    return `Please upload a square 2x2 picture. Current dimensions: ${width}x${height} pixels.`;
};

/**
 * Handles file input change events, performing validation and updating form data and errors.
 * This function should be passed the `setData` and `setClientSideErrors` functions from your `useForm` hook.
 *
 * @param field The form field name (e.g., 'picture_image').
 * @param event The React change event from the file input.
 * @param setData The `setData` function from Inertia's `useForm` hook.
 * @param setClientSideErrors The state setter for client-side errors (e.g., `setClientSideErrors`).
 * @param validateField Your form's general `validateField` function for non-image-specific validation.
 */
export const handleFileChangeWithValidation = async <T extends { [key: string]: any }>(
    field: keyof T,
    event: React.ChangeEvent<HTMLInputElement>,
    setData: (field: keyof T, value: any) => void,
    setClientSideErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    validateField: (field: keyof T, value: any) => string | null // Pass your general validation function
) => {
    const file = event.target.files ? event.target.files[0] : null;
    const maxSize = 2 * 1024 * 1024; // 2MB

    // Clear previous error for this field
    setClientSideErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
    });

    if (!file) {
        setData(field, null);
        setClientSideErrors(prev => ({
            ...prev,
            [field]: 'This image is required.'
        }));
        return;
    }

    // Basic file size and type validation
    if (file.size > maxSize) {
        setClientSideErrors(prev => ({
            ...prev,
            [field]: 'File size must be less than 2MB.'
        }));
        return;
    }

    if (!file.type.startsWith('image/')) {
        setClientSideErrors(prev => ({
            ...prev,
            [field]: 'Invalid file type. Please upload an image (JPEG, PNG, WEBP).'
        }));
        return;
    }

    // Specific validation for 'picture_image' field
    if (field === 'picture_image') {
        try {
            const validation = await validateImageDimensions(file);
            if (!validation.isValid2x2) {
                setClientSideErrors(prev => ({
                    ...prev,
                    [field]: validation.message
                }));
                // Even if not valid 2x2, we might still want to set the file if it's generally an image.
                // Decide based on your UX. For strict 2x2, don't set data if invalid.
                setData(field, null); // Clear file if not valid 2x2
                return; // Stop further processing if 2x2 validation fails
            }
            // If valid 2x2, proceed to set the data
        } catch (error: any) {
            setClientSideErrors(prev => ({
                ...prev,
                [field]: `Image processing error: ${error.message}`
            }));
            setData(field, null); // Clear file if processing fails
            return;
        }
    }

    // If all validations pass, or if it's not the 'picture_image' field, set the file data
    setData(field, file);

    // Run general field validation after setting the data
    const generalErrorMsg = validateField(field, file);
    if (generalErrorMsg) {
        setClientSideErrors(prev => ({
            ...prev,
            [field]: generalErrorMsg
        }));
    }
};
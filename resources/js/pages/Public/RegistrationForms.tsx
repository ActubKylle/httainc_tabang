import React, { useState, useEffect, useCallback } from 'react';
import { useForm, router,usePage } from '@inertiajs/react';
import Swal from 'sweetalert2'; // Import SweetAlert2
import ImageUpload from '@/components/ui/image-upload';


interface RegistrationFormProps {
    programs: { id: number; course_name: string }[];
}

// Define interfaces for your form data, options, and reusable InputField props
interface FormData {
    [key: string]: string | number | boolean | File | null | number[] | undefined;

    last_name: string;
    first_name: string;
    middle_name: string;
    extension_name: string;
    gender: string;
    civil_status: string;
    birth_date: string;
    age: number | '';
    birthplace_city_municipality: string;
    birthplace_province: string;
    birthplace_region: string;
    nationality: string;
    employment_status: string;
    employment_type: string;
    parent_guardian_name: string;
    parent_guardian_mailing_address: string;
    email: string;

    number_street: string;
    city_municipality: string;
    barangay: string;
    district: string;
    province: string;
    region: string;
    facebook_account: string;
    contact_no: string;

    // Educational attainment fields aligned with the Laravel EducationalAttainment model
    no_grade_completed: boolean;
    elementary_undergraduate: boolean;
    elementary_graduate: boolean;
    junior_high_k12: boolean;
    senior_high_k12: boolean;
    high_school_undergraduate: boolean;
    high_school_graduate: boolean;
    post_secondary_non_tertiary_technical_vocational_undergraduate: boolean;
    post_secondary_non_tertiary_technical_vocational_course_graduate: boolean;
    college_undergraduate: boolean;
    college_graduate: boolean;
    masteral: boolean;
    doctorate: boolean;

    classifications: number[];
    other_classification_details: string;

    disability_types: number[];
    cause_of_disability: string;

    program_id: number | '' | undefined; 
    scholarship_package: string;

    consent_given: boolean;

    thumbmark_image: File | null;
    picture_image: File | null;
}

interface SelectOption {
    value: string;
    label: string;
}

interface CheckboxOption {
    id: number;
    type?: string;
    name?: string;
}

interface InputFieldProps {
    id: string;
    label: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'radio' | 'checkbox' | 'file';
    value?: string | number | boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    error?: string;
    placeholder?: string;
    min?: string;
    max?: string;
    options?: SelectOption[];
    isChecked?: boolean;
    onCheckboxChange?: React.ChangeEventHandler<HTMLInputElement>;
    name?: string;
    className?: string;
}

// Reusable Input Field Component
const InputField: React.FC<InputFieldProps> = React.memo(({
    id, label, type = 'text', value, onChange, error, placeholder, min, max, 
    options, isChecked, onCheckboxChange, name, className
}) => 
    <div className="mb-5">
        <label htmlFor={id} className="block text-gray-900 text-sm font-semibold mb-2">
            {label}
        </label>
        {type === 'select' ? (
            <select
                id={id}
                name={id}
                value={value as string}
                onChange={onChange}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-htta-blue focus:border-htta-blue transition duration-300 ease-in-out text-gray-900 shadow-sm ${error ? 'border-red-500' : ''} ${className}`}
            >
                <option value="">Select...</option>
                {options?.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        ) : type === 'textarea' ? (
            <textarea
                id={id}
                name={id}
                value={value as string}
                onChange={onChange}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-htta-blue focus:border-htta-blue transition duration-300 ease-in-out text-gray-900 shadow-sm ${error ? 'border-red-500' : ''} ${className}`}
                placeholder={placeholder}
                rows={4}
            />
        ) : type === 'checkbox' || type === 'radio' ? (
            <input
                type={type}
                id={id}
                name={name || id}
                checked={isChecked}
                onChange={onCheckboxChange}
                className={`mr-2 h-5 w-5 text-htta-blue rounded border-gray-300 focus:ring-htta-blue focus:ring-2 transition duration-200 ease-in-out ${className}`}
                value={value as string}
            />
        ) : type === 'file' ? (
            <input
                type="file"
                id={id}
                name={id}
                onChange={onChange}
                className={`w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-htta-blue file:text-dark hover:file:bg-htta-green-dark focus:outline-none focus:ring-3 focus:ring-htta-blue focus:border-htta-blue transition duration-300 ease-in-out shadow-sm ${error ? 'border-red-500' : ''} ${className}`}
            />
        ) : (
            <input
                type={type}
                id={id}
                name={id}
                value={value as string | number}
                onChange={onChange}
                placeholder={placeholder}
                min={min}
                max={max}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-htta-blue focus:border-htta-blue transition duration-300 ease-in-out text-gray-900 shadow-sm ${error ? 'border-red-500' : ''} ${className}`}
            />
        )}
        {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
);

const validateField = (field: keyof FormData, value: any): string | null => {
    // Required fields for each step
    const requiredFields = [
        'last_name', 'first_name', 'gender', 'civil_status', 'birth_date', 'age', 'email', 'nationality',
        'number_street', 'city_municipality', 'barangay', 'province', 'region', 'contact_no', 'parent_guardian_name', 'parent_guardian_mailing_address',
        'program_id', 'consent_given', 'thumbmark_image', 'picture_image'
    ];

    if (requiredFields.includes(field as string)) {
        if (typeof value === 'string' && !value.trim()) return 'This field is required.';
        if (typeof value === 'number' && (value === '' || isNaN(value))) return 'This field is required.';
        if (field === 'consent_given' && !value) return 'You must agree to the privacy disclaimer.';
        if ((field === 'thumbmark_image' || field === 'picture_image') && !value) return 'This image is required.';
    }

    // Add custom field validation as needed
    return null;
};



const RegistrationForm: React.FC<RegistrationFormProps> = ({ programs = [] }) => {

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        last_name: '', first_name: '', middle_name: '', extension_name: '',
        gender: '', civil_status: '', birth_date: '', age: '',
        birthplace_city_municipality: '', birthplace_province: '', birthplace_region: '',
        nationality: '', employment_status: '', employment_type: '',
        parent_guardian_name: '', parent_guardian_mailing_address: '', email: '',

        number_street: '', city_municipality: '', barangay: '', district: '',
        province: '', region: '', facebook_account: '', contact_no: '',
        
        // Initializing all educational attainment fields to false, aligning with migration defaults
        no_grade_completed: false,
        elementary_undergraduate: false,
        elementary_graduate: false,
        junior_high_k12: false,
        senior_high_k12: false,
        high_school_undergraduate: false,
        high_school_graduate: false,
        post_secondary_non_tertiary_technical_vocational_undergraduate: false,
        post_secondary_non_tertiary_technical_vocational_course_graduate: false,
        college_undergraduate: false,
        college_graduate: false,
        masteral: false,
        doctorate: false,

        classifications: [], other_classification_details: '',
        disability_types: [], cause_of_disability: '',
        program_id: '', scholarship_package: '',
        consent_given: false,
        thumbmark_image: null, picture_image: null,
    });

    const [currentStep, setCurrentStep] = useState(0);
    // State to manage client-side validation errors
    const [clientSideErrors, setClientSideErrors] = useState<Record<string, string>>({});

    const steps = [
        "Personal",
        "Contact",
        "Education",
        "Class",
        "Course",
        "Consent",
        "Review"    
    ];

    // Simulate fetching options (replace with actual Inertia props or API call if needed)
    const [classificationOptions, setClassificationOptions] = useState<CheckboxOption[]>([]);
    const [disabilityTypeOptions, setDisabilityTypeOptions] = useState<CheckboxOption[]>([]);

    // Educational attainment levels with values matching FormData keys (and migration columns)
    const educationalAttainmentLevels = [
        { value: 'no_grade_completed', label: 'No Grade Completed' },
        { value: 'elementary_undergraduate', label: 'Elementary Undergraduate' },
        { value: 'elementary_graduate', label: 'Elementary Graduate' },
        { value: 'junior_high_k12', label: 'Junior High (K-12)' },
        { value: 'senior_high_k12', label: 'Senior High (K-12)' },
        { value: 'high_school_undergraduate', label: 'High School Undergraduate' },
        { value: 'high_school_graduate', label: 'High School Graduate' },
        { value: 'post_secondary_non_tertiary_technical_vocational_undergraduate', label: 'Post-Secondary Non-Tertiary Technical Vocational Undergraduate' },
        { value: 'post_secondary_non_tertiary_technical_vocational_course_graduate', label: 'Post-Secondary Non-Tertiary Technical Vocational Course Graduate' },
        { value: 'college_undergraduate', label: 'College Undergraduate' },
        { value: 'college_graduate', label: 'College Graduate' },
        { value: 'masteral', label: 'Masteral' },
        { value: 'doctorate', label: 'Doctorate' },
    ];


    useEffect(() => {
        setClassificationOptions([
            { id: 1, type: '4Ps Beneficiary' }, { id: 2, type: 'Agrarian Reform Beneficiary' },
            { id: 3, type: 'Displaced Workers' }, { id: 4, type: 'Community-Based (Rebel Returnees)' },
            { id: 5, type: 'Family Members of AFP and PNP' }, { id: 6, type: 'Local/National Government Employees' },
            { id: 7, type: 'Industry Workers' }, { id: 8, type: 'Inmates and Detainees' },
            { id: 9, type: 'Out of School Youth' }, { id: 10, type: 'Overseas Filipino Workers (OFW) Dependent' },
            { id: 11, type: 'Rebel Returnees/Decommissioned Combatants' }, { id: 12, type: 'Workers (OFWs)' },
            { id: 13, type: 'TESDA Alumni' }, { id: 14, type: 'VET Trainers' },
            { id: 15, type: 'Victim of Natural Disasters and Calamities' }, { id: 16, type: 'Wounded-in-Action AFP & PNP Personnel' },
            { id: 17, type: 'Balik Probinsya' }, { id: 18, type: 'Family Members of AFP and PNP Killed-in-Action' },
            { id: 19, type: 'Indigenous People & Cultural Communities' }, { id: 20, type: 'BRLF Beneficiary' },
            { id: 21, type: 'RCEF RESP' }, { id: 22, type: 'Student' },
            { id: 23, type: 'Unemployed Personnel' }, { id: 24, type: 'Others' },
        ]);
        setDisabilityTypeOptions([
            { id: 1, name: 'Mentally Challenged' }, { id: 2, name: 'Hearing Disability' },
            { id: 3, name: 'Visual Disability' }, { id: 4, name: 'Speech Impairment' },
            { id: 5, name: 'Multiple Disabilities' }, { id: 6, name: 'Psychosocial Disability' },
            { id: 7, name: 'Orthopedic (Musculoskeletal) Disability' }, { id: 8, name: 'Intellectual Disability' },
            { id: 9, name: 'Learning Disability' }, { id: 10, name: 'Other Disability' },
        ]);
    }, []);

    const calculateAge = (birthdate: string): number | '' => {
    if (!birthdate) return '';
    const birthDateObj = new Date(birthdate);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
        calculatedAge--;
    }
    return calculatedAge >= 0 ? calculatedAge : '';
};

    const handleInputChange = (field: keyof FormData, value: any) => {
    setData(field, value);
    const errorMsg = validateField(field, value);
    setClientSideErrors(prev => {
        const newErrors = { ...prev };
        if (errorMsg) {
            newErrors[field] = errorMsg;
        } else {
            delete newErrors[field];
        }
        return newErrors;
    });
};

    const validateStep = async (step: number): Promise<boolean> => {
        let currentStepFields: (keyof FormData)[] = [];
        const newLocalErrors: Record<string, string> = {}; // Use a new object for local errors

        switch (step) {
            case 0: // Personal Information
                currentStepFields = ['last_name', 'first_name', 'gender', 'civil_status', 'birth_date', 'age', 'email', 'nationality'];
                break;
            case 1: // Contact & Address
                currentStepFields = ['number_street', 'city_municipality', 'barangay', 'province', 'region', 'contact_no', 'parent_guardian_name', 'parent_guardian_mailing_address'];
                break;
            case 2: // Educational Background
                // For educational attainment, at least one must be true
                const isAnyEducationalAttainmentSelected = educationalAttainmentLevels.some(
                    (level) => data[level.value as keyof FormData] === true
                );
                if (!isAnyEducationalAttainmentSelected) {
                    newLocalErrors.educational_attainment_level = 'Please select your highest educational attainment.';
                }
                break;
            case 3: // Classification & Disability
                // No fields are strictly required unless 'Others' or a disability is selected
                break;
            case 4: // Course & Scholarship
                currentStepFields = ['program_id'];
                break;
            case 5: // Consent & Uploads
                currentStepFields = ['consent_given', 'thumbmark_image', 'picture_image'];
                break;
            default:
                break;
        }

        // Perform client-side validation for current step's fields
        currentStepFields.forEach(field => {
            const value = data[field];

            if (typeof value === 'string' && !value.trim() &&
                !['middle_name', 'extension_name', 'facebook_account', 'scholarship_package', 'other_classification_details', 'cause_of_disability'].includes(field as string)) {
                newLocalErrors[field] = 'This field is required.';
            } else if (typeof value === 'number' && (value === '' || isNaN(value as number))) {
                newLocalErrors[field] = 'This field is required.';
            }
        });

        // Specific validation for 'Others' classification detail if 'Others' checkbox is selected
        if (step === 3 && data.classifications.includes(24) && !(data.other_classification_details?.trim())) {
            newLocalErrors.other_classification_details = 'Please specify details for "Others" classification.';
        }

        // Specific validation for cause of disability if any disability is selected
        if (step === 3 && data.disability_types.length > 0 && !(data.cause_of_disability?.trim())) {
            newLocalErrors.cause_of_disability = 'Please specify the cause of disability.';
        }

        // Specific validation for files and consent in step 5
        if (step === 5) {
            if (!data.thumbmark_image) newLocalErrors.thumbmark_image = 'Thumbmark image is required.';
            if (!data.picture_image) newLocalErrors.picture_image = 'Picture is required.';
            if (!data.consent_given) newLocalErrors.consent_given = 'You must agree to the privacy disclaimer.';
        }

        // Update the client-side errors state
        setClientSideErrors(newLocalErrors);

        return Object.keys(newLocalErrors).length === 0; // Return true if no local errors
    };


const handleNext = useCallback(async () => {
        const isValid = await validateStep(currentStep);
        if (isValid) {
            setCurrentStep((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Display alert only if there are client-side errors
            if (Object.keys(clientSideErrors).length > 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Missing Information',
                    text: 'Please fill in all required fields for this section.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3B82F6' // htta-blue color
                });
            }
        }
}, [currentStep, validateStep]);

 const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = await validateStep(currentStep); // Run client-side validation for the current step

        if (isValid) {
            router.post(route('register.learner'), data, {
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setCurrentStep(0); // Reset to first step on success
                    setClientSideErrors({}); // Clear client-side errors on success
                    Swal.fire({
                        icon: 'success',
                        title: 'Registration Successful!',
                        text: 'Your application has been received and is now waiting for approval by the administrator.',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#10B981' // htta-green color
                    });
                },
                onError: (validationErrors) => {
                    // Build an HTML list of errors
                    const errorList = Object.values(validationErrors)
                        .map(msg => `<li>${msg}</li>`)
                        .join('');
                    Swal.fire({
                        icon: 'error',
                        title: 'Form Errors',
                        html: `<ul style="text-align:left">${errorList}</ul>`,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#EF4444' // red color
                    });
                    // Server-side errors are automatically populated into `errors` object by Inertia
                    // Find the first error and navigate to its step
                    const firstErrorField = Object.keys(validationErrors)[0];
                    if (firstErrorField) {
                        const errorStepMap: Record<string, number> = {
                            last_name: 0, first_name: 0, gender: 0, civil_status: 0, birth_date: 0, age: 0, email: 0, nationality: 0,
                            number_street: 1, city_municipality: 1, barangay: 1, province: 1, region: 1, contact_no: 1, parent_guardian_name: 1, parent_guardian_mailing_address: 1, facebook_account: 1,
                            no_grade_completed: 2, elementary_undergraduate: 2, elementary_graduate: 2, junior_high_k12: 2, senior_high_k12: 2, high_school_undergraduate: 2, high_school_graduate: 2, post_secondary_non_tertiary_technical_vocational_undergraduate: 2, post_secondary_non_tertiary_technical_vocational_course_graduate: 2, college_undergraduate: 2, college_graduate: 2, masteral: 2, doctorate: 2, // Map all educational fields to step 2
                            classifications: 3, other_classification_details: 3, disability_types: 3, cause_of_disability: 3,
                            program_id: 4, scholarship_package: 4,
                            consent_given: 5, thumbmark_image: 5, picture_image: 5,
                        };
                        const stepWithError = errorStepMap[firstErrorField] !== undefined ? errorStepMap[firstErrorField] : currentStep;
                        setCurrentStep(stepWithError);
                    }
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Form Validation Failed',
                text: 'Please review the form for errors before submitting.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#EF4444'
            });
        }
    };

    // Handler for educational attainment radio buttons to ensure only one is true
   const handleEducationalAttainmentChange = (field: keyof FormData, isChecked: boolean) => {
    if (!isChecked) return; // Don't process unchecking
    
    setData(prevData => {
        const updates: Partial<FormData> = {};
        // Only reset others if we're selecting a new one
        educationalAttainmentLevels.forEach(level => {
            if (level.value !== field && prevData[level.value as keyof FormData]) {
                updates[level.value as keyof FormData] = false;
            }
        });
        updates[field] = true;
        return { ...prevData, ...updates };
    });

    // Validate group
    const isAnySelected = educationalAttainmentLevels.some(level => field === level.value && isChecked);
    setClientSideErrors(prev => {
        const newErrors = { ...prev };
        if (!isAnySelected) {
            newErrors.educational_attainment_level = 'Please select your highest educational attainment.';
        } else {
            delete newErrors.educational_attainment_level;
        }
        return newErrors;
    });
};
    const handleCheckboxChange = (field: keyof FormData, id: number) => {
        setData(prevData => {
            const currentArray = (prevData[field] as number[] | undefined) || [];
            const newArray = currentArray.includes(id)
                ? currentArray.filter(item => item !== id)
                : [...currentArray, id];
            return { ...prevData, [field]: newArray };
        });
    };

    const handleFileChange = (field: keyof FormData, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setData(field, file);
    const errorMsg = validateField(field, file);
    setClientSideErrors(prev => {
        const newErrors = { ...prev };
        if (errorMsg) {
            newErrors[field] = errorMsg;
        } else {
            delete newErrors[field];
        }
        return newErrors;
    });
};

    const renderStepContent = () => {
        // Helper to get the selected educational attainment label for review
        const getSelectedEducationalAttainment = () => {
            const selectedLevel = educationalAttainmentLevels.find(level => data[level.value as keyof FormData] === true);
            return selectedLevel ? selectedLevel.label : 'None selected';
        };

        switch (currentStep) {
            case 0: // Personal Information
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                id="last_name"
                                label="Last Name"
                                value={data.last_name}
                                onChange={e => handleInputChange('last_name', e.target.value)}
                                error={errors.last_name || clientSideErrors.last_name}
                            />       
                         <InputField id="first_name" label="First Name" value={data.first_name} onChange={e => handleInputChange('first_name', e.target.value)} error={errors.first_name || clientSideErrors.first_name} />
                        <InputField id="middle_name" label="Middle Name" value={data.middle_name} onChange={e => handleInputChange('middle_name', e.target.value)} error={errors.middle_name || clientSideErrors.middle_name} />
                        <InputField id="extension_name" label="Extension Name (Jr., Sr.)" value={data.extension_name} onChange={e => handleInputChange('extension_name', e.target.value)} error={errors.extension_name || clientSideErrors.extension_name} />

                        <div className="mb-5">
                            <label className="block text-gray-900 text-sm font-semibold mb-2">Gender</label>
                            <div className="flex flex-wrap items-center gap-6">
                                <label htmlFor="gender_male" className="flex items-center text-gray-900 cursor-pointer">
                                    <InputField id="gender_male" label="" type="radio" value="Male" onCheckboxChange={e => handleInputChange('gender', e.target.value)} isChecked={data.gender === 'Male'} name="gender" /> Male
                                </label>
                                <label htmlFor="gender_female" className="flex items-center text-gray-900 cursor-pointer">
                                    <InputField id="gender_female" label="" type="radio" value="Female" onCheckboxChange={e => handleInputChange('gender', e.target.value)} isChecked={data.gender === 'Female'} name="gender" /> Female
                                </label>
                                {errors.gender && <p className="text-red-500 text-xs italic mt-1">{errors.gender}</p>}
                                {clientSideErrors.gender && <p className="text-red-500 text-xs italic mt-1">{clientSideErrors.gender}</p>}
                            </div>
                        </div>

                        <InputField id="civil_status" label="Civil Status" type="select" value={data.civil_status} onChange={e => handleInputChange('civil_status', e.target.value)} error={errors.civil_status || clientSideErrors.civil_status}
                            options={[
                                { value: 'Single', label: 'Single' }, { value: 'Married', label: 'Married' },
                                { value: 'Widowed/Divorced/Annulled', label: 'Widowed/Divorced/Annulled' },
                                { value: 'Common Law/Live-in', label: 'Common Law/Live-in' },
                            ]}
                        />
                        <InputField id="birth_date" label="Birthdate" type="date"  value={data.birth_date} onChange={e => {handleInputChange('birth_date', e.target.value); handleInputChange('age', calculateAge(e.target.value)); }} error={errors.birth_date || clientSideErrors.birth_date} />
                        <InputField id="age" label="Age" type="number" value={data.age} readOnly onChange={e => handleInputChange('age', parseInt(e.target.value) || '')} error={errors.age || clientSideErrors.age} min="1" />
                        <InputField id="nationality" label="Nationality" value={data.nationality} onChange={e => handleInputChange('nationality', e.target.value)} error={errors.nationality || clientSideErrors.nationality} />
                        <InputField id="email" label="Email Address" type="email" value={data.email} onChange={e => handleInputChange('email', e.target.value)} error={errors.email || clientSideErrors.email} />
                    </div>
                );
            case 1: // Contact & Address
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField id="number_street" label="Number, Street" value={data.number_street} onChange={e => handleInputChange('number_street', e.target.value)} error={errors.number_street || clientSideErrors.number_street} />
                        <InputField id="barangay" label="Barangay" value={data.barangay} onChange={e => handleInputChange('barangay', e.target.value)} error={errors.barangay || clientSideErrors.barangay} />
                        <InputField id="city_municipality" label="City/Municipality" value={data.city_municipality} onChange={e => handleInputChange('city_municipality', e.target.value)} error={errors.city_municipality || clientSideErrors.city_municipality} />
                        <InputField id="district" label="District" value={data.district} onChange={e => handleInputChange('district', e.target.value)} error={errors.district || clientSideErrors.district} />
                        <InputField id="province" label="Province" value={data.province} onChange={e => handleInputChange('province', e.target.value)} error={errors.province || clientSideErrors.province} />
                        <InputField id="region" label="Region" value={data.region} onChange={e => handleInputChange('region', e.target.value)} error={errors.region || clientSideErrors.region} />
                        <InputField id="contact_no" label="Contact No." value={data.contact_no} onChange={e => handleInputChange('contact_no', e.target.value)} error={errors.contact_no || clientSideErrors.contact_no} />
                        <InputField id="facebook_account" label="Facebook Account" value={data.facebook_account} onChange={e => handleInputChange('facebook_account', e.target.value)} error={errors.facebook_account || clientSideErrors.facebook_account} />
                        <InputField id="parent_guardian_name" label="Parent/Guardian Name" value={data.parent_guardian_name} onChange={e => handleInputChange('parent_guardian_name', e.target.value)} error={errors.parent_guardian_name || clientSideErrors.parent_guardian_name} />
                        <InputField id="parent_guardian_mailing_address" label="Parent/Guardian Mailing Address" type="textarea" value={data.parent_guardian_mailing_address} onChange={e => handleInputChange('parent_guardian_mailing_address', e.target.value)} error={errors.parent_guardian_mailing_address || clientSideErrors.parent_guardian_mailing_address} />
                    </div>
                );
            case 2: // Educational Background
                return (
                    <div className="grid grid-cols-1 gap-4">
                        <h4 className="text-lg font-bold mb-3 text-gray-900">Highest Educational Attainment</h4>
                        {educationalAttainmentLevels.map((option) => (
                            <label key={option.value} htmlFor={`edu_${option.value}`} className="flex items-center text-gray-900 p-3 border border-gray-200 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out cursor-pointer shadow-sm">
                                <InputField
                                    id={`edu_${option.value}`}
                                    label=""
                                    type="radio"
                                    value={option.value}
                                    onCheckboxChange={e => handleEducationalAttainmentChange(option.value as keyof FormData, e.target.checked)}
                                    isChecked={data[option.value as keyof FormData] === true}
                                    name="educational_attainment_level_group" // Group all radio buttons
                                />
                                <span className="ml-2">{option.label}</span>
                            </label>
                        ))}
                        {errors.educational_attainment_level && <p className="text-red-500 text-xs italic mt-1">{errors.educational_attainment_level}</p>}
                        {clientSideErrors.educational_attainment_level && <p className="text-red-500 text-xs italic mt-1">{clientSideErrors.educational_attainment_level}</p>}
                    </div>
                );
            case 3: // Classification & Disability
                return (
                    <div className="grid grid-cols-1 gap-8">
                        <div>
                            <h4 className="text-lg font-bold mb-3 text-gray-900">Learner/Trainee/Student (Clients) Classification (Optional)</h4>
                            <p className="text-sm text-gray-700 mb-4">Select all that apply. You can leave this section blank if none apply.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {classificationOptions.map(option => (
                                    <label key={option.id} htmlFor={`classification_${option.id}`} className="flex items-center text-gray-900 p-3 border border-gray-200 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out cursor-pointer shadow-sm">
                                        <InputField id={`classification_${option.id}`} label="" type="checkbox" isChecked={data.classifications.includes(option.id)} onCheckboxChange={() => handleCheckboxChange('classifications', option.id)} /> <span className="ml-2">{option.type}</span>
                                    </label>
                                ))}
                            </div>
                            {data.classifications.includes(24) && ( // Assuming 24 is the ID for 'Others'
                                <InputField id="other_classification_details" label="Others (Please Specify)" value={data.other_classification_details} onChange={e => handleInputChange('other_classification_details', e.target.value)} error={errors.other_classification_details || clientSideErrors.other_classification_details} className="mt-5" />
                            )}
                            {errors.classifications && <p className="text-red-500 text-xs italic mt-1">{errors.classifications}</p>}
                            {clientSideErrors.classifications && <p className="text-red-500 text-xs italic mt-1">{clientSideErrors.classifications}</p>}
                        </div>

                        <div className="mt-6">
                            <h4 className="text-lg font-bold mb-3 text-gray-900">Type of Disability (Optional)</h4>
                            <p className="text-sm text-gray-700 mb-4">Select all that apply. You can leave this section blank if none apply.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {disabilityTypeOptions.map(option => (
                                    <label key={option.id} htmlFor={`disability_${option.id}`} className="flex items-center text-gray-900 p-3 border border-gray-200 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out cursor-pointer shadow-sm">
                                        <InputField id={`disability_${option.id}`} label="" type="checkbox" isChecked={data.disability_types.includes(option.id)} onCheckboxChange={() => handleCheckboxChange('disability_types', option.id)} /> <span className="ml-2">{option.name}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.disability_types && <p className="text-red-500 text-xs italic mt-1">{errors.disability_types}</p>}
                            {clientSideErrors.disability_types && <p className="text-red-500 text-xs italic mt-1">{clientSideErrors.disability_types}</p>}
                        </div>

                        {data.disability_types.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-lg font-bold mb-3 text-gray-900">Causes of Disability (Optional, if disability selected)</h4>
                                <InputField id="cause_of_disability" label="Cause of Disability" value={data.cause_of_disability} onChange={e => handleInputChange('cause_of_disability', e.target.value)} error={errors.cause_of_disability || clientSideErrors.cause_of_disability} placeholder="e.g., Congenital/Inborn, Illness, Injury" />
                            </div>
                        )}
                    </div>
                );
            case 4: // Course & Scholarship
                return (
                    <div className="grid grid-cols-1 gap-6">
                        <InputField id="program_id" label="Name of Course/Qualification" type="select" value={data.program_id} onChange={e => handleInputChange('program_id', Number(e.target.value))} error={errors.program_id || clientSideErrors.program_id} options={programs.map(program => ({ value: program.id.toString(), label: program.course_name, }))}/>
                        <InputField id="scholarship_package" label="If Scholar, What Type of Scholarship Package (TWSP, PESFA, STEP, others)?" value={data.scholarship_package} onChange={e => handleInputChange('scholarship_package', e.target.value)} error={errors.scholarship_package || clientSideErrors.scholarship_package} />
                    </div>
                );
            case 5: // Consent & Uploads
                return (
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <h4 className="text-lg font-bold mb-3 text-gray-900">Privacy Consent and Disclaimer</h4>
                            <label htmlFor="consent_given" className="flex items-start text-gray-900 p-4 border border-gray-200 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out cursor-pointer shadow-sm">
                                <InputField id="consent_given" label="" type="checkbox" isChecked={data.consent_given} onCheckboxChange={e => handleInputChange('consent_given', e.target.checked)} className="mt-1" />
                                <span className="ml-3 text-sm leading-relaxed">
                                    I hereby attest that I have read and understood the Privacy Notice of TESDA through its website (link here) and agree to the processing of my personal data for purposes indicated therein. I understand that this Learners Profile is for TESDA program monitoring which includes scholarships, employment, survey, and all other related TESDA programs that may be beneficial to my qualifications.
                                </span>
                            </label>
                            {errors.consent_given && <p className="text-red-500 text-xs italic mt-1">{errors.consent_given}</p>}
                            {clientSideErrors.consent_given && <p className="text-red-500 text-xs italic mt-1">{clientSideErrors.consent_given}</p>}
                        </div>

                        <div className="mt-6">
                            <h4 className="text-lg font-bold mb-3 text-gray-900">Applicant's Signature & Photo</h4>
                            <ImageUpload
                                id="thumbmark_image"
                                label="Upload Right Thumbmark (Image)"
                                onChange={file => handleFileChange('thumbmark_image', { target: { files: file ? [file] : [] } } as any)}
                                error={errors.thumbmark_image || clientSideErrors.thumbmark_image}
                                maxSize={2 * 1024 * 1024}
                                accept="image/jpeg,image/png,image/webp"
                            />
                            <ImageUpload
                                id="picture_image"
                                label="Upload 1x1 Picture (taken within 6 months)"
                                onChange={file => handleFileChange('picture_image', { target: { files: file ? [file] : [] } } as any)}
                                error={errors.picture_image || clientSideErrors.picture_image}
                                maxSize={2 * 1024 * 1024}
                                accept="image/jpeg,image/png,image/webp"
                            />
                            <p className="text-sm text-gray-700 italic mt-2">Note: The 'Printed Name' and 'Date Accomplished' will be automatically set in the system.</p>
                        </div>
                    </div>
                );
            case 6: // Review & Submit
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-htta-blue mb-4 text-center">Review Your Information</h3>
                        <p className="text-gray-700 text-center mb-6">Please review all the details carefully before submitting your registration.</p>

                        {/* Personal Information */}
                        <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                            <h4 className="font-bold text-lg text-htta-blue mb-3">Personal Information</h4>
                            <p className="text-gray-900 mb-1"><strong>Name:</strong> {data.first_name} {data.middle_name} {data.last_name} {data.extension_name}</p>
                            <p className="text-gray-900 mb-1"><strong>Gender:</strong> {data.gender}</p>
                            <p className="text-gray-900 mb-1"><strong>Civil Status:</strong> {data.civil_status}</p>
                            <p className="text-900 mb-1"><strong>Birthdate:</strong> {data.birth_date}</p>
                            <p className="text-gray-900 mb-1"><strong>Age:</strong> {data.age}</p>
                            <p className="text-gray-900 mb-1"><strong>Nationality:</strong> {data.nationality}</p>
                            <p className="text-gray-900"><strong>Email:</strong> {data.email}</p>
                        </div>

                        {/* Contact & Address */}
                        <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                            <h4 className="font-bold text-lg text-htta-blue mb-3">Contact & Address</h4>
                            <p className="text-gray-900 mb-1"><strong>Address:</strong> {data.number_street}, {data.barangay}, {data.city_municipality}, {data.district}, {data.province}, {data.region}</p>
                            <p className="text-gray-900 mb-1"><strong>Contact No.:</strong> {data.contact_no}</p>
                            <p className="text-gray-900 mb-1"><strong>Facebook:</strong> {data.facebook_account || 'N/A'}</p>
                            <p className="text-gray-900"><strong>Parent/Guardian:</strong> {data.parent_guardian_name || 'N/A'} ({data.parent_guardian_mailing_address || 'N/A'})</p>
                        </div>

                        {/* Educational Background */}
                        <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                            <h4 className="font-bold text-lg text-htta-blue mb-3">Educational Background</h4>
                            <p className="text-gray-900"><strong>Highest Attainment:</strong> {getSelectedEducationalAttainment()}</p>
                        </div>

                        {/* Classification & Disability */}
                        <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                            <h4 className="font-bold text-lg text-htta-blue mb-3">Classification & Disability</h4>
                            <p className="text-gray-900 mb-1"><strong>Classifications:</strong> {data.classifications.length > 0 ? data.classifications.map(id => classificationOptions.find(opt => opt.id === id)?.type).filter(Boolean).join(', ') : 'None selected'}</p>
                            {data.classifications.includes(24) && <p className="text-gray-900 mb-1"><strong>Other Classification Details:</strong> {data.other_classification_details}</p>}
                            <p className="text-gray-900 mb-1"><strong>Disabilities:</strong> {data.disability_types.length > 0 ? data.disability_types.map(id => disabilityTypeOptions.find(opt => opt.id === id)?.name).filter(Boolean).join(', ') : 'None selected'}</p>
                            {data.disability_types.length > 0 && <p className="text-gray-900"><strong>Cause of Disability:</strong> {data.cause_of_disability}</p>}
                        </div>

                        {/* Course & Scholarship */}
                        <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                            <h4 className="font-bold text-lg text-htta-blue mb-3">Course & Scholarship</h4>
                            <p className="text-gray-900 mb-1"><strong>Course/Qualification:</strong> {data.program_id}</p>
                            <p className="text-gray-900"><strong>Scholarship Package:</strong> {data.scholarship_package || 'N/A'}</p>
                        </div>

                        {/* Consent & Uploads */}
                        <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                            <h4 className="font-bold text-lg text-htta-blue mb-3">Consent & Uploads</h4>
                            <p className="text-gray-900 mb-1"><strong>Privacy Consent:</strong> {data.consent_given ? 'Agreed' : 'Not Agreed'}</p>
                            <p className="text-gray-900 mb-1"><strong>Thumbmark Image:</strong> {data.thumbmark_image ? 'Uploaded' : 'Not Uploaded'}</p>
                            <p className="text-gray-900"><strong>Picture Image:</strong> {data.picture_image ? 'Uploaded' : 'Not Uploaded'}</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

  const handleStepClick = useCallback(async (stepIndex: number) => {
    if (stepIndex < currentStep) {
        setCurrentStep(stepIndex);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const isValid = await validateStep(currentStep);
        if (isValid) {
            setCurrentStep(stepIndex);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
                if (Object.keys(clientSideErrors).length > 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Complete Current Section',
                        text: 'Please fill in all required fields for the current section before proceeding.',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3B82F6'
                    });
                }
            }
        }
}, [currentStep, validateStep]);

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-dark p-6 sm:p-10 rounded-xl shadow-2xl max-w-4xl mx-auto my-8 font-inter">
            {/* Progress Indicator */}
            <div className="mb-8 overflow-x-auto pb-3">
                <div className="flex justify-between items-center relative min-w-max">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <button
                                type="button"
                                onClick={() => handleStepClick(index)}
                                className={`flex flex-col items-center z-10 w-1/7 px-1 sm:px-2 cursor-pointer focus:outline-none focus:ring-3 focus:ring-htta-blue focus:ring-offset-2 rounded-full transition-all duration-300 ease-in-out
                                    ${index <= currentStep ? 'text-htta-blue' : 'text-gray-700'}`}
                            >
                                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-dark transition-all duration-300 ease-in-out text-sm sm:text-base
                                    ${index === currentStep ? 'bg-htta-blue scale-110 shadow-lg' :
                                        index < currentStep ? 'bg-htta-green' : 'bg-gray-300'}`}>
                                    {index + 1}
                                </div>
                                <div className={`text-center text-xs sm:text-sm mt-2 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full ${index <= currentStep ? 'text-htta-blue' : 'text-gray-700'}`}>
                                    {step}
                                </div>
                            </button>
                            {index < steps.length - 1 && (
                                <div className={`flex-auto border-t-2 transition-all duration-300 ease-in-out
                                    ${index < currentStep ? 'border-htta-green' : 'border-gray-300'}`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Section Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-htta-blue mb-6 text-center border-b-2 border-htta-gold pb-4">
                {steps[currentStep]}
            </h2>

            {/* Display general errors at the top of the form */}
            {(Object.keys(errors).length > 0 || Object.keys(clientSideErrors).length > 0) && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-4 rounded-lg relative mb-6 shadow-md">
                    <strong className="font-bold">Please correct the following errors:</strong>
                    <ul className="mt-3 list-disc list-inside">
                        {Object.values(errors).map((error: string, index: number) => (
                            <li key={index}>{error}</li>
                        ))}
                        {Object.values(clientSideErrors).map((error: string, index: number) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Render Current Step Content */}
            <div className="p-5 sm:p-8 border border-gray-200 rounded-xl bg-white shadow-inner">
                {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between mt-8 gap-5">
                {currentStep > 0 && (
                    <button
                        type="button"
                        onClick={handlePrevious}
                        className="w-full sm:w-auto px-8 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 transition duration-300 transform hover:scale-105"
                    >
                        &larr; Previous
                    </button>
                )}

                {currentStep < steps.length - 1 && (
                    <button
                        type="button"
                        onClick={handleNext}
                        className={`w-full sm:w-auto px-8 py-3 bg-htta-blue text-dark font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105 ${Object.keys(clientSideErrors).length > 0 ? 'opacity-50 cursor-not-allowed' : ''} ${currentStep === 0 ? 'sm:ml-auto' : ''}`}
                        disabled={Object.keys(clientSideErrors).length > 0}
                    >
                        Next &rarr;
                    </button>
                )}

                {currentStep === steps.length - 1 && (
                    <button
                        type="submit"
                        disabled={processing || Object.keys(clientSideErrors).length > 0}
                        className={`w-full sm:w-auto px-10 py-3 bg-htta-green text-dark font-bold rounded-full shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 ${(processing || Object.keys(clientSideErrors).length > 0) && 'opacity-50 cursor-not-allowed'}`}
                    >
                        {processing ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </span>
                        ) : (
                            'Submit Registration'
                        )}
                    </button>
                )}
            </div>
        </form>
    );
};

export default RegistrationForm;
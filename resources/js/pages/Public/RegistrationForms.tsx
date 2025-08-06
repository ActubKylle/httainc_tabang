// RegistrationForms.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import ImageUpload from '@/components/ui/image-upload';
import SkeletonLoader from '@/components/SkeletonLoader';
import { useIMask } from 'react-imask';

// ===================== TYPES & INTERFACES =====================

interface RegistrationFormProps {
    programs: { id: number; course_name: string }[];
}

interface FormData {
    [key: string]: string | number | boolean | File | null | number[] | undefined;
    // Personal Info
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
    // Address
    number_street: string;
    city_municipality: string;
    barangay: string;
    district: string;
    province: string;
    region: string;
    facebook_account: string;
    contact_no: string;
    // Education
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
    // Classifications
    classifications: number[];
    other_classification_details: string;
    disability_types: number[];
    cause_of_disability: string;
    // Course
    program_id: number | '' | undefined;
    scholarship_package: string;
    // Consent
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

interface AddressOption {
    code: string;
    name: string;
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
    disabled?: boolean;
    readOnly?: boolean;
}

const REGION_MAP: { [key: string]: string } = {
    '010000000': 'Region I',
    '020000000': 'Region II',
    '030000000': 'Region III',
    '040000000': 'Region IV-A', // Calabarzon
    '170000000': 'Region IV-B', // Mimaropa
    '050000000': 'Region V',
    '060000000': 'Region VI',
    '070000000': 'Region VII',
    '080000000': 'Region VIII',
    '090000000': 'Region IX',
    '100000000': 'Region X',
    '110000000': 'Region XI',
    '120000000': 'Region XII',
    '130000000': 'NCR', // National Capital Region
    '140000000': 'CAR', // Cordillera Administrative Region
    '150000000': 'BARMM', // Bangsamoro
    '160000000': 'Region XIII', // Caraga
};



// ===================== CONSTANTS =====================

const STEPS = ["Personal", "Contact", "Education", "Class", "Course", "Consent", "Review"];

const EDUCATIONAL_ATTAINMENT_LEVELS = [
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
] as const;

const EXTENSION_NAME_OPTIONS = [
    { value: 'Jr.', label: 'Jr.' },
    { value: 'Sr.', label: 'Sr.' },
    { value: 'I', label: 'I' },
    { value: 'II', label: 'II' },
    { value: 'III', label: 'III' },
    { value: 'IV', label: 'IV' },
    { value: 'V', label: 'V' },
] as const;

const CIVIL_STATUS_OPTIONS = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Widowed/Divorced/Annulled', label: 'Widowed/Divorced/Annulled' },
    { value: 'Common Law/Live-in', label: 'Common Law/Live-in' },
] as const;

const CLASSIFICATION_OPTIONS = [
    { id: 1, type: '4Ps Beneficiary' },
    { id: 2, type: 'Agrarian Reform Beneficiary' },
    { id: 3, type: 'Displaced Workers' },
    { id: 4, type: 'Community-Based (Rebel Returnees)' },
    { id: 5, type: 'Family Members of AFP and PNP' },
    { id: 6, type: 'Local/National Government Employees' },
    { id: 7, type: 'Industry Workers' },
    { id: 8, type: 'Inmates and Detainees' },
    { id: 9, type: 'Out of School Youth' },
    { id: 10, type: 'Overseas Filipino Workers (OFW) Dependent' },
    { id: 11, type: 'Rebel Returnees/Decommissioned Combatants' },
    { id: 12, type: 'Workers (OFWs)' },
    { id: 13, type: 'TESDA Alumni' },
    { id: 14, type: 'VET Trainers' },
    { id: 15, type: 'Victim of Natural Disasters and Calamities' },
    { id: 16, type: 'Wounded-in-Action AFP & PNP Personnel' },
    { id: 17, type: 'Balik Probinsya' },
    { id: 18, type: 'Family Members of AFP and PNP Killed-in-Action' },
    { id: 19, type: 'Indigenous People & Cultural Communities' },
    { id: 20, type: 'BRLF Beneficiary' },
    { id: 21, type: 'RCEF RESP' },
    { id: 22, type: 'Student' },
    { id: 23, type: 'Unemployed Personnel' },
    { id: 24, type: 'Others' },
] as const;

const DISABILITY_TYPE_OPTIONS = [
    { id: 1, name: 'Mentally Challenged' },
    { id: 2, name: 'Hearing Disability' },
    { id: 3, name: 'Visual Disability' },
    { id: 4, name: 'Speech Impairment' },
    { id: 5, name: 'Multiple Disabilities' },
    { id: 6, name: 'Psychosocial Disability' },
    { id: 7, name: 'Orthopedic (Musculoskeletal) Disability' },
    { id: 8, name: 'Intellectual Disability' },
    { id: 9, name: 'Learning Disability' },
    { id: 10, name: 'Other Disability' },
] as const;

const REQUIRED_FIELDS_BY_STEP = {
    0: ['last_name', 'first_name', 'gender', 'civil_status', 'birth_date', 'age', 'email', 'nationality', 'birthplace_region', 'birthplace_province', 'birthplace_city_municipality'],
    1: ['number_street', 'city_municipality', 'barangay', 'province', 'region', 'contact_no', 'parent_guardian_name', 'parent_guardian_mailing_address'],
    2: [], // Educational attainment has custom validation
    3: [], // Classifications are optional
    4: ['program_id'],
    5: ['consent_given', 'thumbmark_image', 'picture_image'],
} as const;

// ===================== UTILITY FUNCTIONS =====================

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

const validateField = (field: keyof FormData, value: any): string | null => {
    const requiredFields = [
        'last_name', 'first_name', 'gender', 'civil_status', 'birth_date', 'age', 'email', 'nationality',
        'birthplace_region', 'birthplace_province', 'birthplace_city_municipality',
        'number_street', 'city_municipality', 'barangay', 'province', 'region', 'contact_no',
        'parent_guardian_name', 'parent_guardian_mailing_address', 'program_id', 'consent_given',
        'thumbmark_image', 'picture_image'
    ];

    if (requiredFields.includes(field as string)) {
        if (typeof value === 'string' && !value.trim()) return 'This field is required.';
        if (typeof value === 'number' && (value === '' || isNaN(value))) return 'This field is required.';
        if (field === 'consent_given' && !value) return 'You must agree to the privacy disclaimer.';
        if ((field === 'thumbmark_image' || field === 'picture_image') && !value) return 'This image is required.';
    }

    if (field === 'contact_no') {
        if (typeof value === 'string' && !value.trim()) {
            return 'Contact number is required.';
        }
        const cleanedValue = value.replace(/[-\s]/g, '');
        const phMobileRegex = /^(09|\+639)\d{9}$/;
        if (!phMobileRegex.test(cleanedValue)) {
            return 'Please enter a valid Philippine mobile number (e.g., 09XX-XXX-XXXX or +639XX-XXX-XXXX).';
        }
    }

    return null;
};

// ===================== COMPONENTS =====================

const InputField: React.FC<InputFieldProps> = React.memo(({
    id, label, type = 'text', value, onChange, error, placeholder, min, max,
    options, isChecked, onCheckboxChange, name, className, disabled, readOnly
}) => {
    const baseInputClass = `w-full p-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-htta-blue focus:border-htta-blue transition duration-300 ease-in-out text-gray-900 shadow-sm ${error ? 'border-red-500' : ''} ${className}`;

    return (
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
                    disabled={disabled}
                    className={baseInputClass}
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
                    className={baseInputClass}
                    placeholder={placeholder}
                    rows={4}
                    disabled={disabled}
                    readOnly={readOnly}
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
                    disabled={disabled}
                />
            ) : type === 'file' ? (
                <input
                    type="file"
                    id={id}
                    name={id}
                    onChange={onChange}
                    className={baseInputClass}
                    disabled={disabled}
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
                    className={baseInputClass}
                    disabled={disabled}
                    readOnly={readOnly}
                />
            )}
            {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
        </div>
    );
});

InputField.displayName = 'InputField';

// ===================== CUSTOM HOOKS =====================

const useCurrentAddressData = () => {
    const [regions, setRegions] = useState<AddressOption[]>([]);
    const [provinces, setProvinces] = useState<AddressOption[]>([]);
    const [cities, setCities] = useState<AddressOption[]>([]);
    const [barangays, setBarangays] = useState<AddressOption[]>([]);
    const [selectedCodes, setSelectedCodes] = useState({
        region: '',
        province: '',
        city: '',
        barangay: '',
    });

    // Fetch regions on mount
    useEffect(() => {
        fetch('https://psgc.gitlab.io/api/regions/')
            .then(response => response.json())
            .then(data => setRegions(data.sort((a: AddressOption, b: AddressOption) => a.name.localeCompare(b.name))))
            .catch(error => console.error('Error fetching regions:', error));
    }, []);

    // Fetch provinces when region changes
    useEffect(() => {
        if (selectedCodes.region) {
            setProvinces([]);
            setCities([]);
            setBarangays([]);
            fetch(`https://psgc.gitlab.io/api/regions/${selectedCodes.region}/provinces/`)
                .then(response => response.json())
                .then(data => setProvinces(data.sort((a: AddressOption, b: AddressOption) => a.name.localeCompare(b.name))))
                .catch(error => console.error('Error fetching provinces:', error));
        }
    }, [selectedCodes.region]);

    // Fetch cities when province changes
    useEffect(() => {
        if (selectedCodes.province) {
            setCities([]);
            setBarangays([]);
            fetch(`https://psgc.gitlab.io/api/provinces/${selectedCodes.province}/cities-municipalities/`)
                .then(response => response.json())
                .then(data => setCities(data.sort((a: AddressOption, b: AddressOption) => a.name.localeCompare(b.name))))
                .catch(error => console.error('Error fetching cities:', error));
        }
    }, [selectedCodes.province]);

    // Fetch barangays when city changes
    useEffect(() => {
        if (selectedCodes.city) {
            setBarangays([]);
            fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCodes.city}/barangays/`)
                .then(response => response.json())
                .then(data => setBarangays(data.sort((a: AddressOption, b: AddressOption) => a.name.localeCompare(b.name))))
                .catch(error => console.error('Error fetching barangays:', error));
        }
    }, [selectedCodes.city]);

    return {
        regions,
        provinces,
        cities,
        barangays,
        selectedCodes,
        setSelectedCodes,
    };
};

// ADDED: A new, separate hook instance for BIRTHPLACE
const useBirthplaceAddressData = () => {
    const [regions, setRegions] = useState<AddressOption[]>([]);
    const [provinces, setProvinces] = useState<AddressOption[]>([]);
    const [cities, setCities] = useState<AddressOption[]>([]);
    const [selectedCodes, setSelectedCodes] = useState({
        region: '',
        province: '',
        city: '',
    });

    useEffect(() => {
        fetch('https://psgc.gitlab.io/api/regions/')
            .then(response => response.json())
            .then(data => setRegions(data.sort((a: AddressOption, b: AddressOption) => a.name.localeCompare(b.name))))
            .catch(error => console.error('Error fetching regions:', error));
    }, []);

    useEffect(() => {
        if (selectedCodes.region) {
            setProvinces([]);
            setCities([]);
            fetch(`https://psgc.gitlab.io/api/regions/${selectedCodes.region}/provinces/`)
                .then(response => response.json())
                .then(data => setProvinces(data.sort((a: AddressOption, b: AddressOption) => a.name.localeCompare(b.name))))
                .catch(error => console.error('Error fetching provinces:', error));
        }
    }, [selectedCodes.region]);

    useEffect(() => {
        if (selectedCodes.province) {
            setCities([]);
            fetch(`https://psgc.gitlab.io/api/provinces/${selectedCodes.province}/cities-municipalities/`)
                .then(response => response.json())
                .then(data => setCities(data.sort((a: AddressOption, b: AddressOption) => a.name.localeCompare(b.name))))
                .catch(error => console.error('Error fetching cities:', error));
        }
    }, [selectedCodes.province]);

    return {
        regions,
        provinces,
        cities,
        selectedCodes,
        setSelectedCodes,
    };
};


const useNationalities = () => {
    const [nationalities, setNationalities] = useState<SelectOption[]>([]);

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all?fields=demonyms')
            .then(response => response.json())
            .then(data => {
                const formattedNationalities = data
                    .filter((country: any) => country.demonyms?.eng?.m)
                    .map((country: any) => ({
                        value: country.demonyms.eng.m,
                        label: country.demonyms.eng.m,
                    }))
                    .sort((a: SelectOption, b: SelectOption) => a.label.localeCompare(b.label));

                setNationalities(formattedNationalities);
            })
            .catch(error => console.error('Error fetching nationalities:', error));
    }, []);

    return nationalities;
};

// ===================== MAIN COMPONENT =====================

const RegistrationForm: React.FC<RegistrationFormProps> = ({ programs = [] }) => {
    const { data, setData, post, processing, errors, reset, isDirty } = useForm<FormData>({
        // Personal Info
        last_name: '', first_name: '', middle_name: '', extension_name: '',
        gender: '', civil_status: '', birth_date: '', age: '',
        birthplace_city_municipality: '', birthplace_province: '', birthplace_region: '',
        nationality: '', employment_status: '', employment_type: '',
        parent_guardian_name: '', parent_guardian_mailing_address: '', email: '',
        // Address
        number_street: '', city_municipality: '', barangay: '', district: '',
        province: '', region: '', facebook_account: '', contact_no: '',
        // Education - all false by default
        no_grade_completed: false, elementary_undergraduate: false, elementary_graduate: false,
        junior_high_k12: false, senior_high_k12: false, high_school_undergraduate: false,
        high_school_graduate: false, post_secondary_non_tertiary_technical_vocational_undergraduate: false,
        post_secondary_non_tertiary_technical_vocational_course_graduate: false,
        college_undergraduate: false, college_graduate: false, masteral: false, doctorate: false,
        // Classifications
        classifications: [], other_classification_details: '',
        disability_types: [], cause_of_disability: '',
        // Course
        program_id: '', scholarship_package: '',
        // Consent
        consent_given: false, thumbmark_image: null, picture_image: null,
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [clientSideErrors, setClientSideErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Custom hooks
    const { regions, provinces, cities, barangays, selectedCodes, setSelectedCodes } = useCurrentAddressData();

    const {
        regions: birthplaceRegions,
        provinces: birthplaceProvinces,
        cities: birthplaceCities,
        selectedCodes: selectedBirthplaceCodes,
        setSelectedCodes: setSelectedBirthplaceCodes
    } = useBirthplaceAddressData();
    const nationalities = useNationalities();

    // IMask for contact number
    const { ref: contactNoRef } = useIMask(
        {
            mask: '+{63}900-000-0000',
            definitions: { '0': /[0-9]/, '9': /[0-9]/ },
            lazy: false,
            overwrite: 'shift',
        },
        {
            onAccept: (value) => handleInputChange('contact_no', value),
        }
    );

    // Memoized values
    const allErrors = useMemo(() => ({ ...errors, ...clientSideErrors }), [errors, clientSideErrors]);
    const hasErrors = useMemo(() => Object.keys(allErrors).length > 0, [allErrors]);

    // Page unload warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty && !processing) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty, processing]);

    // ===================== EVENT HANDLERS =====================

    const handleInputChange = useCallback((field: keyof FormData, value: any) => {
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
    }, [setData]);

     const handleAddressChange = useCallback((
        level: 'region' | 'province' | 'city' | 'barangay',
        code: string,
        options: AddressOption[]
    ) => {
        const selectedOption = options.find(option => option.code === code);
        const name = selectedOption?.name || '';

        // Update selected codes
        setSelectedCodes(prev => {
            const newCodes = { ...prev };
            if (level === 'region') {
                newCodes.region = code;
                newCodes.province = '';
                newCodes.city = '';
                newCodes.barangay = '';
            } else if (level === 'province') {
                newCodes.province = code;
                newCodes.city = '';
                newCodes.barangay = '';
            } else if (level === 'city') {
                newCodes.city = code;
                newCodes.barangay = '';
            } else if (level === 'barangay') {
                newCodes.barangay = code;
            }
            return newCodes;
        });

        // Update form data
        setData(prevData => {
            const newData = { ...prevData };
            if (level === 'region') {
                newData.region = name;
                newData.province = '';
                newData.city_municipality = '';
                newData.barangay = '';
            } else if (level === 'province') {
                newData.province = name;
                newData.city_municipality = '';
                newData.barangay = '';
            } else if (level === 'city') {
                newData.city_municipality = name;
                newData.barangay = '';
            } else if (level === 'barangay') {
                newData.barangay = name;
            }
            return newData;
        });
    }, [setData, setSelectedCodes]);

    // ADDED: A new handler for birthplace address changes
    const handleBirthplaceAddressChange = useCallback((
        level: 'region' | 'province' | 'city',
        code: string,
        options: AddressOption[]
    ) => {
        const selectedOption = options.find(option => option.code === code);
        const name = selectedOption?.name || '';

        // Update selected codes for birthplace
        setSelectedBirthplaceCodes(prev => {
            const newCodes = { ...prev };
            if (level === 'region') {
                newCodes.region = code;
                newCodes.province = '';
                newCodes.city = '';
            } else if (level === 'province') {
                newCodes.province = code;
                newCodes.city = '';
            } else if (level === 'city') {
                newCodes.city = code;
            }
            return newCodes;
        });

        // Update form data with birthplace names
        setData(prevData => {
            const newData = { ...prevData };
            if (level === 'region') {
                newData.birthplace_region = name;
                newData.birthplace_province = '';
                newData.birthplace_city_municipality = '';
            } else if (level === 'province') {
                newData.birthplace_province = name;
                newData.birthplace_city_municipality = '';
            } else if (level === 'city') {
                newData.birthplace_city_municipality = name;
            }
            return newData;
        });
    }, [setData, setSelectedBirthplaceCodes]);


    const handleEducationalAttainmentChange = useCallback((field: keyof FormData, isChecked: boolean) => {
        if (!isChecked) return;

        setData(prevData => {
            const updates: Partial<FormData> = {};
            EDUCATIONAL_ATTAINMENT_LEVELS.forEach(level => {
                if (level.value !== field && prevData[level.value as keyof FormData]) {
                    updates[level.value as keyof FormData] = false;
                }
            });
            updates[field] = true;
            return { ...prevData, ...updates };
        });

        setClientSideErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.educational_attainment_level;
            return newErrors;
        });
    }, [setData]);

    const handleCheckboxChange = useCallback((field: keyof FormData, id: number) => {
        setData(prevData => {
            const currentArray = (prevData[field] as number[] | undefined) || [];
            const newArray = currentArray.includes(id)
                ? currentArray.filter(item => item !== id)
                : [...currentArray, id];
            return { ...prevData, [field]: newArray };
        });
    }, [setData]);

    const handleFileChange = useCallback((field: keyof FormData, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
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
    }, [setData]);

    const validateStep = useCallback(async (step: number): Promise<boolean> => {
        const currentStepFields = REQUIRED_FIELDS_BY_STEP[step as keyof typeof REQUIRED_FIELDS_BY_STEP] || [];
        const newLocalErrors: Record<string, string> = {};

        // Validate required fields
        currentStepFields.forEach(field => {
            const value = data[field as keyof FormData];
            if (typeof value === 'string' && !value.trim() &&
                !['middle_name', 'extension_name', 'facebook_account', 'scholarship_package', 'other_classification_details', 'cause_of_disability'].includes(field)) {
                newLocalErrors[field] = 'This field is required.';
            } else if (typeof value === 'number' && (value === '' || isNaN(value as number))) {
                newLocalErrors[field] = 'This field is required.';
            }
        });

        // Step-specific validations
        switch (step) {
            case 2: // Educational Background
                const isAnyEducationalAttainmentSelected = EDUCATIONAL_ATTAINMENT_LEVELS.some(
                    level => data[level.value as keyof FormData] === true
                );
                if (!isAnyEducationalAttainmentSelected) {
                    newLocalErrors.educational_attainment_level = 'Please select your highest educational attainment.';
                }
                break;
            case 3: // Classification & Disability
                if (data.classifications.includes(24) && !data.other_classification_details?.trim()) {
                    newLocalErrors.other_classification_details = 'Please specify details for "Others" classification.';
                }
                if (data.disability_types.length > 0 && !data.cause_of_disability?.trim()) {
                    newLocalErrors.cause_of_disability = 'Please specify the cause of disability.';
                }
                break;
            case 5: // Consent & Uploads
                if (!data.thumbmark_image) newLocalErrors.thumbmark_image = 'Thumbmark image is required.';
                if (!data.picture_image) newLocalErrors.picture_image = 'Picture is required.';
                if (!data.consent_given) newLocalErrors.consent_given = 'You must agree to the privacy disclaimer.';
                break;
        }

        setClientSideErrors(newLocalErrors);
        return Object.keys(newLocalErrors).length === 0;
    }, [data]);

    const transitionToStep = useCallback((stepIndex: number) => {
        setIsLoading(true);
        setTimeout(() => {
            setCurrentStep(stepIndex);
            setIsLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
    }, []);

    const handleNext = useCallback(async () => {
        const isValid = await validateStep(currentStep);
        if (isValid) {
            transitionToStep(currentStep + 1);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please fill in all required fields for this section.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3B82F6'
            });
        }
    }, [currentStep, validateStep, transitionToStep]);

    const handlePrevious = useCallback(() => {
        transitionToStep(currentStep - 1);
    }, [currentStep, transitionToStep]);

    const handleStepClick = useCallback(async (stepIndex: number) => {
        if (stepIndex < currentStep) {
            transitionToStep(stepIndex);
        } else {
            const isValid = await validateStep(currentStep);
            if (isValid) {
                transitionToStep(stepIndex);
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Complete Current Section',
                    text: 'Please fill in all required fields for the current section before proceeding.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3B82F6'
                });
            }
        }
    }, [currentStep, validateStep, transitionToStep]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const isValid = await validateStep(currentStep);
        if (!isValid) {
            setIsLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Form Validation Failed',
                text: 'Please review the form for errors before submitting.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#EF4444'
            });
            return;
        }

        router.post(route('register.learner'), data, {
            forceFormData: true,
            onSuccess: () => {
                setIsLoading(false);
                reset();
                setCurrentStep(0);
                setClientSideErrors({});
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    text: 'Your application has been received and is now waiting for approval by the administrator.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#10B981'
                });
            },
            onError: (validationErrors) => {
                setIsLoading(false);
                const errorList = Object.values(validationErrors)
                    .map(msg => `<li>${msg}</li>`)
                    .join('');
                Swal.fire({
                    icon: 'error',
                    title: 'Form Errors',
                    html: `<ul style="text-align:left">${errorList}</ul>`,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#EF4444'
                });

                // Navigate to step with first error
                const firstErrorField = Object.keys(validationErrors)[0];
                if (firstErrorField) {
                    // UPDATED: Added birthplace to error map
                    const errorStepMap: Record<string, number> = {
                        last_name: 0, first_name: 0, gender: 0, civil_status: 0, birth_date: 0, age: 0, email: 0, nationality: 0,
                        birthplace_region: 0, birthplace_province: 0, birthplace_city_municipality: 0,
                        number_street: 1, city_municipality: 1, barangay: 1, province: 1, region: 1, contact_no: 1, parent_guardian_name: 1, parent_guardian_mailing_address: 1, facebook_account: 1,
                        no_grade_completed: 2, elementary_undergraduate: 2, elementary_graduate: 2, junior_high_k12: 2, senior_high_k12: 2, high_school_undergraduate: 2, high_school_graduate: 2, post_secondary_non_tertiary_technical_vocational_undergraduate: 2, post_secondary_non_tertiary_technical_vocational_course_graduate: 2, college_undergraduate: 2, college_graduate: 2, masteral: 2, doctorate: 2,
                        classifications: 3, other_classification_details: 3, disability_types: 3, cause_of_disability: 3,
                        program_id: 4, scholarship_package: 4,
                        consent_given: 5, thumbmark_image: 5, picture_image: 5,
                    };
                    const stepWithError = errorStepMap[firstErrorField] ?? currentStep;
                    setCurrentStep(stepWithError);
                }
            }
        });
    }, [currentStep, validateStep, data, reset]);

    // ===================== RENDER METHODS =====================

    const renderPersonalStep = useCallback(() => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
                id="last_name"
                label="Last Name"
                value={data.last_name}
                onChange={e => handleInputChange('last_name', e.target.value)}
                error={allErrors.last_name}
            />
            <InputField
                id="first_name"
                label="First Name"
                value={data.first_name}
                onChange={e => handleInputChange('first_name', e.target.value)}
                error={allErrors.first_name}
            />
            <InputField
                id="middle_name"
                label="Middle Name"
                value={data.middle_name}
                onChange={e => handleInputChange('middle_name', e.target.value)}
                error={allErrors.middle_name}
            />
            <InputField
                id="extension_name"
                label="Extension Name (Jr., Sr.)"
                type="select"
                value={data.extension_name}
                onChange={e => handleInputChange('extension_name', e.target.value)}
                error={allErrors.extension_name}
                options={EXTENSION_NAME_OPTIONS}
            />

            <div className="mb-5">
                <label className="block text-gray-900 text-sm font-semibold mb-2">Gender</label>
                <div className="flex flex-wrap items-center gap-6">
                    <label htmlFor="gender_male" className="flex items-center text-gray-900 cursor-pointer">
                        <InputField
                            id="gender_male"
                            label=""
                            type="radio"
                            value="Male"
                            onCheckboxChange={e => handleInputChange('gender', e.target.value)}
                            isChecked={data.gender === 'Male'}
                            name="gender"
                        />
                        Male
                    </label>
                    <label htmlFor="gender_female" className="flex items-center text-gray-900 cursor-pointer">
                        <InputField
                            id="gender_female"
                            label=""
                            type="radio"
                            value="Female"
                            onCheckboxChange={e => handleInputChange('gender', e.target.value)}
                            isChecked={data.gender === 'Female'}
                            name="gender"
                        />
                        Female
                    </label>
                </div>
                {allErrors.gender && <p className="text-red-500 text-xs italic mt-1">{allErrors.gender}</p>}
            </div>

            <InputField
                id="civil_status"
                label="Civil Status"
                type="select"
                value={data.civil_status}
                onChange={e => handleInputChange('civil_status', e.target.value)}
                error={allErrors.civil_status}
                options={CIVIL_STATUS_OPTIONS}
            />
            <InputField
                id="birth_date"
                label="Birthdate"
                type="date"
                value={data.birth_date}
                onChange={e => {
                    handleInputChange('birth_date', e.target.value);
                    handleInputChange('age', calculateAge(e.target.value));
                }}
                error={allErrors.birth_date}
            />
            <InputField
                id="age"
                label="Age"
                type="number"
                value={data.age}
                readOnly
                onChange={e => handleInputChange('age', parseInt(e.target.value) || '')}
                error={allErrors.age}
                min="1"
            />
            <InputField
                id="nationality"
                label="Nationality"
                type="select"
                value={data.nationality}
                onChange={e => handleInputChange('nationality', e.target.value)}
                error={allErrors.nationality}
                options={nationalities}
            />
            <InputField
                id="email"
                label="Email Address"
                type="email"
                value={data.email}
                onChange={e => handleInputChange('email', e.target.value)}
                error={allErrors.email}
            />

             {/* ADDED: Birthplace section */}
            <div className="col-span-1 md:col-span-2">
                <hr className="my-4" />
                <h4 className="text-lg font-bold mb-3 text-gray-900">Birthplace Address</h4>
            </div>

            <InputField
                id="birthplace_region"
                label="Birthplace Region"
                type="select"
                value={selectedBirthplaceCodes.region}
                onChange={e => handleBirthplaceAddressChange('region', e.target.value, birthplaceRegions)}
                error={allErrors.birthplace_region}
                options={birthplaceRegions.map(r => ({ 
                    value: r.code, 
                    label: `${r.name} (${REGION_MAP[r.code] || ''})` 
                }))}
            />

            <InputField
                id="birthplace_province"
                label="Birthplace Province"
                type="select"
                value={selectedBirthplaceCodes.province}
                onChange={e => handleBirthplaceAddressChange('province', e.target.value, birthplaceProvinces)}
                error={allErrors.birthplace_province}
                options={birthplaceProvinces.map(p => ({ value: p.code, label: p.name }))}
                disabled={!selectedBirthplaceCodes.region || birthplaceProvinces.length === 0}
            />

            <InputField
                id="birthplace_city_municipality"
                label="Birthplace City/Municipality"
                type="select"
                value={selectedBirthplaceCodes.city}
                onChange={e => handleBirthplaceAddressChange('city', e.target.value, birthplaceCities)}
                error={allErrors.birthplace_city_municipality}
                options={birthplaceCities.map(c => ({ value: c.code, label: c.name }))}
                disabled={!selectedBirthplaceCodes.province || birthplaceCities.length === 0}
            />
        </div>
    ), [data, allErrors, handleInputChange, nationalities, selectedBirthplaceCodes, birthplaceRegions, birthplaceProvinces, birthplaceCities, handleBirthplaceAddressChange]);

    const renderContactStep = useCallback(() => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <InputField
                id="region"
                label="Region"
                type="select"
                value={selectedCodes.region}
                onChange={e => handleAddressChange('region', e.target.value, regions)}
                error={allErrors.region}
                options={regions.map(r => ({ 
                    value: r.code, 
                    label: `${r.name} (${REGION_MAP[r.code] || ''})` 
                }))}
            />
            <InputField
                id="province"
                label="Province"
                type="select"
                value={selectedCodes.province}
                onChange={e => handleAddressChange('province', e.target.value, provinces)}
                error={allErrors.province}
                options={provinces.map(p => ({ value: p.code, label: p.name }))}
                disabled={!selectedCodes.region || provinces.length === 0}
            />
            <InputField
                id="city_municipality"
                label="City/Municipality"
                type="select"
                value={selectedCodes.city}
                onChange={e => handleAddressChange('city', e.target.value, cities)}
                error={allErrors.city_municipality}
                options={cities.map(c => ({ value: c.code, label: c.name }))}
                disabled={!selectedCodes.province || cities.length === 0}
            />
            <InputField
                id="barangay"
                label="Barangay"
                type="select"
                value={selectedCodes.barangay}
                onChange={e => handleAddressChange('barangay', e.target.value, barangays)}
                error={allErrors.barangay}
                options={barangays.map(b => ({ value: b.code, label: b.name }))}
                disabled={!selectedCodes.city || barangays.length === 0}
            />
            <InputField
                id="number_street"
                label="Number, Street"
                value={data.number_street}
                onChange={e => handleInputChange('number_street', e.target.value)}
                error={allErrors.number_street}
                placeholder="e.g., Block 123, Lot 45, Main St."
            />
            <InputField
                id="district"
                label="District"
                value={data.district}
                onChange={e => handleInputChange('district', e.target.value)}
                error={allErrors.district}
                placeholder="e.g., 2nd District"
            />

            <div className="mb-5">
                <label htmlFor="contact_no" className="block text-gray-900 text-sm font-semibold mb-2">
                    Contact No.
                </label>
                <input
                    ref={contactNoRef as React.Ref<HTMLInputElement>}
                    id="contact_no"
                    name="contact_no"
                    type="tel"
                    defaultValue={data.contact_no as string}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-htta-blue focus:border-htta-blue transition duration-300 ease-in-out text-gray-900 shadow-sm ${allErrors.contact_no ? 'border-red-500' : ''}`}
                    placeholder="+639XX-XXX-XXXX"
                />
                {allErrors.contact_no && <p className="text-red-500 text-xs italic mt-1">{allErrors.contact_no}</p>}
            </div>

            <InputField
                id="facebook_account"
                label="Facebook Account"
                value={data.facebook_account}
                onChange={e => handleInputChange('facebook_account', e.target.value)}
                error={allErrors.facebook_account}
                placeholder="e.g., John.Doe.FB"
            />
            <InputField
                id="parent_guardian_name"
                label="Parent/Guardian Name"
                value={data.parent_guardian_name}
                onChange={e => handleInputChange('parent_guardian_name', e.target.value)}
                error={allErrors.parent_guardian_name}
                placeholder="e.g., Jane Doe"
            />
            <InputField
                id="parent_guardian_mailing_address"
                label="Parent/Guardian Mailing Address"
                type="textarea"
                value={data.parent_guardian_mailing_address}
                onChange={e => handleInputChange('parent_guardian_mailing_address', e.target.value)}
                error={allErrors.parent_guardian_mailing_address}
                placeholder="e.g., Block 123, Lot 45, Main St., Poblacion, City of El Salvador, Misamis Oriental, Region X"
            />
        </div>
    ), [data, allErrors, selectedCodes, regions, provinces, cities, barangays, contactNoRef, handleInputChange, handleAddressChange]);

    const renderEducationStep = useCallback(() => (
        <div className="grid grid-cols-1 gap-4">
            <h4 className="text-lg font-bold mb-3 text-gray-900">Highest Educational Attainment</h4>
            {EDUCATIONAL_ATTAINMENT_LEVELS.map((option) => (
                <label
                    key={option.value}
                    htmlFor={`edu_${option.value}`}
                    className="flex items-center text-gray-900 p-3 border border-gray-200 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out cursor-pointer shadow-sm"
                >
                    <InputField
                        id={`edu_${option.value}`}
                        label=""
                        type="radio"
                        value={option.value}
                        onCheckboxChange={e => handleEducationalAttainmentChange(option.value as keyof FormData, e.target.checked)}
                        isChecked={data[option.value as keyof FormData] === true}
                        name="educational_attainment_level_group"
                    />
                    <span className="ml-2">{option.label}</span>
                </label>
            ))}
            {allErrors.educational_attainment_level && (
                <p className="text-red-500 text-xs italic mt-1">{allErrors.educational_attainment_level}</p>
            )}
        </div>
    ), [data, allErrors, handleEducationalAttainmentChange]);

    const renderClassificationStep = useCallback(() => (
        <div className="grid grid-cols-1 gap-8">
            <div>
                <h4 className="text-lg font-bold mb-3 text-gray-900">
                    Learner/Trainee/Student (Clients) Classification (Optional)
                </h4>
                <p className="text-sm text-gray-700 mb-4">
                    Select all that apply. You can leave this section blank if none apply.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CLASSIFICATION_OPTIONS.map(option => (
                        <label
                            key={option.id}
                            htmlFor={`classification_${option.id}`}
                            className="flex items-center text-gray-900 p-3 border border-gray-200 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out cursor-pointer shadow-sm"
                        >
                            <InputField
                                id={`classification_${option.id}`}
                                label=""
                                type="checkbox"
                                isChecked={data.classifications.includes(option.id)}
                                onCheckboxChange={() => handleCheckboxChange('classifications', option.id)}
                            />
                            <span className="ml-2">{option.type}</span>
                        </label>
                    ))}
                </div>
                {data.classifications.includes(24) && (
                    <InputField
                        id="other_classification_details"
                        label="Others (Please Specify)"
                        value={data.other_classification_details}
                        onChange={e => handleInputChange('other_classification_details', e.target.value)}
                        error={allErrors.other_classification_details}
                        className="mt-5"
                    />
                )}
                {allErrors.classifications && (
                    <p className="text-red-500 text-xs italic mt-1">{allErrors.classifications}</p>
                )}
            </div>

            <div className="mt-6">
                <h4 className="text-lg font-bold mb-3 text-gray-900">Type of Disability (Optional)</h4>
                <p className="text-sm text-gray-700 mb-4">
                    Select all that apply. You can leave this section blank if none apply.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {DISABILITY_TYPE_OPTIONS.map(option => (
                        <label
                            key={option.id}
                            htmlFor={`disability_${option.id}`}
                            className="flex items-center text-gray-900 p-3 border border-gray-200 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out cursor-pointer shadow-sm"
                        >
                            <InputField
                                id={`disability_${option.id}`}
                                label=""
                                type="checkbox"
                                isChecked={data.disability_types.includes(option.id)}
                                onCheckboxChange={() => handleCheckboxChange('disability_types', option.id)}
                            />
                            <span className="ml-2">{option.name}</span>
                        </label>
                    ))}
                </div>
                {allErrors.disability_types && (
                    <p className="text-red-500 text-xs italic mt-1">{allErrors.disability_types}</p>
                )}
            </div>

            {data.disability_types.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-lg font-bold mb-3 text-gray-900">
                        Causes of Disability (Optional, if disability selected)
                    </h4>
                    <InputField
                        id="cause_of_disability"
                        label="Cause of Disability"
                        value={data.cause_of_disability}
                        onChange={e => handleInputChange('cause_of_disability', e.target.value)}
                        error={allErrors.cause_of_disability}
                        placeholder="e.g., Congenital/Inborn, Illness, Injury"
                    />
                </div>
            )}
        </div>
    ), [data, allErrors, handleInputChange, handleCheckboxChange]);

    const renderCourseStep = useCallback(() => (
        <div className="grid grid-cols-1 gap-6">
            <InputField
                id="program_id"
                label="Name of Course/Qualification"
                type="select"
                value={data.program_id}
                onChange={e => handleInputChange('program_id', Number(e.target.value))}
                error={allErrors.program_id}
                options={programs.map(program => ({
                    value: program.id.toString(),
                    label: program.course_name,
                }))}
            />
            <InputField
                id="scholarship_package"
                label="If Scholar, What Type of Scholarship Package (TWSP, PESFA, STEP, others)?"
                value={data.scholarship_package}
                onChange={e => handleInputChange('scholarship_package', e.target.value)}
                error={allErrors.scholarship_package}
            />
        </div>
    ), [data, allErrors, programs, handleInputChange]);

    const renderConsentStep = useCallback(() => (
        <div className="grid grid-cols-1 gap-6">
            <div>
                <h4 className="text-lg font-bold mb-3 text-gray-900">Privacy Consent and Disclaimer</h4>
                <label
                    htmlFor="consent_given"
                    className="flex items-start text-gray-900 p-4 border border-gray-200 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out cursor-pointer shadow-sm"
                >
                    <InputField
                        id="consent_given"
                        label=""
                        type="checkbox"
                        isChecked={data.consent_given}
                        onCheckboxChange={e => handleInputChange('consent_given', e.target.checked)}
                        className="mt-1"
                    />
                    <span className="ml-3 text-sm leading-relaxed">
                        I hereby attest that I have read and understood the Privacy Notice of TESDA through its website (link here) and agree to the processing of my personal data for purposes indicated therein. I understand that this Learners Profile is for TESDA program monitoring which includes scholarships, employment, survey, and all other related TESDA programs that may be beneficial to my qualifications.
                    </span>
                </label>
                {allErrors.consent_given && (
                    <p className="text-red-500 text-xs italic mt-1">{allErrors.consent_given}</p>
                )}
            </div>

            <div className="mt-6">
                <h4 className="text-lg font-bold mb-3 text-gray-900">Applicant's Signature & Photo</h4>
                 <ImageUpload
                    id="picture_image"
                    label="Upload 1x1 Picture (taken within 6 months)"
                    onChange={file => handleFileChange('picture_image', { target: { files: file ? [file] : [] } } as any)}
                    error={allErrors.picture_image}
                    maxSize={2 * 1024 * 1024}
                    accept="image/jpeg,image/png,image/webp"
                />

                <ImageUpload
                    id="thumbmark_image"
                    label="Upload Right Thumbmark (Image)"
                    onChange={file => handleFileChange('thumbmark_image', { target: { files: file ? [file] : [] } } as any)}
                    error={allErrors.thumbmark_image}
                    maxSize={2 * 1024 * 1024}
                    accept="image/jpeg,image/png,image/webp"
                />
           
                <p className="text-sm text-gray-700 italic mt-2">
                    Note: The 'Printed Name' and 'Date Accomplished' will be automatically set in the system.
                </p>
            </div>
        </div>
    ), [data, allErrors, handleInputChange, handleFileChange]);

    const getSelectedEducationalAttainment = useCallback(() => {
        const selectedLevelOption = EDUCATIONAL_ATTAINMENT_LEVELS.find(
            levelOption => data[levelOption.value as keyof FormData] === true
        );
        return selectedLevelOption ? selectedLevelOption.label : 'None selected';
    }, [data]);

    const renderReviewStep = useCallback(() => (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-htta-blue mb-4 text-center">Review Your Information</h3>
            <p className="text-gray-700 text-center mb-6">
                Please review all the details carefully before submitting your registration.
            </p>

            {/* Personal Information */}
            <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                <h4 className="font-bold text-lg text-htta-blue mb-3">Personal Information</h4>
                <p className="text-gray-900 mb-1">
                    <strong>Name:</strong> {data.first_name} {data.middle_name} {data.last_name} {data.extension_name}
                </p>
                <p className="text-gray-900 mb-1"><strong>Gender:</strong> {data.gender}</p>
                <p className="text-gray-900 mb-1"><strong>Civil Status:</strong> {data.civil_status}</p>
                <p className="text-gray-900 mb-1"><strong>Birthdate:</strong> {data.birth_date}</p>
                <p className="text-gray-900 mb-1"><strong>Age:</strong> {data.age}</p>
                <p className="text-gray-900 mb-1">
                    <strong>Birthplace:</strong> {data.birthplace_city_municipality}, {data.birthplace_province}, {data.birthplace_region}
                </p>
                <p className="text-gray-900 mb-1"><strong>Nationality:</strong> {data.nationality}</p>
                <p className="text-gray-900"><strong>Email:</strong> {data.email}</p>
            </div>

            {/* Contact & Address */}
            <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                <h4 className="font-bold text-lg text-htta-blue mb-3">Contact & Address</h4>
                <p className="text-gray-900 mb-1">
                    <strong>Address:</strong> {data.number_street}, {data.barangay}, {data.city_municipality}, {data.district}, {data.province}, {data.region}
                </p>
                <p className="text-gray-900 mb-1"><strong>Contact No.:</strong> {data.contact_no}</p>
                <p className="text-gray-900 mb-1"><strong>Facebook:</strong> {data.facebook_account || 'N/A'}</p>
                <p className="text-gray-900">
                    <strong>Parent/Guardian:</strong> {data.parent_guardian_name || 'N/A'} ({data.parent_guardian_mailing_address || 'N/A'})
                </p>
            </div>

            {/* Educational Background */}
            <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                <h4 className="font-bold text-lg text-htta-blue mb-3">Educational Background</h4>
                <p className="text-gray-900">
                    <strong>Highest Attainment:</strong> {getSelectedEducationalAttainment()}
                </p>
            </div>

            {/* Classification & Disability */}
            <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                <h4 className="font-bold text-lg text-htta-blue mb-3">Classification & Disability</h4>
                <p className="text-gray-900 mb-1">
                    <strong>Classifications:</strong> {
                        data.classifications.length > 0
                            ? data.classifications.map(id => CLASSIFICATION_OPTIONS.find(opt => opt.id === id)?.type).filter(Boolean).join(', ')
                            : 'None selected'
                    }
                </p>
                {data.classifications.includes(24) && (
                    <p className="text-gray-900 mb-1">
                        <strong>Other Classification Details:</strong> {data.other_classification_details}
                    </p>
                )}
                <p className="text-gray-900 mb-1">
                    <strong>Disabilities:</strong> {
                        data.disability_types.length > 0
                            ? data.disability_types.map(id => DISABILITY_TYPE_OPTIONS.find(opt => opt.id === id)?.name).filter(Boolean).join(', ')
                            : 'None selected'
                    }
                </p>
                {data.disability_types.length > 0 && (
                    <p className="text-gray-900">
                        <strong>Cause of Disability:</strong> {data.cause_of_disability}
                    </p>
                )}
            </div>

            {/* Course & Scholarship */}
            <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                <h4 className="font-bold text-lg text-htta-blue mb-3">Course & Scholarship</h4>
                <p className="text-gray-900 mb-1">
                    <strong>Course/Qualification:</strong> {programs.find(p => p.id === data.program_id)?.course_name || 'N/A'}
                </p>
                <p className="text-gray-900">
                    <strong>Scholarship Package:</strong> {data.scholarship_package || 'N/A'}
                </p>
            </div>

            {/* Consent & Uploads */}
            <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                <h4 className="font-bold text-lg text-htta-blue mb-3">Consent & Uploads</h4>
                <p className="text-gray-900 mb-1">
                    <strong>Privacy Consent:</strong> {data.consent_given ? 'Agreed' : 'Not Agreed'}
                </p>
                <p className="text-gray-900 mb-1">
                    <strong>Thumbmark Image:</strong> {data.thumbmark_image ? 'Uploaded' : 'Not Uploaded'}
                </p>
                <p className="text-gray-900">
                    <strong>Picture Image:</strong> {data.picture_image ? 'Uploaded' : 'Not Uploaded'}
                </p>
            </div>
        </div>
    ), [data, programs, getSelectedEducationalAttainment]);

    const renderStepContent = useCallback(() => {
        switch (currentStep) {
            case 0: return renderPersonalStep();
            case 1: return renderContactStep();
            case 2: return renderEducationStep();
            case 3: return renderClassificationStep();
            case 4: return renderCourseStep();
            case 5: return renderConsentStep();
            case 6: return renderReviewStep();
            default: return null;
        }
    }, [currentStep, renderPersonalStep, renderContactStep, renderEducationStep, renderClassificationStep, renderCourseStep, renderConsentStep, renderReviewStep]);

    // ===================== MAIN RENDER =====================

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-dark p-6 sm:p-10 rounded-xl shadow-2xl max-w-4xl mx-auto my-8 font-inter">
            {/* Progress Indicator */}
            <div className="mb-8 overflow-x-auto pb-3">
                <div className="flex justify-between items-center relative min-w-max">
                    {STEPS.map((step, index) => (
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
                            {index < STEPS.length - 1 && (
                                <div className={`flex-auto border-t-2 transition-all duration-300 ease-in-out
                                        ${index < currentStep ? 'border-htta-green' : 'border-gray-300'}`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Section Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-htta-blue mb-6 text-center border-b-2 border-htta-gold pb-4">
                {STEPS[currentStep]}
            </h2>

            {/* Display general errors at the top of the form */}
            {hasErrors && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-4 rounded-lg relative mb-6 shadow-md">
                    <strong className="font-bold">Please correct the following errors:</strong>
                    <ul className="mt-3 list-disc list-inside">
                        {Object.values(allErrors).map((error: string, index: number) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}


            {/* Render Current Step Content or Skeleton Loader */}
            <div className="p-5 sm:p-8 border border-gray-200 rounded-xl bg-white shadow-inner min-h-[400px]">
                {isLoading ? <SkeletonLoader /> : renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 0 || processing || isLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-3 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform active:scale-95 shadow-lg"
                >
                    Previous
                </button>

                <div className="flex items-center text-sm text-gray-600">
                    Step {currentStep + 1} of {STEPS.length}
                </div>

                {currentStep < STEPS.length - 1 ? (
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={processing || isLoading}
                        className="w-full sm:w-auto px-6 py-3 bg-htta-blue text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-htta-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform active:scale-95 shadow-lg"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </div>
                        ) : (
                            'Next'
                        )}
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={processing || isLoading || hasErrors}
                        className="w-full sm:w-auto px-8 py-3 bg-htta-green text-white font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-3 focus:ring-htta-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform active:scale-95 shadow-lg text-lg"
                    >
                        {processing || isLoading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </div>
                        ) : (
                            '✓ Submit Registration'
                        )}
                    </button>
                )}
            </div>

            {/* Form Progress Bar */}
            <div className="mt-6">
                <div className="bg-gray-200 rounded-full h-2 shadow-inner">
                    <div
                        className="bg-gradient-to-r from-htta-blue to-htta-green h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
                        style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    />
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                    {Math.round(((currentStep + 1) / STEPS.length) * 100)}% Complete
                </p>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 border-l-4 border-htta-blue p-4 rounded-r-lg shadow-sm">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-htta-blue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <strong>Need Help?</strong> All fields marked as required must be filled out before proceeding to the next step. 
                            You can navigate back to previous steps to review or modify your information.
                        </p>
                    </div>
                </div>
            </div>

            {/* Privacy Notice */}
            {currentStep === STEPS.length - 1 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Final Review
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                    Please carefully review all your information before submitting. 
                                    Once submitted, your application will be reviewed by administrators and 
                                    you may not be able to modify certain details.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
};

export default RegistrationForm;
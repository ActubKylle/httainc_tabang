import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';

// Icon components (using inline SVGs for compatibility)
const MapPinIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const EnvelopeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BuildingOfficeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l.75 18H3.75L4.5 3zM9 9h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15" />
  </svg>
);

const PaperAirplaneIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }
        
        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        
        // Simulate form submission
        console.log('Form submitted:', formData);
        setShowSuccess(true);
        setFormData({
            fullName: '',
            email: '',
            subject: '',
            message: ''
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => setShowSuccess(false), 5000);
    };

    return (
        <PublicLayout>
            <Head title="Contact Us - Highlands Technical Training Academy" />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 py-20">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6">
                        <EnvelopeIcon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Get in Touch with HTTA
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Have questions? We're here to help.
                    </p>
                </div>
            </div>

            {/* Contact Info + Form Section */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                {/* Success Message */}
                {showSuccess && (
                    <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-emerald-800">
                                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left Column - Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
                        </div>

                        {/* School Name */}
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <BuildingOfficeIcon className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">School Name</h3>
                                <p className="text-gray-600">Highlands Technical Training Academy</p>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <MapPinIcon className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Address</h3>
                                <p className="text-gray-600">Poblacion, Opol, Misamis Oriental, Philippines</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <EnvelopeIcon className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                                <a href="mailto:info@htta.edu.ph" className="text-emerald-600 hover:text-emerald-700 transition-colors">
                                    info@htta.edu.ph
                                </a>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <PhoneIcon className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone</h3>
                                <p className="text-gray-600">0961-234-5678</p>
                                <p className="text-sm text-gray-500">(Viber available)</p>
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <ClockIcon className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Office Hours</h3>
                                <p className="text-gray-600">Monday - Friday</p>
                                <p className="text-gray-600">8:00 AM to 5:00 PM</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                        
                        <div className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-semibold mb-2 text-gray-700">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-lg p-3 border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                        errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-emerald-500'
                                    }`}
                                    placeholder="Enter your full name"
                                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                                />
                                {errors.fullName && (
                                    <p id="fullName-error" className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                                )}
                            </div>

                            {/* Email Address */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-lg p-3 border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-emerald-500'
                                    }`}
                                    placeholder="Enter your email address"
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                />
                                {errors.email && (
                                    <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Subject */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold mb-2 text-gray-700">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    placeholder="Enter the subject (optional)"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold mb-2 text-gray-700">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className={`w-full rounded-lg p-3 border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y ${
                                        errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-emerald-500'
                                    }`}
                                    placeholder="Enter your message"
                                    aria-describedby={errors.message ? 'message-error' : undefined}
                                />
                                {errors.message && (
                                    <p id="message-error" className="mt-1 text-sm text-red-600">{errors.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-8 rounded-full hover:scale-105 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg flex items-center justify-center space-x-2"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                    <span>Send Message</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Google Map Section */}
            <div className="max-w-6xl mx-auto px-6 pb-20">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us on the Map</h2>
                    <p className="text-gray-600">Visit our campus located in the heart of Opol, Misamis Oriental</p>
                </div>
                
                <div className="w-full rounded-xl shadow-lg border-2 border-emerald-400 overflow-hidden">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62843.19565792923!2d124.5198855232564!3d8.514755011168667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32ff78c05b470933%3A0x57f01aefdf9985b2!2sOpol%2C%20Misamis%20Oriental!5e0!3m2!1sen!2sph!4v1721447635443!5m2!1sen!2sph" 
                        width="100%" 
                        height="450" 
                        allowFullScreen="" 
                        loading="lazy" 
                        className="w-full"
                        title="Highlands Technical Training Academy Location"
                    />
                </div>
            </div>
        </PublicLayout>
    );
};

export default Contact;
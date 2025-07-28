import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import RegistrationForm from '@/Components/RegistrationForm';
import PublicLayout from '@/Layouts/PublicLayout';
import { PageProps } from '@/types';

// Reusable Button Classes
const buttonClasses = {
    primary: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 px-12 rounded-full text-xl hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 ease-in-out shadow-xl hover:shadow-2xl flex items-center justify-center group",
    secondary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg",
    tertiary: "bg-gray-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-gray-600 transition-all duration-300 shadow-md flex items-center justify-center"
};

// Reusable Section Classes
const sectionClasses = {
    section: "mt-16 p-10 md:p-16 rounded-2xl shadow-2xl",
    sectionTitle: "text-4xl lg:text-5xl font-extrabold text-center mb-6",
    sectionSubtitle: "text-xl text-center max-w-3xl mx-auto mb-12 leading-relaxed"
};

// Reusable Component Classes
const componentClasses = {
    programCard: "group relative p-8 rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br",
    badge: "absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse",
    emoji: "text-6xl mb-6",
    quote: "text-2xl font-light italic text-center max-w-4xl mx-auto mb-8 leading-relaxed",
    author: "text-lg font-semibold text-center",
    flashMessage: "border-l-4 px-6 py-4 rounded-r-lg relative mb-6 shadow-md",
    trustIndicator: "flex items-center text-gray-600",
    featureList: "space-y-2 text-gray-600"
};

const Home: React.FC = () => {
    const { flash = {}, errors } = usePage<PageProps>().props;
    const [showEnrollmentForm, setShowEnrollmentForm] = useState<boolean>(false);

    return (
        <PublicLayout>
            <Head title="No Tuition. No Catch. - Free TESDA Training at HTTA" />

            {/* Logo - Top Left */}
            <div className="absolute top-4 left-4 z-20">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                    <div className="text-2xl font-bold text-emerald-600">HTTA</div>
                </div>
            </div>

            {/* Flash Messages */}
            {flash.success && (
                <div className={`${componentClasses.flashMessage} bg-emerald-50 border-emerald-500 text-emerald-700 animate-pulse`} role="alert">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <strong className="font-bold">Success!</strong>
                        <span className="ml-2">{flash.success}</span>
                    </div>
                </div>
            )}

            {flash.error && (
                <div className={`${componentClasses.flashMessage} bg-red-50 border-red-500 text-red-700`} role="alert">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <strong className="font-bold">Error!</strong>
                        <span className="ml-2">{flash.error}</span>
                    </div>
                </div>
            )}

            {Object.keys(errors).length > 0 && (
                <div className={`${componentClasses.flashMessage} bg-red-50 border-red-500 text-red-700`} role="alert">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <strong className="font-bold">Validation Errors:</strong>
                            <ul className="mt-2 list-disc list-inside">
                                {Object.values(errors).map((error: string, index: number) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {!showEnrollmentForm ? (
                <>
                    {/* Hero Section */}
                    <section className={`${sectionClasses.section} relative bg-gradient-to-br from-emerald-50 via-blue-50 to-yellow-50 border-b-8 border-emerald-500 animate-fade-in overflow-hidden min-h-screen flex items-center`}>
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-200 rounded-full opacity-20 -translate-x-32 -translate-y-32 animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 translate-x-48 translate-y-48"></div>
                        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-yellow-200 rounded-full opacity-30 animate-bounce slow"></div>

                        <div className="relative z-10 text-center w-full">
                            {/* Animated Badge */}
                            <div className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg mb-8 animate-bounce">
                                <span className="text-2xl mr-2">🎓</span>
                                100% FREE TESDA TRAINING
                            </div>

                            {/* Main Headlines */}
                            <h1 className="text-6xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-700 bg-clip-text text-transparent leading-tight tracking-tight">
                                No Tuition.<br />
                                <span className="text-yellow-600">No Catch.</span>
                            </h1>

                            <p className={`${sectionClasses.sectionSubtitle} text-gray-700 max-w-4xl leading-relaxed`}>
                                Highlands Technical Training Academy offers <strong className="text-emerald-600">completely FREE</strong> TESDA-accredited culinary programs. 
                                Build your career in the culinary arts with professional training that costs you nothing but your dedication.
                            </p>

                            {/* Primary CTA */}
                            <button
                                onClick={() => setShowEnrollmentForm(true)}
                                className={buttonClasses.primary}
                            >
                                <svg className="w-8 h-8 mr-3 group-hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Enroll Now
                            </button>

                            {/* Trust Warning */}
                            <div className="mt-8 inline-flex items-center bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-full animate-pulse">
                                <span className="text-xl mr-2">🚨</span>
                                <strong>Limited slots available this batch!</strong>
                            </div>

                            {/* Trust Indicators */}
                            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-600">
                                <div className={componentClasses.trustIndicator}>
                                    <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    No Hidden Fees
                                </div>
                                <div className={componentClasses.trustIndicator}>
                                    <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    TESDA Certified
                                </div>
                                <div className={componentClasses.trustIndicator}>
                                    <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Job Ready Skills
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Programs Section */}
                    <section className={`${sectionClasses.section} bg-white border-t-8 border-emerald-500`}>
                        <div className="text-center mb-12">
                            <h2 className={`${sectionClasses.sectionTitle} text-gray-800`}>
                                Our <span className="text-emerald-600">FREE</span> Programs
                            </h2>
                            <p className={`${sectionClasses.sectionSubtitle} text-gray-600`}>
                                Choose from our TESDA-accredited culinary programs - all completely free of charge
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {/* Commercial Cooking Card */}
                            <div className={`${componentClasses.programCard} from-orange-50 to-red-50 border-orange-200`}>
                                <div className={componentClasses.badge}>
                                    FREE
                                </div>
                                <div className={`${componentClasses.emoji} text-orange-500`}>🍳</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Commercial Cooking NC II</h3>
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    Master the art of professional cooking with hands-on training in commercial kitchens. 
                                    Learn food preparation, cooking techniques, and kitchen management.
                                </p>
                                <ul className={componentClasses.featureList}>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        TESDA NC II Certificate
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Hands-on Kitchen Training
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Industry-Standard Equipment
                                    </li>
                                </ul>
                            </div>

                            {/* Bread & Pastry Card */}
                            <div className={`${componentClasses.programCard} from-yellow-50 to-orange-50 border-yellow-200`}>
                                <div className={componentClasses.badge}>
                                    FREE
                                </div>
                                <div className={`${componentClasses.emoji} text-yellow-500`}>🥖</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Bread & Pastry Production NC II</h3>
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    Learn the art of baking and pastry creation. From artisan breads to elegant desserts, 
                                    master the skills needed for professional baking careers.
                                </p>
                                <ul className={componentClasses.featureList}>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        TESDA NC II Certificate
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Professional Baking Techniques
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Pastry Arts & Decoration
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Testimonials Section */}
                    <section className={`${sectionClasses.section} bg-gradient-to-br from-gray-50 to-blue-50 border-l-8 border-blue-500`}>
                        <div className="text-center">
                            <h2 className={`${sectionClasses.sectionTitle} text-gray-800 mb-12`}>
                                What Our <span className="text-blue-600">Graduates</span> Say
                            </h2>
                            
                            <div className="max-w-4xl mx-auto">
                                <blockquote className={`${componentClasses.quote} text-gray-700`}>
                                    "HTTA transformed my life completely. The free training gave me skills I never thought I could afford to learn. Now I'm working as a head chef at a 5-star hotel!"
                                </blockquote>
                                <div className={componentClasses.author}>
                                    <div className="text-emerald-600">Maria Santos</div>
                                    <div className="text-gray-500 text-base mt-1">Commercial Cooking NC II Graduate, 2023</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Value Proposition */}
                    <section className={`${sectionClasses.section} bg-gradient-to-r from-emerald-500 to-blue-600 text-white`}>
                        <div className="text-center mb-12">
                            <h2 className={`${sectionClasses.sectionTitle}`}>
                                Why Choose HTTA?
                            </h2>
                            <p className={`${sectionClasses.sectionSubtitle} opacity-90`}>
                                We're committed to making quality culinary education accessible to everyone
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm hover:bg-opacity-20 transition-all duration-300">
                                <div className="text-5xl mb-4">🏆</div>
                                <h3 className="text-2xl font-bold mb-4 text-black">TESDA Accredited</h3>
                                <p className="opacity-90 text-black">Government-recognized certification that employers trust and value nationwide.</p>
                            </div>
                            <div className="text-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm hover:bg-opacity-20 transition-all duration-300">
                                <div className="text-5xl mb-4">👨‍🍳</div>
                                <h3 className="text-2xl font-bold mb-4 text-black" >Expert Instructors</h3>
                                <p className="opacity-90t text-black">Learn from industry professionals with years of commercial kitchen experience.</p>
                            </div>
                            <div className="text-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm hover:bg-opacity-20 transition-all duration-300">
                                <div className="text-5xl mb-4">🌍</div>
                                <h3 className="text-2xl font-bold mb-4 text-black">Global Opportunities</h3>
                                <p className="opacity-90 text-black">Open doors to local and international career opportunities in the culinary industry.</p>
                            </div>
                        </div>
                    </section>

                    {/* Final CTA Section */}
                    <section className={`${sectionClasses.section} text-center bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 border-t-8`}>
                        <h2 className={`${sectionClasses.sectionTitle} text-gray-800`}>
                            Ready to Start Your <span className="text-emerald-600">FREE</span> Culinary Journey?
                        </h2>
                        <p className={`${sectionClasses.sectionSubtitle} text-gray-700 mb-8`}>
                            Don't let cost be a barrier to your dreams. Our programs are completely free - 
                            you just need to bring your passion for cooking!
                        </p>
                        <button
                            onClick={() => setShowEnrollmentForm(true)}
                            className={buttonClasses.secondary}
                        >
                            Begin Free Registration
                        </button>
                    </section>
                </>
            ) : (
                /* Enrollment Form Section */
                <section className={`${sectionClasses.section} bg-gradient-to-br from-emerald-50 to-blue-50 border-b-8 border-emerald-500 animate-fade-in`}>
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg mb-4">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            FREE Registration
                        </div>
                        <h2 className={`${sectionClasses.sectionTitle} text-gray-800`}>
                            TESDA Learner Registration Form
                        </h2>
                        <p className={`${sectionClasses.sectionSubtitle} text-gray-600`}>
                            Complete your registration for our FREE culinary training programs
                        </p>
                    </div>
                    
                    <RegistrationForm />
                    
                    <div className="text-center mt-8">
                        <button
                            onClick={() => setShowEnrollmentForm(false)}
                            className={buttonClasses.tertiary}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back to Home
                        </button>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
};

export default Home;
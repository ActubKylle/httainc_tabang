import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';

const Programs: React.FC = () => {
    return (
        <PublicLayout>
            <Head title="FREE TESDA Programs - Highlands Technical Training Academy" />
            
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-emerald-50 via-blue-50 to-yellow-50 p-10 md:p-16 rounded-2xl shadow-2xl border-b-8 border-emerald-500 mb-16 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-200 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-200 rounded-full opacity-20 translate-x-24 translate-y-24"></div>
                
                <div className="relative z-10 text-center">
                    {/* FREE Badge */}
                    <div className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg mb-6 animate-pulse">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                        100% FREE Training Programs
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-700 bg-clip-text text-transparent leading-tight">
                        TESDA Culinary Programs
                    </h1>
                    
                    <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed">
                        Launch your culinary career with our <strong className="text-emerald-600">completely FREE</strong> TESDA-accredited programs. 
                        No tuition fees, no hidden costs - just professional training that opens doors to exciting career opportunities.
                    </p>

                    <div className="flex flex-wrap justify-center items-center gap-6 text-gray-600">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Government Accredited
                        </div>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Industry-Standard Training
                        </div>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Career Ready Skills
                        </div>
                    </div>
                </div>
            </section>

            {/* Programs Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Commercial Cooking NC II */}
                <div className="group relative bg-gradient-to-br from-orange-50 to-red-50 p-10 rounded-2xl shadow-2xl border-2 border-orange-200 transition-all duration-300 hover:shadow-3xl hover:-translate-y-3 overflow-hidden">
                    <div className="absolute top-6 right-6 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        100% FREE
                    </div>
                    
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-200 rounded-full opacity-20"></div>
                    
                    <div className="relative z-10">
                        <div className="text-7xl mb-6 text-orange-500">🍳</div>
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800 mb-6">
                            Commercial Cooking NC II
                        </h2>
                        
                        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                            Master the art of professional cooking with comprehensive training in commercial kitchen operations. 
                            Learn advanced culinary techniques, food safety, and kitchen management from industry experts.
                        </p>

                        {/* Course Highlights */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">What You'll Learn:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">Food preparation and cooking techniques</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">Kitchen safety and sanitation protocols</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">Commercial equipment operation</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">Menu planning and costing</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">Professional kitchen management</span>
                                </li>
                            </ul>
                        </div>

                        {/* Career Opportunities */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Career Opportunities:</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white bg-opacity-50 px-3 py-2 rounded-lg text-center text-sm font-medium text-gray-700">
                                    Line Cook
                                </div>
                                <div className="bg-white bg-opacity-50 px-3 py-2 rounded-lg text-center text-sm font-medium text-gray-700">
                                    Prep Cook
                                </div>
                                <div className="bg-white bg-opacity-50 px-3 py-2 rounded-lg text-center text-sm font-medium text-gray-700">
                                    Sous Chef
                                </div>
                                <div className="bg-white bg-opacity-50 px-3 py-2 rounded-lg text-center text-sm font-medium text-gray-700">
                                    Kitchen Manager
                                </div>
                            </div>
                        </div>

                        {/* Program Details */}
                        <div className="bg-white bg-opacity-60 p-6 rounded-xl mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong className="text-gray-800">Duration:</strong>
                                    <span className="text-gray-600 ml-2">320 hours</span>
                                </div>
                                <div>
                                    <strong className="text-gray-800">Schedule:</strong>
                                    <span className="text-gray-600 ml-2">Flexible</span>
                                </div>
                                <div>
                                    <strong className="text-gray-800">Certification:</strong>
                                    <span className="text-gray-600 ml-2">TESDA NC II</span>
                                </div>
                                <div>
                                    <strong className="text-gray-800">Cost:</strong>
                                    <span className="text-emerald-600 ml-2 font-bold">FREE</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-6 rounded-full text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition duration-300 shadow-lg">
                            Apply for Commercial Cooking
                        </button>
                    </div>
                </div>

                {/* Bread & Pastry Production NC II */}
                <div className="group relative bg-gradient-to-br from-yellow-50 to-orange-50 p-10 rounded-2xl shadow-2xl border-2 border-yellow-200 transition-all duration-300 hover:shadow-3xl hover:-translate-y-3 overflow-hidden">
                    <div className="absolute top-6 right-6 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        100% FREE
                    </div>
                    
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20"></div>
                    
                    <div className="relative z-10">
                        <div className="text-7xl mb-6 text-yellow-500">🥖</div>
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800 mb-6">
                            Bread & Pastry Production NC II
                        </h2>
                        
                        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                            Master the art of professional baking and pastry creation. Learn traditional and modern techniques 
                            for producing high-quality breads, pastries, and desserts that meet industry standards.
                        </p>

                        {/* Course Highlights */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">What You'll Learn:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">Bread making and fermentation techniques</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">Pastry and dessert preparation</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">Cake decoration and finishing</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">Baking equipment and tools mastery</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">Food safety in baking operations</span>
                                </li>
                            </ul>
                        </div>

                        {/* Career Opportunities */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Career Opportunities:</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white bg-opacity-50 px-3 py-2 rounded-lg text-center text-sm font-medium text-gray-700">
                                    Baker
                                </div>
                                <div className="bg-white bg-opacity-50 px-3 py-2 rounded-lg text-center text-sm font-medium text-gray-700">
                                    Pastry Chef
                                </div>
                                <div className="bg-white bg-opacity-50 px-3 py-2 rounded-lg text-center text-sm font-medium text-gray-700">
                                    Cake Designer
                                </div>
                                <div className="bg-white bg-opacity-50 px-3 py-2 rounded-lg text-center text-sm font-medium text-gray-700">
                                    Bakery Owner
                                </div>
                            </div>
                        </div>

                        {/* Program Details */}
                        <div className="bg-white bg-opacity-60 p-6 rounded-xl mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong className="text-gray-800">Duration:</strong>
                                    <span className="text-gray-600 ml-2">320 hours</span>
                                </div>
                                <div>
                                    <strong className="text-gray-800">Schedule:</strong>
                                    <span className="text-gray-600 ml-2">Flexible</span>
                                </div>
                                <div>
                                    <strong className="text-gray-800">Certification:</strong>
                                    <span className="text-gray-600 ml-2">TESDA NC II</span>
                                </div>
                                <div>
                                    <strong className="text-gray-800">Cost:</strong>
                                    <span className="text-emerald-600 ml-2 font-bold">FREE</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 px-6 rounded-full text-lg hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition duration-300 shadow-lg">
                            Apply for Bread & Pastry
                        </button>
                    </div>
                </div>
            </section>

            {/* Why Choose Our Programs */}
            <section className="bg-gradient-to-r from-emerald-500 to-blue-600 p-10 md:p-16 rounded-2xl shadow-2xl text-white mb-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl lg:text-5xl font-extrabold mb-4">
                        Why Our Programs Are Different
                    </h2>
                    <p className="text-xl opacity-90 max-w-3xl mx-auto">
                        We believe in removing barriers to quality education. That's why everything is FREE.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                        <div className="text-5xl mb-4">💰</div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">No Tuition Fees</h3>
                        <p className="opacity-90 text-sm text-gray-900">Complete training without any financial burden</p>
                    </div>
                    <div className="text-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                        <div className="text-5xl mb-4">📚</div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">Free Materials</h3>
                        <p className="opacity-90 text-sm text-gray-900">All learning materials and resources provided</p>
                    </div>
                    <div className="text-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                        <div className="text-5xl mb-4">🏆</div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">Official Certification</h3>
                        <p className="opacity-90 text-sm text-gray-900">Receive recognized TESDA NC II certificates</p>
                    </div>
                    <div className="text-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                        <div className="text-5xl mb-4">🎯</div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">Job Placement</h3>
                        <p className="opacity-90 text-sm text-gray-900">Career guidance and job placement assistance</p>
                    </div>
                </div>
            </section>

            {/* Requirements Section */}
            <section className="bg-white p-10 md:p-16 rounded-2xl shadow-2xl border-t-8 border-emerald-500 mb-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-800 mb-4">
                        Admission Requirements
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Simple requirements to get started on your FREE culinary training journey
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Basic Requirements:</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <svg className="w-6 h-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">At least 18 years old</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-6 h-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">High school graduate or equivalent</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-6 h-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">Physically and mentally capable</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-6 h-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">Passion for culinary arts</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Required Documents:</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <svg className="w-6 h-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">Birth certificate (photocopy)</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-6 h-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">High school diploma/transcript</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-6 h-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">Valid ID (photocopy)</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-6 h-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">2x2 ID photos (4 pieces)</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 p-10 md:p-16 rounded-2xl shadow-2xl border-2 border-yellow-200">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-800 mb-6">
                    Ready to Start Your <span className="text-emerald-600">FREE</span> Training?
                </h2>
                <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                    Don't let cost stand in your way. Join thousands of successful graduates who started their culinary careers 
                    with our FREE TESDA programs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 px-8 rounded-full text-lg hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition duration-300 shadow-lg">
                        Apply Now - It's FREE!
                    </button>
                    <button className="bg-white text-emerald-600 font-bold py-4 px-8 rounded-full text-lg border-2 border-emerald-500 hover:bg-emerald-50 transition duration-300 shadow-lg">
                        Download Brochure
                    </button>
                </div>
            </section>
        </PublicLayout>
    );
};

export default Programs;
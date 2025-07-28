import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';

const About: React.FC = () => {
    // Reusable classes based on your design system
    const sectionClasses = "py-16 px-6";
    const containerClasses = "max-w-5xl mx-auto";
    const buttonClasses = "bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg";
    const cardClasses = "bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105";
    
    const stats = [
        { number: "1,000+", label: "Students Trained", icon: "🎓" },
        { number: "90%", label: "Employment Rate", icon: "💼" },
        { number: "100%", label: "FREE Tuition", icon: "💝" },
        { number: "5", label: "Years Excellence", icon: "⭐" }
    ];

    const coreValues = [
        {
            emoji: "🎓",
            title: "Education for All",
            description: "Breaking financial barriers to provide world-class culinary education accessible to every Filipino, regardless of economic background."
        },
        {
            emoji: "💡",
            title: "Skill Empowerment",
            description: "Developing practical, industry-ready skills that transform lives and create sustainable career opportunities in hospitality."
        },
        {
            emoji: "🌍",
            title: "Global Opportunities",
            description: "Preparing our graduates for international culinary careers with globally recognized certifications and training standards."
        },
        {
            emoji: "🤝",
            title: "Community Impact",
            description: "Building stronger communities by empowering individuals with skills that create jobs and foster entrepreneurship."
        }
    ];

    const trainers = [
        {
            name: "Chef Maria Santos",
            role: "Head Chef Instructor",
            bio: "15+ years experience in 5-star hotels across Asia. Specialized in Asian fusion and pastry arts.",
            image: "/api/placeholder/300/300"
        },
        {
            name: "Chef Roberto Cruz",
            role: "Culinary Arts Director",
            bio: "Former executive chef at international restaurants. Expert in European cuisine and kitchen management.",
            image: "/api/placeholder/300/300"
        },
        {
            name: "Chef Ana Reyes",
            role: "Baking & Pastry Specialist",
            bio: "Award-winning pastry chef with expertise in artisan breads and modern dessert techniques.",
            image: "/api/placeholder/300/300"
        }
    ];

    const milestones = [
        { year: "2019", event: "HTTA Founded", description: "Established with a vision to provide free culinary education" },
        { year: "2021", event: "TESDA Accreditation", description: "Officially recognized and accredited by TESDA" },
        { year: "2022", event: "First Graduation", description: "100 proud graduates with 95% employment rate" },
        { year: "2023", event: "Industry Partnerships", description: "Partnerships with 50+ restaurants and hotels" },
        { year: "2024", event: "1000+ Alumni", description: "Reached milestone of training over 1,000 students" }
    ];

    return (
        <PublicLayout>
            <Head title="About Us - Highlands Technical Training Academy" />
            
            {/* Hero Section with Emotional Hook */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-blue-50 to-yellow-50">
                {/* Floating Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">📚</div>
                    <div className="absolute top-40 right-20 text-5xl opacity-15 animate-pulse">🍳</div>
                    <div className="absolute bottom-32 left-20 text-4xl opacity-20 animate-bounce delay-1000">👨‍🍳</div>
                    <div className="absolute top-60 left-1/3 text-3xl opacity-10 animate-pulse delay-500">🥘</div>
                    <div className="absolute bottom-20 right-10 text-5xl opacity-15 animate-bounce delay-700">🎓</div>
                </div>
                
                <div className={`${containerClasses} text-center relative z-10`}>
                    {/* Breadcrumb */}
                    <nav className="mb-8">
                        <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                            Home
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="text-gray-600">About Us</span>
                    </nav>
                    
                    {/* TESDA Badge */}
                    <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-pulse">
                        ⭐ TESDA Recognized Since 2021
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                        Empowering Dreams Through
                        <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent block">
                            Free Education
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-12">
                        At Highlands Technical Training Academy, we believe that financial constraints should never 
                        limit your culinary dreams. We're breaking barriers and building futures, one student at a time.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/programs" className={buttonClasses}>
                            Explore Our Programs
                        </Link>
                        <Link href="/contact" className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className={`${sectionClasses} bg-white`}>
                <div className={containerClasses}>
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center mb-4">
                                    <span className="text-4xl mr-4">🎯</span>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Mission</h2>
                                </div>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    To provide world-class, accessible culinary education that empowers individuals 
                                    from all backgrounds to pursue successful careers in the hospitality industry, 
                                    fostering economic growth and social mobility in our communities.
                                </p>
                            </div>
                        </div>
                        
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center mb-4">
                                    <span className="text-4xl mr-4">👁</span>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Vision</h2>
                                </div>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    To be the Philippines' leading institution for free culinary education, 
                                    recognized globally for producing skilled, confident, and innovative culinary 
                                    professionals who drive positive change in their communities.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className={`${sectionClasses} bg-gray-50`}>
                <div className={containerClasses}>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Core Values</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            The principles that guide everything we do in our mission to transform lives through education
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {coreValues.map((value, index) => (
                            <div key={index} className={cardClasses}>
                                <div className="text-4xl mb-4 text-center">{value.emoji}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{value.title}</h3>
                                <p className="text-gray-700 leading-relaxed text-center">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Statistics Section */}
            <section className={`${sectionClasses} bg-gradient-to-r from-emerald-600 to-blue-600 text-white`}>
                <div className={containerClasses}>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Impact</h2>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Real numbers that represent real lives transformed through education and opportunity
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center bg-white/10 rounded-xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                                <div className="text-4xl mb-4">{stat.icon}</div>
                                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                                <div className="text-lg font-medium opacity-90">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trainers/Team Section */}
            <section className={`${sectionClasses} bg-white`}>
                <div className={containerClasses}>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Meet Our Expert Trainers</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Learn from industry professionals with decades of experience in world-class kitchens
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {trainers.map((trainer, index) => (
                            <div key={index} className={cardClasses}>
                                <div className="text-center">
                                    <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center text-4xl">
                                        👨‍🍳
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{trainer.name}</h3>
                                    <p className="text-emerald-600 font-semibold mb-4">{trainer.role}</p>
                                    <p className="text-gray-700 leading-relaxed">{trainer.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline/Milestones Section */}
            <section className={`${sectionClasses} bg-gray-50`}>
                <div className={containerClasses}>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Journey</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Key milestones that shaped our commitment to excellence in culinary education
                        </p>
                    </div>
                    
                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-emerald-600 hidden lg:block"></div>
                        
                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                                    <div className="flex-1 lg:pr-8">
                                        <div className={`${cardClasses} ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                                            <div className="text-2xl font-bold text-emerald-600 mb-2">{milestone.year}</div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.event}</h3>
                                            <p className="text-gray-700">{milestone.description}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-emerald-600 rounded-full border-4 border-white shadow-lg hidden lg:block"></div>
                                    
                                    <div className="flex-1 lg:pl-8"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className={`${sectionClasses} bg-gradient-to-r from-yellow-400 to-emerald-500 text-white`}>
                <div className={`${containerClasses} text-center`}>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Start Your Culinary Journey?
                    </h2>
                    <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                        Join thousands of successful graduates who started their careers with us. 
                        Your future in the culinary arts begins with a single step.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/programs" className="bg-white text-emerald-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg">
                            View Free Programs
                        </Link>
                        <Link href="/enroll" className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105">
                            Enroll Now
                        </Link>
                    </div>
                    
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm opacity-80">
                        <div className="flex items-center">
                            <span className="mr-2">✅</span>
                            100% FREE Tuition
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">✅</span>
                            TESDA Certified
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">✅</span>
                            Job Placement Assistance
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};

export default About;
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import React, { useState, useEffect } from 'react';
import {
    Users,
    BookOpen,
    TrendingUp,
    Award,
    Clock,
    AlertCircle,
    CheckCircle,
    Calendar,
    FileText,
    Activity,
    Target,
    Star,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    Bell,
    Search,
    Filter,
    Download,
    Eye,
    ChevronRight,
    Zap,
    Shield,
    Globe,
    Heart,
    Wifi,
    WifiOff,
    Radio
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Pusher configuration based on your .env
const pusherConfig = {
    key: 'e78fcdf46d18b95765d8',
    cluster: 'ap1',
    encrypted: true,
    forceTLS: true
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Mock data for charts
const enrollmentData = [
    { month: 'Jan', students: 45, assessments: 32 },
    { month: 'Feb', students: 52, assessments: 38 },
    { month: 'Mar', students: 48, assessments: 41 },
    { month: 'Apr', students: 61, assessments: 45 },
    { month: 'May', students: 55, assessments: 48 },
    { month: 'Jun', students: 67, assessments: 52 }
];
    
const courseData = [
    { name: 'Cooking NC II', value: 35, color: '#3B82F6' },
    { name: 'Bread & Pastry', value: 28, color: '#8B5CF6' },
    { name: 'Commercial Cooking', value: 22, color: '#10B981' },
];

const performanceData = [
    { course: 'Cooking NC II', completion: 85, students: 124 },
    { course: 'Bread & Pastry', completion: 78, students: 96 },
    { course: 'Commercial Cooking', completion: 92, students: 87 },
];

const initialActivities = [
    {
        id: 1,
        user: 'John Dela Cruz',
        action: 'enrolled in Bread & Pastry Production NC II',
        time: '2 hours ago',
        type: 'enrollment',
        avatar: 'JD'
    },
    {
        id: 2,
        user: 'Maria Santos',
        action: 'completed Cooking NC II assessment',
        time: '4 hours ago',
        type: 'assessment',
        avatar: 'MS'
    },
    {
        id: 3,
        user: 'System',
        action: '25 students logged time-in via biometric',
        time: '6 hours ago',
        type: 'system',
        avatar: 'SY'
    },
    {
        id: 4,
        user: 'Admin',
        action: '5 new scholarship applications received',
        time: '8 hours ago',
        type: 'application',
        avatar: 'AD'
    }
];

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState(3);
    const [recentActivities, setRecentActivities] = useState(initialActivities);
    const [pusherConnected, setPusherConnected] = useState(false);
    const [realTimeEvents, setRealTimeEvents] = useState([]);
    const [pusher, setPusher] = useState(null);

    // Initialize Pusher connection
    useEffect(() => {
        let pusherInstance = null;
        
        const initPusher = async () => {
            try {
                // Load Pusher from CDN
                const script = document.createElement('script');
                script.src = 'https://js.pusher.com/8.2.0/pusher.min.js';
                script.async = true;
                
                script.onload = () => {
                    // Initialize Pusher with your config
                    pusherInstance = new window.Pusher(pusherConfig.key, {
                        cluster: pusherConfig.cluster,
                        encrypted: pusherConfig.encrypted,
                        forceTLS: pusherConfig.forceTLS
                    });

                    // Subscribe to your channel (based on MyEvent.php)
                    const channel = pusherInstance.subscribe('my-channel');
                    
                    // Listen for your custom event (based on MyEvent.php broadcastAs method)
                    channel.bind('my-event', (data) => {
                        console.log('Received real-time event:', data);
                        
                        // Add to real-time events list
                        setRealTimeEvents(prev => [
                            {
                                id: Date.now(),
                                message: data.message || data.data?.message || 'New event received',
                                timestamp: data.timestamp || data.data?.timestamp || new Date().toLocaleString(),
                                time: 'Just now'
                            },
                            ...prev.slice(0, 4) // Keep only last 5 events
                        ]);

                        // Add to recent activities
                        const newActivity = {
                            id: Date.now(),
                            user: 'System Event',
                            action: data.message || data.data?.message || 'Real-time event triggered',
                            time: 'Just now',
                            type: 'realtime',
                            avatar: 'RT'
                        };

                        setRecentActivities(prev => [newActivity, ...prev.slice(0, 3)]);
                        
                        // Increment notifications
                        setNotifications(prev => prev + 1);
                    });

                    // Connection state handlers
                    pusherInstance.connection.bind('connected', () => {
                        console.log('Pusher connected successfully');
                        setPusherConnected(true);
                    });

                    pusherInstance.connection.bind('disconnected', () => {
                        console.log('Pusher disconnected');
                        setPusherConnected(false);
                    });

                    pusherInstance.connection.bind('error', (err) => {
                        console.error('Pusher connection error:', err);
                        setPusherConnected(false);
                    });

                    setPusher(pusherInstance);
                };

                document.head.appendChild(script);
            } catch (error) {
                console.error('Error initializing Pusher:', error);
            }
        };

        initPusher();

        // Simulate loading time
        const timer = setTimeout(() => setIsLoading(false), 1000);

        // Cleanup function
        return () => {
            clearTimeout(timer);
            if (pusherInstance) {
                pusherInstance.disconnect();
            }
        };
    }, []);

    // Function to test the event (you can call this from your Laravel route)
    const triggerTestEvent = async () => {
        try {
            const response = await fetch('/trigger-event', {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                }
            });
            
            if (response.ok) {
                console.log('Test event triggered successfully');
            }
        } catch (error) {
            console.error('Error triggering test event:', error);
        }
    };

    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Admin Dashboard" />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-slate-600 font-medium">Loading your dashboard...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            {/* Background with animated gradient */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 p-6 space-y-6">
                    {/* Header Section with Real-time Status */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                        H
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                        Welcome back, HTTA Admin!
                                    </h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-slate-600">Here's what's happening with your training center today</p>
                                        {/* Real-time connection status */}
                                        <div className="flex items-center gap-1 text-xs">
                                            {pusherConnected ? (
                                                <>
                                                    <Radio className="w-3 h-3 text-green-500" />
                                                    <span className="text-green-600">Live</span>
                                                </>
                                            ) : (
                                                <>
                                                    <WifiOff className="w-3 h-3 text-red-500" />
                                                    <span className="text-red-600">Offline</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Test Event Button */}
                                <button 
                                    onClick={triggerTestEvent}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
                                >
                                    Test Event
                                </button>
                                <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                                    <Search className="w-5 h-5 text-slate-600" />
                                </button>
                                <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                                    <Filter className="w-5 h-5 text-slate-600" />
                                </button>
                                <button className="relative p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                                    <Bell className="w-5 h-5 text-slate-600" />
                                    {notifications > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
                                            {notifications}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Real-time Events Banner (shows when there are events) */}
                    {realTimeEvents.length > 0 && (
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <Radio className="w-4 h-4 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Latest Real-time Event</h3>
                                    <p className="text-green-100 text-sm">{realTimeEvents[0]?.message}</p>
                                    <p className="text-green-200 text-xs">{realTimeEvents[0]?.timestamp}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title="Total Students"
                            value="347"
                            change="+12%"
                            trend="up"
                            icon={Users}
                            color="blue"
                            description="Active enrollments at HTTA"
                        />
                        <MetricCard
                            title="Active Courses"
                            value="12"
                            change="+2"
                            trend="up"
                            icon={BookOpen}
                            color="purple"
                            description="Currently running"
                        />
                        <MetricCard
                            title="Assessments"
                            value="89"
                            change="+5%"
                            trend="up"
                            icon={Award}
                            color="green"
                            description="Completed this week"
                        />
                        <MetricCard
                            title="Success Rate"
                            value="94%"
                            change="+3%"
                            trend="up"
                            icon={Target}
                            color="amber"
                            description="Course completion"
                            realTime={pusherConnected}
                        />
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Charts */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Enrollment Trends Chart */}
                            <ChartCard title="Enrollment & Assessment Trends" icon={TrendingUp} realTime={pusherConnected}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={enrollmentData}>
                                        <defs>
                                            <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                                            </linearGradient>
                                            <linearGradient id="colorAssessments" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="month" stroke="#64748b" />
                                        <YAxis stroke="#64748b" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="students"
                                            stroke="#3B82F6"
                                            fillOpacity={1}
                                            fill="url(#colorStudents)"
                                            strokeWidth={3}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="assessments"
                                            stroke="#8B5CF6"
                                            fillOpacity={1}
                                            fill="url(#colorAssessments)"
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </ChartCard>

                            {/* Course Performance Chart */}
                            <ChartCard title="Course Performance" icon={Activity}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={performanceData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="course" stroke="#64748b" />
                                        <YAxis stroke="#64748b" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Bar dataKey="completion" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>

                        {/* Right Column - Info Cards */}
                        <div className="space-y-6">
                            {/* Course Distribution Chart */}
                            <ChartCard title="Course Distribution" icon={Globe}>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={courseData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}%`}
                                        >
                                            {courseData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartCard>

                            {/* Recent Activities List with Real-time Updates */}
                            <SectionCard title="Recent Activities" icon={Activity} realTime={pusherConnected}>
                                <div className="space-y-3">
                                    {recentActivities.map((activity) => (
                                        <div 
                                            key={activity.id} 
                                            className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 ${
                                                activity.type === 'realtime' 
                                                    ? 'bg-green-50 border border-green-200 animate-pulse' 
                                                    : 'bg-slate-50 hover:bg-slate-100'
                                            }`}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                                                activity.type === 'realtime' 
                                                    ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                                                    : 'bg-gradient-to-br from-blue-500 to-purple-600'
                                            }`}>
                                                {activity.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900">{activity.user}</p>
                                                <p className="text-sm text-slate-600">{activity.action}</p>
                                                <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Assessment Progress List */}
                        <SectionCard title="Assessment Progress" icon={CheckCircle}>
                            <div className="space-y-4">
                                <ProgressItem title="Cooking NC II" progress={80} total={125} />
                                <ProgressItem title="Bread & Pastry" progress={65} total={98} />
                                <ProgressItem title="Commercial Cooking" progress={72} total={87} />
                            </div>
                        </SectionCard>

                        {/* Real-time Events History */}
                        <SectionCard title="Real-time Events" icon={Radio}>
                            {realTimeEvents.length > 0 ? (
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {realTimeEvents.map((event) => (
                                        <div key={event.id} className="p-3 bg-green-50 rounded-xl border border-green-200">
                                            <p className="text-sm font-medium text-green-800">{event.message}</p>
                                            <p className="text-xs text-green-600 mt-1">{event.timestamp}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    <Radio className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                    <p>No real-time events yet</p>
                                    <p className="text-xs mt-1">Events will appear here when triggered</p>
                                </div>
                            )}
                        </SectionCard>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Enhanced MetricCard component with real-time indicator
function MetricCard({ title, value, change, trend, icon: Icon, color, description, realTime = false }) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        green: 'from-green-500 to-green-600',
        amber: 'from-amber-500 to-amber-600'
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} text-white shadow-lg relative`}>
                    <Icon className="w-6 h-6" />
                    {realTime && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                    )}
                </div>
                <div className="flex items-center gap-1 text-sm">
                    {trend === 'up' ? (
                        <ArrowUp className="w-4 h-4 text-green-500" />
                    ) : (
                        <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                        {change}
                    </span>
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">{value}</h3>
                <p className="text-slate-600 font-medium">{title}</p>
                <p className="text-xs text-slate-500 mt-1">{description}</p>
            </div>
        </div>
    );
}

// Enhanced SectionCard component with real-time indicator
function SectionCard({ title, children, icon: Icon, realTime = false }) {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg relative">
                    <Icon className="w-5 h-5 text-slate-600" />
                    {realTime && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                </div>
                <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                {realTime && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Live</span>
                )}
            </div>
            {children}
        </div>
    );
}

// ChartCard component with real-time indicator
function ChartCard({ title, children, icon: Icon, realTime = false }) {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg relative">
                        <Icon className="w-5 h-5 text-slate-600" />
                        {realTime && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                    {realTime && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Live</span>
                    )}
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-slate-600" />
                </button>
            </div>
            {children}
        </div>
    );
}

// Progress item component
function ProgressItem({ title, progress, total }) {
    const percentage = (progress / total) * 100;

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">{title}</span>
                <span className="text-slate-500">{progress}/{total} assessed</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}
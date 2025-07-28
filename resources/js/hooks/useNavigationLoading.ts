import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface NavigationLoadingState {
    isNavigating: boolean;
    activeLink: string | null;
    progress: number;
}

export function useNavigationLoading() {
    const [state, setState] = useState<NavigationLoadingState>({
        isNavigating: false,
        activeLink: null,
        progress: 0,
    });

    useEffect(() => {
        let progressTimer: NodeJS.Timeout;

        const handleStart = () => {
            setState(prev => ({
                ...prev,
                isNavigating: true,
                progress: 0,
            }));

            // Simulate progress
            progressTimer = setInterval(() => {
                setState(prev => ({
                    ...prev,
                    progress: Math.min(prev.progress + Math.random() * 30, 90),
                }));
            }, 100);
        };

        const handleProgress = (event: any) => {
            if (event.detail?.progress) {
                setState(prev => ({
                    ...prev,
                    progress: event.detail.progress.percentage || 0,
                }));
            }
        };

        const handleFinish = () => {
            if (progressTimer) {
                clearInterval(progressTimer);
            }

            setState(prev => ({
                ...prev,
                progress: 100,
            }));

            // Complete the loading animation
            setTimeout(() => {
                setState({
                    isNavigating: false,
                    activeLink: null,
                    progress: 0,
                });
            }, 200);
        };

        const handleError = () => {
            if (progressTimer) {
                clearInterval(progressTimer);
            }

            setState({
                isNavigating: false,
                activeLink: null,
                progress: 0,
            });
        };

        // Listen to Inertia router events
        router.on('start', handleStart);
        router.on('progress', handleProgress);
        router.on('finish', handleFinish);
        router.on('error', handleError);

        return () => {
            if (progressTimer) {
                clearInterval(progressTimer);
            }
            router.off('start', handleStart);
            router.off('progress', handleProgress);
            router.off('finish', handleFinish);
            router.off('error', handleError);
        };
    }, []);

    const setActiveLink = (href: string | null) => {
        setState(prev => ({
            ...prev,
            activeLink: href,
        }));
    };

    return {
        ...state,
        setActiveLink,
    };
}
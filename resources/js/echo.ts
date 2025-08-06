// resources/js/echo.ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally for Echo
(window as any).Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
    // These are needed for private channels
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/broadcasting/auth', // Default Laravel auth endpoint
    auth: {
        headers: {
            // You might need to add headers here if you use Sanctum or other auth
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        },
    },
});

export default echo;
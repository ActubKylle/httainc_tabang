import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';


export default defineConfig({
    plugins: [
        laravel({
            // Ensure these are your main entry points for CSS and TSX
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            // `ssr` is for Server-Side Rendering, which is an advanced topic.
            // If you're not explicitly setting up SSR, this line is fine but not strictly necessary for basic functionality.
            ssr: 'resources/js/ssr.tsx',
            refresh: true, // Enables hot module replacement for development
        }),
        react(), // Essential for React support
        tailwindcss(), // Essential for Tailwind CSS JIT compilation
    ],
    
    esbuild: {
        jsx: 'automatic', // Enables new JSX transform
    },
    resolve: {
        alias: {
            // Alias for Ziggy. Ensure 'ziggy-js' maps to the correct vendor path.
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
            // Alias for your 'resources/js' directory, allowing @/ components
            '@': resolve(__dirname, 'resources/js'),
        },
    },
    
});

import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
            buildDirectory: 'build',
        }),
        react(),
        tailwindcss(), // Add Tailwind v4 plugin
    ],
    
    server: {
        host: '0.0.0.0',
        port: 5173,
        cors: true,
        hmr: {
            host: 'localhost',
            protocol: 'ws',
        },
    },
    
    build: {
        outDir: 'public/build',
        manifest: 'manifest.json',
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'ui-vendor': ['lucide-react'],
                },
            },
        },
    },
    
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});
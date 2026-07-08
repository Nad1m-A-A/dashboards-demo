import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5173,
        watch: {
            usePolling: true,   // Windows + Docker: events don't cross the boundary
        },
        hmr: {
            host: 'localhost',  // the address the BROWSER uses to reach HMR
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            // detectTls: "new-dashboards.test",
            // detectTls: "localhost:8000",
            detectTls: false,
            fonts: [
                bunny('Outfit', { weights: [400, 500, 600] }),
                bunny('Cairo', { weights: [400, 500, 600, 700] }),
                // bunny('DM Serif Display', { weights: [400, 600, 700] }),
            ],
        }),
        inertia(
            process.env.NODE_ENV === 'production' ? {} : { ssr: false },
        ),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            '@resources': path.resolve(__dirname, 'resources'),
        },
    },
});

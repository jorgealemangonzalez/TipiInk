import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import {sentryVitePlugin} from '@sentry/vite-plugin'
import {createTranslationsMiddleware} from "./vite.tools"
import path from "path";

// Vite configuration
export default defineConfig({
    plugins: [
        react(),
        sentryVitePlugin({
            org: 'innovation-root-sl',
            project: 'javascript-react',
        }),
        createTranslationsMiddleware(),
    ],
    build: {
        sourcemap: true,
    },
    server: {
        headers: {
            'Document-Policy': 'js-profiling',
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})

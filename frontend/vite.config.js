import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // Proxy all /api/v1 calls to the Express backend
            '/api/v1': {
                target: 'http://localhost:8000',
                changeOrigin: true,
               
            },
        },
    },
});

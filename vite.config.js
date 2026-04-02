import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        server: {
            port: 5173,
            proxy: {
                '/api': {
                    target: env.VITE_DEV_PROXY_TARGET || 'http://localhost:8000',
                    changeOrigin: true,
                },
            },
        },
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: './src/test/setup.ts',
        },
    };
});

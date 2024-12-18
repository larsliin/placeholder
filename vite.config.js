import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
import { fileURLToPath, URL } from 'url';
import { resolve } from 'path';
import manifestDev from './manifest.dev.json';
import manifestProd from './manifest.prod.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Select the appropriate manifest based on the mode
    const manifest = mode === 'production' ? manifestProd : manifestDev;

    return {
        plugins: [
            vue(),
            crx({ manifest }),
        ],
        resolve: {
            alias: [
                {
                    find: '@',
                    replacement: fileURLToPath(new URL('./src', import.meta.url)),
                },
                {
                    find: '@assets',
                    replacement: fileURLToPath(new URL('./src/shared/assets', import.meta.url)),
                },
                {
                    find: '@cmp',
                    replacement: fileURLToPath(new URL('./src/shared/composables', import.meta.url)),
                },
                {
                    find: '@stores',
                    replacement: fileURLToPath(new URL('./src/shared/stores', import.meta.url)),
                },
                {
                    find: '@use',
                    replacement: fileURLToPath(new URL('./src/shared/use', import.meta.url)),
                },
            ],
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                },
            },
        },
        server: {
            port: 5173,
            strictPort: true,
            hmr: {
                port: 5173,
            },
        },
        build: {
            minify: true,
            chunkSizeWarningLimit: 1600,
            rollupOptions: {
                input: {
                    newtab: resolve(__dirname, 'index.html'),
                    popup: resolve(__dirname, 'index.html'),
                },
            },
        },
        define: {
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true),
        },
    };
});

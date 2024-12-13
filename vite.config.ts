import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		plugins: [vue(), vueDevTools()],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
		server: {
			proxy: {
				'/api': {
					target: env.VITE_API_REAL_URL,
					changeOrigin: true,
					secure: false,
					rewrite: (p) => p.replace(/^\/api/, ''),
				},
			},
			cors: false,
		},
	};
});

/***************************
 **  Polaris Vite Config  **
 ***************************/

import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL }    from 'node:url';
import vue                       from '@vitejs/plugin-vue';

export default defineConfig( async ( { command, mode } ) => {
    // Load app-level env vars to node-level env vars
    process.env = { ...process.env, ...loadEnv( mode, process.cwd() ) };

    return {
        clearScreen: false,

        plugins: [
            vue()
        ],

        build: {
            sourcemap:             'true' === process.env.VITE_BUILD_SOURCE_MAP,
            emptyOutDir:           'true' === process.env.VITE_BUILD_EMPTY_OUT_DIR,
            outDir:                process.env.VITE_BUILD_OUT_DIR,
            target:                process.env.VITE_BUILD_TARGET,                              // 'esnext'
            chunkSizeWarningLimit: parseInt( process.env.VITE_BUILD_CHUNK_SIZE_WARNING_LIMIT ) // kB, after minification
        },

        define: {
            'process.env': {},

            // Built-in import.meta.env variables:
            // MODE     {string}
            // BASE_URL {string}
            // PROD     {boolean}
            // DEV      {boolean} always !PROD
            // SSR      {boolean}

            //'import.meta.env.VITE_APP_TITLE': JSON.stringify( process.env.VITE_APP_TITLE ), // process.env.npm_package_name

            'import.meta.env.VITE_PACKAGE_NAME':    JSON.stringify( process.env.npm_package_name ),
            'import.meta.env.VITE_PACKAGE_VERSION': JSON.stringify( process.env.npm_package_version )
        },

        resolve: {
            alias: {
                '@': fileURLToPath( new URL( './src', import.meta.url ) )
            },
          //extensions: [ '.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue' ],
        },

        css: {
            preprocessorOptions: {
                scss: {
                    // Tells Vite to include the global.scss file in every SCSS
                    // file that it compiles
                    //additionalData: '@import "@/scss/global.scss";'
                },
            },
        },

        // Hot reload (development) server
        server: {
            host:       process.env.VITE_DEV_SERVER_HOST,
            strictPort: 'true' === process.env.VITE_DEV_SERVER_STRICT_PORT,
            port:       parseInt( process.env.VITE_DEV_SERVER_PORT ) // Default: 5173
        },

        // Preview server
        preview: {
            host:       process.env.VITE_DEV_SERVER_HOST,                   // Default: localhost // `${pkg.name}.localhost`
            strictPort: 'true' === process.env.VITE_DEV_SERVER_STRICT_PORT, // Default: false
            port:       parseInt( process.env.VITE_DEV_SERVER_PORT )        // Default: 5173
        }
    };
} );

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Vite sets mode to 'production' for `npm run build`
  // and 'development' for `npm run dev` automatically.
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = mode === 'production'

  // Pick the correct API base URL and server URL based on build mode
  const apiBaseUrl = isProd
    ? (env.VITE_PROD_API_BASE_URL || env.VITE_API_BASE_URL)
    : env.VITE_API_BASE_URL

  const serverUrl = isProd
    ? (env.VITE_PROD_SERVER_URL || env.VITE_SERVER_URL)
    : env.VITE_SERVER_URL

  return {
    plugins: [react()],
    base: './',
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Compile-time injection: all files using these env vars get the right value
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiBaseUrl || ''),
      'import.meta.env.VITE_SERVER_URL': JSON.stringify(serverUrl || ''),
      'import.meta.env.VITE_API_URL': JSON.stringify(apiBaseUrl || ''),
    }
  }
})

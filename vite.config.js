import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.API_PROXY_TARGET || 'https://exe101-be-wkc0.onrender.com'

  return {
    plugins: [react()],
    preview: {
      headers: { 'Cross-Origin-Opener-Policy': 'same-origin-allow-popups' },
    },
    server: {
      port: 5173,
      strictPort: true,
      headers: { 'Cross-Origin-Opener-Policy': 'same-origin-allow-popups' },
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          configure(proxy) {
            proxy.on('error', (_error, _request, response) => {
              if (!response || typeof response.writeHead !== 'function' || response.headersSent || response.writableEnded) return
              response.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' })
              response.end(JSON.stringify({
                success: false,
                message: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.',
              }))
            })
          },
        },
      },
    },
  }
})

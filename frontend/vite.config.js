import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': '${process.env.REACT_APP_BACKEND_URL}',
    },
  },
})

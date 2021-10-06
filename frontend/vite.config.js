import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 3001 }, // To avoid overlap the port of frontend that is the same default (3000)
  plugins: [reactRefresh()]
})

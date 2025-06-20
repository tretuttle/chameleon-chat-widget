import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true, // Fail if 8080 is occupied to prevent stale-server confusion by auto-incrementing to a new port
    proxy: {
      '/api/netsuite': {
        target: 'https://4086366.extforms.netsuite.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/netsuite/, ''),
        secure: true,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  // Use the cssInjectedByJsPlugin to bundle styles directly into the JS file
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/widget-embed.tsx'),
      name: 'AmigoWidget',
      fileName: (format) => `amigo-widget.${format}.js`,
      formats: ['umd', 'es']
    },
    outDir: 'dist-widget',
    rollupOptions: {
      // React should be provided by the host page, not bundled with the widget
      external: ['react', 'react-dom'],
      output: {
        // Define the global variables for the externalized libraries
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM'
        },
      },
    },
  },
});
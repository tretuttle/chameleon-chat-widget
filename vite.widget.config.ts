import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vitejs.dev/config/
export default defineConfig({
	// Use the cssInjectedByJsPlugin to bundle styles directly into the JS file
	plugins: [react(), cssInjectedByJsPlugin()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	define: {
		// Define global constants for the widget
		"process.env.NODE_ENV": '"production"',
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, "src/widget-embed.tsx"),
			name: "AmigoWidget",
			fileName: (format: string) => `amigo-widget.${format}.js`,
			formats: ["umd"],
		},
		outDir: "dist-widget",
		rollupOptions: {
			// React should be provided by the host page, not bundled with the widget
			external: ["react", "react-dom"],
			output: {
				name: "AmigoWidget",
				// Define the global variables for the externalized libraries
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
		},
		// Use terser for minification and drop console statements in production
		minify: "terser",
		terserOptions: {
			compress: {
				drop_console: true,
			},
		},
	},
});

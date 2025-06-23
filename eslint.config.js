import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import unicorn from "eslint-plugin-unicorn";
import noSecrets from "eslint-plugin-no-secrets";
import react from "eslint-plugin-react";

export default [
	js.configs.recommended,
	// Node.js config for config/build files
	{
		files: [
			"*.config.{js,ts,mjs,cjs}",
			"vite.config.{js,ts,mjs,cjs}",
			"vite.*.config.{js,ts,mjs,cjs}",
			"vitest.config.{js,ts,mjs,cjs}",
			"tailwind.config.{js,ts,mjs,cjs}",
		],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: "module",
			},
			globals: {
				...globals.node,
			},
		},
		rules: {
			// Allow require() in config files
			"@typescript-eslint/no-require-imports": "off",
			"no-undef": "off",
		},
	},
	// Test files override
	{
		files: ["**/*.test.*", "**/__tests__/**/*"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: "module",
				ecmaFeatures: { jsx: true },
			},
			globals: {
				...globals.browser,
				...globals.node,
				vi: "readonly", // for Vitest
				describe: "readonly",
				it: "readonly",
				expect: "readonly",
				beforeAll: "readonly",
				afterAll: "readonly",
				beforeEach: "readonly",
				afterEach: "readonly",
			},
		},
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"no-case-declarations": "off",
		},
	},
	// Main app override (browser, React, etc)
	{
		files: ["**/*.{ts,tsx,js,jsx}"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: "module",
				ecmaFeatures: { jsx: true },
			},
			globals: {
				...globals.browser,
				React: "writable",
			},
		},
		settings: {
			react: {
				version: "detect", // Automatically detect the React version
			},
		},
		plugins: {
			"@typescript-eslint": tseslint,
			react,
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
			unicorn,
			"no-secrets": noSecrets,
		},
		rules: {
			...tseslint.configs.recommended.rules,
			...react.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
			"@typescript-eslint/no-unused-vars": "off",
			"react/no-unknown-property": "warn",
			"react/prop-types": "off",
			"no-console": ["error", { allow: ["warn", "error", "log"] }],
			"unicorn/string-content": [
				"error",
				// { patterns: ["DEBUG", "🔥", "yellow debug"] },
			],
		},
	},
	{
		ignores: ["dist", "dist-widget"],
	},
];

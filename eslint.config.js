import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';

export default [
	{
		files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts,svelte}']
	},
	{
		ignores: [
			'.yarn',
			'yarn.lock',
			'package.json',
			'node-modules',
			'dist',
			'build',
			'coverage',
			'*.config.{js,ts,cjs,mjs,cts,mts}',
			'.svelte-kit'
		]
	},
	{
		plugins: {
			'@typescript-eslint': ts
		},
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: ['./tsconfig.json'],
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.svelte']
			}
		},
		rules: {
			...ts.configs.base.rules,
			...ts.configs.recommended.rules
		}
	},
	{
		ignores: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
		plugins: {
			// @ts-expect-error workaround until upstream update
			svelte
		},
		processor: svelte.processors.svelte,
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				project: ['./tsconfig.json'],
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.svelte']
			}
		},
		rules: {
			...svelte.configs.recommended.rules
		}
	},
	prettier
];

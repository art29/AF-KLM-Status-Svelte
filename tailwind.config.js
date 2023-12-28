/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#0045B6',
				secondary: '#8F8F8F',
				viewed: '#0046B8BF'
			}
		}
	},
	plugins: []
};

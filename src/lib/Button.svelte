<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let type: 'submit' | 'button' | 'reset' = 'button';
	export let theme: 'primary' | 'viewed' | 'secondary' | 'danger' | 'none' = 'primary';
	export let size: 'default' | 'block' = 'default';
	export let textXl: boolean = true;
	export let rounded: 'none' | 'left' | 'right' | 'full' = 'full';

	export let disabled: boolean = false;

	const themeStyle = (): string => {
		switch (theme) {
			case 'danger':
				return 'bg-red-800 text-white';
			case 'primary':
				return 'bg-primary text-white';
			case 'viewed':
				return 'bg-viewed text-white';
			case 'secondary':
				return 'bg-secondary text-white';
			case 'none':
				return '';
		}
	};

	const sizeStyle = (): string => {
		switch (size) {
			case 'default':
				return 'w-fit';
			case 'block':
				return 'w-full';
		}
	};

	const roundedStyle = (): string => {
		switch (rounded) {
			case 'none':
				return 'rounded-none';
			case 'left':
				return 'rounded-l-lg';
			case 'right':
				return 'rounded-r-lg';
			case 'full':
				return 'rounded-lg';
		}
	};

	const dispatch = createEventDispatcher();

	const handleClick = (): void => {
		dispatch('click');
	};
</script>

<button
	on:click={handleClick}
	{type}
	{disabled}
	class="flex items-center justify-center px-3 py-2 {textXl &&
		'text-xl'} disabled:pointer-events-none disabled:opacity-50 {sizeStyle()} {themeStyle()} {roundedStyle()}"
>
	<slot />
</button>

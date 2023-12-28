<script lang="ts">
	export let type: 'submit' | 'button' | 'reset' = 'button';
	export let theme: 'primary' | 'viewed' | 'secondary' | 'danger' | 'none' = 'primary';
	export let size: 'default' | 'block' = 'default';

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
				return '';
			case 'block':
				return 'w-full';
		}
	};
</script>

<button {type} class="rounded-lg px-3 py-2 {sizeStyle()} {themeStyle()}">
	<slot />
</button>

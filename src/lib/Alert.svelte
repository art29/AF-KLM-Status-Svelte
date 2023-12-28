<script lang="ts">
	import Fa from 'svelte-fa';
	import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

	export let theme: 'danger' | 'warning' = 'danger';
	export let dismissible: boolean = false;
	const themeStyle = (): string => {
		switch (theme) {
			case 'danger':
				return 'bg-red-500 text-white';
			case 'warning':
				return 'bg-yellow-700 text-white';
		}
	};
</script>

<div class="rounded-lg px-3 py-2 flex w-full {themeStyle()}">
	<div class="flex-1">
		<slot />
	</div>
	{#if dismissible}
		<button aria-label="">
			<Fa fa={faTimes} />
		</button>
	{/if}
</div>

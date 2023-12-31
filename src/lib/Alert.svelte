<script lang="ts">
	import Fa from 'svelte-fa';
	import * as m from '$paraglide/messages';
	import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

	export let theme: 'danger' | 'warning' = 'danger';
	export let dismissible: boolean = false;
	let dismissed = false;
	const themeStyle = (): string => {
		switch (theme) {
			case 'danger':
				return 'bg-red-500 text-white';
			case 'warning':
				return 'bg-yellow-700 text-white';
		}
	};

	const dismiss = () => {
		dismissed = true;
	};
</script>

<div class="rounded-lg px-3 py-2 flex w-full items-center {themeStyle()} {dismissed && 'hidden'}">
	<div class="flex-1">
		<slot />
	</div>
	{#if dismissible}
		<button aria-label={m.dismiss_alert()} on:click={dismiss}>
			<Fa icon={faTimes} />
		</button>
	{/if}
</div>

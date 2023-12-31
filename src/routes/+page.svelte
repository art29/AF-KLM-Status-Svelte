<script lang="ts">
	import * as m from '$paraglide/messages';
	import logo from '$lib/assets/air-france-klm-logo.svg';
	import Button from '$lib/Button.svelte';

	const searchFlight = (): void => {};
</script>

<div>
	<h1>
		{m.app_title()}
	</h1>

	<img alt="Air-France KLM Logo" src={logo} />

	<input class="rounded-lg bg-white border-primary text-center" placeholder="AF349" />

	<Button type="button" on:click={searchFlight}>{m.search_flight()}</Button>
</div>

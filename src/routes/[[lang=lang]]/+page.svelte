<script lang="ts">
	import * as m from '$paraglide/messages';
	import Button from '$lib/Button.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { type AvailableLanguageTag, sourceLanguageTag } from '$paraglide/runtime';
	import LogoHeader from '$lib/LogoHeader.svelte';

	let flightNumber = '';
	const searchFlightWithParams = (flightNum: string): void => {
		goto(`/${($page.params.lang as AvailableLanguageTag) ?? sourceLanguageTag}/${flightNum}`);
	};

	const searchFlight = (): void => {
		searchFlightWithParams(flightNumber);
	};

	const previousFlights: string[] =
		(browser && JSON.parse(localStorage.getItem('previousFlights') ?? '[]')) ?? [];
</script>

<div class="flex flex-col items-center mx-4 md:mx-[20%] gap-6">
	<LogoHeader />

	<div class="flex flex-col gap-2 w-full">
		<input
			bind:value={flightNumber}
			class="rounded-lg bg-white border border-primary text-center w-full min-h-10 text-xl"
			placeholder="AF349"
		/>
		<Button type="button" size="block" disabled={!flightNumber} on:click={searchFlight}
			>{m.search_flight()}</Button
		>
	</div>

	<div class="w-full text-center">
		<h2 class="text-xl font-semibold font-sans mb-2">{m.recently_viewed_flights()}</h2>

		<div class="flex flex-col gap-3 w-full">
			{#each previousFlights as previousFlight}
				<Button size="block" theme="viewed" on:click={() => searchFlightWithParams(previousFlight)}
					>{previousFlight}</Button
				>
			{/each}
		</div>
	</div>
</div>

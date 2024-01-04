<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { sourceLanguageTag } from '$paraglide/runtime';
	import LogoHeader from '$lib/LogoHeader.svelte';
	import Button from '$lib/Button.svelte';
	import * as m from '$paraglide/messages';
	import { goto } from '$app/navigation';
	import { callAFKLMAPI, route } from '$lib/helpers';
	import { type OperationalFlight, savedFlights } from '../../../stores';
	import { get } from 'svelte/store';
	import { DoubleBounce } from 'svelte-loading-spinners';

	const lang = ($page.params.lang ?? sourceLanguageTag) === 'en' ? 'en-GB' : 'fr-FR';
	let operationalFlights: OperationalFlight[] = [];

	onMount(async () => {
		get(savedFlights).find((f) =>
			f.key.includes(`${f.flightData.airline?.code}_${f.flightData.flightNumber}`)
		);
		operationalFlights = await callAFKLMAPI($page.params.flightNumber, lang);
	});

	const goToDetailsPage = (date: string | undefined): void => {
		if (date) {
			goto(route(`/${$page.params.flightNumber}/${date}`, $page.params.lang ?? sourceLanguageTag));
		}
	};
</script>

<div class="flex flex-col items-center mx-4 md:mx-[20%] gap-4">
	<LogoHeader />
	<Button
		theme="secondary"
		size="block"
		on:click={() => goto(route('/', $page.params.lang ?? sourceLanguageTag))}
		>{m.choose_another_flight()}</Button
	>
	<h2 class="font-sans font-semibold text-xl">
		{m.next_params_flights({ flightNo: $page.params.flightNumber })}
	</h2>
	<div class="flex flex-col gap-2 w-full">
		{#if operationalFlights.length === 0}
			<div class="flex flex-col items-center justify-center w-full h-32">
				<DoubleBounce color="#0045B6" size="64" />
			</div>
		{/if}
		{#each operationalFlights as operationalFlight}
			<Button
				theme="primary"
				size="block"
				on:click={() => goToDetailsPage(operationalFlight?.flightScheduleDate)}
			>
				{operationalFlight.flightScheduleDate}
			</Button>
		{/each}
	</div>
</div>

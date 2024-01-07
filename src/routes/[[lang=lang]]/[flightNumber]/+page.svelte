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
	import { DoubleBounce } from 'svelte-loading-spinners';
	import Alert from '$lib/Alert.svelte';
	import { get } from 'svelte/store';
	import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	const lang = ($page.params.lang ?? sourceLanguageTag) === 'en' ? 'en-GB' : 'fr-FR';
	let operationalFlights: OperationalFlight[] = [];
	let error = false;
	const previouslySavedFlights = get(savedFlights);
	const carrierCode = ($page.params.flightNumber.match(/^[A-Z]{2,3}/) || [''])[0];
	const flightNumber = $page.params.flightNumber.replace(/^[A-Z]{2,3}/, '');
	let loading = false;

	const refresh = async (): Promise<void> => {
		loading = true;
		operationalFlights = await callAFKLMAPI($page.params.flightNumber, lang);
		if (operationalFlights.length === 0) {
			error = true;
		}
		loading = false;
	};

	onMount(async () => {
		const flights = previouslySavedFlights.filter(
			(f) =>
				f.key.includes(`${carrierCode}_${flightNumber}_`) &&
				Math.floor((new Date().getTime() - Date.parse(String(f.lastUpdated))) / 60000) <= 10
		);

		if (flights.length > 0) {
			operationalFlights = flights.map((f) => f.flightData);
		} else {
			await refresh();
		}
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
	<div class="flex items-center gap-2">
		<h2 class="font-sans font-semibold text-xl">
			{m.next_params_flights({ flightNo: $page.params.flightNumber })}
		</h2>
		<button class={loading ? 'animate-spin' : ''} on:click={refresh}
			><Fa size="lg" icon={faRotateRight}></Fa></button
		>
	</div>
	<div class="flex flex-col gap-2 w-full">
		{#if operationalFlights.length === 0 && error === false}
			<div class="flex flex-col items-center justify-center w-full h-32">
				<DoubleBounce color="#0045B6" size="64" />
			</div>
		{:else if operationalFlights.length === 0 && error === true}
			<Alert>{m.flight_not_found()}</Alert>
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

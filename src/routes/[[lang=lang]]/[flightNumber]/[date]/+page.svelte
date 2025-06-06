<script lang="ts">
	import * as m from '$paraglide/messages';
	import { get } from 'svelte/store';
	import { savedFlights } from '../../../../stores';
	import { page } from '$app/stores';
	import Fa from 'svelte-fa';
	import { tooltip } from '@svelte-plugins/tooltips';
	import {
		faIdCard,
		faInfoCircle,
		faLuggageCart,
		faPlane,
		faRotateRight,
		faStopwatch,
		faUserGear,
		faWifi
	} from '@fortawesome/free-solid-svg-icons';
	import { DateTime } from 'luxon';
	import {
		callAFKLMAPI,
		capitalizeEachWord,
		displayCityWithCode,
		stringArrayOrDash
	} from '$lib/helpers';
	import { type AvailableLanguageTag, sourceLanguageTag } from '$paraglide/runtime';
	import Alert from '$lib/Alert.svelte';
	import { DoubleBounce } from 'svelte-loading-spinners';
	import FlightTimeDisplay from '$lib/FlightTimeDisplay.svelte';
	import type { components } from '../../../../../air-france-klm-api';
	import { onMount } from 'svelte';

	const lang = ($page.params.lang ?? sourceLanguageTag) as AvailableLanguageTag;
	const previouslySavedFlights = get(savedFlights);
	const carrierCode = ($page.params.flightNumber.match(/^[A-Z]{2,3}/) || [''])[0];
	const flightNumber = $page.params.flightNumber.replace(/^[A-Z]{2,3}/, '');
	let flight = previouslySavedFlights.find(
		(f) => f.key === `${carrierCode}_${flightNumber}_${$page.params.date}` && f.lang === lang
	);
	let error = false;
	let loading = false;

	const refresh = (): void => {
		loading = true;
		callAFKLMAPI($page.params.flightNumber, lang, $page.params.date).then(() => {
			flight = get(savedFlights).find(
				(f) => f.key === `${carrierCode}_${flightNumber}_${$page.params.date}` && f.lang === lang
			);

			loading = false;

			if (!flight) {
				error = true;
			}
		});
	};

	const boardingStatus = (boardingStatus?: string): string => {
		switch (boardingStatus) {
			case 'Not Open': {
				return `(${m.boarding_not_open()})`;
			}
			case 'Open': {
				return `(${m.boarding_open()})`;
			}
			case 'Closed': {
				return `(${m.boarding_closed()})`;
			}
			default: {
				return '';
			}
		}
	};

	const contactType = (contactType?: string, buses?: string): string => {
		switch (contactType) {
			case 'C': {
				return m.via_jetbridge();
			}
			case 'F': {
				return m.via_stairs() + (buses ? ` (${m.x_buses_incoming({ count: buses })})` : '');
			}
			case 'L': {
				return m.via_bus() + (buses ? ` (${m.x_buses_incoming({ count: buses })})` : '');
			}
			default: {
				return '';
			}
		}
	};

	const statusColor = (
		status: string | undefined,
		arrivalTimes: components['schemas']['LegTimes'] | undefined
	): string => {
		let arrivalTimeDelay = 0;
		if (arrivalTimes?.scheduled && arrivalTimes?.latestPublished) {
			const latestTime = DateTime.fromISO(arrivalTimes.latestPublished, {
				setZone: true
			});
			const scheduledTime = DateTime.fromISO(arrivalTimes.scheduled, {
				setZone: true
			});
			arrivalTimeDelay = latestTime.diff(scheduledTime, 'minutes').minutes;
		}
		if (status === 'CANCELLED' || status === 'DIVERTED') {
			return 'text-red-600';
		} else if (
			status === 'NEW_DEPARTURE_TIME' ||
			status === 'DELAYED_DEPARTURE' ||
			status === 'DELAYED_ARRIVAL' ||
			arrivalTimeDelay > 20
		) {
			return 'text-orange-600';
		} else {
			return 'text-green-700';
		}
	};

	const legStatusTranslate = (leg: components['schemas']['FlightLeg']) => {
		switch (leg.legStatusPublic) {
			case 'PARTIALLY_CANCELLED': {
				return m.partially_cancelled();
			}
			case 'CANCELLED': {
				return m.cancelled();
			}
			case 'ARRIVED': {
				return m.arrived();
			}
			case 'LANDED': {
				return m.landed();
			}
			case 'EARLY_ARRIVAL': {
				return m.early_arrival();
			}
			case 'DELAYED_ARRIVAL': {
				return m.delayed_arrival();
			}
			case 'IN_FLIGHT': {
				return m.in_flight();
			}
			case 'DEPARTED': {
				return m.departed();
			}
			case 'DELAYED_DEPARTURE': {
				return m.delayed_departure();
			}
			case 'EARLY_DEPARTURE': {
				return m.early_departure();
			}
			case 'NEW_EARLY_DEPARTURE_TIME': {
				return m.new_early_departure_time();
			}
			case 'NEW_DEPARTURE_TIME': {
				return m.new_departure_time();
			}
			case 'DIVERTED': {
				return m.diverted();
			}
			case 'ON_TIME': {
				return m.on_time();
			}
			default: {
				return leg.statusName ?? leg.legStatusPublic;
			}
		}
	};

	onMount(() => {
		if (
			!flight ||
			Math.floor((new Date().getTime() - Date.parse(String(flight.lastUpdated))) / 60000) > 10
		) {
			refresh();
		}
	});
</script>

{#if flight}
	<div class="flex flex-col mx-4 md:mx-[20%] gap-4">
		<h1 class="font-sans font-semibold text-4xl">
			{flight.flightData.airline?.code}
			{flight.flightData.flightNumber} - {flight.flightData.flightScheduleDate &&
				DateTime.fromFormat(flight.flightData.flightScheduleDate, 'yyyy-LL-dd')
					.setLocale(lang)
					.toLocaleString(DateTime.DATE_MED)}
		</h1>
		<div class="flex justify-between">
			<div class="flex items-center text-gray-600">
				<span class="mr-1"
					>{m.updated_x_minutes_ago({
						min: Math.floor((new Date().getTime() - Date.parse(String(flight.lastUpdated))) / 60000)
					})}</span
				>
				<button class={loading ? 'animate-spin' : ''} on:click={refresh}
					><Fa size="lg" icon={faRotateRight}></Fa></button
				>
			</div>
			<a class="text-gray-600" href={`/${$page.params.lang ?? sourceLanguageTag}`}
				>{m.track_another_flight()}</a
			>
		</div>
		{#each flight.flightData.flightLegs ?? [] as flightLeg}
			{#if flightLeg.irregularity?.delayReasonPublic || flightLeg.irregularity?.delayReasonPublicLangTransl}
				<Alert>
					{flightLeg?.irregularity?.delayReasonPublicLangTransl ??
						flightLeg.irregularity?.delayReasonPublic}
				</Alert>
			{/if}
			{#if (flightLeg.legStatusPublic === 'CANCELLED' || flightLeg.legStatusPublic === 'DIVERTED') && flightLeg.irregularity?.cancellationReasonPublicLong}
				<Alert>
					{flightLeg.irregularity?.cancellationReasonPublicLong}
				</Alert>
			{/if}
			<div>
				<h2
					class={`text-3xl font-semibold ${statusColor(
						flightLeg.legStatusPublic,
						flightLeg.arrivalInformation?.times
					)}`}
				>
					{flightLeg.legStatusPublicLangTransl ?? legStatusTranslate(flightLeg)}
				</h2>
				<h3 class="text-gray-600">
					{boardingStatus(flightLeg.otherFlightLegStatuses?.boardingStatus)}
				</h3>
			</div>
			<div>
				<h2 class="text-3xl">
					{#if flightLeg.legStatusPublic === 'ARRIVED'}
						{m.landed()}
					{:else if flightLeg.timeToArrival}
						{m.expected_to_land_in_x({ time: flightLeg.timeToArrival?.replace('PT', '') })}
					{/if}
				</h2>
			</div>
			<div class="flex items-center relative w-full">
				<div
					class="h-[3px] bg-green-700 absolute"
					style="width: {flightLeg.completionPercentage}%"
				></div>
				<div
					class="w-full h-[3px]"
					style="background-image: linear-gradient(to right,#C4C4C4 0%,#C4C4C4 50%,transparent 50%); background-size: 1rem .2rem;"
				></div>
				<div
					class="bg-gray-300 p-2 w-fit h-fit rounded-full absolute"
					style="left: calc({flightLeg.completionPercentage}% - 17px)"
				>
					<Fa icon={faPlane}></Fa>
				</div>
			</div>
			<div class="flex justify-between mb-4">
				<div>
					<h4 class="text-2xl font-semibold">
						<FlightTimeDisplay legTimes={flightLeg.departureInformation?.times}></FlightTimeDisplay>
					</h4>
					<p class="text-lg">
						{displayCityWithCode(
							flightLeg.departureInformation?.airport?.city.name,
							flightLeg.departureInformation?.airport?.city?.country?.code
						)}
					</p>
					<p class="text-lg">
						{flightLeg.departureInformation?.airport?.nameLangTranl ??
							capitalizeEachWord(flightLeg.departureInformation?.airport?.name)}
					</p>
					<p class="text-lg">({flightLeg.departureInformation?.airport?.code})</p>
				</div>
				<div class="text-right">
					<h4 class="text-2xl font-semibold">
						<FlightTimeDisplay
							scheduleDepartureTime={flightLeg.departureInformation?.times?.scheduled}
							legTimes={flightLeg.arrivalInformation?.times}
						></FlightTimeDisplay>
					</h4>
					<p class="text-lg">
						{displayCityWithCode(
							flightLeg.arrivalInformation?.airport?.city.name,
							flightLeg.arrivalInformation?.airport?.city?.country?.code
						)}
					</p>
					<p class="text-lg">
						{flightLeg.arrivalInformation?.airport?.nameLangTranl ??
							capitalizeEachWord(flightLeg.arrivalInformation?.airport?.name)}
					</p>
					<p class="text-lg">({flightLeg.arrivalInformation?.airport?.code})</p>
				</div>
			</div>
			<div class="flex justify-between">
				<div>
					<p class="text-lg">
						{m.terminal_x({
							terminal: flightLeg.departureInformation?.airport?.places?.terminalCode ?? '-'
						})}
					</p>
					<p class="text-lg">{m.gate()}</p>
					<p class="text-xl font-semibold">
						{stringArrayOrDash(flightLeg.departureInformation?.airport?.places?.gateNumber)}
						{#if flightLeg.departureInformation?.airport?.places?.boardingContactType}
							<span class="text-gray-600 text-sm">
								{contactType(
									flightLeg.departureInformation?.airport?.places?.boardingContactType,
									flightLeg.departureInformation?.airport?.places?.boardingBusQuantity
								)}
							</span>
						{/if}
					</p>
					<p class="text-lg">{m.parking()}</p>
					<p class="text-xl font-semibold">
						{flightLeg.departureInformation?.airport?.places?.parkingPosition ?? '-'}
					</p>
				</div>
				<div class="text-right">
					<p class="text-lg">
						{m.terminal_x({
							terminal: flightLeg.arrivalInformation?.airport?.places?.terminalCode ?? '-'
						})}
					</p>
					<p class="text-lg">{m.gate()}</p>
					<p class="text-xl font-semibold">
						{stringArrayOrDash(flightLeg.arrivalInformation?.airport?.places?.gateNumber)}
						{#if flightLeg.arrivalInformation?.airport?.places?.disembarkingContactType}
							<span class="text-gray-600 text-sm">
								{contactType(
									flightLeg.arrivalInformation?.airport?.places?.disembarkingContactType,
									flightLeg.arrivalInformation?.airport?.places?.disembarkingBusQuantity
								)}
							</span>
						{/if}
					</p>
					<p class="text-lg">{m.parking()}</p>
					<p class="text-xl font-semibold">
						{flightLeg.arrivalInformation?.airport?.places?.parkingPosition ?? '-'}
					</p>
				</div>
			</div>
			<hr class="border-top border-[1px] border-black" />
			<div class="flex justify-between items-center text-lg">
				<span class="gap-2 flex items-center">
					<Fa icon={faStopwatch} size="lg"></Fa>
					{m.duration()}
				</span>
				<span class="text-right">
					{flightLeg.scheduledFlightDuration?.replace('PT', '')}
				</span>
			</div>
			<hr class="border-top border-[1px] border-black" />
			<div class="flex justify-between items-center text-lg">
				<span class="gap-2 flex items-center">
					<Fa icon={faWifi} size="lg"></Fa>
					{m.wifi_enabled()}
				</span>
				<span class="text-right">
					{flightLeg.aircraft?.wifiEnabled === 'Y' ? m.yes() : m.no()}
				</span>
			</div>
			<hr class="border-top border-[1px] border-black" />
			<div class="flex justify-between items-center text-lg">
				<span class="gap-2 flex items-center">
					<Fa icon={faLuggageCart} size="lg"></Fa>
					{m.baggage_carousel()}
				</span>
				<span class="text-right">
					{stringArrayOrDash(flightLeg.arrivalInformation?.airport?.places?.baggageBelt)}
				</span>
			</div>
			<hr class="border-top border-[1px] border-black" />
			<div class="flex justify-between items-center text-lg">
				<span class="gap-2 flex items-center">
					<Fa icon={faIdCard} size="lg"></Fa>
					{m.aircraft_info()}
				</span>
				<span class="text-right">
					{flightLeg.aircraft?.typeName}
					{flightLeg.aircraft?.registration
						? `(${flightLeg.aircraft.registration[0]}-${flightLeg.aircraft.registration.substring(
								1
							)})`
						: ''}
				</span>
			</div>
			<hr class="border-top border-[1px] border-black" />
			<div class="flex justify-between items-center text-lg text-right">
				<span class="gap-2 flex items-center text-left">
					<Fa icon={faUserGear} size="lg"></Fa>
					{m.pax_config()}
				</span>
				<span class="text-right">
					{flightLeg.aircraft?.operationalConfiguration}
					<br />
					<span
						use:tooltip={{ content: m.what_does_it_mean_text() }}
						class="flex gap-1 items-center text-sm"
					>
						<Fa icon={faInfoCircle} size="sm"></Fa>
						{m.what_does_it_mean()}
					</span>
				</span>
			</div>
			<hr class="border-top border-[1px] border-black mb-4" />
		{/each}
	</div>
{:else if error}
	<Alert>{m.flight_not_found()}</Alert>
{:else}
	<div class="flex flex-col items-center justify-center w-full h-32">
		<DoubleBounce color="#0045B6" size="64" />
	</div>
{/if}

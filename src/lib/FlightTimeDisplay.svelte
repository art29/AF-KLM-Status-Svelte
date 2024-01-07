<script lang="ts">
	import * as m from '$paraglide/messages';
	import type { components } from '../../air-france-klm-api';
	import { DateTime } from 'luxon';

	export let scheduleDepartureTime: string | null = null;
	export let legTimes: components['schemas']['LegTimes'] | undefined;

	const formatTime = (time: string): string => {
		return DateTime.fromISO(time, {
			setZone: true
		}).toLocaleString(DateTime.TIME_24_SIMPLE);
	};

	const plusDays = (): number => {
		if (!!scheduleDepartureTime && legTimes?.scheduled) {
			const departure = DateTime.fromISO(scheduleDepartureTime, {
				setZone: true
			}).toUTC();
			const arrival = DateTime.fromISO(legTimes.scheduled, {
				setZone: true
			}).toUTC();
			return Math.floor(arrival.startOf('day').diff(departure.startOf('day'), 'days').days);
		} else {
			return 0;
		}
	};
</script>

<p>
	{#if legTimes && legTimes.scheduled}
		{formatTime(legTimes.scheduled)}<span class="mr-1 text-sm align-super"
			>{#if plusDays() > 0}+{plusDays()}{/if}</span
		>
		{#if legTimes.actual}
			({m.actual()} {formatTime(legTimes.actual)})
		{:else if legTimes.latestPublished}
			({m.estimated()} {formatTime(legTimes.latestPublished)})
		{/if}
	{:else}
		-
	{/if}
</p>

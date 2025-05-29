import {
	sourceLanguageTag,
	type AvailableLanguageTag,
	availableLanguageTags
} from '$paraglide/runtime';
import { env } from '$env/dynamic/public';
import { type OperationalFlight, savedFlights, type SavedFlights } from '../stores';
import { get } from 'svelte/store';
import type { components } from '../../air-france-klm-api';
import dayjs from 'dayjs';

/**
 * Returns the path in the given language, regardless of which language the path is in.
 */
export const route = (path: string, lang: AvailableLanguageTag | string) => {
	path = withoutLanguageTag(path);

	// Don't prefix the default language
	if (lang === sourceLanguageTag) return path;

	// Prefix all other languages
	return `/${lang}${path}`;
};

/**
 * Returns the path without the language tag
 */
const withoutLanguageTag = (path: string) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, maybeLang, ...rest] = path.split('/');
	if (availableLanguageTags.includes(maybeLang as AvailableLanguageTag)) {
		return `/${rest.join('/')}`;
	}
	return path;
};

export const stringArrayOrDash = (stringArray?: string[]): string => {
	return stringArray?.join(', ') ? stringArray.join(', ') : '-';
};

export const callAFKLMAPI = async (
	flightNo: string,
	lang: AvailableLanguageTag,
	date?: string
): Promise<components['schemas']['OperationalFlight'][]> => {
	const apiLang = lang === 'en' ? 'en-GB' : 'fr-FR';
	const carrierCode = (flightNo.match(/^[A-Z]{2,3}/) || [''])[0];
	const flightNumber = flightNo.replace(/^[A-Z]{2,3}/, '');

	let startRange;
	let endRange;

	if (date && dayjs(date).isValid()) {
		startRange = dayjs(date).startOf('day').toDate();
		endRange = dayjs(date).endOf('day').toDate();
	} else {
		startRange = dayjs().subtract(1, 'day').toDate();
		endRange = dayjs().add(3, 'day').toDate();
	}

	let operationalFlights: components['schemas']['OperationalFlight'][] = [];

	await fetch(
		`https://api.airfranceklm.com/opendata/flightstatus/?carrierCode=${carrierCode}&flightNumber=${flightNumber}&startRange=${
			startRange.toISOString().split('.')[0] + 'Z'
		}&endRange=${endRange.toISOString().split('.')[0] + 'Z'}`,
		{
			headers: new Headers({
				'accept-language': apiLang,
				'Api-Key': env.PUBLIC_AIRFRANCE_KLM_API_KEY ?? ''
			})
		}
	)
		.then((response) => response.json())
		.then((data) => {
			if (data.operationalFlights) {
				const previousVal: string[] = JSON.parse(
					localStorage.getItem('previousFlights') ?? '[]'
				).toReversed();
				if (!previousVal.includes(flightNo)) {
					localStorage.setItem(
						'previousFlights',
						JSON.stringify([...previousVal, flightNo].toReversed())
					);
				} else {
					localStorage.setItem(
						'previousFlights',
						JSON.stringify([...previousVal.filter((v) => v !== flightNo), flightNo].toReversed())
					);
				}
				const newFlights: SavedFlights[] = data.operationalFlights?.map((f: OperationalFlight) => {
					return {
						key: `${carrierCode}_${flightNumber}_${f.flightScheduleDate}`,
						flightData: f,
						lastUpdated: new Date(),
						lang: lang
					};
				});
				savedFlights.set([
					...get(savedFlights).filter((of) => !newFlights.map((nf) => nf.key).includes(of.key)),
					...newFlights
				]);
				operationalFlights = data.operationalFlights;
			}
		})
		.catch((error) => {
			console.error(error);
			return [];
		});

	return operationalFlights;
};

export const capitalizeEachWord = (str: string): string => {
	return str
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
};

export const displayCityWithCode = (city?: string, code?: string): string => {
	if (!city || !code) return '';
	return `${capitalizeEachWord(city)}, ${code.toUpperCase()}`;
};

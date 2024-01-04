import { type Writable } from 'svelte/store';
import type { components } from '../air-france-klm-api';
import { persisted } from 'svelte-persisted-store';

export type OperationalFlight = components['schemas']['OperationalFlight'];

export interface SavedFlights {
	key: string; // AirlineCode_FlightNumber_DD-MM-YYYY, ex: AF_349_03-01-2024
	flightData: OperationalFlight;
	lastUpdated: Date;
}
export const savedFlights: Writable<SavedFlights[]> = persisted('flights', []);

<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import * as m from '$paraglide/messages';
	import { setLanguageTag, sourceLanguageTag, type AvailableLanguageTag } from '$paraglide/runtime';
	import { route } from '$lib/helpers';

	//Use the default language if no language is given
	$: lang = ($page.params.lang as AvailableLanguageTag) ?? sourceLanguageTag;
	$: otherLang = lang === 'en' ? 'fr' : 'en';
	$: setLanguageTag(lang);
	$: currentRoute = $page.url.pathname;

	const applyActiveOrNot = (route: string, currentRoute: string): string => {
		return currentRoute.endsWith(route) || (route === '/' && currentRoute.replace(lang, '') === '/')
			? 'md:p-0 text-white bg-primary rounded md:bg-transparent md:text-primary'
			: 'md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary';
	};
</script>

{#key lang}
	<div class="h-dvh">
		<div class="flex flex-col pb-4 min-h-full mx-4">
			<nav class="bg-white border-gray-200">
				<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
					<a href="/{lang}" class="flex items-center space-x-3 rtl:space-x-reverse">
						<span class="self-center text-2xl font-semibold whitespace-nowrap">{m.app_title()}</span
						>
					</a>
					<input type="checkbox" id="menu-toggle" class="hidden" />
					<label
						for="menu-toggle"
						class="pointer-cursor inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
						aria-controls="navbar-default"
						aria-expanded="false"
					>
						<span class="sr-only">Open main menu</span>
						<svg
							class="w-5 h-5"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 17 14"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M1 1h15M1 7h15M1 13h15"
							/>
						</svg>
					</label>
					<div id="menu" class="hidden w-full md:block md:w-auto">
						<ul
							class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white"
						>
							<li>
								<a
									href="/{lang}"
									class="block py-2 px-3 {applyActiveOrNot('/', currentRoute)}"
									aria-current="page">{m.home()}</a
								>
							</li>
							<li>
								<a
									href="/{lang}/about"
									class="block py-2 px-3 {applyActiveOrNot('/about', currentRoute)}">{m.about()}</a
								>
							</li>
							<li>
								<a
									href={route($page.url.pathname, otherLang)}
									class="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary"
									hreflang={otherLang}>{otherLang.toUpperCase()}</a
								>
							</li>
						</ul>
					</div>
				</div>
			</nav>
			<div class="flex-1">
				<slot />
			</div>
			<div class="mt-8">
				<p>{m.footer_licensed_under()}</p>
				<p>{m.footer_contact()}</p>
			</div>
		</div>
	</div>
{/key}

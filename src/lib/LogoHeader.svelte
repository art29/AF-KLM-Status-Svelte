<script>
	import * as m from '$paraglide/messages.js';
	import logo from '$lib/assets/air-france-klm-logo.svg';
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-3xl font-semibold font-sans">
		{m.app_title()}
	</h1>
	<img class="max-h-6 w-auto" alt="Air-France KLM Logo" src={logo} />
</div>

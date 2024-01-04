<script lang="ts">
	import * as m from '$paraglide/messages';
</script>

<div class="flex flex-col mx-4 md:mx-[20%] gap-3">
	<h1 class="text-3xl font-semibold">{m.about()}</h1>
	<p>{m.about_info()}</p>
	<p>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html m.disclaimer()}
	</p>
	<p>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html m.contact_info()}
	</p>
</div>

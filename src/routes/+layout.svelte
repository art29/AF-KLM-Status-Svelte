<script lang="ts">
	import '../app.css';
</script>

<div class="h-dvh">
	<div class="flex flex-col py-4 min-h-full">
		<div>Header</div>
		<div class="flex-1">
			<slot />
		</div>
		<div>Footer</div>
	</div>
</div>

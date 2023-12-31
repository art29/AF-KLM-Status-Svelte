<script context="module">
	import Alert from './Alert.svelte';

	export const meta = {
		title: 'Alert',
		component: Alert
	};
</script>

<script>
	import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
	<Alert {...args}>This flight was delayed due to operational issues.</Alert>
</Template>

<Story name="Alert Danger" args={{ theme: 'danger' }} />

<Story name="Alert Danger Dismissible" args={{ theme: 'danger', dismissible: true }} />

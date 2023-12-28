<script context="module">
	import Button from './Button.svelte';

	export const meta = {
		title: 'Button',
		component: Button
	};
</script>

<script>
	import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
	<Button type="button" {...args}>Button</Button>
</Template>

<Story name="Primary" args={{ size: 'default', theme: 'primary' }} />

<Story name="Already Viewed" args={{ size: 'default', theme: 'viewed' }} />

<Story name="Secondary" args={{ size: 'default', theme: 'secondary' }} />

<Story name="Block Primary" args={{ size: 'block' }} />

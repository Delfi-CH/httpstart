<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
	const mode = import.meta.env.MODE;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{#if mode === "development"}
		<link rel="stylesheet" href="/bootstrap.min.css"/>
	{:else}
		<link rel="stylesheet" href="/ui/bootstrap.min.css"/>
	{/if}
	</svelte:head>

<Navbar></Navbar>

{@render children()}

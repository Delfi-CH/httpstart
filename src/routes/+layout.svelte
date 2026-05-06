<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import "bootswatch/dist/united/bootstrap.min.css"
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Navbar></Navbar>

{@render children()}

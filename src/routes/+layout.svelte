<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
    import { Distribution } from '$lib/data';
    let { data, children } = $props();

	const mode = import.meta.env.MODE;

	const getDistro = () => data.distro.distro
	const distro = getDistro();
	const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	let cssUrl = "/ui/css/light/bootstrap.min.css"

	if (mode === "development" && distro === Distribution.Ubuntu) {
		cssUrl = "/css/ubuntu/bootstrap.min.css"
	} else if (mode === "development" && darkMode) {
		cssUrl = "/css/dark/bootstrap.min.css"
	} else if (mode === "development") {
		cssUrl = "/css/light/bootstrap.min.css"
	} else if (distro === Distribution.Ubuntu) {
		cssUrl = "/ui/css/ubuntu/bootstrap.min.css"
	} else if (darkMode) {
		cssUrl = "/ui/css/dark/bootstrap.min.css"
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href={cssUrl}/>
</svelte:head>

<Navbar></Navbar>

{@render children()}

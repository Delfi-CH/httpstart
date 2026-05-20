<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import Footer from "$lib/components/Footer.svelte";
	import Navbar from "$lib/components/Navbar.svelte";
	import { Distribution } from "$lib/data";
	import { Container } from "@sveltestrap/sveltestrap";

	let { data, children } = $props();

	const mode = import.meta.env.MODE;

	const getDistro = () => data.distro.distro;
	const distro = getDistro();
	let darkMode = $state(
		window.matchMedia("(prefers-color-scheme: dark)").matches,
	);
	let cssUrl = $state("/ui/css/light/bootstrap.min.css");

	if (mode === "development" && distro === Distribution.Ubuntu) {
		cssUrl = "/css/ubuntu/bootstrap.min.css";
	} else if (mode === "development" && darkMode) {
		cssUrl = "/css/light/bootstrap.min.css";
	} else if (mode === "development") {
		cssUrl = "/css/light/bootstrap.min.css";
	} else if (distro === Distribution.Ubuntu) {
		cssUrl = "/ui/css/ubuntu/bootstrap.min.css";
	} else if (darkMode) {
		cssUrl = "/ui/css/light/bootstrap.min.css";
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href={cssUrl} />
</svelte:head>

<Container class="d-flex flex-column min-vh-100 p-0" fluid>
	<Navbar></Navbar>

	<div class="flex-grow-1">
		{@render children()}
	</div>

	<Footer></Footer>
</Container>

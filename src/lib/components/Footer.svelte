<script lang="ts">
    import { onMount } from "svelte";
    import axios from "axios";
    import { Distribution, httpstartVersion } from "$lib/data";
    import { Container} from "@sveltestrap/sveltestrap";

    let distro = $state(Distribution.Other)
    const currentDate = new Date()

    onMount(async () => {
        const mode = import.meta.env.MODE;

        let serverURL = "";
        if (mode === "development") {
            serverURL = "http://localhost:29222";
        }

        const tmpDistro = (await axios.get(serverURL + "/api/distro")).data;
        distro = tmpDistro.distro

    });
</script>

<Container class="bg-primary" fluid>
    <p>{distro} Network Installer via <a href="https://github.com/Delfi-CH/httpstart" target="_blank" class="text-white">httpstart</a> v{httpstartVersion}, © Delfi-CH 2026-{currentDate.getFullYear()}</p>
</Container>

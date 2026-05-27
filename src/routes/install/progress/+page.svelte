<script lang="ts">
    import { onMount } from "svelte";
    import axios from "axios";
    import { Data } from "$lib/data"
    import DynamicTerminal from "svelte-htmshell/dynamic";

    let serverURL = $state("");
    let data = $state(Data.load());

    let showTerminal = $state(false)

    onMount(() => {
        data = Data.load();
        const mode = import.meta.env.MODE;

        if (mode === "development") {
            serverURL = "http://localhost:29222";
        }
    });

    onMount(async()=>{
        await axios.post(serverURL + "/api/install", {
            data,
        });
        showTerminal = true
    })
</script>

{#if showTerminal}<DynamicTerminal url={serverURL + "/api/shell"}></DynamicTerminal>{/if}
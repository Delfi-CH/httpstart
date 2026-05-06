<script lang="ts">
    import { onMount } from "svelte";
    import { Data } from "$lib/data";
    import '@bootstrap-wc/components';
    import langs from "$lib/data/langs.json"

    let serverURL = $state("/")
    let data = $state(Data.load())
    onMount(()=>{
        const mode = import.meta.env.MODE
        if (mode === "development") {
            serverURL = "http://localhost:29222/"
        }
        data = Data.load()
        console.log(data.language)
    })
</script>
<main>
    <h1>linux-web-install</h1>
    <bs-card heading="Langauge & Keymap">
        <p>Language: 
            {#if data.language === "-- Select a Language --"}
                <span class="text-danger">No Language selected!</span>
            {:else}
                {Object.entries(langs).find((x)=> x[0] === data.language)?.[1]}
            {/if}
        </p>
        <p>Keymap: {data.keymap}</p>
    </bs-card>
    <bs-card>gamer</bs-card>
    <bs-card>gamer</bs-card>
    <bs-card>gamer</bs-card>
    <bs-card>gamer</bs-card>
</main>
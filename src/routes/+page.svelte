<script lang="ts">
    import { onMount } from "svelte";
    import { Data } from "$lib/data";
    import '@bootstrap-wc/components';
    import langs from "$lib/data/langs.json"
    import { resolve } from "$app/paths";

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
<main class="container">
<div class="row">
    <h1>linux-web-install</h1>
    <bs-card heading="Langauge" class="bg-dark text-white m-3 col">
        <p>Language: 
            {#if data.language === "-- Select a Language --" || data.language === undefined || data.language === null || data.language === ""}
                <span class="text-danger text-underline" style="text-decoration: underline;">No Language selected!</span>
            {:else}
                {Object.entries(langs).find((x)=> x[0] === data.language)?.[1]}
            {/if}
        </p>
        <bs-button href={resolve("/lang")}>Edit</bs-button>
    </bs-card>
    <bs-card heading="Location & Timezone" class="bg-dark text-white m-3 col">
        <p>text</p>
        <bs-button href={resolve("/timezone")}>Edit</bs-button>
    </bs-card>
    <bs-card heading="Disks" class="bg-dark text-white m-3 col">
        <p>text</p>
        <bs-button href={resolve("/disks")}>Edit</bs-button>
    </bs-card>
    </div>
    <div class="row">
    <bs-card heading="Additional Software" class="bg-dark text-white m-3 col">
        <p>text</p>
        <bs-button href={resolve("/packages")}>Edit</bs-button>
    </bs-card>
    <bs-card heading="Users" class="bg-dark text-white m-3 col">
        <p>Hostname: 
            {#if data.hostname === undefined || data.hostname === null || data.hostname === ""}
                <span class="text-danger text-underline" style="text-decoration: underline;">No Hostname set!</span>
            {:else}
                {data.hostname}
            {/if}
        </p>
        <bs-button href={resolve("/users")}>Edit</bs-button>
    </bs-card>
    <bs-card heading="Finish" class="bg-dark text-white m-3 col">
        <bs-button href={resolve("/install")} variant="danger">Continiue</bs-button>
    </bs-card>
    </div>
</main>
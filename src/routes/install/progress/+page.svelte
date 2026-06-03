<script lang="ts">
    import { ProgressObject } from "$lib/data";
    import { onMount } from "svelte";
    import { Progress } from "@sveltestrap/sveltestrap";

    let serverURL = $state("");
    let progress: ProgressObject = $state(new ProgressObject("No Progress", 0, false))

    onMount(()=>{
        const mode = import.meta.env.MODE;

        if (mode === "development") {
            serverURL = "http://localhost:29222";
        }

        const sse = new EventSource(serverURL + "/api/install/progress")

        sse.onmessage = (event) => {
            console.log(JSON.parse(event.data))
        }
    })
</script>

<p>{progress.name}</p>
<Progress animated={true} color="primary" bind:value={progress.progress}></Progress>
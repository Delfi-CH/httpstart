<script lang="ts">
    import { onMount } from "svelte";
    import axios from "axios";
    import { Data } from "$lib/data"

    let serverURL = $state("");
    let data = $state(Data.load());

    onMount(() => {
        data = Data.load();
        const mode = import.meta.env.MODE;

        if (mode === "development") {
            serverURL = "http://localhost:29222";
        }
        axios.post(serverURL + "/api/install", {
            data,
        });
    });
</script>

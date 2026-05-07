<script lang="ts">
    import timezones from "$lib/data/timezones.json";
    import { onMount } from "svelte";
    import { Label, Input } from "@sveltestrap/sveltestrap";
    import { Data } from "$lib/data";

    const tzarray = Object.entries(timezones);
    let selectedTimezone = $state("")
    
    onMount(()=>{
        const data = Data.load()
        selectedTimezone = data.timezone
    })

    function handleTimezoneChange(e: any) {
        let tmpTimezone = e.target.value
        if (tmpTimezone.startsWith("Other/")) {
            tmpTimezone = tmpTimezone.replace("Other/", "")
        }
        selectedTimezone = tmpTimezone
        const data = Data.load()
        data.timezone = selectedTimezone
        data.save()
    }
</script>

<main>
    <h1>Location & Timezone</h1>
    <Label for="tzselect">Select your Timezone
        <Input type="select" id="tzselect" onchange={handleTimezoneChange} value={selectedTimezone}>
            <option value="">-- Select a Timezone --</option>
            {#each tzarray as tzgroup (tzgroup)}
                <optgroup label={tzgroup[0]}>
                    {#each tzgroup as tzs, index (index)}
                        {#each tzs as tz, index (index)}
                            {#if tz.length > 2}
                                <option value={tzgroup[0] + "/" + tz}
                                    >{tz}</option
                                >
                            {/if}
                        {/each}
                    {/each}
                </optgroup>
            {/each}
        </Input>
    </Label>
</main>

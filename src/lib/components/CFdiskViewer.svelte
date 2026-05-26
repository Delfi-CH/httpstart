<script lang="ts">
    import DynamicTerminal from "svelte-htmshell/dynamic";
    import { Input, Button, Label } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";
    import axios from "axios";

    let selectedDisk = $state("");
    let disks: Array<{
        name: string,
        size: string
    }> = $state([]);
    let serverURL = $state("");
    let openTerminal = $state(false);

    onMount(async () => {
        const mode = import.meta.env.MODE;

        if (mode === "development") {
            serverURL = "http://localhost:29222";
        }

        const tmpDisks = await axios.get(serverURL + "/api/disks");
        disks = tmpDisks.data.blockdevices;
        console.log(tmpDisks.data.blockdevices);
    });
</script>

<h4>Terminal Partition Editor</h4>
<div class="d-flex gap-2 align-items-center">
    <Label for="diskselect">Select a disk</Label>
    <Input type="select" id="diskselect" bind:value={selectedDisk} class="w-75" valid={selectedDisk === "" ? false : true} invalid={selectedDisk === "" ? true : false}>
        {#each disks as disk (disk.name)}
            <option value={"/dev/" + disk.name}
                >{"/dev/" + disk.name} ({disk.size})</option
            >
        {/each}
    </Input>
    <Button
        onclick={() => {
            if (selectedDisk !== "" && openTerminal === false) {
                openTerminal = true;
            } else {
                openTerminal = false
            }
        }}>Open Editor</Button
    >
</div>
{#if openTerminal}
    <div>
        <DynamicTerminal
            url={serverURL + "/api/shell"}
            binary="su"
            onClose={() => (openTerminal = false)}
            args={["root", "-c", `bash -c 'cfdisk ${selectedDisk}'`]}
        ></DynamicTerminal>
    </div>
{/if}

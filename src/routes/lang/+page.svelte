<script lang="ts">
    import { Data } from "$lib/data";
    import langs from "$lib/data/langs.json";
    import { onMount } from "svelte";
    import '@bootstrap-wc/components';

    const langValues = Object.entries(langs)

    let selectedLang = $state("")
    let selectedKeymap = $state("")

    onMount(()=>{
        const data = Data.load()
        selectedLang = data.language 
        selectedKeymap = data.keymap
    })

    function onLanguageChange(e: any) {
        selectedLang = e.target.value
        let data = Data.load()
        data.language = $state.snapshot(selectedLang)
        data.save()
    }

    function onKeymapChange(e: any) {

    }
</script>
<main>
    <h1>lang</h1>
    <h2>Language</h2>
    <bs-select onchange={onLanguageChange} value={selectedLang}>
        <option selected={selectedLang === ""}>-- Select a Language --</option>
        {#each langValues as lang (lang) }
            <option value={lang[0]} selected={selectedLang === lang[0]}>{lang[1]}</option>
        {/each}
    </bs-select>
</main>
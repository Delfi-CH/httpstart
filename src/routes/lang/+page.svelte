<script lang="ts">
    import { Data } from "$lib/data";
    import langs from "$lib/data/langs.json";
    import { onMount } from "svelte";
    import {
        Input,
        Label,
        Container,
        Row,
        Col,
    } from "@sveltestrap/sveltestrap";

    const langValues = Object.entries(langs);

    let selectedLang = $state("");

    onMount(() => {
        const data = Data.load();
        selectedLang = data.language;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onLanguageChange(e: any) {
        selectedLang = e.target.value;
        let data = Data.load();
        data.language = $state.snapshot(selectedLang);
        data.save();
    }
</script>

<main>
    <Container>
        <h1>Language</h1>
        <Row>
            <Col>
                <Label for="langselect"
                    >Select your Language
                    <Input
                        type="select"
                        onchange={onLanguageChange}
                        bind:value={selectedLang}
                        id="langselect"
                    >
                        <option value="">-- Select a Language --</option>
                        {#each langValues as lang (lang)}
                            <option
                                value={lang[0]}
                                selected={selectedLang === lang[0]}
                                >{lang[1]}</option
                            >
                        {/each}
                    </Input>
                </Label>
            </Col>
        </Row>
    </Container>
</main>

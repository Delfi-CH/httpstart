<script lang="ts">
    import { onMount } from "svelte";
    import { Container, Row, Col } from "@sveltestrap/sveltestrap";
    import { TimeZoneSelect } from "@aredridel/svelte-timezone-map-select";
    import { Data } from "$lib/data";

    let selectedTimezone = $state("");

    onMount(() => {
        const data = Data.load();
        selectedTimezone = data.timezone;
    });

    $effect(() => {
        const data = Data.load();
        data.timezone = selectedTimezone;
        data.save();
    });
</script>

<main>
    <Container>
        <h1>Location & Timezone</h1>
        <Row>
            <Col>
                <div class="zonemap">
                    <TimeZoneSelect bind:timezone={selectedTimezone}
                    ></TimeZoneSelect>
                </div>
                <p>Selected Timezone: {selectedTimezone}</p>
            </Col>
        </Row>
    </Container>
</main>

<style>
    .zonemap {
        background-color: #006994f0;
    }
</style>

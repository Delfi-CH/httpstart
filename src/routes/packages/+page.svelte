<script lang="ts">
    import { Distribution, PackageRepository, Package } from "$lib/data";
    import { Container, Row, Col, Label, Input } from "@sveltestrap/sveltestrap";
    import axios from "axios";
    import { onMount } from "svelte";

    let serverURL = $state("");
    let packages: Array<Package> = $state([])
    let repos: Array<PackageRepository> = $state([]);
    let disto = $state(Distribution.Other)

    onMount(()=>{
        const mode = import.meta.env.MODE;
        if (mode === "development") {
            serverURL = "http://localhost:29222";
        }
    })

    onMount(async()=>{
        const tmpDistro = await axios.get(serverURL + "/api/distro");
        disto = tmpDistro.data.distro
        const tmpRepos = await axios.get(serverURL + "/api/pkg/repos");
        repos = tmpRepos.data
    })
</script>
<main>
    <Container>
    <h1>packages</h1>
    <Row>
        <Col>            
            {#each repos as repo (repo.name)}
            <div class="d-flex gap-2 align-items-center">
                <Input type="checkbox" bind:checked={repo.enabled}></Input><Label>{repo.name}</Label>
            </div>
            {/each}
        </Col>
    </Row>
    </Container>
</main>
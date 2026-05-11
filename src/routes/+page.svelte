<script lang="ts">
    import { onMount } from "svelte";
    import { Data } from "$lib/data";
    import langs from "$lib/data/langs.json";
    import { resolve } from "$app/paths";
    import {
        Container,
        Row,
        Col,
        Card,
        CardBody,
        CardHeader,
        Button,
        CardTitle,
    } from "@sveltestrap/sveltestrap";

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let serverURL = $state("/");
    let data = $state(Data.load());
    let allIsOk = $state(false)

    let check1 = $state(false)
    let check2 = $state(false)
    let check3 = $state(false)
    let check4 = $state(false)
    let check5a = $state(false)
    let check5b = $state(false)

    onMount(() => {
        const mode = import.meta.env.MODE;
        if (mode === "development") {
            serverURL = "http://localhost:29222/";
        }
        data = Data.load();
    });

    onMount(() => {
        data = Data.load();
        check1 = !(data.language === "-- Select a Language --" || data.language === undefined || data.language === null || data.language === "")
        check2 = !(data.timezone === undefined || data.timezone === null || data.timezone === "")
        check3 = true
        check4 = true
        check5a = (data.users.length < 1)
        check5b = !(data.hostname === undefined || data.hostname === null || data.hostname === "")
        if (check1 && check2 && check3 && check4 && check5a && check5b) {
            allIsOk = true
        } else {
            allIsOk = false
        }
    })
</script>

<Container>
    <Row>
        <h1>linux-web-install</h1>
        <Col class="d-flex mt-3 mb-3">
            <Card color="dark" theme="dark" class="m-1 h-100 w-100">
                <CardHeader>
                    <CardTitle>Language {#if check1}✔️{:else}❌{/if}</CardTitle>
                </CardHeader>
                <CardBody class="d-flex flex-column">
                    <p>
                        Language:
                        {#if data.language === "-- Select a Language --" || data.language === undefined || data.language === null || data.language === ""}
                            <span
                                class="text-danger text-underline"
                                style="text-decoration: underline;"
                                >No Language selected!</span
                            >
                        {:else}
                            {Object.entries(langs).find(
                                (x) => x[0] === data.language,
                            )?.[1]}
                        {/if}
                    </p>
                    <Button class="mt-auto w-50" href={resolve("/lang")}>Edit</Button>
                </CardBody>
            </Card>
        </Col>
        <Col class="d-flex mt-3 mb-3">
            <Card color="dark" theme="dark" class="m-1 h-100 w-100">
                <CardHeader>
                    <CardTitle>Location & Timezone {#if check2}✔️{:else}❌{/if}</CardTitle>
                </CardHeader>
                <CardBody class="d-flex flex-column">
                    <p>Timezone: 
                    {#if data.timezone === undefined || data.timezone === null || data.timezone === ""}
                        <span
                            class="text-danger text-underline"
                            style="text-decoration: underline;"
                        > 
                        No timezone selected!   
                        </span>
                    {:else}
                        {data.timezone}
                    {/if}
                    </p>
                    <Button class="mt-auto w-50" href={resolve("/timezone")}>Edit</Button>
                </CardBody>
            </Card>
        </Col>
        <Col class="d-flex mt-3 mb-3">
            <Card color="dark" theme="dark" class="m-1 h-100 w-100">
                <CardHeader>
                    <CardTitle>Additional Software {#if check3}✔️{:else}❌{/if}</CardTitle>
                </CardHeader>
                <CardBody class="d-flex flex-column">
                    <p>text</p>
                    <Button class="mt-auto w-50" href={resolve("/packages")}>Edit</Button>
                </CardBody>
            </Card>
        </Col>
    </Row>
    <Row>
        <Col class="d-flex mt-3 mb-3">
            <Card color="dark" theme="dark" class="m-1 h-100 w-100">
                <CardHeader>
                    <CardTitle>Disks {#if check4}✔️{:else}❌{/if}</CardTitle>
                </CardHeader>
                <CardBody class="d-flex flex-column">
                    <p>text</p>
                    <Button class="mt-auto w-50" href={resolve("/disks")}>Edit</Button>
                </CardBody>
            </Card>
        </Col>
        <Col class="d-flex mt-3 mb-3">
            <Card color="dark" theme="dark" class="m-1 h-100 w-100">
                <CardHeader>
                    <CardTitle>Users & Hostname {#if check5a && check5b}✔️{:else}❌{/if}</CardTitle>
                </CardHeader>
                <CardBody class="d-flex flex-column">
                    <p>Users : 
                        {#if data.users.length < 1}
                            <span
                                class="text-danger text-underline"
                                style="text-decoration: underline;"
                                >No Users created!</span
                            >
                        {:else}
                            {#each data.users as user, index (index)}
                                {user.username}
                                <span> </span>
                            {/each}
                        {/if}
                    </p>
                    <p>
                        Hostname:
                        {#if data.hostname === undefined || data.hostname === null || data.hostname === ""}
                            <span
                                class="text-danger text-underline"
                                style="text-decoration: underline;"
                                >No Hostname set!</span
                            >
                        {:else}
                            {data.hostname}
                        {/if}
                    </p>
                    <Button class="mt-auto w-50" href={resolve("/users")}>Edit</Button>
                </CardBody>
            </Card>
        </Col>
        <Col class="d-flex mt-3 mb-3">
            <Card color="dark" theme="dark" class="m-1 h-100 w-100">
                <CardHeader>
                    <CardTitle>Finish</CardTitle>
                </CardHeader>
                <CardBody class="d-flex flex-column">
                    {#if !allIsOk}
                        <span class="text-danger text-underline" style="text-decoration: underline;">
                            One or more steps is not sucessfully completed!
                        </span>
                    {:else}
                        <span class="text-success text-underline" style="text-decoration: underline;">
                            All steps completed sucessfully.
                        </span>
                    {/if}
                    <Button class="mt-auto w-50" href={resolve("/install")} color="danger" disabled={!allIsOk}
                        >Continiue</Button
                    >
                </CardBody>
            </Card>
        </Col>
    </Row>
</Container>

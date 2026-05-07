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
    onMount(() => {
        const mode = import.meta.env.MODE;
        if (mode === "development") {
            serverURL = "http://localhost:29222/";
        }
        data = Data.load();
        console.log(data.language);
    });
</script>

<Container>
    <Row>
        <h1>linux-web-install</h1>
        <Col>
            <Card color="dark" theme="dark" class="m-1">
                <CardHeader>
                    <CardTitle>Language</CardTitle>
                </CardHeader>
                <CardBody>
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
                    <Button href={resolve("/lang")}>Edit</Button>
                </CardBody>
            </Card>
        </Col>
        <Col>
            <Card color="dark" theme="dark" class="m-1">
                <CardHeader>
                    <CardTitle>Location & Timezone</CardTitle>
                </CardHeader>
                <CardBody>
                    <p>text</p>
                    <Button href={resolve("/timezone")}>Edit</Button>
                </CardBody>
            </Card>
        </Col>
        <Col>
            <Card color="dark" theme="dark" class="m-1">
                <CardHeader>
                    <CardTitle>Additional Software</CardTitle>
                </CardHeader>
                <CardBody>
                    <p>text</p>
                    <Button href={resolve("/packages")}>Edit</Button>
                </CardBody>
            </Card>
        </Col>
    </Row>
    <Row>
        <Col>
            <Card color="dark" theme="dark" class="m-1">
                <CardHeader>
                    <CardTitle>Disks</CardTitle>
                </CardHeader>
                <CardBody>
                    <p>text</p>
                    <Button href={resolve("/disks")}>Edit</Button>
                </CardBody>
            </Card>
        </Col>
        <Col>
            <Card color="dark" theme="dark" class="m-1">
                <CardHeader>
                    <CardTitle>Users & Hostname</CardTitle>
                </CardHeader>
                <CardBody>
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
                    <Button href={resolve("/users")}>Edit</Button>
                </CardBody>
            </Card>
        </Col>
        <Col>
            <Card color="dark" theme="dark" class="m-1">
                <CardHeader>
                    <CardTitle>Finish</CardTitle>
                </CardHeader>
                <CardBody>
                    <Button href={resolve("/install")} color="danger"
                        >Continiue</Button
                    >
                </CardBody>
            </Card>
        </Col>
    </Row>
</Container>

<script>
    import { Container, Row, Col } from "@sveltestrap/sveltestrap";
    import Terminal from "svelte-htmshell";
    import { onMount } from "svelte";

    let serverURL = $state("");
    onMount(() => {
        const mode = import.meta.env.MODE;
        if (mode === "development") {
            serverURL = "http://localhost:29222";
        }
    })
</script>

<Container>
    <Row>
        <h1>Terminal</h1>
        <Col>
            <Terminal url={serverURL + "/api/shell"} binary="bash" rows={35} cols={120}></Terminal>
        </Col>
    </Row>
</Container>
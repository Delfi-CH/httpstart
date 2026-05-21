<script>
    import { Container, Row, Col, Button } from "@sveltestrap/sveltestrap";
    import Terminal from "svelte-htmshell";
    import { onMount } from "svelte";
    import { blur } from "svelte/transition";

    let serverURL = $state("");
    let showTerminal = $state(true)
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
            {#if showTerminal}
                <div transition:blur={{
                    delay: 400,
                    duration: 400
                }}><Terminal url={serverURL + "/api/shell"} binary="bash" rows={35} cols={120} onClose={()=> showTerminal = false}></Terminal></div>
            {/if}
            {#if !showTerminal}
                <div transition:blur={{
                    delay: 400,
                    duration: 400
                }}><Button onclick={()=> showTerminal = true}>Restart Terminal</Button></div>
            {/if}
        </Col>
    </Row>
</Container>
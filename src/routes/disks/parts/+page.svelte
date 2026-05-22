<script lang="ts">
    import { Container, Row, Col, Button } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";
    import axios from "axios";
    import { resolve } from "$app/paths";
    import DynamicTerminal from "svelte-htmshell/dynamic";
    import { slide } from "svelte/transition";

    let ipaddr = $state({ip: "0.0.0.0"})
    let serverURL = $state("");
    let showTerminal = $state(false)

    onMount(async ()=>{
        const mode = import.meta.env.MODE;
        if (mode === "development") {
            serverURL = "http://localhost:29222";
        }
        const tmpIpaddr = await axios.get(serverURL +"/api/ipadrr")
        ipaddr = tmpIpaddr.data
    })
</script>

<Container>
    <Row>
        <h1>Partition Editor</h1>
        <h2><a href={resolve("/disks")}>Go Back</a></h2>
        <Col>
            <p>Currently, there is no built-in partition editor.</p>
            <p>To partition the disks, log into your remote machine via <strong>ssh {ipaddr.ip}</strong> or the built-in terminal and do it manually and running a program like <strong>cfdisk</strong></p>
            <p>For more info, see the <a href="https://wiki.archlinux.org/title/Partitioning" target="_blank">Arch Linux Wiki on Partitioning</a></p>
            <Button onclick={()=> showTerminal = !showTerminal}>{showTerminal ? "Hide" : "Show"} Terminal</Button>
            {#if showTerminal}
                <div transition:slide={{
                    axis: "x",
                    duration: 700
                }}><DynamicTerminal url={serverURL + "/api/shell"} binary="bash" onClose={()=> showTerminal = false}></DynamicTerminal></div>
            {/if}
        </Col>
    </Row>
</Container>
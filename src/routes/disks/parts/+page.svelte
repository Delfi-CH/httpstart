<script lang="ts">
    import { Container, Row, Col } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";
    import axios from "axios";
    import { resolve } from "$app/paths";
    import CFdiskViewer from "$lib/components/CFdiskViewer.svelte";

    let ipaddr = $state({ip: "0.0.0.0"})
    let serverURL = $state("");

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
            <p>There are multiple ways to partition the disks.</p>
            <ul>
                <li>Option 1: Use the built-in Terminal Partition Editor based on <strong>cfdisk</strong>.</li>
                <li>Option 2: Login into the remote machine via <strong>ssh {ipaddr.ip}</strong> and partiton the disks manually.</li>
            </ul>
            <p>For more info, see the <a href="https://wiki.archlinux.org/title/Partitioning" target="_blank">Arch Linux Wiki on Partitioning</a></p>
            <CFdiskViewer></CFdiskViewer>
        </Col>
    </Row>
</Container>
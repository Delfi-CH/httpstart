<script lang="ts">
    import { Container, Row, Col } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";
    import axios from "axios";
    import { resolve } from "$app/paths";

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
            <p>Currently, there is no partition editor.</p>
            <p>To partition the disks, log into your remote machine and do it manually</p>
            <p>This can be done via <strong>ssh {ipaddr.ip}</strong>, then running a program like <strong>cfdisk</strong></p>
            <p>For more info, see the <a href="https://wiki.archlinux.org/title/Partitioning" target="_blank">Arch Linux Wiki on Partitioning</a></p>
        </Col>
    </Row>
</Container>
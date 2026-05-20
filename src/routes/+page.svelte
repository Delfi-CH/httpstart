<script lang="ts">
    import { onMount } from "svelte";
    import { Data, User, Disk, DiskType } from "$lib/data";
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
    import axios from "axios";

    let serverURL = $state("");
    let data = $state(Data.load());
    let allIsOk = $state(false)

    let userValidationErrorMsg = $state("")
    let diskValidationErrorMsg = $state("")
    let diskValidationWarnMsg = $state("")

    let check1 = $state(false)
    let check2 = $state(false)
    let check3 = $state(false)
    let check4 = $state(false)
    let check5a = $state(false)
    let check5b = $state(false)
    
    let ipaddr = $state({ip: "0.0.0.0"})

    onMount(async () => {
        const mode = import.meta.env.MODE;
        if (mode === "development") {
            serverURL = "http://localhost:29222";
        }
        data = Data.load();
        const tmpDistro = await axios.get(serverURL +"/api/distro")
        data.distro = tmpDistro.data.distro

        data.save()

        const tmpIpaddr = await axios.get(serverURL +"/api/ipadrr")
        ipaddr = tmpIpaddr.data
    });

    onMount(() => {
        data = Data.load();
        check1 = !(data.language === "-- Select a Language --" || data.language === undefined || data.language === null || data.language === "")
        check2 = !(data.timezone === undefined || data.timezone === null || data.timezone === "")
        check3 = true
        check4 = validateDisks($state.snapshot(data.disks))
        check5a = validateUsers($state.snapshot(data.users))
        check5b = !(data.hostname === undefined || data.hostname === null || data.hostname === "")
        if (check1 && check2 && check3 && check4 && check5a && check5b) {
            allIsOk = true
        } else {
            allIsOk = false
        }
    })

    function validateUsers(users: Array<User>): boolean {
        if (users.length < 1) {
            userValidationErrorMsg = "No users created!"
            return false
        }
        const e = users.map(validateSingleUser)
        if (e.includes(false)) {
            userValidationErrorMsg = "Username or passwords missing!"
            return false
        }

        if (users.length === 1 && users[0].username === "root") {
            userValidationErrorMsg = "The root account cannot be the only account!"
            return false
        }
        userValidationErrorMsg = ""
        return true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function validateSingleUser(obj: any) {
        if (
            obj.username !== "" &&
            obj.password !== ""
        ) {return true} else {
            return false
        }
    }

    function validateDisks(disks: Array<Disk>) {
        if (!disks.some((d)=> d.type == DiskType.root)) {
            diskValidationWarnMsg = ""
            diskValidationErrorMsg = "No root Partition set!"
            return false
        } else if (!disks.some((d)=> d.type == DiskType.efi)) {
            diskValidationWarnMsg = "No EFI Boot Partition set!"
            return true
        } else if (!disks.some((d)=> d.type == DiskType.swap)) {
            diskValidationWarnMsg = "No SWAP Partition set!"
            return true
        } else if (!disks.some((d)=> d.type == DiskType.home)) {
            diskValidationWarnMsg = "No Home Partition set!"
            return true
        } else {
            diskValidationErrorMsg = "Big error"
            return true
        }
        
    }
</script>

<Container>
    <Row>
        <h1>{data.distro} Network Installer at {ipaddr.ip}</h1>
        <Col class="d-flex mt-3 mb-3">
            <Card color="dark" theme="dark" class="m-1 h-100 w-100">
                <CardHeader class={check1 ? "bg-success":"bg-danger"}>
                    <CardTitle>Language</CardTitle>
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
                <CardHeader class={check2 ? "bg-success":"bg-danger"}>
                    <CardTitle>Location & Timezone</CardTitle>
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
                <CardHeader class={check3 ? "bg-success":"bg-danger"}>
                    <CardTitle>Additional Software</CardTitle>
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
                <CardHeader class={check4 ? "bg-success":"bg-danger"}>
                    <CardTitle>Disks</CardTitle>
                </CardHeader>
                <CardBody class="d-flex flex-column">
                    {#if check4}
                        <p>Disks:</p>
                        <div>
                            {#each data.disks as disk, index (index)}
                            <p>{disk.name}, {disk.filesystem} ({disk.mountpoints.join(",")})</p>
                            {/each}
                        </div>
                        <p class="text-warning">{diskValidationWarnMsg}</p>
                    {:else}
                        <p class="text-danger">{diskValidationErrorMsg}</p>
                    {/if}
                    <Button class="mt-auto w-50" href={resolve("/disks")}>Edit</Button>
                </CardBody>
            </Card>
        </Col>
        <Col class="d-flex mt-3 mb-3">
            <Card color="dark" theme="dark" class="m-1 h-100 w-100">
                <CardHeader class={check5a && check5b ? "bg-success":"bg-danger"}>
                    <CardTitle>Users & Hostname</CardTitle>
                </CardHeader>
                <CardBody class="d-flex flex-column">
                    <p>Users: 
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
                    {#if !check5a}
                        <p class="text-warning">{userValidationErrorMsg}</p>
                    {/if}
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
                <CardHeader  class={check1 && check2 && check3 && check4 && check5a && check5b ? "bg-success":"bg-danger"}>
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
